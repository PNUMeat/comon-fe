import { getLatestOwnArticle } from '@/utils/article';
import { isDevMode } from '@/utils/cookie.ts';
import { addDays, getMonday, getWeekDates, parseYMD } from '@/utils/week';

import { useSolvedDates } from '@/hooks/useSolvedDates.ts';
import { useTeamInfoManager } from '@/hooks/useTeamInfoManager.ts';
import { useWindowWidth } from '@/hooks/useWindowWidth';

import { CustomCalendar } from '@/components/commons/Calendar/Calendar';
import { Pagination } from '@/components/commons/Pagination';
import { Spacer } from '@/components/commons/Spacer';
import { CommentSection } from '@/components/features/Comment/CommentSection';
import { ArticleDetail } from '@/components/features/TeamDashboard/ArticleDetail';
import { ArticleFeedbackToggle } from '@/components/features/TeamDashboard/ArticleFeedbackToggle';
import { CalendarViewToggle } from '@/components/features/TeamDashboard/CalendarViewToggle';
import { Posts } from '@/components/features/TeamDashboard/Posts';
import { ScrollUpButton } from '@/components/features/TeamDashboard/ScrollUpButton';
import { SidebarAndAnnouncement } from '@/components/features/TeamDashboard/SidebarAndAnnouncement';
import { TeamJoinModal } from '@/components/features/TeamDashboard/TeamJoinModal.tsx';
import { TodayProblemSection } from '@/components/features/TeamDashboard/TodayProblemSection';
import { TopicDetail } from '@/components/features/TeamDashboard/TopicDetail';
import { WeeklyCalendar } from '@/components/features/TeamDashboard/WeeklyCalendar';
import { useScrollUpButtonPosition } from '@/components/features/TeamDashboard/hooks/useScrollUpButtonPosition.ts';

import { Fragment, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { IArticle, getArticlesByDate } from '@/api/dashboard';
import { ITeamInfo, getTeamList } from '@/api/team';
import { ServerResponse } from '@/api/types.ts';
import { breakpoints } from '@/constants/breakpoints';
import {
  calendarModeAtom,
  currentViewAtom,
  pageAtom,
  selectedDateAtom,
  selectedPostIdAtom,
  weekAnchorAtom,
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

  const [calendarMode] = useAtom(calendarModeAtom);
  const [weekAnchor] = useAtom(weekAnchorAtom);

  // 주간 보기가 두 달에 걸칠 때(저번주 시작 ~ 이번주 끝) 양쪽 달의 tags를 모두 fetch
  const weekMonths =
    calendarMode === 'weekly'
      ? (() => {
          const start = addDays(getMonday(parseYMD(weekAnchor)), -7);
          const end = parseYMD(getWeekDates(parseYMD(weekAnchor))[6]);
          return {
            primaryYear: start.getFullYear(),
            primaryMonth: start.getMonth() + 1,
            secondYear: end.getFullYear(),
            secondMonth: end.getMonth() + 1,
          };
        })()
      : null;

  const [page, setPage] = useAtom(pageAtom);
  const [currentView, setCurrentView] = useAtom(currentViewAtom);
  const [selectedArticleId, setSelectedArticleId] = useAtom(selectedPostIdAtom);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPostsExpanded, setIsPostsExpanded] = useState(true);

  useEffect(() => {
    setSelectedArticleId(null);
    setCurrentView(null);
  }, [teamId]);

  const { boundRef, buttonRef, onClickJump } = useScrollUpButtonPosition();

  const { tagsMap, myTeamResponse, isTeamManager, isPending } =
    useTeamInfoManager({
      teamId,
      year: weekMonths ? weekMonths.primaryYear : year,
      month: weekMonths ? weekMonths.primaryMonth : month,
      secondYear: weekMonths?.secondYear,
      secondMonth: weekMonths?.secondMonth,
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
  const { data: pinnedArticlesData, refetch: refetchPinnedArticles } = useQuery(
    {
      queryKey: ['articles-by-date-pinned', teamId, selectedDate],
      queryFn: () => getArticlesByDate(Number(teamId), selectedDate, 0, 1000),
      enabled: !!teamId && !!selectedDate,
    }
  );
  const pinnedArticle = useMemo(
    () => getLatestOwnArticle(pinnedArticlesData?.content ?? []) ?? null,
    [pinnedArticlesData?.content]
  );
  const displayedArticlesData = useMemo(() => {
    if (!pinnedArticlesData) {
      return articlesData;
    }

    const pageSize = 6;
    const articles = pinnedArticlesData.content.filter(
      (article) => article.articleId !== pinnedArticle?.articleId
    );
    const start = page * pageSize;

    return {
      content: articles.slice(start, start + pageSize),
      page: {
        size: pageSize,
        number: page,
        totalElements: articles.length,
        totalPages: Math.ceil(articles.length / pageSize),
      },
    };
  }, [articlesData, page, pinnedArticle?.articleId, pinnedArticlesData]);
  const selectedArticle = useMemo(() => {
    if (!selectedArticleId) {
      return null;
    }

    return (
      [
        ...(displayedArticlesData?.content ?? []),
        ...(pinnedArticle ? [pinnedArticle] : []),
      ].find((article) => article.articleId === selectedArticleId) ?? null
    );
  }, [displayedArticlesData?.content, pinnedArticle, selectedArticleId]);
  const refetchArticleViews = () => {
    refetch();
    refetchPinnedArticles();
  };
  // 가장 비용이 적은 캐싱
  if (isPaginationReady && articlesData) {
    totalPageCache = articlesData.page.totalPages;
  }

  const onClickCalendarDate = (newDate: string) => {
    setSelectedDate(newDate);
    setPage(0);
    setIsPostsExpanded(true);
    setSelectedArticleId(null);
    setCurrentView(null);
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

  // 월간 캘린더 풀이 체크박스 데이터 — 멤버 전용, 월간 모드에서만 조회
  const { solvedDates } = useSolvedDates({
    teamId,
    year,
    month,
    enabled: isMyTeam && calendarMode === 'monthly',
  });

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
          <CalendarViewToggle />
          {calendarMode === 'weekly' ? (
            <WeeklyCalendar
              tags={tagsMap.get(teamId as string) ?? []}
              onDateSelect={onClickCalendarDate}
              selectedDate={selectedDate}
              teamId={teamId}
              isMyTeam={isMyTeam}
            />
          ) : (
            <CustomCalendar
              tags={tagsMap.get(teamId as string) ?? []}
              onDateSelect={onClickCalendarDate}
              selectedDate={selectedDate}
              isPending={isPending}
              studyUi
              solvedDates={isMyTeam ? solvedDates : undefined}
            />
          )}
          {calendarMode === 'weekly' && (
            <>
              <Spacer h={24} />
              <TodayProblemSection
                teamId={teamId}
                selectedDate={selectedDate}
                isMyTeam={isMyTeam}
              />
            </>
          )}
          <Spacer h={24} isRef ref={boundRef} />
          <Posts
            data={displayedArticlesData}
            tags={tagsMap.get(teamId as string) ?? []}
            selectedDate={selectedDate}
            isExpanded={isPostsExpanded}
            pinnedArticle={pinnedArticle}
            showPinnedSlot
            studyUi
            onToggleExpanded={() => setIsPostsExpanded((prev) => !prev)}
            onShowTopicDetail={handleShowTopicDetail}
            onShowArticleDetail={handleShowArticleDetail}
          />
          {displayedArticlesData && isPostsExpanded && (
            <Pagination
              totalPages={
                displayedArticlesData.page.totalPages ?? totalPageCache
              }
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
          {currentView === 'article' && selectedArticle && (
            <>
              <ArticleDetail
                data={selectedArticle as IArticle}
                shouldBlur={!isMyTeam}
                refetchArticles={refetchArticleViews}
                teamId={Number(teamId)}
                setIsModalOpen={setIsModalOpen}
                setSelectedArticleId={setSelectedArticleId}
              />
              {selectedArticle.isAuthor && (
                <ArticleFeedbackToggle articleId={selectedArticle.articleId} />
              )}
              <CommentSection articleId={selectedArticle.articleId} />
            </>
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
