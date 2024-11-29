import { ComonShortInput } from '@/components/commons/Form/ComonShortInput';
import { InputHelperText } from '@/components/commons/Form/segments/InputHelperText';
import { Wrap } from '@/components/commons/Wrap';

import { useCallback } from 'react';

import { MAX_PEOPLE_NUM, teamMaxNumAtom } from '@/store/form';
import { useAtom } from 'jotai';

export const TeamMaxPeopleInput = () => {
  const [teamMaxNum, setTeamMaxNum] = useAtom(teamMaxNumAtom);

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseInt(e.target.value);
      setTeamMaxNum(value);
    },
    [setTeamMaxNum]
  );

  return (
    <Wrap>
      <ComonShortInput
        type={'number'}
        placeholder={'제한인원 입력'}
        value={teamMaxNum}
        onChange={onChange}
      />
      <InputHelperText textAlign={'left'}>
        {Number.isInteger(teamMaxNum) &&
        (teamMaxNum as number) <= MAX_PEOPLE_NUM
          ? '조건과 일치해요'
          : `최대 ${MAX_PEOPLE_NUM}명 제한`}
      </InputHelperText>
    </Wrap>
  );
};
