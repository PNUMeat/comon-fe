import GiftIcon from '@/assets/EventFloating/gift.png';
import styled from '@emotion/styled';

const FloatingButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(90deg, #ffd482 0%, #ff377f 100%);
  width: 65px;
  height: 65px;
  border-radius: 50%;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
`;

const FloatingButtonStyle = styled.button`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #6e74fa;
  background-image: url(${GiftIcon});
  background-size: 28px 30px;
  background-repeat: no-repeat;
  background-position: center;
`;

interface EventFloatingButtonProps {
  setOpen: (value: boolean) => void;
}

export const EventFloatingButton: React.FC<EventFloatingButtonProps> = ({
  setOpen,
}) => {
  return (
    <FloatingButtonContainer>
      <FloatingButtonStyle onClick={() => setOpen(true)} />
    </FloatingButtonContainer>
  );
};
