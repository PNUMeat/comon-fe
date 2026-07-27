import { ICalendarTag } from '@/api/dashboard.ts';
import { Tag } from '@/components/commons/Tag';
import { colors } from '@/constants/colors';
import { useTeamDashboard } from '@/hooks/useTeamDashboard';
import { weekAnchorAtom } from '@/store/dashboard';
import {
  addDays,
  formatWeekRange,
  getMonday,
  getWeekDates,
  isFutureWeek,
  parseYMD,
  toYMD,
  todayYMD,
} from '@/utils/week';
import styled from '@emotion/styled';
import { useAtom } from 'jotai';

import { categoryColors, getDateCategory } from './weekdayBadge';

const WEEKDAY_LABELS = ['월', '화', '수', '목', '금', '토', '일'];

interface WeeklyCalendarProps {
  tags: ICalendarTag[];
  onDateSelect: (date: string) => void;
  selectedDate: string;
  teamId?: string;
  isMyTeam: boolean;
}

export const WeeklyCalendar = ({
  tags,
  onDateSelect,
  selectedDate,
  teamId,
  isMyTeam,
}: WeeklyCalendarProps) => {
  const [anchor, setAnchor] = useAtom(weekAnchorAtom);
  const today = todayYMD();
  const anchorDate = parseYMD(anchor);

  // weekf-006: 이번 주 풀이 여부 — 대시보드 weeklyGrass(월~일, 멤버 전용) 재사용
  const { dashboard } = useTeamDashboard({ teamId, enabled: isMyTeam });
  const solvedByDate = new Map(
    dashboard
      ? getWeekDates(parseYMD(today)).map((ymd, i) => [
          ymd,
          (dashboard.weeklyGrass[i]?.count ?? 0) > 0,
        ])
      : []
  );

  const thisWeek = getWeekDates(anchorDate); // 월~일 7개 (weekf-005)
  const lastWeek = getWeekDates(addDays(getMonday(anchorDate), -7)); // weekf-004

  const nextMonday = addDays(getMonday(anchorDate), 7);
  const nextDisabled = isFutureWeek(nextMonday, parseYMD(today));

  const goPrevWeek = () => setAnchor(toYMD(addDays(getMonday(anchorDate), -7)));
  const goNextWeek = () => {
    if (!nextDisabled) setAnchor(toYMD(nextMonday));
  };
  // weekf-011: 오늘로 바로가기 — 주(anchor)와 선택 날짜를 모두 오늘로
  const goToday = () => {
    setAnchor(today);
    onDateSelect(today);
  };

  const renderRow = (week: string[], dim: boolean) => (
    <Row>
      {week.map((ymd) => {
        const day = Number(ymd.split('-')[2]);
        const isToday = ymd === today;
        const isSelected = ymd === selectedDate;
        // weekf-005: 주제가 있는 날짜의 뱃지 — 오늘은 '스터디', 지난 날짜는 '스터디 복습'
        const badgeLabel = isToday ? '스터디' : '스터디 복습';
        const hasBadge = !!getDateCategory(tags, ymd);
        // weekf-006: 우측 하단 풀이 여부 박스 — 이번 주(dim 제외) 오늘까지만 표시
        const solved = solvedByDate.get(ymd);
        const showSolveBox = !dim && ymd <= today && solved !== undefined;
        return (
          <Cell
            key={ymd}
            $dim={dim}
            $selected={isSelected}
            $today={isToday}
            onClick={() => {
              onDateSelect(ymd);
              if (dim) goPrevWeek(); // weekf-004: 저번주 클릭 시 저번주로 이동
            }}
          >
            {/* weekf-005: 날짜 오른쪽에 뱃지 배치 (피그마 시안) */}
            <TopRow>
              <DayNum $dim={dim}>{day}</DayNum>
              {hasBadge && (
                <Tag
                  bgColor={categoryColors[badgeLabel] ?? colors.buttonPurple}
                  label={badgeLabel}
                />
              )}
            </TopRow>
            {showSolveBox && (
              <SolveBox $solved={solved}>
                {solved && (
                  <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
                    <path
                      d="M1.5 5.5L4 8L8.5 2"
                      stroke="#ffffff"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </SolveBox>
            )}
          </Cell>
        );
      })}
    </Row>
  );

  return (
    <Wrapper>
      <Header>
        <MonthLabel>{formatWeekRange(anchorDate)}</MonthLabel>
        <Nav>
          <NavBtn onClick={goPrevWeek}>{'<'}</NavBtn>
          <TodayBtn onClick={goToday}>오늘</TodayBtn>
          <NavBtn $disabled={nextDisabled} onClick={goNextWeek}>
            {'>'}
          </NavBtn>
        </Nav>
      </Header>
      <WeekdayHead>
        {WEEKDAY_LABELS.map((w) => (
          <WeekdayCell key={w}>{w}</WeekdayCell>
        ))}
      </WeekdayHead>
      {renderRow(lastWeek, true)}
      {renderRow(thisWeek, false)}
    </Wrapper>
  );
};

const Wrapper = styled.div``;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const MonthLabel = styled.span`
  color: ${colors.buttonPurple};
  font-weight: 700;
  font-size: 16px;
`;

const Nav = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  color: ${colors.buttonPurple};
`;

const NavBtn = styled.button<{ $disabled?: boolean }>`
  background: none;
  border: none;
  font-size: 16px;
  cursor: ${({ $disabled }) => ($disabled ? 'default' : 'pointer')};
  color: ${({ $disabled }) => ($disabled ? '#c9c9d4' : colors.buttonPurple)};
  pointer-events: ${({ $disabled }) => ($disabled ? 'none' : 'auto')};
`;

const TodayBtn = styled.button`
  background: none;
  border: none;
  color: ${colors.buttonPurple};
  cursor: pointer;
  font-size: 14px;
`;

const WeekdayHead = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  color: #9a9aa8;
  font-size: 12px;
  margin-bottom: 4px;
`;

const WeekdayCell = styled.div``;

const Row = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
`;

const Cell = styled.div<{ $dim: boolean; $selected: boolean; $today: boolean }>`
  position: relative;
  min-height: 84px;
  padding: 8px;
  cursor: pointer;
  border: 1px solid #ececf4;
  /* weekf-007: 오늘 날짜는 아웃라인 + 그라데이션 채움 */
  background: ${({ $dim, $today }) =>
    $today
      ? 'linear-gradient(135deg, #ffc4ad 0%, #b0b0f6 100%)'
      : $dim
        ? '#f4f4fb'
        : '#ffffff'};
  outline: ${({ $today }) =>
    $today ? `2px solid ${colors.buttonPurple}` : 'none'};
  outline-offset: -2px;
  box-shadow: ${({ $selected }) =>
    $selected ? `inset 0 0 0 2px ${colors.borderPurple}` : 'none'};
`;

const DayNum = styled.div<{ $dim: boolean }>`
  font-size: 14px;
  color: ${({ $dim }) => ($dim ? '#b6b6c4' : '#5b5b6b')};
`;

const TopRow = styled.div`
  display: flex;
  align-items: center;
  /* 뱃지를 셀 오른쪽 끝으로 — 월간 캘린더(BadgeSlot 우측 상단 고정)와 통일 */
  justify-content: space-between;
  gap: 12px;
`;

const SolveBox = styled.div<{ $solved?: boolean }>`
  position: absolute;
  right: 6px;
  bottom: 6px;
  width: 14px;
  height: 14px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1.5px solid ${colors.buttonPurple};
  background: ${({ $solved }) => ($solved ? colors.buttonPurple : '#ffffff')};
`;
