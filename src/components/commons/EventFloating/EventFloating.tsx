import { EventFloatingButton } from '@/components/commons/EventFloating/EventFloatingButton';

import { useState } from 'react';

import styled from '@emotion/styled';

import { EventFloatingContent } from './EventFloatingContent';

const FloatingButtonContainer = styled.div`
  position: fixed;
  bottom: 30px;
  right: 104px;
  z-index: 1000;
`;

export const EventFloating: React.FC = () => {
  const [open, setOpen] = useState<boolean>(true);
  return (
    <FloatingButtonContainer>
      <EventFloatingContent open={open} setOpen={setOpen} />
      <EventFloatingButton setOpen={setOpen} />
    </FloatingButtonContainer>
  );
};
