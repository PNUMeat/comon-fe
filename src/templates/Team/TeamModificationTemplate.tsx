import { GradientGlassPanel } from '@/components/commons/GradientGlassPanel';
import { Spacer } from '@/components/commons/Spacer';

import { Fragment, Suspense } from 'react';

import { TeamForm } from '@/templates/Team/TeamForm';
import { TeamSkeleton } from '@/templates/Team/TeamSkeleton';
import { useSuspenseQuery } from '@tanstack/react-query';

const mockQueryFn = (): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('data');
    }, 3000);
  });
};

const SuspenseTeamForm = () => {
  const { data } = useSuspenseQuery({
    queryKey: ['mockData'],
    queryFn: mockQueryFn,
  });

  console.log(data);
  return <TeamForm h={977} />;
};

export const TeamModificationTemplate = () => {
  return (
    <Fragment>
      <GradientGlassPanel>
        <Suspense fallback={<TeamSkeleton h={977} />}>
          <SuspenseTeamForm />
        </Suspense>
      </GradientGlassPanel>
      <Spacer h={312} />
    </Fragment>
  );
};
