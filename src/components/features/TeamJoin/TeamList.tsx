import { usePointerRotation } from '@/hooks/usePointerRotation.ts';
import { useWindowWidth } from '@/hooks/useWindowWidth';

import { BackgroundGradient } from '@/components/commons/BackgroundGradient';
import { Box } from '@/components/commons/Box';
import { Button } from '@/components/commons/Button';
import { Flex } from '@/components/commons/Flex';
import { Label } from '@/components/commons/Label';
import { PageSectionHeader } from '@/components/commons/PageSectionHeader';
import { SText } from '@/components/commons/SText';
import { Spacer } from '@/components/commons/Spacer';

import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ITeamInfo, joinTeam } from '@/api/team';
import magnifier from '@/assets/TeamJoin/magnifier.png';
import { breakpoints } from '@/constants/breakpoints';
import { colors } from '@/constants/colors';
import styled from '@emotion/styled';
import more from '@/assets/TeamJoin/more.png';

import { ProfileList } from './ProfileList';
import { SearchBar } from './SearchBar';

interface TeamListProps {
  teams: ITeamInfo[];
  myTeam: ITeamInfo[];
  onSearch: (keyword: string) => void;
}

export const TeamList = ({ teams, onSearch, myTeam }: TeamListProps) => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const myTeamIds = useMemo<Set<number>>(() => {
    return new Set(myTeam.map((team) => team.teamId));
  }, [myTeam]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(e.target.value);
  };

  const handleSearchSubmit = () => {
    onSearch(searchKeyword);
  };

  const width = useWindowWidth();
  const isMobile = width <= breakpoints.mobile;

  return (
    <>
      <PageSectionHeader h={40}>
        <Icon src={magnifier} alt="magnifier" />
        활동 팀 찾기
      </PageSectionHeader>
      <BackgroundGradient
        count={1}
        positions={[{ top: '90px' }]}
        height="470px"
      />
      {!isMobile && <Spacer h={34} />}
      {/* <FilterButtons /> TODO: 정렬 옵션 추가되면 주석 해제할 예정 */}
      <Flex justify="flex-end" align="center" gap="10px">
        <SearchBar
          value={searchKeyword}
          onChange={handleSearchChange}
          onSearch={handleSearchSubmit}
        />
      </Flex>
      <Spacer h={34} />
      <List itemCount={teams.length}>
        {teams.length === 0 ? (
          <SText color="#777" fontSize="16px">
            <Flex height={210} justify="center" align="center">
              존재하지 않는 팀이에요.
            </Flex>
          </SText>
        ) : (
          teams.map((team) => {
            const profiles = team.members.slice(0, 6).map((member) => member.imageUrl);
            if (team.members.length > 6) {
              profiles.push(more);
            }

            return (
              <FlipCardItem
                key={team.teamId}
                team={team}
                profiles={profiles}
                isDisabled={myTeamIds.has(team.teamId)}
              />
            );
          })
        )}
      </List>
      <Spacer h={34} />
    </>
  );
};

const FlipCardItem = ({
  team,
  profiles,
  isDisabled,
}: {
  team: ITeamInfo;
  profiles: string[];
  isDisabled: boolean;
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const { boxRef, onPointerMove, onPointerLeave } = usePointerRotation({
    mouseIgnorePadding: 20,
    maxRotateDeg: 5,
    z: 0,
  });

  return (
    <FlipCard onMouseLeave={() => setIsFlipped(false)}>
      <FlipCardInner isFlipped={isFlipped}>
        {/* 앞면 */}
        <FlipCardFront
          ref={boxRef}
          onPointerMove={onPointerMove}
          onPointerLeave={onPointerLeave}
          isDisabled={isDisabled}
          onClick={() => {
            if (isDisabled) {
              return;
            }
            const selection = window.getSelection()?.toString();
            if (selection) {
              return;
            }
            setIsFlipped(true);
          }}
        >
          <FlipCardContent
            isDisabled={isDisabled}
            team={team}
            profiles={profiles}
          />
        </FlipCardFront>

        {/* 뒷면 */}
        <FlipCardBack
          onClick={() => {
            const selection = window.getSelection()?.toString();
            if (selection) {
              return;
            }
            setIsFlipped(false);
          }}
        >
          <FlipCardContent team={team} isBack />
        </FlipCardBack>
      </FlipCardInner>
    </FlipCard>
  );
};

const FlipCardContent = ({
  team,
  profiles,
  isDisabled = false,
  isBack = false,
}: {
  team: ITeamInfo;
  profiles?: string[];
  isBack?: boolean;
  isDisabled?: boolean;
}) => {
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const joinOnClick = (teamId: number, password: string) => {
    joinTeam(teamId, password)
      .then(() => {
        navigate(`/team-dashboard/${teamId}`);
      })
      .catch((err) => {
        alert('팀 가입 요청에 실패했습니다.');
        console.error(err);
      });
  };

  const width = useWindowWidth();
  const isMobile = width <= breakpoints.mobile;

  const ignoreClick: React.MouseEventHandler = (e) => {
    e.stopPropagation();
    e.preventDefault();
  };

  return (
    <Box
      width="100%"
      height="100%"
      style={{
        background: isDisabled ? '#fdfdfd' : '#fff',
        opacity: isDisabled ? '0.2' : '1',
      }}
    >
      <Flex direction="column" justify="center" align="center" width={100}>
        <SText
          color="#333"
          fontSize={isMobile ? '10px' : '12px'}
          fontWeight={600}
          onClick={ignoreClick}
          cursor={'text'}
        >
          TEAM
        </SText>
        <Spacer h={4} />
        <SText
          fontSize={isMobile ? '16px' : '24px'}
          color="#333"
          fontWeight={700}
          onClick={ignoreClick}
          cursor={'text'}
        >
          {team.teamName}
        </SText>
        <Spacer h={isMobile ? 4 : 8} />
        <SText
          fontSize={isMobile ? '10px' : '16px'}
          color="#777"
          fontWeight={400}
          onClick={ignoreClick}
          cursor={'text'}
        >
          since {team.createdAt}
        </SText>
        <Spacer h={8} />
        <Label>
          <SText
            fontSize="10px"
            fontWeight={600}
            onClick={ignoreClick}
            cursor={'text'}
          >
            {team.topic}
          </SText>
        </Label>
        <Spacer h={isMobile ? 16 : 20} />
        {isBack ? (
          <>
            <PasswordInput
              type="password"
              placeholder="PASSWORD"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              maxLength={4}
              onClick={ignoreClick}
            />
            <Spacer h={14} />
            <Button
              backgroundColor={colors.buttonPurple}
              onClick={(e) => {
                e.stopPropagation();
                joinOnClick(team.teamId, password);
              }}
            >
              팀 참가하기
            </Button>
          </>
        ) : (
          <>
            <ProfileList profiles={profiles || []} size={isMobile ? 20 : 24} />
            <Spacer h={isMobile ? 12 : 14} />
            <ButtonWrapper>
              <Button
                backgroundColor={colors.buttonPurple}
                onClick={(e) => {
                  e.stopPropagation();
                }}
                cursor={'text'}
              >
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

const List = styled.div<{ itemCount: number }>`
  display: ${({ itemCount }) => (itemCount === 2 ? 'flex' : 'grid')};
  grid-template-columns: repeat(auto-fit, minmax(330px, 1fr));
  gap: 20px;

  @media (max-width: ${breakpoints.mobile}px) {
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 4px;
  }
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

  u &::placeholder {
    color: #ccc;
    font-weight: 400;
  }

  &:focus {
    border-color: ${colors.buttonPurple};
  }

  @media (max-width: ${breakpoints.mobile}px) {
    width: 100px;
    height: 20px;

    &::placeholder {
      font-size: 10px;
    }
  }
`;

const FlipCard = styled.div`
  background-color: transparent;
  width: 330px;
  height: 210px;
  perspective: 1000px;

  @media (max-width: ${breakpoints.mobile}px) {
    // width: 160px;
    width: 100%;
    height: 170px;
  }
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

  cursor: pointer;
`;

const FlipCardFront = styled.div<{ isDisabled: boolean }>`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  background: #fff;
  background: ${(props) => (props.isDisabled ? '#fdfdfd' : '#fff')};
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

const Icon = styled.img`
  width: 25px;
  height: 25px;
  margin-bottom: 5px;
  margin-right: 8px;
`;
