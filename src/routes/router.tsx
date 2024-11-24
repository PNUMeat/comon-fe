import { createBrowserRouter } from 'react-router-dom';

import { TeamDashboardPage } from '@/pages/TeamDashboard/TeamDashboard';
import { PATH } from '@/routes/path';

export const router = createBrowserRouter([
  {
    index: true,
    path: PATH.HOME,
    element: <div>홈</div>,
  },
  {
    path: PATH.TEAM_DASHBOARD,
    element: <TeamDashboardPage />,
  },
]);
