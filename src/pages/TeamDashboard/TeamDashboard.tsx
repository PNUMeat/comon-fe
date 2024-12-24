import { CustomCalendar } from '@/components/commons/Calendar/Calendar';
import { Spacer } from '@/components/commons/Spacer';
import { Posts } from '@/components/features/TeamDashboard/Posts';
import { SidebarAndAnnouncement } from '@/components/features/TeamDashboard/SidebarAndAnnouncement';

import { Navigate, useParams } from 'react-router-dom';

import { getTeamInfoAndTags } from '@/api/dashboard';
import { ITeamInfo } from '@/api/team';
import { PATH } from '@/routes/path';
import styled from '@emotion/styled';
import { useQuery } from '@tanstack/react-query';

export const TeamDashboardPage = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const year = 2024; // TODO:
  const month = 12; // TODO:

  const { data } = useQuery({
    queryKey: ['team-info', teamId, year, month],
    queryFn: () => getTeamInfoAndTags(Number(teamId), year, month),
    enabled: !!teamId,
  });

  if (!teamId) {
    return <Navigate to={PATH.TEAMS} />;
  }

  const teamInfo = data?.myTeamResponse || ({} as ITeamInfo);
  const isTeamManager = data?.teamManager || false;
  const tags = data?.subjectArticleDateAndTagResponses || [];

  return (
    <>
      <Spacer h={28} />
      <Grid>
        <SidebarAndAnnouncement
          teamInfo={teamInfo}
          isTeamManager={isTeamManager}
        />
        <CalendarSection>
          <CustomCalendar tags={tags} />
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
