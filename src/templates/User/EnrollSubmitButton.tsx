import { ComonFormSubmitButton } from '@/components/commons/Form/ComonFormSubmitButton';

import { useLocation, useNavigate } from 'react-router-dom';

import { createProfile } from '@/api/user';
import { PATH } from '@/routes/path';
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

  const onClick = () => {
    createProfile({
      memberName: memberName,
      memberExplain: memberExplain,
      image: image,
    })
      .then(() => {
        // const previousPath = location.state?.redirect ?? PATH.TEAMS;
        // navigate(previousPath);
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
          // '회원가입에 실패했습니다'
          message: `${err?.message} / ${err?.response?.status} / ${err.response?.data?.message} / ${err.response?.data?.code}`,
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
