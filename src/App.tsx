'use client';

import { RouterProvider } from 'react-router-dom';

import { router } from '@/routes/router';
import { refreshAuthAtom } from '@/store/auth';
import { useSetAtom } from 'jotai';
import { useEffect } from 'react';

export const App = () => {
  const refreshAuth = useSetAtom(refreshAuthAtom);

  useEffect(() => {
    refreshAuth();
  }, []);

  return <RouterProvider router={router} />;
};
