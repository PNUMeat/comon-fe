import { createBrowserRouter } from 'react-router-dom';

import { Home } from '@/pages/Home/Home';
import { PATH } from '@/routes/path';

export const router = createBrowserRouter([
  {
    index: true,
    path: PATH.home,
    element: <Home />,
  },
]);
