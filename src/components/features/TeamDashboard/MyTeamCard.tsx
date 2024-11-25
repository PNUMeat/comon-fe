import { Box } from '@/components/commons/Box';
import { Button } from '@/components/commons/Button';
import { Flex } from '@/components/commons/Flex';
import { PageSectionHeader } from '@/components/commons/PageSectionHeader';
import { Spacer } from '@/components/commons/Spacer';

import click from '@/assets/TeamDashboard/click.png';
import { colors } from '@/constants/colors';
import styled from '@emotion/styled';

import { ProfileList } from './ProfileList';

const profiles = [
  'https://via.placeholder.com/24x24.png?text=1',
  'https://via.placeholder.com/24x24.png?text=2',
  'https://via.placeholder.com/24x24.png?text=3',
  'https://via.placeholder.com/24x24.png?text=4',
  'https://via.placeholder.com/24x24.png?text=5',
];

export const MyTeamCard = () => {
  return (
    <>
      <PageSectionHeader h={40}>나의 팀</PageSectionHeader>
      <Spacer h={30} />
      <Box width="100%">
        <Flex justify="space-around">
          <Box width="260px" height="260px" />

          <Flex direction="column" justify="center" align="center" width={30}>
            <Team>TEAM</Team> <TeamName>Codemonster</TeamName>
            <SinceDate>since 2024.11.12</SinceDate>
            <Box height="18px" fontSize="10px" theme="label">
              스터디
            </Box>
            <ButtonWrapper>
              <Button backgroundColor={colors.buttonPurple}>6 members</Button>
              <Button backgroundColor={colors.buttonPink}>126일차 코몬</Button>
            </ButtonWrapper>
          </Flex>

          <Flex
            direction="column"
            justify="space-evenly"
            align="center"
            width={35}
          >
            <Box width="360px" height="80px">
              <Flex width={100} justify="space-evenly" align="center">
                <UploadStatusText>
                  오늘의 코테 6명 업로드 완료!
                </UploadStatusText>
                <ProfileList profiles={profiles} />
              </Flex>
            </Box>
            <Box width="360px" height="80px" theme="action" fontSize="20px">
              <ClickImage src={click} />
              <ActionText>팀 페이지로 이동하기</ActionText>
            </Box>
          </Flex>
        </Flex>
      </Box>
      <Spacer h={84} />
    </>
  );
};

const Team = styled.div`
  margin-bottom: 8px;
`;

const TeamName = styled.div`
  font-size: 40px;
  color: #333;
  font-weight: bold;
`;

const SinceDate = styled.div`
  color: #777;
  margin-bottom: 8px;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: space-evenly;
  margin-top: 36px;
  gap: 10px;
`;

const UploadStatusText = styled.div``;

const ClickImage = styled.img`
  width: 24px;
  height: 24px;
`;

const ActionText = styled.div`
  margin-left: 8px;
`;
