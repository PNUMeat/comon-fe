import { Container } from '@/components/commons/Container';
import { CommonLayout } from '@/components/layout/CommonLayout';

import { Outlet } from 'react-router-dom';

export const MultiSectionLayout = () => {
  return (
    <CommonLayout>
      <Container maxW={1090}>
        <Outlet />
      </Container>
    </CommonLayout>
  );
};
