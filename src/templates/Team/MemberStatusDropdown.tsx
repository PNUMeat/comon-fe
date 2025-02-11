import { useState } from "react";
import styled from "@emotion/styled";
import downArrow from "@/assets/TeamInfo/down_arrow.svg";

interface MemberStatusDropdownProps {
  selected: string; 
  onChange: (value: string) => void;
}

const MemberStatusDropdown = ({ selected, onChange }: MemberStatusDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen((prev) => !prev);
  const handleSelect = (value: string) => {
    onChange(value);
    setIsOpen(false);
  };

  return (
    <DropdownContainer>
      <DropdownHeader onClick={toggleDropdown}>
        {selected || ""}
        <DropdownIcon>
          <img src={downArrow} alt="dropdown" />
        </DropdownIcon>
      </DropdownHeader>
      {isOpen && (
        <DropdownList>
          <DropdownItem onClick={() => handleSelect("")}>
          </DropdownItem>
          <DropdownItem onClick={() => handleSelect("공동 방장으로 지정")}>
            공동 방장으로 지정
          </DropdownItem>
          <DropdownItem onClick={() => handleSelect("방장으로 위임")}>
            방장으로 위임
          </DropdownItem>
        </DropdownList>
      )}
    </DropdownContainer>
  );
};


const DropdownContainer = styled.div`
  position: relative;
  width: 100%;
  box-sizing: border-box;
  height: 26px;
`;

const DropdownHeader = styled.div`
  position: relative;
  width: 100%;
  padding: 12px;
  font-size: 12px;
  border: 0.5px solid #D5D9E2;
  height: 100%;
  border-radius: 8px;
  background-color: #fff;
  color: #777777;
  font-weight: 500;
  display: flex;
  align-items: center;
  cursor: pointer;
  box-sizing: border-box;
  height: 26px;
`;

const DropdownList = styled.ul`
  position: absolute;
  width: 100%;
  min-width: 100%;
  background: white;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 12px;
  margin-top: -26px;
  list-style: none;
  padding: 0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  z-index: 1;
  box-sizing: border-box;
`;

const DropdownItem = styled.li`
  padding: 0px 20px;
  text-align: center;
  cursor: pointer;
  color: #666;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  &:not(:last-child) {
    border-bottom: 1px solid #ddd;
  }
  &:hover {
    background-color: #D5D9E2;
  }
`;

const DropdownIcon = styled.div`
  background-color: rgba(43, 63, 108, 0.2);
  border-radius: 30%;
  width: 16px;
  height: 16px;
  position: absolute;
  right: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default MemberStatusDropdown;
