import { Container } from '@/components/commons/Container';
import { Header } from '@/components/commons/Header';

import React, { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

const headerHeight = 72;

export const CommonLayout: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const location = useLocation();
  useLayoutEffect(() => {
    document.documentElement.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [location.pathname]);

  return (
    <Container padding={'0'}>
      <Header h={headerHeight} />
      {children}
    </Container>
  );
};
