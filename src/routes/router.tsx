import { createBrowserRouter } from 'react-router-dom';

import { Home } from '@/pages/Home/Home';
import { Login } from '@/pages/Login/Login';
import { PATH } from '@/routes/path';

export const router = createBrowserRouter([
  {
    index: true,
    path: PATH.home,
    element: <Home />,
  },
  {
    path: PATH.login,
    element: <Login />,
  },
]);
