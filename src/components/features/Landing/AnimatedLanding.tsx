import RightArrowIcon from "@/assets/Landing/right_arrow.svg";
import { Spacer } from "@/components/commons/Spacer";
import { PATH } from "@/routes/path";
import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";
import AnimatedImages from "./AnimatedImages";

export const AnimatedLanding = () => {

  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`${PATH.TEAM_RECRUIT}/list`);
  }
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
    <Button onClick={handleClick}>
      팀 찾아보기
      <Icon src={RightArrowIcon} className="icon"/>  
    </Button>
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
  width: 100%;
  position: relative;
`;

const Content = styled.div`
  display: flex;
  font-size: 18px;
  line-height: 1.4;
  color: #333;
  font-weight: 500;
`;

const Button = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  position: absolute;
  top: 0;
  right: 0;
  height: 74px;
  box-sizing: border-box;

  padding: 20px 28px;
  font-size: 20px;
  font-weight: bold;
  color: white;
  background: #333;
  border-radius: 9999px;

  width: 180px;
  transition: width 0.3s ease, background 0.3s ease;
  overflow: hidden;
  cursor: pointer;

  .icon {
    opacity: 0;
    transform: translateX(-8px);
    transition: all 0.3s ease;
    width: 0;
    height: 0;
  }

  &:hover {
    width: 220px;

    .icon {
      opacity: 1;
      transform: translateX(0);
      width: 24px;
      height: 24px;
    }
  }
`;

const Icon = styled.img`
  display: inline-flex;
`;
