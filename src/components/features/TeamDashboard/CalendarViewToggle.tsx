import { colors } from '@/constants/colors';
import { calendarModeAtom } from '@/store/dashboard';
import styled from '@emotion/styled';
import { useAtom } from 'jotai';

// 주간 보기 아이콘 — 캘린더 안에 가로 바 하나
const WeeklyIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <rect
      x="3.5"
      y="5"
      width="17"
      height="15.5"
      rx="2.5"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path
      d="M8 2.5V6.5M16 2.5V6.5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <rect x="7" y="11" width="8" height="2.5" rx="0.75" fill="currentColor" />
  </svg>
);

// 월간 보기 아이콘 — 캘린더 안에 점 그리드
const MonthlyIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <rect
      x="3.5"
      y="5"
      width="17"
      height="15.5"
      rx="2.5"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path
      d="M8 2.5V6.5M16 2.5V6.5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <rect x="7" y="10.5" width="2.4" height="2.4" rx="0.6" fill="currentColor" />
    <rect x="10.8" y="10.5" width="2.4" height="2.4" rx="0.6" fill="currentColor" />
    <rect x="14.6" y="10.5" width="2.4" height="2.4" rx="0.6" fill="currentColor" />
    <rect x="7" y="14.5" width="2.4" height="2.4" rx="0.6" fill="currentColor" />
    <rect x="10.8" y="14.5" width="2.4" height="2.4" rx="0.6" fill="currentColor" />
    <rect x="14.6" y="14.5" width="2.4" height="2.4" rx="0.6" fill="currentColor" />
  </svg>
);

export const CalendarViewToggle = () => {
  const [mode, setMode] = useAtom(calendarModeAtom);

  return (
    <ToggleRow>
      <ToggleButton
        $active={mode === 'weekly'}
        onClick={() => setMode('weekly')}
      >
        <WeeklyIcon />
        Weekly
      </ToggleButton>
      <ToggleButton
        $active={mode === 'monthly'}
        onClick={() => setMode('monthly')}
      >
        <MonthlyIcon />
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
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 12px;
  border: 1px solid ${({ $active }) => ($active ? colors.buttonPurple : '#E0E0E8')};
  background: #ffffff;
  color: ${({ $active }) => ($active ? colors.buttonPurple : '#9a9aa8')};
  font-weight: ${({ $active }) => ($active ? 700 : 500)};
  cursor: pointer;
`;
