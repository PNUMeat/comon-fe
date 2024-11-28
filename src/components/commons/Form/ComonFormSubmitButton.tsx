import styled from '@emotion/styled';

export const ComonFormSubmitButton = styled.button<{ disabled: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 675px;
  height: 57px;
  padding: 28px 72px 26px 72px;
  border-radius: 20px;
  font-size: 18px;
  font-weight: 600;
  line-height: normal;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};

  ${({ disabled }) =>
    !disabled &&
    `
    background: #ffffff;
    border: 3px solid #cdcfff;
    box-shadow: 5px 7px 11.6px 0px rgba(63, 63, 77, 0.07);
    color: #333333;

    &:hover {
      background: #f5f5ff;
    }
  `}

  ${({ disabled }) =>
    disabled &&
    `
    background: #f2f2f2;
    box-shadow: 3px 6px 8.3px 0px rgba(63, 63, 77, 0.07) inset;
    color: #cccccc;
    border: none;
  `}
  
  span {
    font-size: 16px;
  }
`;
