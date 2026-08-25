import { Container } from '@/components/commons/Container';
import { PageSectionHeader } from '@/components/commons/PageSectionHeader';
import { CommonLayout } from '@/components/layout/CommonLayout';

import { Outlet, useLocation } from 'react-router-dom';

import { PATH } from '@/routes/path';
import { getTitle } from '@/routes/pathTitles';

export const SingleSectionLayout = () => {
  const { pathname } = useLocation();
  const isTeamDashboard = pathname.startsWith(PATH.TEAM_DASHBOARD);

  return (
    <CommonLayout>
      <Container maxW={isTeamDashboard ? 1280 : 1090}>
        {!isTeamDashboard && (
          <PageSectionHeader h={40}>{getTitle(pathname)}</PageSectionHeader>
        )}
        <Outlet />
      </Container>
    </CommonLayout>
  );
};
