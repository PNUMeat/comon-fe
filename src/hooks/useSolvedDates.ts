import { getSolvedDates } from '@/api/dashboard.ts';
import { useQuery } from '@tanstack/react-query';

type Arg = { teamId?: string; year: number; month: number; enabled: boolean };

// 월간 캘린더 풀이 체크박스용 — 멤버 전용이라 enabled(isMyTeam)일 때만 호출
export const useSolvedDates = ({ teamId, year, month, enabled }: Arg) => {
  const { data } = useQuery({
    queryKey: ['solved-dates', teamId, year, month],
    queryFn: () => getSolvedDates(Number(teamId), year, month),
    enabled: enabled && !!teamId,
  });

  return { solvedDates: data };
};
