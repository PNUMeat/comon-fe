import { ComonImageInput } from '@/components/commons/Form/ComonImageInput';
import { ComonTextInput } from '@/components/commons/Form/ComonTextInput';
import { ComonTextarea } from '@/components/commons/Form/ComonTextarea';
import { Spacer } from '@/components/commons/Spacer';

import { Fragment } from 'react';

import { TeamAdminResponse } from '@/api/team';
import { breakpoints } from '@/constants/breakpoints';
import styled from '@emotion/styled';

import { TeamMaxPeopleInput } from './segments/TeamMaxPeopleInput';
import { TeamPasswordInput } from './segments/TeamPasswordInput';
import { TeamSubjectRadio } from './segments/TeamSubjectRadio';
import { css } from '@emotion/react';

interface ModificationProps {
  currentTeam: TeamAdminResponse;
}

const SuspenseTeamForm: React.FC<ModificationProps> = ({ currentTeam }) => {
  const isMobile = window.innerWidth < breakpoints.mobile;
  return (
    <TeamModificationContainer>
      <Row>
        <FormFieldLabel>팀 이름</FormFieldLabel>
        <ComonTextInput
          maxLength={10}
          placeholder={'팀 이름을 입력해주세요'}
          value={currentTeam.teamName}
          minWidth="400px"
          css={MobileInput}
        />
      </Row>
      <Row>
        <FormFieldLabel>팀 설명</FormFieldLabel>
        <ComonTextarea
          maxLength={50}
          placeholder={'우리 팀에 대해 설명해주세요'}
          value={currentTeam.teamExplain}
          minWidth="400px"
          css={MobileInput}
        />
      </Row>
      <Row>
        <FormFieldLabel>팀 아이콘</FormFieldLabel>
        <ComonImageInput
          imageUrl={currentTeam.teamIconUrl}
          h={isMobile? 80 : 140}
          padding="0"
        />
      </Row>
      <Row>
        <FormFieldLabel>주제</FormFieldLabel>
        <TeamSubjectRadio defaultValue={currentTeam.topic} css={MobileRadio} />
      </Row>
      <Row>
        <FormFieldLabel>인원 제한</FormFieldLabel>
        <TeamMaxPeopleInput defaultValue={currentTeam.memberLimit} css={MobileInput}/>
      </Row>
      <Row>
        <FormFieldLabel>입장 비밀번호</FormFieldLabel>
        <TeamPasswordInput defaultValue={currentTeam.password} css={MobileInput}/>
      </Row>
    </TeamModificationContainer>
  );

  //return <TeamForm h={977} team={modiee} />;
};

const TeamModification: React.FC<ModificationProps> = ({ currentTeam }) => {
  return (
    <Fragment>
      {/*<Suspense fallback={<TeamSkeleton h={977} />}>*/}
      <SuspenseTeamForm currentTeam={currentTeam} />
      {/*</Suspense>*/}
      <Spacer h={312} />
    </Fragment>
  );
};

const MobileInput = css`

  @media (max-width: ${breakpoints.mobile}px) {
    border: none;
    padding: 0;
    color: #333;
    font-size: 12px;
    width: 100%;
    height: 20px;
    align-items: flex-start;
    min-width: 200px;
    width: 100%;
    word-break: break-word;
    white-space: pre-wrap;
  }
`;

const MobileRadio = css`

  @media (max-width: ${breakpoints.mobile}px) {
    display: flex;
    gap: 6px;
    width: 72px;
    height: 25px;
    font-size: 10px;
    padding: 0;
  }
`;

const TeamModificationContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 63px 63px 150px 63px 63px 63px;
  width: 100%;
  gap: 10px;

  @media (max-width: ${breakpoints.mobile}px) {
    grid-template-rows: 40px 60px 100px 40px 40px 40px;
  }
`;

const Row = styled.div`
  display: flex;
  gap: 60px;

  @media (max-width: ${breakpoints.mobile}px) {
    gap: 20px;
  }
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
    font-size: 14px;
    width: 80px;
  }
`;



export default TeamModification;
