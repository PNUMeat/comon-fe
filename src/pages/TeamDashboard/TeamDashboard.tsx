import { Box } from '@/components/commons/Box';
import { SText } from '@/components/commons/SText';
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
      <SText color="#333" fontSize="14px" textAlign="center">
        혹은, 새로운 팀을 생성하시겠나요?
      </SText>
      <Spacer h={12} />
      <Box width="100%" height="80px" padding="0" borderWidth="3px">
        <ClickImage src={click} />
        <ActionText>
          <SText fontSize="20px">팀 생성하기</SText>
        </ActionText>
      </Box>
    </>
  );
};

const ClickImage = styled.img`
  width: 24px;
  height: 24px;
`;

const ActionText = styled.div`
  margin-left: 8px;
`;
