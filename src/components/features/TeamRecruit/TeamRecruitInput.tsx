import { breakpoints } from "@/constants/breakpoints";
import styled from "@emotion/styled";
import { forwardRef, useState } from "react";

export const TeamRecruitInput = forwardRef<HTMLTextAreaElement, { onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void, value: string}>(
  ({ onChange, value }, ref) => {
  const isMobile = window.innerWidth < breakpoints.mobile;
  const MAX_HEIGHT = isMobile ? 40 : 50;
  const [inputValue, setInputValue] = useState(value);

  const handleChanges = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    console.log(e.target.scrollHeight);
    if (e.target.scrollHeight <= MAX_HEIGHT) {
      setInputValue(value);
      e.target.style.height = 'auto';
      e.target.style.height = `${e.target.scrollHeight}px`;
    }
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
  border: 0.5px solid #CCCCCC;
  border-radius: 8px;
  padding: 7px 20px;
  font-size: 14px;
  color: #333;
  box-sizing: border-box;
  outline: none;
  resize: none;
  overflow: hidden;
  word-break: break-all;

  &::placeholder {
    color: #CCCCCC;
  }

  @media (max-width: ${breakpoints.mobile}px) {
    font-size: 11px;
    padding: 6px 15px;
  }
`;

export default TeamRecruitInput;