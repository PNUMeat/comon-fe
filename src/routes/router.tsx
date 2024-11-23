import { createBrowserRouter } from 'react-router-dom';

import { PATH } from '@/routes/path';

export const router = createBrowserRouter([
  {
    index: true,
    path: PATH.home,
    element: <div>홈</div>,
  },
]);
