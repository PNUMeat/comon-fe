import { usePrompt } from '@/hooks/usePrompt';
import { useWindowWidth } from '@/hooks/useWindowWidth';

import { Flex } from '@/components/commons/Flex';
import { PageSectionHeader } from '@/components/commons/PageSectionHeader';
import { SText } from '@/components/commons/SText';
import { Spacer } from '@/components/commons/Spacer';
import { Title } from '@/components/commons/Title';
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
import styled from '@emotion/styled';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAtomValue, useSetAtom } from 'jotai';

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

  const onClick = () => {
    if (isPending) {
      return;
    }
    setIsPending(true);

    const articleBody = content.trim();

    if (article && articleId && articleTitle) {
      mutatePost({
        teamId: parseInt(id),
        articleId: parseInt(articleId),
        articleBody: articleBody,
        articleTitle: postTitle,
      })
        .then(() => {
          queryClient
            .refetchQueries({
              queryKey: ['articles-by-date', id, selectedDate, page],
            })
            .then(() => {
              setDashboardView('article');
              setSelectedPostId(articleId);
              setDisablePrompt(true);
              setAlert({
                message: '게시글을 수정했어요',
                isVisible: true,
                onConfirm: () => {
                  navigate(`${PATH.TEAM_DASHBOARD}/${id}`);
                },
              });
            })
            .catch((err) => {
              setAlert({
                message:
                  err.response.data.message ??
                  '최신 게시글 조회를 실패했습니다.',
                isVisible: true,
                onConfirm: () => {},
              });
              setIsPending(false);
            });
        })
        .catch((err) => {
          setAlert({
            message: err.response.data.message ?? '게시글 수정에 실패했어요',
            isVisible: true,
            onConfirm: () => {},
          });
          setIsPending(false);
        });
      return;
    }

    if (!postTitle) {
      alert('제목을 작성해주세요');
      setIsPending(false);
      return;
    }

    if (!content) {
      alert('게시글 본문을 작성해주세요');
      setIsPending(false);
      return;
    }

    createPost({
      teamId: parseInt(id),
      articleBody: articleBody,
      articleTitle: postTitle,
    })
      .then((data) => {
        const articleId = data.articleId;
        queryClient
          .refetchQueries({
            queryKey: ['articles-by-date', id, selectedDate, page],
          })
          .then(() => {
            setDashboardView('article');
            setSelectedPostId(articleId);
            setDisablePrompt(true);
            setAlert({
              message: '글쓰기를 완료했어요',
              isVisible: true,
              onConfirm: () => {
                navigate(`${PATH.TEAM_DASHBOARD}/${id}`);
              },
            });
          })
          .catch((err) => {
            setAlert({
              message:
                err?.response?.data?.message ??
                '최신 게시글 조회에 실패했습니다.',
              isVisible: true,
              onConfirm: () => {},
            });
            setIsPending(false);
          });
      })
      .catch((err) => {
        // 작성중 강퇴시
        if (err?.response?.data?.message === '팀에 멤버가 존재하지않습니다.') {
          navigate(PATH.TEAMS);
          return;
        }
        setAlert({
          message: err?.response?.data?.message ?? '글쓰기에 실패했어요',
          isVisible: true,
          onConfirm: () => {},
        });
        setIsPending(false);
      });
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
          imageCategory={'ARTICLE'}
        />
        <Spacer h={spacing} />
        <ConfirmButtonWrap
          disabled={isPending}
          isPending={isPending}
          onClick={onClick}
        >
          <ClickImage src={click} />
          <ActionText>
            <SText fontSize={buttonFontSize} fontWeight={700}>
              작성 완료
            </SText>
          </ActionText>
        </ConfirmButtonWrap>
      </Flex>
      <Spacer h={200} />
    </CommonLayout>
  );
};

const ConfirmButtonWrap = styled.button<{ isPending: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  background: ${(props) => (props.isPending ? '#919191' : '#fff')};
  color: #000;
  box-shadow: 5px 7px 11.6px 0px #3f3f4d12;
  box-sizing: border-box;
  width: 712px;
  height: 80px;
  padding: 0;
  border: 3px solid ${colors.borderPurple};
  cursor: pointer;

  @media (max-width: ${breakpoints.mobile}px) {
    width: 312px;
    border-radius: 40px;
    height: 50px;
    border: 2px solid ${colors.borderPurple};
  }
`;

// TODO: TeamJoin에서 가져옴
const ClickImage = styled.img`
  width: 24px;
  height: 24px;
`;
// TODO: TeamJoin에서 가져옴
const ActionText = styled.div`
  margin-left: 8px;
`;

export default Posting;
