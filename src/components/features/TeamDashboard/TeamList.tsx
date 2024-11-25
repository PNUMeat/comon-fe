import { Box } from '@/components/commons/Box';
import { Button } from '@/components/commons/Button';
import { FilterButtons } from '@/components/commons/FilterButtons';
import { Flex } from '@/components/commons/Flex';
import { PageSectionHeader } from '@/components/commons/PageSectionHeader';
import { Pagination } from '@/components/commons/Pagination';
import { Spacer } from '@/components/commons/Spacer';

import { colors } from '@/constants/colors';
import styled from '@emotion/styled';

import { ProfileList } from './ProfileList';

const teams = [
  { name: 'Codemonster', since: '2024.11.12', members: 6 },
  { name: 'DORTHY', since: '2024.11.12', members: 4 },
  { name: 'Apptive', since: '2024.11.12', members: 7 },
  { name: 'Codemonster', since: '2024.11.12', members: 6 },
  { name: 'DORTHY', since: '2024.11.12', members: 4 },
  { name: 'Apptive', since: '2024.11.12', members: 7 },
];

const profiles = [
  'https://via.placeholder.com/24x24.png?text=1',
  'https://via.placeholder.com/24x24.png?text=2',
  'https://via.placeholder.com/24x24.png?text=3',
  'https://via.placeholder.com/24x24.png?text=4',
  'https://via.placeholder.com/24x24.png?text=5',
];

export const TeamList = () => {
  return (
    <>
      <PageSectionHeader h={40}>
        팀이 없으신가요? 활동 중인 코몬 팀을 찾아보세요!
      </PageSectionHeader>

      <Spacer h={34} />
      <FilterButtons />
      <Spacer h={34} />

      <List>
        {teams.map((team, index) => (
          <Box key={index} width="330px" height="210px">
            <Flex
              direction="column"
              justify="center"
              align="center"
              width={100}
            >
              <Team>TEAM</Team> <TeamName>{team.name}</TeamName>
              <SinceDate>since {team.since}</SinceDate>
              <Box height="18px" fontSize="10px" theme="label">
                스터디
              </Box>
              <Spacer h={20} />
              <ProfileList profiles={profiles} />
              <Spacer h={14} />
              <ButtonWrapper>
                <Button backgroundColor={colors.buttonPurple}>
                  {team.members} members
                </Button>
                <Button backgroundColor={colors.buttonPink}>
                  126일차 코몬
                </Button>
              </ButtonWrapper>
            </Flex>
          </Box>
        ))}
      </List>

      <Spacer h={34} />
      <Pagination />
      <Spacer h={34} />
    </>
  );
};

const List = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(330px, 1fr));
  gap: 20px;
`;

const Team = styled.div`
  font-size: 12px;
`;

const TeamName = styled.div`
  font-size: 24px;
  color: #333;
  font-weight: bold;
`;

const SinceDate = styled.div`
  color: #777;
  margin-bottom: 8px;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
`;
