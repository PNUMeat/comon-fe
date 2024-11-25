import { colors } from '@/constants/colors';
import styled from '@emotion/styled';

interface ThemeStyles {
  [key: string]: {
    background: string;
    color: string;
    borderRadius: string;
    padding: string;
    borderWidth: string;
  };
}

const themeStyles: ThemeStyles = {
  default: {
    background: '#fff',
    color: '#000',
    borderRadius: '20px',
    padding: '16px',
    borderWidth: '1px',
  },
  label: {
    background: '#f4f4f4',
    color: colors.buttonPurple,
    borderRadius: '34px',
    padding: '2px 20px',
    borderWidth: '1px',
  },
  action: {
    background: '#fff',
    color: '#000',
    borderRadius: '20px',
    padding: '0px',
    borderWidth: '3px',
  },
};

interface BoxProps {
  width?: string;
  height?: string;
  borderColor?: string;
  fontSize?: string;
  theme?: keyof ThemeStyles;
  children?: React.ReactNode;
}

export const Box: React.FC<BoxProps> = ({
  width,
  height,
  borderColor,
  fontSize,
  theme = 'default',
  children,
}) => {
  return (
    <StyledBox
      width={width}
      height={height}
      borderColor={borderColor}
      fontSize={fontSize}
      theme={theme}
    >
      {children}
    </StyledBox>
  );
};

const StyledBox = styled.div<BoxProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${(props) => themeStyles[props.theme || 'default'].padding};
  border: ${(props) => themeStyles[props.theme || 'default'].borderWidth} solid
    ${(props) => props.borderColor || colors.borderPurple};
  border-radius: ${(props) =>
    themeStyles[props.theme || 'default'].borderRadius};
  width: ${(props) => props.width || 'fit-content'};
  height: ${(props) => props.height || 'auto'};
  background: ${(props) => themeStyles[props.theme || 'default'].background};
  color: ${(props) => themeStyles[props.theme || 'default'].color};
  box-shadow: 5px 7px 11.6px 0px #3f3f4d12;
  font-size: ${(props) => props.fontSize || '16px'};
  box-sizing: border-box;
`;
