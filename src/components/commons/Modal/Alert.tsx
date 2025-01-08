import { modalAtom } from "@/store/modal";
import Modal from "./Modal";
import { useAtomValue, useSetAtom } from "jotai";

export const Alert: React.FC = () => {
  const { message, isVisible } = useAtomValue(modalAtom);
  const setModal = useSetAtom(modalAtom);

  const onClick = () => {
    setModal({ message: '', isVisible: false });
  }

  return (
    <Modal open={isVisible} onClose={() => {}}>
      <div>{message}</div>
      <button onClick={onClick}>확인</button>
    </Modal>
  );
}