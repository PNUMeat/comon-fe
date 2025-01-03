import { CustomCalendar } from '@/components/commons/Calendar/Calendar';
import { Pagination } from '@/components/commons/Pagination';
import { Spacer } from '@/components/commons/Spacer';
import { ArticleDetail } from '@/components/features/TeamDashboard/ArticleDetail';
import { Posts } from '@/components/features/TeamDashboard/Posts';
import { SidebarAndAnnouncement } from '@/components/features/TeamDashboard/SidebarAndAnnouncement';
import { TopicDetail } from '@/components/features/TeamDashboard/TopicDetail';

import { Fragment, useLayoutEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import {
  IArticle,
  getArticlesByDate,
  getTeamInfoAndTags,
} from '@/api/dashboard';
import { ITeamInfo } from '@/api/team';
import { currentViewAtom, selectedPostIdAtom } from '@/store/dashboard';
import styled from '@emotion/styled';
import { useQuery } from '@tanstack/react-query';
import { useAtom } from 'jotai/index';

export const TeamDashboardPage = () => {
  const { teamId } = useParams<{ teamId: string }>();

  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>(today);
  const [year, month] = selectedDate.split('-').map(Number);

  const [page, setPage] = useState<number>(0);
  const [currentView, setCurrentView] = useAtom(currentViewAtom);
  const [selectedArticleId, setSelectedArticleId] = useAtom(selectedPostIdAtom);

  const { data: teamInfoData } = useQuery({
    queryKey: ['team-info', teamId, year, month],
    queryFn: () => getTeamInfoAndTags(Number(teamId), year, month),
    enabled: !!teamId,
  });

  const { data: articlesData } = useQuery({
    queryKey: ['articles-by-date', teamId, selectedDate, page],
    queryFn: () => getArticlesByDate(Number(teamId), selectedDate, page),
    enabled: !!teamId && !!selectedDate,
  });

  useLayoutEffect(() => {
    if (currentView === 'article') {
      setTimeout(() => {
        scrollTo({
          top: document.documentElement.scrollHeight,
          behavior: 'instant',
        });
      });
    }
  }, [currentView]);

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

  const teamInfo = teamInfoData?.myTeamResponse || ({} as ITeamInfo);
  const isTeamManager = teamInfoData?.teamManager || false;
  const tags = teamInfoData?.subjectArticleDateAndTagResponses || [];

  return (
    <Fragment>
      <Spacer h={28} />
      <Grid>
        {teamInfoData && (
          <SidebarAndAnnouncement
            teamInfo={teamInfo}
            isTeamManager={isTeamManager}
          />
        )}
        <CalendarSection>
          <CustomCalendar
            tags={tags}
            onDateSelect={setSelectedDate}
            selectedDate={selectedDate}
          />
          <Spacer h={24} />
          {articlesData && (
            <>
              <Posts
                data={articlesData}
                tags={tags}
                selectedDate={selectedDate}
                onShowTopicDetail={handleShowTopicDetail}
                onShowArticleDetail={handleShowArticleDetail}
              />
              <Pagination
                totalPages={articlesData.page.totalPages}
                currentPageProp={page}
                onPageChange={handlePageChange}
              />
            </>
          )}
          <Spacer h={40} />
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
              teamId={Number(teamId)}
            />
          )}
        </CalendarSection>
      </Grid>
      <Spacer h={200} />
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
`;

const CalendarSection = styled.section`
  grid-area: calendar;
  background-color: #f8f8ff;
  border-radius: 20px;
  padding: 20px 36px 40px 36px;
  margin-bottom: 100px;
`;
