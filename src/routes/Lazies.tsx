import { Flex } from '@/components/commons/Flex';
import { SText } from '@/components/commons/SText';
import { SimpleLoader } from '@/components/commons/SimpleLoader';
import { Spacer } from '@/components/commons/Spacer';

import { ComponentType, LazyExoticComponent, lazy } from 'react';

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

export const LazyEnrollTemplate = delayedLazy(
  () => import('@/templates/User/EnrollTemplate')
);

// export const LazyTeamRegistrationTemplate = delayedLazy(
//   () => import('@/templates/Team/TeamRegistrationTemplate')
// );

export const LazyTeamModificationTemplate = delayedLazy(
  () => import('@/templates/Team/TeamModificationTemplate')
);
//
// export const LazyMyDashboard = delayedLazy(
//   () => import('@/templates/MyDashboard/MyDashboard')
// );

export const LazySkeleton = () => (
  <Flex align="center" direction="column">
    <Spacer h={150} />
    <SimpleLoader />
    <Spacer h={15} />
    <SText>로딩중</SText>
  </Flex>
);

// export const LazyPosting = React.lazy(() => import('@/pages/Posting/Posting'));
//
// export const LazyTeamDailySubject = React.lazy(
//   () => import('@/pages/Posting/TeamDailySubject')
// );
//
// export const LazyTeamJoinPage = React.lazy(
//   () => import('@/pages/TeamJoin/TeamJoin.tsx')
// );
//
// export const LazyEditorImage = React.lazy(
//   () => import('@/components/features/Post/nodes/LazyEditorImage')
// );
//
// export const LazyTeamDashboardPage = React.lazy(
//   () => import('@/pages/TeamDashboard/TeamDashboard')
// );
//
// export const LazyTeamAdmin = React.lazy(
//   () => import('@/pages/TeamAdmin/TeamAdmin.tsx')
// );
