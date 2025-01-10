import { Flex } from '@/components/commons/Flex';
import { LazyImage } from '@/components/commons/LazyImage';
import { PageSectionHeader } from '@/components/commons/PageSectionHeader';
import { SText } from '@/components/commons/SText';
import { Spacer } from '@/components/commons/Spacer';
import { Title } from '@/components/commons/Title';
import PostEditor from '@/components/features/Post/PostEditor';
import { CommonLayout } from '@/components/layout/CommonLayout';

import { Suspense, useState } from 'react';
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';

import { createPost, mutatePost } from '@/api/postings';
import commonToday from '@/assets/Posting/comonToday.png';
import write from '@/assets/Posting/write.svg';
import click from '@/assets/TeamJoin/click.png';
import { colors } from '@/constants/colors';
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
import { useQueryClient } from '@tanstack/react-query';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';

export const Posting = () => {
  const location = useLocation();
  const { article, articleId, articleTitle } = location?.state ?? {
    article: null,
    articleId: null,
    articleTitle: null,
  };
  const [content, setContent] = useState<string>(() => article ?? '');
  const [postTitle, setPostTitle] = useState(() => articleTitle ?? '');
  const [isPending, setIsPending] = useState(false);
  const [postImages, setPostImages] = useAtom(postImagesAtom);
  const setSelectedPostId = useSetAtom(selectedPostIdAtom);
  const setDashboardView = useSetAtom(currentViewAtom);
  const setAlert = useSetAtom(alertAtom);
  const selectedDate = useAtomValue(selectedDateAtom);
  const page = useAtomValue(pageAtom);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id } = useParams();
  if (!id) {
    return <Navigate to={PATH.TEAMS} />;
  }

  const onClick = () => {
    if (isPending) {
      return;
    }
    setIsPending(true);

    const articleBodyTrim = content.trim();
    const articleBody = postImages
      ? articleBodyTrim.replace(/(<img[^>]*src=")[^"]*(")/g, '$1?$2')
      : articleBodyTrim;

    if (article && articleId && articleTitle) {
      mutatePost({
        teamId: parseInt(id),
        image: (postImages && postImages[0]) ?? null,
        articleId: parseInt(articleId),
        articleBody: postImages ? articleBody : content,
        articleTitle: postTitle,
      })
        .then(() => {
          queryClient
            .invalidateQueries({
              queryKey: ['articles-by-date', id, selectedDate, page],
            })
            .then(() => {
              setDashboardView('article');
              setSelectedPostId(articleId);
              setPostImages([]);
              navigate(`/team-dashboard/${id}`);
              setAlert({ message: '게시글을 수정했어요', isVisible: true });
            })
            .catch(() =>
              setAlert({
                message: '최신 게시글 조회를 실패했습니다.',
                isVisible: true,
              })
            );
        })
        .catch(() => {
          setAlert({ message: '게시글 수정에 실패했어요', isVisible: true });
          setIsPending(false);
        });
      return;
    }
    createPost({
      teamId: parseInt(id),
      image: (postImages && postImages[0]) ?? null,
      articleBody: articleBody,
      articleTitle: postTitle,
    })
      .then((data) => {
        const articleId = data.articleId;
        queryClient
          .invalidateQueries({
            queryKey: ['articles-by-date', id, selectedDate, page],
          })
          .then(() => {
            setDashboardView('article');
            setSelectedPostId(articleId);
            setPostImages([]);
            navigate(`/team-dashboard/${id}`);
            setAlert({ message: '글쓰기를 완료했어요', isVisible: true });
          })
          .catch(() =>
            setAlert({
              message: '최신 게시글 조회에 실패했습니다.',
              isVisible: true,
            })
          );
      })
      .catch(() => {
        setAlert({ message: '글쓰기에 실패했어요', isVisible: true });
        setIsPending(false);
      });
  };

  return (
    <CommonLayout>
      <Flex direction={'column'} align={'center'} padding={'0 105px'}>
        <Suspense fallback={null}>
          <LazyImage
            altText={'comon today'}
            w={634}
            maxW={635}
            h={188}
            src={commonToday}
          />
        </Suspense>
        <Spacer h={22} />
        <PageSectionHeader h={40}>
          <Title src={write} title="오늘의 글 등록하기" />
        </PageSectionHeader>
        <Spacer h={39} />
        <PostEditor
          forwardContent={setContent}
          forwardTitle={setPostTitle}
          content={article}
          title={articleTitle}
        />
        <Spacer h={38} />
        <ConfirmButtonWrap
          disabled={isPending}
          isPending={isPending}
          onClick={onClick}
        >
          <ClickImage src={click} />
          <ActionText>
            <SText fontSize="20px" fontWeight={700}>
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
