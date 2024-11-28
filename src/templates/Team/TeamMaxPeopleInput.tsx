import { ComonShortInput } from '@/components/commons/Form/ComonShortInput';
import { InputHelperText } from '@/components/commons/Form/segments/InputHelperText';
import { Wrap } from '@/components/commons/Wrap';

import { useCallback } from 'react';

import { teamMaxNumAtom } from '@/store/form';
import { useAtom } from 'jotai';

export const TeamMaxPeopleInput = () => {
  const [teamMaxNum, setTeamMaxNum] = useAtom(teamMaxNumAtom);

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const nValue = parseInt(e.target.value);
      if (nValue > 0) {
        setTeamMaxNum(nValue);
      }
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
      <InputHelperText textAlign={'left'}>최대 20명 제한</InputHelperText>
    </Wrap>
  );
};
