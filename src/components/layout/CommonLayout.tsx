import { useWindowWidth } from '@/hooks/useWindowWidth';

import { Container } from '@/components/commons/Container';
import { Header } from '@/components/commons/Header';
import { Alert } from '@/components/commons/Modal/Alert';

import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { setNavigator } from '@/api/apiInstance';
import { breakpoints } from '@/constants/breakpoints';

import { Confirm } from '../commons/Modal/Confirm';

const headerHeight = 72;

export const CommonLayout: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const location = useLocation();
  const prevPathRef = useRef<string | null>(null);

  useLayoutEffect(() => {
    const currPath = location.pathname.split('/')[1];
    if (prevPathRef.current !== currPath) {
      prevPathRef.current = currPath;
      document.documentElement.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant',
      });
    }
  }, [location.pathname]);

  const navigate = useNavigate();

  useEffect(() => {
    setNavigator(navigate);
  }, [navigate]);

  const width = useWindowWidth();
  const isMobile = width <= breakpoints.mobile;

  return (
    <Container
      padding={'0'}
      scrollSnapType={isMobile ? 'y mandatory' : undefined}
    >
      <Alert />
      <Confirm />
      <Header h={headerHeight} />
      {children}
    </Container>
  );
};
