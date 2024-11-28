import { formTextInputAtom, formTextareaAtom } from '@/store/form';
import { atom } from 'jotai';

export const isEnrollAgreementCheckedAtom = atom<boolean>(false);

export const isEnrollSatisfiedAtom = atom<boolean>((get) => {
  const name = get(formTextInputAtom);
  const introduction = get(formTextareaAtom);
  const isAgreed = get(isEnrollAgreementCheckedAtom);

  return name.trim().length > 0 && introduction.trim().length > 0 && isAgreed;
});
