import { createBrowserRouter } from 'react-router-dom';

import { Home } from '@/pages/Home/Home';
import { Login } from '@/pages/Login/Login';
import { TeamDashboardPage } from '@/pages/TeamDashboard/TeamDashboard';
import { PATH } from '@/routes/path';

export const router = createBrowserRouter([
  {
    index: true,
    path: PATH.HOME,
    element: <Home />,
  },
  {
    path: PATH.LOGIN,
    element: <Login />,
  },
  {
    path: PATH.TEAM_DASHBOARD,
    element: <TeamDashboardPage />,
  },
]);
