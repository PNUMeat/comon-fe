import { Title } from '@/components/commons/Title';

import { ReactNode } from 'react';

import calendar from '@/assets/TeamDashboard/calendar.svg';
import crown from '@/assets/TeamJoin/crown.png';
import msg from '@/assets/TeamRecruit/message.svg';

// 원래 path.tsx 폴더 안에 같이 관리했으나, react-refresh/only-export-components 자꾸 뜸
export const getTitle = (path: string): ReactNode => {
  if (path.startsWith('/team-dashboard')) {
    return <Title src={calendar} title="팀 페이지" />;
  }

  if (path.startsWith('/team-admin')) {
    return <Title src={calendar} title="팀 페이지 관리" />;
  }

  if (path.startsWith('/my-dashboard')) {
    return <Title src={calendar} title="마이페이지" />;
  }

  if (path.startsWith('/team-setting')) {
    return <Title src={crown} title="팀 설정" />;
  }

  if (path.startsWith('/team-recruit/posting')) {
    return <Title src={calendar} title="팀 모집글 작성" />;
  }

  const staticTitles: Record<string, ReactNode> = {
    '/login': <Title src={crown} title="로그인" />,
    '/enroll': <Title src={crown} title="프로필 생성" />,
    '/modification': <span>👑 프로필 수정</span>,
    '/team-registration': <Title src={crown} title="팀 생성" />,
    '/team-recruit/list': <Title src={msg} title="팀 모집" />,
  };

  return staticTitles[path];
};
