import { ComonFormGrid } from '@/components/commons/Form/ComonFormGrid';
import { ComonFormTitle } from '@/components/commons/Form/ComonFormTitle';
import { ComonImageInput } from '@/components/commons/Form/ComonImageInput';
import { ComonTextInput } from '@/components/commons/Form/ComonTextInput';
import { ComonTextarea } from '@/components/commons/Form/ComonTextarea';
import { FormFieldLabel } from '@/components/commons/Form/segments/FormFieldLabel';
import { Spacer } from '@/components/commons/Spacer';
import { HeightInNumber } from '@/components/types';

import { TeamMaxPeopleInput } from '@/templates/Team/TeamMaxPeopleInput';
import { TeamPasswordInput } from '@/templates/Team/TeamPasswordInput';
import { TeamSubjectRadio } from '@/templates/Team/TeamSubjectRadio';
import { TeamSubmitButton } from '@/templates/Team/TeamSubmitButton';
import styled from '@emotion/styled';

const TeamContainer = styled.div<HeightInNumber>`
  height: ${(props) => props.h}px;
  display: flex;
  padding: 66px 87px 77px 87px;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
`;

export const TeamForm: React.FC<
  HeightInNumber & {
    title: string;
    subtitle: string;
  }
> = ({ h, title, subtitle }) => {
  return (
    <TeamContainer h={h}>
      <ComonFormTitle title={title} subtitle={subtitle} />
      <Spacer h={78} />
      <ComonFormGrid h={683}>
        <FormFieldLabel>팀 이름</FormFieldLabel>
        <ComonTextInput maxLength={10} placeholder={'팀이름'} />

        <FormFieldLabel>팀 설명</FormFieldLabel>
        <ComonTextarea maxLength={50} />

        <FormFieldLabel>팀 아이콘</FormFieldLabel>
        <ComonImageInput />

        <FormFieldLabel>주제</FormFieldLabel>
        <TeamSubjectRadio />

        <FormFieldLabel>인원 제한</FormFieldLabel>
        <TeamMaxPeopleInput />

        <FormFieldLabel>입장 비밀번호</FormFieldLabel>
        <TeamPasswordInput />
      </ComonFormGrid>
      <Spacer h={99} />
      <TeamSubmitButton />
    </TeamContainer>
  );
};
