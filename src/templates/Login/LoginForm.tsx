import { ComonFormTitle } from '@/components/commons/Form/ComonFormTitle';
import { LazyImage } from '@/components/commons/LazyImage';
import { SText } from '@/components/commons/SText';
import { HeightInNumber } from '@/components/types';

import { Suspense } from 'react';

import { kakaoOauth2LoginUrl } from '@/api/user';
import kakaoTalk from '@/assets/Login/kakaoTalkIcon.png';
import loginVector from '@/assets/Login/loginVector.png';
import { colors } from '@/constants/colors';
import styled from '@emotion/styled';

const Container = styled.div<HeightInNumber>`
  width: 424px;
  height: ${(props) => props.h}px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
`;

const LinkButton = styled.a`
  width: 100%;
  height: 50px;
  border-radius: 20px;
  font-size: 16px;
  border: 1px solid ${colors.borderPurple};
  cursor: pointer;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;

  &:last-child {
    margin-bottom: 0;
  }
`;

const KakaoLinkButton = styled(LinkButton)`
  background: #fddc3f;
  color: #000000;

  &::before {
    content: '';
    display: inline-block;
    width: 40px;
    height: 40px;
    background-image: url('${kakaoTalk}');
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
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
      <ComonFormTitle
        title={'코몬 시작하기'}
        subtitle={'소셜 로그인으로 빠르게 코몬해요!'}
      />
      <LoginImage h={imgHeight} />
      <KakaoLinkButton href={kakaoOauth2LoginUrl}>
        <SText
          fontFamily={'Pretendard'}
          color={'#3A2929'}
          fontSize={'16px'}
          fontWeight={500}
          lineHeight={'19px'}
          letterSpacing={'-0.32px'}
        >
          카카오로 시작하기
        </SText>
      </KakaoLinkButton>
    </Container>
  );
};
