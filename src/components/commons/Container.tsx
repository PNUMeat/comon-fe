import styled from '@emotion/styled';

export const Container = styled.div<{
  maxW?: number;
  padding?: string;
}>`
  width: 100%;
  max-width: ${(props) => props.maxW || 1300}px;
  margin: 0 auto;
  padding: ${(props) => props.padding || '0 70px'};
`;
