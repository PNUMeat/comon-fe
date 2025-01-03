import { Flex } from '@/components/commons/Flex';
import { CommonLayout } from '@/components/layout/CommonLayout';

import pageNotFound from '@/assets/NotFound/404.png';

export const NotFound = () => {
  return (
    <CommonLayout>
      <Flex direction={'column'}>
        <img alt={'page not found'} src={pageNotFound} />
      </Flex>
    </CommonLayout>
  );
};
