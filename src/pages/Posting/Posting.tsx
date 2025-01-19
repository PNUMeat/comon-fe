import { viewStyle } from '@/utils/viewStyle';

import { useWindowWidth } from '@/hooks/useWindowWidth';

import { Flex } from '@/components/commons/Flex';
import { PageSectionHeader } from '@/components/commons/PageSectionHeader';
import { SText } from '@/components/commons/SText';
import { Spacer } from '@/components/commons/Spacer';
import { Title } from '@/components/commons/Title';
import PostEditor from '@/components/features/Post/PostEditor';
import { CommonLayout } from '@/components/layout/CommonLayout';

import { useEffect, useRef, useState } from 'react';
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';

import { getTeamTopic } from '@/api/dashboard';
import { createPost, mutatePost } from '@/api/postings';
import write from '@/assets/Posting/write.svg';
import click from '@/assets/TeamJoin/click.png';
import { breakpoints } from '@/constants/breakpoints';
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
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';

const GapFlex = styled.div<{
  gap?: number;
  padding?: string;
  cursor?: string;
  justifyContent?: string;
}>`
  display: flex;
  align-items: center;
  justify-content: ${(props) => props.justifyContent ?? 'start'};
  gap: ${(props) => props.gap ?? 0}px;
  ${(props) => (props.padding ? `padding: ${props.padding};` : '')}
  ${(props) => (props.cursor ? `cursor: ${props.cursor};` : '')}
  height: 57px;
  width: 100%;
`;

const PostSubjectViewWrap = styled.div<{
  height: number;
  show: boolean;
}>`
  display: grid;
  grid-template-columns: ${({ show }) => (show ? '1fr' : 'auto auto')};
  grid-template-rows: ${({ show }) => (show ? '1fr auto' : '1fr')};

  justify-content: space-between;

  width: 100%;
  min-height: 57px;
  height: ${(props) => props.height}px;
  border: 1px solid #f15ca7;
  border-radius: 10px;
  margin: 20px 0;
  padding: 0 40px;
  box-sizing: border-box;
  transition: height 0.5s ease;
  overflow: hidden;
`;

const minShowHeight = 114;

const waitForImageLoad = (img: HTMLImageElement) => {
  return new Promise<void>((resolve) => {
    if (img.complete) {
      resolve();
    } else {
      const handleDone = () => {
        img.removeEventListener('load', handleDone);
        img.removeEventListener('error', handleDone);
        resolve();
      };
      img.addEventListener('load', handleDone);
      img.addEventListener('error', handleDone);
    }
  });
};

const PostSubjectViewer: React.FC<{
  teamId: string;
}> = ({ teamId }) => {
  const [height, setHeight] = useState<number>(0);
  const [show, setShow] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const selectedDate = new Date().toLocaleDateString('en-CA', {
    timeZone: 'Asia/Seoul',
  });

  //TODO: 지금 team-topic은 돔노드 최하단에서, 조건부 렌더링 되는 곳에서 가져오는 중이라 이렇게 해야함, url로 치고 들어오면 해당 날짜꺼 가져옴
  const { data } = useQuery({
    queryKey: ['team-topic', teamId, selectedDate],
    queryFn: () => getTeamTopic(parseInt(teamId as string), selectedDate),
  });

  useEffect(() => {
    if (show && contentRef.current) {
      const content = contentRef.current;
      const images = content.querySelectorAll('img');
      if (images.length === 0) {
        setHeight(minShowHeight + content.clientHeight);
        return;
      }

      Promise.all(Array.from(images).map(waitForImageLoad))
        .then(() => {
          setHeight(minShowHeight + content.clientHeight);
        })
        .catch(() => {
          setHeight(minShowHeight + content.clientHeight);
        });
    }
  }, [show]);

  return (
    <PostSubjectViewWrap
      height={show ? Math.max(height, minShowHeight) : 57}
      show={show}
    >
      <GapFlex gap={20}>
        {data?.articleTitle ? (
          <SText
            color={'#ccc'}
            fontSize={'20px'}
            fontWeight={700}
            fontFamily={'Pretendard'}
          >
            주제
          </SText>
        ) : null}
        <SText
          color={data?.articleTitle ? '#333' : '#ccc'}
          fontSize={'20px'}
          fontWeight={700}
          fontFamily={'Pretendard'}
          whiteSpace={'normal'}
          wordBreak={'break-word'}
        >
          {data?.articleTitle ?? '주제가 등록되지 않았어요'}
        </SText>
      </GapFlex>
      {show && data ? (
        <TopicViewer
          ref={contentRef}
          dangerouslySetInnerHTML={{
            __html: data?.imageUrl
              ? data?.articleBody?.replace(/src="\?"/, `src="${data.imageUrl}"`)
              : data?.articleBody,
          }}
        />
      ) : null}
      <GapFlex
        gap={12}
        padding={'0 10px'}
        cursor={'pointer'}
        onClick={() => setShow((prev) => !prev)}
        justifyContent={'end'}
      >
        <SText
          color={'#777'}
          fontSize={'16px'}
          fontWeight={400}
          fontFamily={'Pretendard'}
        >
          {show ? '주제 접기' : '펼쳐서 확인하기'}
        </SText>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="17"
          height="10"
          viewBox="0 0 17 10"
          fill="none"
          style={{
            transform: show ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s ease',
          }}
        >
          <path d="M0 0 L8.5 10 L17 0" stroke="#CCCCCC" strokeWidth="1.5" />
        </svg>
      </GapFlex>
    </PostSubjectViewWrap>
  );
};

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
  const [postImages, setPostImages] = useAtom(postImagesAtom);
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
  useEffect(() => {
    document.documentElement.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant',
    });
  }, []);
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
      ? articleBodyTrim.replace(/(<img[^>]*src=")blob:[^"]*(")/g, '$1?$2')
      : articleBodyTrim;

    if (article && articleId && articleTitle) {
      mutatePost({
        teamId: parseInt(id),
        images: postImages,
        articleId: parseInt(articleId),
        articleBody: postImages ? articleBody : content,
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
              setPostImages([]);
              navigate(`/team-dashboard/${id}`);
              setAlert({ message: '게시글을 수정했어요', isVisible: true });
            })
            .catch(() => {
              setAlert({
                message: '최신 게시글 조회를 실패했습니다.',
                isVisible: true,
              });
              setIsPending(false);
            });
        })
        .catch(() => {
          setAlert({ message: '게시글 수정에 실패했어요', isVisible: true });
          setIsPending(false);
        });
      return;
    }

    if (!postTitle || !content) {
      alert('모든 필드를 채워주세요');
      setIsPending(false);
      return;
    }

    createPost({
      teamId: parseInt(id),
      images: postImages,
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
            setPostImages([]);
            navigate(`/team-dashboard/${id}`);
            setAlert({ message: '글쓰기를 완료했어요', isVisible: true });
          })
          .catch(() => {
            setAlert({
              message: '최신 게시글 조회에 실패했습니다.',
              isVisible: true,
            });
            setIsPending(false);
          });
      })
      .catch(() => {
        setAlert({ message: '글쓰기에 실패했어요', isVisible: true });
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
        <PostSubjectViewer teamId={id} />
        <PostEditor
          forwardContent={setContent}
          forwardTitle={setPostTitle}
          content={article}
          title={articleTitle}
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

//TODO: TopicDetail에서 가져옴
const TopicViewer = styled.div`
  line-height: 1.5;

  ${viewStyle}
`;

export default Posting;
