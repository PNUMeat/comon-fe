import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

export const SimpleLoader = styled.div`
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: transparent;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  // margin: 0 auto;
  animation: ${spin} 1s linear infinite;
`;
