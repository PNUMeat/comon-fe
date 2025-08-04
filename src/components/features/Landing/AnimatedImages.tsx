import BackLeft from '@/assets/Landing/ampersand.png';
import LogoBox from "@/assets/Landing/logo_box.png";
import StarText from "@/assets/Landing/star_text.png";
import FrontLeft from '@/assets/Landing/twisted_4.png';
import FrontRight from '@/assets/Landing/twisted_5.png';
import BackRight from '@/assets/Landing/twisted_6.png';
import { breakpoints } from '@/constants/breakpoints';
import { useWindowWidth } from '@/hooks/useWindowWidth';
import styled from '@emotion/styled';
import { useEffect, useRef, useState } from 'react';

const BackgroundGroup = () => {
  const [ratio, setRatio] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [direction, setDirection] = useState<'up' | 'down' | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const isMobile = useWindowWidth() < breakpoints.mobile;

  const isInViewport = (el: HTMLElement) => {
    const rect = el.getBoundingClientRect();
    return rect.top < window.innerHeight && rect.bottom > 0;
  };

  useEffect(() => {
    const preventScroll = (e: Event) => {
      e.preventDefault();
    };
  
    if (isAnimating && !isMobile) {
      window.addEventListener('wheel', preventScroll, { passive: false });
      window.addEventListener('touchmove', preventScroll, { passive: false });
    } else {
      window.removeEventListener('wheel', preventScroll);
      window.removeEventListener('touchmove', preventScroll);
    }
  
    return () => {
      window.removeEventListener('wheel', preventScroll);
      window.removeEventListener('touchmove', preventScroll);
    };
  }, [isAnimating, isMobile]);
  
  

  const onWheel = (e: WheelEvent) => {
    if (isMobile) return;
    if (!wrapperRef.current || !isInViewport(wrapperRef.current)) return;
    if (isAnimating) {
      e.preventDefault();
      return;
    }
    if (e.deltaY > 0 && ratio === 0) {
      e.preventDefault();
      setDirection('down');
    }
    if (e.deltaY < 0 && ratio === 1) {
      e.preventDefault();
      setDirection('up');
    }
  };

  useEffect(() => {
    if (isMobile) return;
    window.addEventListener('wheel', onWheel, { passive: false });
    return () => window.removeEventListener('wheel', onWheel);
  }, [isAnimating, ratio, isMobile]);

  useEffect(() => {
    if (!direction) return;
  
    setIsAnimating(true);
    let start: number | null = null;
    const from = ratio;
    const to = direction === 'down' ? 1 : 0;
    const duration = 1000;
  
    const animate = (t: number) => {
      if (start === null) start = t;
      const elapsed = t - start;
      const progress = Math.min(elapsed / duration, 1);
      const next = from + (to - from) * progress;
  
      setRatio(next);
  
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
        setDirection(null);
      }
    };
  
    requestAnimationFrame(animate);
  }, [direction]);
    

  return (

    <Wrapper ref={wrapperRef}>
      <InteractionContainer>
        <ContentWrapper>
          <FadeContent style={{ opacity: 1 - ratio }}>
            <TextContainer>
              <Title><span style={{ color: "#6E74FA" }}>코딩테스트</span> 준비해야 하지 않나요?</Title>
              <Title><span style={{color: "#F15CA7"}}>팀</span>을 찾고 꾸준히 풀어보세요</Title>
            </TextContainer>
          </FadeContent>

          <FadeContent style={{ opacity: ratio }}>
            <div style={{ marginTop: "12px" }}>
              <TextContainer>
                  <CodeText>const prepareCodingTest = () =&gt; &#123;</CodeText>
                  <CodeText>&nbsp;&nbsp;&nbsp;&nbsp;console.log("팀을 찾고 꾸준히 풀어보세요!");</CodeText>
                  <CodeText>&nbsp;&nbsp;&nbsp;&nbsp;return "코드몬스터";</CodeText>
                  <CodeText>&#125;;</CodeText>
                  <CodeText>&nbsp;</CodeText>
                  <CodeText>prepareCodingTest(); // 준비 시작!</CodeText>
              </TextContainer>
            </div>
          </FadeContent>
          <ImgContainer>
            <StarTextImg src={StarText} alt="Star Text" />
            <LogoBoxImg src={LogoBox} alt="Logo Box" />
          </ImgContainer>
        </ContentWrapper>
      </InteractionContainer>
      <Image1 ratio={ratio} src={FrontLeft} alt="bg1" />
      <Image2 ratio={ratio} src={FrontRight} alt="bg2" />
      <Image3 ratio={ratio} src={BackLeft} alt="bg3" />
      <Image4 src={BackRight} alt="bg4" />
    </Wrapper>
  );
};

export default BackgroundGroup;

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: 300px;
  overflow: hidden;

  @media (max-width: ${breakpoints.mobile}px) {
    height: 150px;
    overflow: visible;
  }
`;

const ContentWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
  `;
  
  const FadeContent = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: opacity 0.5s ease;
  pointer-events: none;

  @media (max-width: ${breakpoints.mobile}px) {
    display: flex;
    flex-direction: row;
    height: fit-content;
    align-items: center;
    justify-content: center;
  }
`;

const AnimatedImage = styled.img<{ ratio: number }>`
  position: absolute;
  will-change: transform, filter, opacity;
`;

const Image1 = styled(AnimatedImage)`
  bottom: 0;
  right: 0;
  width: 144px;
  height: 144px;
  transform: ${({ ratio }) =>
  ratio
    ? 'translateX(0) translateY(-62px) scale(0.8)'
    : 'translateX(calc(-50vw)) translateY(0) scale(1)'};
  filter: ${({ ratio }) => (ratio ? 'blur(0)' : 'blur(0)')};
  opacity: ${({ ratio }) => (ratio ? 1 : 1)};
  transition:
    transform 1s ease-in-out,
    filter 1s ease-in-out 0.5s,
    opacity 1s ease-in-out 0.5s;
  z-index: 2;

  @media (max-width: ${breakpoints.mobile}px) {
    position: absolute;
    width: 50px;
    height: 50px;
    filter: blur(0) !important;
    opacity: 1 !important;
    left: 50vw;
    top: 50px;
  }
`;

const Image2 = styled(AnimatedImage)`
  bottom: 62px;
  right: 0;
  width: 137px;
  height: 137px;
  transform: ${({ ratio }) =>
    ratio ? 'translate(-668px, -106px) scale(0.75)' : 'translate(0, 0) scale(1)'};
  filter: ${({ ratio }) => (ratio ? 'blur(4px)' : 'blur(0)')};
  opacity: ${({ ratio }) => (ratio ? 0.8 : 1)};
  transition:
    transform 1s ease-in-out,
    filter 1s ease-in-out 0.5s,
    opacity 1s ease-in-out 0.5s;

  @media (max-width: ${breakpoints.mobile}px) {
    width: 0px;
    height: 0px;
    filter: blur(0) !important;
    opacity: 1 !important;
  }
`;

const Image3 = styled(AnimatedImage)`
  top: 0;
  left: 145px;
  width: 162px;
  height: 182px;
  transform: ${({ ratio }) =>
    ratio ? 'translate(-135px, 140px) scale(1)' : 'translate(0, 0) scale(0.75)'};
  filter: ${({ ratio }) => (ratio ? 'blur(0)' : 'blur(4px)')};
  opacity: ${({ ratio }) => (ratio ? 1 : 0.8)};
  transition:
    transform 1s ease-in-out,
    filter 1s ease-in-out 0.5s,
    opacity 1s ease-in-out 0.5s;

  @media (max-width: ${breakpoints.mobile}px) {
    left: 30px;
    top: -15px;
    width: 48px;
    height: 52px;
    filter: blur(3px) !important;
    opacity: 1 !important;
  }
`;

const Image4 = styled.img`
  position: absolute;
  top: 128px;
  right: 260px;
  width: 98px;
  height: 98px;
  z-index: 1;

  @media (max-width: ${breakpoints.mobile}px) {
    top: 44px;
    right: 16px;
    width: 35px;
    height: 35px;
    opacity: 1 !important;
  }
`;

const InteractionContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 306px;
  z-index: 10;
  align-items: center;
  justify-content: center;
`;

const ImgContainer = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(calc(-50% - 420px));
  top: 48px;
  display: flex;
  gap: 3px;
  align-items: flex-start;
  z-index: 10;

  @media (max-width: ${breakpoints.mobile}px) {
    transform: none;
    left: 0;
    top: 25px;
    height: fit-content;
  }
`;

const StarTextImg = styled.img`
  width: 45px;
  height: 20px;
  margin-top: 5px;

  @media (max-width: ${breakpoints.mobile}px) {
    width: 18px;
    height: 8px;
    margin-top: 0;
  }
`;

const LogoBoxImg = styled.img`
  width: 70px;
  height: 40px;

  @media (max-width: ${breakpoints.mobile}px) {
    width: 26px;
    height: 16px;
  }
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  height: 228px;

  @media (max-width: ${breakpoints.mobile}px) {
    height: 100px;
    justify-content: center;
    margin-left: 42px;
  }
`;

const Title = styled.div`
  font-size: 50px;
  font-weight: 700;
  line-height: 1.4;
  color: #212529;

  @media (max-width: ${breakpoints.mobile}px) {
    font-size: 20px;
  }
`;

const CodeText = styled.span`
  color: #FF65B2;
  font-family: 'MoneygraphyPixel';
  font-size: 32px;
  font-style: normal;
  font-weight: 400;
  line-height: 38px;
  letter-spacing: 0.32px;
`;