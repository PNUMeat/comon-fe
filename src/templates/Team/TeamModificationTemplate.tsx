import { GradientGlassPanel } from '@/components/commons/GradientGlassPanel';
import { Spacer } from '@/components/commons/Spacer';

import { Fragment, Suspense } from 'react';

import { TeamForm } from '@/templates/Team/TeamForm';
import { TeamSkeleton } from '@/templates/Team/TeamSkeleton';

// const SuspenseTeamForm = () => {
//   // throw new Promise(() => {});
//
//   return (
//     <TeamForm
//       h={977}
//       title={'팀 정보 수정하기'}
//       subtitle={'저장 후에도 모든 정보를 수정할 수 있어요'}
//     />
//   );
// };

export const TeamModificationTemplate = () => {
  return (
    <Fragment>
      <GradientGlassPanel>
        <Suspense fallback={<TeamSkeleton h={977} />}>
          <TeamForm h={977} />
        </Suspense>
      </GradientGlassPanel>
      <Spacer h={312} />
    </Fragment>
  );
};
