import { Container } from '@/components/commons/Container';
import { PageSectionHeader } from '@/components/commons/PageSectionHeader';
import { CommonLayout } from '@/components/layout/CommonLayout';

import { Outlet } from 'react-router-dom';

import { TITLES } from '@/routes/pathTitles';

export const SingleSectionLayout = () => {
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
