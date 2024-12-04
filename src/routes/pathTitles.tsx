import { ReactNode } from 'react';

// 원래 path.tsx 폴더 안에 같이 관리했으나, react-refresh/only-export-components 자꾸 뜸
export const TITLES: Record<string, ReactNode> = {
  '/login': <span>🔑 로그인</span>,
  '/enroll': <span>👑 프로필 생성</span>,
  '/modification': <span>👑 프로필 수정</span>,
  '/team-registration': <span>👑 팀 생성</span>,
  '/team-modification': <span>👑 팀 수정</span>,
  '/team-calendar': <span>🗓️ 팀 캘린더</span>,
};
