import { checkIfLoggedIn, handleCookieOnRedirect } from '@/utils/cookie';

import { GradientGlassPanel } from '@/components/commons/GradientGlassPanel';
import { Spacer } from '@/components/commons/Spacer';

import { Fragment, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { PATH } from '@/routes/path';
import { LoginForm } from '@/templates/Login/LoginForm';

export const LoginTemplate = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { redirected } = useParams<{ redirected: string }>();

  useEffect(() => {
    handleCookieOnRedirect();
    if (checkIfLoggedIn()) {
      const sessionRedirect = sessionStorage.getItem('redirect');
      console.error(
        `redirect: ${sessionRedirect}, ${location?.state?.redirect}, ??:${redirected}`
      );
      const redirectDest =
        sessionRedirect ?? location.state?.redirect ?? PATH.HOME;
      // const navigatePath = redirectDest
      //   ? redirectDest === PATH.HOME
      //     ? PATH.TEAMS
      //     : PATH.HOME
      //   : PATH.HOME;
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
