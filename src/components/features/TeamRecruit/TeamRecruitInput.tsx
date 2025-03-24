import { forwardRef, useState } from 'react';

import { breakpoints } from '@/constants/breakpoints';
import styled from '@emotion/styled';

export const TeamRecruitInput = forwardRef<
  HTMLTextAreaElement,
  {
    onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    value: string;
  }
>(({ onChange, value }, ref) => {
  const MAX_LENGTH = 200; // 글자수 제한
  const [inputValue, setInputValue] = useState(value);

  const handleChanges = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;

    if (value.length > MAX_LENGTH) {
      return;
    }
    setInputValue(value);
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
    if (onChange) {
      onChange(e);
    }
  };

  return (
    <TeamRecruitInputStyle
      ref={ref}
      rows={1}
      value={inputValue}
      placeholder="예시: 오픈채팅 주소, 디스코드 주소, 연락처 등"
      onChange={handleChanges}
    />
  );
});

const TeamRecruitInputStyle = styled.textarea`
  width: 100%;
  border: 0.5px solid #cccccc;
  border-radius: 8px;
  padding: 7px 20px;
  font-size: 14px;
  color: #333;
  box-sizing: border-box;
  outline: none;
  resize: none;
  overflow: hidden;
  word-break: break-all;
  font-family: 'Pretendard';

  &::placeholder {
    color: #cccccc;
    font-weight: 400;
  }

  @media (max-width: ${breakpoints.mobile}px) {
    font-size: 11px;
    padding: 6px 15px;
  }
`;

export default TeamRecruitInput;
