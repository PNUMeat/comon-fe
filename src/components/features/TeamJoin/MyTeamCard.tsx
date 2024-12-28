import { BackgroundGradient } from '@/components/commons/BackgroundGradient';
import { Box } from '@/components/commons/Box';
import { Button } from '@/components/commons/Button';
import { Flex } from '@/components/commons/Flex';
import { Label } from '@/components/commons/Label';
import { LazyImage } from '@/components/commons/LazyImage';
import { PageSectionHeader } from '@/components/commons/PageSectionHeader';
import { SText } from '@/components/commons/SText';
import { Spacer } from '@/components/commons/Spacer';

import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import { ITeamInfo } from '@/api/team';
import click from '@/assets/TeamJoin/click.png';
import { colors } from '@/constants/colors';
import { PATH } from '@/routes/path';
import styled from '@emotion/styled';

interface MyTeamCardProps {
  teams: ITeamInfo[];
}

export const MyTeamCard = ({ teams }: MyTeamCardProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const scrollContainer = containerRef.current;
    if (!scrollContainer) return;

    const handleScroll = () => {
      const scrollLeft = scrollContainer.scrollLeft;
      const clientWidth = scrollContainer.clientWidth;
      const newIndex = Math.round(scrollLeft / clientWidth);

      setCurrentIndex(newIndex);
    };

    // TODO: throttle?
    scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleDotClick = (index: number) => {
    if (!containerRef.current) return;
    const { clientWidth } = containerRef.current;

    containerRef.current.scrollTo({
      left: index * clientWidth,
      behavior: 'smooth',
    });
  };

  return (
    <>
      <PageSectionHeader h={40}>👑 나의 팀</PageSectionHeader>
      <BackgroundGradient
        count={1}
        positions={[{ top: '-4px' }]}
        height="300px"
      />

      <Spacer h={30} />

      <Carousel ref={containerRef}>
        {teams.map((team) => {
          return (
            <div
              style={{
                scrollSnapAlign: 'start',
                minWidth: '1090px',
              }}
              key={team.teamId}
            >
              <Box width="100%">
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
                    <Spacer h={12} />
                    <SText fontSize="40px" color="#333" fontWeight={700}>
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
                    <Spacer h={24} />
                    <Flex direction="column" align="center" gap="10px">
                      {/* <Button backgroundColor={colors.buttonPink}>
                    {team.streakDays}일 연속 코몬 중!
                  </Button> */}
                      <Button backgroundColor={colors.buttonPurple}>
                        {team.memberCount} members
                      </Button>
                    </Flex>
                  </Flex>
                  <Flex
                    direction="column"
                    justify="space-evenly"
                    align="center"
                    width={35}
                  >
                    {/* <Box width="360px" height="80px">
                  <Flex width={100} justify="space-evenly" align="center">
                    <SText fontSize="16px" fontWeight={600} color="#333">
                      오늘의 코테 {team.successMemberCount}명 업로드 완료!
                    </SText>
                    <ProfileList profiles={profiles} />
                  </Flex>
                </Box> */}
                    <Link
                      to={`${PATH.TEAM_DASHBOARD}/${team.teamId}`}
                      style={{ textDecoration: 'none' }}
                    >
                      <Box
                        width="360px"
                        height="80px"
                        padding="0"
                        borderWidth="3px"
                      >
                        <ClickImage src={click} />
                        <ActionText>
                          <SText fontSize="20px" fontWeight={700} color="#333">
                            팀 페이지로 이동하기
                          </SText>
                        </ActionText>
                      </Box>
                    </Link>
                  </Flex>
                </Flex>
              </Box>
            </div>
          );
        })}
        <CircleNav>
          {teams.map((_, index) => (
            <DotButton
              key={index}
              isSelected={index === currentIndex}
              onClick={() => handleDotClick(index)}
            />
          ))}
        </CircleNav>
      </Carousel>

      <Spacer h={84} />
    </>
  );
};

const ImageContainer = styled(LazyImage)`
  object-position: center;
  overflow: hidden;
  max-height: 230px;
`;

const ClickImage = styled.img`
  width: 24px;
  height: 24px;
`;

const ActionText = styled.div`
  margin-left: 8px;
  color: #333;
`;

const Carousel = styled.div`
  width: 100%;
  overflow-x: scroll;
  box-sizing: border-box;
  display: flex;
  scroll-snap-type: x mandatory;
  gap: 12px;

  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

export const CircleNav = styled.div`
  position: absolute;
  left: 50%;
  transform: translate(-50%, 310px);
  display: flex;
  gap: 8px;
`;

const DotButton = styled.button<{ isSelected?: boolean }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  background-color: ${({ isSelected }) => (isSelected ? '#8488ec' : '#cdcfff')};
  transition: background-color 0.3s;

  &:hover {
    background-color: #999;
  }
`;
