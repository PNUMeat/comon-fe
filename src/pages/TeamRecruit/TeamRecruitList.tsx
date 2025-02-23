import { Box } from '@/components/commons/Box';
import { Container } from '@/components/commons/Container';
import { Flex } from '@/components/commons/Flex';
import { Label } from '@/components/commons/Label';
import { Pagination } from '@/components/commons/Pagination';
import { SText } from '@/components/commons/SText';
import { Spacer } from '@/components/commons/Spacer';

import { useState } from 'react';
import { Link } from 'react-router-dom';

import click from '@/assets/TeamJoin/click.png';
import { colors } from '@/constants/colors';
import { PATH } from '@/routes/path';
import styled from '@emotion/styled';

// TODO:
const teamList = [
  {
    id: 1,
    title: '백준 스터디',
    author: '파댕이',
    date: '2024.02.05',
    status: '모집중',
    description:
      '[코드 몬스터] 🚀 팀 코딩 테스트 함께 하실 분 모집!함께 성장하고 도전하며, 효율적으로 코딩 실력을 쌓아갈 열정 있는 분을 찾고 있습니다. 혼자가 아닌 팀과 함께 목표를 이루고 싶다면 지금 바로 참여하세요! 매일 꾸준히 코딩 테스트를 연습하며 실력을 키우고 싶은 분, 라이트한 분위기에서 즐겁게 함께...',
  },
  {
    id: 2,
    title: 'React 스터디 모집',
    author: 'React러버',
    date: '2024.02.10',
    status: '모집중',
    description:
      '[코드 몬스터] 🚀 팀 코딩 테스트 함께 하실 분 모집!함께 성장하고 도전하며, 효율적으로 코딩 실력을 쌓아갈 열정 있는 분을 찾고 있습니다. 혼자가 아닌 팀과 함께 목표를 이루고 싶다면 지금 바로 참여하세요! 매일 꾸준히 코딩 테스트를 연습하며 실력을 키우고 싶은 분, 라이트한 분위기에서 즐겁게 함께...',
  },
  {
    id: 3,
    title: '알고리즘 스터디',
    author: '알고몬',
    date: '2024.01.31',
    status: '모집완료',
    description: 'absdfsadasffsa',
  },
];

const tabs = [
  { label: '전체', value: 'all' },
  { label: '모집중', value: 'ongoing' },
  { label: '모집완료', value: 'done' },
];

export const TeamRecruitListPage = () => {
  const [selectedTab, setSelectedTab] = useState<'all' | 'ongoing' | 'done'>(
    'all'
  );

  return (
    <Container padding="30px 20px">
      <Flex justify="space-between">
        {/* 탭 메뉴 */}
        <TabWrapper>
          {tabs.map((tab) => (
            <TabButton
              key={tab.value}
              isActive={selectedTab === tab.value}
              onClick={() => setSelectedTab('all')} // TODO:
            >
              {tab.label}
            </TabButton>
          ))}
        </TabWrapper>

        {/* 오른쪽 상단 버튼 */}
        <Flex width={30} gap="12px" justify="flex-end" height={36}>
          <StyledButton backgroundColor="#e5e6ed" color="#333">
            가이드
          </StyledButton>
          <StyledButton backgroundColor="#6b71f8" color="#fff">
            글쓰기
          </StyledButton>
        </Flex>
      </Flex>

      <Spacer h={36} />
      {/* 모집글 리스트 */}
      <Flex direction="column" gap="8px">
        {teamList.length > 0 ? (
          teamList.map((team) => (
            <Card key={team.id}>
              <Flex gap="16px" align="center">
                <Label
                  background={colors.buttonPurple}
                  padding="4px 10px"
                  style={{ border: 'none', height: '24px' }}
                >
                  <SText
                    color="#fff"
                    fontSize="14px"
                    fontWeight={700}
                    fontFamily="Pretendard"
                  >
                    {team.status}
                  </SText>
                </Label>
                <SText
                  color="#000"
                  fontSize="18px"
                  fontWeight={700}
                  fontFamily="Pretendard"
                >
                  {team.title}
                </SText>
              </Flex>
              <SText
                fontSize="16px"
                fontWeight={500}
                fontFamily="Pretendard"
                lineHeight="normal"
                style={{ height: '40px' }}
              >
                {team.description}
              </SText>
              <Flex gap="12px">
                <SText
                  color="#5C5C5C"
                  fontSize="12px"
                  fontWeight={500}
                  fontFamily="Pretendard"
                >
                  {team.author}
                </SText>
                <SText
                  color="#5C5C5C"
                  fontSize="12px"
                  fontWeight={400}
                  fontFamily="Pretendard"
                >
                  {team.date}
                </SText>
              </Flex>
            </Card>
          ))
        ) : (
          <SText
            color="#ccc"
            fontSize="16px"
            fontFamily="Pretendard"
            fontWeight={600}
          >
            지금은 모집글이 없어요
          </SText>
        )}
      </Flex>
      <Spacer h={36} />
      <Pagination
        totalPages={5}
        onPageChange={() => {}}
        currentPageProp={3}
        hideShadow={true}
      />
      <Spacer h={56} />
      <SText color="#333" fontWeight={400} fontSize="14px" textAlign="center">
        모집글 없이 이미 정해진 팀원들과 팀 생성하기
      </SText>
      <Spacer h={14} />
      <Link to={PATH.TEAM_REGISTRATION} style={{ textDecoration: 'none' }}>
        <Box
          width="100%"
          height={'80px'}
          padding="0"
          borderWidth="1px"
          borderRadius="20px"
          style={{ gap: '8px' }}
        >
          <img src={click} style={{ width: '24px', height: '24px' }} />
          <SText color="#333" fontSize="18px" fontWeight={700}>
            팀 생성하기
          </SText>
        </Box>
      </Link>
    </Container>
  );
};

const TabWrapper = styled.div`
  display: flex;
  border-bottom: 1px solid #e5e6ed;
  width: 100%;
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
`;
