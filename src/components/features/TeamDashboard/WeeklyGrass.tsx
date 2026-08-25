import { useEffect, useMemo, useRef, useState } from 'react';
import ReactDOM from 'react-dom';

import { DayOfWeek, IWeeklyGrassDay, getSolvedDates } from '@/api/dashboard';
import CloseIcon from '@/assets/TeamDashboard/close-grass.svg';
import MaximizeIcon from '@/assets/TeamDashboard/maximize.svg';
import { colors } from '@/constants/colors';
import styled from '@emotion/styled';
import { useQueries } from '@tanstack/react-query';

const DEFAULT_ROWS = 5;
const MONTH_RANGE_START = -10;
const MONTH_RANGE_END = 1;
const CURRENT_MONTH_INDEX = Math.abs(MONTH_RANGE_START);
const DAY_ORDER: DayOfWeek[] = [
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
  'SUNDAY',
];
const DAY_LABELS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

const getMonthGridCellCount = (year: number, month: number): number => {
  const firstWeekday = new Date(year, month - 1, 1).getDay();
  const mondayBasedOffset = (firstWeekday + 6) % 7;
  const daysInMonth = new Date(year, month, 0).getDate();
  return Math.ceil((mondayBasedOffset + daysInMonth) / DAY_ORDER.length) * 7;
};

// 추천 요일(강조) index 집합 — 좌→우 월(0)~일(6) 기준
const getRecommendedDayIndexes = (nDays: number): Set<number> => {
  switch (nDays) {
    case 2:
      return new Set([1, 3]); // 화·목
    case 4:
      return new Set([0, 1, 2, 3]); // 월~목
    case 6:
      return new Set([0, 1, 2, 3, 4, 5]); // 일 제외 전부
    default:
      return new Set<number>();
  }
};

interface IWeeklyGrassProps {
  weeklyGrass: IWeeklyGrassDay[];
  nDays: number;
  teamId?: string;
}

export const WeeklyGrass: React.FC<IWeeklyGrassProps> = ({
  weeklyGrass,
  nDays,
  teamId,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const expandedCardRef = useRef<HTMLDivElement>(null);
  const currentMonthRef = useRef<HTMLElement>(null);
  const recommended = getRecommendedDayIndexes(nDays);
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const mondayBasedOffset = (firstDay + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const currentMonthCellCount = getMonthGridCellCount(year, month + 1);

  // 응답은 항상 월→일 7개지만, 순서를 신뢰하지 않고 요일 기준으로 정렬
  const countByDay = new Map<DayOfWeek, number>(
    weeklyGrass.map((d) => [d.dayOfWeek, d.count])
  );
  const columns = DAY_ORDER.map((day) => countByDay.get(day) ?? 0);
  const recentMonths = useMemo(
    () =>
      Array.from(
        { length: MONTH_RANGE_END - MONTH_RANGE_START + 1 },
        (_, index) => {
          const offset = MONTH_RANGE_START + index;
          const date = new Date(year, month + offset, 1);
          return { year: date.getFullYear(), month: date.getMonth() + 1 };
        }
      ),
    [month, year]
  );
  const solvedDateQueries = useQueries({
    queries: recentMonths.map((item) => ({
      queryKey: ['solved-dates', teamId, item.year, item.month],
      queryFn: () => getSolvedDates(Number(teamId), item.year, item.month),
      enabled: isExpanded && !!teamId,
    })),
  });
  const solvedDates = new Set(
    solvedDateQueries.flatMap((query) => query.data ?? [])
  );
  const timelineDays = useMemo(() => {
    const firstMonth = recentMonths[0];
    const lastMonth = recentMonths[recentMonths.length - 1];
    if (!firstMonth || !lastMonth) return [];

    const cursor = new Date(firstMonth.year, firstMonth.month - 1, 1);
    const end = new Date(lastMonth.year, lastMonth.month, 0);
    const days = [];

    while (cursor <= end) {
      const itemYear = cursor.getFullYear();
      const itemMonth = cursor.getMonth() + 1;
      const day = cursor.getDate();
      days.push({
        year: itemYear,
        month: itemMonth,
        day,
        weekdayIndex: (cursor.getDay() + 6) % 7,
        ymd: `${itemYear}-${String(itemMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
      });
      cursor.setDate(cursor.getDate() + 1);
    }

    return days;
  }, [recentMonths]);
  const monthMarkers = timelineDays
    .map((day, index) => ({ day, index }))
    .filter(({ day }) => day.day === 1);

  useEffect(() => {
    if (!isExpanded) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsExpanded(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    const scrollFrame = window.requestAnimationFrame(() => {
      if (expandedCardRef.current && currentMonthRef.current) {
        const monthTwoPositionsBefore =
          currentMonthRef.current.previousElementSibling
            ?.previousElementSibling;
        expandedCardRef.current.scrollTop = Math.max(
          0,
          monthTwoPositionsBefore instanceof HTMLElement
            ? monthTwoPositionsBefore.offsetTop
            : currentMonthRef.current.offsetTop
        );
      }
    });

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', closeOnEscape);
      window.cancelAnimationFrame(scrollFrame);
    };
  }, [isExpanded]);

  return (
    <Card>
      <Month>{month + 1}월</Month>
      <IconButton
        type="button"
        aria-label="잔디 기록 펼쳐 보기"
        onClick={() => setIsExpanded(true)}
      >
        <Maximize src={MaximizeIcon} alt="" aria-hidden />
      </IconButton>

      <GrassArea>
        <Weekdays>
          {DAY_LABELS.map((label, index) => (
            <Weekday key={label} $dayIndex={index}>
              {label}
            </Weekday>
          ))}
        </Weekdays>

        <Grid>
          {Array.from({ length: currentMonthCellCount }).map((_, index) => {
            const colIndex = index % DAY_ORDER.length;
            const rowIndex = Math.floor(index / DAY_ORDER.length);
            const dayOfMonth = index - mondayBasedOffset + 1;
            const isInMonth = dayOfMonth >= 1 && dayOfMonth <= daysInMonth;
            const validCellsBefore = Array.from({ length: rowIndex }).filter(
              (_, previousRow) => {
                const previousDay =
                  previousRow * DAY_ORDER.length +
                  colIndex -
                  mondayBasedOffset +
                  1;
                return previousDay >= 1 && previousDay <= daysInMonth;
              }
            ).length;
            const isFilled =
              isInMonth &&
              validCellsBefore < Math.min(columns[colIndex], DEFAULT_ROWS);

            return (
              <Cell
                key={index}
                $inMonth={isInMonth}
                $filled={isFilled}
                $recommended={isInMonth && recommended.has(colIndex)}
              />
            );
          })}
        </Grid>
      </GrassArea>

      {isExpanded &&
        ReactDOM.createPortal(
          <Overlay onMouseDown={() => setIsExpanded(false)}>
            <ExpandedCard
              ref={expandedCardRef}
              role="dialog"
              aria-modal="true"
              aria-label="1년간 잔디 기록"
              onMouseDown={(event) => event.stopPropagation()}
            >
              <StickyHeader>
                <CloseButton
                  type="button"
                  aria-label="잔디 기록 닫기"
                  onClick={() => setIsExpanded(false)}
                >
                  <CloseImage src={CloseIcon} alt="" aria-hidden />
                </CloseButton>
              </StickyHeader>

              <Timeline>
                <MonthLabels aria-hidden>
                  {monthMarkers.map(({ day, index }, markerIndex) => (
                    <ExpandedMonthLabel
                      key={`${day.year}-${day.month}`}
                      ref={
                        markerIndex === CURRENT_MONTH_INDEX
                          ? currentMonthRef
                          : null
                      }
                      $top={Math.floor(index / DAY_ORDER.length) * 35 + 8}
                    >
                      {day.month}월
                    </ExpandedMonthLabel>
                  ))}
                </MonthLabels>
                <ExpandedGrid>
                  {timelineDays.map((day) => (
                    <Cell
                      key={day.ymd}
                      $inMonth
                      $filled={solvedDates.has(day.ymd)}
                      $recommended={recommended.has(day.weekdayIndex)}
                    />
                  ))}
                </ExpandedGrid>
              </Timeline>
            </ExpandedCard>
          </Overlay>,
          document.body
        )}
    </Card>
  );
};

const Card = styled.div`
  position: relative;
  width: 100%;
  min-height: 319px;
  padding: 27px 33px 31px;
  box-sizing: border-box;
  overflow: hidden;
  border: 1px solid ${colors.borderPurple};
  border-radius: 15px;
  background: #ffffff;
`;

const Month = styled.h3`
  margin: 0;
  color: #333333;
  font-size: 16px;
  font-weight: 600;
  line-height: normal;
  text-align: center;
`;

const IconButton = styled.button`
  position: absolute;
  top: 16px;
  right: 17px;
  width: 24px;
  height: 24px;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
`;

const Maximize = styled.img`
  display: block;
  width: 24px;
  height: 24px;
`;

const GrassArea = styled.div`
  margin-top: 11px;
`;

const Weekdays = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  width: 100%;
`;

const Weekday = styled.span<{ $dayIndex: number }>`
  color: ${({ $dayIndex }) =>
    $dayIndex === 5 ? '#6e74fa' : $dayIndex === 6 ? '#ff5780' : '#464646'};
  font-family: Inter, Pretendard, sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 15px;
  text-align: center;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 1px;
  width: 100%;
  margin-top: 6px;
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: rgba(215, 215, 215, 0.5);
  box-sizing: border-box;
`;

const ExpandedCard = styled.div`
  position: relative;
  width: 350px;
  height: min(758px, calc(100vh - 32px));
  overflow-y: auto;
  border: 1px solid ${colors.borderPurple};
  border-radius: 15px;
  background: #ffffff;
  box-sizing: border-box;
`;

const StickyHeader = styled.div`
  position: sticky;
  top: 0;
  z-index: 2;
  height: 60px;
  background: #ffffff;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  padding: 0;
  border: 0;
  border-radius: 4px;
  background: #ffffff;
  cursor: pointer;
`;

const CloseImage = styled.img`
  display: block;
  width: 16px;
  height: 16px;
`;

const Timeline = styled.div`
  position: relative;
  padding: 0 30px 37px 75px;
`;

const MonthLabels = styled.div`
  position: absolute;
  inset: 0 auto 0 0;
  width: 75px;
`;

const ExpandedMonthLabel = styled.span<{ $top: number }>`
  position: absolute;
  top: ${({ $top }) => $top}px;
  left: 27px;
  margin: 0;
  color: #333333;
  font-size: 16px;
  font-weight: 600;
  line-height: normal;
`;

const ExpandedGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 34px);
  gap: 1px;
  width: 244px;
`;

const Cell = styled.div<{
  $inMonth: boolean;
  $filled: boolean;
  $recommended: boolean;
}>`
  aspect-ratio: 1 / 1;
  min-width: 0;
  border: 1px solid
    ${({ $inMonth }) =>
      $inMonth ? colors.borderPurple : 'rgba(205, 207, 255, 0.25)'};
  border-radius: 10px;
  box-sizing: border-box;
  background: ${({ $filled, $recommended, $inMonth }) =>
    !$inMonth
      ? '#ffffff'
      : $filled
        ? '#6e74fa'
        : $recommended
          ? colors.grassRecommendedBg
          : '#ffffff'};
`;
