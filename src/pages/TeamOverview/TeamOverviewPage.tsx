import { TeamOverviewCard } from '@/components/features/TeamOverview/TeamOverviewCard';

import { useState } from 'react';

import { getTeamList } from '@/api/team';
import { ServerResponse } from '@/api/types';
import fourDaysImg from '@/assets/Overview/4days.png';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

// TODO: 실제 데이터 연결 필요

const TeamOverviewInfo = {
  imgSrc: fourDaysImg,
  title: '코드테스트 4DAYS',
  description:
    '가장 인기 있는 코스! 꾸준함이 무기입니다. 스터디 주 4일 풀어요.',
  count: 124,
  solveCount: 4500,
};

export const TeamOverviewPage = () => {
  const [page, setPage] = useState(0);

  const { data: queryData, isPending: queryPending } = useQuery({
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

      return failureCount < 3;
    },
  });

  console.log(queryData);
  return (
    <div>
      <TeamOverviewCard data={TeamOverviewInfo} />
    </div>
  );
};

export default TeamOverviewPage;
