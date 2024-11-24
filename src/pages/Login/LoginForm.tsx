import { LazyImage } from '@/components/commons/LazyImage';
import { HeightInNumber } from '@/components/types';

import { Suspense } from 'react';

import loginVector from '@/assets/Login/loginVector.png';
import styled from '@emotion/styled';

const Container = styled.div<HeightInNumber>`
  width: 424px;
  height: ${(props) => props.h}px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  margin: 0;
  line-height: 38.19px
  color: #333333;
`;

const Subtitle = styled.p`
  font-size: 14px;
  font-weight: 400;
  line-height: 19px;
  color: #333333;
  letter-spacing: -0.4px;
`;

const Button = styled.button`
  width: 100%;
  height: 50px;
  border-radius: 20px;
  font-size: 16px;
  font-weight: bold;
  border: 1px solid #cdcfff;
  cursor: pointer;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:last-child {
    margin-bottom: 0;
  }
`;

const KakaoButton = styled(Button)`
  background: #fddc3f;
  color: #000000;

  &::before {
    content: '💬';
    margin-right: 10px;
  }
`;

const GoogleButton = styled(Button)`
  background: #ffffff;
  color: #000000;
  border: 1px solid #ccc;

  &::before {
    content: '🌐';
    margin-right: 10px;
  }
`;

const LoginImageMargins = styled.div`
  margin: 47px 0;
`;

const LoginImageFallback: React.FC<HeightInNumber> = ({ h }) => {
  return <div style={{ height: `${h}px` }}>이미지 로딩중</div>;
};

const LoginImage: React.FC<HeightInNumber> = ({ h }) => {
  return (
    <LoginImageMargins>
      <Suspense fallback={<LoginImageFallback h={h} />}>
        <LazyImage
          altText={'로그인 이미지'}
          w={50}
          maxW={50}
          h={h}
          src={loginVector}
        />
      </Suspense>
    </LoginImageMargins>
  );
};

export const LoginForm: React.FC<HeightInNumber> = ({ h }) => {
  const imgHeight = 62;

  return (
    <Container h={h}>
      <Title>코몬 시작하기</Title>
      <Subtitle>소셜 로그인으로 빠르게 코몬해요!</Subtitle>
      <LoginImage h={imgHeight} />
      <KakaoButton>카카오로 시작하기</KakaoButton>
      <GoogleButton>구글로 시작하기</GoogleButton>
    </Container>
  );
};
