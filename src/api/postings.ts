import apiInstance from '@/api/apiInstance';
import { ServerResponse } from '@/api/types';

import { uploadImages } from './image';

type PostingMutationArg = {
  teamId: number;
  articleTitle: string;
  articleBody: string;
  images: File[] | null;
  isVisible: boolean;
};

type PostingMutationResp = {
  articleId: number;
};

export const createPost = async ({
  teamId,
  articleTitle,
  articleBody,
  images,
  isVisible,
}: PostingMutationArg) => {
  let imageUrls: string[] | undefined;

  if (images && images.length > 0) {
    const uploadedUrls = await uploadImages({
      files: images,
      category: 'ARTICLE',
    });
    imageUrls = uploadedUrls;
  }

  const body = {
    teamId,
    articleTitle,
    articleBody,
    images: imageUrls,
    isVisible,
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
  isVisible,
}: PostingMutationArg & {
  articleId: number;
}) => {
  let imageUrls: string[] | undefined;

  if (images && images.length > 0) {
    const uploadedUrls = await uploadImages({
      files: images,
      category: 'ARTICLE',
    });
    imageUrls = uploadedUrls;
  }

  const body = {
    teamId,
    articleTitle,
    articleBody,
    images: imageUrls,
    isVisible,
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
