import { handleCookieOnRedirect } from '@/utils/cookie';

import { GradientGlassPanel } from '@/components/commons/GradientGlassPanel';
import { Spacer } from '@/components/commons/Spacer';

import { Fragment, useEffect } from 'react';
import { useBlocker } from 'react-router-dom';

import { EnrollForm } from '@/templates/User/EnrollForm';

const usePrompt = (when: boolean) => {
  const blocker = useBlocker(({ currentLocation, nextLocation }) => {
    return when && currentLocation.pathname !== nextLocation.pathname;
  });

  const beforeUnloadHandler = (event: Event) => {
    event.preventDefault();
    event.returnValue = true;
  };

  useEffect(() => {
    if (blocker.state !== 'blocked') return;

    if (window.confirm('정말로 이동하시겠습니까?')) {
      blocker.proceed();
    } else {
      blocker.reset();
    }
  }, [blocker.state]);

  useEffect(() => {
    if (when) {
      window.addEventListener('beforeunload', beforeUnloadHandler);
    } else {
      window.removeEventListener('beforeunload', beforeUnloadHandler);
    }
    return () => {
      window.removeEventListener('beforeunload', beforeUnloadHandler);
    };
  }, [when]);
};

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
