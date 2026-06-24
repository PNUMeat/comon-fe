import { IRecommendationProblem, getRecommendations } from '@/api/dashboard.ts';
import { useQuery } from '@tanstack/react-query';

type Arg = { teamId?: string; date: string; enabled: boolean };

export const useRecommendations = ({ teamId, date, enabled }: Arg) => {
  const { data, isPending } = useQuery({
    queryKey: ['recommendations', teamId, date],
    queryFn: () => getRecommendations(Number(teamId), date),
    enabled: enabled && !!teamId && !!date,
  });

  return {
    recommendations: (data ?? []) as IRecommendationProblem[],
    isPending,
  };
};
