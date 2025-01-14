import { Flex } from '@/components/commons/Flex';

import { teamSubjectAtom } from '@/store/form';
import styled from '@emotion/styled';
import { useAtom } from 'jotai';

const TeamSubjectButton = styled.button<{ isSelected: boolean }>`
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
`;

const options = ['코딩테스트', '스터디'];

export const TeamSubjectRadio = () => {
  const [subject, setSubject] = useAtom(teamSubjectAtom);

  return (
    <Flex gap={'6px'}>
      {options.map((option) => (
        <TeamSubjectButton
          isSelected={subject === option}
          key={option}
          onClick={() => setSubject(option)}
          type="button"
        >
          {option}
        </TeamSubjectButton>
      ))}
    </Flex>
  );
};
