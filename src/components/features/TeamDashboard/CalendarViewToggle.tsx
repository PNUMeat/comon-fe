import MonthlyIcon from '@/assets/TeamDashboard/calendar-alt.svg';
import WeeklyIcon from '@/assets/TeamDashboard/calendar-week.svg';
import { calendarModeAtom } from '@/store/dashboard';
import styled from '@emotion/styled';
import { useAtom } from 'jotai';

export const CalendarViewToggle = () => {
  const [mode, setMode] = useAtom(calendarModeAtom);

  return (
    <ToggleRow>
      <ToggleButton
        aria-pressed={mode === 'weekly'}
        onClick={() => setMode('weekly')}
      >
        <img src={WeeklyIcon} alt="" />
        Weekly
      </ToggleButton>
      <ToggleButton
        aria-pressed={mode === 'monthly'}
        onClick={() => setMode('monthly')}
      >
        <img src={MonthlyIcon} alt="" />
        Monthly
      </ToggleButton>
    </ToggleRow>
  );
};

const ToggleRow = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 32px;
`;

const ToggleButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  width: 183px;
  height: 54px;
  padding: 16px 28px;
  border-radius: 8px;
  border: 1px solid #8488ec;
  background: #ffffff;
  box-shadow: 5px 7px 11.6px rgba(63, 63, 77, 0.07);
  color: #333333;
  font-size: 18px;
  font-weight: 600;
  line-height: normal;
  cursor: pointer;

  img {
    width: 24px;
    height: 24px;
    flex: none;
  }

  &:focus-visible {
    outline: 2px solid #6e74fa;
    outline-offset: 2px;
  }
`;
