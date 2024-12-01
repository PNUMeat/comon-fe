import { GradientGlassPanel } from '@/components/commons/GradientGlassPanel';

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { PATH } from '@/routes/path';
import { LoginForm } from '@/templates/Login/LoginForm';

const parseCookieAsJson = (): Record<string, string> => {
  return document.cookie
    .split(';')
    .map((cookie) => cookie.trim().split('='))
    .reduce(
      (acc, [key, value]) => {
        if (key && value) {
          acc[key] = value;
        }
        return acc;
      },
      {} as Record<string, string>
    );
};

const isNew = (segment: string | null) => {
  return segment && segment === 'true';
};

export const LoginTemplate = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const cookie = parseCookieAsJson();
    if (cookie) {
      const at = cookie['access_token'];
      localStorage.setItem('Authorization', at);

      navigate(isNew(cookie['new']) ? PATH.ENROLL : PATH.HOME);
    }
  }, []);
  return (
    <GradientGlassPanel>
      <LoginForm h={324} />
    </GradientGlassPanel>
  );
};
