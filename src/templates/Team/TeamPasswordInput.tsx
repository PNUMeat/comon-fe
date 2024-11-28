import { ComonShortInput } from '@/components/commons/Form/ComonShortInput';
import { InputHelperText } from '@/components/commons/Form/segments/InputHelperText';
import { Wrap } from '@/components/commons/Wrap';

import { useCallback } from 'react';

import { PROPER_PASSWORD_LENGTH, teamPasswordAtom } from '@/store/form';
import { useAtom } from 'jotai';

export const TeamPasswordInput = () => {
  const [teamPassword, setTeamPassword] = useAtom(teamPasswordAtom);
  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setTeamPassword(value);
    },
    [setTeamPassword]
  );

  return (
    <Wrap>
      <ComonShortInput
        type={'text'}
        placeholder={'비밀번호 입력'}
        value={teamPassword}
        onChange={onChange}
      />
      <InputHelperText textAlign={'left'}>
        {teamPassword.length === PROPER_PASSWORD_LENGTH
          ? '조건과 일치해요'
          : `숫자 ${PROPER_PASSWORD_LENGTH}자리를 입력해주세요`}
      </InputHelperText>
    </Wrap>
  );
};
