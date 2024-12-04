import { colors } from '@/constants/colors';
import styled from '@emotion/styled';

export const Label = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: '#f4f4f4';
  color: ${colors.buttonPurple};
  padding: 2px 20px;
  border: 1px solid ${colors.borderPurple};
  border-radius: 34px;
  box-sizing: border-box;
`;
