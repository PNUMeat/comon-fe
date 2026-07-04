import { ICalendarTag } from '@/api/dashboard.ts';
import { Tag } from '@/components/commons/Tag';
import { colors } from '@/constants/colors';
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
}

export const WeeklyCalendar = ({
  tags,
  onDateSelect,
  selectedDate,
}: WeeklyCalendarProps) => {
  const [anchor, setAnchor] = useAtom(weekAnchorAtom);
  const today = todayYMD();
  const anchorDate = parseYMD(anchor);

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
        const category = getDateCategory(tags, ymd);
        const isToday = ymd === today;
        const isSelected = ymd === selectedDate;
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
            <DayNum $dim={dim}>{day}</DayNum>
            {category && (
              <BadgeWrap>
                <Tag
                  bgColor={categoryColors[category] ?? colors.buttonPurple}
                  label={category}
                />
              </BadgeWrap>
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
  min-height: 84px;
  padding: 8px;
  cursor: pointer;
  border: 1px solid #ececf4;
  background: ${({ $dim }) => ($dim ? '#f4f4fb' : '#ffffff')};
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

const BadgeWrap = styled.div`
  margin-top: 6px;
`;
