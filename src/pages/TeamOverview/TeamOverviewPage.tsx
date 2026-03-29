import { TeamOverviewCard } from '@/components/features/TeamOverview/TeamOverviewCard';

import { useState } from 'react';

import { getTeamList } from '@/api/team';
import { ServerResponse } from '@/api/types';
import twoDaysImg from '@/assets/Overview/2days.png';
import fourDaysImg from '@/assets/Overview/4days.png';
import sixDaysImg from '@/assets/Overview/6days.png';
import styled from '@emotion/styled';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

// TODO: 실제 데이터 연결 필요

const TeamOverviewInfo = [
  {
    imgSrc: twoDaysImg,
    title: '코드테스트 2DAYS',
    description: '가벼운 마음으로 습관을 시작해보세요. 스터디 주 2일 풀어요.',
    count: 124,
    solveCount: 1240,
  },
  {
    imgSrc: fourDaysImg,
    title: '코드테스트 4DAYS',
    description:
      '가장 인기 있는 코스! 꾸준함이 무기입니다. 스터디 주 4일 풀어요.',
    count: 124,
    solveCount: 4500,
  },
  {
    imgSrc: sixDaysImg,
    title: '코드테스트 6DAYS',
    description: '단기간 실력 향상을 위한 몰입형 과정! 스터디 주 6일 풀어요.',
    count: 44,
    solveCount: 8200,
  },
];

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

      return failureCount < 3;
    },
  });

  console.log(queryData);
  return (
    <OverviewWrapper>
      {TeamOverviewInfo.map((info, idx) => (
        <TeamOverviewCard key={idx} data={info} />
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
