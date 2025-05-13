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
      <Title>{title}</Title>
      <div>
        <Description>{description1}</Description>
        <Description>{description2}</Description>
      </div>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  width: 316px;
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
`;

const Icon = styled.img`
  width: 45px;
  height: 45px;
`;

const Title = styled.div`
  color: #333;
  text-align: center;
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: 19px;
  letter-spacing: -0.32px;
`;

const Description = styled.div`
  color: #767676;
  text-align: center;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 19px;
  letter-spacing: -0.28px;
`;