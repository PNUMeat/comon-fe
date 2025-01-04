import styled from '@emotion/styled';
import { EventFloatingButton } from '@/components/commons/EventFloating/EventFloatingButton';
import { EventFloatingContent } from './EventFloatingContent';
import { useState } from 'react';

const FloatingButtonContainer = styled.div`
  position: fixed;
  bottom: 60px;
  right: 60px;
  z-index: 1000;
`;

export const EventFloating: React.FC = () => {
  const [open, setOpen] = useState<boolean>(true);
  return (
    <FloatingButtonContainer>
      <EventFloatingContent open={open} setOpen={setOpen}/>
      <EventFloatingButton setOpen={setOpen}/>
    </FloatingButtonContainer>
  );
}