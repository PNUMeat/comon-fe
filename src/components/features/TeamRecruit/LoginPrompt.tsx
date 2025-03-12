import { SText } from '@/components/commons/SText';
import { Spacer } from '@/components/commons/Spacer';

import { useNavigate } from 'react-router-dom';

import { breakpoints } from '@/constants/breakpoints';
import { PATH } from '@/routes/path';
import styled from '@emotion/styled';

export const LoginPrompt = () => {
  const navigate = useNavigate();

  return (
    <LoginPromptContainer>
      <SText
        color="#333"
        fontSize="18px"
        fontWeight={600}
        fontFamily="Pretendard"
        lineHeight="normal"
      >
        이 팀과 함께 하고 싶다면?
      </SText>
      <Spacer h={20} />
      <LoginButton onClick={() => navigate(PATH.LOGIN)}>로그인</LoginButton>
    </LoginPromptContainer>
  );
};

const LoginPromptContainer = styled.div`
  position: absolute;
  top: 30px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  padding: 24px 52px;
  border-radius: 12px;
  background: #fff;
  box-shadow: 2px 2px 20px 0px rgba(94, 96, 153, 0.2);
  text-align: center;

  @media (max-width: ${breakpoints.mobile}px) {
    width: 190px;
    top: 32px;
  }
`;

const LoginButton = styled.button`
  width: 110px;
  height: 36px;
  padding: 10px 32px;
  border-radius: 40px;
  background: #6e74fa;
  color: #fff;
  font-size: 16px;
  font-weight: 600;

  @media (max-width: ${breakpoints.mobile}px) {
    padding: 0;
    width: 80px;
    height: 30px;
    font-size: 12px;
    font-weight: 500;
  }
`;
