import { Box } from '@/components/commons/Box';
import { Flex } from '@/components/commons/Flex';
import { Label } from '@/components/commons/Label';
import { LazyImage } from '@/components/commons/LazyImage';
import { SText } from '@/components/commons/SText';
import { Spacer } from '@/components/commons/Spacer';

import AnnouncementIcon from '@/assets/TeamDashboard/announcement.png';
import defaultProfile from '@/assets/TeamDashboard/default_profile.png';
import PencilIcon from '@/assets/TeamDashboard/pencil.png';
import SettingsGreenIcon from '@/assets/TeamDashboard/settings_green.png';
import SettingsRedIcon from '@/assets/TeamDashboard/settings_red.png';
import { colors } from '@/constants/colors';
import styled from '@emotion/styled';

export const SidebarAndAnnouncement = () => {
  return (
    <>
      <Sidebar>
        <Box width="100%" height="260px" borderWidth="3px">
          <ImageContainer
            src={defaultProfile}
            altText="default-profile"
            w={200}
            h={200}
            maxW={200}
          />
        </Box>
        <Spacer h={20} />
        <Box width="100%" padding="24px 40px">
          <Flex direction="column" justify="center" align="center" width={100}>
            <SText fontSize="12px" fontWeight={600}>
              TEAM
            </SText>
            <Spacer h={2} />
            <SText fontSize="24px" color="#333" fontWeight={700}>
              Codemonster
            </SText>
            <Spacer h={4} />
            <SText fontSize="16px" color="#777" fontWeight={400}>
              since 2024.11.12
            </SText>
            <Spacer h={16} />
            <Label background="#6E74FA" color="#fff" padding="2px 10px">
              <SText fontSize="10px" fontWeight={600}>
                코딩테스트
              </SText>
            </Label>
            <Spacer h={16} />
            <SText
              color="#777"
              fontSize="14px"
              fontWeight={400}
              lineHeight="20px"
            >
              "팀 코드몬스터는 앱티브 동아리파생 코드 테스트 및 코드
              스터디팀입니다, 만참부탁드립니다"
            </SText>
            <Spacer h={32} />
            <SText color={colors.buttonPurple} fontSize="16px" fontWeight={400}>
              6 members
            </SText>
            <Spacer h={32} />
            <Flex justify="center" align="center">
              <SettingImage src={SettingsGreenIcon} />
              <SText color="#ccc" fontWeight={600} fontSize="14px">
                게시글 관리
              </SText>
            </Flex>
            <Spacer h={4} />
            <Flex justify="center" align="center">
              <SettingImage src={SettingsRedIcon} />
              <SText color="#ccc" fontWeight={600} fontSize="14px">
                팀 설정
              </SText>
            </Flex>
          </Flex>
        </Box>
      </Sidebar>

      <Announcement>
        <Box width="60%" height="70px" padding="12px 28px">
          <AnnouncementImage src={AnnouncementIcon} />
          <Flex direction="column" gap="4px">
            <SText color="#333" fontSize="18px" fontWeight={700}>
              Team announcement
            </SText>
            <SText color="#333" fontSize="14px" fontWeight={500}>
              제목 양식: 00/00 코테 풀이로 작성 할 것!
            </SText>
          </Flex>
        </Box>
        <NewPostButton>
          <AnnouncementImage src={PencilIcon} />
          <SText fontSize="18px" color="#fff" fontWeight={700}>
            오늘의 글쓰기
          </SText>
        </NewPostButton>
      </Announcement>
    </>
  );
};

const Sidebar = styled.aside`
  grid-area: sidebar;
`;

const ImageContainer = styled(LazyImage)`
  object-position: center;
  overflow: hidden;
  max-height: 260px;
`;

const SettingImage = styled.img`
  width: 24px;
  height: 24px;
  margin-right: 2px;
`;

const Announcement = styled.header`
  grid-area: announcement;
  display: flex;
  justify-content: space-between;
`;

const AnnouncementImage = styled.img`
  width: 24px;
  height: 24px;
  margin-right: 8px;
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
`;