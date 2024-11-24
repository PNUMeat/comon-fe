import { Container } from '@/components/commons/Container';
import { Header } from '@/components/commons/Header';

import React from 'react';

const headerHeight = 72;

export const CommonLayout: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <Container>
      <Header h={headerHeight} />
      {children}
    </Container>
  );
};
