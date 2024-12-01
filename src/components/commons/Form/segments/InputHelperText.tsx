import styled from '@emotion/styled';

export const InputHelperText = styled.span<{ textAlign?: string }>`
  font-size: 14px;
  font-weight: 400;
  color: #cccccc;
  display: block;
  text-align: ${(props) => props.textAlign ?? 'right'};
  margin-top: 4px;
`;
