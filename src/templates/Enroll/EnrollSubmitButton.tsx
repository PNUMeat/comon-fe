import { ComonFormSubmitButton } from '@/components/commons/Form/ComonFormSubmitButton';

import { isEnrollSatisfiedAtom } from '@/store/enroll';
import { useAtomValue } from 'jotai';

export const EnrollSubmitButton = () => {
  const isAllFieldSatisfied = useAtomValue(isEnrollSatisfiedAtom);

  return (
    <ComonFormSubmitButton disabled={!isAllFieldSatisfied}>
      <span>🚀 코몬 시작하기!</span>
    </ComonFormSubmitButton>
  );
};
