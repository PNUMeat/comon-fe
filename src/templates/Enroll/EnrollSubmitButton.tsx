import { ComonFormSubmitButton } from '@/components/commons/Form/ComonFormSubmitButton';

import { NavigateFunction, useNavigate } from 'react-router-dom';

import { createProfile } from '@/api/Login';
import {
  formTextInputAtom,
  formTextareaAtom,
  imageAtom,
  isEnrollSatisfiedAtom,
} from '@/store/form';
import { useAtomValue } from 'jotai';

const parseCookieAsJson = (): Record<string, string> => {
  return document.cookie
    .split(';')
    .map((cookie) => cookie.trim().split('='))
    .reduce(
      (acc, [key, value]) => {
        if (key && value) {
          acc[key] = value;
        }
        return acc;
      },
      {} as Record<string, string>
    );
};

const postProcessResponse = (navigate: NavigateFunction) => () => {
  const cookie = parseCookieAsJson();
  if (Object.entries(cookie).length > 0) {
    const at = cookie['access_token'];
    if (at) {
      localStorage.setItem('Authorization', at);
      navigate(-1);
      alert('회원가입에 성공했습니다');
    }
  }
};

export const EnrollSubmitButton = () => {
  const isAllFieldSatisfied = useAtomValue(isEnrollSatisfiedAtom);
  const memberName = useAtomValue(formTextInputAtom);
  const memberExplain = useAtomValue(formTextareaAtom);
  const image = useAtomValue(imageAtom);
  const navigate = useNavigate();

  const onClick = () => {
    createProfile({
      memberName: memberName,
      memberExplain: memberExplain,
      image: image,
    })
      .then(postProcessResponse(navigate))
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
