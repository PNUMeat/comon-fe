import { TeamOverviewCard } from '@/components/features/TeamOverview/TeamOverviewCard';

import { useState } from 'react';

import { getTeamList } from '@/api/team';
import { ServerResponse } from '@/api/types';
import styled from '@emotion/styled';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

export const TeamOverviewPage = () => {
  const [page] = useState(0);

  const { data: queryData } = useQuery({
    queryKey: ['team-list', page],
    queryFn: () => getTeamList('asc', page, 6),
    select: (data) => {
      const sorted = [...data.allTeams.content].sort((a, b) =>
        a.teamName.localeCompare(b.teamName, 'ko')
      );
      return {
        myTeams: data.myTeams,
        otherTeams: sorted,
        totalPages: data.allTeams.page.totalPages,
      };
    },
    retry: (failureCount, error: AxiosError<ServerResponse<null>>) => {
      if (
        error.response &&
        error.response.status === 401 &&
        (error.response.data.code === 100 || error.response.data.code === 101)
      ) {
        return false;
      }
      console.log(queryData);
      return failureCount < 3;
    },
  });

  console.log(queryData);
  return (
    <OverviewWrapper>
      {queryData?.otherTeams.map((data, key) => (
        <TeamOverviewCard
          key={key}
          imgUrl={data.imageUrl}
          teamId={data.teamId}
          teamName={data.teamName}
          teamExplain={data.teamExplain}
          totalSolveCount={data.totalSolveCount}
          memberCount={data.memberCount}
        />
      ))}
    </OverviewWrapper>
  );
};

const OverviewWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 52px;
`;

export default TeamOverviewPage;
