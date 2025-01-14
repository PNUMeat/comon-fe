import { useWindowWidth } from '@/hooks/useWindowWidth';

import { ComonImageInput } from '@/components/commons/Form/ComonImageInput';
import { ComonTextInput } from '@/components/commons/Form/ComonTextInput';
import { ComonTextarea } from '@/components/commons/Form/ComonTextarea';
import { FormFieldLabel } from '@/components/commons/Form/segments/FormFieldLabel';
import { Spacer } from '@/components/commons/Spacer';
import { HeightInNumber } from '@/components/types';

import { ITeamInfo } from '@/api/team.ts';
import { breakpoints } from '@/constants/breakpoints';
import { TeamFormLayout } from '@/templates/Team/TeamFormLayout';
import { TeamMaxPeopleInput } from '@/templates/Team/segments/TeamMaxPeopleInput';
// import { TeamPasswordInput } from '@/templates/Team/segments/TeamPasswordInput';
import { TeamSubjectRadio } from '@/templates/Team/segments/TeamSubjectRadio';

export const TeamForm: React.FC<
  HeightInNumber & {
    team?: ITeamInfo;
  }
> = ({ h, team }) => {
  const width = useWindowWidth();
  const isMobile = width <= breakpoints.mobile;

  const MobileComponent = () => (
    <>
      <FormFieldLabel>팀 아이콘</FormFieldLabel>
      <ComonImageInput imageUrl={team?.imageUrl} />
      <Spacer h={8} />
      <FormFieldLabel>팀 이름</FormFieldLabel>
      <ComonTextInput
        maxLength={10}
        placeholder={'팀 이름을 입력해주세요'}
        value={team?.teamName}
      />

      <FormFieldLabel>팀 설명</FormFieldLabel>
      <ComonTextarea
        maxLength={50}
        placeholder={'우리 팀에 대해 설명해주세요'}
        value={team?.teamExplain}
      />
    </>
  );

  return (
    <TeamFormLayout h={h}>
      {isMobile ? (
        <MobileComponent />
      ) : (
        <>
          <FormFieldLabel>팀 이름</FormFieldLabel>
          <ComonTextInput
            maxLength={10}
            placeholder={'팀 이름을 입력해주세요'}
            value={team?.teamName}
          />

          <FormFieldLabel>팀 설명</FormFieldLabel>
          <ComonTextarea
            maxLength={50}
            placeholder={'우리 팀에 대해 설명해주세요'}
            value={team?.teamExplain}
          />

          <FormFieldLabel>팀 아이콘</FormFieldLabel>
          <ComonImageInput imageUrl={team?.imageUrl} />
        </>
      )}

      <FormFieldLabel>주제</FormFieldLabel>
      <TeamSubjectRadio defaultValue={team?.topic} />

      {isMobile && <Spacer h={8} />}
      <FormFieldLabel>인원 제한</FormFieldLabel>
      <TeamMaxPeopleInput defaultValue={team?.memberLimit} />

      {/*{isMobile && <Spacer h={8} />}*/}
      {/*<FormFieldLabel>입장 비밀번호</FormFieldLabel>*/}
      {/*<TeamPasswordInput />*/}
    </TeamFormLayout>
  );
};
