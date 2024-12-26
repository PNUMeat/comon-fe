import { ReactNode } from 'react';

// 원래 path.tsx 폴더 안에 같이 관리했으나, react-refresh/only-export-components 자꾸 뜸
export const getTitle = (path: string): ReactNode => {
  if (path.startsWith('/team-dashboard')) {
    return <span>🗓️ 팀 페이지</span>;
  }

  if (path.startsWith('/team-admin')) {
    return <span>🎂 팀 페이지 관리</span>;
  }

  const staticTitles: Record<string, ReactNode> = {
    '/login': <span>🔑 로그인</span>,
    '/enroll': <span>👑 프로필 생성</span>,
    '/modification': <span>👑 프로필 수정</span>,
    '/team-registration': <span>👑 팀 생성</span>,
    '/team-modification': <span>👑 팀 수정</span>,
  };

  return staticTitles[path];
};
