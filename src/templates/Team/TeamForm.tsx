import { ComonFormGrid } from '@/components/commons/Form/ComonFormGrid';
import { ComonFormTitle } from '@/components/commons/Form/ComonFormTitle';
import { Spacer } from '@/components/commons/Spacer';
import { HeightInNumber } from '@/components/types';

import styled from '@emotion/styled';

const TeamContainer = styled.div<HeightInNumber>`
  height: ${(props) => props.h}px;
  display: flex;
  padding: 66px 87px 77px 87px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 99px;
`;

export const TeamForm: React.FC<HeightInNumber> = ({ h }) => {
  return (
    <TeamContainer h={h}>
      <ComonFormTitle
        title={'팀 정보 입력하기'}
        subtitle={'팀 생성 후에도 모든 정보를 수정할 수 있어요'}
      />
      <Spacer h={78} />
      <ComonFormGrid h={683}>
        {/*<FormFieldLabel>팀 이름</FormFieldLabel>*/}
        {/*<ComonTextInput maxLength={10} />*/}

        {/*<FormFieldLabel>팀 설명</FormFieldLabel>*/}
        {/*<ComonTextarea maxLength={50} />*/}

        {/*<FormFieldLabel>팀 아이콘</FormFieldLabel>*/}
        {/*<ComonImageInput />*/}

        {/*<FormFieldLabel>주제</FormFieldLabel>*/}
      </ComonFormGrid>
      <div>{h}</div>
    </TeamContainer>
  );
};
