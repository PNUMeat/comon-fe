import { Flex } from '@/components/commons/Flex';
import { LazyImage } from '@/components/commons/LazyImage';
import { PageSectionHeader } from '@/components/commons/PageSectionHeader';
import { Spacer } from '@/components/commons/Spacer';
import PostEditor from '@/components/features/Post/PostEditor';
import { CommonLayout } from '@/components/layout/CommonLayout';

import { Suspense, useState } from 'react';

import { createPost } from '@/api/postings';
import commonToday from '@/assets/Posting/comonToday.png';
import { postImagesAtom, postTitleAtom } from '@/store/posting';
import { useAtom } from 'jotai';

export const Posting = () => {
  const [content, setContent] = useState<string>('');
  const [postImages] = useAtom(postImagesAtom);
  const [postTitle] = useAtom(postTitleAtom);

  const onClick = () =>
    createPost({
      teamId: 3,
      image: (postImages && postImages[0]) ?? null,
      articleBody: content.replace(/(<img[^>]*src=")[^"]*(")/g, '$1?$2'),
      articleTitle: postTitle,
    }).then((data) => alert(data));

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
        <PostEditor forwardContent={setContent} />
        <Spacer h={38} />
        <button onClick={onClick}>작성완료</button>
        <button
          onClick={() =>
            console.log(content.replace(/(<img[^>]*src=")[^"]*(")/g, '$1?$2'))
          }
        >
          서버 전송 body 값 보기
        </button>
      </Flex>
      <Spacer h={200} />
    </CommonLayout>
  );
};
