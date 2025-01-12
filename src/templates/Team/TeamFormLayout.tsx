import { ComonFormGrid } from '@/components/commons/Form/ComonFormGrid';
import { ComonFormTitle } from '@/components/commons/Form/ComonFormTitle';
import { Spacer } from '@/components/commons/Spacer';
import { HeightInNumber } from '@/components/types';

import { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

import { PATH } from '@/routes/path';
import { TeamModificationButton } from '@/templates/Team/TeamModificationButton';
import { TeamRegistrationButton } from '@/templates/Team/TeamRegistrationButton';
import styled from '@emotion/styled';
import { breakpoints } from '@/constants/breakpoints';

const TeamContainer = styled.div<HeightInNumber>`
  height: ${(props) => props.h}px;
  display: flex;
  padding: 66px 87px 77px 87px;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  
  @media (max-width: ${breakpoints.mobile}px) {
    padding: 0;
  }
`;

// 원래 path.tsx 폴더 안에 같이 관리했으나, react-refresh/only-export-components 자꾸 뜸
const FORM_TITLES: Record<
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

export const TeamFormLayout: React.FC<
  HeightInNumber & {
    children: ReactNode;
  }
> = ({ h, children }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { title, subtitle } = FORM_TITLES[currentPath];
  const isOnTeamReg = currentPath === PATH.TEAM_REGISTRATION;
  const isOnTeamMod = currentPath === PATH.TEAM_MODIFICATION;

  return (
    //   <form>의 onSubmit을 통해서 입력 값을 전달 받을 것이였으면 사용자 값들을 전역 상태로 만들면 안됐다.
    <TeamContainer h={h}>
      <ComonFormTitle title={title} subtitle={subtitle} />
      <Spacer h={78} />
      <ComonFormGrid h={683}>{children}</ComonFormGrid>
      <Spacer h={120} />
      {isOnTeamReg && <TeamRegistrationButton />}
      {isOnTeamMod && <TeamModificationButton />}
    </TeamContainer>
  );
};
