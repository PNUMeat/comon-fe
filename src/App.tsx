'use client';

import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { useFcmToken } from '@/hooks/useFcmToken';
import { router } from '@/routes/router';
import { authStatusAtom, refreshAuthAtom } from '@/store/auth';
import { useAtomValue, useSetAtom } from 'jotai';
import { useEffect } from 'react';

const AuthChecker = () => {
  const refresh = useSetAtom(refreshAuthAtom);

  useEffect(() => {
    refresh();
  }, []);

  useFcmToken();

  return null;
}

export const App = () => {
  const authStatus = useAtomValue(authStatusAtom);

  return (
    <>
      <Toaster position="top-center" />
      <AuthChecker />
      {authStatus === 'loading' ? null : <RouterProvider router={router} />}
    </>
  );
};
