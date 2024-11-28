import { InputContainer } from '@/components/commons/Form/segments/InputContainer';
import { InputField } from '@/components/commons/Form/segments/InputField';
import { InputHelperText } from '@/components/commons/Form/segments/InputHelperText';
import { Wrap } from '@/components/commons/Wrap';

import { useCallback } from 'react';

import { formTextInputAtom } from '@/store/form';
import { useAtom } from 'jotai';

/**
    상태가 매핑됨 (formTextInputAtom)
 */
export const ComonTextInput: React.FC<{
  maxLength: number;
  placeholder: string;
}> = ({ maxLength, placeholder }) => {
  // TODO: 현재 해당 컴포넌트가 여러번 필요한 디자인이 없으므로 상태를 매핑 했다. 혹시 생긴다면 수정 필요.
  //  상태를 매핑했기 때문에 하나의 페이지에서 여러번 재사용 불가함.
  //  클린업 함수는 submit 후동작으로 넣을 것임. useEffect의 return 부분에 넣어야하는지?
  const [name, setName] = useAtom(formTextInputAtom);

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      setName(e.target.value);
    },
    [setName]
  );

  return (
    <Wrap>
      <InputContainer>
        <InputField
          placeholder={placeholder}
          maxLength={maxLength}
          value={name}
          onChange={onChange}
        />
      </InputContainer>
      <InputHelperText>
        {name.length}/{maxLength}자
      </InputHelperText>
    </Wrap>
  );
};
