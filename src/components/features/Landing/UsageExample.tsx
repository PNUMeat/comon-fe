import CaretLeftIcon from '@/assets/Landing/caret_left.svg';
import CaretRightIcon from '@/assets/Landing/caret_right.svg';
import exampleImage1 from '@/assets/Landing/example_img1.png';
import exampleImage2 from '@/assets/Landing/example_img2.png';
import exampleImage3 from '@/assets/Landing/example_img3.png';
import Twisted1 from '@/assets/Landing/twisted_1.png';
import Twisted2 from '@/assets/Landing/twisted_2.png';
import Twisted3 from '@/assets/Landing/twisted_3.png';
import { Spacer } from '@/components/commons/Spacer';
import { breakpoints } from '@/constants/breakpoints';
import { useWindowWidth } from '@/hooks/useWindowWidth';
import styled from '@emotion/styled';
import { useRef } from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";

const usageExamples = (isMobile: boolean) => [
  {
    title: '코테 기록을 더 쉽게! ✨',
    content: isMobile ? [
      '오늘의 문제 풀이에서 바로 문제를 펼쳐보고 작성해보세요!',
      '기본적인 마크다운 단축키와 코드블록으로',
      '깔끔한 입력을 지원합니다 ✨'
    ] : [
      '오늘의 문제 풀이에서 바로 문제를 펼쳐보고 작성해보세요!',
      '기본적인 마크다운 단축키와 코드블록으로 깔끔한 입력을 지원합니다 ✨',
    ],
    image: exampleImage1,
    style: { width: '476px', height: '357px' },
    mobileStyle: { width: '238px', height: '178px' },
  },
  {
    title: '꾸준한 학습습관 만들기🏃',
    content: isMobile ? [
      '날마다 팀원들과 함께 활동을 기록하세요!',
      '캘린더를 통해 문제를 확인하고,',
      '하루에 한 문제를 함께 풀어보아요✨'
    ] : [
      '날마다 팀원들과 함께 활동을 기록하세요!',
      '캘린더를 통해 문제를 확인하고, 하루에 한 문제를 함께 풀어보아요✨',
    ],
    image: exampleImage2,
    style: { width: '944px', height: '357px' },
    mobileStyle: { width: '280px', height: '160px' },
  },
  {
    title: '나에게 맞는 팀을 찾아보세요!',
    content: [
      '나의 코드테스트 목표와 레벨에 맞는 팀을 찾아보세요!',
      '원하는 팀에 참여하거나 직접 팀을 꾸려 함께 성장해봐요✨',
    ],
    image: exampleImage3,
    style: { width: '680px', height: '357px' },
    mobileStyle: { width: '280px', height: '160px' },
  },
];

const UsageExampleCard = ({ index }: { index: number }) => {
  const isMobile = useWindowWidth() < breakpoints.mobile;
  const { title, content, image, style, mobileStyle } = usageExamples(isMobile)[index];

  return (
    <Container>
      <TitleBox>{title}</TitleBox>
      <MainBox>
        <ContentContainer>
          <Spacer h={isMobile ? 4 : 14} />
          <ContentText>{content[0]}</ContentText>
          <ContentText>{content[1]}</ContentText>
          { content[2] && <ContentText>{content[2]}</ContentText> }
        </ContentContainer>
        <Spacer h={12} />
        <img src={image} alt="example" style={isMobile ? mobileStyle : style} />
      </MainBox>
      <TwistedDecoration1 src={Twisted1} alt="twisted" />
      <TwistedDecoration2 src={Twisted2} alt="twisted" />
      <TwistedDecoration3 src={Twisted3} alt="twisted" />
    </Container>
  );
};

export const UsageExample = () => {
  const sliderRef = useRef<Slider>(null);
  const isMobile = useWindowWidth() < breakpoints.mobile;

  return (
    <SliderWrapper>
      <div className="slider-container" style={{ position: 'relative', width: isMobile ? '340px' : '950px' }}>
      <StyledSlider
        ref={sliderRef}
        dots={false}
        infinite={true}
        speed={500}
        slidesToShow={1}
        slidesToScroll={1}
        arrows={false}
      >
          <UsageExampleCard index={0} />
          <UsageExampleCard index={1} />
          <UsageExampleCard index={2} />
      </StyledSlider>
      </div>

      <NavButton style={{ left: isMobile ? 0 : -10, top: isMobile ? 220 : 320}} onClick={() => sliderRef.current?.slickPrev()}>
        <CaretIcon src={CaretLeftIcon} alt="prev" />
      </NavButton>
      <NavButton style={{ right: isMobile ? 0 : -10, top: isMobile ? 220 : 320}} onClick={() => sliderRef.current?.slickNext()}>
        <CaretIcon src={CaretRightIcon} alt="next" />
      </NavButton>
    </SliderWrapper>
  );
};

const StyledSlider = styled(Slider)`
  width: 100%;
  .slick-slide,
  .slick-track {
    width: 950px;
    height: 600px;
}
  .slick-list {
    background: transparent !important;
    box-shadow: none !important;
    border: none !important;
  }

  @media (max-width: ${breakpoints.mobile}px) {
    .slick-slide,
    .slick-track {
      width: 340px;
      height: 400px;
    }
  }
`;

const SliderWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: flex-start;
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

  @media (max-width: ${breakpoints.mobile}px) {
    transform: translateY(-100%);
    width: 28px;
    height: 28px;
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

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  margin-top: 64px;
  width: 100%;
  height: 100%;

  @media (max-width: ${breakpoints.mobile}px) {
    margin-top: 48px;
  }
`;

const MainBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 900px;
  height: 518px;
  background-color: #FFFFFF66;
  box-shadow: 2px 2px 20px 0px #5E609933;
  border-radius: 40px;
  border: 3px solid #FFFFFF;
  justify-content: center;
  align-items: center;

  @media (max-width: ${breakpoints.mobile}px) {
    width: 314px;
    height: 288px;
    justify-content: flex-start;
    padding-top: 30px;
    box-sizing: border-box;
    z-index: 1;
    border: 1.5px solid #FFFFFF;
    border-radius: 20px;
  }
`;

const TitleBox = styled.div`
  position: absolute;
  top: -40px;
  left: 50%;
  transform: translateX(-50%);
  width: 376px;
  height: 68px;
  border-radius: 100px;
  box-shadow: 0px 4px 10px 0px #0000000A;
  background: #FCFCFF;
  z-index: 2;
  color: #111111;
  font-size: 28px;
  font-weight: 600;
  justify-content: center;
  align-items: center;
  display: flex;

  @media (max-width: ${breakpoints.mobile}px) {
    width: 188px;
    height: 34px;
    top: -20px;
    font-size: 16px;
  }
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ContentText = styled.div`
  font-size: 18px;
  color: #111;
  font-weight: 400;
  line-height: 1.4;
  text-align: center;

  @media (max-width: ${breakpoints.mobile}px) {
    font-size: 12px;
  }
`;

const TwistedDecoration1 = styled.img`
  position: absolute;
  top: 31px;
  left: 96px;
  width: 74px;
  height: 74px;

  @media (max-width: ${breakpoints.mobile}px) {
    top: -30px;
    left: 0px;
    width: 62px;
    height: 62px;
  }
`;

const TwistedDecoration2 = styled.img`
  position: absolute;
  top: 31px;
  right: 88px;
  width: 72px;
  height: 72px;

  @media (max-width: ${breakpoints.mobile}px) {
    top: -30px;
    right: 0px;
    width: 62px;
    height: 62px;
  }
`;

const TwistedDecoration3 = styled.img`
  position: absolute;
  top: 101px;
  right: 159px;
  width: 35px;
  height: 35px;

  @media (max-width: ${breakpoints.mobile}px) {
    top: 20px;
    right: 70px;
    width: 30px;
    height: 30px;
  }
`;

export default UsageExample;
