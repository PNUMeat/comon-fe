export const FONT_FAMILY_ENGLISH: [string, string][] = [
  ['Arial', 'Arial'],
  ['Courier New', 'Courier New'],
  ['Georgia', 'Georgia'],
  ['Times New Roman', 'Times New Roman'],
  ['Trebuchet MS', 'Trebuchet MS'],
  ['Verdana', 'Verdana'],
];

export const FONT_FAMILY_KOREAN: [string, string][] = [
  ['Pretendard', '프리텐다드'],
  ['Nanum Gothic', '나눔고딕'],
  ['Nanum Myeongjo', '나눔명조'],
  ['Nanum Pen Script', '나눔펜'],
  ['Noto Sans KR', '노토 산스'],
  ['Noto Serif KR', '노토 세리프'],
  ['Malgun Gothic', '맑은 고딕'],
  ['Gulim', '굴림'],
  ['Dotum', '돋움'],
  ['Batang', '바탕'],
];

export const FONT_FAMILY_OPTIONS: [string, string][] = [
  ...FONT_FAMILY_KOREAN,
  ...FONT_FAMILY_ENGLISH,
];

export const convertToKoreanIfIsKoreanFont = (fontName: string): string => {
  const font = FONT_FAMILY_KOREAN.find(([englishName, koreanName]) => {
    return englishName === fontName && koreanName !== undefined;
  });

  return font ? font[1] : fontName;
};
