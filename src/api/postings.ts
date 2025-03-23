import { isDevMode } from '@/utils/cookie.ts';

import apiInstance from '@/api/apiInstance';
import { createPostMock, mutatePostMock } from '@/api/mocks.ts';
import { ServerResponse } from '@/api/types';

type PostingMutationArg = {
  teamId: number;
  articleTitle: string;
  articleBody: string;
  // images: File[] | null;
};

type PostingMutationResp = {
  articleId: number;
};

export const createPost = async ({
  teamId,
  articleTitle,
  articleBody,
  // images,
}: PostingMutationArg) => {
  // const formData = new FormData();

  // formData.append('teamId', teamId.toString());
  // formData.append('articleTitle', articleTitle);
  // formData.append('articleBody', articleBody);
  // if (images) {
  //   images.forEach((img) => {
  //     // formData.append('images', img);
  //     formData.append('image', img);
  //   });
  // }

  if (isDevMode()) {
    await new Promise((r) => setTimeout(r, 1000));
    return createPostMock.data;
  }

  const res = await apiInstance.post<ServerResponse<PostingMutationResp>>(
    'v1/articles',
    {
      teamId,
      articleTitle,
      articleBody,
    }
  );

  return res.data.data;
};

export const mutatePost = async ({
  teamId,
  articleTitle,
  articleBody,
  articleId,
}: PostingMutationArg & {
  articleId: number;
}) => {
  if (isDevMode()) {
    await new Promise((r) => setTimeout(r, 1000));
    return mutatePostMock.data;
  }

  const res = await apiInstance.post<ServerResponse<PostingMutationResp>>(
    'v1/articles',
    {
      teamId,
      articleId,
      articleTitle,
      articleBody,
    }
  );

  return res.data.data;
};

export const deletePost = async (articleId: number) => {
  const res = await apiInstance.delete(`v1/articles/${articleId}`);

  return res.data;
};
