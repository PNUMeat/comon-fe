import { createContext, useContext } from 'react';

interface TeamFormContextType {
  teamName: string;
  teamExplain: string;
  topic: string;
  memberLimit: number;
  image: string;
}

export const TeamFormContext = createContext<TeamFormContextType | null>(null);

export const useTeamOldData = () => {
  const context = useContext(TeamFormContext);
  if (!context) {
    throw new Error('useTeamForm must be used within a TeamFormProvider');
  }
  return context;
};
