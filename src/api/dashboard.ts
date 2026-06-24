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

export type DayOfWeek =
  | 'MONDAY'
  | 'TUESDAY'
  | 'WEDNESDAY'
  | 'THURSDAY'
  | 'FRIDAY'
  | 'SATURDAY'
  | 'SUNDAY';

export interface IWeeklyGrassDay {
  dayOfWeek: DayOfWeek;
  count: number; // 그 요일의 풀이 글 수(원시값, 캡 없음)
}

export interface IDashboardResponse {
  teamName: string;
  nDays: number;
  joinedAt: string; // YYYY-MM-DD
  imageUrl: string | null;
  memberName: string;
  description: string;
  weeklySolvedDays: number; // 이번주 출석일수 A (A>B 가능, 클램핑 금지)
  consecutiveSolveCount: number;
  cumulativeSolveCount: number;
  weeklyGrass: IWeeklyGrassDay[]; // 항상 월→일 순서로 7개
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
  const res = await apiInstance.get<ServerResponse<IArticlesByDateResponse>>(
    `/v1/articles/${teamId}/by-date`,
    { params: { date, page } }
  );

  return res.data.data;
};

export const getTeamDashboard = async (
  teamId: number
): Promise<IDashboardResponse> => {
  const res = await apiInstance.get<ServerResponse<IDashboardResponse>>(
    `/v1/teams/${teamId}/dashboard`
  );

  return res.data.data;
};

export const getTeamTopic = async (
  teamId: number,
  date: string
): Promise<ITopicResponse> => {
  const res = await apiInstance.get<ServerResponse<ITopicResponse>>(
    `/v1/articles/teams/${teamId}/subjects`,
    { params: { date } }
  );

  return res.data.data;
};

export type ProblemStep = 'STEP1' | 'STEP2' | 'STEP3' | 'STEP4';
export type Platform = 'BAEKJOON' | 'PROGRAMMERS' | 'LEETCODE';

export interface IRecommendationProblem {
  step: ProblemStep;
  platform: Platform;
  title: string;
  url: string;
}

export const getRecommendations = async (
  teamId: number,
  date: string
): Promise<IRecommendationProblem[]> => {
  const res = await apiInstance.get<ServerResponse<IRecommendationProblem[]>>(
    `/v1/teams/${teamId}/recommendations`,
    { params: { date } }
  );

  return res.data.data;
};
