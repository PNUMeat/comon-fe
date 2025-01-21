import { atom } from 'jotai';

type PostImageType = {
  key: string;
  img: File;
  line: number;
  idx: number;
};

// export const postImagesAtom = atom<File[]>([]);
export const postImagesAtom = atom<PostImageType[]>([]);
