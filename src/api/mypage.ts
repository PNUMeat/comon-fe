import { isDevMode } from '@/utils/cookie.ts';

import apiInstance from '@/api/apiInstance';
import { myArticlesMock, myPageTeamMock } from '@/api/mocks.ts';
import { ServerResponse } from '@/api/types';

export type TeamAbstraction = {
  teamId: number;
  teamName: string;
  teamManager: boolean;
  registerDate: string | null;
};

export const queryMyTeamInfo = async () => {
  if (isDevMode()) {
    return myPageTeamMock.data;
  }

  const res =
    await apiInstance.get<ServerResponse<TeamAbstraction[]>>(
      `v1/teams/my-page`
    );

  return res.data.data;
};

export type MyArticle = {
  articleId: number;
  articleTitle: string;
  articleBody: string;
  createdDate: string;
  // TODO: 이미지 하나 허용으로 롤백
  // imageUrls: string[] | null;
  imageUrl: string | null;
  memberName: string;
  memberImage: string;
};

export type MyPagePagination = {
  size: number;
  number: number;
  totalElements: number;
  totalPages: number;
};

export type MyArticleResponse = {
  content: MyArticle[];
  page: MyPagePagination;
};

export const queryMyArticles = async (teamId: number, page: number) => {
  if (isDevMode()) {
    return myArticlesMock.data;
  }

  const res = await apiInstance.get<ServerResponse<MyArticleResponse>>(
    `v1/articles/${teamId}/my-page`,
    { params: { page } }
  );
  return res.data.data;
};
