import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import styled from '@emotion/styled';

interface ModalProps {
  onClose: () => void;
  height?: number;
  children: React.ReactNode;
  open?: boolean;
}

const Modal: React.FC<ModalProps> = ({ onClose, children, open = false, height = 144}) => {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';

      window.history.pushState(null, '', window.location.href);
      const handlePopState = () => {
        window.history.pushState(null, '', window.location.href);
        onClose();
      };

      window.addEventListener('popstate', handlePopState);

      return () => {
        window.removeEventListener('popstate', handlePopState);
        document.body.style.overflow = 'auto';
      };
    }
  }, [open, onClose]);

  if (!open) return null;

  const handleOverlayClick = () => {
    onClose();
  };

  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const modalRoot = document.getElementById('modal-root') || document.body;

  return ReactDOM.createPortal(
    <ModalOverlay onClick={handleOverlayClick}>
      <ModalContainer onClick={handleModalClick} height={height}>{children}</ModalContainer>
    </ModalOverlay>,
    modalRoot
  );
};

export default Modal;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 999;
  background-color: rgba(215, 215, 215, 0.5);
`;

const ModalContainer = styled.div<{ height: number}>`
  position: fixed;
  display: flex;
  width: 316px;
  height: ${({ height }) => height}px;
  top: 50%;
  left: 50%;
  padding: 0 20px;
  transform: translate(-50%, -50%);
  z-index: 1000;
  border-radius: 20px;
  background-color: #fff;
  border: 1px solid #cdcfff;
  justify-content: center;
  box-shadow: 5px 7px 11.6px 0px #3F3F4D12;
`;
