import { useJumpOnClick } from '@/hooks/useJumpOnClick';
import { useWindowWidth } from '@/hooks/useWindowWidth';

import { CustomCalendar } from '@/components/commons/Calendar/Calendar';
import { Pagination } from '@/components/commons/Pagination';
import { Spacer } from '@/components/commons/Spacer';
import { ArticleDetail } from '@/components/features/TeamDashboard/ArticleDetail';
import { Posts } from '@/components/features/TeamDashboard/Posts';
import { ScrollUpButton } from '@/components/features/TeamDashboard/ScrollUpButton';
import { SidebarAndAnnouncement } from '@/components/features/TeamDashboard/SidebarAndAnnouncement';
import { TopicDetail } from '@/components/features/TeamDashboard/TopicDetail';

import { Fragment, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import {
  IArticle,
  ICalendarTag,
  getArticlesByDate,
  getTeamInfoAndTags,
} from '@/api/dashboard';
import { ITeamInfo } from '@/api/team';
import { breakpoints } from '@/constants/breakpoints';
import {
  currentViewAtom,
  pageAtom,
  selectedDateAtom,
  selectedPostIdAtom,
} from '@/store/dashboard';
import styled from '@emotion/styled';
import { useQuery } from '@tanstack/react-query';
import { useAtom } from 'jotai';

export const TeamDashboardPage = () => {
  const { teamId } = useParams<{ teamId: string }>();

  const [selectedDate, setSelectedDate] = useAtom(selectedDateAtom);
  const [year, month] = selectedDate.split('-').map(Number);

  const [page, setPage] = useAtom(pageAtom);
  const [currentView, setCurrentView] = useAtom(currentViewAtom);
  const [selectedArticleId, setSelectedArticleId] = useAtom(selectedPostIdAtom);

  const [tags, setTags] = useState<ICalendarTag[]>([]);

  const addTags = (newTags: ICalendarTag[]) => {
    setTags((prevTags) => {
      const updatedTags = [...prevTags];

      newTags.forEach((newTag) => {
        const existingIndex = updatedTags.findIndex(
          (tag) => tag.subjectDate === newTag.subjectDate
        );
        if (existingIndex !== -1) {
          updatedTags[existingIndex] = newTag;
        } else {
          updatedTags.push(newTag);
        }
      });

      return updatedTags;
    });
  };

  const { boundRef, buttonRef, onClickJump } = useJumpOnClick();
  useEffect(() => {
    if (boundRef?.current && buttonRef?.current) {
      const bound = boundRef.current;
      const button = buttonRef.current;
      const { right } = bound.getBoundingClientRect();
      button.style.transform = `translate(${right + 30}px, calc(100vh - 20vh))`;
      button.style.opacity = '0';
      button.disabled = true;
    }
  }, [boundRef, buttonRef]);

  const { data: teamInfoData, isSuccess } = useQuery({
    queryKey: ['team-info', teamId, year, month],
    queryFn: () => getTeamInfoAndTags(Number(teamId), year, month),
    enabled: !!teamId,
  });
  useEffect(() => {
    if (isSuccess && teamInfoData) {
      addTags(teamInfoData.subjectArticleDateAndTagResponses);
    }
  }, [isSuccess]);

  const { data: articlesData, refetch } = useQuery({
    queryKey: ['articles-by-date', teamId, selectedDate, page],
    queryFn: () => getArticlesByDate(Number(teamId), selectedDate, page),
    enabled: !!teamId && !!selectedDate,
  });

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

  const width = useWindowWidth();
  const isMobile = width <= breakpoints.mobile;

  return (
    <Fragment>
      <Spacer h={isMobile ? 16 : 28} />
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
          <Spacer h={24} isRef ref={boundRef} />
          <Posts
            data={articlesData}
            tags={tags}
            selectedDate={selectedDate}
            onShowTopicDetail={handleShowTopicDetail}
            onShowArticleDetail={handleShowArticleDetail}
            key={`${['articles-by-date', teamId, selectedDate, page]}?${status}`}
          />
          <Pagination
            totalPages={articlesData?.page?.totalPages ?? 0}
            currentPageProp={page}
            onPageChange={handlePageChange}
          />
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
              refetchArticles={refetch}
              teamId={Number(teamId)}
            />
          )}
        </CalendarSection>
        <ScrollUpButton onClick={onClickJump} ref={buttonRef} />
      </Grid>
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
    padding: 8px 24px 16px 24px;
    border-radius: 10px;
  }
`;
