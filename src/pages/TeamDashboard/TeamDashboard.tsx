import { Box } from '@/components/commons/Box';
import { CustomCalendar } from '@/components/commons/Calendar/Calendar';
import { Flex } from '@/components/commons/Flex';
import { Label } from '@/components/commons/Label';
import { LazyImage } from '@/components/commons/LazyImage';
import { SText } from '@/components/commons/SText';
import { Spacer } from '@/components/commons/Spacer';

import defaultProfile from '@/assets/TeamDashboard/default_profile.png';
import SettingsGreenIcon from '@/assets/TeamDashboard/settings_green.png';
import SettingsRedIcon from '@/assets/TeamDashboard/settings_red.png';
import { colors } from '@/constants/colors';
import styled from '@emotion/styled';

export const TeamDashboardPage = () => {
  return (
    <>
      <Spacer h={28} />
      <Grid>
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
            <Flex
              direction="column"
              justify="center"
              align="center"
              width={100}
            >
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
              <SText
                color={colors.buttonPurple}
                fontSize="16px"
                fontWeight={400}
              >
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
        <Announcement>Team Announcement</Announcement>
        <CalendarSection>
          <CustomCalendar />
        </CalendarSection>
        <Posts>Posts Section</Posts>
      </Grid>
    </>
  );
};

const Grid = styled.div`
  display: grid;
  grid-template-areas:
    'sidebar announcement'
    'sidebar calendar'
    'sidebar posts';
  grid-template-columns: 260px 1fr;
  grid-template-rows: auto 1fr auto;
  gap: 24px 40px;
  height: 100vh;
`;

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
`;

const CalendarSection = styled.section`
  grid-area: calendar;
`;

const Posts = styled.section`
  grid-area: posts;
`;
