import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import styled from '@emotion/styled';

interface ModalProps {
  onClose: () => void;
  children: React.ReactNode;
  open?: boolean;
}

const Modal: React.FC<ModalProps> = ({ onClose, children, open = false }) => {
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
      <ModalContainer onClick={handleModalClick}>{children}</ModalContainer>
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
  background-color: rgba(0, 0, 0, 0.5);
`;

const ModalContainer = styled.div`
  position: fixed;
  width: 316px;
  height: 144px;
  top: 50%;
  left: 50%;
  padding: 0 20px;
  transform: translate(-50%, -50%);
  z-index: 1000;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  background-color: #fff;
`;
