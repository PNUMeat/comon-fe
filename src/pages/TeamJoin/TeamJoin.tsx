import { useWindowWidth } from '@/hooks/useWindowWidth';

import { Box } from '@/components/commons/Box';
import { Pagination } from '@/components/commons/Pagination';
import { SText } from '@/components/commons/SText';
import { Spacer } from '@/components/commons/Spacer';
import { MyTeamCard } from '@/components/features/TeamJoin/MyTeamCard';
import { TeamList } from '@/components/features/TeamJoin/TeamList';

import { useState } from 'react';
import { Link } from 'react-router-dom';

import { getTeamList, searchTeams } from '@/api/team';
import { ServerResponse } from '@/api/types';
import click from '@/assets/TeamJoin/click.png';
import { breakpoints } from '@/constants/breakpoints';
import { PATH } from '@/routes/path';
import styled from '@emotion/styled';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { KeywordContext } from './KeywordContext';

const TeamData = () => {
  const [page, setPage] = useState(0);
  const [keyword, setKeyword] = useState('');
  const isSearchMode = keyword.trim().length > 0;

  const { data: queryData } = useQuery({
    queryKey: ['team-list', page],
    queryFn: () => {
      return getTeamList('recent', page, 6);
    },
    select: (data) => ({
      myTeams: data.myTeams ?? [],
      otherTeams: data.allTeams.content ?? [],
      totalPages: data.allTeams.page.totalPages ?? 1,
    }),
    retry: (failureCount, error: AxiosError<ServerResponse<null>>) => {
      if (
        error.response &&
        error.response.status === 401 &&
        (error.response.data.code === 100 || error.response.data.code === 101)
      ) {
        console.log('asdasd tj');
        return false;
      }

      return failureCount < 3;
    },
  });

  const { data: searchData } = useQuery({
    queryKey: ['team-search', keyword],
    queryFn: () => searchTeams(keyword),
    select: (data) => ({
      otherTeams: data.content,
      // TODO: 아직 검색은 백엔드에서 페이지 인덱스 지원x
      // totalPages: data?.page?.totalPages,
      totalPages: 1,
    }),
    enabled: isSearchMode,
  });

  const handlePageChange = (newPage: number) => setPage(newPage);

  const myTeam = queryData?.myTeams ?? [];
  const otherTeams = isSearchMode
    ? searchData?.otherTeams
    : queryData?.otherTeams;
  const totalPages = isSearchMode
    ? (searchData?.totalPages ?? 1)
    : (queryData?.totalPages ?? 1);
  const currPage = isSearchMode ? 1 : page;

  return (
    <KeywordContext.Provider value={{ keyword, setKeyword }}>
      {/* 나의 팀 */}
      {myTeam.length > 0 && <MyTeamCard teams={myTeam} />}
      {/* 활동 팀 찾기 */}
      <TeamList teams={otherTeams} myTeam={myTeam} />
      <Pagination
        totalPages={totalPages}
        onPageChange={handlePageChange}
        currentPageProp={currPage}
      />
      <Spacer h={34} />
    </KeywordContext.Provider>
  );
};

const TeamJoinPage = () => {
  const width = useWindowWidth();
  const isMobile = width <= breakpoints.mobile;

  return (
    <>
      <TeamData />
      <SText color="#777" fontSize="14px" textAlign="center">
        혹은, 새로운 팀을 생성하시겠나요?
      </SText>
      <Spacer h={48} />
      <Link to={PATH.TEAM_REGISTRATION} style={{ textDecoration: 'none' }}>
        <Box
          width="100%"
          height={isMobile ? '48px' : '80px'}
          padding="0"
          borderWidth={isMobile ? '1.5px' : '3px'}
        >
          <ClickImage src={click} />
          <ActionText>
            <SText
              color="#333"
              fontSize={isMobile ? '16px' : '20px'}
              fontWeight={700}
            >
              팀 생성하기
            </SText>
          </ActionText>
        </Box>
      </Link>
      <Spacer h={100} />
    </>
  );
};

const ClickImage = styled.img`
  width: 24px;
  height: 24px;
`;

const ActionText = styled.div`
  margin-left: 8px;
`;

export default TeamJoinPage;
