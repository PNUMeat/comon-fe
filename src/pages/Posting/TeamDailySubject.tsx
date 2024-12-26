import { Flex } from '@/components/commons/Flex';
import { LazyImage } from '@/components/commons/LazyImage';
import { PageSectionHeader } from '@/components/commons/PageSectionHeader';
import { SText } from '@/components/commons/SText';
import { Spacer } from '@/components/commons/Spacer';
import PostEditor from '@/components/features/Post/PostEditor';
import { CommonLayout } from '@/components/layout/CommonLayout';

import { Suspense, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';

import { createSubject } from '@/api/subject';
import commonToday from '@/assets/Posting/comonToday.png';
import click from '@/assets/TeamJoin/click.png';
import { colors } from '@/constants/colors';
import { PATH } from '@/routes/path';
import { postImagesAtom, postTitleAtom } from '@/store/posting';
import styled from '@emotion/styled';
import { useAtom } from 'jotai';

export const TeamDailySubject = () => {
  const [content, setContent] = useState<string>('');
  const [tag, setTag] = useState<string>('');
  const [subjectImages] = useAtom(postImagesAtom);
  const [subjectTitle] = useAtom(postTitleAtom);
  const { id } = useParams();
  const navigate = useNavigate();

  if (!id) {
    return <Navigate to={PATH.TEAMS} />;
  }

  const onClick = () => {
    createSubject({
      teamId: parseInt(id),
      articleTitle: subjectTitle,
      articleBody: content.trim().replace(/(<img[^>]*src=")[^"]*(")/g, '$1?$2'),
      image: subjectImages ? subjectImages[0] : null,
      articleCategory: tag,
    })
      .then((r) => {
        alert(r.message);
        navigate(`/team-admin/${id}`);
      })
      .catch((err) => console.error(err));
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
        <PageSectionHeader h={40}>✏️주제 작성하기</PageSectionHeader>
        <Spacer h={39} />
        <PostEditor forwardContent={setContent} setTag={setTag} />
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
