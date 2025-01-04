import { atom } from 'jotai';

export const selectedPostIdAtom = atom<number | null>(null);
export const currentViewAtom = atom<string | null>(null);
export const selectedDateAtom = atom<string>(
  new Date().toISOString().split('T')[0]
);
export const pageAtom = atom<number>(0);
