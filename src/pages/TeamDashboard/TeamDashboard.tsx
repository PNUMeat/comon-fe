import { CustomCalendar } from '@/components/commons/Calendar/Calendar';
import { Spacer } from '@/components/commons/Spacer';
import { Posts } from '@/components/features/TeamDashboard/Posts';
import { SidebarAndAnnouncement } from '@/components/features/TeamDashboard/SidebarAndAnnouncement';

import styled from '@emotion/styled';

export const TeamDashboardPage = () => {
  return (
    <>
      <Spacer h={28} />
      <Grid>
        <SidebarAndAnnouncement />
        <CalendarSection>
          <CustomCalendar />
          <Spacer h={24} />
          <Posts />
        </CalendarSection>
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

const CalendarSection = styled.section`
  grid-area: calendar;
  background-color: #f8f8ff;
  border-radius: 20px;
  padding: 20px 36px 40px 36px;
`;
