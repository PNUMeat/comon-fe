import { atom } from 'jotai';

export const modalAtom = atom<{ message: string; isVisible: boolean }>({
  message: '',
  isVisible: false,
});