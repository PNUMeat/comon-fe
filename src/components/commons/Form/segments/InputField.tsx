import { CSSObject } from '@emotion/react';
import styled from '@emotion/styled';

export const InputField = styled.input<{customStyle?: CSSObject}>`
  flex: 1;
  border: none;
  outline: none;
  font-size: 16px;
  color: #333333;

  ::placeholder {
    color: #cccccc;
  }

  ${(props) => props.customStyle}
`;
