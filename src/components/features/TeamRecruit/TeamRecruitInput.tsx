import { breakpoints } from "@/constants/breakpoints";
import styled from "@emotion/styled";
import { forwardRef } from "react";

export const TeamRecruitInput = forwardRef<HTMLTextAreaElement, { onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void }>(
  ({ onChange }, ref) => {

  const handleChanges = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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

  &::placeholder {
    color: #CCCCCC;
  }

  @media (max-width: ${breakpoints.mobile}px) {
    font-size: 11px;
    padding: 6px 15px;
  }
`;

export default TeamRecruitInput;