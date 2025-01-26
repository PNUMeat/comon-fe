import { checkIfLoggedIn, handleCookieOnRedirect } from '@/utils/cookie';

import { GradientGlassPanel } from '@/components/commons/GradientGlassPanel';
import { Spacer } from '@/components/commons/Spacer';

import { Fragment, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { PATH } from '@/routes/path';
import { LoginForm } from '@/templates/Login/LoginForm';

export const LoginTemplate = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    handleCookieOnRedirect();
    if (checkIfLoggedIn()) {
      const sessionRedirect = sessionStorage.getItem('redirect');
      if (sessionRedirect) {
        sessionStorage.removeItem('redirect');
      }
      const redirectDest =
        sessionRedirect ?? location.state?.redirect ?? PATH.HOME;

      navigate(redirectDest, { replace: true });
    }
  }, []);

  return (
    <Fragment>
      <GradientGlassPanel>
        <LoginForm h={324} />
      </GradientGlassPanel>
      <Spacer h={500} />
    </Fragment>
  );
};
