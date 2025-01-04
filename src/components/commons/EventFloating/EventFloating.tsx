import styled from '@emotion/styled';
import { EventFloatingButton } from '@/components/commons/EventFloating/EventFloatingButton';

const FloatingButtonContainer = styled.div`
  position: fixed;
  bottom: 200px;
  right: 60px;
  z-index: 1000;
`;

export const EventFloating: React.FC = () => {
  return (
    <FloatingButtonContainer>
      <EventFloatingButton />
    </FloatingButtonContainer>
  );
}