import { atom } from 'jotai';

export const alertAtom = atom<{
  message: string;
  isVisible: boolean;
  onConfirm: () => void;
}>({
  message: '',
  isVisible: false,
  onConfirm: () => {},
});

export const confirmAtom = atom<{
  message: string;
  description: string;
  isVisible: boolean;
  cancelText?: string;
  confirmText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}>({
  message: '',
  description: '',
  isVisible: false,
  cancelText: '취소',
  confirmText: '나가기',
  onConfirm: () => {},
  onCancel: () => {},
});
