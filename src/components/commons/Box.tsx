import { colors } from '@/constants/colors';
import styled from '@emotion/styled';

interface BoxProps {
  width?: string;
  height?: string;
  padding?: string;
  borderWidth?: string;
  children?: React.ReactNode;
}

export const Box: React.FC<BoxProps> = ({
  width,
  height,
  padding,
  borderWidth,
  children,
}) => {
  return (
    <StyledBox
      width={width}
      height={height}
      padding={padding}
      borderWidth={borderWidth}
    >
      {children}
    </StyledBox>
  );
};

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
`;
