import { Container } from '@/components/commons/Container';
import { Header } from '@/components/commons/Header';
import { Alert } from '@/components/commons/Modal/Alert';
import { Spacer } from '@/components/commons/Spacer';

import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { setNavigator } from '@/api/apiInstance';
import { breakpoints } from '@/constants/breakpoints.ts';
import { isNanumFontFamilyLoadedAtom } from '@/store/load.ts';
import styled from '@emotion/styled';
import { useAtom } from 'jotai';

import { Confirm } from '../commons/Modal/Confirm';

const headerHeight = 66;

export const CommonLayout: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [isFetched, setIsFetched] = useAtom(isNanumFontFamilyLoadedAtom);
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

  useEffect(() => {
    const width = window.innerWidth;
    const isMobile = width <= breakpoints.mobile;
    if (isMobile) {
      setIsFetched(true);
      return;
    }

    if (isFetched) {
      return;
    }

    const timer = setTimeout(async () => {
      const isSuccess = await loadNanumFontFamily();
      if (isSuccess) {
        setIsFetched(true);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [isFetched]);

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
`;

const fontFiles = [
  {
    family: 'NanumSquareNeo',
    weight: '900',
    url: '/src/assets/fonts/NanumSquareNeoTTF-eHv.woff2',
  },
  {
    family: 'NanumSquareNeo',
    weight: '700',
    url: '/src/assets/fonts/NanumSquareNeoTTF-dEb.woff2',
  },
  {
    family: 'NanumSquareNeo',
    weight: '500',
    url: '/src/assets/fonts/NanumSquareNeoTTF-bRg.woff2',
  },
];

const loadNanumFontFamily = async () => {
  try {
    const fontPromises = fontFiles.map(async ({ family, weight, url }) => {
      const font = new FontFace(family, `url(${url})`, { weight });
      const loadedFont = await font.load();
      return document.fonts.add(loadedFont);
    });

    await Promise.all(fontPromises);
    return true;
  } catch (error) {
    console.error('Font loading failed:', error);
    return false;
  }
};
