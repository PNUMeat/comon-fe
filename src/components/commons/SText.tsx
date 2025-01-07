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
  shouldCut?: boolean;
}

export const SText = styled.div<TextProps>`
  color: ${(props) => props.color || 'inherit'};
  font-family: ${(props) => props.fontFamily || 'inherit'};
  font-size: ${(props) => props.fontSize || 'inherit'};
  font-weight: ${(props) => props.fontWeight || 'inherit'};
  line-height: ${(props) => {
    if (props.lineHeight) return props.lineHeight;

    // if (props.fontSize?.endsWith('px')) {
    //   const fontSizeValue = parseInt(props.fontSize, 10);
    //   return `${fontSizeValue + 4}px`;
    // }

    return 'inherit';
  }};
  letter-spacing: ${(props) => props.letterSpacing || 'inherit'};
  text-align: ${(props) => props.textAlign || 'inherit'};
  white-space: ${(props) => props.whiteSpace || 'inherit'};
  opacity: ${(props) => props.opacity || 'inherit'};

  ${(props) =>
    props.shouldCut
      ? `
  width: 100%;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;`
      : ''}
`;
