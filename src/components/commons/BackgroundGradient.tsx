import styled from '@emotion/styled';

export const BackgroundGradient = styled.div`
  width: 940px;
  // width: 491px;
  height: 491px;
  // height: 940px;
  // border-radius: 940px 940px 0 0;
  border-radius: 0 0 600px 600px;
  // border-radius: 50%;
  background: radial-gradient(circle, #c2c5fb 20%, #fda2d0 70%);
  // background: radial-gradient(circle, #fda2d0 10%, #c2c5fb 50%);
  position: absolute;
  filter: blur(70px);
  opacity: 0.3;
  transform-origin: center;
  transform: rotate(180deg);
  // transform: rotate(90deg);
  z-index: -1;
`;
