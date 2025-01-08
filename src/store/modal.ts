import { atom } from 'jotai';

export const alertAtom = atom<{ message: string; isVisible: boolean }>({
  message: '',
  isVisible: false,
});

export const confirmAtom = atom<{ message: string; description: string; isVisible: boolean; onConfirm: () => void }>({
  message: '',
  description: '',
  isVisible: false,
  onConfirm: () => {},
});