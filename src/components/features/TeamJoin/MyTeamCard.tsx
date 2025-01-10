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

import { Link } from 'react-router-dom';
import Slider from 'react-slick';

import { ITeamInfo } from '@/api/team';
import Arrow from '@/assets/TeamJoin/carousel_arrow.png';
import click from '@/assets/TeamJoin/click.png';
import crown from '@/assets/TeamJoin/crown.png';
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
  const settings = {
    dots: teams.length > 1,
    infinite: teams.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    prevArrow: <CustomArrow direction="left" />,
    nextArrow: <CustomArrow direction="right" />,
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

      <Spacer h={30} />

      <SliderWrapper>
        <Slider {...settings}>
          {teams.map((team) => (
            <div key={team.teamId}>
              <Box width="100%">
                <Flex justify="space-between">
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
                    <SText
                      color="#333"
                      fontSize="16px"
                      fontWeight={600}
                      fontFamily={'Pretendard'}
                    >
                      TEAM
                    </SText>
                    <Spacer h={8} />
                    <SText
                      fontSize="40px"
                      color="#333"
                      fontWeight={700}
                      whiteSpace="nowrap"
                      fontFamily={'Pretendard'}
                    >
                      {team.teamName}
                    </SText>
                    <Spacer h={8} />
                    <SText
                      fontSize="16px"
                      color="#777"
                      fontWeight={400}
                      fontFamily={'Pretendard'}
                    >
                      since {team.createdAt}
                    </SText>
                    <Spacer h={8} />
                    <Label>
                      <SText
                        fontSize="10px"
                        fontWeight={600}
                        fontFamily={'Pretendard'}
                      >
                        {team.topic}
                      </SText>
                    </Label>
                    <Spacer h={24} />
                    <Flex direction="column" align="center" gap="10px">
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
                    <Link
                      to={`${PATH.TEAM_DASHBOARD}/${team.teamId}`}
                      style={{ textDecoration: 'none' }}
                    >
                      <Box
                        width="272px"
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
`;

const ArrowImage = styled.img<{ direction: string }>`
  width: auto;
  height: 52px;
  transform: ${({ direction }) =>
    direction === 'right' ? 'rotate(180deg)' : 'none'};
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
