import { GradientGlassPanel } from '@/components/commons/GradientGlassPanel';
import { Spacer } from '@/components/commons/Spacer';

import { Fragment, Suspense } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { getTeamList } from '@/api/team.ts';
import { PATH } from '@/routes/path.tsx';
import { TeamForm } from '@/templates/Team/TeamForm';
import { TeamSkeleton } from '@/templates/Team/TeamSkeleton';
import { useSuspenseQuery } from '@tanstack/react-query';

import { TeamFormContext } from './TeamFormContext';

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

  const teamData = {
    teamName: modiee?.teamName,
    teamExplain: modiee?.teamExplain,
    topic: modiee?.topic,
    memberLimit: modiee?.memberLimit,
    password: null,
    image: modiee?.imageUrl,
  };

  return (
    <TeamFormContext.Provider value={teamData}>
      <TeamForm h={977} team={modiee} />
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
