import { breakpoints } from '@/constants/breakpoints';
import styled from '@emotion/styled';

import { Flex } from './Flex';

interface GradientBackgroundProps {
  count: number;
  positions: { top?: string; left?: string; right?: string; bottom?: string }[];
  height?: string;
  transform?: string;
}

export const BackgroundGradient: React.FC<GradientBackgroundProps> = ({
  count,
  positions,
  height,
  transform,
}) => {
  return (
    <BackgroundContainer>
      <Flex justify="center">
        {Array.from({ length: count }).map((_, index) => (
          <GradientCircle
            key={index}
            top={positions[index]?.top}
            left={positions[index]?.left}
            right={positions[index]?.right}
            bottom={positions[index]?.bottom}
            height={height}
            transform={transform}
          />
        ))}
      </Flex>
    </BackgroundContainer>
  );
};

const BackgroundContainer = styled.div`
  position: relative;
`;

const GradientCircle = styled.div<{
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  height?: string;
  transform?: string;
}>`
  position: absolute;
  top: ${(props) => props.top || 'auto'};
  left: ${(props) => props.left || 'auto'};
  right: ${(props) => props.right || 'auto'};
  bottom: ${(props) => props.bottom || 'auto'};
  width: 940px;
  height: ${(props) => props.height || '490px'};
  transform: ${(props) => props.transform || 'none'};
  border-radius: 600px 600px 0 0;
  background: radial-gradient(100% 100% at 50% 100%, #c2c5fb 40%, #fda2d0 100%);
  filter: blur(50px);
  opacity: 0.3;
  transform-origin: center;
  z-index: -1;

  @media (max-width: ${breakpoints.mobile}px) {
    width: 100%;
    height: 160px;
    border-radius: 400px 400px 0 0;
    top: ${(props) => props.top || '10%'};
    filter: blur(30px);
  }
`;
