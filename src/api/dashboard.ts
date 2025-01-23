import { isDevMode } from '@/utils/cookie.ts';

import { teamArticlesMock } from '@/api/mocks.ts';

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
  imageUrls: string[] | null;
  memberName: string;
  memberImage: string;
  isAuthor: boolean;
}

export const isIArticle = (obj: unknown): obj is IArticle => {
  if (typeof obj !== 'object' || obj === null) return false;

  const article = obj as Record<string, unknown>;

  return (
    typeof article.articleId === 'number' &&
    typeof article.articleTitle === 'string' &&
    typeof article.articleBody === 'string' &&
    typeof article.createdDate === 'string' &&
    (article.imageUrls === null ||
      (Array.isArray(article.imageUrls) &&
        article.imageUrls.every((url) => typeof url === 'string'))) &&
    typeof article.memberName === 'string' &&
    typeof article.memberImage === 'string' &&
    typeof article.isAuthor === 'boolean'
  );
};

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
  imageUrls: string[] | null;
  authorName: string;
  authorImageUrl: string;
}

export const isITopicResponse = (obj: unknown): obj is ITopicResponse => {
  if (typeof obj !== 'object' || obj === null) return false;

  const topic = obj as Record<string, unknown>;

  return (
    typeof topic.articleId === 'number' &&
    typeof topic.articleCategory === 'string' &&
    typeof topic.articleTitle === 'string' &&
    typeof topic.articleBody === 'string' &&
    typeof topic.createdDate === 'string' &&
    (topic.imageUrls === null ||
      (Array.isArray(topic.imageUrls) &&
        topic.imageUrls.every((url) => typeof url === 'string'))) &&
    typeof topic.authorName === 'string' &&
    typeof topic.authorImageUrl === 'string'
  );
};

export const getTeamInfoAndTags = async (
  teamId: number,
  year: number,
  month: number
): Promise<ITeamInfoAndTagsResponse> => {
  // if (isDevMode()) {
  //   await new Promise((r) => setTimeout(r, 1000));
  //
  //   return teamInfoMock.data;
  // }

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
  // if (isDevMode()) {
  //   return subjectMock.data;
  // }

  const res = await apiInstance.get<ServerResponse<ITopicResponse>>(
    `/v1/articles/teams/${teamId}/subjects`,
    { params: { date } }
  );

  return res.data.data;
};
