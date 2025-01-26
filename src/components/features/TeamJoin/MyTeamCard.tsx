import { useWindowWidth } from '@/hooks/useWindowWidth';

import { BackgroundGradient } from '@/components/commons/BackgroundGradient';
import { Box } from '@/components/commons/Box';
import { Button } from '@/components/commons/Button';
import { Flex } from '@/components/commons/Flex';
import { Label } from '@/components/commons/Label';
import { LazyImage } from '@/components/commons/LazyImage';
import { PageSectionHeader } from '@/components/commons/PageSectionHeader';
import { SText } from '@/components/commons/SText';
import { Spacer } from '@/components/commons/Spacer';
import { Title } from '@/components/commons/Title';

import { Suspense } from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';

import { ITeamInfo } from '@/api/team';
import Arrow from '@/assets/TeamJoin/carousel_arrow.png';
import click from '@/assets/TeamJoin/click.png';
import crown from '@/assets/TeamJoin/crown.png';
import { breakpoints } from '@/constants/breakpoints';
import { colors } from '@/constants/colors';
import { PATH } from '@/routes/path';
import styled from '@emotion/styled';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';

interface MyTeamCardProps {
  teams: ITeamInfo[];
}

interface CustomArrowProps {
  onClick?: () => void;
  direction: string;
}

export const MyTeamCard = ({ teams }: MyTeamCardProps) => {
  const width = useWindowWidth();
  const isMobile = width <= breakpoints.mobile;

  const settings = {
    dots: teams.length > 1,
    infinite: teams.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    prevArrow: <CustomArrow direction="left" />,
    nextArrow: <CustomArrow direction="right" />,
    ...(isMobile && {
      appendDots: (dots: React.ReactNode) => {
        if (!Array.isArray(dots)) {
          return <ul>{dots}</ul>;
        }

        if (teams.length <= 3) {
          return <ul>{dots}</ul>;
        }

        const currentSlide = dots.findIndex((dot) =>
          dot.props.className.includes('slick-active')
        );

        const displayedDots = [];
        if (currentSlide === 0) {
          // 첫 번째 슬라이드일 경우
          displayedDots.push(dots[0], dots[1], dots[2]);
        } else if (currentSlide === teams.length - 1) {
          // 마지막 슬라이드일 경우
          displayedDots.push(
            dots[teams.length - 3],
            dots[teams.length - 2],
            dots[teams.length - 1]
          );
        } else {
          // 중간 슬라이드일 경우
          displayedDots.push(
            dots[currentSlide - 1],
            dots[currentSlide],
            dots[currentSlide + 1]
          );
        }

        return <ul>{displayedDots}</ul>;
      },
    }),
  };

  return (
    <>
      <PageSectionHeader h={40}>
        <Title src={crown} title="나의 팀" />
      </PageSectionHeader>
      <BackgroundGradient
        count={1}
        positions={[{ top: '-4px' }]}
        height="300px"
      />

      <Spacer h={isMobile ? 20 : 30} />

      <SliderWrapper>
        <Slider {...settings}>
          {teams.map((team) => (
            <div key={team.teamId}>
              <Box width={isMobile ? '90%' : '100%'} borderRadius="12px">
                <Flex justify="space-between">
                  {!isMobile && (
                    <Box width="260px" height="260px">
                      <Suspense>
                        <ImageContainer
                          src={team.imageUrl}
                          altText={team.teamName}
                          w="inherit"
                          h="inherit"
                          maxW={260}
                        />
                      </Suspense>
                    </Box>
                  )}
                  <Flex
                    direction="column"
                    justify="center"
                    align="center"
                    width={isMobile ? 40 : 30}
                  >
                    <SText
                      color="#333"
                      fontSize={isMobile ? '10px' : '16px'}
                      fontWeight={600}
                      fontFamily={'Pretendard'}
                    >
                      TEAM
                    </SText>
                    <Spacer h={isMobile ? 4 : 8} />
                    <SText
                      fontSize={isMobile ? '14px' : '32px'}
                      color="#333"
                      fontWeight={700}
                      whiteSpace="nowrap"
                      fontFamily={'Pretendard'}
                    >
                      {team.teamName}
                    </SText>
                    <Spacer h={isMobile ? 4 : 8} />
                    <SText
                      fontSize={isMobile ? '10px' : '16px'}
                      color="#777"
                      fontWeight={400}
                      fontFamily={'Pretendard'}
                    >
                      since {team.createdAt}
                    </SText>
                    <Spacer h={8} />
                    <Label>
                      <SText
                        fontSize={isMobile ? '8px' : '10px'}
                        fontWeight={600}
                        fontFamily={'Pretendard'}
                      >
                        {team.topic}
                      </SText>
                    </Label>
                    {!isMobile && (
                      <>
                        <Spacer h={24} />
                        <Flex direction="column" align="center" gap="10px">
                          <Button backgroundColor={colors.buttonPurple}>
                            {team.memberCount} members
                          </Button>
                        </Flex>
                      </>
                    )}
                  </Flex>
                  <Flex
                    direction="column"
                    justify="space-evenly"
                    align="center"
                    width={isMobile ? 50 : 35}
                  >
                    <Link
                      to={`${PATH.TEAM_DASHBOARD}/${team.teamId}`}
                      style={{ textDecoration: 'none' }}
                    >
                      <Box
                        width={isMobile ? '120px' : '272px'}
                        height={isMobile ? '40px' : '80px'}
                        padding={isMobile ? '20px 0px' : '0'}
                        borderWidth={isMobile ? '1px' : '3px'}
                        borderRadius={isMobile ? '6px' : '20px'}
                      >
                        <ClickImage src={click} />
                        <ActionText>
                          <SText
                            fontSize={isMobile ? '10px' : '20px'}
                            fontWeight={isMobile ? 600 : 700}
                            color="#333"
                            fontFamily={'Pretendard'}
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
          ))}
        </Slider>
      </SliderWrapper>
      <Spacer h={84} />
    </>
  );
};

const SliderWrapper = styled.div`
  width: 920px;
  margin: 0 auto;

  .slick-dots {
    bottom: -36px;
    .slick-active {
      button:before {
        font-size: 14px;
        opacity: 1;
        color: ${colors.buttonPurple};
      }
    }
    li {
      button:before {
        font-size: 14px;
        opacity: 1;
        color: ${colors.borderPurple};
      }
    }
  }

  @media (max-width: ${breakpoints.mobile}px) {
    max-width: 300px;
    border-radius: 20px;

    .slick-slide > * {
      position: relative;
      left: 5%;
    }

    .slick-dots {
      bottom: -28px;
      .slick-active {
        button:before {
          font-size: 10px;
        }
      }
      li {
        button:before {
          font-size: 10px;
        }
      }
    }
  }
`;

const CustomArrow: React.FC<CustomArrowProps> = ({ onClick, direction }) => (
  <ArrowButton onClick={onClick} direction={direction}>
    <ArrowImage src={Arrow} direction={direction} />
  </ArrowButton>
);

const ArrowButton = styled.div<{ direction: string }>`
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
  transform: translateY(-50%);
  ${({ direction }) =>
    direction === 'right' ? 'right: -90px;' : 'left: -90px;'}

  @media(max-width: ${breakpoints.mobile}px) {
    width: 30px;
    height: 60px;
    border-radius: 10px;

    ${({ direction }) =>
      direction === 'right' ? 'right: -24px;' : 'left: -24px;'}
  }
`;

const ArrowImage = styled.img<{ direction: string }>`
  width: auto;
  height: 52px;
  transform: ${({ direction }) =>
    direction === 'right' ? 'rotate(180deg)' : 'none'};

  @media (max-width: ${breakpoints.mobile}px) {
    height: 10px;
  }
`;

const ImageContainer = styled(LazyImage)`
  object-position: center;
  overflow: hidden;
  max-height: 230px;
`;

const ClickImage = styled.img`
  width: 24px;
  height: 24px;

  @media (max-width: ${breakpoints.mobile}px) {
    width: 16px;
    height: 16px;
  }
`;

const ActionText = styled.div`
  margin-left: 8px;
  color: #333;

  @media (max-width: ${breakpoints.mobile}px) {
    margin-left: 4px;
  }
`;
