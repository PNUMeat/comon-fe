import { ComonImageInput } from '@/components/commons/Form/ComonImageInput';
import { ComonTextInput } from '@/components/commons/Form/ComonTextInput';
import { ComonTextarea } from '@/components/commons/Form/ComonTextarea';
import { Spacer } from '@/components/commons/Spacer';

import { Fragment, Suspense } from 'react';

import { breakpoints } from '@/constants/breakpoints';
import { TeamSkeleton } from '@/templates/Team/TeamSkeleton';
import styled from '@emotion/styled';

import { TeamMaxPeopleInput } from './segments/TeamMaxPeopleInput';
import { TeamPasswordInput } from './segments/TeamPasswordInput';
import { TeamSubjectRadio } from './segments/TeamSubjectRadio';
import { ITeamInfo } from '@/api/team';

interface ModificationProps {
  currentTeam: ITeamInfo;
}

const SuspenseTeamForm: React.FC<ModificationProps> = ({ currentTeam }) => {

  return (
    <TeamModificationContainer>
      <Row>
        <FormFieldLabel>팀 이름</FormFieldLabel>
        <ComonTextInput
          maxLength={10}
          placeholder={'팀 이름을 입력해주세요'}
          minWidth="400px"
        />
      </Row>
      <Row>
        <FormFieldLabel>팀 설명</FormFieldLabel>
        <ComonTextarea
          maxLength={50}
          placeholder={'우리 팀에 대해 설명해주세요'}
          value={currentTeam.teamExplain}
          minWidth="400px"
        />
      </Row>
      <Row>
        <FormFieldLabel>팀 아이콘</FormFieldLabel>
        <ComonImageInput imageUrl={currentTeam.imageUrl} h={140} padding="0" />
      </Row>
      <Row>
        <FormFieldLabel>주제</FormFieldLabel>
        <TeamSubjectRadio defaultValue={currentTeam.topic} />
      </Row>
      <Row>
        <FormFieldLabel>인원 제한</FormFieldLabel>
        <TeamMaxPeopleInput defaultValue={currentTeam.memberLimit} />
      </Row>
      <Row>
        <FormFieldLabel>입장 비밀번호</FormFieldLabel>
        <TeamPasswordInput />
      </Row>
    </TeamModificationContainer>
  );

  //return <TeamForm h={977} team={modiee} />;
};

const TeamModification: React.FC<ModificationProps> = ({ currentTeam }) => {
  return (
      <Fragment>
        <Suspense fallback={<TeamSkeleton h={977} />}>
          <SuspenseTeamForm currentTeam={currentTeam}/>
        </Suspense>
        <Spacer h={312} />
      </Fragment>
  );
};

const TeamModificationContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 63px 63px 150px 63px 63px 63px;
  width: 100%;
  gap: 10px;
`;

const Row = styled.div`
  display: flex;
  gap: 60px;
`;

const FormFieldLabel = styled.label`
  font-size: 20px;
  width: 120px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  display: block;
  color: #333;

  @media (max-width: ${breakpoints.mobile}px) {
    font-size: 16px;
  }
`;

export default TeamModification;
