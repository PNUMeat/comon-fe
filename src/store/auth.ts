import api from '@/api/apiInstance';
import type { ProfileQueryResp } from '@/api/user';
import { getMyProfile } from '@/api/user';
import { atom } from 'jotai';

export const authStatusAtom = atom<'authenticated' | 'guest'>('guest');
export const profileAtom = atom<ProfileQueryResp | null>(null);
export const authInitDoneAtom = atom(false);
export const isLoggedInAtom = atom((get) => get(authStatusAtom) === 'authenticated');

export const refreshAuthAtom = atom(null, async (_get, set) => {
  try {
    const data = await getMyProfile();
    set(profileAtom, data);
    set(authStatusAtom, 'authenticated');
  } catch {
    set(profileAtom, null);
    set(authStatusAtom, 'guest');
  } finally {
    set(authInitDoneAtom, true);
  }
});

export const logoutAtom = atom(null, async (_get, set) => {
  try {
    await api.post('/v1/logout');
  } finally {
    set(profileAtom, null);
    set(authStatusAtom, 'guest');
  }
});