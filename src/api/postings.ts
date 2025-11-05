import apiInstance from '@/api/apiInstance';
import { ImageCategory, ServerResponse } from '@/api/types';

type PostingMutationArg = {
  teamId: number;
  articleTitle: string;
  articleBody: string;
  images: File[] | null;
};

type PostingMutationResp = {
  articleId: number;
};

type FileItem = { fileName: string; contentType: string };

type PresignItem = FileItem & { presignedUrl: string };

type PostingPresignBatchArg = {
  requests: FileItem[];
  imageCategory: ImageCategory;
};

type PostingPresignBatchResp = { items: PresignItem[] };

const pickContentType = (f: File) =>
  f.type && f.type.length > 0 ? f.type : 'application/octet-stream';

const toPublicUrlFromPresigned = (presignedUrl: string) =>
  presignedUrl.split('?')[0];

export async function getPresignedUrls(
  files: File[],
  imageCategory: ImageCategory
): Promise<PresignItem[]> {
  const requests: FileItem[] = files.map((f) => ({
    fileName: f.name,
    contentType: pickContentType(f),
  }));

  const res = await apiInstance.post<ServerResponse<PostingPresignBatchResp>>(
    'v1/image/presigned-url',
    {
      requests,
      imageCategory,
    } satisfies PostingPresignBatchArg
  );

  return res.data.data.items;
}

export async function uploadWithPresigned(
  presigns: PresignItem[],
  files: File[]
): Promise<void> {
  await Promise.all(
    presigns.map((item, i) =>
      fetch(item.presignedUrl, {
        method: 'PUT',
        headers: { 'Content-Type': pickContentType(files[i]!) },
        body: files[i]!,
      }).then((r) => {
        if (!r.ok) throw new Error(`S3 PUT failed: ${r.status}`);
      })
    )
  );
}

export function makePublicUrls(presigns: PresignItem[]): string[] {
  return presigns.map((it) => toPublicUrlFromPresigned(it.presignedUrl));
}

export const createPost = async ({
  teamId,
  articleTitle,
  articleBody,
  images,
}: PostingMutationArg) => {
  if (!images || images.length === 0) {
    const noImgArticleResp = await apiInstance.post<
      ServerResponse<PostingMutationResp>
    >('v1/article', {
      teamId,
      title: articleTitle,
      body: articleBody,
      images: [],
    });
    return noImgArticleResp.data.data;
  }

  const presigns = await getPresignedUrls(images, 'ARTICLE');
  await uploadWithPresigned(presigns, images);

  // if (isDevMode()) {
  //   await new Promise((r) => setTimeout(r, 1000));
  //   return createPostMock.data;
  // }

  const imageUrls = makePublicUrls(presigns);

  const res = await apiInstance.post<ServerResponse<PostingMutationResp>>(
    'v1/article',
    { teamId, title: articleTitle, body: articleBody, images: imageUrls }
  );
  return res.data.data;
};

export const mutatePost = async ({
  teamId,
  articleTitle,
  articleBody,
  images,
  articleId,
}: PostingMutationArg & {
  articleId: number;
}) => {
  const imageUrls =
    images && images.length > 0
      ? makePublicUrls(await getPresignedUrls(images, 'ARTICLE'))
      : [];

  const res = await apiInstance.put<ServerResponse<PostingMutationResp>>(
    `v1/articles/${articleId}`,
    {
      teamId,
      title: articleTitle,
      body: articleBody,
      images: imageUrls,
    }
  );

  return res.data.data;
};

export const deletePost = async (articleId: number) => {
  const res = await apiInstance.delete(`v1/articles/${articleId}`);

  return res.data;
};
