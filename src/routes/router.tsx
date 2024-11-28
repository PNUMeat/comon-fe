import { MultiSectionLayout } from '@/components/Layout/MultiSectionHeader';
import { SingleSectionLayout } from '@/components/Layout/SingleSectionLayout';

import { createBrowserRouter } from 'react-router-dom';

import { Home } from '@/pages/Home/Home';
import { TeamCalendarPage } from '@/pages/TeamCalendar/TeamCalendar';
import { TeamDashboardPage } from '@/pages/TeamDashboard/TeamDashboard';
import { PATH } from '@/routes/path';
import { EnrollTemplate } from '@/templates/Enroll/EnrollTemplate';
import { LoginTemplate } from '@/templates/Login/LoginTemplate';
import { TeamModificationTemplate } from '@/templates/Team/TeamModificationTemplate';
import { TeamRegistrationTemplate } from '@/templates/Team/TeamRegistrationTemplate';

export const router = createBrowserRouter([
  {
    index: true,
    path: PATH.HOME,
    element: <Home />,
  },
  {
    /**
     * Outlet을 통해 공통된 레이아웃을 공유하는 컴포넌트 끼리 묶어 놓았다.
     * 공통된 레이아웃을 공유한다는 점 외에는 연관이 없는 컴포넌트이다. 순수 디자인을 기준으로 묶음.
     * 뭔가 잘못된 구조에서 동작하게 하려고 몸을 비튼 느낌이 없지 않다.
     * SingleSectionLayout의 PageSectionHeader 컴포넌트의 text-content를 url 별로 다르게 하기 위해 url과 text-content를 손수 매핑함. (path.tsx의 TITLES)
     * 컨텐트를 바꿔가며 사용해야 하지만 굳이 SingleSectionLayout에 포함 시킨 이유는, 나중에 Skeleton UI 만들 때 더 유용할 것으로 판단함.
     */
    element: <SingleSectionLayout />,
    children: [
      {
        path: PATH.LOGIN,
        element: <LoginTemplate />,
      },
      {
        path: PATH.ENROLL,
        element: <EnrollTemplate />,
      },
      {
        path: PATH.TEAM_REGISTRATION,
        element: <TeamRegistrationTemplate />,
      },
      {
        path: PATH.TEAM_MODIFICATION,
        element: <TeamModificationTemplate />,
      },
      { path: PATH.TEAM_CALENDAR, element: <TeamCalendarPage /> },
    ],
  },
  {
    element: <MultiSectionLayout />,
    children: [
      {
        path: PATH.TEAM_DASHBOARD,
        element: <TeamDashboardPage />,
      },
    ],
  },
]);
