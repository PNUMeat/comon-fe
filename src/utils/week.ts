// 주간 보기(Phase 2) 날짜 유틸 — 외부 라이브러리 없이 native Date 사용(기존 스타일)

// KST 기준 오늘 (selectedDateAtom과 동일 방식)
export const todayYMD = (): string =>
  new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Seoul' });

export const toYMD = (d: Date): string =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
    d.getDate()
  ).padStart(2, '0')}`;

export const parseYMD = (s: string): Date => {
  const [y, m, day] = s.split('-').map(Number);
  return new Date(y, m - 1, day);
};

export const addDays = (d: Date, n: number): Date => {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
};

// 월요일 시작(월~일)
export const getMonday = (d: Date): Date => {
  const day = d.getDay(); // 0(일)~6(토)
  const diff = day === 0 ? -6 : 1 - day;
  return addDays(d, diff);
};

// anchor가 속한 주(월~일) 7일의 YMD 배열
export const getWeekDates = (anchor: Date): string[] => {
  const monday = getMonday(anchor);
  return Array.from({ length: 7 }, (_, i) => toYMD(addDays(monday, i)));
};

// 해당 주의 월요일이 오늘이 속한 주의 월요일보다 미래면 true
export const isFutureWeek = (monday: Date, today: Date): boolean =>
  monday.getTime() > getMonday(today).getTime();

// weekf-003: 주간 헤더 서식 20XX. XX. XX. ~ XX. XX. (월이 바뀌는 주 대응)
export const formatWeekRange = (anchor: Date): string => {
  const monday = getMonday(anchor);
  const sunday = addDays(monday, 6);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${monday.getFullYear()}. ${pad(monday.getMonth() + 1)}. ${pad(
    monday.getDate()
  )}. ~ ${pad(sunday.getMonth() + 1)}. ${pad(sunday.getDate())}.`;
};
