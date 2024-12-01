import { ComonFormSubmitButton } from '@/components/commons/Form/ComonFormSubmitButton';

import { useMemo } from 'react';

import { changeProfile } from '@/api/Login';
import { formTextInputAtom, formTextareaAtom, imageAtom } from '@/store/form';
import { useAtomValue } from 'jotai';

export const serializeImage = (file: File | null): string => {
  if (!file) return 'NULL';

  return JSON.stringify({
    name: file.name,
    type: file.type,
  });
};

const serializeProfile = (
  image: File | null,
  memberName: string,
  memberExplain: string
) => {
  return serializeImage(image) + memberName + memberExplain;
};

export const ModificationSubmitButton = () => {
  const memberName = useAtomValue(formTextInputAtom);
  const memberExplain = useAtomValue(formTextareaAtom);
  const image = useAtomValue(imageAtom);

  const cache = useMemo(
    () => serializeProfile(image, memberName, memberExplain),
    []
  );

  const onClick = () => {
    changeProfile({ memberName, memberExplain, image })
      .then(() => alert('프로필 변환에 성공했습니다'))
      .catch(() => alert('프로필 변환에 실패했습니다'));
  };

  return (
    <ComonFormSubmitButton
      disabled={cache === serializeProfile(image, memberName, memberExplain)}
      onClick={onClick}
    >
      <span>🚀 프로필 저장하기</span>
    </ComonFormSubmitButton>
  );
};
