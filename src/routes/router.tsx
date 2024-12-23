import { MultiSectionLayout } from '@/components/layout/MultiSectionHeader';
import { SSLWithPathAtom } from '@/components/layout/SSLWithPathAtom';
import { SingleSectionLayout } from '@/components/layout/SingleSectionLayout';

import { Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';

import { Home } from '@/pages/Home/Home';
import { Posting } from '@/pages/Posting/Posting';
import { TeamDailySubject } from '@/pages/Posting/TeamDailySubject';
import { TeamAdmin } from '@/pages/TeamAdmin/TeamAdmin';
import { TeamDashboardPage } from '@/pages/TeamDashboard/TeamDashboard';
import { TeamJoinPage } from '@/pages/TeamJoin/TeamJoin';
import { LazyEnrollTemplate, LazySkeleton } from '@/routes/Lazies';
import { PATH } from '@/routes/path';
import { LoginTemplate } from '@/templates/Login/LoginTemplate';
import { TeamModificationTemplate } from '@/templates/Team/TeamModificationTemplate';
import { TeamRegistrationTemplate } from '@/templates/Team/TeamRegistrationTemplate';
import { ModificationTemplate } from '@/templates/User/ModificationTemplate';

export const router = createBrowserRouter([
  {
    index: true,
    path: PATH.HOME,
    element: <Home />,
  },
  // TODO : 아래 Posting이랑 Subject 공통 레이어 묶어야함
  {
    path: PATH.POSTING,
    element: <Posting />,
  },
  {
    path: PATH.SUBJECT,
    element: <TeamDailySubject />,
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
     *
     * (12/22) 현재 SSLWithPathAtom은 렌더링 마다 useEffect를 돌며 pathAtom 값을 변경하기 때문에, pathAtom을 사용하지 않는다면,
     * 해당 레이아웃 말고 아래에 SingleSectionLayout을 사용할 것을 권장. 나중에 청크 분리할거임
     */
    element: <SSLWithPathAtom />,
    children: [
      {
        path: PATH.LOGIN,
        element: <LoginTemplate />,
      },
      {
        path: PATH.ENROLL,
        element: (
          <Suspense fallback={<LazySkeleton />}>
            <LazyEnrollTemplate />
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
    ],
  },
  {
    element: <SingleSectionLayout />,
    children: [
      {
        path: `${PATH.TEAM_DASHBOARD}/:teamId`,
        element: (
          <Suspense fallback={<LazySkeleton />}>
            <TeamDashboardPage />
          </Suspense>
        ),
      },
      {
        path: PATH.TEAM_ADMIN,
        element: <TeamAdmin />,
      },
    ],
  },
  {
    element: <MultiSectionLayout />,
    children: [
      {
        path: PATH.TEAMS,
        element: <TeamJoinPage />,
      },
    ],
  },
]);
