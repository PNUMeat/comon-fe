import { createContext, useContext } from 'react';

import { TeamAdminResponse } from '@/api/team.ts';

export const TeamFormContext = createContext<TeamAdminResponse | null>(null);

export const useTeamOldData = () => {
  const context = useContext(TeamFormContext);
  if (!context) {
    throw new Error('useTeamForm must be used within a TeamFormProvider');
  }
  return context;
};
