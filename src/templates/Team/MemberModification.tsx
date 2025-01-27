import { breakpoints } from "@/constants/breakpoints";
import styled from "@emotion/styled";
import noteIcon from "@/assets/TeamDashboard/note.png";
import searchIcon from "@/assets/TeamDashboard/search.png";

import React from 'react';

const GridContainer = styled.div`
  display: grid;
  grid-template-rows: auto;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr; /* 5열 */
  width: 700px;
  max-width: 800px;
  border-radius: 0 0 12px 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  background-color: white;
`;

const Header = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr; /* 5열 */
  border-radius: 12px 12px 0 0;
  background-color: #c2c5fb;
  font-weight: 700;
  font-size: 14px;
  color: #fff;
`;

const HeaderCell = styled.div`
  font-weight: 700;
  font-size: 14px;
  color: #fff;
  text-align: center;
  padding: 12px;
  border-radius: 12px 12px 0 0;
`;

const RowCell = styled.div`
  padding: 12px;
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

const AvatarImage = styled.div`
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
`;

const SearchIcon = styled.img`
  width: 20px;
  height: 20px;
`;

const Input = styled.input`
  width: 80%;
  padding: 4px;
  border: 1px solid #ddd;
  border-radius: 4px;
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


const data = [
  { name: '나는진영', status: '방장', joinDate: '2025.01.13' },
  { name: '코몬접수하러왔다', status: '일반 회원', joinDate: '2025.01.13' },
  { name: '개나리꽃닉네임', status: '일반 회원', joinDate: '2025.01.19' },
  { name: 'alpha', status: '일반 회원', joinDate: '2025.01.23' },
];

const MemberTableGrid = () => {

  return (
    <>
    <Header>
      <HeaderCell>닉네임</HeaderCell>
      <HeaderCell>상태</HeaderCell>
      <HeaderCell>팀 가입일</HeaderCell>
      <HeaderCell>상태 변경</HeaderCell>
      <HeaderCell>강퇴</HeaderCell>
      </Header>

      <GridContainer>
      {/* Rows */}
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
          <RowCell>{row.status}</RowCell>
          <RowCell>{row.joinDate}</RowCell>
          <RowCell>
            <Input type="text" placeholder="변경할 상태" />
          </RowCell>
          <RowCell>
            <Checkbox checked={false} />
          </RowCell>
        </React.Fragment>
      ))}
    </GridContainer>
</>
  );
};


const MemberModification = () => {
  return (
    <div>
      <ModeButton>
        <img src={noteIcon} alt="note icon" />
          멤버 정보
        </ModeButton>
      <MemberTableGrid />
    </div>
  );
}

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

export default MemberModification;