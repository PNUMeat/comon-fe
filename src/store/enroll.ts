import { atom } from 'jotai';

export const enrollNameAtom = atom<string>('');

export const enrollIntroductionAtom = atom<string>('');

export const isEnrollAgreementCheckedAtom = atom<boolean>(false);

export const isAllFieldSatisfiedAtom = atom<boolean>((get) => {
  const name = get(enrollNameAtom);
  const introduction = get(enrollIntroductionAtom);

  return name.trim().length > 0 && introduction.trim().length > 0;
});
