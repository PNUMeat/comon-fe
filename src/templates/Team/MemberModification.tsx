import { Dropdown } from '@/components/commons/Dropdown/Dropdown.tsx';
import { DropdownItem } from '@/components/commons/Dropdown/DropdownItem.tsx';
import { Flex } from '@/components/commons/Flex.tsx';
import { SText } from '@/components/commons/SText.tsx';

import React, { Fragment, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import {
  IMemberCommon,
  addTeamManager,
  delegationManager,
  demotionManager,
  getTeamMembers,
  removeTeamMember,
} from '@/api/member';
import { getMemberInfo } from '@/api/user';
import noteIcon from '@/assets/TeamDashboard/note.png';
import checkIcon from '@/assets/TeamInfo/check.svg';
import downArrow from '@/assets/TeamInfo/down_arrow.svg';
import crown from '@/assets/TeamJoin/crown.png';
import { breakpoints } from '@/constants/breakpoints';
import { PATH } from '@/routes/path';
import styled from '@emotion/styled';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { MemberExplainModal } from './segments/MemberExplainModal';

const MemberTableGrid = () => {
  const { teamId } = useParams();
  const navigate = useNavigate();

  const { data: teamMembers = [] } = useQuery({
    queryKey: ['team-members', 0],
    queryFn: () => getTeamMembers(teamId!),
    enabled: !!teamId,
  });

  // 꼭 필요한건지 ??????
  const { data: memberInfo } = useQuery({
    queryKey: ['membersInfo'],
    queryFn: getMemberInfo,
    enabled: teamMembers.length > 0,
  });

  const queryClient = useQueryClient();
  const [statuses, setStatuses] = useState<string[]>(
    Array(teamMembers.length).fill('')
  );
  const [isModifying, setIsModifying] = useState(false);

  const handleStatusChange = (index: number, value: string) => {
    setStatuses((prev) => {
      const newStatuses = Array(prev.length).fill('');
      if (prev[index] === '강퇴하기' && value === '강퇴하기') {
        return newStatuses;
      }
      newStatuses[index] = value;
      return newStatuses;
    });
  };

  const sortedTeamMembers = [...teamMembers].sort((a, b) => {
    if (a.isTeamManager && !b.isTeamManager) return -1;
    if (!a.isTeamManager && b.isTeamManager) return 1;

    return (
      new Date(a.registerDate).getTime() - new Date(b.registerDate).getTime()
    );
  });

  useEffect(() => {
    if (!teamMembers) return;

    const hasModifiedStatuses = statuses.some((status) => status !== '');

    setIsModifying(hasModifiedStatuses);
  }, [statuses, teamMembers]);

  const clickSaveButton = () => {
    const selectedStatuses = statuses
      .map((status, index) => (status !== '' ? { index, status } : null))
      .filter(
        (item): item is { index: number; status: string } => item !== null
      );

    const managerCount = sortedTeamMembers.filter(
      (member) => member.isTeamManager
    ).length;

    selectedStatuses.forEach(({ index, status }) => {
      if (status === '강퇴하기') {
        removeTeamMember({ teamId, memberInfo: sortedTeamMembers[index].uuid })
          .then(() => {
            queryClient.refetchQueries({ queryKey: ['team-members', 0] });
            alert('강퇴되었습니다.');
          })
          .catch(() => {
            alert('강퇴하는데 실패했습니다.');
          });
        return;
      }
      if (status === '방장으로 위임') {
        if (confirm('방장을 위임하시겠어요?')) {
          delegationManager({
            teamId,
            memberInfo: sortedTeamMembers[index].uuid,
          })
            .then(() => {
              alert('방장이 위임되었습니다.');

              queryClient
                .refetchQueries({ queryKey: ['team-members', 0] })
                .then(() => {
                  navigate(PATH.TEAM_DASHBOARD);
                });
            })
            .catch(() => {
              alert('방장으로 위임하는데 실패했습니다.');
            });
        }
      }
      if (status === '공동 방장으로 지정') {
        if (managerCount >= 3) {
          alert('방장은 최대 3명까지만 지정할 수 있습니다.');
          return;
        }
        if (confirm('공동 방장으로 지정하시겠어요?')) {
          addTeamManager({ teamId, memberInfo: sortedTeamMembers[index].uuid })
            .then(() => {
              queryClient.refetchQueries({ queryKey: ['team-members', 0] });
              alert('공동 방장으로 지정되었습니다.');
            })
            .catch(() => {
              alert('공동 방장으로 지정하는데 실패했습니다.');
            })
            .finally(() => {
              // navigate(0);
            });
        }
      }
      if (status === '일반 회원으로 변경') {
        if (confirm('일반 회원으로 변경하시겠어요?')) {
          demotionManager({ teamId, memberInfo: sortedTeamMembers[index].uuid })
            .then(() => {
              queryClient.refetchQueries({ queryKey: ['team-members', 0] });
              alert('일반 회원으로 변경되었습니다.');
            })
            .catch(() => {
              alert('일반 회원으로 변경하는데 실패했습니다.');
            })
            .finally(() => {
              // navigate(0);
            });
        }
      }
    });
  };

  return (
    <Table>
      <TableHeader />

      <GridContainer>
        {sortedTeamMembers.map((row, index) => (
          <React.Fragment key={index}>
            <NicknameCell {...row} />
            <RoleCell isTeamManager={row.isTeamManager} />
            <EnterDateCell dateString={row.registerDate} />
            <MemberStatusChangeCell
              isManager={row.isTeamManager}
              selected={statuses[index]}
              onChange={(value) => handleStatusChange(index, value)}
              shouldBeEmpty={row.memberName === memberInfo?.memberName}
            />
            <ExpelCell
              shouldBeEmpty={row.memberName === memberInfo?.memberName}
              isChecked={statuses[index] === '강퇴하기'}
              onClick={() => handleStatusChange(index, '강퇴하기')}
            />
          </React.Fragment>
        ))}
      </GridContainer>
      <SaveButton
        isModifying={isModifying}
        disabled={!isModifying}
        onClick={clickSaveButton}
      >
        적용하기
      </SaveButton>
    </Table>
  );
};

const MemberModification = () => {
  return (
    <MemberModGrid>
      <ModeButton>
        <img src={noteIcon} alt="note icon" />
        멤버 관리
      </ModeButton>
      <MemberTableGrid />
    </MemberModGrid>
  );
};

const TableHeader = () => (
  <Header>
    <HeaderCell>닉네임</HeaderCell>
    <HeaderCell>상태</HeaderCell>
    <HeaderCell>팀 가입일</HeaderCell>
    <HeaderCell>상태 변경</HeaderCell>
    <HeaderCell>강퇴</HeaderCell>
  </Header>
);

const NicknameCell: React.FC<IMemberCommon> = ({
  imageUrl,
  memberName,
  memberExplain,
}) => (
  <RowCell isStart>
    <Avatar>
      <AvatarImage src={imageUrl} />
      <NicknameContainer>
        {memberName}
        <MemberExplainModal memberExplain={memberExplain} />
      </NicknameContainer>
    </Avatar>
  </RowCell>
);

const RoleCell: React.FC<{ isTeamManager: boolean }> = ({ isTeamManager }) => {
  return (
    <RowCell isStart>
      <StatusWrapper>
        {isTeamManager ? (
          <Fragment>
            방장
            <LeaderIcon src={crown} />
          </Fragment>
        ) : (
          '일반 회원'
        )}
      </StatusWrapper>
    </RowCell>
  );
};

const EnterDateCell: React.FC<{ dateString: string }> = ({ dateString }) => {
  return <RowCell>{dateString.replace(/-/g, '.')}</RowCell>;
};

const ExpelCell: React.FC<{
  isChecked: boolean;
  onClick: () => void;
  shouldBeEmpty?: boolean;
}> = ({ isChecked, onClick, shouldBeEmpty }) => {
  return (
    <RowCell>
      {!shouldBeEmpty && (
        <Checkbox checked={isChecked} src={checkIcon} onClick={onClick} />
      )}
    </RowCell>
  );
};

const DropdownIcon = styled.div`
  background-color: rgba(43, 63, 108, 0.2);
  border-radius: 30%;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MemberStatusChangeCell: React.FC<{
  isManager: boolean;
  selected: string;
  onChange: (value: string) => void;
  shouldBeEmpty?: boolean;
}> = ({ isManager, onChange, selected, shouldBeEmpty }) => {
  return (
    <RowCell>
      {!shouldBeEmpty && (
        <Dropdown
          buttonLabel={''}
          buttonComponent={
            <Flex justify={'space-between'} align={'center'}>
              <SText>{selected === '강퇴하기' ? '' : selected}</SText>
              <DropdownIcon>
                <img src={downArrow} alt="dropdown" />
              </DropdownIcon>
            </Flex>
          }
          className={'member-dropdown'}
          dropdownClassName={'member-dropdown-items'}
        >
          {isManager && (
            <DropdownItem
              onClick={() => onChange('일반 회원으로 변경')}
              className={'member-dropdown-item'}
            >
              일반 회원으로 변경
            </DropdownItem>
          )}
          {!isManager && (
            <Fragment>
              <DropdownItem
                onClick={() => onChange('공동 방장으로 지정')}
                className={'member-dropdown-item'}
              >
                공동 방장으로 지정
              </DropdownItem>
              <hr />
              <DropdownItem
                onClick={() => onChange('방장으로 위임')}
                className={'member-dropdown-item'}
              >
                방장으로 위임
              </DropdownItem>
            </Fragment>
          )}
        </Dropdown>
      )}
    </RowCell>
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

const RowCell = styled.div<{ isStart?: boolean }>`
  padding: 7px 16px;
  font-size: 16px;
  font-weight: 500;
  font-family: Pretendard;
  display: flex;
  align-items: center;
  justify-content: ${(props) => (props.isStart ? 'flex-start' : 'center')};
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

const Checkbox = styled.img<{ checked: boolean }>`
  border: 0.5px solid #777777;
  background: ${({ checked }) => (checked ? '#EF2528' : '#ffffff')};
  object-fit: contain;
  width: 18px;
  height: 18px;
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-left: 8px;
  cursor: pointer;

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
  font-family: Pretendard;
  font-size: 16px;
  font-weight: 500;
  margin-left: 16px;
  white-space: nowrap;
`;

const LeaderIcon = styled.img`
  width: 22px;
  height: 22px;
`;

const SaveButton = styled.button<{ isModifying: boolean }>`
  position: absolute;
  right: 0;
  bottom: -30px;
  background-color: ${({ isModifying }) =>
    isModifying ? '#6e74fa' : '#777777'};
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
