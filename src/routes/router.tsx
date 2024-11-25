import { SingleSectionLayout } from '@/components/Layout/SingleSectionLayout';

import { createBrowserRouter } from 'react-router-dom';

import { Home } from '@/pages/Home/Home';
import { PATH } from '@/routes/path';
import { LoginTemplate } from '@/templates/Login/LoginTemplate';

export const router = createBrowserRouter([
  {
    index: true,
    path: PATH.home,
    element: <Home />,
  },
  {
    element: <SingleSectionLayout />,
    children: [
      {
        path: PATH.login,
        element: <LoginTemplate />,
      },
    ],
  },
]);
