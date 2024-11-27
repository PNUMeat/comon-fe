import { ComonFieldLabel } from '@/components/commons/ComonFormFieldLabel';
import { ComonFormGrid } from '@/components/commons/ComonFormGrid';
import { ComonFormTitle } from '@/components/commons/ComonFormTitle';
import { ComonImageInput } from '@/components/commons/ComonImageInput';
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

export const EnrollForm: React.FC<HeightInNumber> = ({ h }) => {
  return (
    <EnrollFormContainer h={h}>
      <ComonFormTitle
        title={'프로필 완성하기'}
        subtitle={'가입 후에도 모든 정보를 수정할 수 있어요'}
      />
      <ComonFormGrid h={494}>
        <ComonFieldLabel>이름</ComonFieldLabel>
        <NameInput maxLength={10} />

        <ComonFieldLabel>프로필 이미지</ComonFieldLabel>
        <ComonImageInput />

        <ComonFieldLabel>프로필 설명</ComonFieldLabel>
        <ContentEditable maxLength={50} />

        <ComonFieldLabel>정책 동의</ComonFieldLabel>
        <AgreementCheckbox />
      </ComonFormGrid>
      <ProfileSubmitButton />
    </EnrollFormContainer>
  );
};
