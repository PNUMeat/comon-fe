import { ReactNode } from 'react';

export const PATH = {
  HOME: '/',
  LOGIN: '/login',
  ENROLL: '/enroll',
  TEAM_REGISTRATION: '/team-registration',
  TEAM_MODIFICATION: '/team-modification',
  TEAM_DASHBOARD: '/team-dashboard',
} as const;

export const TITLES: Record<string, ReactNode> = {
  '/login': <span>🔑 로그인</span>,
  '/enroll': <span>👑 프로필 생성</span>,
  '/team-registration': <span>👑 팀 생성</span>,
  '/team-modification': <span>👑 팀 수정</span>,
};
