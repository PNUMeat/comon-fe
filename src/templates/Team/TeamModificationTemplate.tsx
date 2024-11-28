import { GradientGlassPanel } from '@/components/commons/GradientGlassPanel';
import { Spacer } from '@/components/commons/Spacer';

import { Fragment } from 'react';

import { TeamForm } from '@/templates/Team/TeamForm';

export const TeamModificationTemplate = () => {
  return (
    <Fragment>
      <GradientGlassPanel>
        <TeamForm h={977} />
      </GradientGlassPanel>
      <Spacer h={312} />
    </Fragment>
  );
};
