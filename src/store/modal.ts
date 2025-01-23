import { atom } from 'jotai';

export const alertAtom = atom<{ message: string; isVisible: boolean; onConfirm: () => void }>({
  message: '',
  isVisible: false,
  onConfirm: () => {},
});

export const confirmAtom = atom<{ message: string; description: string; isVisible: boolean; onConfirm: () => void; onCancel: () => void }>({
  message: '',
  description: '',
  isVisible: false,
  onConfirm: () => {},
  onCancel: () => {},
});