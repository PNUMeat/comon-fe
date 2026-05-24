import { Spacer } from '@/components/commons/Spacer';
import { ProfileCard } from '@/components/features/TeamDashboard/ProfileCard';
import { WeeklyGrass } from '@/components/features/TeamDashboard/WeeklyGrass';

import { useTeamDashboard } from '@/hooks/useTeamDashboard';
import styled from '@emotion/styled';

interface IPersonalDashboardProps {
  teamId?: string;
  enabled: boolean; // 멤버일 때만 (비회원은 호출/렌더 안 함)
}

export const PersonalDashboard: React.FC<IPersonalDashboardProps> = ({
  teamId,
  enabled,
}) => {
  const { dashboard } = useTeamDashboard({ teamId, enabled });

  if (!dashboard) {
    return null;
  }

  return (
    <Stack>
      <ProfileCard data={dashboard} />
      <Spacer h={20} />
      <WeeklyGrass weeklyGrass={dashboard.weeklyGrass} nDays={dashboard.nDays} />
    </Stack>
  );
};

// Sidebar는 모바일에서 flex-row가 되므로, 카드들을 항상 세로로 고정
const Stack = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;
