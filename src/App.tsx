'use client';

import { RouterProvider } from 'react-router-dom';

import { router } from '@/routes/router';

export const App = () => {
  // const refreshAuth = useSetAtom(refreshAuthAtom);

  // useEffect(() => {
  //   refreshAuth();
  // }, []);

  return <RouterProvider router={router} />;
};
