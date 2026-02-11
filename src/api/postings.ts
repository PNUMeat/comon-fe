import apiInstance from '@/api/apiInstance';
import { API_BASE_URL } from '@/api/config';
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

export type StreamMessage =
  | { type: 'PROCESSING'; content: string }
  | { type: 'DONE' };

export type StreamHandler = {
  onMessage: (message: StreamMessage) => void;
  onError?: () => void;
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
      const parsed = JSON.parse(event.data) as StreamMessage;
      handlers.onMessage(parsed);
    } catch (err) {
      console.error('Invalid SSE message', err);
    }
  };

  es.onerror = () => {
    handlers.onError?.();
    es.close();
  };

  return es;
};

export const getArticleFeedback = async (articleId: number) => {
  const res = await apiInstance.get<ServerResponse<{ feedbackBody: string }>>(
    `/v1/articles/${articleId}/feedback`
  );

  return res.data;
};

interface CommentItem {
  commentId: number;
  description: string;
  memberId: number | null;
  memberName: string | null;
  memberProfileImageUrl: string | null;
  createdAt: string;
  isDeleted: boolean;
}

interface CommentsResponse {
  comments: CommentItem[];
}

export const getArticleComments = async (articleId: number) => {
  const res = await apiInstance.get<ServerResponse<CommentsResponse>>(
    `/v1/articles/${articleId}/comments`
  );
  return res.data;
};

export const createArticleComment = async (
  articleId: number,
  { description }: { description: string }
) => {
  const res = await apiInstance.post<ServerResponse<{ commentId: number }>>(
    `/v1/articles/${articleId}/comments`,
    { description }
  );
  return res.data;
};

export const mutateArticleComment = async (
  articleId: number,
  commentId: number,
  { description }: { description: string }
) => {
  const res = await apiInstance.patch<ServerResponse<{ commentId: number }>>(
    `/v1/articles/${articleId}/comments/${commentId}`,
    { description }
  );
  return res.data;
};

export const deleteArticleComment = async (
  articleId: number,
  commentId: number
) => {
  const res = await apiInstance.delete<ServerResponse<null>>(
    `/v1/articles/${articleId}/comments/${commentId}`
  );
  return res.data;
};
