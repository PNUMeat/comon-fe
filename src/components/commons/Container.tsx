import styled from '@emotion/styled';

export const Container = styled.div<{
  maxW?: string;
  padding?: string;
}>`
  width: 100%;
  max-width: ${(props) => props.maxW || '1200px'};
  margin: 0 auto;
  padding: ${(props) => props.padding || '0 16px'};
`;
