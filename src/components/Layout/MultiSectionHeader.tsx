import { CommonLayout } from '@/components/Layout/CommonLayout';
import { Container } from '@/components/commons/Container';

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
