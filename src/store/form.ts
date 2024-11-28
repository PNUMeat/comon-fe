import { atom } from 'jotai';

/**
 * 폼 값을 언제 클린업 해야할 지? 계속 유지하며 사용하고 싶다.
 * 현재 폼의 상태는 프로필 생성, 팀 생성, 팀 정보 변경에서 공유된다. (ComonTextarea, ComonTextInput, ComonImageInput)
 * 폼 값을 비워야 하는 경우는 다음과 같다.
 * 1. 프로필 -> 팀
 * 2. 팀 -> 프로필
 *
 * 그냥 하지 말까..
 */

/*
    Form
 */
export const formTextInputAtom = atom<string>('');
export const formTextareaAtom = atom<string>('');

const imageStorageAtom = atom<string | null>(null);
export const MAX_IMAGE_SIZE = 10;
export const isImageFitAtom = atom<boolean | null>(null);
export const imageAtom = atom(
  (get) => get(imageStorageAtom),
  (_get, set, file: File) => {
    const allowedTypes = ['image/png', 'image/jpeg'];
    if (!allowedTypes.includes(file.type)) {
      return;
    }

    const fileSizeInMB = file.size / 1024 / 1024;
    if (fileSizeInMB > MAX_IMAGE_SIZE) {
      set(isImageFitAtom, false);
      return;
    } else {
      set(isImageFitAtom, true);
    }

    const reader = new FileReader();
    reader.onload = () => set(imageStorageAtom, reader.result as string);
    reader.readAsDataURL(file);
  }
);

/*
    Enroll
 */
export const isEnrollAgreementCheckedAtom = atom<boolean>(false);
export const isEnrollSatisfiedAtom = atom<boolean>((get) => {
  const name = get(formTextInputAtom);
  const introduction = get(formTextareaAtom);
  const isAgreed = get(isEnrollAgreementCheckedAtom);

  return name.trim().length > 0 && introduction.trim().length > 0 && isAgreed;
});

/*
    Team
 */
const peopleNumStorageAtom = atom<number | string>('');
export const MAX_PEOPLE_NUM = 20;
export const teamMaxNumAtom = atom(
  (get) => get(peopleNumStorageAtom),
  (_get, set, newValue: number) => {
    if (newValue > 0 && newValue <= MAX_PEOPLE_NUM) {
      set(peopleNumStorageAtom, newValue);
    }
  }
);

export const teamSubjectAtom = atom<string>('');

const passwordStorageAtom = atom<string>('');
export const PROPER_PASSWORD_LENGTH = 4;
export const teamPasswordAtom = atom(
  (get) => get(passwordStorageAtom),
  (_get, set, newValue: string) => {
    if (/^\d*$/.test(newValue) && newValue.length <= PROPER_PASSWORD_LENGTH) {
      set(passwordStorageAtom, newValue);
      return;
    }
  }
);

export const isTeamRegistrationValidAtom = atom<boolean>((get) => {
  const name = get(formTextInputAtom);
  const desc = get(formTextareaAtom);
  const num = get(peopleNumStorageAtom);
  const subject = get(teamSubjectAtom);
  const password = get(passwordStorageAtom);

  return (
    name.trim().length > 0 &&
    desc.trim().length > 0 &&
    Number.isInteger(num) &&
    (num as number) <= MAX_PEOPLE_NUM &&
    subject !== '' &&
    /^\d*$/.test(password) &&
    password.length === 4
  );
});
