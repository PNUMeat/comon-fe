import { ReactNode } from 'react';

export const PATH = {
  home: '/',
  login: '/login',
} as const;

export const TITLES: Record<string, ReactNode> = {
  '/login': <span>🔑 로그인</span>,
};
