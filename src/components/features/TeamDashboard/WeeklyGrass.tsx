import { Box } from '@/components/commons/Box';

import { DayOfWeek, IWeeklyGrassDay } from '@/api/dashboard';
import { colors } from '@/constants/colors';
import styled from '@emotion/styled';

const ROWS = 4; // 한 요일(열)은 세로 최대 4칸
const DAY_ORDER: DayOfWeek[] = [
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
  'SUNDAY',
];

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
}

export const WeeklyGrass: React.FC<IWeeklyGrassProps> = ({
  weeklyGrass,
  nDays,
}) => {
  const recommended = getRecommendedDayIndexes(nDays);

  // 응답은 항상 월→일 7개지만, 순서를 신뢰하지 않고 요일 기준으로 정렬
  const countByDay = new Map<DayOfWeek, number>(
    weeklyGrass.map((d) => [d.dayOfWeek, d.count])
  );
  const columns = DAY_ORDER.map((day) => countByDay.get(day) ?? 0);

  return (
    <Box width="100%" padding="20px 16px" borderRadius="20px">
      <Grid>
        {columns.map((count, colIndex) => {
          const isRecommended = recommended.has(colIndex);
          const filled = Math.min(count, ROWS); // 4 초과여도 최대 4칸
          return (
            <Column key={colIndex}>
              {Array.from({ length: ROWS }).map((_, rowIndex) => (
                <Cell
                  key={rowIndex}
                  isFilled={rowIndex < filled}
                  isRecommended={isRecommended}
                />
              ))}
            </Column>
          );
        })}
      </Grid>
    </Box>
  );
};

const Grid = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 6px;
  width: 100%;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
`;

const Cell = styled.div<{ isFilled: boolean; isRecommended: boolean }>`
  aspect-ratio: 1 / 1;
  border-radius: 4px;
  background: ${({ isFilled, isRecommended }) =>
    isFilled
      ? colors.grassFilled
      : isRecommended
        ? colors.grassRecommendedBg
        : colors.grassDefaultBg};
`;
