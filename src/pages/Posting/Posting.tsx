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

import { createPost, mutatePost } from '@/api/postings';
import commonToday from '@/assets/Posting/comonToday.png';
import click from '@/assets/TeamJoin/click.png';
import { colors } from '@/constants/colors';
import { PATH } from '@/routes/path';
import { postImagesAtom, postTitleAtom } from '@/store/posting';
import styled from '@emotion/styled';
import { useAtom } from 'jotai';

export const Posting = () => {
  const location = useLocation();
  const { article, articleId } = location.state;
  const [content, setContent] = useState<string>(() => article ?? '');
  const [postImages] = useAtom(postImagesAtom);
  const [postTitle, setPostTitle] = useAtom(postTitleAtom);
  const navigate = useNavigate();
  const { id } = useParams();
  if (!id) {
    return <Navigate to={PATH.TEAMS} />;
  }

  const onClick = () => {
    const articleBody = content
      .trim()
      .replace(/(<img[^>]*src=")[^"]*(")/g, '$1?$2');

    if (article && articleId) {
      mutatePost({
        teamId: parseInt(id),
        image: (postImages && postImages[0]) ?? null,
        articleId: parseInt(articleId),
        articleBody: articleBody,
        articleTitle: postTitle,
      })
        .then(() => {
          navigate(`/team-dashboard/${id}`);
          alert('게시글 수정이 완료되었습니다!');
        })
        .catch((err) => alert(err.response.data.data.articleTitle));
      return;
    }
    createPost({
      teamId: parseInt(id),
      image: (postImages && postImages[0]) ?? null,
      articleBody: articleBody,
      articleTitle: postTitle,
    })
      .then(() => {
        navigate(`/team-dashboard/${id}`);
        alert('게시글 작성이 완료되었습니다!');
      })
      .catch((err) => alert(err.response.data.data.articleTitle));
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
        <PageSectionHeader h={40}>✏️오늘의 글 등록하기</PageSectionHeader>
        <Spacer h={39} />
        <PostEditor
          forwardContent={setContent}
          forwardTitle={setPostTitle}
          content={article}
        />
        <Spacer h={38} />
        <ConfirmButtonWrap onClick={onClick}>
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

const ConfirmButtonWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  background: #fff;
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
