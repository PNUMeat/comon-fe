import { Container } from '@/components/commons/Container';
import { PageSectionHeader } from '@/components/commons/PageSectionHeader';
import { CommonLayout } from '@/components/layout/CommonLayout';

import { Outlet, useLocation } from 'react-router-dom';

import { TITLES } from '@/routes/path';

export const SingleSectionLayout = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <CommonLayout>
      <Container maxW={1090}>
        <PageSectionHeader h={40}>{TITLES[currentPath]}</PageSectionHeader>
        <Outlet />
      </Container>
    </CommonLayout>
  );
};
