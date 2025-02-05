import { useTeamInfoManager } from '@/hooks/useTeamInfoManager.ts';
import { useWindowWidth } from '@/hooks/useWindowWidth';

import { Box } from '@/components/commons/Box';
import { CustomCalendar } from '@/components/commons/Calendar/Calendar';
import { Flex } from '@/components/commons/Flex';
import { LazyImage } from '@/components/commons/LazyImage';
import { Pagination } from '@/components/commons/Pagination';
import { SText } from '@/components/commons/SText';
import { Spacer } from '@/components/commons/Spacer';
import { ArticleDetail } from '@/components/features/TeamDashboard/ArticleDetail';
import { Posts } from '@/components/features/TeamDashboard/Posts';
import { ScrollUpButton } from '@/components/features/TeamDashboard/ScrollUpButton';
import { TopicDetail } from '@/components/features/TeamDashboard/TopicDetail';
import { useScrollUpButtonPosition } from '@/components/features/TeamDashboard/hooks/useScrollUpButtonPosition.ts';

import { Fragment, Suspense, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';

import { updateAnnouncement } from '@/api/announcement';
import { IArticle, getArticlesByDate, getTeamTopic } from '@/api/dashboard';
import announcementTodayIcon from '@/assets/TeamAdmin/announcementToday.svg';
import AnnouncementIcon from '@/assets/TeamDashboard/announcement_purple.png';
import PencilIcon from '@/assets/TeamDashboard/pencil.png';
import { breakpoints } from '@/constants/breakpoints';
import { PATH } from '@/routes/path';
import { currentViewAtom, selectedPostIdAtom } from '@/store/dashboard';
import styled from '@emotion/styled';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAtom } from 'jotai';

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

const Sidebar = styled.aside`
  grid-area: sidebar;

  @media (max-width: ${breakpoints.mobile}px) {
    display: flex;
    gap: 4px;
  }
`;

const ImageContainer = styled(LazyImage)`
  max-height: 84px;
`;

const Announcement = styled.header`
  grid-area: announcement;
  display: flex;
  justify-content: space-between;

  @media (max-width: ${breakpoints.mobile}px) {
    margin: 12px 0;
    border-radius: 10px;
    background: #f8f8ff;
    padding: 8px 10px;
  }
`;

const PostImage = styled.img`
  width: 24px;
  height: 24px;
  margin-right: 8px;
  cursor: pointer;

  @media (max-width: ${breakpoints.mobile}px) {
    width: 10px;
    height: 10px;
    margin-right: 0px;
  }
`;

const AnnouncementImageWrapper = styled.div`
  position: absolute;
  top: 28px;
  left: 16px;
  transform: translateY(-50%);

  @media (max-width: ${breakpoints.mobile}px) {
    top: 14px;
    left: 12px;
  }
`;

const AnnouncementImage = styled.img`
  width: 18px;
  height: 18px;
  margin-right: 8px;

  @media (max-width: ${breakpoints.mobile}px) {
    width: 12px;
    height: 12px;
    margin-right: 4px;
  }
`;

const SubjectImage = styled(PostImage)`
  width: 24px;
  height: 24px;
  margin-right: 8px;

  @media (max-width: ${breakpoints.mobile}px) {
    width: 12px;
    height: 12px;
    margin-right: 8px;
  }
`;

const SubjectControlButtonWrap = styled.button`
  display: flex;
  align-items: center;
  height: 70px;
  padding: 24px 72px;
  border-radius: 20px;
  background: var(--1, linear-gradient(98deg, #fe82db 6.1%, #68e4ff 103.66%));
  box-shadow: 5px 7px 11.6px 0px rgba(63, 63, 77, 0.07);
  border: none;
  margin-left: 27px;

  @media (max-width: ${breakpoints.mobile}px) {
    width: 100px;
    height: 32px;
    padding: 12px 20px;
    border-radius: 28px;
  }
`;

const SubjectControlButton: React.FC<{
  id: string;
  selectedDate: string;
}> = ({ id, selectedDate }) => {
  const navigate = useNavigate();
  const { data, isSuccess } = useQuery({
    queryKey: ['team-topic', id, selectedDate],
    queryFn: () => getTeamTopic(parseInt(id), selectedDate),
  });

  const width = useWindowWidth();
  const isMobile = width <= breakpoints.mobile;

  return (
    <SubjectControlButtonWrap
      onClick={() =>
        navigate(`/team-subject/${id}/${selectedDate}`, {
          state: {
            articleBody: data?.articleBody ?? null,
            articleId: data?.articleId ?? null,
            articleTitle: data?.articleTitle ?? null,
            articleCategory: data?.articleCategory ?? null,
            // TODO: 이미지 하나로 롤백
            // articleImageUrls: data?.imageUrls ?? null,
            articleImageUrl: data?.imageUrl ?? null,
          },
        })
      }
    >
      <SubjectImage src={PencilIcon} alt={'pencil icon'} />
      <SText
        fontSize={isMobile ? '10px' : '18px'}
        color={isSuccess ? '#fff' : 'transparent'}
        fontWeight={700}
        whiteSpace={'nowrap'}
      >
        {!isSuccess ? '요청 대기' : data?.articleId ? '문제 수정' : '문제 작성'}
      </SText>
    </SubjectControlButtonWrap>
  );
};

const AnnouncementAndSubject: React.FC<{
  announcementToday?: string;
  id: string;
  selectedDate: string;
}> = ({ announcementToday, id, selectedDate }) => {
  const width = useWindowWidth();
  const isMobile = width <= breakpoints.mobile;
  const queryClient = useQueryClient();

  const [isEditing, setIsEditing] = useState(false);
  const [announcement, setAnnouncement] = useState<string>(
    announcementToday ?? ''
  );

  const toggleEditing = () => setIsEditing((prev) => !prev);

  const handleSave = () => {
    updateAnnouncement(Number(id), announcement)
      .then(() => {
        const [year, month] = selectedDate.split('-').map(Number);
        queryClient.refetchQueries({
          queryKey: ['team-info', id, year, month],
        });
      })
      .catch(() => {
        setIsEditing(true);
      });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setAnnouncement(announcementToday ?? '');
    setIsEditing(false);
  };

  return (
    <Announcement>
      <Box
        width={isMobile ? '204px' : '470px'}
        height={isEditing ? 'auto' : isMobile ? 'auto' : '70px'}
        padding={isMobile ? '6px 14px' : '12px 28px'}
        borderRadius={isMobile ? '4px' : '20px'}
        borderWidth={isMobile ? '0px' : '1px'}
        style={{
          overflow: 'hidden',
          cursor: 'pointer',
          textOverflow: isEditing ? 'unset' : 'ellipsis',
          whiteSpace: isEditing ? 'normal' : 'nowrap',
          position: 'relative',
        }}
        onClick={!isEditing ? toggleEditing : undefined}
      >
        <AnnouncementImageWrapper>
          <AnnouncementImage src={AnnouncementIcon} />
        </AnnouncementImageWrapper>
        {!isEditing ? (
          <>
            <Flex
              direction="column"
              gap={isMobile ? '2px' : '4px'}
              style={{
                marginLeft: '16px',
              }}
            >
              <SText
                color="#333"
                fontSize={isMobile ? '10px' : '18px'}
                fontWeight={700}
              >
                Team announcement
              </SText>
              <SText
                color="#333"
                fontSize={isMobile ? '10px' : '14px'}
                fontWeight={isMobile ? 400 : 500}
                style={{
                  whiteSpace: 'normal',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {announcementToday ?? '공지가 등록되지 않았습니다.'}
              </SText>
            </Flex>
            <PostImage
              src={announcementTodayIcon}
              alt="announcement modify button"
            />
          </>
        ) : (
          <Flex
            direction="column"
            style={{
              marginLeft: '16px',
              marginTop: '4px',
            }}
          >
            <SText
              color="#333"
              fontSize={isMobile ? '10px' : '18px'}
              fontWeight={700}
            >
              Team announcement
            </SText>
            <Spacer h={isMobile ? 8 : 10} />
            <AnnouncementInputContainer>
              <AnnouncementInputField
                placeholder={'공지글 입력'}
                maxLength={50}
                value={announcement}
                onChange={(e) => setAnnouncement(e.target.value)}
              />
            </AnnouncementInputContainer>
            <AnnouncementInputHelperText>
              {announcement.length}/{50}자
            </AnnouncementInputHelperText>
            <Spacer h={12} />
            <Flex justify="center" gap={isMobile ? '4px' : '14px'}>
              <CancelButton onClick={handleCancel}>
                <SText fontFamily={'Pretendard'}>취소</SText>
              </CancelButton>

              <SaveButton onClick={handleSave}>
                <SText fontFamily={'Pretendard'}>저장하기</SText>
              </SaveButton>
            </Flex>
          </Flex>
        )}
      </Box>

      <SubjectControlButton id={id} selectedDate={selectedDate} />
    </Announcement>
  );
};

const CalendarSection = styled.section`
  grid-area: calendar;
  background-color: #f8f8ff;
  border-radius: 20px;
  padding: 20px 36px 40px 36px;
  margin-bottom: 100px;
  position: relative;
`;

let totalPageCache = 0;

// TODO: TeamDashboard랑 TeamAdmin 너무 똑같음 TeamAdmin이 TeamDashboard 가져오는 방향으로 수정필요
const TeamAdmin = () => {
  const width = useWindowWidth();
  const isMobile = width <= breakpoints.mobile;

  const { id } = useParams<{ id: string }>();

  const today = new Date().toLocaleDateString('en-CA', {
    timeZone: 'Asia/Seoul',
  });
  const [selectedDate, setSelectedDate] = useState<string>(today);
  const [year, month] = selectedDate.split('-').map(Number);

  const [page, setPage] = useState<number>(0);

  const onClickCalendarDate = (newDate: string) => {
    setSelectedDate(newDate);
    setPage(0);
  };

  const [currentView, setCurrentView] = useAtom(currentViewAtom);
  const [selectedArticleId, setSelectedArticleId] = useAtom(selectedPostIdAtom);

  const { tagsMap, myTeamResponse, isTeamManager, isPending } =
    useTeamInfoManager({
      teamId: id,
      year,
      month,
    });

  const { boundRef, buttonRef, onClickJump } = useScrollUpButtonPosition();

  const {
    data: articlesData,
    refetch,
    isSuccess: isPaginationReady,
  } = useQuery({
    queryKey: ['articles-by-date', id, selectedDate, page],
    queryFn: () => getArticlesByDate(Number(id), selectedDate, page),
    enabled: !!id && !!selectedDate,
  });
  // 가장 비용이 적은 캐싱
  if (isPaginationReady && articlesData) {
    totalPageCache = articlesData.page.totalPages;
  }

  const handleShowTopicDetail = () => {
    setCurrentView('topic');
    setSelectedArticleId(null);
  };

  const handleShowArticleDetail = (articleId: number) => {
    setSelectedArticleId(articleId);
    setCurrentView('article');
  };

  if (!id) {
    return <Navigate to={PATH.TEAMS} />;
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <Fragment>
      <Spacer h={isMobile ? 16 : 28} />
      <Grid>
        <Sidebar>
          {isMobile ? (
            <>
              <Box
                width="84px"
                height="84px"
                borderWidth="1px"
                padding="8px"
                borderRadius="10px"
              >
                <Suspense fallback={<div style={{ height: '84px' }} />}>
                  <ImageContainer
                    src={myTeamResponse?.imageUrl ?? ''}
                    altText={myTeamResponse?.teamName ?? ''}
                    w={70}
                    h={70}
                    maxW={70}
                  />
                </Suspense>
              </Box>
              <Box
                width="100%"
                padding="20px"
                height="84px"
                borderRadius="10px"
              >
                <Flex
                  justify="space-around"
                  align="center"
                  width={100}
                  height={36}
                >
                  <Flex
                    direction="column"
                    align="center"
                    style={{ width: '100px' }}
                  >
                    <SText color="#333" fontSize="10px" fontWeight={600}>
                      TEAM
                    </SText>
                    <Spacer h={2} />
                    <SText fontSize="16px" color="#333" fontWeight={700}>
                      관리페이지
                    </SText>
                  </Flex>
                  <Box
                    width="84px"
                    height="32px"
                    padding="10px 12px"
                    borderRadius="10px"
                    style={{ background: '#F0F1FF' }}
                  >
                    <Link
                      to={`${PATH.TEAM_DASHBOARD}/${id}`}
                      style={{ textDecoration: 'none' }}
                    >
                      <SText fontSize="10px" fontWeight={600} color="#666">
                        &larr; 팀 페이지로
                      </SText>
                    </Link>
                  </Box>
                </Flex>
              </Box>
            </>
          ) : (
            <>
              <Box width="100%" height="380px" padding="0px 40px">
                <Flex
                  direction="column"
                  align="center"
                  width={100}
                  height={280}
                >
                  <SText fontSize="12px" fontWeight={600}>
                    TEAM
                  </SText>
                  <Spacer h={2} />
                  <SText fontSize="24px" color="#333" fontWeight={700}>
                    관리페이지
                  </SText>
                  <Spacer h={52} />
                  <SText
                    color="#777"
                    fontSize="16px"
                    fontWeight={500}
                    lineHeight="24px"
                  >
                    오늘의 문제 작성, 공지 등록, 캘린더를 클릭해 해당 날짜의
                    게시글 및 태그를 수정, 변경할 수 있습니다.
                  </SText>
                  <Spacer h={32} />

                  <Box width="90%" height="50px" padding="0">
                    <Link
                      to={`${PATH.TEAM_DASHBOARD}/${id}`}
                      style={{ textDecoration: 'none' }}
                    >
                      <SText fontSize="14px" fontWeight={700} color="#333">
                        팀 페이지로 이동하기
                      </SText>
                    </Link>
                  </Box>
                </Flex>
              </Box>
            </>
          )}
        </Sidebar>

        <AnnouncementAndSubject
          announcementToday={myTeamResponse?.teamAnnouncement}
          id={id}
          selectedDate={selectedDate}
        />
        <CalendarSection>
          <CustomCalendar
            tags={tagsMap.get(id) ?? []}
            onDateSelect={onClickCalendarDate}
            selectedDate={selectedDate}
            isPending={isPending}
          />
          <Spacer h={24} isRef ref={boundRef} />
          <Posts
            data={articlesData}
            tags={tagsMap.get(id) ?? []}
            selectedDate={selectedDate}
            onShowTopicDetail={handleShowTopicDetail}
            onShowArticleDetail={handleShowArticleDetail}
          />
          <Pagination
            totalPages={articlesData?.page?.totalPages ?? totalPageCache}
            currentPageProp={page}
            onPageChange={handlePageChange}
            hideShadow={isMobile}
            marginTop="-70px"
          />
          <Spacer h={isMobile ? 30 : 40} />
          {currentView === 'topic' && (
            <TopicDetail
              teamId={Number(id)}
              selectedDate={selectedDate}
              isTeamManager={isTeamManager}
            />
          )}
          {currentView === 'article' && articlesData && selectedArticleId && (
            <ArticleDetail
              data={
                articlesData.content.find(
                  (article) => article.articleId === selectedArticleId
                ) as IArticle
              }
              refetchArticles={refetch}
              teamId={Number(id)}
              shouldBlur={false}
            />
          )}
          <ScrollUpButton onClick={onClickJump} ref={buttonRef} />
        </CalendarSection>
        <ScrollUpButton onClick={onClickJump} ref={buttonRef} />
      </Grid>
    </Fragment>
  );
};

const AnnouncementInputContainer = styled.div`
  display: flex;
  align-items: center;
  height: 60px;
  align-self: stretch;
  border-radius: 20px;
  border: 1px solid #cdcfff;
  box-sizing: border-box;

  @media (max-width: ${breakpoints.mobile}px) {
    height: 36px;
    border-radius: 10px;
  }
`;

const AnnouncementInputField = styled.input`
  flex: 1;
  border: none;
  outline: none;
  font-size: 16px;
  color: #333;
  padding-left: 12px;

  ::placeholder {
    color: #ccc;
  }

  @media (max-width: ${breakpoints.mobile}px) {
    font-size: 10px;
  }
`;

const AnnouncementInputHelperText = styled.span`
  font-size: 14px;
  font-weight: 400;
  color: #ccc;
  display: block;
  margin-top: 4px;
  text-align: right;

  @media (max-width: ${breakpoints.mobile}px) {
    font-size: 10px;
  }
`;

const ButtonBase = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 40px;
  border: none;
  cursor: pointer;
  text-align: center;
  line-height: 1.5;
  width: 90px;
  height: 30px;
  font-weight: 500;
  padding: 6px 20px;

  @media (max-width: ${breakpoints.mobile}px) {
    font-size: 8px;
    width: 43px;
    height: 15px;
    padding: 0;
  }
`;

export const CancelButton = styled(ButtonBase)`
  background: #d9d9d9;
  color: #000;
  font-size: 14px;
`;

export const SaveButton = styled(ButtonBase)`
  background: #6e74fa;
  color: white;
  font-size: 14px;
`;

export default TeamAdmin;
