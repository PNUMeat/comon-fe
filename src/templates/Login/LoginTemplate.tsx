import { BackgroundGradient } from '@/components/commons/BackgroundGradient';
import { GlassCard } from '@/components/commons/GlassCard';
import { Spacer } from '@/components/commons/Spacer';

import { Fragment } from 'react';

import { LoginForm } from '@/templates/Login/LoginForm';

export const LoginTemplate = () => {
  return (
    <Fragment>
      <BackgroundGradient />
      <Spacer h={80} />
      <GlassCard>
        <LoginForm h={324} />
      </GlassCard>
    </Fragment>
  );
};
