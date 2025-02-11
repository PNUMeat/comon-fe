import { isDevMode } from '@/utils/cookie.ts';

import { subjectMock, teamArticlesMock, teamInfoMock } from '@/api/mocks.ts';

import apiInstance from './apiInstance';
import { ITeamInfo } from './team';
import { ServerResponse } from './types';

export interface ICalendarTag {
  subjectDate: string;
  articleCategory: string;
}

export interface ITeamInfoAndTagsResponse {
  myTeamResponse: ITeamInfo;
  teamManager: boolean;
  subjectArticleDateAndTagResponses: ICalendarTag[];
}

export interface IArticle {
  articleId: number;
  articleTitle: string;
  articleBody: string;
  createdDate: string;
  // TODO: 이미지 하나 허용으로 롤백
  // imageUrls: string[] | null;
  imageUrl: string | null;
  memberName: string;
  memberImage: string;
  isAuthor: boolean;
}

export interface IArticlesByDateResponse {
  content: IArticle[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
}

export interface ITopicResponse {
  articleId: number;
  articleCategory: string;
  articleTitle: string;
  articleBody: string;
  createdDate: string;
  // TODO: 이미지 하나 허용으로 롤백
  // imageUrls: string[] | null;
  imageUrl: string | null;
  authorName: string;
  authorImageUrl: string;
}

export const getTeamInfoAndTags = async (
  teamId: number,
  year: number,
  month: number
): Promise<ITeamInfoAndTagsResponse> => {
  if (isDevMode()) {
    await new Promise((r) => setTimeout(r, 1000));

    return teamInfoMock.data;
  }

  const res = await apiInstance.get<ServerResponse<ITeamInfoAndTagsResponse>>(
    `/v1/teams/${teamId}/team-page`,
    { params: { year, month } }
  );

  return res.data.data;
};

export const getArticlesByDate = async (
  teamId: number,
  date: string,
  page: number
): Promise<IArticlesByDateResponse> => {
  if (isDevMode()) {
    return teamArticlesMock.data;
  }

  const res = await apiInstance.get<ServerResponse<IArticlesByDateResponse>>(
    `/v1/articles/${teamId}/by-date`,
    { params: { date, page } }
  );

  return res.data.data;
};

export const getTeamTopic = async (
  teamId: number,
  date: string
): Promise<ITopicResponse> => {
  if (isDevMode()) {
    return subjectMock.data;
  }

  const res = await apiInstance.get<ServerResponse<ITopicResponse>>(
    `/v1/articles/teams/${teamId}/subjects`,
    { params: { date } }
  );

  return res.data.data;
};
