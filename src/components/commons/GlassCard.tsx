import { colors } from '@/constants/colors';
import styled from '@emotion/styled';

export const GlassCard = styled.div`
  width: 848px;
  min-height: 457px;
  border-radius: 40px;
  background: rgba(255, 255, 255, 0.4);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid ${colors.headerPurple};
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    width: 100%;
    background: rgba(255, 255, 255, 0);
    border: none;
    box-shadow: none;
  }
`;
