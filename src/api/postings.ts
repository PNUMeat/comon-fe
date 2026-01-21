import apiInstance from '@/api/apiInstance';
import { API_BASE_URL } from '@/api/config';
import { ServerResponse } from '@/api/types';

import { uploadImages } from './image';

type PostingMutationArg = {
  teamId: number;
  articleTitle: string;
  articleBody: string;
  images: File[] | null;
};

type PostingMutationResp = {
  articleId: number;
};

type StreamHandler = {
  onMessage: (chunk: string) => void;
  onError?: () => void;
};

export const createPost = async ({
  teamId,
  articleTitle,
  articleBody,
  images,
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

export const getStartArticleFeedbackStream = (
  articleId: number,
  handlers: StreamHandler
) => {
  const es = new EventSource(
    `${API_BASE_URL}/api/v1/articles/${articleId}/feedback/stream`,
    { withCredentials: true }
  );

  es.onmessage = (event) => {
    try {
      const parsed = JSON.parse(event.data);
      handlers.onMessage(parsed.content);
    } catch (err) {
      console.log(err);
    }
  };

  es.onerror = () => {
    handlers.onError?.();
    es.close();
  };

  return es;
};
