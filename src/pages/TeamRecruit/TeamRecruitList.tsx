import { useWindowWidth } from '@/hooks/useWindowWidth';

import { Box } from '@/components/commons/Box';
import { Flex } from '@/components/commons/Flex';
import { Label } from '@/components/commons/Label';
import { Pagination } from '@/components/commons/Pagination';
import { SText } from '@/components/commons/SText';
import { Spacer } from '@/components/commons/Spacer';

import { useState } from 'react';
import { Link } from 'react-router-dom';

import { getTeamRecruitList } from '@/api/recruitment';
import click from '@/assets/TeamJoin/click.png';
import { breakpoints } from '@/constants/breakpoints';
import { colors } from '@/constants/colors';
import { PATH } from '@/routes/path';
import styled from '@emotion/styled';
import { useQuery } from '@tanstack/react-query';

const tabs: { label: string; value: 'all' | 'open' | 'closed' }[] = [
  { label: '전체', value: 'all' },
  { label: '모집중', value: 'open' },
  { label: '모집완료', value: 'closed' },
];

export const TeamRecruitListPage = () => {
  const [selectedTab, setSelectedTab] = useState<'all' | 'open' | 'closed'>(
    'all'
  );
  const [currentPage, setCurrentPage] = useState(0);

  const width = useWindowWidth();
  const isMobile = width <= breakpoints.mobile;

  const { data: teamList } = useQuery({
    queryKey: ['teamRecruits', selectedTab, currentPage],
    queryFn: () => getTeamRecruitList(selectedTab, currentPage, 5),
    placeholderData: (previousData) => previousData,
  });

  const totalPages = teamList?.page?.totalPages ?? 1;

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <div style={{ padding: isMobile ? '0px' : '30px 20px' }}>
      {isMobile && (
        <>
          <Flex
            width={100}
            gap="12px"
            justify="flex-end"
            height={isMobile ? 26 : 60}
          >
            <StyledButton backgroundColor="#e5e6ed" color="#333">
              가이드
            </StyledButton>
            <Link to={`${PATH.TEAM_RECRUIT}/posting`}>
              <StyledButton backgroundColor="#6b71f8" color="#fff">
                글쓰기
              </StyledButton>
            </Link>
          </Flex>
          <Spacer h={16} />
        </>
      )}
      <Flex justify="space-between">
        {/* 탭 메뉴 */}
        <TabWrapper>
          {tabs.map((tab) => (
            <TabButton
              key={tab.value}
              isActive={selectedTab === tab.value}
              onClick={() => setSelectedTab(tab.value)}
            >
              {tab.label}
            </TabButton>
          ))}
        </TabWrapper>

        {/* 오른쪽 상단 버튼 */}
        {!isMobile && (
          <Flex width={30} gap="12px" justify="flex-end" height={36}>
            <StyledButton backgroundColor="#e5e6ed" color="#333">
              가이드
            </StyledButton>
            <Link to={`${PATH.TEAM_RECRUIT}/posting`}>
              <StyledButton backgroundColor="#6b71f8" color="#fff">
                글쓰기
              </StyledButton>
            </Link>
          </Flex>
        )}
      </Flex>

      <Spacer h={isMobile ? 24 : 36} />
      {/* 모집글 리스트 */}
      <Flex direction="column" gap={isMobile ? '6px' : '8px'}>
        {(teamList?.content ?? []).length > 0 ? (
          (teamList?.content ?? []).map((team) => (
            <Card key={team.recruitmentId}>
              <Flex gap={isMobile ? '8px' : '16px'} align="center">
                <Label
                  background={
                    team.isRecruiting ? colors.buttonPurple : '#8E8E8E'
                  }
                  padding="4px 10px"
                  style={{ border: 'none', height: isMobile ? '18px' : '24px' }}
                >
                  <SText
                    color="#fff"
                    fontSize={isMobile ? '10px' : '14px'}
                    fontWeight={700}
                    fontFamily="Pretendard"
                  >
                    {team.isRecruiting ? '모집중' : '모집완료'}
                  </SText>
                </Label>
                <SText
                  color="#000"
                  fontSize={isMobile ? '14px' : '18px'}
                  fontWeight={700}
                  fontFamily="Pretendard"
                >
                  {team.teamRecruitTitle}
                </SText>
              </Flex>
              <SText
                fontSize={isMobile ? '12px' : '16px'}
                fontWeight={500}
                fontFamily="Pretendard"
                lineHeight="normal"
                shouldCut={true}
                style={{
                  height: isMobile ? '28px' : '40px',
                }}
              >
                {team.teamRecruitBody}
              </SText>
              <Flex gap="12px">
                <SText
                  color="#5C5C5C"
                  fontSize={isMobile ? '10px' : '12px'}
                  fontWeight={500}
                  fontFamily="Pretendard"
                >
                  {team.memberName}
                </SText>
                <SText
                  color="#5C5C5C"
                  fontSize={isMobile ? '10px' : '12px'}
                  fontWeight={400}
                  fontFamily="Pretendard"
                >
                  {team.createdAt}
                </SText>
              </Flex>
            </Card>
          ))
        ) : (
          <>
            <Spacer h={isMobile ? 50 : 130} />
            <SText
              color="#ccc"
              fontSize="16px"
              fontFamily="Pretendard"
              fontWeight={600}
              textAlign="center"
            >
              지금은 모집글이 없어요
            </SText>
            <Spacer h={isMobile ? 50 : 130} />
          </>
        )}
      </Flex>
      <Spacer h={36} />
      <Pagination
        totalPages={totalPages}
        onPageChange={handlePageChange}
        currentPageProp={currentPage}
        hideShadow={true}
      />
      <Spacer h={isMobile ? 36 : 56} />
      <SText
        color="#777"
        fontWeight={400}
        fontSize={isMobile ? '10px' : '14px'}
        textAlign="center"
      >
        모집글 없이 이미 정해진 팀원들과 팀 생성하기
      </SText>
      <Spacer h={14} />
      <Link to={PATH.TEAM_REGISTRATION} style={{ textDecoration: 'none' }}>
        <Box
          width="100%"
          height={isMobile ? '48px' : '80px'}
          padding="0"
          borderWidth="1px"
          borderRadius={isMobile ? '40px' : '20px'}
          style={{ gap: '8px' }}
        >
          <img src={click} style={{ width: '24px', height: '24px' }} />
          <SText
            color="#333"
            fontSize={isMobile ? '16px' : '18px'}
            fontWeight={700}
          >
            팀 생성하기
          </SText>
        </Box>
      </Link>
    </div>
  );
};

const TabWrapper = styled.div`
  display: flex;
  border-bottom: 1px solid #e5e6ed;
  width: 100%;

  @media (max-width: ${breakpoints.mobile}px) {
    justify-content: space-around;
  }
`;

const TabButton = styled.button<{ isActive: boolean }>`
  border: none;
  cursor: pointer;
  padding: 10px 20px;
  font-size: 18px;
  font-weight: ${({ isActive }) => (isActive ? '700' : '600')};
  color: ${({ isActive }) => (isActive ? '#000' : '#777')};
  position: relative;
  transition: color 0.2s ease-in-out;

  &:hover {
    color: #000;
  }

  ${({ isActive }) =>
    isActive &&
    `
    &::after {
      content: "";
      position: absolute;
      left: 0;
      bottom: -2px;
      width: 100%;
      height: 3px;
      background-color: #000;
    }
  `}

  @media (max-width: ${breakpoints.mobile}px) {
    padding: 8px 20px;
    font-size: 14px;

    ${({ isActive }) =>
      isActive &&
      `
    &::after {
      bottom: -1.5px;
      width: 100%;
      height: 2px;
    }
  `}
  }
`;

export const StyledButton = styled.button<{
  backgroundColor: string;
  color: string;
}>`
  background-color: ${({ backgroundColor }) => backgroundColor};
  border-radius: 6px;
  padding: 0px 14px;
  color: ${({ color }) => color};
  font-size: 16px;
  font-family: 'Pretendard';
  font-weight: 700;
  border: none;
  width: 80px;
  height: 100%;

  @media (max-width: ${breakpoints.mobile}px) {
    border-radius: 4px;
    font-size: 12px;
    font-weight: 600;
    width: 60px;
    padding: 0px 10px;
  }
`;

const Card = styled.div`
  border-radius: 16px;
  background: #fff;
  box-shadow: 2px 2px 20px 0px rgba(94, 96, 153, 0.2);
  height: 130px;
  padding: 16px 26px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  @media (max-width: ${breakpoints.mobile}px) {
    height: 90px;
    padding: 14px 20px;
  }
`;
