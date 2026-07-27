import { useWindowWidth } from '@/hooks/useWindowWidth';

import { useEffect, useRef, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

import { ICalendarTag } from '@/api/dashboard';
import { categoryColors } from '@/components/features/TeamDashboard/weekdayBadge';
import { breakpoints } from '@/constants/breakpoints';
import { colors } from '@/constants/colors';
import styled from '@emotion/styled';

import { Tag } from '../Tag';

interface ICustomCalendarProps {
  tags: ICalendarTag[];
  onDateSelect: (date: string) => void;
  selectedDate: string;
  isPending: boolean;
  // 스터디방 전용 UI (TeamAdmin은 기존 유지): 고정 뱃지 라벨 + 오늘 그라데이션 + 풀이 체크박스
  studyUi?: boolean;
  // 이번 달 풀이 작성 날짜(YYYY-MM-DD) — 멤버 전용, undefined면 체크박스 미표시
  solvedDates?: string[];
}

const formatDate = (date: Date): string =>
  date
    .toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
    .replace(/\s/g, '')
    .replace(/[./]/g, '-')
    .replace(/-$/, '');

const getCategoryForDate = (tags: ICalendarTag[], date: Date) => {
  const formattedDate = formatDate(date);
  return (
    tags.find((tag) => tag.subjectDate === formattedDate)?.articleCategory ||
    null
  );
};

export const CustomCalendar: React.FC<ICustomCalendarProps> = ({
  tags,
  onDateSelect,
  selectedDate,
  isPending = false,
  studyUi = false,
  solvedDates,
}) => {
  const [showPending, setShowPending] = useState(false);
  const apiRef = useRef<{
    onChange: (date: Date, e: React.MouseEvent<HTMLButtonElement>) => void;
  } | null>(null);

  useEffect(() => {
    if (isPending) {
      setShowPending(true);
    } else {
      const timer = setTimeout(() => {
        setShowPending(false);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isPending]);

  const handleTodayClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const today = new Date();
    if (apiRef.current !== null) {
      apiRef.current?.onChange(today, e);
    }
  };

  const width = useWindowWidth();
  const isMobile = width <= breakpoints.mobile;

  return (
    <CalendarWrapper $studyUi={studyUi}>
      {/* 오늘 버튼 */}
      <StyledDate onClick={handleTodayClick}>오늘</StyledDate>

      {showPending && <PendingState>정보를 가져오는 중…</PendingState>}

      <StyledCalendar
        ref={apiRef}
        calendarType="gregory"
        formatDay={(_locale, date) => date.getDate().toString()}
        next2Label={null}
        prev2Label={null}
        tileContent={({ date, view, activeStartDate }) => {
          if (view !== 'month') return null;

          const ymd = formatDate(date);
          const today = formatDate(new Date());
          const category = getCategoryForDate(tags, date);
          // 스터디방: 백엔드 카테고리 문자열 대신 고정 라벨 (오늘=스터디, 그 외=스터디 복습)
          const label = studyUi
            ? ymd === today
              ? '스터디'
              : '스터디 복습'
            : category;
          const isCurrentMonth =
            date.getMonth() === activeStartDate.getMonth() &&
            date.getFullYear() === activeStartDate.getFullYear();
          // 풀이 체크박스: 이번 달 + 오늘 이하 날짜만, 푼 날은 체크·안 푼 날은 빈 박스
          const showSolveBox =
            studyUi && !!solvedDates && isCurrentMonth && ymd <= today;
          const solved = !!solvedDates?.includes(ymd);

          return (
            <>
              {category && label && (
                isMobile ? (
                  <Dot bgColor={categoryColors[label]} />
                ) : studyUi ? (
                  /* 뱃지를 셀 우측 상단에 고정 (SolveBox가 우측 하단인 것과 대칭) */
                  <BadgeSlot>
                    <Tag
                      bgColor={categoryColors[label]}
                      label={label}
                      height="fit-content"
                    />
                  </BadgeSlot>
                ) : (
                  <Tag
                    bgColor={categoryColors[label]}
                    label={label}
                    height="fit-content"
                  />
                )
              )}
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
            </>
          );
        }}
        defaultValue={new Date(selectedDate)}
        onActiveStartDateChange={({ action, view, activeStartDate }) => {
          if (view === 'month' && (action === 'prev' || action === 'next')) {
            if (activeStartDate) {
              const formattedDate = formatDate(activeStartDate);
              onDateSelect(formattedDate);
            }
            return;
          }

          if (action === 'drillDown' && view === 'month') {
            if (activeStartDate) {
              const formattedDate = formatDate(activeStartDate);
              onDateSelect(formattedDate);
            }
          }
        }}
        onChange={(date) => {
          if (date !== null && date instanceof Date) {
            const formattedDate = formatDate(date);
            onDateSelect(formattedDate);
          }
        }}
      />
    </CalendarWrapper>
  );
};

const CalendarWrapper = styled.div<{ $studyUi: boolean }>`
  position: relative;
  /* weekf-007과 동일한 오늘 셀 그라데이션 — studyUi일 때만 StyledCalendar의 --now 배경을 덮음 */
  --tile-now-bg: ${({ $studyUi }) =>
    $studyUi ? 'linear-gradient(135deg, #ffc4ad 0%, #b0b0f6 100%)' : '#fff'};
  /* 오늘이 선택된 상태(기본)여도 studyUi면 오늘 그라데이션 유지 */
  --tile-now-selected-bg: ${({ $studyUi }) =>
    $studyUi
      ? 'linear-gradient(135deg, #ffc4ad 0%, #b0b0f6 100%)'
      : 'linear-gradient(135deg, #ffc3c4 20%, #c1c4ff 100%)'};

  @media (max-width: ${breakpoints.mobile}px) {
    padding: 10px 24px;
  }
`;

const StyledDate = styled.button`
  position: absolute;
  top: 16px;
  right: 20px;
  font-size: 14px;
  font-weight: 600;
  color: ${colors.buttonPurple};
  cursor: pointer;

  @media (max-width: ${breakpoints.mobile}px) {
    font-size: 10px;
    right: 24px;
  }
`;

const PendingState = styled.div`
  position: absolute;
  top: 16px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 14px;
  color: ${colors.buttonPurple};

  @media (max-width: ${breakpoints.mobile}px) {
    font-size: 10px;
    top: 26px;
  }
`;

const StyledCalendar = styled(Calendar)`
  width: 100%;
  max-width: 800px;
  border: none;
  background: transparent;

  /* 캘린더 네비게이션 (연도, 월, 버튼) */
  .react-calendar__navigation {
    margin: 0;
  }

  .react-calendar__navigation button {
    color: ${colors.buttonPurple};
    font-weight: 600;
    border: none;
    font-family: 'Pretendard';
    font-size: 14px;

    &:hover {
      background-color: transparent;
    }

    &:focus {
      background-color: transparent;
    }

    @media (max-width: ${breakpoints.mobile}px) {
      font-size: 10px;
    }
  }

  /* 년/월 상단 네비게이션 칸 크기 줄이기 */
  .react-calendar__navigation__label {
    flex-grow: 0 !important;
  }

  /* 전체 폰트 컬러 */
  .react-calendar__month-view {
    abbr {
      font-family: 'Pretendard';
    }
  }

  /* 요일 헤더 */
  .react-calendar__month-view__weekdays {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    font-weight: 600;
    font-size: 10px;
    color: ${colors.buttonPurple};
    text-align: center;

    abbr {
      text-decoration: none;
    }

    @media (max-width: ${breakpoints.mobile}px) {
      font-size: 8px;
    }
  }

  .react-calendar__month-view__days {
    background-color: #fff;
  }

  .react-calendar__month-view__days__day--neighboringMonth {
    background-color: ${colors.headerPurple};
  }

  /* 날짜 셀 */
  .react-calendar__tile {
    display: flex;
    justify-content: space-between;
    height: 100px;
    border: 1px solid ${colors.borderPurple};
    font-weight: 400;
    color: ${colors.buttonPurple};
    transition: all 0.3s ease-in-out;
    position: relative;

    &:hover {
      background-color: #f0f1ff;
    }

    @media (max-width: ${breakpoints.mobile}px) {
      height: 42px;
      font-size: 10px;
      padding: 2px 6px;
    }
  }

  /* 현재 날짜 스타일 — studyUi면 그라데이션, 아니면 흰색 (CalendarWrapper의 CSS 변수) */
  .react-calendar__tile--now {
    background: var(--tile-now-bg, #fff) !important;
    box-sizing: border-box;
  }

  /* 선택된 날짜 스타일 */
  .react-calendar__tile--active {
    background: linear-gradient(135deg, #ffc3c4 20%, #c1c4ff 100%) !important;
    box-sizing: border-box;
    color: #fff;
  }

  .react-calendar__tile--now.react-calendar__tile--active {
    background: var(--tile-now-selected-bg) !important;
  }
`;

// 뱃지 우측 상단 고정 슬롯 (studyUi 전용)
const BadgeSlot = styled.div`
  position: absolute;
  top: 8px;
  right: 6px;
`;

// 풀이 여부 체크박스 — WeeklyCalendar SolveBox와 동일 스펙 (모바일만 축소)
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

  @media (max-width: ${breakpoints.mobile}px) {
    right: 3px;
    bottom: 3px;
    width: 10px;
    height: 10px;
    border-radius: 3px;
    border-width: 1px;
  }
`;

const Dot = styled.div<{ bgColor: string }>`
  width: 6px;
  height: 6px;
  background-color: ${(props) => props.bgColor};
  margin-top: 5px;
  border-radius: 50%;
`;
