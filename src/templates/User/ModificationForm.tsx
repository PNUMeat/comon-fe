import { ComonFormGrid } from '@/components/commons/Form/ComonFormGrid';
import { ComonFormTitle } from '@/components/commons/Form/ComonFormTitle';
import { ComonImageInput } from '@/components/commons/Form/ComonImageInput';
import { ComonTextInput } from '@/components/commons/Form/ComonTextInput';
import { ComonTextarea } from '@/components/commons/Form/ComonTextarea';
import { FormFieldLabel } from '@/components/commons/Form/segments/FormFieldLabel';
import { HeightInNumber } from '@/components/types';

import { getMyProfile } from '@/api/user';
import { ModificationSubmitButton } from '@/templates/User/ModificationSubmitButton';
import styled from '@emotion/styled';
import { useQuery } from '@tanstack/react-query';

const ModificationFormContainer = styled.div<HeightInNumber>`
  height: ${(props) => props.h}px;
  width: 675px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: stretch;
  box-sizing: border-box;
  margin: 50px 86px;
  gap: 78px;
`;

export const ModificationForm: React.FC<HeightInNumber> = ({ h }) => {
  const { data, isFetching } = useQuery({
    queryKey: ['profile-query'],
    queryFn: getMyProfile,
  });

  return (
    <ModificationFormContainer h={h}>
      <ComonFormTitle
        title={'프로필 수정하기'}
        subtitle={'정보를 수정후 저장해 주세요'}
      />
      <ComonFormGrid h={494}>
        <FormFieldLabel>이름</FormFieldLabel>
        <ComonTextInput
          maxLength={10}
          placeholder={'이름'}
          value={data?.memberName}
          isDisabled={isFetching}
        />

        <FormFieldLabel>프로필 이미지</FormFieldLabel>
        <ComonImageInput imageUrl={data?.imageUrl} isDisabled={isFetching} />

        <FormFieldLabel>프로필 설명</FormFieldLabel>
        <ComonTextarea
          maxLength={50}
          placeholder={'자신을 소개해주세요!'}
          value={data?.memberExplain}
          isDisabled={isFetching}
        />
      </ComonFormGrid>
      <ModificationSubmitButton />
    </ModificationFormContainer>
  );
};
