import { Container } from '@/components/commons/Container';
import { PageSectionHeader } from '@/components/commons/PageSectionHeader';
import { CommonLayout } from '@/components/layout/CommonLayout';

import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import { TITLES } from '@/routes/pathTitles';
import { currentPathAtom } from '@/store/form';
import { useSetAtom } from 'jotai/index';

export const SingleSectionLayout = () => {
  const location = useLocation();
  const setPath = useSetAtom(currentPathAtom);

  useEffect(() => {
    setPath(location.pathname);
  }, [location.pathname, setPath]);

  return (
    <CommonLayout>
      <Container maxW={1090}>
        <PageSectionHeader h={40}>
          {TITLES[location.pathname]}
        </PageSectionHeader>
        <Outlet />
      </Container>
    </CommonLayout>
  );
};
