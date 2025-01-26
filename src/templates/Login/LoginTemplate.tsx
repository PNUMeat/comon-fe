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
      const redirectDest =
        location.state?.redirect ?? sessionRedirect ?? PATH.HOME;
      // const navigatePath = redirectDest
      //   ? redirectDest === PATH.HOME
      //     ? PATH.TEAMS
      //     : PATH.HOME
      //   : PATH.HOME;
      sessionStorage.removeItem('redirect');
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
