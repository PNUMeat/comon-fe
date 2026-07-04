import { IRecommendationProblem } from '@/api/dashboard.ts';
import { colors } from '@/constants/colors';
import { useRecommendations } from '@/hooks/useRecommendations';
import { todayYMD } from '@/utils/week';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';

// weekf-008/010 워딩 (QA 확정)
const HEADING_TODAY = '오늘의 추천 문제';
const HEADING_PAST = '지난 추천 문제';
const HEADING_EMPTY = '오늘은 추천 문제가 없어요. 개인적으로 문제를 풀어보세요.';
const REGISTER_LABEL = '문제 풀기';

interface TodayProblemSectionProps {
  teamId?: string;
  selectedDate: string;
  isMyTeam: boolean;
}

export const TodayProblemSection = ({
  teamId,
  selectedDate,
  isMyTeam,
}: TodayProblemSectionProps) => {
  const navigate = useNavigate();
  const isToday = selectedDate === todayYMD();

  // 추천 API는 멤버 전용 → isMyTeam일 때만 호출
  const { recommendations } = useRecommendations({
    teamId,
    date: selectedDate,
    enabled: isMyTeam,
  });

  const hasRec = recommendations.length > 0;
  const heading = !hasRec
    ? HEADING_EMPTY
    : isToday
      ? HEADING_TODAY
      : HEADING_PAST;

  const openProblem = (problem: IRecommendationProblem) =>
    window.open(problem.url, '_blank');

  const goPosting = () =>
    navigate(`/posting/${teamId}`, {
      state: { article: null, articleId: null, articleTitle: null },
    });

  return (
    <Section>
      <Heading $muted={!hasRec}>{heading}</Heading>
      <Body>
        {hasRec && (
          <Cards>
            {recommendations.map((problem) => (
              <Card key={problem.step} onClick={() => openProblem(problem)}>
                <Step>[{problem.step}]</Step>
                <Title>{problem.title}</Title>
              </Card>
            ))}
          </Cards>
        )}
        {/* weekf-010: 오늘 날짜일 때만 노출 */}
        {isToday && (
          <RegisterButton onClick={goPosting}>{REGISTER_LABEL}</RegisterButton>
        )}
      </Body>
    </Section>
  );
};

const Section = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: 20px 24px;
  margin-bottom: 24px;
`;

const Heading = styled.div<{ $muted: boolean }>`
  font-weight: 700;
  font-size: 16px;
  margin-bottom: 16px;
  color: ${({ $muted }) => ($muted ? '#9a9aa8' : '#3a3a46')};
`;

const Body = styled.div`
  display: flex;
  align-items: stretch;
  gap: 16px;
  justify-content: space-between;
  flex-wrap: wrap;
`;

const Cards = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  flex: 1;
  min-width: 0;
`;

const Card = styled.button`
  text-align: left;
  border: 1px solid #ececf4;
  border-radius: 12px;
  padding: 14px;
  background: #ffffff;
  cursor: pointer;
`;

const Step = styled.div`
  font-size: 12px;
  color: #9a9aa8;
  margin-bottom: 6px;
`;

const Title = styled.div`
  font-size: 14px;
  color: #3a3a46;
`;

const RegisterButton = styled.button`
  border: none;
  border-radius: 14px;
  padding: 0 24px;
  min-width: 140px;
  height: 56px;
  color: #ffffff;
  cursor: pointer;
  font-weight: 700;
  background: linear-gradient(90deg, ${colors.buttonPurple}, ${colors.buttonPink});
`;
