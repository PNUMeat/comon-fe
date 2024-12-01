import { GradientGlassPanel } from '@/components/commons/GradientGlassPanel';
import { Spacer } from '@/components/commons/Spacer';

import { Fragment } from 'react';

import { ModificationForm } from '@/templates/User/ModificationForm';

export const ModificationTemplate = () => {
  return (
    <Fragment>
      <GradientGlassPanel>
        <ModificationForm h={767} />
      </GradientGlassPanel>
      <Spacer h={577} />
    </Fragment>
  );
};
