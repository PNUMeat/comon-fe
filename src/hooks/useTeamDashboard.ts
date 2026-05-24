import { getTeamDashboard } from '@/api/dashboard.ts';
import { useQuery } from '@tanstack/react-query';

type UseTeamDashboardArg = {
  teamId?: string;
  enabled: boolean; // 멤버일 때만 호출 (비회원 호출 시 서버 에러)
};

export const useTeamDashboard = ({ teamId, enabled }: UseTeamDashboardArg) => {
  const { data } = useQuery({
    queryKey: ['team-dashboard', teamId],
    queryFn: () => getTeamDashboard(Number(teamId)),
    enabled: !!teamId && enabled,
  });

  return { dashboard: data ?? null };
};
