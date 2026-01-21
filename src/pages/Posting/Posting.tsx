import extractTextFromHtml from '@/utils/extractTextFromHtml';
import injectImageUrlsIntoHtml from '@/utils/injectImageUrlsIntoHtml';

import { useArticleFeedback } from '@/hooks/useArticleFeedback';
import { usePrompt } from '@/hooks/usePrompt';
import { useWindowWidth } from '@/hooks/useWindowWidth';

import { Flex } from '@/components/commons/Flex';
import { PageSectionHeader } from '@/components/commons/PageSectionHeader';
import { ProgressBar } from '@/components/commons/ProgressBar/ProgressBar';
import { SText } from '@/components/commons/SText';
import { Spacer } from '@/components/commons/Spacer';
import { Title } from '@/components/commons/Title';
import ArticleFeedbackPanel from '@/components/features/Feedback/ArticleFeedbackPanel';
import PostEditor from '@/components/features/Post/PostEditor';
import { CommonLayout } from '@/components/layout/CommonLayout';

import { useEffect, useState } from 'react';
import { RiErrorWarningFill } from 'react-icons/ri';
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';

import { ITopicResponse, getTeamTopic } from '@/api/dashboard.ts';
import { uploadImages } from '@/api/image';
import { createPost, mutatePost } from '@/api/postings';
import write from '@/assets/Posting/write.svg';
import click from '@/assets/TeamJoin/click.png';
import { breakpoints } from '@/constants/breakpoints';
import { colors } from '@/constants/colors';
import { PostSubjectViewer } from '@/pages/Posting/PostSubjectViewer.tsx';
import { PATH } from '@/routes/path';
import {
  currentViewAtom,
  pageAtom,
  selectedDateAtom,
  selectedPostIdAtom,
} from '@/store/dashboard';
import { alertAtom } from '@/store/modal';
import { postImagesAtom } from '@/store/posting';
import styled from '@emotion/styled';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';

const Posting = () => {
  const location = useLocation();
  const { article, articleId, articleTitle } = location?.state ?? {
    article: null,
    articleId: null,
    articleTitle: null,
  };
  const [content, setContent] = useState<string>(() => article ?? '');
  const [postTitle, setPostTitle] = useState(() => articleTitle ?? '');
  const [isPending, setIsPending] = useState(false);
  const [disablePrompt, setDisablePrompt] = useState(false);
  const [postImages, setPostImages] = useAtom(postImagesAtom);

  const [savedArticleId, setSavedArticleId] = useState<number | null>(() =>
    articleId ? Number(articleId) : null
  );

  const { feedback, error, isLoading, isStreaming, isComplete, startStream } =
    useArticleFeedback(savedArticleId);

  const canRequestFeedback =
    extractTextFromHtml(content).length > 0 && !isPending && !isStreaming;

  const setSelectedPostId = useSetAtom(selectedPostIdAtom);
  const setDashboardView = useSetAtom(currentViewAtom);
  const setAlert = useSetAtom(alertAtom);
  const selectedDate = useAtomValue(selectedDateAtom);
  const page = useAtomValue(pageAtom);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const width = useWindowWidth();
  const isMobile = width <= breakpoints.mobile;
  const buttonFontSize = isMobile ? '12px' : '16px';
  const { id } = useParams();
  const [progress, setProgress] = useState(0);

  usePrompt(!disablePrompt);

  useEffect(() => {
    document.documentElement.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant',
    });
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isStreaming) {
      setProgress(0);

      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 5;
        });
      }, 400);
    } else {
      setProgress((prev) => (prev > 0 && prev < 100 ? 100 : prev));
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isStreaming]);

  const { data } = useQuery<ITopicResponse>({
    queryKey: ['team-topic', id, selectedDate],
    queryFn: () => getTeamTopic(parseInt(id as string), selectedDate),
  });

  if (!id) {
    return <Navigate to={PATH.TEAMS} />;
  }

  const handleSaveArticle = async (
    isVisible: boolean = true
  ): Promise<number | undefined> => {
    if (isPending) return;

    if (!postTitle) {
      alert('제목을 작성해주세요');
      return;
    }
    if (!content) {
      alert('게시글 본문을 작성해주세요');
      return;
    }

    setIsPending(true);

    try {
      const articleBodyTrim = content.trim();

      const sortedImages =
        postImages.length > 0
          ? [...postImages].sort((a, b) => {
              if (a.line !== b.line) return a.line - b.line;
              return a.idx - b.idx;
            })
          : [];

      let uploadedUrls: string[] = [];
      if (sortedImages.length > 0) {
        const files = sortedImages.map((imgObj) => imgObj.img);
        try {
          uploadedUrls = await uploadImages({
            files,
            category: 'ARTICLE',
          });
        } catch (err: unknown) {
          const e = err as { response?: { data?: { message?: string } } };
          setAlert({
            message:
              e.response?.data?.message ?? '이미지 업로드에 실패했습니다.',
            isVisible: true,
            onConfirm: () => {},
          });
          return;
        }
      }

      const articleBody =
        postImages.length > 0
          ? injectImageUrlsIntoHtml(articleBodyTrim, uploadedUrls)
          : articleBodyTrim;

      let targetId = savedArticleId;

      if (targetId) {
        await mutatePost({
          teamId: parseInt(id as string),
          images:
            postImages.length > 0
              ? sortedImages.map((imgObj) => imgObj.img)
              : null,
          articleId: targetId,
          articleBody: articleBody,
          articleTitle: postTitle,
          isVisible: isVisible,
        });
      } else {
        const res = await createPost({
          teamId: parseInt(id as string),
          images:
            postImages.length > 0
              ? sortedImages.map((imgObj) => imgObj.img)
              : null,
          articleBody: articleBody,
          articleTitle: postTitle,
          isVisible: isVisible,
        });
        targetId = res.articleId;
      }

      await queryClient.refetchQueries({
        queryKey: ['articles-by-date', id, selectedDate, page],
      });

      setSavedArticleId(targetId);
      setContent(articleBody);
      setPostImages([]);

      return targetId;
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      if (e.response?.data?.message === '팀에 멤버가 존재하지않습니다.') {
        navigate(PATH.TEAMS);
        return;
      }
      setAlert({
        message: e.response?.data?.message ?? '글 저장에 실패했어요',
        isVisible: true,
        onConfirm: () => {},
      });
      return;
    } finally {
      setIsPending(false);
    }
  };

  const handleFillOutClick = async () => {
    const savedId = await handleSaveArticle();

    if (savedId) {
      setDashboardView('article');
      setSelectedPostId(savedId);
      setDisablePrompt(true);
      setAlert({
        message: savedArticleId ? '게시글을 수정했어요' : '글쓰기를 완료했어요',
        isVisible: true,
        onConfirm: () => {
          navigate(`${PATH.TEAM_DASHBOARD}/${id}`);
        },
      });
    }
  };

  const handleFeedbackClick = async () => {
    if (isStreaming) {
      setAlert({
        message: '이미 AI가 코드를 분석하는 중이에요.',
        isVisible: true,
        onConfirm: () => {},
      });
      return;
    }

    const savedId = await handleSaveArticle(false);

    if (savedId) {
      startStream(savedId);
    }
  };

  const padding = isMobile ? '0 10px' : '0 105px';
  const spacing = isMobile ? 8 : 39;

  return (
    <CommonLayout>
      <Flex direction={'column'} align={'center'} padding={padding}>
        <Spacer h={22} />
        <PageSectionHeader h={40}>
          <Title src={write} title="오늘의 글 등록하기" />
        </PageSectionHeader>
        <PostSubjectViewer data={data} />
        <PostEditor
          forwardContent={setContent}
          forwardTitle={setPostTitle}
          content={article}
          title={articleTitle}
        />
        <Spacer h={22} />
        <Flex
          direction={'column'}
          justify={'center'}
          align={'center'}
          gap={'16px'}
        >
          <ArticleBottomWrapper>
            <AiFeedbackWrapper>
              <AiFeedbackButtonWrapper>
                <SText fontSize="20px" fontWeight={700} whiteSpace="nowrap">
                  AI 코드 리뷰
                </SText>
                {(isLoading || isStreaming) && (
                  <Flex
                    direction="column"
                    align="center"
                    justify="center"
                    gap="8px"
                    style={{ flex: 1, maxWidth: '400px' }}
                  >
                    <SText fontSize="16px" color="#636363">
                      풀이를 분석하고 있어요
                    </SText>
                    <ProgressBar
                      progress={progress}
                      width="100%"
                      height="8px"
                    />
                    <SText fontSize="14px" color="#7D8E9F">
                      loading...
                    </SText>
                  </Flex>
                )}
                <AiFeedbackButton
                  disabled={!canRequestFeedback}
                  hasFeedback={!!feedback}
                  onClick={handleFeedbackClick}
                >
                  <SText
                    fontSize={buttonFontSize}
                    fontWeight={600}
                    whiteSpace="nowrap"
                  >
                    {feedback ? 'AI 피드백 재요청' : 'AI 피드백 요청'}
                  </SText>
                </AiFeedbackButton>
              </AiFeedbackButtonWrapper>
              {feedback && (
                <>
                  <Spacer h={spacing} />
                  <ArticleFeedbackPanel
                    feedback={feedback}
                    isComplete={isComplete}
                    isStreaming={isStreaming}
                  />
                </>
              )}
            </AiFeedbackWrapper>
            <AiGuideBox>
              {error ? <FeedbackErrorMessage /> : <FeedbackGuideMessage />}
            </AiGuideBox>
            <ConfirmButton disabled={isPending} onClick={handleFillOutClick}>
              <ClickImage src={click} />
              <ActionText>
                <SText fontSize={buttonFontSize} fontWeight={700}>
                  작성 완료
                </SText>
              </ActionText>
            </ConfirmButton>
          </ArticleBottomWrapper>
        </Flex>
      </Flex>
    </CommonLayout>
  );
};

const ErrorMessageWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  text-align: center;
  width: 100%;

  font-size: 16px;
  color: #ff5557;

  svg {
    color: #ff5557;
    flex-shrink: 0;
  }
`;

const FeedbackGuideMessage = () => (
  <SText fontSize="16px" textAlign="center" style={{ width: '100%' }}>
    <SText as="span" color="#6E74FA" fontWeight={700}>
      새로운 기능:
    </SText>{' '}
    이제 작성한 글과 코드에 대해 AI가 피드백을 남겨드려요. 버튼을 클릭하고
    조금만 기다려 주세요.
  </SText>
);

const FeedbackErrorMessage = () => (
  <ErrorMessageWrapper>
    <RiErrorWarningFill size={18} />
    <SText as="span" fontSize="16px" fontWeight={700}>
      피드백 작성 실패:
    </SText>
    <span>다시 시도해 주세요. 문제가 계속되면 코몬 운영진에게 알려주세요.</span>
  </ErrorMessageWrapper>
);

const ArticleBottomWrapper = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  flex-direction: column;
  gap: 16px;
`;

const ConfirmButton = styled.button<{ disabled?: boolean }>`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background: ${(props) => (props.disabled ? '#919191' : '#fff')};
  color: #000;
  box-shadow: 5px 7px 11.6px 0px #3f3f4d12;
  box-sizing: border-box;
  width: 532px;
  height: 80px;
  padding: 18px 0;
  border: 3px solid ${colors.borderPurple};
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};

  @media (max-width: ${breakpoints.mobile}px) {
    width: 312px;
    height: 50px;
    border: 2px solid ${colors.borderPurple};
  }
`;

const ClickImage = styled.img`
  width: 24px;
  height: 24px;
`;

const ActionText = styled.div`
  margin-left: 8px;
`;

const AiFeedbackWrapper = styled.div`
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  border: 1px solid #cdcfff;
  padding: 20px 30px;
  align-items: center;
  justify-content: center;
`;

const AiFeedbackButtonWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
`;

const AiFeedbackButton = styled.button<{
  disabled?: boolean;
  hasFeedback: boolean;
}>`
  width: 150px;
  height: 50px;
  border-radius: 10px;
  border: none;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  box-shadow: 5px 7px 11.6px 0px #3f3f4d12;

  background: ${({ disabled, hasFeedback }) =>
    disabled ? '#B8B8C5' : hasFeedback ? '#F15CA7' : '#6E74FA'};

  color: #ffffff;

  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: ${breakpoints.mobile}px) {
    width: 120px;
    height: 45px;
  }
`;

const AiGuideBox = styled.div`
  width: 100%;
  min-height: 80px;
  display: flex;
  line-height: 1.5em;
  align-items: center;
  padding: 10px 30px;
  border-radius: 10px;
  background: rgba(127, 92, 255, 0.06);
  box-sizing: border-box;
  transition: all 0.3s ease-in-out;

  @media (max-width: ${breakpoints.mobile}px) {
    width: 100%;
  }
`;

export default Posting;
