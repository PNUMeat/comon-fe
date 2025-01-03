import { Flex } from '@/components/commons/Flex';
import { LazyImage } from '@/components/commons/LazyImage';
import { PageSectionHeader } from '@/components/commons/PageSectionHeader';
import { SText } from '@/components/commons/SText';
import { Spacer } from '@/components/commons/Spacer';
import PostEditor from '@/components/features/Post/PostEditor';
import { CommonLayout } from '@/components/layout/CommonLayout';

import { Suspense, useState } from 'react';
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';

import { createSubject, mutateSubject } from '@/api/subject';
import commonToday from '@/assets/Posting/comonToday.png';
import click from '@/assets/TeamJoin/click.png';
import { colors } from '@/constants/colors';
import { PATH } from '@/routes/path';
import { currentViewAtom, selectedPostIdAtom } from '@/store/dashboard';
import { subjectImagesAtom } from '@/store/subject';
import styled from '@emotion/styled';
import { useAtom, useSetAtom } from 'jotai';

export const TeamDailySubject = () => {
  const location = useLocation();
  const { articleId, articleCategory, articleBody, articleTitle } =
    location?.state ?? {
      articleId: null,
      articleCategory: null,
      articleBody: null,
      articleTitle: null,
    };
  const [content, setContent] = useState<string>(() => articleBody ?? '');
  const [subjectTitle, setSubjectTitle] = useState(() => articleTitle ?? '');
  const [tag, setTag] = useState<string>(() => articleCategory ?? '');
  const [isPending, setIsPending] = useState(false);
  const [subjectImages] = useAtom(subjectImagesAtom);
  const setSelectedPostId = useSetAtom(selectedPostIdAtom);
  const setDashboardView = useSetAtom(currentViewAtom);
  const { id, selectedDate } = useParams();
  const navigate = useNavigate();

  if (!id || !selectedDate) {
    return <Navigate to={PATH.TEAMS} />;
  }

  const onClick = () => {
    if (isPending) {
      return;
    }

    const articleBody = content
      .trim()
      .replace(/(<img[^>]*src=")[^"]*(")/g, '$1?$2');

    if (articleId && articleCategory && articleBody && articleTitle) {
      setIsPending(true);
      mutateSubject({
        teamId: parseInt(id),
        articleId: parseInt(articleId),
        articleTitle: articleTitle,
        articleBody: articleBody,
        image: subjectImages ? subjectImages[0] : null,
        articleCategory: articleCategory,
      })
        .then(() => {
          alert('주제 수정이 완료되었습니다.');
          navigate(`/team-admin/${id}`);
        })
        .catch((err) => {
          alert('주제 수정에 실패했습니다.');
          console.error(err);
          setIsPending(false);
        });
      return;
    }

    if (
      !articleId ||
      !articleCategory ||
      !articleBody ||
      !articleTitle ||
      !tag
    ) {
      alert('모든 필드를 채워주세요');
      return;
    }
    setIsPending(true);
    createSubject({
      teamId: parseInt(id),
      articleTitle: subjectTitle,
      selectedDate: selectedDate,
      articleBody: articleBody,
      image: subjectImages ? subjectImages[0] : null,
      articleCategory: tag,
    })
      .then((data) => {
        const articleId = data.articleId;
        setDashboardView('topic');
        setSelectedPostId(articleId);
        alert(data.message);
        navigate(`/team-admin/${id}`);
        scrollTo(0, document.body.scrollHeight);
      })
      .catch((err) => {
        alert(err.data.message);
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
        <PageSectionHeader h={40}>✏️ 주제 작성하기</PageSectionHeader>
        <Spacer h={39} />
        <PostEditor
          forwardContent={setContent}
          forwardTitle={setSubjectTitle}
          setTag={setTag}
          content={articleBody}
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
