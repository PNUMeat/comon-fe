import { ComonFormSubmitButton } from '@/components/commons/Form/ComonFormSubmitButton';

import { createProfile } from '@/api/Login';
import {
  formTextInputAtom,
  formTextareaAtom,
  imageAtom,
  isEnrollSatisfiedAtom,
} from '@/store/form';
import { useAtomValue } from 'jotai';

export const EnrollSubmitButton = () => {
  const isAllFieldSatisfied = useAtomValue(isEnrollSatisfiedAtom);
  const memberName = useAtomValue(formTextInputAtom);
  const memberExplain = useAtomValue(formTextareaAtom);
  const image = useAtomValue(imageAtom);

  const onClick = () => {
    createProfile({
      memberName: memberName,
      memberExplain: memberExplain,
      image: image,
    }).then((res) => console.log(res));
  };

  return (
    <ComonFormSubmitButton disabled={!isAllFieldSatisfied} onClick={onClick}>
      <span>🚀 코몬 시작하기!</span>
    </ComonFormSubmitButton>
  );
};
