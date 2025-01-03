import styled from '@emotion/styled';

interface TextProps {
  color?: string;
  fontFamily?: string;
  fontSize?: string;
  fontWeight?: string | number;
  lineHeight?: string;
  letterSpacing?: string;
  whiteSpace?: string;
  textAlign?: React.CSSProperties['textAlign'];
  opacity?: string;
}

export const SText = styled.div<TextProps>`
  color: ${(props) => props.color || 'inherit'};
  font-family: ${(props) => props.fontFamily || 'inherit'};
  font-size: ${(props) => props.fontSize || 'inherit'};
  font-weight: ${(props) => props.fontWeight || 'inherit'};
  line-height: ${(props) => props.lineHeight || 'inherit'};
  letter-spacing: ${(props) => props.letterSpacing || 'inherit'};
  text-align: ${(props) => props.textAlign || 'inherit'};
  white-space: ${(props) => props.whiteSpace || 'inherit'};
  opacity: ${(props) => props.opacity || 'inherit'};
`;
