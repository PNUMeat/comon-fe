import { SimpleLoader } from '@/components/commons/SimpleLoader';
import { HeightInNumber } from '@/components/types';

import { TeamFormLayout } from '@/templates/Team/TeamFormLayout';

export const TeamSkeleton: React.FC<HeightInNumber> = ({ h }) => {
  return (
    <TeamFormLayout h={h}>
      <SimpleLoader />
    </TeamFormLayout>
  );
};
