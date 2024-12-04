import { Flex } from '@/components/commons/Flex';
import { SText } from '@/components/commons/SText';
import { SimpleLoader } from '@/components/commons/SimpleLoader';
import { Spacer } from '@/components/commons/Spacer';
import { MultiSectionLayout } from '@/components/layout/MultiSectionHeader';
import { SingleSectionLayout } from '@/components/layout/SingleSectionLayout';

import { ComponentType, LazyExoticComponent, Suspense, lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';

import { Home } from '@/pages/Home/Home';
import { TeamCalendarPage } from '@/pages/TeamCalendar/TeamCalendar';
import { TeamDashboardPage } from '@/pages/TeamDashboard/TeamDashboard';
import { PATH } from '@/routes/path';
import { LoginTemplate } from '@/templates/Login/LoginTemplate';
import { TeamModificationTemplate } from '@/templates/Team/TeamModificationTemplate';
import { TeamRegistrationTemplate } from '@/templates/Team/TeamRegistrationTemplate';
import { ModificationTemplate } from '@/templates/User/ModificationTemplate';

const LazySkeleton = () => (
  <Flex align="center" direction="column">
    <Spacer h={150} />
    <SimpleLoader />
    <Spacer h={15} />
    <SText>로딩중</SText>
  </Flex>
);

/**
 * useState, useEffect 써서 MinTimePreservedFallback을 만드는 건 좀 별로 인거 같음.
 * 그냥 Promise.all을 사용하는게 그냥 로직상으로도, 코드상으로도 이해가 편할듯
 * lazy 로드 했는데 응답이 빨리 오면 화면이 깜빡거리는거 같은 상황 발생해서 fallback 최소 렌더링 시간 추가
 */
const delayedLazy = (
  importFunction: () => Promise<{ default: ComponentType<unknown> }>,
  delay = 600
): LazyExoticComponent<ComponentType<unknown>> => {
  return lazy(() =>
    Promise.all([
      importFunction(),
      new Promise((resolve) => setTimeout(resolve, delay)),
    ]).then(([moduleExports]) => moduleExports)
  );
};

const EnrollTemplate = delayedLazy(
  () => import('@/templates/User/EnrollTemplate')
);

export const router = createBrowserRouter([
  {
    index: true,
    path: PATH.HOME,
    element: <Home />,
  },
  {
    /**
     * (11/24) Outlet을 통해 공통된 레이아웃을 공유하는 컴포넌트 끼리 묶어 놓았다.
     * 공통된 레이아웃을 공유한다는 점 외에는 연관이 없는 컴포넌트이다. 순수 디자인을 기준으로 묶음.
     * 뭔가 잘못된 구조에서 동작하게 하려고 몸을 비튼 느낌이 없지 않다.
     * SingleSectionLayout의 PageSectionHeader 컴포넌트의 text-content를 url 별로 다르게 하기 위해 url과 text-content를 손수 매핑함. (path.tsx의 TITLES)
     * 컨텐트를 바꿔가며 사용해야 하지만 굳이 SingleSectionLayout에 포함 시킨 이유는, 나중에 Skeleton UI 만들 때 더 유용할 것으로 판단함.
     *
     * (12/04) EnrollTemplate(회원가입 화면)은 사용 빈도가 적어 초기 로드 속도를 향상시키기 위해 동적 임포트 적용
     * manualChunks 옵션을 통해 동적 임포트 되는 페이지에서 사용되는 상태들 또한 같이 동적 임포트 해야하는지?
     * 사용되는 상태는 동적 임포트 하지 않고 페이지만 동적으로 나눈다면, 크게 의미가 있는지?
     * EnrollTemplate을 동적으로 임포트한다면, 상태 파일을 공유하는 ModificationTemplate는 어떻게 해야하는지?
     * 그냥 form 관련 페이지들과 상태를 하나의 청크로 묶는게 좋을지? 코드 상으론 깔끔해 보이지만 각 페이지 마다 사용 목적과 시점이 다 다르긴함.
     * 고민중
     *
     * 그런데, 애초에 form 관련 페이지가 다른 페이지에 비해 사용 빈도가 낮으니
     * form 관련 페이지의 상태는 그냥 uncontrolled 방식으로 만들었으면 청크만 분리하면 되기 때문에 코드스플리팅이 더 쉬웠을듯함.
     */
    element: <SingleSectionLayout />,
    children: [
      {
        path: PATH.LOGIN,
        element: <LoginTemplate />,
      },
      {
        path: PATH.ENROLL,
        element: (
          <Suspense fallback={<LazySkeleton />}>
            <EnrollTemplate />
          </Suspense>
        ),
      },
      {
        path: PATH.PROFILE,
        element: <ModificationTemplate />,
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
