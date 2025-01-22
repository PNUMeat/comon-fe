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

// import { ITopicResponse } from '@/api/dashboard.ts';
import { createSubject, mutateSubject } from '@/api/subject';
import write from '@/assets/Posting/write.svg';
import click from '@/assets/TeamJoin/click.png';
import { breakpoints } from '@/constants/breakpoints';
import { colors } from '@/constants/colors';
import { PATH } from '@/routes/path';
import { currentViewAtom, selectedPostIdAtom } from '@/store/dashboard';
import { postImagesAtom } from '@/store/posting';
import styled from '@emotion/styled';
import { useQueryClient } from '@tanstack/react-query';
import { useAtom, useSetAtom } from 'jotai';
import { usePrompt } from '@/hooks/usePrompt';

export const TeamDailySubject = () => {
  const location = useLocation();
  const {
    articleId,
    articleCategory,
    articleBody,
    articleTitle,
    articleImageUrl,
    // refetch,
  } = location?.state ?? {
    articleId: null,
    articleCategory: null,
    articleBody: null,
    articleTitle: null,
    articleImageUrl: null,
    // refetch: null,
  };

  const regroupedArticleContent =
    (articleImageUrl
      ? articleBody.replace('src="?"', `src="${articleImageUrl}"`)
      : articleBody) ?? '';
  const [content, setContent] = useState<string>(() => regroupedArticleContent);
  const [subjectTitle, setSubjectTitle] = useState(() => articleTitle ?? '');
  const [tag, setTag] = useState<string>(() => articleCategory ?? '');
  const [isPending, setIsPending] = useState(false);
  const [subjectImages, setSubjectImages] = useAtom(postImagesAtom);
  const setSelectedPostId = useSetAtom(selectedPostIdAtom);
  const setDashboardView = useSetAtom(currentViewAtom);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const width = useWindowWidth();
  const isMobile = width <= breakpoints.mobile;
  const buttonFontSize = isMobile ? '16px' : '20px';
  const padding = isMobile ? '0 12px' : '0 105px';
  const spacing = isMobile ? 8 : 39;
  const { id, selectedDate } = useParams();

  usePrompt(true);
  
  useEffect(() => {
    document.documentElement.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant',
    });
  }, []);
  if (!id || !selectedDate) {
    return <Navigate to={PATH.TEAMS} />;
  }

  const [year, month] = selectedDate.split('-').map(Number);

  const onClick = () => {
    if (isPending) {
      return;
    }

    const replacedArticleBody = subjectImages
      ? content.trim().replace(/(<img[^>]*src=")blob:[^"]*(")/g, '$1?$2')
      : content.trim();

    if (articleId && tag && articleBody && subjectTitle) {
      setIsPending(true);
      mutateSubject({
        teamId: parseInt(id),
        articleId: parseInt(articleId),
        articleTitle: subjectTitle,
        articleBody: replacedArticleBody,
        image: subjectImages ? subjectImages[0] : null,
        articleCategory: tag,
      })
        .then(() => {
          queryClient
            .refetchQueries({
              queryKey: ['team-info', id, year, month],
            })
            .then(() => {
              alert('주제 수정이 완료되었습니다.');
              navigate(`/team-admin/${id}`);
            })
            .catch(() => alert('팀 정보의 최신 상태 업데이트를 실패했습니다'))
            .finally(() => {
              setDashboardView('topic');
              setSelectedPostId(parseInt(articleId));
            });
        })
        .catch((err) => {
          alert('주제 수정에 실패했습니다.');
          console.error(err);
          setIsPending(false);
        });
      return;
    }

    if (!subjectTitle || !content || !tag) {
      alert('모든 필드를 채워주세요');
      return;
    }

    setIsPending(true);
    createSubject({
      teamId: parseInt(id),
      articleTitle: subjectTitle,
      selectedDate: selectedDate,
      articleBody: replacedArticleBody,
      image: subjectImages ? subjectImages[0] : null,
      articleCategory: tag,
    })
      .then((data) => {
        queryClient
          .refetchQueries({
            queryKey: ['team-info', id, year, month],
          })
          .then(() => {
            const articleId = data.articleId;
            setDashboardView('topic');
            setSelectedPostId(articleId);
            alert(data.message);
          })
          .catch(() => {
            alert('최신 팀 상태 조회에 실패했습니다.');
          })
          .finally(() => {
            setSubjectImages([]);
            setDashboardView('topic');
            setSelectedPostId(parseInt(articleId));

            navigate(`/team-admin/${id}`);
          });
      })
      .catch((err) => {
        alert(err.response.data.message);
        setIsPending(false);
      });
  };

  return (
    <CommonLayout>
      <Flex direction={'column'} align={'center'} padding={padding}>
        <PageSectionHeader h={40}>
          <Title src={write} title="주제 작성하기" />
        </PageSectionHeader>
        <Spacer h={spacing} />
        <PostEditor
          forwardContent={setContent}
          forwardTitle={setSubjectTitle}
          setTag={setTag}
          content={regroupedArticleContent}
          title={articleTitle}
          tag={articleCategory}
        />
        <Spacer h={38} />
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
