import { breakpoints } from "@/constants/breakpoints";
import styled from "@emotion/styled";
import noteIcon from "@/assets/TeamDashboard/note.png";
import { getTeamList } from "@/api/team";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Navigate, useLocation } from "react-router-dom";
import { PATH } from "@/routes/path";

interface InfoRowProps {
  label: string;
  content: React.ReactNode;
}

const InfoRow: React.FC<InfoRowProps> = ({ label, content }) => {
  
  if (label === '팀 아이콘') {
    return (
      <Row>
        <Label>{label}</Label>
        <Content><ImgContent src={String(content)} alt="team icon" /></Content>
      </Row>
    );
  }

  if (label === '주제') {
    return (
      <Row>
        <Label>{label}</Label>
        <Content><TeamSubjectButton>{content}</TeamSubjectButton></Content>
      </Row>
    );
  }

  return (
    <Row>
      <Label>{label}</Label>
      <Content>{content}</Content>
    </Row>
  );
};

const Row = styled.div`
  display: flex;
  margin-bottom: 30px;
  gap: 60px;
`;

const Label = styled.div`
  width: 120px;
  font-weight: bold;
  color: #333;
  font-size: 20px;
`;

const Content = styled.div`
  flex: 1;
  color: #666;
`;

const ImgContent = styled.img`
  width: 140px;
  height: 140px;
  border : 1px solid #C2C5FB;
  border-radius: 20px;
`;

const TeamSubjectButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 28px;
  padding: 2px 20px;
  border: 1px solid #cdcfff;
  border-radius: 34px;
  background: #535353;
  font-size: 16px;
  color: #fff;
  cursor: pointer;
  transition: all 0.2s;
`;

export const TeamInfomation = () => {
  const location = useLocation();
  const { data } = useSuspenseQuery({
    queryKey: ['team-list', 0],
    queryFn: () => getTeamList('recent', 0, 1),
  });

  const { teamId } = location.state;
  console.log('??', teamId);
  if (!teamId) {
    return <Navigate to={PATH.TEAMS} />;
  }
  const teamIdNum = parseInt(teamId);
  const currentTeam = (data?.myTeams ?? []).find(
    (team) => team.teamId === teamIdNum
  );
  if (!currentTeam) {
    // 토스트?
    return <Navigate to={PATH.TEAMS} />;
  }
  return (
    <div>
      <ModeButton>
        <img src={noteIcon} alt="note icon" />
          팀 정보</ModeButton>
          <ContentWrapper>
          <InfoRow label="팀 이름" content={currentTeam.teamName} />
          <InfoRow label="팀 설명" content={currentTeam.teamExplain} />
          <InfoRow label="팀 아이콘" content={currentTeam.imageUrl} />
          <InfoRow label="주제" content={currentTeam.topic} />
          <InfoRow label="인원 제한" content={currentTeam.memberLimit} />
           {/* 임시 데이터 넣어둠 */}
          <InfoRow label="비밀번호" content={"1234"} />
          <ModifyButton>수정하기</ModifyButton>
        </ContentWrapper>
    </div>
  );
}


const ModeButton = styled.button`
  white-space: nowrap;
  box-sizing: border-box;
  display: inline-flex;
  height: 30px;
  justify-content: center;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
  position: relative;

  color: #333;
  font-family: 'Pretendard';
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;

  @media (max-width: ${breakpoints.mobile}px) {
    font-size: 14px;
    padding: 2px 20px;
  }
`;

const ContentWrapper = styled.div`
  border-radius: 20px;
  border: 1px solid #8488EC;
  width: 700px;
  height: 500px;
  padding: 56px 46px;
  margin-top: 40px;
  position: relative;
`;

const ModifyButton = styled.button`
  width: 90px;
  height: 30px;
  background-color: #8488EC;
  color: white;
  border-radius: 20px;
  border: none;
  font-size: 14px;
  position: absolute;
  bottom: 30px;
  right: 60px;
`;