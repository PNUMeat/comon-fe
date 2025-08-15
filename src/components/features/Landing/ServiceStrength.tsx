import HalfComonImage from "@/assets/Landing/half_comon.png";
import { Spacer } from "@/components/commons/Spacer";
import FeatureCard from "@/components/features/Landing/FeatureCard";
import { breakpoints } from "@/constants/breakpoints";
import { useWindowWidth } from "@/hooks/useWindowWidth";
import styled from "@emotion/styled";

const content = [
  {
    title: "손쉬운 관리, 한 눈에 보는 기록",
    content: "내가 푼 코딩테스트 문제들을 캘린더에서 쉽게 찾아보고, 풀이 과정을 회고 하며 체계적으로 관리할 수 있습니다",
    tag1: "팀 캘린더",
    tag2: "마이페이지"
  },
  {
    title: "편한 코드 입력, 코드블럭",
    content: "자동 들여쓰기와 문법 강조 기능이 지원되는 코드블럭으로, 복잡한 풀이도 깔끔하게 기록하고 공유할 수 있습니다",
    tag1: "코드블럭",
    tag2: "오늘의풀이"
  },
  {
    title: "함께하는 성장, 팀으로 함께",
    content: "목표가 같은 동료들과 팀을 이루어 서로의 성장을 돕고, 풀이를 비교 분석하며 더 빠르게 성장해보세요.",
    tag1: "팀 페이지",
    tag2: "팀모집"
  }
];


export const ServiceStrength = () => {
  const isMobile = useWindowWidth() < breakpoints.mobile;
  return (
    <Container>
      <Spacer h={44} />
      <Title>"코드몬스터만의 강점"</Title>
      <Spacer h={isMobile ? 40 : 86} /> 
      <CardContainer>
        {content.map((item, index) => (
          <FeatureCard
            key={index}
            title={item.title}
            content={item.content}
            tag1={item.tag1}
            tag2={item.tag2}
          />
        ))}
      </CardContainer>
      <HalfComonImg src={HalfComonImage} />
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Title = styled.div`
  font-size: 42px;
  font-weight: 700;
  color: #fff;

  @media (max-width: ${breakpoints.mobile}px) {
    font-size: 21px;
  }
`;

const CardContainer = styled.div`
  display: flex;
  gap: 27px;
  margin-bottom: 200px;

  @media (max-width: ${breakpoints.mobile}px) {
    flex-direction: column;
    margin-bottom: 60px;
  }
`;

const HalfComonImg = styled.img`
  width: 411px;
  height: auto;
  margin-top: 20px;
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);

  @media (max-width: ${breakpoints.mobile}px) {
    width: 200px;
  }
`;

export default ServiceStrength;