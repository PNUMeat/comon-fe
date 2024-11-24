import { CommonLayout } from '@/components/commons/CommonLayout';
import { Container } from '@/components/commons/Container';
import { GlassCard } from '@/components/commons/GlassCard';
import { PageSectionHeader } from '@/components/commons/PageSectionHeader';
import { Spacer } from '@/components/commons/Spacer';

import { LoginForm } from '@/pages/Login/LoginForm';

const h = 40;

export const Login = () => {
  return (
    <CommonLayout>
      <Container maxW={1090}>
        <PageSectionHeader h={h}>로그인</PageSectionHeader>
        <Spacer h={80} />
        <GlassCard>
          <LoginForm h={324} />
        </GlassCard>
      </Container>
    </CommonLayout>
  );
};
