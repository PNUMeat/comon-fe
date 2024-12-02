import { handleCookieOnRedirect } from '@/utils/cookie';

import { ComonFormSubmitButton } from '@/components/commons/Form/ComonFormSubmitButton';

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { createProfile } from '@/api/user';
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
  const navigate = useNavigate();

  useEffect(() => {
    handleCookieOnRedirect();
  }, []);

  const onClick = () => {
    createProfile({
      memberName: memberName,
      memberExplain: memberExplain,
      image: image,
    })
      .then(() => {
        navigate(-1);
        alert('회원가입에 성공했습니다');
      })
      .catch((err) => {
        console.error(err);
        alert('회원가입에 실패했습니다');
      });
  };

  return (
    <ComonFormSubmitButton disabled={!isAllFieldSatisfied} onClick={onClick}>
      <span>🚀 코몬 시작하기!</span>
    </ComonFormSubmitButton>
  );
};
