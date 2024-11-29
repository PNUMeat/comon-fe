import { ComonFormGrid } from '@/components/commons/Form/ComonFormGrid';
import { ComonFormTitle } from '@/components/commons/Form/ComonFormTitle';
import { Spacer } from '@/components/commons/Spacer';
import { HeightInNumber } from '@/components/types';

import { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

import { FORM_TITLES } from '@/routes/path';
import { TeamSubmitButton } from '@/templates/Team/TeamSubmitButton';
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

  return (
    <TeamContainer h={h}>
      <ComonFormTitle title={title} subtitle={subtitle} />
      <Spacer h={78} />
      <ComonFormGrid h={683}>{children}</ComonFormGrid>
      <Spacer h={99} />
      <TeamSubmitButton />
    </TeamContainer>
  );
};
