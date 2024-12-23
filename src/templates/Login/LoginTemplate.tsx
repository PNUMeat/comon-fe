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
      const previousPath = location.state?.redirect ?? PATH.TEAM_DASHBOARD;
      navigate(previousPath);
    }
  }, []);

  return (
    <GradientGlassPanel>
      <LoginForm h={324} />
    </GradientGlassPanel>
  );
};
