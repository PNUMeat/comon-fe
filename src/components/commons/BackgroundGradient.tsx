import styled from '@emotion/styled';

export const BackgroundGradient = styled.div`
  width: 940px;
  height: 491px;
  border-radius: 0 0 800px 800px;
  background: radial-gradient(circle, #c2c5fb 40%, #fda2d0 100%);
  position: absolute;
  filter: blur(70px);
  opacity: 0.3;
  transform-origin: center;
  transform: rotate(200deg);
  z-index: -1;
`;
