import { Box } from '@/components/commons/Box';
import { SText } from '@/components/commons/SText';
import { Spacer } from '@/components/commons/Spacer';
import { MyTeamCard } from '@/components/features/TeamDashboard/MyTeamCard';
import { TeamList } from '@/components/features/TeamDashboard/TeamList';

import { Suspense } from 'react';
import { Link } from 'react-router-dom';

import { getTeamList } from '@/api/team/getTeamList';
import click from '@/assets/TeamDashboard/click.png';
import { PATH } from '@/routes/path';
import styled from '@emotion/styled';
import { useQuery } from '@tanstack/react-query';

const TeamData = () => {
  const { data } = useQuery({
    queryKey: ['team-list'],
    queryFn: () => getTeamList('recent', 0, 6), // TODO: 수정
  });

  const myTeams = data?.myTeams || [];
  const allTeams = data?.allTeams.content || [];

  return (
    <>
      {/* 나의 팀 */}
      {myTeams.length > 0 && <MyTeamCard teams={myTeams} />}
      {/* 팀이 없으신가요? 활동 중인 코몬 팀을 찾아보세요! */}
      <TeamList teams={allTeams} />
    </>
  );
};

export const TeamDashboardPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TeamData />
      <SText color="#333" fontSize="14px" textAlign="center">
        혹은, 새로운 팀을 생성하시겠나요?
      </SText>
      <Spacer h={12} />
      <Link to={PATH.TEAM_REGISTRATION} style={{ textDecoration: 'none' }}>
        <Box width="100%" height="80px" padding="0" borderWidth="3px">
          <ClickImage src={click} />
          <ActionText>
            <SText fontSize="20px" fontWeight={700}>
              팀 생성하기
            </SText>
          </ActionText>
        </Box>
      </Link>
    </Suspense>
  );
};

const ClickImage = styled.img`
  width: 24px;
  height: 24px;
`;

const ActionText = styled.div`
  margin-left: 8px;
`;
