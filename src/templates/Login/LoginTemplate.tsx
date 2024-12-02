import { handleCookieOnRedirect } from '@/utils/cookie';

import { GradientGlassPanel } from '@/components/commons/GradientGlassPanel';

import { useEffect } from 'react';

import { LoginForm } from '@/templates/Login/LoginForm';

export const LoginTemplate = () => {
  useEffect(() => {
    handleCookieOnRedirect();
  }, []);

  return (
    <GradientGlassPanel>
      <LoginForm h={324} />
    </GradientGlassPanel>
  );
};
