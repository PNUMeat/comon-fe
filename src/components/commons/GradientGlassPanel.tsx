import { BackgroundGradient } from '@/components/commons/BackgroundGradient';
import { GlassCard } from '@/components/commons/GlassCard';
import { Spacer } from '@/components/commons/Spacer';

import { Fragment, ReactNode } from 'react';

export const GradientGlassPanel: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  return (
    <Fragment>
      <BackgroundGradient />
      <Spacer h={80} />
      <GlassCard>{children}</GlassCard>
    </Fragment>
  );
};
