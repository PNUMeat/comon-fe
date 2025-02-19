import { breakpoints } from "@/constants/breakpoints";
import styled from "@emotion/styled";

interface TeamRecruitInputProps {
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const TeamRecruitInput = ({ value , onChange}: TeamRecruitInputProps) => {
  return (
    <TeamRecruitInputStyle 
      value={value} 
      type="text" 
      placeholder="예시: 오픈채팅 주소, 디스코드 주소, 연락처 등" 
      onChange={onChange}
    />
  );
};

const TeamRecruitInputStyle = styled.input`
  width: 100%;
  height: 40px;
  border: 0.5px solid #CCCCCC;
  border-radius: 8px;
  padding: 7px 20px;
  font-size: 14px;
  color: #333;
  box-sizing: border-box;
  outline: none;

  &::placeholder {
    color: #CCCCCC;
  }

  @media (max-width: ${breakpoints.mobile}px) {
    font-size: 11px;
    padding: 6px 15px;
  }
`;

export default TeamRecruitInput;