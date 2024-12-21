import { Flex } from '@/components/commons/Flex';
import { LazyImage } from '@/components/commons/LazyImage';
import { PageSectionHeader } from '@/components/commons/PageSectionHeader';
import { Spacer } from '@/components/commons/Spacer';
import { CommonLayout } from '@/components/layout/CommonLayout';

import { Suspense } from 'react';

import commonToday from '@/assets/Posting/comonToday.png';

export const Posting = () => {
  return (
    <CommonLayout>
      <Flex direction={'column'} align={'center'}>
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
        <div>posting</div>
      </Flex>
    </CommonLayout>
  );
};
