import { isDevMode } from '@/utils/cookie';

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

const createMockTeamInfo = (teamId: number): ITeamInfo => ({
  teamId,
  teamName: '코몬 4DAYS',
  teamExplain: '매주 월요일부터 목요일까지 꾸준히 코딩테스트 문제를 풀어요.',
  topic: '코딩테스트',
  memberLimit: 8,
  memberCount: 4,
  streakDays: 12,
  imageUrl: '',
  imgUrl: '',
  createdAt: '2026-01-05',
  teamRecruitId: null,
  teamAnnouncement: '이번 주도 목표한 문제를 함께 풀어봐요!',
  totalSolveCount: 4500,
  members: [
    {
      memberName: '개발자 김철수',
      imageUrl: '',
      memberExplain: '꾸준히 성장하는 개발자입니다.',
      uuid: 'mock-member-1',
    },
  ],
});

const createMockSolvedDates = (year: number, month: number): string[] => {
  const today = new Date();
  const monthStart = new Date(year, month - 1, 1);
  if (monthStart > today) return [];

  const lastDay = new Date(year, month, 0).getDate();
  const isCurrentMonth =
    year === today.getFullYear() && month === today.getMonth() + 1;
  const upperDay = isCurrentMonth ? today.getDate() : lastDay;

  return Array.from({ length: upperDay }, (_, index) => index + 1)
    .filter((day) => {
      const weekday = new Date(year, month - 1, day).getDay();
      const isFourDaysSchedule = weekday >= 1 && weekday <= 4;
      return (isFourDaysSchedule && day % 3 !== 0) || day % 11 === 0;
    })
    .map(
      (day) =>
        `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    );
};

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
    const solvedDates = createMockSolvedDates(year, month);
    return {
      myTeamResponse: createMockTeamInfo(teamId),
      teamManager: false,
      subjectArticleDateAndTagResponses: solvedDates.map((subjectDate) => ({
        subjectDate,
        articleCategory: '스터디 복습',
      })),
    };
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
  page: number,
  size?: number
): Promise<IArticlesByDateResponse> => {
  if (isDevMode()) {
    const mockArticles: IArticle[] = [
      {
        articleId: 1001,
        articleTitle: '오늘의 추천 문제 풀이',
        articleBody: '<p>투 포인터를 활용해 시간 복잡도를 줄였습니다.</p>',
        createdDate: `${date}T20:10:00`,
        imageUrl: null,
        memberName: '개발자 김철수',
        memberImage: '',
        isAuthor: true,
      },
      {
        articleId: 1002,
        articleTitle: '다른 접근 방법도 정리해봤어요',
        articleBody: '<p>해시 맵을 사용한 풀이와 비교해봤습니다.</p>',
        createdDate: `${date}T21:30:00`,
        imageUrl: null,
        memberName: '코몬 QA',
        memberImage: '',
        isAuthor: false,
      },
    ];
    const pageSize = size ?? 6;
    const start = page * pageSize;
    return {
      content: mockArticles.slice(start, start + pageSize),
      page: {
        size: pageSize,
        number: page,
        totalElements: mockArticles.length,
        totalPages: Math.ceil(mockArticles.length / pageSize),
      },
    };
  }

  const res = await apiInstance.get<ServerResponse<IArticlesByDateResponse>>(
    `/v1/articles/${teamId}/by-date`,
    { params: { date, page, ...(size && { size }) } }
  );

  return res.data.data;
};

export const getTeamDashboard = async (
  teamId: number
): Promise<IDashboardResponse> => {
  if (isDevMode()) {
    return {
      teamName: '코몬 4DAYS',
      nDays: 4,
      joinedAt: '2026-01-05',
      imageUrl: null,
      memberName: '개발자 김철수',
      description:
        '매주 월요일부터 목요일까지, 일주일에 네 번 꾸준히 코딩테스트 문제를 풀어 실력을 쌓고자 합니다^^',
      weeklySolvedDays: 3,
      consecutiveSolveCount: 12,
      cumulativeSolveCount: 4500,
      weeklyGrass: [
        { dayOfWeek: 'MONDAY', count: 3 },
        { dayOfWeek: 'TUESDAY', count: 1 },
        { dayOfWeek: 'WEDNESDAY', count: 2 },
        { dayOfWeek: 'THURSDAY', count: 2 },
        { dayOfWeek: 'FRIDAY', count: 0 },
        { dayOfWeek: 'SATURDAY', count: 0 },
        { dayOfWeek: 'SUNDAY', count: 0 },
      ],
    };
  }

  const res = await apiInstance.get<ServerResponse<IDashboardResponse>>(
    `/v1/teams/${teamId}/dashboard`
  );

  return res.data.data;
};

export const getTeamTopic = async (
  teamId: number,
  date: string
): Promise<ITopicResponse> => {
  if (isDevMode()) {
    return {
      articleId: 901,
      articleCategory: '스터디',
      articleTitle: '오늘의 코딩테스트 문제',
      articleBody:
        '<p>배열과 투 포인터를 활용해 제한 시간 안에 해결해 보세요.</p>',
      createdDate: `${date}T09:00:00`,
      imageUrl: null,
      authorName: '코몬 운영진',
      authorImageUrl: '',
    };
  }

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

// 월간 캘린더 풀이 체크박스: 해당 월에 내가 풀이를 작성한 날짜(YYYY-MM-DD) 목록 (멤버 전용)
export const getSolvedDates = async (
  teamId: number,
  year: number,
  month: number
): Promise<string[]> => {
  if (isDevMode()) {
    return createMockSolvedDates(year, month);
  }

  const res = await apiInstance.get<ServerResponse<string[]>>(
    `/v1/teams/${teamId}/solved-dates`,
    { params: { year, month } }
  );

  return res.data.data;
};

export const getRecommendations = async (
  teamId: number,
  date: string
): Promise<IRecommendationProblem[]> => {
  if (isDevMode()) {
    return [
      {
        step: 'STEP1',
        platform: 'BAEKJOON',
        title: '두 수의 합',
        url: 'https://www.acmicpc.net/problem/3273',
      },
      {
        step: 'STEP2',
        platform: 'PROGRAMMERS',
        title: '완주하지 못한 선수',
        url: 'https://school.programmers.co.kr/learn/courses/30/lessons/42576',
      },
      {
        step: 'STEP3',
        platform: 'BAEKJOON',
        title: '수 고르기',
        url: 'https://www.acmicpc.net/problem/2230',
      },
      {
        step: 'STEP4',
        platform: 'LEETCODE',
        title: 'Two Sum',
        url: 'https://leetcode.com/problems/two-sum/',
      },
    ];
  }

  const res = await apiInstance.get<ServerResponse<IRecommendationProblem[]>>(
    `/v1/teams/${teamId}/recommendations`,
    { params: { date } }
  );

  return res.data.data;
};
