import { useEffect, useState } from 'react';

import { IDashboardResponse } from '@/api/dashboard';
import DefaultProfile from '@/assets/TeamDashboard/default-profile-4days.png';
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

interface ProfileCardProps {
  data: ProfileCardData;
  teamName: string;
  topic: string;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  data,
  teamName,
  topic,
}) => {
  const {
    imageUrl,
    memberName,
    nDays,
    description,
    weeklySolvedDays,
    consecutiveSolveCount,
    cumulativeSolveCount,
  } = data;
  const [imgSrc, setImgSrc] = useState(imageUrl || DefaultProfile);

  useEffect(() => {
    setImgSrc(imageUrl || DefaultProfile);
  }, [imageUrl]);

  return (
    <ProfileSection>
      <TeamSummary>
        <TeamLabel>TEAM</TeamLabel>
        <TeamName>{teamName}</TeamName>
        {topic && <Topic>{topic}</Topic>}
      </TeamSummary>

      <Card>
        <ProfileImage
          src={imgSrc}
          alt={memberName}
          onError={() => setImgSrc(DefaultProfile)}
          draggable={false}
        />
        <ProfileInfo>
          <Identity>
            <MemberName>{memberName}</MemberName>
            <Days>{nDays} DAYS</Days>
          </Identity>
          <Description>{description.slice(0, 40)}</Description>
        </ProfileInfo>
        <Stats>
          <StatItem>
            <StatLabel>이번 주</StatLabel>
            <StatValue>
              {weeklySolvedDays}/{nDays}
            </StatValue>
          </StatItem>
          <StatItem>
            <StatLabel>연속 풀이</StatLabel>
            <StatValue>
              <NormalText>🔥 연속 </NormalText>
              <StrongNumber>{consecutiveSolveCount}</StrongNumber>
              <NormalText>풀이</NormalText>
            </StatValue>
          </StatItem>
          <StatItem>
            <StatLabel>누적 풀이</StatLabel>
            <StatValue>
              <NormalText>🔥 누적 </NormalText>
              <StrongNumber>
                {cumulativeSolveCount.toLocaleString()}
              </StrongNumber>
              <NormalText>풀이</NormalText>
            </StatValue>
          </StatItem>
        </Stats>
      </Card>
    </ProfileSection>
  );
};

const ProfileSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  width: 100%;
`;

const TeamSummary = styled.header`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 6px 0;
`;

const TeamLabel = styled.span`
  margin-bottom: -16px;
  color: #333333;
  font-size: 16px;
  font-weight: 600;
`;

const TeamName = styled.h2`
  margin: 0;
  color: #333333;
  font-size: 36px;
  font-weight: 700;
  line-height: normal;
  text-align: center;
  white-space: nowrap;
`;

const Topic = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 120px;
  height: 36px;
  padding: 0 20px;
  border-radius: 68px;
  background: #6e74fa;
  color: #ffffff;
  font-size: 20px;
  font-weight: 600;
  box-sizing: border-box;
`;

const Card = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
  width: 100%;
  padding: 33px 31px;
  overflow: hidden;
  border: 1px solid ${colors.borderPurple};
  border-radius: 20px;
  background: #ffffff;
  box-shadow: 0 6px 20px rgba(48, 49, 67, 0.06);
  box-sizing: border-box;
`;

const ProfileImage = styled.img`
  display: block;
  width: 100%;
  height: 145px;
  object-fit: cover;
  object-position: center;
  border-radius: 8px;
`;

const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  width: 100%;
`;

const Identity = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  color: #333333;
`;

const MemberName = styled.strong`
  font-size: 20px;
  font-weight: 800;
`;

const Days = styled.span`
  font-size: 18px;
  font-weight: 700;
`;

const Description = styled.p`
  width: 100%;
  margin: 0;
  color: #777777;
  font-size: 16px;
  font-weight: 500;
  line-height: 23px;
  letter-spacing: -0.32px;
  white-space: pre-wrap;
`;

const Stats = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
`;

const StatLabel = styled.span`
  color: ${colors.buttonPurple};
  font-size: 16px;
  font-weight: 600;
`;

const StatValue = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 30px;
  padding: 5.5px 14px;
  border: 1px solid ${colors.borderPurple};
  border-radius: 5px;
  background: #f4f4f4;
  color: #777777;
  font-size: 16px;
  font-weight: 500;
  white-space: nowrap;
  box-sizing: border-box;
  gap: 2px;
`;

const NormalText = styled.span`
  color: #777777;
  font-weight: 500;
  margin-right: 2px;
`;

const StrongNumber = styled.strong`
  color: ${colors.buttonPurple};
  font-weight: 700;
`;
