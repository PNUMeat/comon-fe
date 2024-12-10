import { BackgroundGradient } from '@/components/commons/BackgroundGradient';
import { Box } from '@/components/commons/Box';
import { Button } from '@/components/commons/Button';
import { Flex } from '@/components/commons/Flex';
import { Label } from '@/components/commons/Label';
import { LazyImage } from '@/components/commons/LazyImage';
import { PageSectionHeader } from '@/components/commons/PageSectionHeader';
import { SText } from '@/components/commons/SText';
import { Spacer } from '@/components/commons/Spacer';

import { Team } from '@/api/team/getTeamList';
import click from '@/assets/TeamDashboard/click.png';
import { colors } from '@/constants/colors';
import styled from '@emotion/styled';

import { ProfileList } from './ProfileList';

interface MyTeamCardProps {
  teams: Team[];
}

export const MyTeamCard = ({ teams }: MyTeamCardProps) => {
  return (
    <>
      <PageSectionHeader h={40}>나의 팀</PageSectionHeader>
      <BackgroundGradient
        count={1}
        positions={[{ top: '-4px' }]}
        height="300px"
      />

      <Spacer h={30} />

      {teams.map((team) => {
        const profiles = team.members.map((member) => member.imageUrl);

        return (
          <Box key={team.teamId} width="100%">
            <Flex justify="space-around">
              <Box width="260px" height="260px">
                <ImageContainer
                  src={team.imageUrl}
                  altText={team.teamName}
                  w="inherit"
                  h="inherit"
                  maxW={260}
                />
              </Box>
              <Flex
                direction="column"
                justify="center"
                align="center"
                width={30}
              >
                <SText fontSize="16px" fontWeight={600}>
                  TEAM
                </SText>
                <Spacer h={8} />
                <TeamName>{team.teamName}</TeamName>
                <SinceDate>since {team.createdAt}</SinceDate>
                <Label>
                  <SText fontSize="10px" fontWeight={600}>
                    {team.topic}
                  </SText>
                </Label>
                <ButtonWrapper>
                  <Button backgroundColor={colors.buttonPink}>
                    {team.streakDays}일 연속 코몬 중!
                  </Button>
                  <Button backgroundColor={colors.buttonPurple}>
                    {team.memberCount} members
                  </Button>
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
                      오늘의 코테 {team.successMemberCount}명 업로드 완료!
                    </UploadStatusText>
                    <ProfileList profiles={profiles} />
                  </Flex>
                </Box>
                {/* TODO: link 어디로? */}
                <Box width="360px" height="80px" padding="0" borderWidth="3px">
                  <ClickImage src={click} />
                  <ActionText>
                    <SText fontSize="20px">팀 페이지로 이동하기</SText>
                  </ActionText>
                </Box>
              </Flex>
            </Flex>
          </Box>
        );
      })}
      <Spacer h={84} />
    </>
  );
};

const ImageContainer = styled(LazyImage)`
  object-fit: cover;
  object-position: center;
`;

const TeamName = styled.div`
  font-size: 40px;
  color: #333;
  font-weight: 700;
`;

const SinceDate = styled.div`
  color: #777;
  margin-bottom: 8px;
  font-weight: 400;
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
