import apiInstance from '@/api/apiInstance';
import {
  getImagePresignedUrl,
  getPublicUrlFromPresigned,
  uploadManyWithPresigned,
} from '@/api/image';
import { ServerResponse } from '@/api/types';

type PostingMutationArg = {
  teamId: number;
  articleTitle: string;
  articleBody: string;
  images: File[] | null;
};

type PostingMutationResp = {
  articleId: number;
};

export const createPost = async ({
  teamId,
  articleTitle,
  articleBody,
  images,
}: PostingMutationArg) => {
  let imageUrls: string[] | undefined;

  if (images && images.length > 0) {
    const presignedList = await getImagePresignedUrl({
      files: images,
      category: 'ARTICLE',
    });

    await uploadManyWithPresigned({ presignedList, files: images });
    const urls = getPublicUrlFromPresigned(presignedList);
    imageUrls = urls;
  }

  const body = {
    teamId,
    articleTitle,
    articleBody,
    images: imageUrls,
  };

  const res = await apiInstance.post<ServerResponse<PostingMutationResp>>(
    '/v1/articles',
    body
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
  let imageUrls: string[] | undefined;

  if (images && images.length > 0) {
    const presignedList = await getImagePresignedUrl({
      files: images,
      category: 'ARTICLE',
    });

    await uploadManyWithPresigned({ presignedList, files: images });
    const urls = getPublicUrlFromPresigned(presignedList);
    imageUrls = urls;
  }

  const body = {
    teamId,
    articleTitle,
    articleBody,
    images: imageUrls,
  };

  const res = await apiInstance.put<ServerResponse<PostingMutationResp>>(
    `v1/articles/${articleId}`,
    body
  );

  return res.data.data;
};

export const deletePost = async (articleId: number) => {
  const res = await apiInstance.delete(`v1/articles/${articleId}`);

  return res.data;
};
