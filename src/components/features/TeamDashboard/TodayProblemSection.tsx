import { todayYMD } from '@/utils/week';

import { useRecommendations } from '@/hooks/useRecommendations';

import { useNavigate } from 'react-router-dom';

import { IRecommendationProblem } from '@/api/dashboard.ts';
import EditAltIcon from '@/assets/TeamDashboard/edit-alt.svg';
import { breakpoints } from '@/constants/breakpoints';
import styled from '@emotion/styled';

// weekf-008/010 워딩 (QA 확정)
const HEADING_TODAY = '오늘의 문제 풀기';
const HEADING_PAST = '지난 추천 문제';
const HEADING_EMPTY =
  '오늘은 추천 문제가 없어요. 개인적으로 문제를 풀어보세요.';
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
  const heading = isToday ? HEADING_TODAY : HEADING_PAST;

  const openProblem = (problem: IRecommendationProblem) =>
    window.open(problem.url, '_blank');

  const goPosting = () =>
    navigate(`/posting/${teamId}`, {
      state: { article: null, articleId: null, articleTitle: null },
    });

  // weekf-010: 문제 풀기 버튼은 오늘 날짜일 때만 노출
  const registerButton = isToday && (
    <RegisterButton onClick={goPosting}>
      <PencilImage src={EditAltIcon} alt="" aria-hidden />
      {REGISTER_LABEL}
    </RegisterButton>
  );

  return (
    <Section>
      {hasRec ? (
        <>
          <Heading>{heading}</Heading>
          <Body>
            <Cards>
              {recommendations.map((problem) => (
                <Card key={problem.step} onClick={() => openProblem(problem)}>
                  <Step>[{problem.step}]</Step>
                  <Title>{problem.title}</Title>
                </Card>
              ))}
            </Cards>
            {registerButton}
          </Body>
        </>
      ) : (
        // 추천이 없으면 안내 문구 오른쪽에 버튼 배치
        <EmptyRow>
          <EmptyText>{HEADING_EMPTY}</EmptyText>
          {registerButton}
        </EmptyRow>
      )}
    </Section>
  );
};

const Section = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
  background: #ffffff;
  border-radius: 16px;
  padding: 25px 31px;
  margin-bottom: 24px;
`;

const Heading = styled.div`
  font-weight: 700;
  font-size: 18px;
  color: #000000;
  text-align: center;
`;

const EmptyRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
`;

const EmptyText = styled.div`
  font-weight: 700;
  font-size: 16px;
  color: #9a9aa8;
`;

const Body = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  width: 100%;
  flex-wrap: nowrap;

  @media (max-width: ${breakpoints.mobile}px) {
    flex-wrap: wrap;
  }
`;

const Cards = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  gap: 12px;
  min-width: 0;
  flex-wrap: nowrap;

  @media (max-width: ${breakpoints.mobile}px) {
    flex-basis: 100%;
    flex-wrap: wrap;
  }
`;

const Card = styled.button`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex: 1 1 0;
  width: auto;
  min-width: 0;
  max-width: 140px;
  height: 68px;
  text-align: left;
  padding: 13px 14px;
  overflow: hidden;
  border: 0.655px solid #cdcfff;
  border-radius: 6.548px;
  background: #ffffff;
  box-shadow: 0 3.929px 13.096px rgba(48, 49, 67, 0.06);
  cursor: pointer;
  box-sizing: border-box;
`;

const Step = styled.div`
  font-size: 12px;
  font-weight: 700;
  line-height: 1.5;
  color: #333333;
`;

const Title = styled.div`
  font-size: 12px;
  font-weight: 500;
  line-height: 1.5;
  color: #333333;
  text-decoration: underline;
  text-underline-position: from-font;
`;

const RegisterButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  width: 140px;
  min-width: 140px;
  height: 51px;
  padding: 0;
  overflow: hidden;
  border: 0.655px solid #cdcfff;
  border-radius: 14px;
  color: #ffffff;
  cursor: pointer;
  font-size: 14px;
  font-weight: 700;
  background: linear-gradient(110.87deg, #fe82db 6.0976%, #68e4ff 103.66%);
  box-shadow: 0 3.929px 13.096px rgba(48, 49, 67, 0.06);
`;

const PencilImage = styled.img`
  display: block;
  width: 24px;
  height: 24px;
`;
