import { Box } from '@/components/commons/Box';
import { Spacer } from '@/components/commons/Spacer';
import { MyTeamCard } from '@/components/features/TeamDashboard/MyTeamCard';
import { TeamList } from '@/components/features/TeamDashboard/TeamList';

import click from '@/assets/TeamDashboard/click.png';
import styled from '@emotion/styled';

export const TeamDashboardPage = () => {
  return (
    <>
      {/* 나의 팀 */}
      <MyTeamCard />

      {/* 팀이 없으신가요? 활동 중인 코몬 팀을 찾아보세요! */}
      <TeamList />
      <GuideText>혹은, 새로운 팀을 생성하시겠나요?</GuideText>
      <Spacer h={12} />
      <Box width="100%" height="80px" theme="action" fontSize="20px">
        <ClickImage src={click} />
        <ActionText>팀 생성하기</ActionText>
      </Box>
    </>
  );
};

const GuideText = styled.div`
  color: #333;
  font-size: 14px;
  text-align: center;
`;

const ClickImage = styled.img`
  width: 24px;
  height: 24px;
`;

const ActionText = styled.div`
  margin-left: 8px;
`;
