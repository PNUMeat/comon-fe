import { Container } from '@/components/commons/Container';
import { Header } from '@/components/commons/Header';

import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { setNavigator } from '@/api/apiInstance';
import { Alert } from '@/components/commons/Modal/Alert';

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

  return (
    <Container padding={'0'}>
      <Alert />
      <Header h={headerHeight} />
      {children}
    </Container>
  );
};
