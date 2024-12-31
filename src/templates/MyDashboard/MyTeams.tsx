import { Flex } from '@/components/commons/Flex';

import { useState } from 'react';

import styled from '@emotion/styled';

const ModeButtonsWrapper = styled.div`
  display: flex;
  height: 30px;
  align-items: center;
  margin-left: 15px;
  position: relative;

  &::before {
    position: absolute;
    content: '📋';
    font-size: 24px;
    transform: translateX(-30px);
  }

  &::after {
    position: absolute;
    content: '.';
    color: transparent;
    display: inline-block;
    border-radius: 2px;
    height: 3px;
    bottom: 0;
    width: 214px;
    background-color: #c8c8c8;
    transform: translateX(5px);
  }
`;

const ModeButton = styled.button<{ isSelected: boolean }>`
  white-space: nowrap;
  box-sizing: border-box;
  display: inline-flex;
  height: 30px;
  padding: 2px 10px;
  justify-content: center;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
  position: relative;

  ${(props) =>
    props.isSelected
      ? `&::before {
    width: 95%;
    position: absolute;
    border-radius: 2px;
    content: '';
    height: 3px;
    bottom: 0;
    display: block;
    z-index: 2;
    background-color: #8488ec;
  }`
      : ''}

  color: ${(props) => (props.isSelected ? '#333' : '#777')};
  leading-trim: both;
  text-edge: cap;
  font-family: 'Pretendard Variable';
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
`;

const modes = [
  { label: '내가 쓴 글', value: 'history' },
  { label: '정보 관리', value: 'information' },
];

export const MyTeams = () => {
  const [mode, setMode] = useState('history');

  return (
    <Flex direction={'column'}>
      <ModeButtonsWrapper>
        {modes.map((m) => (
          <ModeButton
            key={m.value}
            isSelected={m.value === mode}
            onClick={() => setMode(m.value)}
          >
            {m.label}
          </ModeButton>
        ))}
      </ModeButtonsWrapper>
    </Flex>
  );
};
