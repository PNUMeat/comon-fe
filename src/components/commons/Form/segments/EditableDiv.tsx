import styled from '@emotion/styled';

export const EditableDiv = styled.div<{ placeholder: string }>`
  flex: 1;
  outline: none;
  border: none;
  background: transparent;
  color: #333333;
  cursor: text;

  &:empty::before {
    content: '${(props) => props.placeholder}';
    color: #cccccc;
    display: block;
  }
`;
