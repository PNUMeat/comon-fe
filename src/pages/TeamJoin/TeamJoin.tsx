import { useWindowWidth } from '@/hooks/useWindowWidth';

import { Box } from '@/components/commons/Box';
import { Pagination } from '@/components/commons/Pagination';
import { SText } from '@/components/commons/SText';
import { Spacer } from '@/components/commons/Spacer';
import { MyTeamCard } from '@/components/features/TeamJoin/MyTeamCard';
import { TeamList } from '@/components/features/TeamJoin/TeamList';

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { ITeamInfo, getTeamList, searchTeams } from '@/api/team';
import { ServerResponse } from '@/api/types';
import click from '@/assets/TeamJoin/click.png';
import { breakpoints } from '@/constants/breakpoints';
import { PATH } from '@/routes/path';
import styled from '@emotion/styled';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

const TeamData = () => {
  const [page, setPage] = useState(0);
  const [keyword, setKeyword] = useState('');
  const [myTeam, setMyTeam] = useState<ITeamInfo[]>([]);
  const [otherTeams, setOtherTeams] = useState<ITeamInfo[]>([]);
  const [totalPages, setTotalPages] = useState(1);

  const { data: initialData } = useQuery({
    queryKey: ['team-list', page],
    queryFn: () => getTeamList('recent', page, 6),
    retry: (failureCount, error: AxiosError<ServerResponse<null>>) => {
      if (
        error.response &&
        error.response.status === 401 &&
        error.response.data.code === 100
      ) {
        return false;
      }

      return failureCount < 3;
    },
  });

  useEffect(() => {
    if (initialData) {
      setMyTeam(initialData.myTeams || []);
      setOtherTeams(initialData.allTeams.content || []);
      setTotalPages(initialData.allTeams.page.totalPages || 1);
    }
  }, [initialData]);

  const handleSearch = async (searchKeyword: string) => {
    setKeyword(searchKeyword);

    if (!searchKeyword.trim()) {
      setMyTeam(initialData?.myTeams || []);
      setOtherTeams(initialData?.allTeams.content || []);
      setTotalPages(initialData?.allTeams.page.totalPages || 1);
      return;
    }

    const res = await searchTeams(searchKeyword);
    setOtherTeams(res.content || []);
    setTotalPages(res.page.totalPages || 1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);

    if (!keyword.trim()) {
      // 검색어가 없을 때
      getTeamList('recent', newPage, 6).then((data) => {
        setMyTeam(data.myTeams || []);
        setOtherTeams(data.allTeams.content || []);
        setTotalPages(data.allTeams.page.totalPages || 1);
      });
    } else {
      // 검색어가 있을 때
      searchTeams(keyword).then((result) => {
        setOtherTeams(result.content || []);
        setTotalPages(result.page.totalPages || 1);
      });
    }
  };

  return (
    <>
      {/* 나의 팀 */}
      {myTeam.length > 0 && <MyTeamCard teams={myTeam || []} />}
      {/* 활동 팀 찾기 */}
      <TeamList teams={otherTeams} onSearch={handleSearch} />
      <Pagination
        totalPages={totalPages}
        onPageChange={handlePageChange}
        currentPageProp={page}
      />
      <Spacer h={34} />
    </>
  );
};

export const TeamJoinPage = () => {
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
        <Box width="100%" height="48px" padding="0" borderWidth="1.5px">
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
