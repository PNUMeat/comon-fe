import { breakpoints } from '@/constants/breakpoints';
import { alertAtom } from '@/store/modal';
import styled from '@emotion/styled';
import { useAtomValue, useSetAtom } from 'jotai';

import Modal from './Modal';

export const Alert: React.FC = () => {
  const { message, isVisible, onConfirm } = useAtomValue(alertAtom);
  const setModal = useSetAtom(alertAtom);

  const onClick = () => {
    onConfirm();
    setModal({ message: '', isVisible: false, onConfirm: () => {} });
  };

  return (
    <Modal open={isVisible} onClose={() => {}}>
      <AlertStyle>
        <p>{message}</p>
      </AlertStyle>
      <AlertButton onClick={onClick}>확인</AlertButton>
    </Modal>
  );
};

const AlertStyle = styled.div`
  font-size: 18px;
  font-weight: 600;
  margin: 50px auto;
  color: #333;

  @media (max-width: ${breakpoints.mobile}px) {
    font-size: 12px;
  }
`;

const AlertButton = styled.button`
  position: absolute;
  bottom: 18px;
  right: 25px;
  width: 87px;
  height: 38px;
  background-color: #8488ec;
  color: #fff;
  border-radius: 40px;
  font-size: 16px;

  @media (max-width: ${breakpoints.mobile}px) {
    font-size: 12px;
    width: 60px;
    height: 30px;
  }
`;
