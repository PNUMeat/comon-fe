import { useWindowWidth } from '@/hooks/useWindowWidth';

import { Container } from '@/components/commons/Container';
import { Flex } from '@/components/commons/Flex';
import { LazyImage } from '@/components/commons/LazyImage';
import { SText } from '@/components/commons/SText';
import { Spacer } from '@/components/commons/Spacer';
import { Wrap } from '@/components/commons/Wrap';
import { CommonLayout } from '@/components/layout/CommonLayout';
import { HeightInNumber } from '@/components/types';

import { ReactNode, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';

import comon from '@/assets/Home/comonBanner.png';
import achievement from '@/assets/Home/goalAchievement.svg';
import continually from '@/assets/Home/goalContinually.svg';
import together from '@/assets/Home/goalTogether.svg';
import { breakpoints } from '@/constants/breakpoints';
import { useBottomBound } from '@/pages/Home/useBottomBound.ts';
import { PATH } from '@/routes/path';
import styled from '@emotion/styled';

const HomeComment = styled.div`
  color: #333;
  text-align: center;
  font-family: 'Pretendard';
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 19px;
  letter-spacing: -0.32px;
  transform: translateY(-50px);

  @media (max-width: ${breakpoints.mobile}px) {
    font-size: 14px;
    font-weight: 500;
    letter-spacing: -0.28px;
    margin-top: 40px;
  }
`;

const StartButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 74px;
  padding: 23px 60px;
  border-radius: 40px;
  background: #333;
  cursor: pointer;
  color: #fff;
  text-align: center;
  font-family: 'Pretendard';
  font-size: 36px;
  font-weight: 400;

  @media (max-width: ${breakpoints.mobile}px) {
    width: 210px;
    height: 60px;
    font-size: 24px;
  }
`;

const GoalBox = styled.div<HeightInNumber>`
  height: ${(props) => props.h}px;
  display: flex;
  flex-direction: column;
  width: 316px;
  padding: 33px 66px 44px 66px;
  justify-content: center;
  align-items: center;
  border-radius: 20px;
  border: 1px solid #cdcfff;
  background: #fff;
  box-shadow: 5px 7px 11.6px 0px rgba(63, 63, 77, 0.07);

  @media (max-width: ${breakpoints.mobile}px) {
    width: 300px;
    padding: 24px 0;
  }
`;

const GoalTitle = styled.div`
  color: #333;
  text-align: center;
  font-family: Pretendard;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  margin: 15px 0;
  line-height: 19px;
  letter-spacing: -0.32px;
`;

const GoalSubtitle = styled.div`
  color: #333;
  text-align: center;
  font-family: Pretendard;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 19px;
  letter-spacing: -0.28px;
`;

const aims = [
  {
    title: 'TOGETHER',
    subtitle: '팀원들과 함께\n 꾸준히 남기는 공부 흔적',
    img: together,
  },
  {
    title: 'ACHIEVEMENT',
    subtitle: '연속으로 코몬하고\n실력 상승, 랭킹 상승!',
    img: achievement,
  },
  {
    title: 'EVERYDAY',
    subtitle: '매일매일 새로운 코딩테스트\n1일 1회 업로드!',
    img: continually,
  },
];

export const Home = () => {
  const navigate = useNavigate();
  const onClickStart = () => navigate(PATH.TEAMS);

  const { bottomRef, effectRef } = useBottomBound();
  const width = useWindowWidth();
  const isMobile = width <= breakpoints.mobile;

  return (
    <ScrollSnapContainer>
      <ScrollStart />
      <CommonLayout>
        <Container
          maxW={isMobile ? 310 : 1002}
          scrollSnapAlign={'end'}
          margin={'0 auto 100px auto'}
          transform={'translate(0, -30px)'}
        >
          <Flex direction={'column'} align={'center'}>
            <Suspense fallback={<BannerFallback />}>
              <LazyImage
                altText={'코몬 배너 이미지'}
                w={isMobile ? 310 : 940}
                maxW={isMobile ? 310 : 940}
                h={isMobile ? 200 : 491}
                src={comon}
              />
              <HomeComment>
                코드몬스터에서 팀원들과 {isMobile && <br />}함께 공부하고 흔적을
                남겨보세요.
                <br /> 당신의 기록이 곧 성장의 발판이 됩니다! 🚀
              </HomeComment>
            </Suspense>

            <Wrap>
              <StartButton onClick={onClickStart}>시작하기</StartButton>
            </Wrap>
            <Spacer h={90} />
            <Flex
              direction={isMobile ? 'column' : 'row'}
              justify="center"
              align="center"
              gap={'28px'}
            >
              {aims.map((aim) => (
                <GoalBox key={aim.title} h={140}>
                  <Suspense
                    fallback={
                      <div
                        style={{
                          backgroundColor: 'whitesmoke',
                          width: 40,
                          height: 40,
                        }}
                      />
                    }
                  >
                    <LazyImage
                      altText={'img for aim'}
                      w={40}
                      maxW={50}
                      h={40}
                      src={aim.img}
                    />
                  </Suspense>
                  <GoalTitle>{aim.title}</GoalTitle>
                  <GoalSubtitle>{aim.subtitle}</GoalSubtitle>
                </GoalBox>
              ))}
            </Flex>
          </Flex>
          <Spacer h={100} />
        </Container>
      </CommonLayout>
      <Spacer h={4} ref={bottomRef} width={400} />
      <div style={{ position: 'relative' }}>
        <WaitBox ref={effectRef}>
          <SText
            fontSize={'30px'}
            fontWeight={700}
            textAlign={'center'}
            color={'#6E74FA'}
            opacity={'0'}
          >
            공사중....
          </SText>
          <SText
            fontSize={'16px'}
            fontWeight={500}
            textAlign={'center'}
            color={'#777'}
            opacity={'0'}
          >
            다음 업데이트를 기대해주세요!
          </SText>
        </WaitBox>
      </div>
    </ScrollSnapContainer>
  );
};

const ScrollSnapContainer = styled.div`
  height: 100vh;
  width: 100vw;
  overflow-x: hidden;
  overflow-y: auto;
  scroll-snap-type: y mandatory;
  position: relative;
`;

const ScrollStart = styled.div`
  scroll-snap-align: start;
`;

const WaitBox = styled.div`
  width: 100%;
  opacity: 1;
  height: 200px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: end;
  align-items: center;
  padding-bottom: 135px;
  gap: 10px;
  position: absolute;
  transform: translate(0, -100px);

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 150px;

    background: linear-gradient(
      to top,
      rgba(128, 128, 128, 1) 0%,
      rgba(255, 255, 255, 0) 100%
    );

    pointer-events: none;
  }
`;

const BannerFallbackText: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  return (
    <SText whiteSpace={'no-wrap'} fontFamily={'Noto Sans KR'}>
      {children}
    </SText>
  );
};

const BannerFallback = () => {
  return (
    <Flex height={491} direction={'column'} justify={'center'} align={'center'}>
      <BannerFallbackText>
        ░█████╗░░█████╗░███╗░░░███╗░█████╗░███╗░░██╗
      </BannerFallbackText>
      <BannerFallbackText>
        ██╔══██╗██╔══██╗████╗░████║██╔══██╗████╗░██║
      </BannerFallbackText>
      <BannerFallbackText>
        ██║░░╚═╝██║░░██║██╔████╔██║██║░░██║██╔██╗██║
      </BannerFallbackText>
      <BannerFallbackText>
        ██║░░██╗██║░░██║██║╚██╔╝██║██║░░██║██║╚████║
      </BannerFallbackText>
      <BannerFallbackText>
        ╚█████╔╝╚█████╔╝██║░╚═╝░██║╚█████╔╝██║░╚███║
      </BannerFallbackText>
      <BannerFallbackText>
        ░╚════╝░░╚════╝░╚═╝░░░░░╚═╝░╚════╝░╚═╝░░╚══╝
      </BannerFallbackText>
    </Flex>
  );
};
