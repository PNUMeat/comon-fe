import { GradientGlassPanel } from '@/components/commons/GradientGlassPanel';
import { Spacer } from '@/components/commons/Spacer';

import { Fragment } from 'react';

import { EnrollForm } from '@/templates/Enroll/EnrollForm';

export const EnrollTemplate = () => {
  return (
    <Fragment>
      <GradientGlassPanel>
        <EnrollForm h={767} />
      </GradientGlassPanel>
      <Spacer h={577} />
    </Fragment>
  );
};
