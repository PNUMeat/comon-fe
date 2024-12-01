import { ReactNode } from 'react';

export const PATH = {
  HOME: '/',
  LOGIN: '/login',
  ENROLL: '/enroll',
  PROFILE: '/profile',
  TEAM_REGISTRATION: '/team-registration',
  TEAM_MODIFICATION: '/team-modification',
  TEAM_DASHBOARD: '/team-dashboard',
  TEAM_CALENDAR: '/team-calendar',
} as const;

export const TITLES: Record<string, ReactNode> = {
  '/login': <span>🔑 로그인</span>,
  '/enroll': <span>👑 프로필 생성</span>,
  '/modification': <span>👑 프로필 수정</span>,
  '/team-registration': <span>👑 팀 생성</span>,
  '/team-modification': <span>👑 팀 수정</span>,
  '/team-calendar': <span>🗓️ 팀 캘린더</span>,
};

export const FORM_TITLES: Record<
  string,
  {
    title: string;
    subtitle: string;
  }
> = {
  '/team-registration': {
    title: '팀 정보 입력하기',
    subtitle: '팀 생성 후에도 모든 정보를 수정할 수 있어요',
  },
  '/team-modification': {
    title: '팀 정보 수정하기',
    subtitle: '저장 후에도 모든 정보를 수정할 수 있어요',
  },
};
