import { HeightInNumber } from '@/components/types';

import styled from '@emotion/styled';

export const ComonFormGrid = styled.div<HeightInNumber>`
  height: ${(props) => props.h}px;
  display: grid;
  grid-template-columns: 1fr 2fr;
  grid-gap: 20px 40px;
  width: 100%;
`;
