import { ReactNode } from 'react';

export const PATH = {
  home: '/',
  login: '/login',
  enroll: '/enroll',
} as const;

export const TITLES: Record<string, ReactNode> = {
  '/login': <span>🔑 로그인</span>,
  '/enroll': <span>👑 프로필 생성</span>,
};
