import { useJumpOnClick } from '@/hooks/useJumpOnClick';
import { useWindowWidth } from '@/hooks/useWindowWidth';

import { Box } from '@/components/commons/Box';
import { CustomCalendar } from '@/components/commons/Calendar/Calendar';
import { Flex } from '@/components/commons/Flex';
import { InputContainer } from '@/components/commons/Form/segments/InputContainer';
import { InputField } from '@/components/commons/Form/segments/InputField';
import { InputHelperText } from '@/components/commons/Form/segments/InputHelperText';
import { LazyImage } from '@/components/commons/LazyImage';
import { Pagination } from '@/components/commons/Pagination';
import { SText } from '@/components/commons/SText';
import { Spacer } from '@/components/commons/Spacer';
import { Wrap } from '@/components/commons/Wrap';
import { ArticleDetail } from '@/components/features/TeamDashboard/ArticleDetail';
import { Posts } from '@/components/features/TeamDashboard/Posts';
import { ScrollUpButton } from '@/components/features/TeamDashboard/ScrollUpButton';
import { TopicDetail } from '@/components/features/TeamDashboard/TopicDetail';
import { HeightInNumber } from '@/components/types';

import {
  Fragment,
  Suspense,
  forwardRef,
  useEffect,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';

import { updateAnnouncement } from '@/api/announcement';
import {
  IArticle,
  ICalendarTag,
  getArticlesByDate,
  getTeamInfoAndTags,
  getTeamTopic,
} from '@/api/dashboard';
import announcementTodayIcon from '@/assets/TeamAdmin/announcementToday.svg';
import AnnouncementIcon from '@/assets/TeamDashboard/announcement_purple.png';
import PencilIcon from '@/assets/TeamDashboard/pencil.png';
import { breakpoints } from '@/constants/breakpoints';
import { colors } from '@/constants/colors';
import { PATH } from '@/routes/path';
import { currentViewAtom, selectedPostIdAtom } from '@/store/dashboard';
import styled from '@emotion/styled';
import { useQuery } from '@tanstack/react-query';
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

const leftPadding = '32px';

const PostImage = styled.img`
  width: 24px;
  height: 24px;
  margin-right: 8px;

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
            articleBody: data?.articleBody,
            articleId: data?.articleId,
            articleTitle: data?.articleTitle,
            articleCategory: data?.articleCategory,
            articleImageUrl: data?.imageUrl,
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
        {!isSuccess ? '요청 대기' : data?.articleId ? '주제 수정' : '주제 작성'}
      </SText>
    </SubjectControlButtonWrap>
  );
};

const AnnouncementAndSubject = forwardRef<
  HTMLDivElement,
  {
    onClick: () => void;
    announcementToday: string;
    id: string;
    selectedDate: string;
  }
>(({ announcementToday, onClick, id, selectedDate }, ref) => {
  const width = useWindowWidth();
  const isMobile = width <= breakpoints.mobile;

  const handleClick = () => {
    onClick();
    toggleExpand();
  };

  const [isExpanded, setIsExpanded] = useState(false);
  const toggleExpand = () => setIsExpanded((prev) => !prev);

  return (
    <Announcement>
      <Box
        width={isMobile ? '204px' : '470px'}
        height={isExpanded ? 'auto' : isMobile ? 'auto' : '70px'}
        padding={isMobile ? '6px 14px' : '12px 28px'}
        borderRadius={isMobile ? '4px' : '20px'}
        borderWidth={isMobile ? '0px' : '1px'}
        style={{
          overflow: 'hidden',
          cursor: 'pointer',
          textOverflow: isExpanded ? 'unset' : 'ellipsis',
          whiteSpace: isExpanded ? 'normal' : 'nowrap',
          position: 'relative',
        }}
        ref={ref}
      >
        <AnnouncementImageWrapper>
          <AnnouncementImage src={AnnouncementIcon} />
        </AnnouncementImageWrapper>
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
              whiteSpace: isExpanded ? 'normal' : 'nowrap',
              overflow: 'hidden',
              textOverflow: isExpanded ? 'unset' : 'ellipsis',
            }}
          >
            {announcementToday
              ? announcementToday
              : '공지가 등록되지 않았습니다.'}
          </SText>
        </Flex>
        <PostImage
          src={announcementTodayIcon}
          alt="announcement modify button"
          onClick={handleClick} // TODO:
          style={{ cursor: 'pointer' }}
        />
      </Box>

      <SubjectControlButton id={id} selectedDate={selectedDate} />
    </Announcement>
  );
});
AnnouncementAndSubject.displayName = 'AnnouncementAndSubject';

const CalendarSection = styled.section`
  grid-area: calendar;
  background-color: #f8f8ff;
  border-radius: 20px;
  padding: 20px 36px 40px 36px;
  margin-bottom: 100px;
  position: relative;
`;

// TODO: TeamDashboard랑 TeamAdmin 너무 똑같음 TeamAdmin이 TeamDashboard 가져오는 방향으로 수정필요
export const TeamAdmin = () => {
  const width = useWindowWidth();
  const isMobile = width <= breakpoints.mobile;

  const announcementRef = useRef<HTMLDivElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const [show, setShow] = useState<boolean>(false);

  const { id } = useParams<{ id: string }>();

  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>(today);
  const [year, month] = selectedDate.split('-').map(Number);

  const [page, setPage] = useState<number>(0);

  const onClickCalendarDate = (newDate: string) => {
    setSelectedDate(newDate);
    setPage(0);
  };

  const [currentView, setCurrentView] = useAtom(currentViewAtom);
  const [selectedArticleId, setSelectedArticleId] = useAtom(selectedPostIdAtom);
  //TODO: useCalendarTag
  const [tags, setTags] = useState<ICalendarTag[]>([]);

  const { boundRef, buttonRef, onClickJump } = useJumpOnClick();

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

  const {
    data: teamInfoData,
    isSuccess,
  } = useQuery({
    queryKey: ['team-info', id, year, month],
    queryFn: () => getTeamInfoAndTags(Number(id), year, month),
    enabled: !!id,
  });

  useEffect(() => {
    if (isSuccess && teamInfoData) {
      addTags(teamInfoData.subjectArticleDateAndTagResponses);
    }
  }, [isSuccess]);

  const { data: articlesData, refetch } = useQuery({
    queryKey: ['articles-by-date', id, selectedDate, page],
    queryFn: () => getArticlesByDate(Number(id), selectedDate, page),
    enabled: !!id && !!selectedDate,
  });

  const handleShowTopicDetail = () => {
    setCurrentView('topic');
    setSelectedArticleId(null);
  };

  const handleShowArticleDetail = (articleId: number) => {
    setSelectedArticleId(articleId);
    setCurrentView('article');
  };

  useEffect(() => {
    if (
      announcementRef &&
      'current' in announcementRef &&
      announcementRef.current
    ) {
      const modal = modalRef.current;
      if (!modal) {
        return;
      }
      if (show) {
        const moveModal = () => {
          const announcement = announcementRef.current;
          const { top, left, width } =
            announcement?.getBoundingClientRect() ?? {
              top: 0,
              left: 0,
              width: 0,
            };
          modal.style.top = `${top}px`;
          modal.style.left = `${left}px`;
          modal.style.width = `${width}px`;
        };
        const handleOutsideClick = (e: MouseEvent) => {
          if (modalRef?.current?.contains(e.target as Node)) {
            return;
          }
          setShow(false);
        };
        moveModal();
        document.addEventListener('mousedown', handleOutsideClick);
        document.addEventListener('scroll', moveModal);

        return () => {
          document.removeEventListener('mousedown', handleOutsideClick);
          document.removeEventListener('scroll', moveModal);
        };
      }
      modal.style.top = `99999px`;
    }
  }, [show]);

  const announcementToday = teamInfoData?.myTeamResponse.teamAnnouncement || '';
  const isTeamManager = teamInfoData?.teamManager ?? false;

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
                    src={teamInfoData?.myTeamResponse.imageUrl || ''}
                    altText={teamInfoData?.myTeamResponse.teamName || ''}
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
                    오늘의 주제 작성, 공지 등록, 캘린더를 클릭해 해당 날짜의
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
          announcementToday={announcementToday}
          onClick={() => setShow(true)}
          ref={announcementRef}
          id={id}
          selectedDate={selectedDate}
        />
        <CalendarSection>
          <CustomCalendar
            tags={tags}
            onDateSelect={onClickCalendarDate}
            selectedDate={selectedDate}
          />
          <Spacer h={24} isRef ref={boundRef} />
          <Posts
            data={articlesData}
            tags={tags}
            selectedDate={selectedDate}
            onShowTopicDetail={handleShowTopicDetail}
            onShowArticleDetail={handleShowArticleDetail}
          />
          <Pagination
            totalPages={articlesData?.page?.totalPages ?? 0}
            currentPageProp={page}
            onPageChange={handlePageChange}
          />
          <Spacer h={40} />
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
            />
          )}
          <ScrollUpButton onClick={onClickJump} ref={buttonRef} />
        </CalendarSection>
        <ScrollUpButton onClick={onClickJump} ref={buttonRef} />
      </Grid>
      <Spacer h={200} />
      {createPortal(
        <PromptModal
          ref={modalRef}
          teamId={Number(id)}
          onClose={() => setShow(false)}
          initialAnnouncement={
            teamInfoData?.myTeamResponse.teamAnnouncement || ''
          }
        />,
        document.body
      )}
    </Fragment>
  );
};

const ModalWrap = styled.div<HeightInNumber>`
  height: ${(props) => (props.h ? `${props.h}px` : '0')};
  position: fixed;
  background: #fff;
  color: #000;
  box-shadow: 5px 7px 11.6px 0px #3f3f4d12;
  box-sizing: border-box;
  padding: 16px;
  border: 1px solid ${colors.borderPurple};
  border-radius: 20px;
  align-items: center;
`;

const PromptModal = forwardRef<
  HTMLDivElement,
  { teamId: number; onClose: () => void; initialAnnouncement: string }
>(({ teamId, onClose, initialAnnouncement }, ref) => {
  const [announcement, setAnnouncement] = useState<string>(
    initialAnnouncement || ''
  );

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAnnouncement(e.target.value);
  };

  return (
    <ModalWrap h={222} ref={ref}>
      <div style={{ padding: `0 24px 0 ${leftPadding}` }}>
        <AnnouncementImage src={AnnouncementIcon} />
        <SText color="#333" fontSize="18px" fontWeight={700}>
          Team announcement
        </SText>
      </div>
      <Spacer h={25} />
      <Wrap>
        <InputContainer>
          <InputField
            placeholder={'공지글 입력'}
            maxLength={50}
            value={announcement}
            onChange={onChange}
          />
        </InputContainer>
        <InputHelperText>
          {announcement.length}/{50}자
        </InputHelperText>
      </Wrap>
      <Spacer h={44} />
      <div
        style={{
          display: 'flex',
          gap: '14px',
          width: '100%',
          justifyContent: 'center',
        }}
      >
        <CancelButton onClick={onClose}>취소</CancelButton>
        <SaveButton
          onClick={() => {
            updateAnnouncement(teamId, announcement).then(() => {
              window.location.reload();
            });
          }}
        >
          저장하기
        </SaveButton>
      </div>
    </ModalWrap>
  );
});

PromptModal.displayName = 'PromptModal';

const ButtonBase = styled.button`
  display: flex;
  height: 31px;
  padding: 9px 41px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 40px;
  border: none;
  cursor: pointer;
  font-size: 13px;
  font-weight: bold;
  text-align: center;
  line-height: 1.5;
`;

export const CancelButton = styled(ButtonBase)`
  background: #d9d9d9;
  color: black;
`;

export const SaveButton = styled(ButtonBase)`
  padding: 9px 34px;
  background: #6e74fa;
  color: white;
`;
