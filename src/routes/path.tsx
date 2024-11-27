import { ReactNode } from 'react';

export const PATH = {
  HOME: '/',
  LOGIN: '/login',
  ENROLL: '/enroll',
  TEAM_DASHBOARD: '/team-dashboard',
} as const;

export const TITLES: Record<string, ReactNode> = {
  '/login': <span>🔑 로그인</span>,
  '/enroll': <span>👑 프로필 생성</span>,
};
