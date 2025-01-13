import { breakpoints } from '@/constants/breakpoints';
import styled from '@emotion/styled';

export const FormFieldLabel = styled.label`
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  display: block;
  color: #333;

  @media (max-width: ${breakpoints.mobile}px) {
    font-size: 16px;
  }
`;
