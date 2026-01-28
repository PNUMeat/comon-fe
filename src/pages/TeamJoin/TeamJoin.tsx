import { useWindowWidth } from '@/hooks/useWindowWidth';

import { Box } from '@/components/commons/Box';
import { Pagination } from '@/components/commons/Pagination';
import { SText } from '@/components/commons/SText';
import { Spacer } from '@/components/commons/Spacer';
import { MyTeamCard } from '@/components/features/TeamJoin/MyTeamCard';
import { TeamList } from '@/components/features/TeamJoin/TeamList';

import { useState } from 'react';
import { Link } from 'react-router-dom';

import { ITeamInfo, getTeamList, searchTeams } from '@/api/team';
import { ServerResponse } from '@/api/types';
import click from '@/assets/TeamJoin/click.png';
import { breakpoints } from '@/constants/breakpoints';
import { PATH } from '@/routes/path';
import styled from '@emotion/styled';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { KeywordPageControlContext } from './KeywordPageControlContext.tsx';

let myTeamCache: ITeamInfo[] = [];
let prevKeyword = '';
const totalPagesCacheMap: Map<string, number> = new Map();
const prevPageCacheMap: Map<string, number> = new Map();

const QUERY_MODE = 'query';
const SEARCH_MODE = 'search';

totalPagesCacheMap.set(QUERY_MODE, 1);
totalPagesCacheMap.set(SEARCH_MODE, 1);

prevPageCacheMap.set(QUERY_MODE, 0);
prevPageCacheMap.set(SEARCH_MODE, 0);

const TeamData = () => {
  const [page, setPage] = useState(-1);
  const [keyword, setKeyword] = useState(prevKeyword);
  const isSearchMode = keyword.trim().length > 0;

  const { data: queryData, isPending: queryPending } = useQuery({
    queryKey: ['team-list', page === -1 ? 0 : page],
    queryFn: () => getTeamList('recent', page === -1 ? 0 : page, 6),
    //placeholdreData에서 prevData ?? queryclient.getQueryData(['team-list', 이전 페이지`])
    // 위의 코드는 사용시 플로우를 완전히 제어 못할 거 같음
    // placeholderData: (prevData) => ({ prevData })},
    select: (data) => ({
      myTeams: data.myTeams,
      otherTeams: data.allTeams.content,
      totalPages: data.allTeams.page.totalPages,
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

  if (queryData) {
    myTeamCache = queryData.myTeams;
    totalPagesCacheMap.set(QUERY_MODE, queryData.totalPages);
  }

  const { data: searchData, isPending: searchPending } = useQuery({
    queryKey: ['team-search', keyword, page === -1 ? 0 : page],
    queryFn: () => searchTeams(keyword, 'recent', page === -1 ? 0 : page, 6),
    select: (data) => ({
      otherTeams: data.content,
      totalPages: data?.page?.totalPages,
    }),
    enabled: isSearchMode,
  });

  if (searchData) {
    totalPagesCacheMap.set(SEARCH_MODE, searchData.totalPages);
    prevKeyword = keyword;
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    const currMode = isSearchMode ? SEARCH_MODE : QUERY_MODE;
    prevPageCacheMap.set(currMode, newPage);
  };

  const myTeam = queryData?.myTeams ?? myTeamCache;
  const otherTeams = isSearchMode
    ? (searchData?.otherTeams ?? [])
    : (queryData?.otherTeams ?? []);
  const totalPages = isSearchMode
    ? (searchData?.totalPages ??
      (totalPagesCacheMap.get(SEARCH_MODE) as number))
    : (queryData?.totalPages ?? (totalPagesCacheMap.get(QUERY_MODE) as number));
  const currPage =
    page === -1
      ? (prevPageCacheMap.get(
          isSearchMode ? SEARCH_MODE : QUERY_MODE
        ) as number)
      : page;
  const isPending = isSearchMode ? searchPending : queryPending;

  return (
    <KeywordPageControlContext.Provider
      value={{ keyword, setKeyword, setPage }}
    >
      {/* 나의 팀 */}
      {myTeam.length > 0 && <MyTeamCard teams={myTeam} />}
      {/* 활동 팀 찾기 */}
      <TeamList teams={otherTeams} myTeam={myTeam} isPending={isPending} />
      <Pagination
        totalPages={totalPages}
        onPageChange={handlePageChange}
        currentPageProp={currPage}
        hideShadow={true}
      />
      <Spacer h={34} />
    </KeywordPageControlContext.Provider>
  );
};

const TeamJoinPage = () => {
  const width = useWindowWidth();
  const isMobile = width <= breakpoints.mobile;

  return (
    <>
      <TeamData />
      <SText
        color="#777"
        fontWeight={isMobile ? 400 : 500}
        fontSize={isMobile ? '10px' : '12px'}
        textAlign="center"
        fontFamily="Pretendard"
      >
        기존 팀원들과 새로운 스터디 팀을 만들어보세요
      </SText>
      <Spacer h={14} />
      <Link to={PATH.TEAM_REGISTRATION} style={{ textDecoration: 'none' }}>
        <Box
          width="100%"
          height={isMobile ? '40px' : '54px'}
          padding="0"
          borderWidth="1px"
          borderRadius={isMobile ? '32px' : '16px'}
          style={{ gap: '8px' }}
        >
          <ClickImage src={click} />
          <SText
            color="#333"
            fontSize={isMobile ? '14px' : '16px'}
            fontWeight={700}
            fontFamily="Pretendard"
          >
            팀 생성하기
          </SText>
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

export default TeamJoinPage;
