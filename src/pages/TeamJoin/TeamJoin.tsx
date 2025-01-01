import { Box } from '@/components/commons/Box';
import { Pagination } from '@/components/commons/Pagination';
import { SText } from '@/components/commons/SText';
import { Spacer } from '@/components/commons/Spacer';
import { MyTeamCard } from '@/components/features/TeamJoin/MyTeamCard';
import { TeamList } from '@/components/features/TeamJoin/TeamList';

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { ITeamInfo, getTeamList, searchTeams } from '@/api/team';
import click from '@/assets/TeamJoin/click.png';
import { PATH } from '@/routes/path';
import styled from '@emotion/styled';
import { useQuery } from '@tanstack/react-query';

const TeamData = () => {
  const [page, setPage] = useState(0);
  const [keyword, setKeyword] = useState('');
  const [teams, setTeams] = useState<ITeamInfo[]>([]);
  const [totalPages, setTotalPages] = useState(1);

  const { data: initialData } = useQuery({
    queryKey: ['team-list', page],
    queryFn: () => getTeamList('recent', page, 6),
  });

  useEffect(() => {
    if (initialData) {
      setTeams(initialData.allTeams.content || []);
      setTotalPages(initialData.allTeams.page.totalPages || 1);
    }
  }, [initialData]);

  const handleSearch = async (searchKeyword: string) => {
    setKeyword(searchKeyword);

    if (!searchKeyword.trim()) {
      setTeams(initialData?.allTeams.content || []);
      setTotalPages(initialData?.allTeams.page.totalPages || 1);
      return;
    }

    const res = await searchTeams(searchKeyword);
    setTeams(res.content || []);
    setTotalPages(res.page.totalPages || 1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);

    if (!keyword.trim()) {
      // 검색어가 없을 때
      getTeamList('recent', newPage, 6).then((data) => {
        setTeams(data.allTeams.content || []);
        setTotalPages(data.allTeams.page.totalPages || 1);
      });
    } else {
      // 검색어가 있을 때
      searchTeams(keyword).then((result) => {
        setTeams(result.content || []);
        setTotalPages(result.page.totalPages || 1);
      });
    }
  };

  return (
    <>
      {/* 나의 팀 */}
      {(initialData?.myTeams || []).length > 0 && (
        <MyTeamCard teams={initialData?.myTeams || []} />
      )}
      {/* 활동 팀 찾기 */}
      <TeamList teams={teams} onSearch={handleSearch} />
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
  return (
    <>
      <TeamData />
      <SText color="#333" fontSize="14px" textAlign="center">
        혹은, 새로운 팀을 생성하시겠나요?
      </SText>
      <Spacer h={12} />
      <Link to={PATH.TEAM_REGISTRATION} style={{ textDecoration: 'none' }}>
        <Box width="100%" height="80px" padding="0" borderWidth="3px">
          <ClickImage src={click} />
          <ActionText>
            <SText fontSize="20px" fontWeight={700}>
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
