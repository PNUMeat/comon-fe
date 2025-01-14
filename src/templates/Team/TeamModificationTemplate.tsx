import { GradientGlassPanel } from '@/components/commons/GradientGlassPanel';
import { Spacer } from '@/components/commons/Spacer';

import { Fragment, Suspense } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { getTeamList } from '@/api/team.ts';
import { PATH } from '@/routes/path.tsx';
import { TeamForm } from '@/templates/Team/TeamForm';
import { TeamSkeleton } from '@/templates/Team/TeamSkeleton';
import { useSuspenseQuery } from '@tanstack/react-query';

const SuspenseTeamForm = () => {
  const location = useLocation();
  const { data } = useSuspenseQuery({
    queryKey: ['team-list', 0],
    queryFn: () => getTeamList('recent', 0, 1),
  });

  const { teamId } = location.state;
  if (!teamId) {
    return <Navigate to={PATH.TEAMS} />;
  }
  const teamIdNum = parseInt(teamId);
  const modiee = (data?.myTeams ?? []).find(
    (team) => team.teamId === teamIdNum
  );
  if (!modiee) {
    // 토스트?
    return <Navigate to={PATH.TEAMS} />;
  }

  return <TeamForm h={977} team={modiee} />;
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
