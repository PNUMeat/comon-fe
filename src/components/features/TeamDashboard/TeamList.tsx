import { BackgroundGradient } from '@/components/commons/BackgroundGradient';
import { Box } from '@/components/commons/Box';
import { Button } from '@/components/commons/Button';
// import { FilterButtons } from '@/components/commons/FilterButtons';
import { Flex } from '@/components/commons/Flex';
import { Label } from '@/components/commons/Label';
import { PageSectionHeader } from '@/components/commons/PageSectionHeader';
import { Pagination } from '@/components/commons/Pagination';
import { SText } from '@/components/commons/SText';
import { Spacer } from '@/components/commons/Spacer';

import { ITeamInfo } from '@/api/team';
import { colors } from '@/constants/colors';
import styled from '@emotion/styled';

import { ProfileList } from './ProfileList';

interface TeamListProps {
  teams: ITeamInfo[];
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const TeamList = ({
  teams,
  totalPages,
  onPageChange,
}: TeamListProps) => {
  return (
    <>
      <PageSectionHeader h={40}>
        팀이 없으신가요? 활동 중인 코몬 팀을 찾아보세요!
      </PageSectionHeader>
      <BackgroundGradient
        count={1}
        positions={[{ top: '90px' }]}
        height="470px"
      />
      <Spacer h={34} />
      {/* <FilterButtons /> TODO: 정렬 옵션 추가되면 주석 해제할 예정 */}
      <Spacer h={34} />
      <List>
        {teams.map((team) => {
          const profiles = team.members.map((member) => member.imageUrl);

          return (
            <Box key={team.teamId} width="330px" height="210px">
              <Flex
                direction="column"
                justify="center"
                align="center"
                width={100}
              >
                <SText fontSize="12px" fontWeight={600}>
                  TEAM
                </SText>
                <Spacer h={4} />
                <SText fontSize="24px" color="#333" fontWeight={700}>
                  {team.teamName}
                </SText>
                <Spacer h={8} />
                <SText fontSize="16px" color="#777" fontWeight={400}>
                  since {team.createdAt}
                </SText>
                <Spacer h={8} />
                <Label>
                  <SText fontSize="10px" fontWeight={600}>
                    {team.topic}
                  </SText>
                </Label>
                <Spacer h={20} />
                <ProfileList profiles={profiles} />
                <Spacer h={14} />
                <ButtonWrapper>
                  <Button backgroundColor={colors.buttonPurple}>
                    {team.memberCount} members
                  </Button>
                  <Button backgroundColor={colors.buttonPink}>
                    {team.streakDays}일차 코몬
                  </Button>
                </ButtonWrapper>
              </Flex>
            </Box>
          );
        })}
      </List>
      <Spacer h={34} />
      <Pagination totalPages={totalPages} onPageChange={onPageChange} />
      <Spacer h={34} />
    </>
  );
};

const List = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(330px, 1fr));
  gap: 20px;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
`;
