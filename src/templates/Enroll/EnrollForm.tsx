import { ComonFormGrid } from '@/components/commons/Form/ComonFormGrid';
import { ComonFormTitle } from '@/components/commons/Form/ComonFormTitle';
import { ComonImageInput } from '@/components/commons/Form/ComonImageInput';
import { ComonTextInput } from '@/components/commons/Form/ComonTextInput';
import { ComonTextarea } from '@/components/commons/Form/ComonTextarea';
import { FormFieldLabel } from '@/components/commons/Form/segments/FormFieldLabel';
import { HeightInNumber } from '@/components/types';

import { EnrollAgreementCheckbox } from '@/templates/Enroll/EnrollAgreementCheckbox';
import { EnrollSubmitButton } from '@/templates/Enroll/EnrollSubmitButton';
import styled from '@emotion/styled';

const EnrollFormContainer = styled.div<HeightInNumber>`
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

export const EnrollForm: React.FC<HeightInNumber> = ({ h }) => {
  return (
    <EnrollFormContainer h={h}>
      <ComonFormTitle
        title={'프로필 완성하기'}
        subtitle={'가입 후에도 모든 정보를 수정할 수 있어요'}
      />
      <ComonFormGrid h={494}>
        <FormFieldLabel>이름</FormFieldLabel>
        <ComonTextInput maxLength={10} placeholder={'이름'} />

        <FormFieldLabel>프로필 이미지</FormFieldLabel>
        <ComonImageInput />

        <FormFieldLabel>프로필 설명</FormFieldLabel>
        <ComonTextarea maxLength={50} />

        <FormFieldLabel>정책 동의</FormFieldLabel>
        <EnrollAgreementCheckbox />
      </ComonFormGrid>
      <EnrollSubmitButton />
    </EnrollFormContainer>
  );
};
