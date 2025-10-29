import { useWindowWidth } from '@/hooks/useWindowWidth';

import { ComonImageInput } from '@/components/commons/Form/ComonImageInput';
import { ComonTextInput } from '@/components/commons/Form/ComonTextInput';
import { ComonTextarea } from '@/components/commons/Form/ComonTextarea';
import { FormFieldLabel } from '@/components/commons/Form/segments/FormFieldLabel';
import { Spacer } from '@/components/commons/Spacer';
import { HeightInNumber } from '@/components/types';

import { Fragment } from 'react';

import { TeamAdminResponse } from '@/api/team.ts';
import { breakpoints } from '@/constants/breakpoints';
import { TeamFormLayout } from '@/templates/Team/TeamFormLayout';
import { TeamMaxPeopleInput } from '@/templates/Team/segments/TeamMaxPeopleInput';
import { TeamPasswordInput } from '@/templates/Team/segments/TeamPasswordInput.tsx';
import { TeamSubjectRadio } from '@/templates/Team/segments/TeamSubjectRadio';

export const TeamForm: React.FC<
  HeightInNumber & {
    teamInfo?: TeamAdminResponse;
  }
> = ({ h, teamInfo }) => {
  const width = useWindowWidth();
  const isMobile = width <= breakpoints.mobile;

  const teamName = teamInfo?.teamName;
  const teamExplain = teamInfo?.teamExplain;
  const topic = teamInfo?.topic;
  const memberLimit = teamInfo?.memberLimit;
  const password = teamInfo?.password;
  const teamIconUrl = teamInfo?.teamIconUrl;

  const MobileComponent = () => (
    <>
      <FormFieldLabel>팀 아이콘</FormFieldLabel>
      <ComonImageInput imageUrl={teamIconUrl} />
      <Spacer h={8} />
      <FormFieldLabel>팀 이름</FormFieldLabel>
      <ComonTextInput
        maxLength={10}
        placeholder={'팀 이름을 입력해주세요'}
        value={teamName}
      />

      <FormFieldLabel>팀 설명</FormFieldLabel>
      <ComonTextarea
        maxLength={50}
        placeholder={'우리 팀에 대해 설명해주세요'}
        value={teamExplain}
      />
    </>
  );

  return (
    <TeamFormLayout h={h} showButton>
      {isMobile ? (
        <MobileComponent />
      ) : (
        <>
          <FormFieldLabel>팀 이름</FormFieldLabel>
          <ComonTextInput
            maxLength={10}
            placeholder={'팀 이름을 입력해주세요'}
            value={teamName}
          />

          <FormFieldLabel>팀 설명</FormFieldLabel>
          <ComonTextarea
            maxLength={50}
            placeholder={'우리 팀에 대해 설명해주세요'}
            value={teamExplain}
          />

          <FormFieldLabel>팀 아이콘</FormFieldLabel>
          <ComonImageInput imageUrl={teamIconUrl} />
        </>
      )}

      <FormFieldLabel>주제</FormFieldLabel>
      <TeamSubjectRadio defaultValue={topic} />

      {isMobile && <Spacer h={8} />}
      <FormFieldLabel>인원 제한</FormFieldLabel>
      <TeamMaxPeopleInput defaultValue={memberLimit} />

      <Fragment>
        {isMobile && <Spacer h={8} />}
        <FormFieldLabel>입장 비밀번호</FormFieldLabel>
        <TeamPasswordInput defaultValue={password} />
      </Fragment>
    </TeamFormLayout>
  );
};
