import { forwardRef } from 'react';

import { breakpoints } from '@/constants/breakpoints';
import styled from '@emotion/styled';

interface ContainerProps {
  maxW?: number;
  padding?: string;
  scrollSnapType?: string;
  scrollSnapAlign?: string;
  margin?: string;
  transform?: string;
  children?: React.ReactNode;
}

export const ContainerStyle = styled.div<ContainerProps>`
  width: 100%;
  max-width: ${(props) => props.maxW || 1300}px;
  padding: ${(props) => props.padding || '0 70px'};
  margin: ${(props) => props.margin || '0 auto'};
  ${(props) =>
    props.scrollSnapType === 'y mandatory'
      ? `scroll-snap-type: y mandatory; overflow-y: scroll; height: 100vh;`
      : `scroll-snap-type: ${props.scrollSnapType};`};
  scroll-snap-align: ${(props) => props.scrollSnapAlign};
  transform: ${(props) => props.transform};
  min-width: 390px;
  @media (max-width: ${breakpoints.mobile}px) {
    padding: 0 20px;
    width: 100%;
    box-sizing: border-box;
  }
`;

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ children, ...props }, ref) => (
    <ContainerStyle ref={ref} {...props}>
      {children}
    </ContainerStyle>
  )
);
