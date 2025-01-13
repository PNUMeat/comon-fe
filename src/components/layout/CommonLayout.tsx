import { Container } from '@/components/commons/Container';
import { Header } from '@/components/commons/Header';
import { Alert } from '@/components/commons/Modal/Alert';
import { Spacer } from '@/components/commons/Spacer';

import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { setNavigator } from '@/api/apiInstance';
import { breakpoints } from '@/constants/breakpoints';
import styled from '@emotion/styled';

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

  return (
    <Container padding={'0'}>
      <Alert />
      <Confirm />
      <ScrollStart />
      <Header h={headerHeight} />
      {children}
      <Spacer h={200} />
    </Container>
  );
};

const ScrollStart = styled.div`
  scroll-snap-align: start;

  @media (max-width: ${breakpoints.mobile}px) {
    margin-top: 50px;
  }
`;
