import { GradientGlassPanel } from '@/components/commons/GradientGlassPanel';
import { Spacer } from '@/components/commons/Spacer';

import { Fragment, Suspense } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { getTeamInfoAdmin } from '@/api/team.ts';
import { PATH } from '@/routes/path.tsx';
import { TeamForm } from '@/templates/Team/TeamForm';
import { TeamSkeleton } from '@/templates/Team/TeamSkeleton';
import { useSuspenseQuery } from '@tanstack/react-query';

import { TeamFormContext } from './TeamFormContext';

const SuspenseTeamForm = () => {
  const location = useLocation();
  // const { data } = useSuspenseQuery({
  //   queryKey: ['team-list', 0],
  //   queryFn: () => getTeamList('recent', 0, 1),
  // });
  const { teamId } = location.state;
  const teamIdInt = parseInt(teamId ?? '0');
  const { data } = useSuspenseQuery({
    queryKey: ['team-admin-info'],
    queryFn: () => getTeamInfoAdmin(teamIdInt),
  });
  if (!teamId) {
    return <Navigate to={PATH.TEAMS} />;
  }

  const teamData = {
    teamId: data?.teamId ?? 0,
    teamName: data?.teamName ?? '',
    teamExplain: data?.teamExplain ?? '',
    topic: data?.topic ?? '',
    memberLimit: data?.memberLimit ?? 0,
    password: data?.password ?? null,
    teamIconUrl: data?.teamIconUrl ?? '',
  };

  return (
    <TeamFormContext.Provider value={teamData}>
      <TeamForm h={977} teamInfo={teamData} />
    </TeamFormContext.Provider>
  );
};

const TeamModification = () => {
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

export default TeamModification;
