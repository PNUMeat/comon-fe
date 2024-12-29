import { atom } from 'jotai';

export const selectedPostIdAtom = atom<number | null>(null);
export const currentViewAtom = atom<string | null>(null);
