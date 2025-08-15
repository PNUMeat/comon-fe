import { Spacer } from "@/components/commons/Spacer";
import { breakpoints } from "@/constants/breakpoints";
import styled from "@emotion/styled";

interface BannerProps {
  title?: string;
  description1?: string;
  description2?: string;
  src?: string;
};

export const Banner = ({title, description1, description2,  src}: BannerProps) => {
  return (
    <Wrapper>
      <Icon src={src} alt="icon" />
      <Spacer h={2} />
      <Title>{title}</Title>
      <Spacer h={2} />
      <div>
        <Description>{description1}</Description>
        <Description>{description2}</Description>
      </div>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  width: 350px;
  height: 204px;
  padding: 33px 0;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 20px;
  background: #FFF;
  box-shadow: 2px 2px 20px 0px rgba(94, 96, 153, 0.20);
  box-sizing: border-box;

  @media (max-width: ${breakpoints.mobile}px) {
    height: 124px;
    gap: 5px;
  }
`;

const Icon = styled.img`
  width: 45px;
  height: 45px;

  @media (max-width: ${breakpoints.mobile}px) {
    width: 24px;
    height: 24px;
  }
`;

const Title = styled.div`
  color: #333;
  text-align: center;
  font-size: 20px;
  font-style: normal;
  font-weight: 600;
  line-height: 19px;
  letter-spacing: -0.32px;

  @media (max-width: ${breakpoints.mobile}px) {
    font-size: 10px;
    line-height: 14px;
  }
`;

const Description = styled.div`
  color: #767676;
  text-align: center;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 19px;
  letter-spacing: -0.28px;

  @media (max-width: ${breakpoints.mobile}px) {
    font-size: 10px;
    line-height: 14px;
  }
`;