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
import { HeightInString } from '@/components/types.ts';

import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ITeamInfo } from '@/api/team';
import magnifier from '@/assets/TeamJoin/magnifier.png';
import more from '@/assets/TeamJoin/more.png';
import { breakpoints } from '@/constants/breakpoints';
import { colors } from '@/constants/colors';
import { PATH } from '@/routes/path.tsx';
import styled from '@emotion/styled';

import { ProfileList } from './ProfileList';
import { SearchBar } from './SearchBar';

interface TeamListProps {
  teams: ITeamInfo[];
  myTeam: ITeamInfo[];
  isPending: boolean;
}

export const TeamList = ({ teams, myTeam, isPending }: TeamListProps) => {
  const myTeamIds = useMemo<Set<number>>(() => {
    return new Set(myTeam.map((team) => team.teamId));
  }, [myTeam]);
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
        <SearchBar />
      </Flex>
      <Spacer h={34} />
      <List
        itemCount={teams.length}
        h={
          isPending
            ? 'auto'
            : teams.length === 0
              ? '210px'
              : 'auto'
        }
      >
        {isPending ? null : teams.length === 0 ? (
          <SText color="#777" fontSize="16px">
            <Flex height={210} justify="center" align="center">
              존재하지 않는 팀이에요.
            </Flex>
          </SText>
        ) : (
          teams.map((team) => {
            const profiles = (team.members ?? [])
              .slice(0, 6)
              .map((member) => member.imageUrl);

            if (team.members && team.members.length > 6) {
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
    // <FlipCard onMouseLeave={() => setIsFlipped(false)}>
    <FlipCard>
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
  // const [password, setPassword] = useState('');
  const navigate = useNavigate();

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
        <Spacer h={isMobile ? 4 : 6} />
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
        <Spacer h={isMobile ? 12 : 20} />
        {isBack ? (
          <>
            <Spacer h={4} />
            <BackButtonLabel>활동 중인 팀을 편하게 둘러보세요</BackButtonLabel>
            <Spacer h={6} />
            <Button
              backgroundColor={colors.buttonPurple}
              onClick={(e) => {
                e.stopPropagation();
                navigate(`${PATH.TEAM_DASHBOARD}/${team.teamId}`);
              }}
            >
              팀 둘러보기
            </Button>
          </>
        ) : (
          <>
            <ProfileList profiles={profiles || []} size={isMobile ? 20 : 24} />
            <Spacer h={isMobile ? 12 : 14} />
            <SText
              color={colors.buttonPurple}
              fontSize={isMobile ? '12px' : '16px'}
              fontWeight={400}
              fontFamily="Pretendard"
            >
              {team.memberCount} members
            </SText>
          </>
        )}
      </Flex>
    </Box>
  );
};

const List = styled.div<{ itemCount: number } & HeightInString>`
  display: ${({ itemCount }) => (itemCount === 2 ? 'flex' : 'grid')};
  height: ${({ h }) => (h ? h : 'auto')};
  grid-template-columns: repeat(auto-fit, minmax(330px, 1fr));
  gap: 20px;

  @media (max-width: ${breakpoints.mobile}px) {
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 4px;
  }
`;

const BackButtonLabel = styled.div`
  width: 160px;
  height: 24px;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  font-family: 'Pretendard';
  font-size: 12px;
  color: #6c6a6a;
  white-space: nowrap;

  @media (max-width: ${breakpoints.mobile}px) {
    font-size: 10px;
    width: 100%;
    height: 20px;
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
