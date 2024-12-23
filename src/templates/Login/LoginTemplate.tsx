import { checkIfLoggedIn, handleCookieOnRedirect } from '@/utils/cookie';

import { GradientGlassPanel } from '@/components/commons/GradientGlassPanel';

import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { PATH } from '@/routes/path';
import { LoginForm } from '@/templates/Login/LoginForm';

export const LoginTemplate = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    handleCookieOnRedirect();
    if (checkIfLoggedIn()) {
      // const previousPath = location.state?.redirect ?? PATH.HOME;
      const navigatePath = location.state?.redirect
        ? location.state.redirect === PATH.HOME
          ? PATH.TEAMS
          : PATH.HOME
        : PATH.HOME;
      navigate(navigatePath);
    }
  }, []);

  return (
    <GradientGlassPanel>
      <LoginForm h={324} />
    </GradientGlassPanel>
  );
};
