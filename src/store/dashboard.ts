import { atom } from 'jotai';

export const selectedPostIdAtom = atom<number | null>(null);
export const currentViewAtom = atom<string | null>(null);
export const selectedDateAtom = atom<string>(
  new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Seoul' })
);
export const pageAtom = atom<number>(0);

export const calendarModeAtom = atom<'weekly' | 'monthly'>('weekly');
export const weekAnchorAtom = atom<string>(
  new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Seoul' })
);
