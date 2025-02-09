import { BackgroundGradient } from '@/components/commons/BackgroundGradient';

import React, { Fragment, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import noteIcon from '@/assets/TeamDashboard/note.png';
import check from '@/assets/TeamInfo/check.svg';
import crown from '@/assets/TeamJoin/crown.png';
import { breakpoints } from '@/constants/breakpoints';
import styled from '@emotion/styled';

import MemberStatusDropdown from './MemberStatusDropdown';
import { getTeamMembers } from '@/api/member';
import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { MemberExplainModal } from './segments/MemberExplainModal';
import ManagerStatusDropdown from './ManagerStatusDropdown';
import { getMemberInfo } from '@/api/user';
import { AxiosError } from 'axios';
import { ServerResponse } from '@/api/types';

const MemberTableGrid = () => {
  const location = useLocation();

  const { teamId } = location.state;
<<<<<<< HEAD
  const { data: teamMembers } = useSuspenseQuery({
    queryKey: ["team-members", teamId],
=======
  console.log("팀 아이디:", teamId);
  const { data: teamMembers } = useSuspenseQuery({
    queryKey: ["team-members", 0],
>>>>>>> test
    queryFn: () => getTeamMembers(teamId),
  });

  const { data: memberInfo } = useQuery({
    queryKey: ["membersInfo"],
    queryFn: getMemberInfo,
    staleTime: 1000 * 60 * 60,
    enabled: !!teamMembers,
    retry: (failureCount, error: AxiosError<ServerResponse<null>>) => {
      if (
        error.response &&
        error.response.status === 401 &&
        error.response.data.code === 100
      ) {
        return false;
      }
      return failureCount < 3;
    },
  });

  console.log("팀 멤버:", teamMembers);
  console.log("내 정보:", memberInfo);


  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [statuses, setStatuses] = useState<string[]>(Array(teamMembers.length).fill(""));
  const [isModifying, setIsModifying] = useState(false);

  const toggleCheck = (index: number) => {
    setSelectedIndex(prev => (prev === index ? null : index));
  };

  const handleStatusChange = (index: number, value: string) => {
    setStatuses((prev) => {
      const newStatuses = [...prev];
      newStatuses[index] = value
      return newStatuses;
    });
  };
  
  

  const sortedTeamMembers = [...teamMembers].sort((a, b) => {
    if (a.isTeamManager && !b.isTeamManager) return -1;
    if (!a.isTeamManager && b.isTeamManager) return 1;
  
    return new Date(a.registerDate).getTime() - new Date(b.registerDate).getTime();
  });

  console.log(sortedTeamMembers);

  useEffect(() => {
    if (!teamMembers) return;
  
    const hasCheckedItems = selectedIndex !== null;
    const hasModifiedStatuses = statuses.some(status => status !== "");
  
    setIsModifying(hasCheckedItems || hasModifiedStatuses);
  }, [selectedIndex, statuses, teamMembers]);
  
  
  

  const roleString = (isTeamManager: boolean) => {
    if (isTeamManager) {
      return (
        <StatusWrapper>
          방장
          <LeaderIcon src={crown} />
        </StatusWrapper>
      );
    } else {
      return <div>일반 회원</div>;
    }
  };

  const formatDate = (dateString: string): string => {
    return dateString.replace(/-/g, ".");
  };

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
        {sortedTeamMembers.map((row, index) => (
          <React.Fragment key={index}>
            <RowCell>
              <Avatar>
                <AvatarImage src={row.imageUrl} />
                <NicknameContainer>
                  {row.memberName}
                  <MemberExplainModal memberExplain={row.memberExplain} />
                </NicknameContainer>
              </Avatar>
            </RowCell>
            <RowCell>{roleString(row.isTeamManager)}</RowCell>
            <RowCell>{formatDate(row.registerDate)}</RowCell>
            <RowCell>
              {row.isTeamManager ? (
                <ManagerStatusDropdown
                  onChange={(value) => handleStatusChange(index, value)}
                /> ) : (
                <MemberStatusDropdown
                  onChange={(value) => handleStatusChange(index, value)}
                />
              )}
            </RowCell>
            <RowCell>
              <Checkbox
                checked={selectedIndex === index}
                check={check}
                onClick={() => {
                  toggleCheck(index);
                }}
              />
            </RowCell>
          </React.Fragment>
        ))}
      </GridContainer>
      <SaveButton isModifying={isModifying} disabled={!isModifying}>
        적용하기
      </SaveButton>
    </Table>
  );
};

const MemberModification = () => {
  return (
    <Fragment>
      <BackgroundGradient
        count={1}
        positions={[{ top: '90px' }]}
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
};

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
  }
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
  min-width: 24px;
  min-height: 24px;
`;

const NicknameContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 16px;
  font-weight: 600;
  position: relative;
`;

const Checkbox = styled.div<{ checked: boolean; check: string }>`
  border: 0.5px solid #777777;
  background: ${({ checked }) => (checked ? '#EF2528' : '#ffffff')};
  background-image: ${({ checked, check }) =>
    checked ? `url(${check})` : 'none'};
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

const SaveButton = styled.button<{ isModifying: boolean }>`
  position: absolute;
  right: 0;
  bottom: -30px;
  background-color: ${({ isModifying }) => (isModifying ? '#6e74fa' : '#777777')};
  color: white;
  width: 90px;
  height: 30px;
  border-radius: 40px;
  font-size: 14px;
  font-weight: 500;
  cursor: ${({ isModifying }) => (isModifying ? 'pointer' : 'not-allowed')};
  transition: background-color 0.3s;

  &:disabled {
    background-color: #777777;
    cursor: not-allowed;
  }
`;

export default MemberModification;
