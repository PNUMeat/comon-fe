import injectImageUrlsIntoHtml from '@/utils/injectImageUrlsIntoHtml';

import { useArticleFeedbackStream } from '@/hooks/useArticleFeedbackStream';
import { usePrompt } from '@/hooks/usePrompt';
import { useWindowWidth } from '@/hooks/useWindowWidth';

import { Flex } from '@/components/commons/Flex';
import { PageSectionHeader } from '@/components/commons/PageSectionHeader';
import { SText } from '@/components/commons/SText';
import { Spacer } from '@/components/commons/Spacer';
import { Title } from '@/components/commons/Title';
import ArticleFeedbackPanel from '@/components/features/Feedback/ArticleFeedbackPanel';
import PostEditor from '@/components/features/Post/PostEditor';
import { CommonLayout } from '@/components/layout/CommonLayout';

import { useEffect, useState } from 'react';
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

  const {
    feedback,
    status: feedbackStatus,
    isStreaming: isFeedbackStreaming,
    start: startFeedbackStream,
  } = useArticleFeedbackStream(savedArticleId);

  const setSelectedPostId = useSetAtom(selectedPostIdAtom);
  const setDashboardView = useSetAtom(currentViewAtom);
  const setAlert = useSetAtom(alertAtom);
  const selectedDate = useAtomValue(selectedDateAtom);
  const page = useAtomValue(pageAtom);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const width = useWindowWidth();
  const isMobile = width <= breakpoints.mobile;
  const buttonFontSize = isMobile ? '16px' : '20px';
  const { id } = useParams();

  usePrompt(!disablePrompt);

  useEffect(() => {
    document.documentElement.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant',
    });
  }, []);

  const { data } = useQuery<ITopicResponse>({
    queryKey: ['team-topic', id, selectedDate],
    queryFn: () => getTeamTopic(parseInt(id as string), selectedDate),
  });

  if (!id) {
    return <Navigate to={PATH.TEAMS} />;
  }

  const handleSaveArticle = async (): Promise<number | undefined> => {
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
    if (feedbackStatus === 'streaming') {
      setAlert({
        message: '이미 GPT가 코드를 분석하는 중이에요.',
        isVisible: true,
        onConfirm: () => {},
      });
      return;
    }

    const savedId = await handleSaveArticle();

    if (savedId) {
      startFeedbackStream(savedId);
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

        {(feedback || isFeedbackStreaming) && (
          <>
            <Spacer h={spacing} />
            <ArticleFeedbackPanel
              feedback={feedback}
              isStreaming={isFeedbackStreaming}
            />
            <Spacer h={spacing} />
          </>
        )}

        <Spacer h={spacing} />
        <Flex
          direction={'row'}
          justify={'center'}
          align={'flex-start'}
          gap={'16px'}
        >
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <GptFeedbackButton
              disabled={isPending || isFeedbackStreaming}
              isPending={isPending || isFeedbackStreaming}
              hasFeedback={!!feedback}
              onClick={handleFeedbackClick}
            >
              <SText fontSize={buttonFontSize} fontWeight={700}>
                {feedback ? 'GPT 피드백 재요청' : 'GPT 피드백 요청'}
              </SText>
            </GptFeedbackButton>
            <Spacer h={8} />
            <GptGuideBox>
              <SText fontSize="16px">
                <SText as="span" color="#6E74FA" fontWeight={700}>
                  새로운 기능:
                </SText>{' '}
                이제 작성한 글과 코드에 대해 GPT가 피드백을 남겨드려요.
                <br />
                버튼을 클릭하고 조금만 기다려 주세요.
              </SText>
            </GptGuideBox>
          </div>
          <ConfirmButtonWrap
            disabled={isPending}
            isPending={isPending}
            onClick={handleFillOutClick}
          >
            <ClickImage src={click} />
            <ActionText>
              <SText fontSize={buttonFontSize} fontWeight={700}>
                작성 완료
              </SText>
            </ActionText>
          </ConfirmButtonWrap>
        </Flex>
      </Flex>
    </CommonLayout>
  );
};

const ConfirmButtonWrap = styled.button<{ isPending: boolean }>`
  flex: 1;
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background: ${(props) => (props.isPending ? '#919191' : '#fff')};
  color: #000;
  box-shadow: 5px 7px 11.6px 0px #3f3f4d12;
  box-sizing: border-box;
  width: 712px;
  height: 80px;
  padding: 0;
  border: 3px solid ${colors.borderPurple};
  cursor: ${(props) => (props.isPending ? 'not-allowed' : 'pointer')};

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

const GptFeedbackButton = styled.button<{
  isPending: boolean;
  hasFeedback: boolean;
}>`
  width: 100%;
  height: 80px;
  border-radius: 10px;
  border: none;
  cursor: ${(props) => (props.isPending ? 'not-allowed' : 'pointer')};
  box-shadow: 5px 7px 11.6px 0px #3f3f4d12;

  background: ${({ isPending, hasFeedback }) =>
    isPending ? '#B8B8C5' : hasFeedback ? '#F15CA7' : '#6E74FA'};

  color: #ffffff;

  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: ${breakpoints.mobile}px) {
    height: 50px;
  }
`;

const GptGuideBox = styled.div`
  width: 100%;
  min-height: 80px;
  display: flex;
  line-height: 1.5em;
  align-items: center;
  margin-top: 4px;
  padding: 10px 30px;
  border-radius: 10px;
  background: rgba(127, 92, 255, 0.06);
  box-sizing: border-box;

  @media (max-width: ${breakpoints.mobile}px) {
    width: 100%;
  }
`;

export default Posting;
