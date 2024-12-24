import { CSSProperties, forwardRef } from 'react';

import { colors } from '@/constants/colors';
import styled from '@emotion/styled';

interface BoxProps {
  width?: string;
  height?: string;
  padding?: string;
  borderWidth?: string;
  children?: React.ReactNode;
  style?: CSSProperties;
}

export const Box = forwardRef<HTMLDivElement, BoxProps>(
  ({ width, height, padding, borderWidth, children, style }, ref) => {
    return (
      <StyledBox
        ref={ref}
        width={width}
        height={height}
        padding={padding}
        borderWidth={borderWidth}
        style={style}
      >
        {children}
      </StyledBox>
    );
  }
);

Box.displayName = 'Box';

const StyledBox = styled.div<BoxProps>`
  width: ${(props) => props.width || 'fit-content'};
  height: ${(props) => props.height || 'auto'};
  padding: ${(props) => props.padding || '16px'};
  border: ${(props) => props.borderWidth || '1px'} solid ${colors.borderPurple};
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  background: #fff;
  color: #000;
  box-shadow: 5px 7px 11.6px 0px #3f3f4d12;
  box-sizing: border-box;
  position: relative;
`;
