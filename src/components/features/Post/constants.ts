export const FONT_FAMILY_ENGLISH: [string, string][] = [
  ['Arial', 'Arial'],
  ['Courier New', 'Courier New'],
  ['Times New Roman', 'Times New Roman'],
];

export const FONT_FAMILY_KOREAN: [string, string][] = [
  ['Pretendard', '프리텐다드'],
  ['Nanum Gothic', '나눔고딕'],
  ['Noto Sans KR', '노토 산스'],
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

export const convertToEnglishIfIsKoreanFont = (fontName: string): string => {
  const font = FONT_FAMILY_KOREAN.find(
    ([, koreanName]) => koreanName === fontName
  );
  return font ? font[0] : fontName;
};
