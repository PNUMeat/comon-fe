import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

import { colors } from '@/constants/colors';
import styled from '@emotion/styled';

export const CustomCalendar = () => {
  return (
    <CalendarWrapper>
      <StyledCalendar
        calendarType="gregory"
        formatDay={(_locale: string | undefined, date: Date) =>
          date.getDate().toString()
        }
      />
    </CalendarWrapper>
  );
};

const CalendarWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background-color: #fafafe;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

// TODO:
const StyledCalendar = styled(Calendar)`
  width: 100%;
  max-width: 800px;
  border: none;

  // TODO:
  /* 캘린더 네비게이션 (년도, 월, 버튼) */
  .react-calendar__navigation {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px;
    font-size: 20px;
    font-weight: bold;
    color: #333;
    background-color: #f8f9fa;
    border-bottom: 1px solid #e0e0e0;
    border-radius: 16px 16px 0 0;
    //background-color: pink;
  }

  // TODO:
  .react-calendar__navigation button {
    // background-color: yellow;
    color: #333;
    font-weight: 600;
    //background: none;
    border: none;
    cursor: pointer;
    // font-family: 'Pretendard';
    //font-size: 16px;
  }

  /* 전체 폰트 컬러 */
  .react-calendar__month-view {
    /* padding-bottom: 16px;
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;
    border: 1px solid ${colors.borderPurple}; */

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
  }

  .react-calendar__month-view__days {
    //border-radius: 20px;
    //border: 1px solid ${colors.borderPurple};
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

    /* 이미지 추가 */
    &::before {
      content: '';
      display: block;
      position: absolute;
      top: 32px;
      left: 36px;
      width: 40px;
      height: 40px;
      background-image: url('../src/assets/TeamCalendar/mark.png');
      background-size: cover;
      background-position: center;
    }
  }

  /* 현재 날짜 스타일 */
  .react-calendar__tile--now {
    background-color: rgba(241, 92, 167, 0.2) !important;
    box-sizing: border-box;
  }

  /* 선택된 날짜 스타일 */
  .react-calendar__tile--active {
    background-color: #f8f8ff !important;
    box-sizing: border-box;
  }
`;
