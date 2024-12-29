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
import Arrow from '@/assets/TeamJoin/carousel_arrow.png';
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

  const handlePrev = () => {
    const scrollContainer = containerRef.current;
    if (!scrollContainer) return;

    const scrollAmount = scrollContainer.clientWidth;

    if (currentIndex === 0) {
      const lastIndex = teams.length - 1;
      scrollContainer.scrollTo({
        left: lastIndex * scrollAmount,
        behavior: 'smooth',
      });
      setCurrentIndex(lastIndex);
    } else {
      scrollContainer.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth',
      });
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    const scrollContainer = containerRef.current;
    if (!scrollContainer) return;

    const scrollAmount = scrollContainer.clientWidth;

    if (currentIndex === teams.length - 1) {
      scrollContainer.scrollTo({
        left: 0,
        behavior: 'smooth',
      });
      setCurrentIndex(0);
    } else {
      scrollContainer.scrollBy({
        left: scrollAmount,
        behavior: 'smooth',
      });
      setCurrentIndex(currentIndex + 1);
    }
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

      <CarouselWrapper>
        <LeftArrowButton onClick={handlePrev} />
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
                            <SText
                              fontSize="20px"
                              fontWeight={700}
                              color="#333"
                            >
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
        <RightArrowButton onClick={handleNext} />
      </CarouselWrapper>
      <Spacer h={84} />
    </>
  );
};

const CarouselWrapper = styled.div`
  display: flex;
  align-items: center;
  position: relative;
`;

const ArrowButton = styled.button`
  position: absolute;
  top: 50%;
  width: 68px;
  height: 158px;
  box-shadow: 5px 7px 11.6px 0px rgba(63, 63, 77, 0.07);
  border-radius: 20px;
  border: 1px solid rgba(205, 207, 255, 0.6);
  background: #fff;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2;
  background-image: url(${Arrow});
  background-repeat: no-repeat;
  background-size: auto 56px;
  background-position: center;
`;

const LeftArrowButton = styled(ArrowButton)`
  left: -60px;
  transform: translateY(-50%);
`;

const RightArrowButton = styled(ArrowButton)`
  right: -60px;
  transform: translateY(-50%) rotate(180deg);
`;

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
