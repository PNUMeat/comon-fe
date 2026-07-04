import { colors } from '@/constants/colors';
import { calendarModeAtom } from '@/store/dashboard';
import styled from '@emotion/styled';
import { useAtom } from 'jotai';

export const CalendarViewToggle = () => {
  const [mode, setMode] = useAtom(calendarModeAtom);

  return (
    <ToggleRow>
      <ToggleButton
        $active={mode === 'weekly'}
        onClick={() => setMode('weekly')}
      >
        Weekly
      </ToggleButton>
      <ToggleButton
        $active={mode === 'monthly'}
        onClick={() => setMode('monthly')}
      >
        Monthly
      </ToggleButton>
    </ToggleRow>
  );
};

const ToggleRow = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
`;

const ToggleButton = styled.button<{ $active: boolean }>`
  padding: 10px 20px;
  border-radius: 12px;
  border: 1px solid ${({ $active }) => ($active ? colors.buttonPurple : '#E0E0E8')};
  background: #ffffff;
  color: ${({ $active }) => ($active ? colors.buttonPurple : '#9a9aa8')};
  font-weight: ${({ $active }) => ($active ? 700 : 500)};
  cursor: pointer;
`;
