import { isDevMode, isLoggedIn } from '@/utils/cookie.ts';

import { useWindowWidth } from '@/hooks/useWindowWidth';

import { Box } from '@/components/commons/Box';
import { Flex } from '@/components/commons/Flex';
import { Label } from '@/components/commons/Label';
import { LazyImage } from '@/components/commons/LazyImage';
import { SText } from '@/components/commons/SText';
import { Spacer } from '@/components/commons/Spacer';

import { Suspense, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { ITeamInfo } from '@/api/team';
import AnnouncementIcon from '@/assets/TeamDashboard/announcement_purple.png';
import TriangleIcon from '@/assets/TeamDashboard/invert_triangle.png';
import LockIcon from '@/assets/TeamDashboard/lock.png';
import MessageIcon from '@/assets/TeamDashboard/message_circle.png';
import PencilIcon from '@/assets/TeamDashboard/pencil.png';
import SettingsGreenIcon from '@/assets/TeamDashboard/settings_green.png';
import SettingsPurpleIcon from '@/assets/TeamDashboard/settings_purple.png';
import SettingsRedIcon from '@/assets/TeamDashboard/settings_red.png';
import { breakpoints } from '@/constants/breakpoints';
import { colors } from '@/constants/colors';
import { PATH } from '@/routes/path';
import { selectedPostIdAtom } from '@/store/dashboard';
import { confirmAtom } from '@/store/modal';
import styled from '@emotion/styled';
import { useSetAtom } from 'jotai';

interface ISidebarAndAnnouncementProps {
  teamInfo: ITeamInfo;
  isTeamManager: boolean;
  isMyTeam: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
// modifyRecruitPost
export const SidebarAndAnnouncement: React.FC<ISidebarAndAnnouncementProps> = ({
  teamInfo,
  isTeamManager,
  isMyTeam,
  setIsModalOpen,
}) => {
  const { teamId } = useParams<{ teamId: string }>();
  const setSelectedId = useSetAtom(selectedPostIdAtom);

  const width = useWindowWidth();
  const isMobile = width <= breakpoints.mobile;
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleExpand = () => setIsExpanded((prev) => !prev);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const setConfirm = useSetAtom(confirmAtom);

  const onClick = () => {
    if (isMyTeam) {
      navigate(`/posting/${teamId}`, {
        state: {
          article: null,
          articleId: null,
          articleTitle: null,
        },
      });
    } else {
      setIsDropdownOpen((prev) => !prev);
    }
  };

  const joinTeam = () => {
    if (!isLoggedIn() && !isDevMode()) {
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

  const goRecruitPage = () => {
    if (teamInfo.teamRecruitId) {
      navigate(`${PATH.TEAM_RECRUIT}/detail/${teamInfo.teamRecruitId}`);
    } else {
      toast.error('참가할 수 없는 상태입니다.');
    }
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

  return (
    <>
      <Toaster />
      <Sidebar>
        <Box
          width={isMobile ? '84px' : '100%'}
          height={isMobile ? '84px' : '260px'}
          borderWidth={isMobile ? '1px' : '3px'}
          padding={isMobile ? '8px' : '16px'}
          borderRadius={isMobile ? '10px' : '20px'}
        >
          <Suspense
            fallback={<div style={{ height: isMobile ? '84px' : '200px' }} />}
          >
            <ImageContainer
              src={teamInfo.imageUrl}
              altText={teamInfo.teamName}
              w={isMobile ? 70 : 200}
              h={isMobile ? 70 : 200}
              maxW={isMobile ? 70 : 200}
            />
          </Suspense>
        </Box>
        <Spacer h={20} />
        <Box
          width="100%"
          padding={isMobile ? '8px 12px' : '24px 40px'}
          height={isMobile ? '84px' : 'auto'}
          borderRadius={isMobile ? '10px' : '20px'}
        >
          <Flex
            direction={isMobile ? 'row' : 'column'}
            justify={isMobile ? 'space-around' : 'center'}
            align="center"
            width={100}
          >
            <Flex direction="column" align="center" style={{ width: 'auto' }}>
              <SText
                color="#333"
                fontSize={isMobile ? '10px' : '12px'}
                fontWeight={600}
              >
                TEAM
              </SText>
              <Spacer h={4} />
              <SText
                fontSize={isMobile ? '16px' : '24px'}
                color="#333"
                fontWeight={700}
                textAlign="center"
              >
                {teamInfo.teamName}
              </SText>
              <Spacer h={4} />
              <SText
                fontSize={isMobile ? '10px' : '16px'}
                color="#777"
                fontWeight={400}
              >
                since {teamInfo.createdAt}
              </SText>
              <Spacer h={isMobile ? 4 : 16} />
              <Label
                background={isMobile ? '#F4F4F4' : '#6E74FA'}
                color={isMobile ? '#8488ec' : '#fff'}
                padding={isMobile ? '2px 6px' : '2px 10px'}
              >
                <SText fontSize={isMobile ? '8px' : '10px'} fontWeight={600}>
                  {teamInfo.topic}
                </SText>
              </Label>
            </Flex>

            {!isMobile && (
              <>
                <Spacer h={16} />
                <SText
                  color="#777"
                  fontSize="14px"
                  fontWeight={400}
                  lineHeight="20px"
                >
                  {teamInfo.teamExplain}
                </SText>
                <Spacer h={32} />
                <SText
                  color={colors.buttonPurple}
                  fontSize="16px"
                  fontWeight={400}
                >
                  {teamInfo.memberCount} members
                </SText>
                <Spacer h={32} />
              </>
            )}

            <div>
              {isMobile && (
                <>
                  <SText
                    color={colors.buttonPurple}
                    fontSize="10px"
                    fontWeight={400}
                    textAlign="center"
                  >
                    {teamInfo.memberCount} members
                  </SText>
                  <Spacer h={4} />
                </>
              )}
              {isTeamManager && (
                <Flex
                  direction="column"
                  justify="flex-start"
                  align="flex-start"
                >
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
                    <Flex
                      justify={isMobile ? 'flex-start' : 'center'}
                      align="center"
                    >
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
              )}
            </div>
          </Flex>
        </Box>
      </Sidebar>

      <Announcement>
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
        </Box>

        <NewPostButton onClick={onClick}>
          {isMyTeam && <AnnouncementImage src={PencilIcon} />}
          <SText
            fontSize={isMobile ? '10px' : '18px'}
            color="#fff"
            fontWeight={700}
          >
            {isMyTeam ? '오늘의 글쓰기' : '팀 참가하기'}
          </SText>
          {!isMyTeam && <MoreIcon src={TriangleIcon} />}
        </NewPostButton>
        {isDropdownOpen && (
          <DropdownWrapper>
            <DropdownList onClick={joinTeam}>
              <DropdownListIcon src={LockIcon} />
              <DropdownListText>비밀번호 입력</DropdownListText>
            </DropdownList>
            <DropdownList onClick={goRecruitPage}>
              <DropdownListIcon src={MessageIcon} />
              <DropdownListText>모집글 보러가기</DropdownListText>
            </DropdownList>
          </DropdownWrapper>
        )}
      </Announcement>
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

const ImageContainer = styled(LazyImage)`
  object-position: center;
  overflow: hidden;
  max-height: 260px;

  @media (max-width: ${breakpoints.mobile}px) {
    max-height: 84px;
  }
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

const Announcement = styled.header`
  grid-area: announcement;
  display: flex;
  justify-content: space-between;
  position: relative;

  @media (max-width: ${breakpoints.mobile}px) {
    margin: 12px 0;
    border-radius: 10px;
    background: #f8f8ff;
    padding: 8px 10px;
  }
`;

const AnnouncementImageWrapper = styled.div`
  position: absolute;
  top: 28px;
  left: 16px;
  transform: translateY(-50%);

  @media (max-width: ${breakpoints.mobile}px) {
    top: 14px;
    left: 12px;
  }
`;

const AnnouncementImage = styled.img`
  width: 18px;
  height: 18px;
  margin-right: 8px;

  @media (max-width: ${breakpoints.mobile}px) {
    width: 12px;
    height: 12px;
    margin-right: 6px;
  }
`;

const MoreIcon = styled.img`
  width: 15px;
  height: 10px;
  margin-left: 8px;
  padding-top: 2px;
`;

const NewPostButton = styled.button`
  display: flex;
  align-items: center;
  height: 70px;
  width: 265px;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  background: var(--1, linear-gradient(98deg, #fe82db 6.1%, #68e4ff 103.66%));
  box-shadow: 5px 7px 11.6px 0px rgba(63, 63, 77, 0.07);
  border: none;

  @media (max-width: ${breakpoints.mobile}px) {
    width: 100px;
    height: 32px;
    padding: 12px;
    border-radius: 28px;
  }
`;

const DropdownWrapper = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  right: 0;
  bottom: -100px;
  z-index: 1;
  border: 1px solid #e5e5e5;
  width: 265px;
  background: #fff;
  border-radius: 10px;
  padding: 18px 52px;
  box-sizing: border-box;
  box-shadow: 2px 2px 20px 0px #5e609933;

  @media (max-width: ${breakpoints.mobile}px) {
    width: 100px;
    bottom: -50px;
    right: 10px;
    padding: 8px 4px;
  }
`;

const DropdownList = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
  width: 100%;
  cursor: pointer;

  @media (max-width: ${breakpoints.mobile}px) {
    gap: 8px;
  }
`;

const DropdownListIcon = styled.img`
  width: 18px;
  height: 18px;

  @media (max-width: ${breakpoints.mobile}px) {
    width: 8px;
    height: 8px;
  }
`;

const DropdownListText = styled.div`
  font-size: 16px;
  color: #333;
  font-weight: 600;

  @media (max-width: ${breakpoints.mobile}px) {
    font-size: 6px;
  }
`;
