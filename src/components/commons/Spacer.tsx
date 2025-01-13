import { HeightInNumber } from '@/components/types';

import styled from '@emotion/styled';

export const Spacer = styled.div<
  {
    width?: number;
    bg?: string;
    isRef?: boolean;
  } & HeightInNumber
>`
  width: ${(props) =>
    props.isRef ? '100%' : props.width ? `${props.width}px` : '0'};
  height: ${(props) => (props.h ? `${props.h}px` : '0')};
  display: block;
  background-color: ${(props) => props.bg ?? 'transparent'};
`;
