import { atom } from 'jotai';

export const formTextInputAtom = atom<string>('');

export const formTextareaAtom = atom<string>('');

export const imageStorageAtom = atom<string | null>(null);
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
