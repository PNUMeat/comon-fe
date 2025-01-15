import { useWindowWidth } from '@/hooks/useWindowWidth';

import { Box } from '@/components/commons/Box';
import { Flex } from '@/components/commons/Flex';
import { Label } from '@/components/commons/Label';
import { LazyImage } from '@/components/commons/LazyImage';
import { SText } from '@/components/commons/SText';
import { Spacer } from '@/components/commons/Spacer';

import { Suspense, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { ITeamInfo } from '@/api/team';
import AnnouncementIcon from '@/assets/TeamDashboard/announcement_purple.png';
import PencilIcon from '@/assets/TeamDashboard/pencil.png';
import SettingsGreenIcon from '@/assets/TeamDashboard/settings_green.png';
import SettingsRedIcon from '@/assets/TeamDashboard/settings_red.png';
import { breakpoints } from '@/constants/breakpoints';
import { colors } from '@/constants/colors';
import { PATH } from '@/routes/path';
import { selectedPostIdAtom } from '@/store/dashboard';
import styled from '@emotion/styled';
import { useSetAtom } from 'jotai';

interface ISidebarAndAnnouncementProps {
  teamInfo: ITeamInfo;
  isTeamManager: boolean;
}

export const SidebarAndAnnouncement: React.FC<ISidebarAndAnnouncementProps> = ({
  teamInfo,
  isTeamManager,
}) => {
  const { teamId } = useParams<{ teamId: string }>();
  const setSelectedId = useSetAtom(selectedPostIdAtom);

  const width = useWindowWidth();
  const isMobile = width <= breakpoints.mobile;

  const [isExpanded, setIsExpanded] = useState(false);
  const toggleExpand = () => setIsExpanded((prev) => !prev);

  return (
    <>
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
              <Spacer h={2} />
              <SText
                fontSize={isMobile ? '16px' : '24px'}
                color="#333"
                fontWeight={700}
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
              <Spacer h={isMobile ? 6 : 16} />
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
                <>
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
                  <Spacer h={4} />
                  <Link
                    to={`${PATH.TEAM_MODIFICATION}`}
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
                </>
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
        {/*<Link to={PATH.POSTING} style={{ textDecoration: 'none' }}>*/}
        <Link to={`/posting/${teamId}`} style={{ textDecoration: 'none' }}>
          <NewPostButton>
            <AnnouncementImage src={PencilIcon} />
            <SText
              fontSize={isMobile ? '10px' : '18px'}
              color="#fff"
              fontWeight={700}
            >
              오늘의 글쓰기
            </SText>
          </NewPostButton>
        </Link>
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

const NewPostButton = styled.button`
  display: flex;
  align-items: center;
  height: 70px;
  padding: 24px 72px;
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
