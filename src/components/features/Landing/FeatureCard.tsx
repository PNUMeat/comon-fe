import { Spacer } from "@/components/commons/Spacer";
import styled from "@emotion/styled";

interface FeatureCardProps {
  title: string;
  content: string;
  tag1: string;
  tag2: string;
};

export const FeatureCard = ({title, content, tag1, tag2}: FeatureCardProps) => {
  return (
    <CardWrapper>
      <CardBackground>
      <CardContainer>
        <CardTitle>{title}</CardTitle>
        <Spacer h={12} />
        <CardContent>{content}</CardContent>
        <Spacer h={20} />
        <CardTagContainer>
          <CardTag>{tag1}</CardTag>
          <CardTag>{tag2}</CardTag>
        </CardTagContainer>
      </CardContainer>
      </CardBackground>
    </CardWrapper>
  );
}

const CardWrapper = styled.div`
  background: linear-gradient(235.72deg, #848484 11.56%, #1E1E1E 88.44%);
  border-radius: 20px;
  padding: 0.5px;
  width: 316px;
  height: 204px;
`;

const CardBackground = styled.div`
  width: 316px;
  height: 204px;
  background: #000;
  border-radius: 20px;
`;


const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  background: linear-gradient(67.79deg, rgba(38, 38, 38, 0.4) 78.95%, rgba(110, 116, 250, 0.4) 99.25%);
  border-radius: 20px;
  box-shadow: 2px 2px 20px 0px #5E609933;
  box-sizing: border-box;
  padding: 36px;
  width: 316px;
  height: 204px;
`;

const CardTitle = styled.div`
  font-size: 18px;
  line-height: 19px;
  font-weight: 600;
  color: #fff;
`;

const CardContent = styled.div`
  font-size: 14px;
  line-height: 19px;
  font-weight: 500;
  color: #A7A7A7;
`;

const CardTagContainer = styled.div`
  display: flex;
  gap: 10px;
`;

const CardTag = styled.div`
  font-size: 12px;
  color: #fff;
  width: 70px;
  height: 24px;
  background-color: #434697;
  border-radius: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
`;

export default FeatureCard;