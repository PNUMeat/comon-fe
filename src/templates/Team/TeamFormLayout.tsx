import { ComonFormGrid } from '@/components/commons/Form/ComonFormGrid';
import { ComonFormTitle } from '@/components/commons/Form/ComonFormTitle';
import { Spacer } from '@/components/commons/Spacer';
import { HeightInNumber } from '@/components/types';

import { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

import { FORM_TITLES, PATH } from '@/routes/path';
import { TeamModificationButton } from '@/templates/Team/TeamModificationButton';
import { TeamRegistrationButton } from '@/templates/Team/TeamRegistrationButton';
import styled from '@emotion/styled';

const TeamContainer = styled.div<HeightInNumber>`
  height: ${(props) => props.h}px;
  display: flex;
  padding: 66px 87px 77px 87px;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
`;

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
      <Spacer h={99} />
      {isOnTeamReg && <TeamRegistrationButton />}
      {isOnTeamMod && <TeamModificationButton />}
    </TeamContainer>
  );
};
