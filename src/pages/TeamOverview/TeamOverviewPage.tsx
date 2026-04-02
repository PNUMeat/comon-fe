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
    queryFn: () => getTeamList('recent', page, 6),
    select: (data) => {
      return {
        myTeams: data.myTeams,
        otherTeams: data.allTeams.content,
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
          imgUrl={data.imgUrl}
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

const Icon = styled.img`
  width: 25px;
  height: 25px;
  margin-bottom: 5px;
  margin-right: 8px;
`;

export default TeamOverviewPage;
