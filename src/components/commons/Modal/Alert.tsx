import { alertAtom } from "@/store/modal";
import Modal from "./Modal";
import { useAtomValue, useSetAtom } from "jotai";
import styled from "@emotion/styled";

export const Alert: React.FC = () => {
  const { message, isVisible } = useAtomValue(alertAtom);
  const setModal = useSetAtom(alertAtom);

  const onClick = () => {
    setModal({ message: '', isVisible: false });
  }

  return (
    <Modal open={isVisible} onClose={() => {}}>
      <AlertStyle>
        <p>{message}</p>
      </AlertStyle>
      <AlertButton onClick={onClick}>확인</AlertButton>
    </Modal>
  );
}

const AlertStyle = styled.div`
  font-size: 18px;
  font-weight: 600;
  margin: 50px auto;
  color: #333;
`;

const AlertButton = styled.button`
  position: absolute;
  bottom: 18px;
  right: 25px;
  width: 87px;
  height: 38px;
  background-color: #8488EC;
  color: #fff;
  border-radius: 40px;
  font-size: 16px;
`;