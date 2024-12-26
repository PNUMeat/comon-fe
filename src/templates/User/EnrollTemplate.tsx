import { handleCookieOnRedirect } from '@/utils/cookie';

import { usePrompt } from '@/hooks/usePrompt';

import { GradientGlassPanel } from '@/components/commons/GradientGlassPanel';
import { Spacer } from '@/components/commons/Spacer';

import { Fragment, useEffect } from 'react';

import { EnrollForm } from '@/templates/User/EnrollForm';

const EnrollTemplate = () => {
  useEffect(() => {
    handleCookieOnRedirect();
  }, []);

  usePrompt(true);

  return (
    <Fragment>
      <GradientGlassPanel>
        <EnrollForm h={767} />
      </GradientGlassPanel>
      <Spacer h={577} />
    </Fragment>
  );
};

export default EnrollTemplate;
