import { ICalendarTag } from '@/api/dashboard.ts';

// 카테고리(주제) 뱃지 색상맵 — 월간/주간 캘린더 공용 단일 소스
export const categoryColors: Record<string, string> = {
  '스터디 복습': '#6E74FA',
  '스터디 예습': '#C2C4FB',
  스터디: '#FFA379',
  '코딩 테스트': '#FF5780',
};

// weekf-005: 해당 날짜의 카테고리(추천 주제). 없으면 undefined — 주간 캘린더 뱃지 노출 여부 판정용.
export const getDateCategory = (
  tags: ICalendarTag[],
  ymd: string
): string | undefined =>
  tags.find((tag) => tag.subjectDate === ymd)?.articleCategory;
