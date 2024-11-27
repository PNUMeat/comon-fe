import { Wrap } from '@/components/commons/Wrap';

import { useCallback } from 'react';

import { enrollNameAtom } from '@/store/enroll';
import styled from '@emotion/styled';
import { useAtom } from 'jotai';

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 19px;
  height: 40px;
  gap: 10px;
  align-self: stretch;
  border-radius: 20px;
  border: 1px solid #cdcfff;
  background: #ffffff;
  box-sizing: border-box;
`;

const TextInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  font-size: 16px;
  color: #333333;

  ::placeholder {
    color: #cccccc;
  }
`;

const CharacterCounter = styled.span`
  font-size: 14px;
  font-weight: 400;
  color: #cccccc;
  display: block;
  text-align: right;
  margin-top: 4px;
`;

export const NameInput: React.FC<{ maxLength: number }> = ({ maxLength }) => {
  const [name, setName] = useAtom(enrollNameAtom);

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      setName(e.target.value);
    },
    [setName]
  );

  return (
    <Wrap>
      <InputContainer>
        <TextInput
          placeholder={'이름'}
          maxLength={maxLength}
          value={name}
          onChange={onChange}
        />
      </InputContainer>
      <CharacterCounter>
        {name.length}/{maxLength}자
      </CharacterCounter>
    </Wrap>
  );
};
