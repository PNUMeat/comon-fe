import { Spacer } from '@/components/commons/Spacer';
import { CalendarAndPosts } from '@/components/features/TeamDashboard/CalendarAndPosts';
import { SidebarAndAnnouncement } from '@/components/features/TeamDashboard/SidebarAndAnnouncement';

import styled from '@emotion/styled';

export const TeamDashboardPage = () => {
  return (
    <>
      <Spacer h={28} />
      <Grid>
        <SidebarAndAnnouncement />
        <CalendarAndPosts />
      </Grid>
    </>
  );
};

const Grid = styled.div`
  display: grid;
  grid-template-areas:
    'sidebar announcement'
    'sidebar calendar';
  grid-template-columns: 260px 1fr;
  grid-template-rows: auto 1fr auto;
  gap: 24px 40px;
  height: 100vh;
`;
