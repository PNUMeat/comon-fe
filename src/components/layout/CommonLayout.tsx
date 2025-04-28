import { Container } from '@/components/commons/Container';
import { Header } from '@/components/commons/Header';
import { Alert } from '@/components/commons/Modal/Alert';
import { Spacer } from '@/components/commons/Spacer';

import React, { Fragment, useEffect, useLayoutEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { setNavigator } from '@/api/apiInstance';
import { breakpoints } from '@/constants/breakpoints.ts';
import styled from '@emotion/styled';

import { Confirm } from '../commons/Modal/Confirm';

const headerHeight = 58;

export const CommonLayout: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const location = useLocation();
  const prevPathRef = useRef<string | null>(null);
  const isHomePage = location.pathname === '/';

  useLayoutEffect(() => {
    const currPath = location.pathname.split('/')[1];
    if (prevPathRef.current !== currPath) {
      if (prevPathRef.current !== null) {
        document.documentElement.scrollTo({
          top: 0,
          left: 0,
          behavior: 'instant',
        });
      }
      prevPathRef.current = currPath;
    }
  }, [location.pathname]);

  const navigate = useNavigate();

  useEffect(() => {
    setNavigator(navigate);
  }, [navigate]);

  const width = window.innerWidth;
  const isMobile = width <= breakpoints.mobile;

  return (
    <Fragment>
      <Header h={headerHeight} />
      <Container
        maxW={isHomePage ? 'none' : ''}
        padding={'0'}
        margin={`${headerHeight + (isMobile ? 14 : isHomePage ? 0 : 52)}px auto 0 auto`}
      >
        <Alert />
        <Confirm />
        <ScrollStart />
        {children}
        {!isHomePage && <Spacer h={200} />}
      </Container>
    </Fragment>
  );
};

const ScrollStart = styled.div`
  scroll-snap-align: start;
`;
