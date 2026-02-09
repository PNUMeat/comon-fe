import { isDevMode } from '@/utils/cookie.ts';

import { useTeamInfoManager } from '@/hooks/useTeamInfoManager.ts';
import { useWindowWidth } from '@/hooks/useWindowWidth';

import { CustomCalendar } from '@/components/commons/Calendar/Calendar';
import { Pagination } from '@/components/commons/Pagination';
import { Spacer } from '@/components/commons/Spacer';
import { ArticleDetail } from '@/components/features/TeamDashboard/ArticleDetail';
import { Posts } from '@/components/features/TeamDashboard/Posts';
import { ScrollUpButton } from '@/components/features/TeamDashboard/ScrollUpButton';
import { SidebarAndAnnouncement } from '@/components/features/TeamDashboard/SidebarAndAnnouncement';
import { TeamJoinModal } from '@/components/features/TeamDashboard/TeamJoinModal.tsx';
import { TopicDetail } from '@/components/features/TeamDashboard/TopicDetail';
import { useScrollUpButtonPosition } from '@/components/features/TeamDashboard/hooks/useScrollUpButtonPosition.ts';

import { Fragment, useState } from 'react';
import { useParams } from 'react-router-dom';

import { IArticle, getArticlesByDate } from '@/api/dashboard';
import { ITeamInfo, getTeamList } from '@/api/team';
import { ServerResponse } from '@/api/types.ts';
import { breakpoints } from '@/constants/breakpoints';
import {
  currentViewAtom,
  pageAtom,
  selectedDateAtom,
  selectedPostIdAtom,
} from '@/store/dashboard';
import styled from '@emotion/styled';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useAtom } from 'jotai';

let totalPageCache = 0;

const TeamDashboardPage = () => {
  const { teamId } = useParams<{ teamId: string }>();

  const [selectedDate, setSelectedDate] = useAtom(selectedDateAtom);
  const [year, month] = selectedDate.split('-').map(Number);

  const [page, setPage] = useAtom(pageAtom);
  const [currentView, setCurrentView] = useAtom(currentViewAtom);
  const [selectedArticleId, setSelectedArticleId] = useAtom(selectedPostIdAtom);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { boundRef, buttonRef, onClickJump } = useScrollUpButtonPosition();

  const { tagsMap, myTeamResponse, isTeamManager, isPending } =
    useTeamInfoManager({
      teamId,
      year,
      month,
    });

  const {
    data: articlesData,
    refetch,
    isSuccess: isPaginationReady,
  } = useQuery({
    queryKey: ['articles-by-date', teamId, selectedDate, page],
    queryFn: () => getArticlesByDate(Number(teamId), selectedDate, page),
    enabled: !!teamId && !!selectedDate,
  });
  // 가장 비용이 적은 캐싱
  if (isPaginationReady && articlesData) {
    totalPageCache = articlesData.page.totalPages;
  }

  const onClickCalendarDate = (newDate: string) => {
    setSelectedDate(newDate);
    setPage(0);
  };

  const handleShowTopicDetail = () => {
    setCurrentView('topic');
    setSelectedArticleId(null);
  };

  const handleShowArticleDetail = (articleId: number) => {
    setSelectedArticleId(articleId);
    setCurrentView('article');
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const width = useWindowWidth();
  const isMobile = width <= breakpoints.mobile;

  const { data: teamData } = useQuery({
    queryKey: ['team-list', 0],
    queryFn: () => getTeamList('recent', 0, 6),
    retry: (failureCount, error: AxiosError<ServerResponse<null>>) => {
      if (
        error.response &&
        error.response.status === 401 &&
        error.response.data.code === 100
      ) {
        console.log('asdasd');
        return false;
      }

      return failureCount < 3;
    },
  });

  const isMyTeam = (teamData?.myTeams ?? []).reduce(
    (acc, myTeam) => acc || myTeam.teamId === parseInt(teamId as string),
    isDevMode()
  );

  return (
    <Fragment>
      <Spacer h={isMobile ? 16 : 28} />
      <Grid>
        <SidebarAndAnnouncement
          teamInfo={myTeamResponse ?? ({} as ITeamInfo)}
          isTeamManager={isTeamManager}
          isMyTeam={isMyTeam}
          setIsModalOpen={setIsModalOpen}
        />
        <CalendarSection>
          <CustomCalendar
            tags={tagsMap.get(teamId as string) ?? []}
            onDateSelect={onClickCalendarDate}
            selectedDate={selectedDate}
            isPending={isPending}
          />
          <Spacer h={24} isRef ref={boundRef} />
          <Posts
            data={articlesData}
            tags={tagsMap.get(teamId as string) ?? []}
            selectedDate={selectedDate}
            onShowTopicDetail={handleShowTopicDetail}
            onShowArticleDetail={handleShowArticleDetail}
          />
          {articlesData && (
            <Pagination
              totalPages={articlesData?.page.totalPages ?? totalPageCache}
              currentPageProp={page}
              onPageChange={handlePageChange}
              hideShadow={isMobile}
              marginTop="-70px"
            />
          )}

          <Spacer h={isMobile ? 30 : 40} />
          {currentView === 'topic' && (
            <TopicDetail teamId={Number(teamId)} selectedDate={selectedDate} />
          )}
          {currentView === 'article' && articlesData && selectedArticleId && (
            <ArticleDetail
              data={
                articlesData.content.find(
                  (article) => article.articleId === selectedArticleId
                ) as IArticle
              }
              shouldBlur={!isMyTeam}
              refetchArticles={refetch}
              teamId={Number(teamId)}
              setIsModalOpen={setIsModalOpen}
            />
          )}
          <ScrollUpButton onClick={onClickJump} ref={buttonRef} />
        </CalendarSection>
      </Grid>
      {isModalOpen && (
        <TeamJoinModal
          teamId={teamId as string}
          teamInfo={myTeamResponse ?? ({} as ITeamInfo)}
          setIsModalOpen={setIsModalOpen}
        />
      )}
    </Fragment>
  );
};

const Grid = styled.div`
  display: grid;
  grid-template-areas:
    'sidebar announcement'
    'sidebar calendar';
  grid-template-columns: 260px 1fr;
  grid-template-rows: auto 1fr auto;
  gap: 24px 40px;
  height: 100vh;

  @media (max-width: ${breakpoints.mobile}px) {
    display: block;
  }
`;

const CalendarSection = styled.section`
  grid-area: calendar;
  background-color: #f8f8ff;
  border-radius: 20px;
  padding: 20px 36px 40px 36px;
  margin-bottom: 100px;
  position: relative;

  @media (max-width: ${breakpoints.mobile}px) {
    padding: 8px 2px 16px 2px;
    border-radius: 10px;
  }
`;

export default TeamDashboardPage;
