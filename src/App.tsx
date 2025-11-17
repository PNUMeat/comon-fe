'use client';

import { RouterProvider } from 'react-router-dom';

import { router } from '@/routes/router';
import { authStatusAtom, refreshAuthAtom } from '@/store/auth';
import { useAtomValue, useSetAtom } from 'jotai';
import { useEffect } from 'react';

export const App = () => {
  const refresh = useSetAtom(refreshAuthAtom); 
  const authStatus = useAtomValue(authStatusAtom);

  useEffect(() => {
    refresh();
  }, []);

  if (authStatus === 'loading') {
    return null;
  }

  return <RouterProvider router={router} />;
};
