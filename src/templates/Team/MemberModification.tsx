import { breakpoints } from "@/constants/breakpoints";
import styled from "@emotion/styled";
import noteIcon from "@/assets/TeamDashboard/note.png";
import searchIcon from "@/assets/TeamDashboard/search.png";
import { BackgroundGradient } from "@/components/commons/BackgroundGradient";
import crown from "@/assets/TeamJoin/crown.png";
import check from "@/assets/TeamInfo/check.svg";

import React, { Fragment, useEffect, useState } from 'react';
import MemberStatusDropdown from "./MemberStatusDropdown";
import { useLocation } from "react-router-dom";

const data = [
  { name: '나는진영', status: '방장', joinDate: '2025.01.13' },
  { name: '코몬접수하러왔다', status: '일반 회원', joinDate: '2025.01.13' },
  { name: '개나리꽃닉네임', status: '일반 회원', joinDate: '2025.01.19' },
  { name: 'alpha', status: '일반 회원', joinDate: '2025.01.23' },
];

const MemberTableGrid = () => {
  const location = useLocation();

  const {teamId} = location.state;
  console.log('??', teamId);


  const [checkedItems, setCheckedItems] = useState<boolean[]>(new Array(data.length).fill(false));
  const [statuses, setStatuses] = useState<string[]>(data.map((row) => row.status));
  const [isModifying, setIsModifying] = useState(false);

  const toggleCheck = (index: number) => {
    setCheckedItems((prev) =>
      prev.map((item, idx) => (idx === index ? !item : item))
    );
  };

  const handleStatusChange = (index: number, newStatus: string) => {
    setStatuses((prev) =>
      prev.map((status, idx) => (idx === index ? newStatus : status))
    );
  };

  useEffect(() => {
    const hasCheckedItems = checkedItems.some((item) => item);
    const hasModifiedStatuses = statuses.some((status, idx) => status !== data[idx].status);

    setIsModifying(hasCheckedItems || hasModifiedStatuses);
  }, [checkedItems, statuses]);

  const roleString = (role: string) => {
    if (role === '방장') {
      return (
        <StatusWrapper>
          {role}
          <LeaderIcon src={crown} />
        </StatusWrapper>
      )
    } else {
      return (
        <div>
          {role}
        </div>
      )
    }
  }

  return (
    <Table>
      <Header>
        <HeaderCell>닉네임</HeaderCell>
        <HeaderCell>상태</HeaderCell>
        <HeaderCell>팀 가입일</HeaderCell>
        <HeaderCell>상태 변경</HeaderCell>
        <HeaderCell>강퇴</HeaderCell>
      </Header>

      <GridContainer>
      {data.map((row, index) => (
        <React.Fragment key={index}>
          <RowCell>
            <Avatar>
              <AvatarImage />
              <NicknameContainer>
                {row.name}
                <SearchIcon src={searchIcon} alt="search icon" />
              </NicknameContainer>
            </Avatar>
          </RowCell>
          <RowCell>{roleString(row.status)}</RowCell>
          <RowCell>{row.joinDate}</RowCell>
          <RowCell>
            {row.status !== '방장' && (
              <MemberStatusDropdown 
                onChange={(value) => handleStatusChange(index, value)}
              />
            )}
          </RowCell>
          <RowCell>
            {row.status !== '방장' && (
              <Checkbox checked={checkedItems[index]} check={check} onClick={() => {toggleCheck(index)}} />
            )}
          </RowCell>
        </React.Fragment>
      ))}
      </GridContainer>
      <SaveButton isModifying={isModifying}>적용하기</SaveButton>
    </Table>
  );
};


const MemberModification = () => {

  return (
    <Fragment>
      <BackgroundGradient
        count={1}
        positions={[{ top: '90px'}]}
        height="470px"
      />
      <MemberModGrid>
        <ModeButton>
          <img src={noteIcon} alt="note icon" />
            멤버 관리
          </ModeButton>
        <MemberTableGrid />
      </MemberModGrid>
    </Fragment>
  );
}

const GridContainer = styled.div`
  display: grid;
  grid-template-rows: auto;
  grid-template-columns: 1.67fr 0.83fr 0.83fr 1.17fr 0.5fr;
  width: 100%;
  border-radius: 0 0 20px 20px;
  background-color: white;
  color: #333;
  padding: 20px 0;
`;

const Table = styled.div`
  justify-items: start;
  min-width: 700px;

  @media (max-width: ${breakpoints.mobile}px) {
    min-width: 390px;
  }
`;

const Header = styled.div`
  display: grid;
  grid-template-columns: 1.67fr 0.83fr 0.83fr 1.17fr 0.5fr;
  height: 40px;
  border-radius: 20px 20px 0 0;
  background-color: #c2c5fb;
  font-weight: 700;
  font-size: 14px;
  color: #fff;
  width: 100%;

  @media (max-width: ${breakpoints.mobile}px) {
    min-width: 390px;
  }
`;

const HeaderCell = styled.div`
  position: relative;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;

  &::after {
    content: '';
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 0;
    width: 1px;
    height: 60%;
    background-color: white;
  }

  &:last-child::after {
    content: none; 
`;


const RowCell = styled.div`
  padding: 7px 16px;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

const Avatar = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const AvatarImage = styled.img`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #ccc;
  min-width: 24px;
  min-height: 24px;
`;

const NicknameContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 16px;
  font-weight: 600;
`;

const SearchIcon = styled.img`
  width: 20px;
  height: 20px;
  cursor: pointer;
`;

const Checkbox = styled.div<{ checked: boolean; check: string }>`
  border: 0.5px solid #777777;
  background: ${({ checked }) => (checked ? "#EF2528" : "#ffffff")};
  background-image: ${({ checked, check }) =>
    checked ? `url(${check})` : "none"};
  background-size: cover;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  width: 18px;
  height: 18px;
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-left: 8px;

  &::after {
    font-size: 14px;
    color: #ffffff;
  }
`;


const MemberModGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 31px;
  justify-items: start;
  position: relative;
`;

const ModeButton = styled.button`
  white-space: nowrap;
  box-sizing: border-box;
  display: inline-flex;
  height: 30px;
  justify-content: center;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
  position: relative;

  color: #333;
  font-family: 'Pretendard';
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;

  @media (max-width: ${breakpoints.mobile}px) {
    font-size: 14px;
    padding: 2px 20px;
  }
`;

const StatusWrapper = styled.div`
  display: flex;
  gap: 2px;
  align-items: center;
  text-align: center;
`;

const LeaderIcon = styled.img`
  width: 24px;
  height: 24px;
`;

const SaveButton = styled.button<{isModifying: boolean}>`
  position: absolute;
  right: 0;
  bottom: -30px;
  background-color: ${({isModifying}) => (isModifying ? "#6e74fa" : "#777777")};
  disabled: ${({isModifying}) => (isModifying ? "false" : "true")};
  transition: background-color 0.3s;
  color: white;
  width: 90px;
  height: 30px;
  border-radius: 40px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
`;

export default MemberModification;