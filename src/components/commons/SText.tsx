import styled from '@emotion/styled';

// TODO : background color 필요한지?
interface TextProps {
  color?: string;
  fontSize?: string;
  fontWeight?: string | number;
  lineHeight?: string;
  letterSpacing?: string;
  textAlign?: React.CSSProperties['textAlign'];
}

export const SText = styled.div<TextProps>`
  color: ${(props) => props.color || 'inherit'};
  font-size: ${(props) => props.fontSize || 'inherit'};
  font-weight: ${(props) => props.fontWeight || 'inherit'};
  line-height: ${(props) => props.lineHeight || 'inherit'};
  letter-spacing: ${(props) => props.letterSpacing || 'inherit'};
  text-align: ${(props) => props.textAlign || 'inherit'};
`;