import { atom } from 'jotai';

/*
    Form
 */
export const formTextInputAtom = atom<string>('');
export const formTextareaAtom = atom<string>('');

const imageStorageAtom = atom<string | null>(null);
export const isImageFitAtom = atom<boolean | null>(null);

export const imageAtom = atom(
  (get) => get(imageStorageAtom),
  (_get, set, file: File) => {
    const allowedTypes = ['image/png', 'image/jpeg'];
    if (!allowedTypes.includes(file.type)) {
      return;
    }

    const fileSizeInMB = file.size / 1024 / 1024;
    if (fileSizeInMB > 10) {
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
const peopleNumStorageAtom = atom<number>(0);

export const teamMaxNumAtom = atom(
  (get) => get(peopleNumStorageAtom),
  (_get, set, newValue: number) => {
    if (newValue > 0) {
      set(peopleNumStorageAtom, newValue);
    }
  }
);
export const teamSubjectAtom = atom<string>('');
export const teamPasswordAtom = atom<string>('');
