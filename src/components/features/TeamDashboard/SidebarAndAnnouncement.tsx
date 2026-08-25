import { useTeamDashboard } from '@/hooks/useTeamDashboard';
import { useWindowWidth } from '@/hooks/useWindowWidth';

import { Box } from '@/components/commons/Box';
import { Flex } from '@/components/commons/Flex';
import { SText } from '@/components/commons/SText';
import { Spacer } from '@/components/commons/Spacer';
import { PersonalDashboard } from '@/components/features/TeamDashboard/PersonalDashboard';

import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { ITeamInfo } from '@/api/team';
import TriangleIcon from '@/assets/TeamDashboard/invert_triangle.png';
import LockIcon from '@/assets/TeamDashboard/lock.png';
import SettingsGreenIcon from '@/assets/TeamDashboard/settings_green.png';
import SettingsPurpleIcon from '@/assets/TeamDashboard/settings_purple.png';
import SettingsRedIcon from '@/assets/TeamDashboard/settings_red.png';
import { breakpoints } from '@/constants/breakpoints';
import { colors } from '@/constants/colors';
import { PATH } from '@/routes/path';
import { isLoggedInAtom } from '@/store/auth';
import { selectedPostIdAtom } from '@/store/dashboard';
import { confirmAtom } from '@/store/modal';
import styled from '@emotion/styled';
import { useAtom, useSetAtom } from 'jotai';

interface ISidebarAndAnnouncementProps {
  teamInfo: ITeamInfo;
  memberTeam?: ITeamInfo;
  isTeamManager: boolean;
  isMyTeam: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const SidebarAndAnnouncement: React.FC<ISidebarAndAnnouncementProps> = ({
  teamInfo,
  memberTeam,
  isTeamManager,
  isMyTeam,
  setIsModalOpen,
}) => {
  const { teamId } = useParams<{ teamId: string }>();
  const setSelectedId = useSetAtom(selectedPostIdAtom);

  const width = useWindowWidth();
  const isMobile = width <= breakpoints.mobile;
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const setConfirm = useSetAtom(confirmAtom);
  const [isLoggedIn] = useAtom(isLoggedInAtom);
  const { dashboard: memberDashboard } = useTeamDashboard({
    teamId: memberTeam ? String(memberTeam.teamId) : undefined,
    enabled: !isMyTeam && !!memberTeam,
  });

  const onClick = () => {
    if (isMyTeam) {
      navigate(`/posting/${teamId}`, {
        state: {
          article: null,
          articleId: null,
          articleTitle: null,
        },
      });
      return;
    }
    if (!isLoggedIn) {
      sessionStorage.setItem('redirect', location.pathname);
      navigate(PATH.LOGIN, {
        state: {
          redirect: location.pathname,
        },
      });
      return;
    }
    setIsDropdownOpen((prev) => !prev);
  };

  const joinTeam = () => {
    if (!isLoggedIn) {
      sessionStorage.setItem('redirect', location.pathname);
      navigate(PATH.LOGIN, {
        state: {
          redirect: location.pathname,
        },
      });
      return;
    }
    setIsModalOpen(true);
  };

  const handleClick = () => {
    if (teamInfo.teamRecruitId) {
      navigate(`${PATH.TEAM_RECRUIT}/detail/${teamInfo.teamRecruitId}`);
    } else {
      setConfirm({
        message: '현재 모집글이 없습니다.',
        description: '새로 작성하시겠어요?',
        isVisible: true,
        cancleText: '취소',
        confirmText: '작성하기',
        onConfirm: () => {
          navigate(`${PATH.TEAM_RECRUIT}/posting`, {
            state: { teamId: teamId },
          });
        },
        onCancel: () => {},
      });
    }
  };

  const managerMenu = (
    <Flex direction="column" justify="flex-start" align="flex-start">
      <Link
        to={`${PATH.TEAM_ADMIN}/${teamId}`}
        style={{ textDecoration: 'none' }}
        onClick={() => setSelectedId(null)}
      >
        <Flex justify="center" align="center">
          <SettingImage src={SettingsGreenIcon} />
          <SText
            color="#ccc"
            fontWeight={600}
            fontSize={isMobile ? '10px' : '14px'}
          >
            게시글 관리
          </SText>
        </Flex>
      </Link>
      <Spacer h={2} />
      <Link
        to={`${PATH.TEAM_SETTING}/team/${teamId}`}
        style={{ textDecoration: 'none' }}
      >
        <Flex justify={isMobile ? 'flex-start' : 'center'} align="center">
          <SettingImage src={SettingsRedIcon} />
          <SText
            color="#ccc"
            fontWeight={600}
            fontSize={isMobile ? '10px' : '14px'}
          >
            팀 설정
          </SText>
        </Flex>
      </Link>
      <Spacer h={2} />
      <Flex
        width={'auto'}
        justify={isMobile ? 'flex-start' : 'center'}
        align="center"
        onClick={handleClick}
        style={{ cursor: 'pointer' }}
      >
        <SettingImage src={SettingsPurpleIcon} />
        <SText
          color="#ccc"
          fontWeight={600}
          fontSize={isMobile ? '10px' : '14px'}
        >
          모집글
        </SText>
      </Flex>
    </Flex>
  );

  return (
    <>
      <Toaster
        position="top-center"
        containerStyle={{
          marginTop: '60px',
          zIndex: 9999,
        }}
      />
      <Sidebar>
        {isMyTeam ? (
          <MemberSidebar>
            <PersonalDashboard
              teamId={teamId}
              enabled={isMyTeam}
              teamInfo={teamInfo}
            />
            {isTeamManager && (
              <>
                <Spacer h={20} />
                <Box width="100%" padding="16px 24px" borderRadius="20px">
                  {managerMenu}
                </Box>
              </>
            )}
          </MemberSidebar>
        ) : (
          <GuestSidebar>
            {memberTeam && (
              <GuestTeamSummary>
                <TeamEyebrow>TEAM</TeamEyebrow>
                <GuestTeamName>{memberTeam.teamName}</GuestTeamName>
                {memberTeam.topic && (
                  <GuestTopic>{memberTeam.topic}</GuestTopic>
                )}
              </GuestTeamSummary>
            )}

            <NonMemberCard>
              <NonMemberInfo>
                <div>
                  <TeamEyebrow>TEAM</TeamEyebrow>
                  <NonMemberTeamName>{teamInfo.teamName}</NonMemberTeamName>
                  <CreatedAt>
                    since {teamInfo.createdAt?.replaceAll('-', '.')}
                  </CreatedAt>
                </div>
                <JoinMessage>
                  팀에 참가하여 꾸준히
                  <br />
                  문제를 풀어보세요
                </JoinMessage>
              </NonMemberInfo>

              <JoinArea>
                <JoinButton type="button" onClick={onClick}>
                  팀 참가하기
                  <MoreIcon src={TriangleIcon} alt="" aria-hidden />
                </JoinButton>
                {isDropdownOpen && (
                  <JoinDropdown>
                    <JoinDropdownItem type="button" onClick={joinTeam}>
                      <JoinLockIcon src={LockIcon} alt="" aria-hidden />
                      비밀번호 입력
                    </JoinDropdownItem>
                  </JoinDropdown>
                )}
              </JoinArea>
            </NonMemberCard>

            {memberDashboard && (
              <GuestGrassCard aria-label="내 팀의 주간 풀이 기록">
                <GuestGrassGrid>
                  {Array.from({ length: 42 }).map((_, index) => {
                    const column = index % 7;
                    const row = Math.floor(index / 7);
                    const solvedCount =
                      memberDashboard.weeklyGrass[column]?.count ?? 0;
                    return (
                      <GuestGrassCell
                        key={index}
                        $filled={row < Math.min(solvedCount, 6)}
                        $recommended={column < memberDashboard.nDays}
                      />
                    );
                  })}
                </GuestGrassGrid>
              </GuestGrassCard>
            )}
          </GuestSidebar>
        )}
      </Sidebar>

      {/* <Announcement>
        <Box
          width={isMobile ? '204px' : '470px'}
          height={isExpanded ? 'auto' : isMobile ? 'auto' : '70px'}
          padding={isMobile ? '6px 14px' : '12px 28px'}
          borderRadius={isMobile ? '4px' : '20px'}
          borderWidth={isMobile ? '0px' : '1px'}
          onClick={toggleExpand}
          style={{
            overflow: 'hidden',
            cursor: 'pointer',
            textOverflow: isExpanded ? 'unset' : 'ellipsis',
            whiteSpace: isExpanded ? 'normal' : 'nowrap',
            position: 'relative',
          }}
        >
          <AnnouncementImageWrapper>
            <AnnouncementImage src={AnnouncementIcon} />
          </AnnouncementImageWrapper>
          <Flex
            direction="column"
            gap={isMobile ? '2px' : '4px'}
            style={{
              marginLeft: '16px',
            }}
          >
            <SText
              color="#333"
              fontSize={isMobile ? '10px' : '18px'}
              fontWeight={700}
            >
              Team announcement
            </SText>
            <SText
              color="#333"
              fontSize={isMobile ? '10px' : '14px'}
              fontWeight={isMobile ? 400 : 500}
              style={{
                whiteSpace: isExpanded ? 'normal' : 'nowrap',
                overflow: 'hidden',
                textOverflow: isExpanded ? 'unset' : 'ellipsis',
              }}
            >
              {teamInfo.teamAnnouncement
                ? teamInfo.teamAnnouncement
                : '공지가 등록되지 않았습니다.'}
            </SText>
          </Flex>
        </Box> */}

      {/* {isMyTeam && (
          <NewPostButton onClick={onClick}>
            <AnnouncementImage src={PencilIcon} />
            <SText
              fontSize={isMobile ? '10px' : '18px'}
              color="#fff"
              fontWeight={700}
            >
              오늘의 글쓰기
            </SText>
          </NewPostButton>
        )} */}
      {/* </Announcement> */}
    </>
  );
};

const Sidebar = styled.aside`
  grid-area: sidebar;

  @media (max-width: ${breakpoints.mobile}px) {
    display: flex;
    gap: 4px;
  }
`;

// 멤버용 개인화 영역: Sidebar가 모바일에서 flex-row가 되므로 단일 컬럼으로 고정
const MemberSidebar = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const GuestSidebar = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  width: 100%;
`;

const GuestTeamSummary = styled.header`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 6px 0;
`;

const GuestTeamName = styled.h2`
  margin: -16px 0 0;
  color: #333333;
  font-size: 36px;
  font-weight: 700;
  line-height: normal;
  text-align: center;
  white-space: nowrap;
`;

const GuestTopic = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 120px;
  height: 36px;
  padding: 0 20px;
  border-radius: 68px;
  background: #6e74fa;
  color: #ffffff;
  font-size: 20px;
  font-weight: 600;
  box-sizing: border-box;
`;

const NonMemberCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  width: 312px;
  height: 572px;
  padding: 122px 31px 37px;
  border: 1px solid ${colors.borderPurple};
  border-radius: 20px;
  background: #ffffff;
  box-shadow: 0 6px 20px rgba(48, 49, 67, 0.06);
  box-sizing: border-box;

  @media (max-width: ${breakpoints.mobile}px) {
    width: 100%;
    height: 180px;
    padding: 20px 12px 16px;
    border-radius: 10px;
  }
`;

const NonMemberInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 179px;
  text-align: center;

  @media (max-width: ${breakpoints.mobile}px) {
    height: auto;
    gap: 12px;
  }
`;

const TeamEyebrow = styled.div`
  color: #333333;
  font-size: 16px;
  font-weight: 600;
  line-height: normal;
`;

const NonMemberTeamName = styled.div`
  color: #333333;
  font-size: 36px;
  font-weight: 700;
  line-height: normal;
  white-space: nowrap;

  @media (max-width: ${breakpoints.mobile}px) {
    font-size: 22px;
  }
`;

const CreatedAt = styled.div`
  color: #777777;
  font-size: 20px;
  font-weight: 400;
  line-height: normal;

  @media (max-width: ${breakpoints.mobile}px) {
    font-size: 12px;
  }
`;

const JoinMessage = styled.p`
  margin: 0;
  color: #777777;
  font-size: 20px;
  font-weight: 400;
  line-height: normal;
`;

const JoinArea = styled.div`
  position: relative;
  width: 250px;
`;

const JoinButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 250px;
  height: 70px;
  padding: 0;
  border: 0;
  border-radius: 20px;
  background: linear-gradient(116.383deg, #fe82db 6.0976%, #68e4ff 103.66%);
  box-shadow: 0 6px 20px rgba(48, 49, 67, 0.06);
  color: #ffffff;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
`;

const JoinDropdown = styled.div`
  position: absolute;
  top: 77px;
  left: -5px;
  z-index: 3;
  width: 261px;
  padding: 10px 9px;
  border: 1px solid #e5e5e5;
  border-radius: 10px;
  background: #ffffff;
  box-shadow: 2px 2px 20px rgba(94, 96, 153, 0.2);
  box-sizing: border-box;
`;

const JoinDropdownItem = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 22px;
  width: 240px;
  height: 33px;
  padding: 0;
  border: 0;
  border-radius: 5px;
  background: #ffffff;
  color: #333333;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.15s ease;

  &:hover,
  &:focus-visible {
    background: #f8f8ff;
  }
`;

const JoinLockIcon = styled.img`
  width: 24px;
  height: 24px;
  object-fit: contain;
`;

const GuestGrassCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 272px;
  padding: 13px 34px;
  overflow: hidden;
  border: 1px solid ${colors.borderPurple};
  border-radius: 15px;
  background: #ffffff;
  box-sizing: border-box;
`;

const GuestGrassGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 34px);
  gap: 1px;
  width: 244px;
`;

const GuestGrassCell = styled.div<{
  $filled: boolean;
  $recommended: boolean;
}>`
  width: 34px;
  height: 34px;
  border: 1px solid ${colors.borderPurple};
  background: ${({ $filled, $recommended }) =>
    $filled ? '#6e74fa' : $recommended ? '#eff0ff' : '#f8f8ff'};
  box-sizing: border-box;
`;

const SettingImage = styled.img`
  width: 24px;
  height: 24px;
  margin-right: 2px;

  @media (max-width: ${breakpoints.mobile}px) {
    width: 18px;
    height: 18px;
    margin-right: 4px;
  }
`;

const MoreIcon = styled.img`
  width: 15px;
  height: 10px;
  margin-left: 8px;
  padding-top: 2px;
`;
