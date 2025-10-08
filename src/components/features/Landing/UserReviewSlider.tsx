import { Spacer } from '@/components/commons/Spacer';

import { useEffect, useRef, useState } from 'react';
import Slider from 'react-slick';

import CaretLeftIcon from '@/assets/Landing/caret_left.svg';
import CaretRightIcon from '@/assets/Landing/caret_right.svg';
import { breakpoints } from '@/constants/breakpoints';
import styled from '@emotion/styled';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';

const reviewList = [
  {
    name: '김철수',
    position: '코몬_4days',
    content: '"처음엔 코드테스트가 낯설었지만, 팀과 함께 학습하며 자신감이 생겼어요. 못하던 부분도 차근차근 극복해나가는 과정이 가장 큰 수확이었습니다!"',
    color: '#FF5780',
  },
  {
    name: '애순이',
    position: '코몬_4days',
    content: '"코몬 4days의 루틴이 제게는 약이 됐어요. \'오늘은 쉴까\' 했던 날도 팀원들의 인증 사진을 보면 결국 책상 앞에 앉게 되더라구요. 3개월간 주 4회+α로 풀며 카카오 코테 1차를 통과할 만큼 실력이 쑥쑥 자랐습니다!"',
    color: '#6E74FA',
  },
  {
    name: '홍길동',
    position: '코몬_4days',
    content: '"원래 일주일에 한두 문제 풀던 제가, 코몬 4days 팀에 합류하니 일주일 4회는 기본이 되더라고요. 처음엔 벅찼지만, 팀원들과 서로 리마인드하고 피드백 주고받으니 2달 만에 목표했던 실버 등급 달성까지 성공했어요!"',
    color: ' #FF5780',
  },
  {
    name: '족발',
    position: '코몬_6days',
    content:
      '"혼자서는 매일 하기 힘들던 코테를, 팀원들과 약속으로 꾸준히 풀게 됐어요. 특히 스터디 전용 깃허브에 기록하니 빠진 날엔 바로 채워야 한다는 책임감이 생기더라구요. 덕분에 이전보다 문제 유형 분석 속도가 2배 빨라졌네요!"',
    color: '#F15CA7',
  },
  {
    name: '동대구',
    position: '싸피 a형 대비방',
    content: '"매일 성실하게 문제를 풀다 보니, 어려웠던 유형도 자연스럽게 익혀졌어요. 함께 공부하는 동기부여가 되어 더 열심히 할 수 있었던 것 같아요!"',
    color: '#6E74FA',
  },
];

const ReviewCard = ({
  name,
  position,
  content,
  color,
}: {
  name: string;
  position: string;
  content: string;
  color: string;
}) => {
  return (
    <CardContainer>
      <Content>{content}</Content>
      <NameContainer>
        <Circle style={{ backgroundColor: color }} />
        <Name>{name}</Name>
        <Position>{position}</Position>
      </NameContainer>
    </CardContainer>
  );
};

export const UserReviewSlider = () => {
  const sliderRef = useRef<Slider>(null);
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' && window.innerWidth < breakpoints.mobile
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < breakpoints.mobile);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const settings = {
    className: 'center',
    centerMode: true,
    infinite: true,
    slidesToShow: isMobile ? 1 : 3,
    slidesToScroll: 1,
    speed: 500,
    responsive: [
      {
        breakpoint: breakpoints.mobile,
        settings: {
          slidesToShow: 1,
          centerPadding: '145px',
          centerMode: true,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          centerMode: true,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <>
      <Title>함께한 사람들의 후기</Title>
      <SubTitle>코드몬스터와 함께 성장한 동료들의 생생한 후기✨</SubTitle>
      <Spacer h={isMobile ? 48 : 86} />
      <SliderWrapper>
        <div
          className="slider-container"
          style={{
            position: 'relative',
            width: isMobile ? '390px' : '1440px',
            maxWidth: '1440px',
            overflow: 'hidden',
          }}
        >
          <StyledSlider ref={sliderRef} {...settings}>
            {reviewList.map((review, index) => (
              <ReviewCard key={index} {...review} />
            ))}
          </StyledSlider>
        </div>
        <NavButtonPrev onClick={() => sliderRef.current?.slickPrev()}>
          <CaretIcon src={CaretLeftIcon} alt="prev" />
        </NavButtonPrev>
        <NavButtonNext onClick={() => sliderRef.current?.slickNext()}>
          <CaretIcon src={CaretRightIcon} alt="next" />
        </NavButtonNext>
      </SliderWrapper>
      <Spacer h={isMobile ? 20 : 80} />
      <Shadow />
    </>
  );
};

const Title = styled.div`
  font-size: 36px;
  font-weight: 700;
  color: #111;
  margin-bottom: 20px;

  @media (max-width: ${breakpoints.mobile}px) {
    font-size: 24px;
    margin-bottom: 10px;
  }
`;
const SubTitle = styled.div`
  font-size: 24px;
  font-weight: 300;
  color: #111;

  @media (max-width: ${breakpoints.mobile}px) {
    font-size: 14px;
  }
`;

const StyledSlider = styled(Slider)`
  .slick-list {
    box-sizing: content-box;
    margin: 0 100px;
    @media (max-width: ${breakpoints.mobile}px) {
      margin: 0 -120px;
    }
  }
  .slick-slide {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px 0;
    box-sizing: border-box;
  }

  .slick-center .review-card {
    z-index: 10;
  }
`;

const SliderWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  box-sizing: border-box;
  padding: 20px 0;
`;

const NavButton = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 56px;
  height: 56px;
  border-radius: 100px;
  background-color: #00000029;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;

  @media (max-width: ${breakpoints.mobile}px) {
    width: 28px;
    height: 28px;
  }
`;

const NavButtonPrev = styled(NavButton)`
  left: 50%;
  transform: translateY(-50%) translateX(-500px);

  @media (max-width: ${breakpoints.mobile}px) {
    left: 15px;
    transform: translateY(-50%) translateX(-50%);
  }
`;

const NavButtonNext = styled(NavButton)`
  right: 50%;
  transform: translateY(-50%) translateX(500px);

  @media (max-width: ${breakpoints.mobile}px) {
    right: 0;
    transform: translateY(-50%);
  }
`;

const CaretIcon = styled.img`
  width: 24px;
  height: 24px;
  @media (max-width: ${breakpoints.mobile}px) {
    width: 12px;
    height: 12px;
  }
`;

const CardContainer = styled.div`
  position: relative;
  padding: 30px 40px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 316px;
  height: 180px;
  border-radius: 20px;
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  box-sizing: border-box;
  transition:
    transform 0.3s ease-in-out,
    border 0.3s ease-in-out;
  border: 1px solid transparent;

  .slick-center & {
    transform: scale(1.05);
    border: 1px solid #8488ec !important;
    z-index: 10;
  }

  @media (max-width: ${breakpoints.mobile}px) {
    width: 316px;
    height: 180px;
    padding: 35px 26px;
  }
`;

const Circle = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;

  @media (max-width: ${breakpoints.mobile}px) {
    width: 18px;
    height: 18px;
  }
`;

const Name = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #333;

  @media (max-width: ${breakpoints.mobile}px) {
    font-size: 14px;
  }
`;

const Position = styled.div`
  font-size: 14px;
  color: #111;
  font-weight: 400;

  @media (max-width: ${breakpoints.mobile}px) {
    font-size: 12px;
  }
`;

const Content = styled.div`
  font-size: 14px;
  color: #767676;
  line-height: 19px;
  font-weight: 400;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 4;

  .slick-center & {
    color: #111 !important;
  }

  @media (max-width: ${breakpoints.mobile}px) {
    font-size: 12px;
    line-height: 18px;
    -webkit-line-clamp: 3;
  }
`;

const NameContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: auto;
  padding-top: 10px;
`;

const Shadow = styled.div`
  background: #d4d4d466;
  filter: blur(4px);
  width: 60%;
  border-radius: 50%;
  height: 19px;

  @media (max-width: ${breakpoints.mobile}px) {
    width: 100%;
    height: 10px;
  }
`;

export default UserReviewSlider;
