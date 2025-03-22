import { Flex } from '@/components/commons/Flex';

import { useEffect } from 'react';

import { teamSubjectAtom } from '@/store/form';
import styled from '@emotion/styled';
import { useAtom } from 'jotai';
import { CSSObject } from '@emotion/react';

const TeamSubjectButton = styled.button<{ isSelected: boolean, customStyle?: CSSObject}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 28px;
  padding: 2px 20px;
  border: 1px solid ${({ isSelected }) => (isSelected ? '#cdcfff' : '#a3bffa')};
  border-radius: 34px;
  background: ${({ isSelected }) => (isSelected ? '#535353' : '#fff')};
  font-size: 16px;
  color: ${({ isSelected }) => (isSelected ? '#fff' : '#333333')};
  cursor: pointer;
  transition: all 0.2s;

  ${(props) => props.customStyle}
`;

const options = ['코딩테스트', '스터디'];

export const TeamSubjectRadio: React.FC<{
  defaultValue?: string;
  css?: CSSObject;
}> = ({ defaultValue, css}) => {
  const [subject, setSubject] = useAtom(teamSubjectAtom);

  useEffect(() => {
    if (defaultValue) {
      setSubject(defaultValue);
    }
  }, []);

  return (
    <Flex gap={'6px'}>
      {options.map((option) => (
        <TeamSubjectButton
          isSelected={subject === option}
          key={option}
          onClick={() => setSubject(option)}
          type="button"
          customStyle={css}
        >
          {option}
        </TeamSubjectButton>
      ))}
    </Flex>
  );
};
