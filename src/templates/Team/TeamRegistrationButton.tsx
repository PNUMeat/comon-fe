import { ComonFormSubmitButton } from '@/components/commons/Form/ComonFormSubmitButton';

import { isTeamRegistrationValidAtom } from '@/store/form';
import { useAtomValue } from 'jotai';

export const TeamRegistrationButton = () => {
  const isGoodToGo = useAtomValue(isTeamRegistrationValidAtom);

  return (
    <ComonFormSubmitButton disabled={!isGoodToGo}>
      <span>🚀 팀 생성하기</span>
    </ComonFormSubmitButton>
  );
};
