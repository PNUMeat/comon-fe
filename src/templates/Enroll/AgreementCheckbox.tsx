import { useState } from 'react';

import styled from '@emotion/styled';

const CheckboxContainer = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
`;

const Checkbox = styled.div<{ checked: boolean }>`
  border: 1px solid ${({ checked }) => (checked ? '#8488ff' : '#cdcfff')};
  background: ${({ checked }) => (checked ? '#8488ff' : '#ffffff')};
  width: 24px;
  height: 24px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  &::after {
    content: ${({ checked }) => (checked ? "'✔'" : "''")};
    font-size: 20px;
    color: #ffffff;
  }
`;

const CommentText = styled.span`
  font-size: 16px;
  font-weight: 400;
  line-height: normal;
  color: #777777;
  width: 286px;
`;

const MoreInfoLink = styled.a`
  font-size: 14px;
  font-weight: 400;
  line-height: normal;
  color: #777777;
  text-align: right;
  text-decoration: underline;
  text-underline-offset: auto;
  cursor: pointer;

  &:hover {
    color: #555555;
  }
`;

const CheckboxWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const AgreementCheckbox = () => {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxClick = () => setIsChecked((prev) => !prev);

  return (
    <CheckboxWrap>
      <CheckboxContainer onClick={handleCheckboxClick}>
        <Checkbox checked={isChecked} />
        <CommentText>개인정보 보호정책에 동의합니다.</CommentText>
      </CheckboxContainer>
      <MoreInfoLink href="#">자세히보기</MoreInfoLink>
    </CheckboxWrap>
  );
};
