import { Spacer } from "@/components/commons/Spacer";
import styled from "@emotion/styled";
import AnimatedImages from "./AnimatedImages";

export const AnimatedLanding = () => {
  return (
    <Container>
      <AnimatedImages />
      <Spacer h={80} />
    <ContentContainer>
    <div>
      <Content>이미 약 100명의 개발자가</Content>
      <Content>코몬에서 팀원들과 풀이를 공유하고 있어요.</Content>
    </div>
    <div>
      <Content>우리 모두 꾸준히 해야한다는 걸 알면서</Content>
      <Content>조금씩 미루곤 하는 코테 준비.</Content>
    </div>
    <div>
      <Content>코몬에서 알맞은 팀을 찾거나, 혹은 새로 팀을 만들어</Content>
      <Content>목표를 향해 달려가 보는 건 어떨까요?</Content>
    </div>
    <div>
      <Content>함께 가면 더 멀리 갈 수 있으니까요!</Content>
    </div>
    </ContentContainer>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 0 195px;
  box-sizing: border-box;
`;


const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Content = styled.div`
  display: flex;
  font-size: 18px;
  line-height: 1.4;
  color: #333;
  font-weight: 500;
`;