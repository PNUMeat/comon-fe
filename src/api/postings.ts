import { isDevMode } from '@/utils/cookie.ts';

import apiInstance from '@/api/apiInstance';
import { createPostMock, mutatePostMock } from '@/api/mocks.ts';
import { ServerResponse } from '@/api/types';

type PostingMutationArg = {
  teamId: number;
  articleTitle: string;
  articleBody: string;
  images: File[] | null; // presigned
};

type PostingMutationResp = {
  articleId: number;
};

// TODO presigned url 요청할 때 요청 부분 타입 정의
type PostingPresignItemArg = {
  fileName: string;
  contentType: string;
};

// TODO presigned url 요청 시 응답 받을 때 data 부분 타입 정의
type PostingPresignItemResp = {
  fileName: string;
  presignedUrl: string;
  contentType: string;
};

type PostingPresignBatchResp = {
  items: PostingPresignItemResp[];
};

type ImageCategory = 'ARTICLE' | 'PROFILE' | 'TEAM' | 'TEAM_RECRUIT';

const pickContentType = (f: File) =>
  f.type && f.type.length > 0 ? f.type : 'application/octet-stream';

const toPublicUrlFromPresigned = (presignedUrl: string) =>
  presignedUrl.split('?')[0];

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

  const requests: PostingPresignItemArg[] = images.map((f) => ({
    fileName: f.name,
    contentType: pickContentType(f),
  }));

  const presignResp = await apiInstance.post<
    ServerResponse<PostingPresignBatchResp>
  >('v1/image/presigned-url', {
    requests,
    imageCategory: 'ARTICLE' as ImageCategory,
  });

  const items = presignResp.data.data.items;

  await Promise.all(
    items.map((item, i) =>
      fetch(item.presignedUrl, {
        method: 'PUT',
        headers: { 'Content-Type': pickContentType(images[i]) },
        body: images[i],
      }).then((res) => {
        if (!res.ok) throw new Error(`S3 PUT failed: ${res.status}`);
      })
    )
  );

  if (isDevMode()) {
    await new Promise((r) => setTimeout(r, 1000));
    return createPostMock.data;
  }

  const imageUrls = items.map((it) =>
    toPublicUrlFromPresigned(it.presignedUrl)
  );

  const res = await apiInstance.post<ServerResponse<PostingMutationResp>>(
    'v1/article',
    {
      teamId,
      title: articleTitle,
      body: articleBody,
      images: imageUrls,
    }
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
  const formData = new FormData();

  formData.append('teamId', teamId.toString());
  formData.append('articleId', articleId.toString());
  formData.append('articleTitle', articleTitle);
  formData.append('articleBody', articleBody);
  if (images) {
    images.forEach((img) => {
      // formData.append('images', img);
      formData.append('image', img);
    });
  }
  // else {
  //   formData.append('images', '');
  // }

  if (isDevMode()) {
    await new Promise((r) => setTimeout(r, 1000));
    return mutatePostMock.data;
  }

  const res = await apiInstance.put<ServerResponse<PostingMutationResp>>(
    `v1/articles/${articleId}`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return res.data.data;
};

export const deletePost = async (articleId: number) => {
  const res = await apiInstance.delete(`v1/articles/${articleId}`);

  return res.data;
};
