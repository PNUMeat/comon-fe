import { ComonImageInput } from '@/components/commons/ComonImageInput';
import { FormTitle } from '@/components/commons/FormTitle';
import { HeightInNumber } from '@/components/types';

import { AgreementCheckbox } from '@/templates/Enroll/AgreementCheckbox';
import { ContentEditable } from '@/templates/Enroll/ContentEditable';
import { NameInput } from '@/templates/Enroll/NameInput';
import { ProfileSubmitButton } from '@/templates/Enroll/ProfileSubmitButton';
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

const FormGrid = styled.div<HeightInNumber>`
  height: ${(props) => props.h}px;
  display: grid;
  grid-template-columns: 1fr 2fr;
  grid-gap: 20px 30px;
  width: 100%;
`;

const FieldLabel = styled.label`
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  display: block;
`;

export const EnrollForm: React.FC<HeightInNumber> = ({ h }) => {
  return (
    <EnrollFormContainer h={h}>
      <FormTitle
        title={'프로필 완성하기'}
        subtitle={'가입 후에도 모든 정보를 수정할 수 있어요'}
      />
      <FormGrid h={494}>
        <FieldLabel>이름</FieldLabel>
        <NameInput maxLength={10} />

        <FieldLabel>프로필 이미지</FieldLabel>
        <ComonImageInput />

        <FieldLabel>프로필 설명</FieldLabel>
        <ContentEditable maxLength={50} />

        <FieldLabel>정책 동의</FieldLabel>
        <AgreementCheckbox />
      </FormGrid>
      <ProfileSubmitButton />
    </EnrollFormContainer>
  );
};
