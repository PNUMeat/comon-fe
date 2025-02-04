import { useWindowWidth } from '@/hooks/useWindowWidth';

import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

import { ICalendarTag } from '@/api/dashboard';
import { breakpoints } from '@/constants/breakpoints';
import { colors } from '@/constants/colors';
import styled from '@emotion/styled';

import { Tag } from '../Tag';

interface ICustomCalendarProps {
  tags: ICalendarTag[];
  onDateSelect: (date: string) => void;
  selectedDate: string;
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

const categoryColors: Record<string, string> = {
  '스터디 복습': '#6E74FA',
  '스터디 예습': '#C2C4FB',
  스터디: '#FFA379',
  '코딩 테스트': '#FF5780',
};

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
}) => {
  const [activeStartDate, setActiveStartDate] = useState(
    new Date(selectedDate)
  );

  const onChangeDate = (date: Date) => {
    const formattedDate = formatDate(date);
    console.log('???', date, formattedDate);
    onDateSelect(formattedDate);
    setActiveStartDate(date);
  };

  const handleTodayClick = () => {
    const today = new Date();
    const formattedToday = formatDate(today);

    onDateSelect(formattedToday);
    setActiveStartDate(today);
  };

  const width = useWindowWidth();
  const isMobile = width <= breakpoints.mobile;

  return (
    <CalendarWrapper>
      {/* 오늘 버튼 */}
      <StyledDate onClick={handleTodayClick}>오늘</StyledDate>

      <StyledCalendar
        calendarType="gregory"
        formatDay={(_locale, date) => date.getDate().toString()}
        next2Label={null}
        prev2Label={null}
        tileContent={({ date }) => {
          const category = getCategoryForDate(tags, date);
          return category ? (
            isMobile ? (
              <Dot bgColor={categoryColors[category]} />
            ) : (
              <Tag bgColor={categoryColors[category]} label={category} />
            )
          ) : null;
        }}
        onClickDay={(value: Date) => {
          const formattedDate = formatDate(value);
          onDateSelect(formattedDate);
        }}
        onActiveStartDateChange={({ activeStartDate, view }) => {
          if (activeStartDate) {
            if (view === 'month') {
              const formattedDate = formatDate(activeStartDate);
              onDateSelect(formattedDate);
            }
            setActiveStartDate(activeStartDate);
          }
        }}
        onClickMonth={(date) => onChangeDate(date)}
        // onActiveStartDateChange={({ activeStartDate, view }) => {
        //   if (view === 'month' && activeStartDate) {
        //     console.log('tq');
        //     onChangeDate(activeStartDate);
        //     return;
        //   }
        //   // setActiveStartDate(activeStartDate || new Date());
        // }}
        value={new Date(selectedDate)}
        activeStartDate={activeStartDate}
      />
    </CalendarWrapper>
  );
};

const CalendarWrapper = styled.div`
  position: relative;

  @media (max-width: ${breakpoints.mobile}px) {
    padding: 10px 24px;
  }
`;

const StyledDate = styled.div`
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

  /* 현재 날짜 스타일 */
  .react-calendar__tile--now {
    background-color: #fff !important;
    box-sizing: border-box;
  }

  /* 선택된 날짜 스타일 */
  .react-calendar__tile--active {
    background: linear-gradient(135deg, #ffc3c4 20%, #c1c4ff 100%) !important;
    box-sizing: border-box;
    color: #fff;
  }
`;

const Dot = styled.div<{ bgColor: string }>`
  width: 6px;
  height: 6px;
  background-color: ${(props) => props.bgColor};
  margin-top: 5px;
  border-radius: 50%;
`;
