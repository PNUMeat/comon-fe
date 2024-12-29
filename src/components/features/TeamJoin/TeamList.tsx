import { BackgroundGradient } from '@/components/commons/BackgroundGradient';
import { Box } from '@/components/commons/Box';
import { Button } from '@/components/commons/Button';
import { Flex } from '@/components/commons/Flex';
import { Label } from '@/components/commons/Label';
import { PageSectionHeader } from '@/components/commons/PageSectionHeader';
import { SText } from '@/components/commons/SText';
import { Spacer } from '@/components/commons/Spacer';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ITeamInfo, joinTeam } from '@/api/team';
import { colors } from '@/constants/colors';
import styled from '@emotion/styled';

import { ProfileList } from './ProfileList';
import { SearchBar } from './SearchBar';

interface TeamListProps {
  teams: ITeamInfo[];
  onSearch: (keyword: string) => void;
}

export const TeamList = ({ teams, onSearch }: TeamListProps) => {
  const [searchKeyword, setSearchKeyword] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(e.target.value);
  };

  const handleSearchSubmit = () => {
    onSearch(searchKeyword);
  };

  return (
    <>
      <PageSectionHeader h={40}>🔍 활동 팀 찾기</PageSectionHeader>
      <BackgroundGradient
        count={1}
        positions={[{ top: '90px' }]}
        height="470px"
      />
      <Spacer h={34} />
      {/* <FilterButtons /> TODO: 정렬 옵션 추가되면 주석 해제할 예정 */}
      <Flex justify="flex-end" align="center" gap="10px">
        <SearchBar
          value={searchKeyword}
          onChange={handleSearchChange}
          onSearch={handleSearchSubmit}
        />
      </Flex>
      <Spacer h={34} />
      <List>
        {teams.map((team) => {
          const profiles = team.members.map((member) => member.imageUrl);

          return (
            <FlipCardItem key={team.teamId} team={team} profiles={profiles} />
          );
        })}
      </List>
      <Spacer h={34} />
    </>
  );
};

const FlipCardItem = ({
  team,
  profiles,
}: {
  team: ITeamInfo;
  profiles: string[];
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <FlipCard
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <FlipCardInner isFlipped={isFlipped}>
        {/* 앞면 */}
        <FlipCardFront>
          <FlipCardContent team={team} profiles={profiles} />
        </FlipCardFront>

        {/* 뒷면 */}
        <FlipCardBack>
          <FlipCardContent team={team} isBack />
        </FlipCardBack>
      </FlipCardInner>
    </FlipCard>
  );
};

const FlipCardContent = ({
  team,
  profiles,
  isBack = false,
}: {
  team: ITeamInfo;
  profiles?: string[];
  isBack?: boolean;
}) => {
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const joinOnClick = (teamId: number, password: string) => () => {
    joinTeam(teamId, password)
      .then(() => {
        navigate(`/team-dashboard/${teamId}`);
      })
      .catch((err) => console.error(err));
  };

  return (
    <Box width="100%" height="100%">
      <Flex direction="column" justify="center" align="center" width={100}>
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
        {isBack ? (
          <>
            <PasswordInput
              type="password"
              placeholder="PASSWORD"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus={true}
            />
            <Spacer h={14} />
            <Button
              backgroundColor={colors.buttonPurple}
              // onClick={() => joinTeam(team.teamId, password)}
              onClick={joinOnClick(team.teamId, password)}
            >
              팀 참가하기
            </Button>
          </>
        ) : (
          <>
            <ProfileList profiles={profiles || []} />
            <Spacer h={14} />
            <ButtonWrapper>
              <Button backgroundColor={colors.buttonPurple}>
                {team.memberCount} members
              </Button>
              {/* <Button backgroundColor={colors.buttonPink}>
                {team.streakDays}일차 코몬
              </Button> */}
            </ButtonWrapper>
          </>
        )}
      </Flex>
    </Box>
  );
};

const List = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(330px, 1fr));
  gap: 20px;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  // justify-content: space-between;
  // gap: 10px;
`;

const PasswordInput = styled.input`
  width: 160px;
  height: 24px;
  border: 1px solid ${colors.borderPurple};
  border-radius: 28px;
  outline: none;
  text-align: center;
  color: #ccc;
  background-color: transparent;

  &::placeholder {
    color: #ccc;
    font-weight: 400;
  }

  &:focus {
    border-color: ${colors.buttonPurple};
  }
`;

const FlipCard = styled.div`
  background-color: transparent;
  width: 330px;
  height: 210px;
  perspective: 1000px;
`;

const FlipCardInner = styled.div<{ isFlipped: boolean }>`
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.8s;
  transform-style: preserve-3d;
  transform: ${({ isFlipped }) =>
    isFlipped ? 'rotateY(180deg)' : 'rotateY(0)'};
`;

const FlipCardFront = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  background: #fff;
  border-radius: 20px;
`;

const FlipCardBack = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  background: #fff;
  border-radius: 20px;
  transform: rotateY(180deg);
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid ${colors.buttonPurple};
  z-index: 999;
`;
