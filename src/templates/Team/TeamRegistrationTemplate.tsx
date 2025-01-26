import { GradientGlassPanel } from '@/components/commons/GradientGlassPanel';
import { Spacer } from '@/components/commons/Spacer';

import { Fragment, useEffect } from 'react';

import { TeamForm } from '@/templates/Team/TeamForm';

const TeamRegistrationTemplate = () => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant',
    });
  }, []);

  return (
    <Fragment>
      <GradientGlassPanel>
        <TeamForm h={977} />
      </GradientGlassPanel>
      <Spacer h={312} />
    </Fragment>
  );
};

export default TeamRegistrationTemplate;
