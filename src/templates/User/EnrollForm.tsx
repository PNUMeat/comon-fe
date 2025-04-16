import { useWindowWidth } from '@/hooks/useWindowWidth';

import { ComonFormGrid } from '@/components/commons/Form/ComonFormGrid';
import { ComonFormTitle } from '@/components/commons/Form/ComonFormTitle';
import { ComonImageInput } from '@/components/commons/Form/ComonImageInput';
import { ComonTextInput } from '@/components/commons/Form/ComonTextInput';
import { ComonTextarea } from '@/components/commons/Form/ComonTextarea';
import { FormFieldLabel } from '@/components/commons/Form/segments/FormFieldLabel';
import { HeightInNumber } from '@/components/types';

import { breakpoints } from '@/constants/breakpoints';
import { EnrollSubmitButton } from '@/templates/User/EnrollSubmitButton';
import { EnrollAgreementCheckbox } from '@/templates/User/segments/EnrollAgreementCheckbox';
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
  min-width: 390px;

  @media (max-width: ${breakpoints.mobile}px) {
    margin: 0;
    gap: 20px;
    width: 100%;
  }
`;

const MobileComponent = () => (
  <>
    <FormFieldLabel>프로필 이미지</FormFieldLabel>
    <ComonImageInput imageCategory={'PROFILE'} />
    <FormFieldLabel>닉네임</FormFieldLabel>
    <ComonTextInput maxLength={10} placeholder={'닉네임'} />
  </>
);

export const EnrollForm: React.FC<HeightInNumber> = ({ h }) => {
  const width = useWindowWidth();

  return (
    <EnrollFormContainer h={h}>
      <ComonFormTitle
        title={'프로필 완성하기'}
        subtitle={'가입 후에도 모든 정보를 수정할 수 있어요'}
      />
      <ComonFormGrid h={494}>
        {width > breakpoints.mobile ? (
          <>
            <FormFieldLabel>닉네임</FormFieldLabel>
            <ComonTextInput maxLength={10} placeholder={'닉네임'} />

            <FormFieldLabel>프로필 이미지</FormFieldLabel>
            <ComonImageInput imageCategory={'PROFILE'} />
          </>
        ) : (
          <MobileComponent />
        )}

        <FormFieldLabel>프로필 설명</FormFieldLabel>
        <ComonTextarea maxLength={50} placeholder={'자신을 소개해주세요!'} />

        <FormFieldLabel>정책 동의</FormFieldLabel>
        <EnrollAgreementCheckbox />
      </ComonFormGrid>
      <EnrollSubmitButton />
    </EnrollFormContainer>
  );
};
