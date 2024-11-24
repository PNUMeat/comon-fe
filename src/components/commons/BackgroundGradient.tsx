import styled from '@emotion/styled';

export const BackgroundGradient = styled.div`
  width: 940px;
  height: 491px;
  border-radius: 0 0 600px 600px;
  background: radial-gradient(circle, #c2c5fb 20%, #fda2d0 70%);
  position: absolute;
  filter: blur(70px);
  opacity: 0.3;
  transform-origin: center;
  transform: rotate(180deg);
  z-index: -1;
`;
