import { breakpoints } from '@/constants/breakpoints';
import { colors } from '@/constants/colors';
import styled from '@emotion/styled';

export const Label = styled.div<{
  background?: string;
  color?: string;
  padding?: string;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(props) => props.background || '#f4f4f4'};
  color: ${(props) => props.color || colors.buttonPurple};
  padding: ${(props) => props.padding || '2px 20px'};
  border: 1px solid ${colors.borderPurple};
  border-radius: 34px;
  box-sizing: border-box;
  height: 18px;

  @media (max-width: ${breakpoints.mobile}px) {
    height: 16px;
  }
`;
