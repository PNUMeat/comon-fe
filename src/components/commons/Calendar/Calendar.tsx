import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

import { colors } from '@/constants/colors';
import styled from '@emotion/styled';

export const CustomCalendar = () => {
  return (
    <CalendarWrapper>
      {/* 오늘 버튼 */}
      <StyledDate>오늘</StyledDate>

      <StyledCalendar
        calendarType="gregory"
        formatDay={(_locale: string | undefined, date: Date) =>
          date.getDate().toString()
        }
        next2Label={null}
        prev2Label={null}
      />
    </CalendarWrapper>
  );
};

const CalendarWrapper = styled.div`
  position: relative;
`;

const StyledDate = styled.div`
  position: absolute;
  top: 16px;
  left: 750px;
  font-size: 14px;
  font-weight: 600;
  color: #777;
  cursor: pointer;
`;

const StyledCalendar = styled(Calendar)`
  width: 100%;
  max-width: 800px;
  border: none;

  /* 캘린더 네비게이션 (연도, 월, 버튼) */
  .react-calendar__navigation {
    margin: 0;
  }

  .react-calendar__navigation button {
    color: #333;
    font-weight: 600;
    border: none;
    font-family: 'Pretendard';
    font-size: 16px;

    &:hover {
      background-color: transparent;
    }

    &:focus {
      background-color: transparent;
    }
  }

  /* 년/월 상단 네비게이션 칸 크기 줄이기 */
  .react-calendar__navigation__label {
    flex-grow: 0 !important;
  }

  /* 전체 폰트 컬러 */
  .react-calendar__month-view {
    border-radius: 20px;
    border: 1px solid ${colors.borderPurple};

    abbr {
      font-family: 'Pretendard';
    }
  }

  /* 요일 헤더 */
  .react-calendar__month-view__weekdays {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    background-color: #f8f8ff;
    font-weight: 600;
    font-size: 12px;
    color: #777;
    text-align: center;
    border-radius: 20px 20px 0 0;
    border: 1px solid ${colors.borderPurple};

    abbr {
      text-decoration: none;
    }
  }

  /* 날짜 셀 */
  .react-calendar__tile {
    display: flex;
    justify-content: end;
    padding: 8px 18px 0 0;
    height: 100px;
    border: 1px solid ${colors.borderPurple};
    font-weight: 600;
    color: ${colors.buttonPurple};
    transition: all 0.3s ease-in-out;
    position: relative;

    &:hover {
      background-color: #f8f8ff;
    }

    &:nth-last-child(-n + 7) {
      border-bottom: none; /* 마지막 줄 셀의 하단 테두리 제거 */
    }

    &:nth-child(7n) {
      border-right: none; /* 오른쪽 가장자리 셀의 테두리 제거 */
    }

    &:nth-child(7n - 6) {
      border-left: none; /* 왼쪽 가장자리 셀의 왼쪽 테두리 제거 */
    }

    /* 이미지 추가 */
    &::before {
      content: '';
      display: block;
      position: absolute;
      top: 32px;
      left: 36px;
      width: 40px;
      height: 40px;
      background-size: cover;
      background-position: center;
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
