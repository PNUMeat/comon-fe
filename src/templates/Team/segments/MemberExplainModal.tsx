import { useEffect, useRef, useState } from 'react';

import searchIcon from '@/assets/TeamDashboard/search.png';
import closeIcon from '@/assets/TeamInfo/close.svg';
import styled from '@emotion/styled';

interface MemberExplainModalProps {
  memberExplain: string;
}

export const MemberExplainModal: React.FC<MemberExplainModalProps> = ({
  memberExplain,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement | null>(null);

  const toggleModal = () => setIsOpen((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <Container>
      <SearchIcon src={searchIcon} onClick={toggleModal} />
      {isOpen && (
        <ModalWrapper ref={modalRef}>
          <CloseButton onClick={toggleModal}>
            <img
              src={closeIcon}
              alt={'glass icon'}
              width={'18px'}
              height={'18px'}
            />
          </CloseButton>
          <ModalContent>
            <Title>소개글</Title>
            <Text>{memberExplain}</Text>
          </ModalContent>
        </ModalWrapper>
      )}
    </Container>
  );
};

const Container = styled.div`
  display: inline-block;
`;

const SearchIcon = styled.img`
  width: 16px;
  height: 16px;
  cursor: pointer;
`;

const ModalWrapper = styled.div`
  position: absolute;
  // transform: translate(0, -50%);
  width: 240px;
  min-height: 80px;
  padding: 10px;
  background: #f5f5f5;
  border: 1px solid #cdcfff;
  border-radius: 5px;
  z-index: 100;
  display: flex;
  flex-direction: column;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
`;

const CloseButton = styled.button`
  position: absolute;
  top: 5px;
  right: 5px;
  background-color: #e5e5e5;
  width: 12px;
  height: 12px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Title = styled.div`
  font-size: 12px;
  font-weight: bold;
  margin-bottom: 5px;
  color: #333;
`;

const Text = styled.div`
  font-size: 10px;
  color: #555;
  white-space: pre-line;
  text-align: left;
`;

export default MemberExplainModal;
