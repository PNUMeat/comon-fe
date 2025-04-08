import { ComonFormSubmitButton } from '@/components/commons/Form/ComonFormSubmitButton';

import { useLocation, useNavigate } from 'react-router-dom';

import { createProfile } from '@/api/user';
import { PATH } from '@/routes/path';
import { isSubmittedAtom } from '@/store/form';
import {
  formTextInputAtom,
  formTextareaAtom,
  imageAtom,
  isEnrollSatisfiedAtom,
} from '@/store/form';
import { alertAtom } from '@/store/modal';
import { useAtomValue, useSetAtom } from 'jotai';

export const EnrollSubmitButton = () => {
  const isAllFieldSatisfied = useAtomValue(isEnrollSatisfiedAtom);
  const memberName = useAtomValue(formTextInputAtom);
  const memberExplain = useAtomValue(formTextareaAtom);
  const image = useAtomValue(imageAtom);
  const navigate = useNavigate();
  const location = useLocation();
  const setAlert = useSetAtom(alertAtom);
  const setIsSubmitted = useSetAtom(isSubmittedAtom);

  const onClick = () => {
    createProfile({
      memberName: memberName,
      memberExplain: memberExplain,
      imageUrl: image,
    })
      .then(() => {
        // const previousPath = location.state?.redirect ?? PATH.TEAMS;
        // navigate(previousPath);
        setIsSubmitted(true);

        const navigatePath = location.state?.redirect
          ? location.state.redirect === PATH.HOME
            ? PATH.TEAMS
            : PATH.HOME
          : PATH.HOME;

        setAlert({
          message: '회원가입에 성공했습니다',
          isVisible: true,
          onConfirm: () => navigate(navigatePath),
        });
      })
      .catch((err) => {
        console.error(err);
        setAlert({
          message: `${err?.response?.data?.message ?? '회원가입에 실패했어요'}`,
          isVisible: true,
          onConfirm: () => {},
        });
      });
  };

  return (
    <ComonFormSubmitButton disabled={!isAllFieldSatisfied} onClick={onClick}>
      <span>🚀 코몬 시작하기!</span>
    </ComonFormSubmitButton>
  );
};
