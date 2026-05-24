import { Box } from '@/components/commons/Box';
import { SText } from '@/components/commons/SText';
import { Spacer } from '@/components/commons/Spacer';

import { useEffect, useState } from 'react';
import { RiInformationLine } from 'react-icons/ri';

import { IDashboardResponse } from '@/api/dashboard';
import DefaultProfile from '@/assets/TeamDashboard/default_profile.png';
import { colors } from '@/constants/colors';
import styled from '@emotion/styled';

type ProfileCardData = Pick<
  IDashboardResponse,
  | 'imageUrl'
  | 'memberName'
  | 'nDays'
  | 'description'
  | 'weeklySolvedDays'
  | 'consecutiveSolveCount'
  | 'cumulativeSolveCount'
>;

const TOOLTIP = {
  weekly: '이번 주동안 문제를 푼 날 수 / 추천된 문제 요일 수를 확인할 수 있어요.',
  consecutive:
    '추천 요일을 거르지 않고 이어서 푼 문제 수예요. 추천일에 안 풀면 초기화돼요.',
  cumulative: '코몬에서 지금까지 푼 전체 문제 수예요.',
};

export const ProfileCard: React.FC<{ data: ProfileCardData }> = ({ data }) => {
  const {
    imageUrl,
    memberName,
    nDays,
    description,
    weeklySolvedDays,
    consecutiveSolveCount,
    cumulativeSolveCount,
  } = data;

  // 없거나 로드 실패 시 데모 이미지로 폴백
  const [imgSrc, setImgSrc] = useState(imageUrl || DefaultProfile);
  useEffect(() => {
    setImgSrc(imageUrl || DefaultProfile);
  }, [imageUrl]);

  return (
    <Box width="100%" padding="24px 20px" borderRadius="20px">
      <Column>
        <ProfileImage
          src={imgSrc}
          alt={memberName}
          onError={() => setImgSrc(DefaultProfile)}
          draggable={false}
        />
        <Spacer h={16} />
        <SText fontSize="22px" fontWeight={700} color="#333" textAlign="center">
          {memberName}
        </SText>
        <Spacer h={4} />
        <SText fontSize="26px" fontWeight={800} color="#333" textAlign="center">
          {nDays} DAYS
        </SText>
        <Spacer h={12} />
        <SText
          fontSize="14px"
          fontWeight={400}
          color="#777"
          lineHeight="20px"
          textAlign="center"
        >
          {description}
        </SText>
        <Spacer h={32} />

        <StatItem label="이번 주" tip={TOOLTIP.weekly}>
          <WeekNum>{weeklySolvedDays}</WeekNum>
          <Slash>/</Slash>
          <WeekNum>{nDays}</WeekNum>
        </StatItem>

        <Spacer h={12} />

        <StatItem label="연속 풀이" tip={TOOLTIP.consecutive}>
          <Fire>🔥</Fire>연속 <StatNum>{consecutiveSolveCount}</StatNum>문제 풀이
        </StatItem>

        <Spacer h={12} />

        <StatItem label="누적 풀이" tip={TOOLTIP.cumulative}>
          <Fire>🔥</Fire>누적 <StatNum>{cumulativeSolveCount}</StatNum>문제 풀이
        </StatItem>
      </Column>
    </Box>
  );
};

const InfoTip: React.FC<{ text: string }> = ({ text }) => (
  <TipWrap tabIndex={0} aria-label={text}>
    <RiInformationLine size={14} aria-hidden />
    <Tip role="tooltip">{text}</Tip>
  </TipWrap>
);

// 라벨 + ⓘ툴팁 + 값 박스 한 줄 (이번주/연속/누적 공통 구조)
const StatItem: React.FC<{
  label: string;
  tip: string;
  children: React.ReactNode;
}> = ({ label, tip, children }) => (
  <StatRow>
    <StatLabel>
      <LabelText>{label}</LabelText>
      <InfoTip text={tip} />
    </StatLabel>
    <StatBox>{children}</StatBox>
  </StatRow>
);

const Column = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

// 정중앙 기준 크롭 → object-fit cover + 중앙 정렬
const ProfileImage = styled.img`
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  object-position: center;
  border-radius: 16px;
  display: block;
`;

const StatRow = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
`;

const StatLabel = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 2px;
  font-size: 14px;
  font-weight: 600;
  color: ${colors.buttonPurple};
  margin-bottom: 6px;
`;

// 라벨 텍스트 고정폭 → ⓘ 아이콘이 모든 행에서 같은 x좌표(라벨 바로 옆)에 정렬됨
const LabelText = styled.span`
  display: inline-block;
  width: 54px;
`;

// 세 박스 동일 폭/스타일 → 값 길이가 달라도 라벨/구조는 고정, 값만 바뀜
const StatBox = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
  background: ${colors.grassRecommendedBg};
  border: 1px solid ${colors.borderPurple};
  border-radius: 10px;
  padding: 11px 16px;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  white-space: nowrap;
  letter-spacing: 0.3px;
`;

const Fire = styled.span`
  margin-right: 8px;
`;

// 연속/누적: 숫자 영역 고정폭(우측정렬) → 자릿수가 달라도 숫자가 "문제 풀이"에 붙고 시작점도 일렬 정렬
const StatNum = styled.span`
  display: inline-block;
  min-width: 32px;
  text-align: right;
  font-weight: 700;
  color: ${colors.buttonPurple};
  margin: 0 4px;
`;

// 이번 주: A/B는 고정폭 없이 타이트하게 ("4 / 2")
const WeekNum = styled.span`
  font-weight: 700;
  color: ${colors.buttonPurple};
`;

// "/" 좌우 동일 여백 → 양옆 숫자 간격 대칭
const Slash = styled.span`
  margin: 0 5px;
  color: #333;
  font-weight: 500;
`;

const TipWrap = styled.span`
  position: relative;
  display: inline-flex;
  align-items: center;
  color: #b3b6cc;
  cursor: help;
  outline: none;

  &:hover > div,
  &:focus-within > div {
    opacity: 1;
    visibility: visible;
  }
`;

const Tip = styled.div`
  position: absolute;
  bottom: calc(100% + 6px);
  left: 50%;
  transform: translateX(-50%);
  width: max-content;
  max-width: 180px;
  background: #333;
  color: #fff;
  font-size: 11px;
  font-weight: 400;
  line-height: 1.5;
  text-align: left;
  white-space: normal;
  padding: 6px 10px;
  border-radius: 8px;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.15s ease;
  z-index: 20;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.18);
`;
