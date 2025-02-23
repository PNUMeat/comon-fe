import { Flex } from '@/components/commons/Flex';
import { SText } from '@/components/commons/SText';

import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import {
  TeamAdminResponse,
  deleteTeam,
  getTeamInfoAdmin,
  modifyTeam,
} from '@/api/team';
import noteIcon from '@/assets/TeamDashboard/note.png';
import { breakpoints } from '@/constants/breakpoints';
import { PATH } from '@/routes/path';
import {
  formTextInputAtom,
  formTextareaAtom,
  imageAtom,
  teamMaxNumAtom,
  teamPasswordAtom,
  teamSubjectAtom,
} from '@/store/form';
import styled from '@emotion/styled';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAtom } from 'jotai';

import TeamModification from './TeamModification';

interface InfoRowProps {
  label: string;
  content: React.ReactNode;
}

const InfoRow: React.FC<InfoRowProps> = ({ label, content }) => {
  if (label === '팀 아이콘') {
    return (
      <Row>
        <Label>{label}</Label>
        <Content>
          <ImgContent src={String(content)} alt="team icon" />
        </Content>
      </Row>
    );
  }

  if (label === '주제') {
    return (
      <Row>
        <Label>{label}</Label>
        <Content>
          <TeamSubjectButton>{content}</TeamSubjectButton>
        </Content>
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
  white-space: nowrap;
`;

const Content = styled.div`
  flex: 1;
  color: #666;
`;

const ImgContent = styled.img`
  width: 140px;
  height: 140px;
  border: 1px solid #c2c5fb;
  border-radius: 20px;
  box-sizing: border-box;
  padding: 10px;
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

interface InformationProps {
  currentTeam: TeamAdminResponse;
}

const Information: React.FC<InformationProps> = ({ currentTeam }) => (
  <InfoGrid>
    <InfoRow label="팀 이름" content={currentTeam.teamName} />
    <InfoRow label="팀 설명" content={currentTeam.teamExplain} />
    <InfoRow label="팀 아이콘" content={currentTeam.teamIconUrl} />
    <InfoRow label="주제" content={currentTeam.topic} />
    <InfoRow label="인원 제한" content={currentTeam.memberLimit} />
    <InfoRow label="입장 비밀번호" content={currentTeam.password} />
  </InfoGrid>
);

export const TeamInformation = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [teamName] = useAtom(formTextInputAtom);
  const [teamExplain] = useAtom(formTextareaAtom);
  const [topic] = useAtom(teamSubjectAtom);
  const [memberLimit] = useAtom(teamMaxNumAtom);
  const [password] = useAtom(teamPasswordAtom);
  const [image] = useAtom(imageAtom);
  const [isDirty, setIsDirty] = useState(false);
  const { teamId } = useParams();
  const navigate = useNavigate();

  console.log('????', teamId);

  const { data: currentTeam } = useQuery({
    queryKey: ['team-list', 0],
    queryFn: () => getTeamInfoAdmin(teamId as string),
    enabled: !!teamId,
  });
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!currentTeam) {
      return;
    }

    const name = teamName.length === 0 ? currentTeam.teamName : teamName;
    const exp =
      teamExplain.length === 0 ? currentTeam.teamExplain : teamExplain;
    const top = topic ?? currentTeam.topic;
    const mem = memberLimit ?? currentTeam.memberLimit;
    const pas = password ?? currentTeam.password;

    const curr = `${currentTeam.teamName}-${currentTeam.teamExplain}-null-${currentTeam.topic}-${currentTeam.memberLimit}-${currentTeam.password}`;
    const changed = `${name}-${exp}-${image?.lastModified ?? null}-${top}-${mem}-${pas}`;

    setIsDirty(curr !== changed);
  }, [teamName, teamExplain, topic, memberLimit, image, password, currentTeam]);

  const handleDeleteTeam = () => {
    const isConfirmed = confirm('팀을 정말 삭제하시겠습니까?');
    if (isConfirmed && teamId) {
      deleteTeam(teamId)
        .then((res) => {
          alert(res.message);
          navigate(PATH.TEAMS);
        })
        .catch((res) => alert(res.message));
    }
  };

  const handleModifyTeam = () => {
    if (!currentTeam) return;

    if (isDirty && teamId) {
      const vMemberLimit = memberLimit ?? currentTeam.memberLimit;

      modifyTeam({
        teamId: parseInt(teamId),
        teamName: teamName.length === 0 ? currentTeam.teamName : teamName,
        teamExplain:
          teamExplain.length === 0 ? currentTeam.teamExplain : teamExplain,
        topic: topic ?? currentTeam.topic,
        image: image,
        memberLimit:
          typeof vMemberLimit === 'number'
            ? vMemberLimit
            : parseInt(vMemberLimit),
        password:
          currentTeam.password === password || password.trim().length === 0
            ? null
            : password,
      })
        .then(() => {
          queryClient
            .refetchQueries({ queryKey: ['team-list', 0] })
            .then(() => {
              alert('팀 수정 성공');
              setIsDirty(false);
              setIsEditMode(false);
            });
        })
        .catch(() => {
          alert('팀 수정 요청 실패: 필드를 다시 입력해주세요');
        });
    }
  };

  return (
    <TeamInfoGrid>
      <ModeButton>
        <img src={noteIcon} alt="note icon" />팀 정보
      </ModeButton>
      <ContentWrapper>
        {isEditMode && currentTeam && (
          <TeamModification currentTeam={currentTeam} />
        )}
        {!isEditMode && currentTeam && (
          <Information currentTeam={currentTeam} />
        )}
        <ModifyButton
          onClick={isEditMode ? handleModifyTeam : () => setIsEditMode(true)}
        >
          {isEditMode ? '저장하기' : '수정하기'}
        </ModifyButton>
      </ContentWrapper>
      <Flex justify="flex-end" padding="0px 14px">
        <SText
          color={'#777'}
          fontFamily={'Pretendard'}
          fontSize={'14px'}
          fontWeight={500}
          cursor="pointer"
          onClick={handleDeleteTeam}
        >
          팀 삭제하기 {'>'}
        </SText>
      </Flex>
    </TeamInfoGrid>
  );
};

const TeamInfoGrid = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr;
  gap: 31px;
  margin-bottom: 60px;
  justify-items: start;

  @media (max-width: ${breakpoints.mobile}px) {
    grid-template-columns: 1fr;
  }
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 63px 63px 150px 63px 63px 63px;
  gap: 10px;
  width: 100%;
`;

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
  border: 1px solid #8488ec;
  width: 100%;
  min-width: 390px;
  height: 600px;
  padding: 56px 46px;
  position: relative;
  box-sizing: border-box;
  background-color: #fff;

  @media (max-width: ${breakpoints.mobile}px) {
    padding: 40px 20px;
  }
`;

const ModifyButton = styled.button`
  width: 90px;
  height: 30px;
  background-color: #8488ec;
  color: white;
  border-radius: 20px;
  border: none;
  font-size: 14px;
  position: absolute;
  bottom: 30px;
  right: 60px;

  @media (max-width: ${breakpoints.mobile}px) {
    width: 60px;
    height: 20px;
    font-size: 12px;
    bottom: 20px;
    right: 40px;
  }
`;
