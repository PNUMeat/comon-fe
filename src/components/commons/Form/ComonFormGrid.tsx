import { HeightInNumber } from '@/components/types';

import { breakpoints } from '@/constants/breakpoints';
import styled from '@emotion/styled';

export const ComonFormGrid = styled.div<HeightInNumber>`
  height: ${(props) => props.h}px;
  display: grid;
  grid-template-columns: 1fr 2fr;
  grid-gap: 20px 40px;
  width: 100%;

  @media (max-width: ${breakpoints.mobile}px) {
    display: flex;
    flex-direction: column;
    grid-gap: 10px;
    height: auto;
    width: 90%;
  }
`;
