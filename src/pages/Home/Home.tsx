// import { Container } from '@/components/commons/Container';
import { Flex } from '@/components/commons/Flex';
import { SText } from '@/components/commons/SText';
import { Spacer } from '@/components/commons/Spacer';
import { QnAList } from '@/components/features/Home/QnAList';
import { CommonLayout } from '@/components/layout/CommonLayout';

import GroupIcon from '@/assets/Landing/group_icon.svg';
import ManageIcon from '@/assets/Landing/manage_icon.svg';
import RecordIcon from '@/assets/Landing/record_icon.svg';

import { Fragment } from 'react';

import logo from '@/assets/Header/logo.svg';
import bgCurve from '@/assets/Home/bg-curve.svg';
import bgRing from '@/assets/Home/bg-ring.svg';
import bgZigzag from '@/assets/Home/bg-zigzag.svg';
import faq from '@/assets/Home/faq.svg';
import logoLight from '@/assets/Home/logo-light.svg';
import { AnimatedLanding } from '@/components/features/Landing/AnimatedLanding';
import { Banner } from '@/components/features/Landing/Banner';
import ServiceStrength from '@/components/features/Landing/ServiceStrength';
import UsageExample from '@/components/features/Landing/UsageExample';
import { breakpoints } from '@/constants/breakpoints';
import styled from '@emotion/styled';

export const Home = () => {
  // const navigate = useNavigate();
  // const onClickStart = () => navigate(`${PATH.TEAM_RECRUIT}/list`);

  return (
    <Fragment>
      <CommonLayout>
        {/* 민경 */}
        <Section backgroundColor="#fff">
          <AnimatedLanding />
        </Section>
        <Section backgroundColor="#FAFAFF">
          <Decoration src={bgZigzag} top="180px" left="20%" />
          <Decoration src={bgRing} top="150px" right="20%" />
          <Decoration src={bgCurve} top="270px" right="27%" width="60px" />

          <SubHeader text="코드몬스터 서비스 소개!" theme="dark" />
          <Spacer h={44} />
          <SText
            color="#111"
            textAlign="center"
            fontFamily="Pretendard"
            fontSize="42px"
            fontWeight={700}
            lineHeight="60px"
          >
            혼자서는 지치기 쉬운 코딩테스트,
            <br />
            팀과 함께 꾸준히 한 걸음!
          </SText>
          <Spacer h={40} />
          <SText
            color="#767676"
            textAlign="center"
            fontFamily="Pretendard"
            fontSize="20px"
            fontWeight={300}
            lineHeight="34px"
          >
            코드몬스터는 코딩테스트 준비를 위한 스터디 플랫폼입니다.
            <br />
            개발자들과 대학생들이 체계적으로 문제를 풀고,
            <br />
            풀이를 공유하며 지속적인 성장을 이끌어내는 커뮤니티입니다.
          </SText>
          <Spacer h={50} />
          <div style={{ display: 'flex', gap: '27px' }}>
          <Banner
            title="팀 스터디 관리"
            description1="팀원과 함께 목표를 설정하고, 매일"
            description2="문제 풀이 현황을 공유해보세요."
            src={ManageIcon}
          />
          <Banner
            title="풀이 기록 & 회고"
            description1="나만의 풀이를 기록하고, 팀원과 피드백을"
            description2="주고받으며 회고 문화를 만들어갑니다."
            src={RecordIcon}
          />
          <Banner
            title="스터디 그룹"
            description1="목표와 실력이 비슷한 동료들을 찾고,"
            description2="직접 팀을 구성하거나 기존 팀에 참여할 수 있습니다."
            src={GroupIcon}
          />
          </div>
          {/* TODO: 카드 3개 영역 */}
        </Section>

        <Section backgroundColor="#fff">
          <SubHeader text="이렇게 사용해보세요!" theme="dark" />
          <UsageExample />
        </Section>

        <Section backgroundColor="#000">
          <SubHeader text="코드몬스터 서비스 소개!" theme="light" />
          <ServiceStrength />
        </Section>

        {/* 지수 */}
        {/* <Section>
          <SubHeader text="코드몬스터 서비스 소개!" theme="dark" />
          <Spacer h={40} />
          <SText
            color="#111"
            textAlign="center"
            fontFamily="Pretendard"
            fontSize="36px"
            fontWeight={900}
          >
            함께한 사람들의 후기
          </SText>
          <Spacer h={20} />
          <SText
            color="#767676"
            textAlign="center"
            fontFamily="Pretendard"
            fontSize="24px"
            fontWeight={300}
          >
            코드몬스터와 함께 성장한 동료들의 생생한 후기✨
          </SText>
          <Spacer h={86} />
          <ReviewSlider />
          <Spacer h={80} />
          <Ellipse />
        </Section> */}

        <Section>
          <SText
            color="#111"
            textAlign="center"
            fontFamily="Pretendard"
            fontSize="36px"
            fontWeight={900}
          >
            FAQ
          </SText>
          <Spacer h={20} />
          <SText
            color="#767676"
            textAlign="center"
            fontFamily="Pretendard"
            fontSize="24px"
            fontWeight={300}
          >
            궁금한 점이 있으신가요? 자주 묻는 질문을 모아봤어요!
          </SText>
          <Spacer h={10} />
          <img src={faq} alt="FAQ" />
          <Spacer h={32} />
          <QnAList />
        </Section>

        {/* <Section backgroundColor="#fff">
          <Decoration src={bgZigzag} top="140px" left="20%" />
          <Decoration src={bgRing} top="140px" right="20%" />
          <Decoration src={bgCurve} top="220px" right="27%" width="60px" />
          <img src={name} alt="코드몬스터!" />
          <Spacer h={32} />
          <SText
            color="#767676"
            textAlign="center"
            fontFamily="Pretendard"
            fontSize="24px"
            fontWeight={300}
            lineHeight="34px"
          >
            코드몬스터에서 팀원들과 함께 공부 흔적을 남겨보세요.
            <br />
            당신의 기록이 곧 성장의 발판이 됩니다! 🚀
          </SText>
          <Spacer h={50} />
          <StartButton onClick={onClickStart}>시작하기 &rarr;</StartButton>
          <Spacer h={60} />
          <Flex justify="space-between" style={{ width: '80px' }}>
            <img src={instagram} alt="instagram" />
            <img src={notion} alt="notion" />
          </Flex>
          <Spacer h={240} />
        </Section> */}
      </CommonLayout>
    </Fragment>
  );
};

const Section = styled.section<{ backgroundColor?: string }>`
  position: relative;
  background: ${({ backgroundColor }) => backgroundColor || '#fafaff'};
  padding: 90px 0;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: ${breakpoints.mobile}px) {
    padding: 40px 0;
  }
`;

const SubHeader = ({
  text,
  theme,
}: {
  text: string;
  theme: 'dark' | 'light';
}) => {
  return (
    <Flex direction="column">
      <Logo src={theme === 'dark' ? logo : logoLight} alt={'logo'} />
      <Spacer h={12} />
      <SText
        color={theme === 'dark' ? '#333' : '#D5D5D5'}
        fontFamily="Pretendard"
        fontSize="28px"
        fontWeight={900}
        textAlign="center"
      >
        {text}
      </SText>
    </Flex>
  );
};

const Logo = styled.img`
  height: 16px;
`;

// const Ellipse = styled.div`
//   width: 900px;
//   height: 19px;
//   border-radius: 900px;
//   background: rgba(212, 212, 212, 0.4);
//   filter: blur(8px);
//   border-radius: 50%;
// `;

const Decoration = styled.img<{
  top: string;
  left?: string;
  right?: string;
  width?: string;
}>`
  position: absolute;
  top: ${({ top }) => top};
  left: ${({ left }) => left};
  right: ${({ right }) => right};
  width: ${({ width }) => width || '120px'};
  opacity: 0.8;
  z-index: 1;
`;

// const StartButton = styled.button`
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   height: 74px;
//   padding: 24px 40px 24px 52px;
//   gap: 4px;
//   border-radius: 40px;
//   background: #333;
//   color: #fff;
//   font-size: 36px;
//   font-weight: 400;
// `;
