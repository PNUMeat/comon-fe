import { Flex } from '@/components/commons/Flex';
import { FormFieldLabel } from '@/components/commons/Form/segments/FormFieldLabel';
import { SimpleLoader } from '@/components/commons/SimpleLoader';
import { HeightInNumber } from '@/components/types';

import { TeamFormLayout } from '@/templates/Team/TeamFormLayout';

export const TeamSkeleton: React.FC<HeightInNumber> = ({ h }) => {
  return (
    <TeamFormLayout h={h}>
      <Flex direction={'column'} gap={'40px'}>
        <FormFieldLabel>팀 이름</FormFieldLabel>
        <FormFieldLabel>팀 설명</FormFieldLabel>
        <FormFieldLabel>팀 아이콘</FormFieldLabel>
        <FormFieldLabel>주제</FormFieldLabel>
        <FormFieldLabel>인원 제한</FormFieldLabel>
        <FormFieldLabel>입장 비밀번호</FormFieldLabel>
      </Flex>
      <SimpleLoader />
    </TeamFormLayout>
  );
};
