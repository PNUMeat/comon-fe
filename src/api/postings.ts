import apiInstance from '@/api/apiInstance';
import { ServerResponse } from '@/api/types';

type PostingMutationArg = {
  teamId: number;
  articleTitle: string;
  articleBody: string;
  image: File | null;
};

type PostingMutationResp = {
  articleId: number;
};

export const createPost = async ({
  teamId,
  articleTitle,
  articleBody,
  image,
}: PostingMutationArg) => {
  const formData = new FormData();

  formData.append('teamId', teamId.toString());
  formData.append('articleTitle', articleTitle);
  formData.append('articleBody', articleBody);
  if (image) {
    formData.append('image', image);
  }

  const res = await apiInstance.post<ServerResponse<PostingMutationResp>>(
    'v1/articles',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return res.data.data;
};

export const mutatePost = async ({
  teamId,
  articleTitle,
  articleBody,
  image,
  articleId,
}: PostingMutationArg & {
  articleId: number;
}) => {
  const formData = new FormData();

  formData.append('teamId', teamId.toString());
  formData.append('articleId', articleId.toString());
  formData.append('articleTitle', articleTitle);
  formData.append('articleBody', articleBody);
  if (image) {
    formData.append('image', image);
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
