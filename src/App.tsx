'use client';

import { RouterProvider } from 'react-router-dom';

import { router } from '@/routes/router';
import { authStatusAtom, refreshAuthAtom } from '@/store/auth';
import { useAtomValue, useSetAtom } from 'jotai';
import { useEffect } from 'react';

const AuthChecker = () => {
  const refresh = useSetAtom(refreshAuthAtom); 

  useEffect(() => {
    refresh();
  }, []);
  
  return null;
}

export const App = () => {
  const authStatus = useAtomValue(authStatusAtom);

  return (
    <>
      <AuthChecker />
      {authStatus === 'loading' ? null : <RouterProvider router={router} />}
    </>
  );
};
