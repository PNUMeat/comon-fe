import { SingleSectionLayout } from '@/components/layout/SingleSectionLayout';

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { currentPathAtom } from '@/store/form';
import { useSetAtom } from 'jotai';

export const SSLWithPathAtom = () => {
  const location = useLocation();
  const setPath = useSetAtom(currentPathAtom);

  useEffect(() => {
    setPath(location.pathname);
  }, [location.pathname, setPath]);

  return <SingleSectionLayout />;
};
