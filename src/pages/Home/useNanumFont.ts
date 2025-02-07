import { useEffect } from 'react';

import { breakpoints } from '@/constants/breakpoints.ts';
import { isNanumFontFamilyLoadedAtom } from '@/store/load.ts';
import { useAtom } from 'jotai/index';

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

export const useNanumFont = () => {
  const [isNanumFFReady, setIsNanumFFReady] = useAtom(
    isNanumFontFamilyLoadedAtom
  );

  useEffect(() => {
    const width = window.innerWidth;
    const isMobile = width <= breakpoints.mobile;
    if (isMobile) {
      setIsNanumFFReady(true);
      return;
    }

    if (isNanumFFReady) {
      return;
    }

    const timer = setTimeout(async () => {
      const isSuccess = await loadNanumFontFamily();
      if (isSuccess) {
        setIsNanumFFReady(true);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [isNanumFFReady]);

  return {
    isNanumFFReady,
  };
};
