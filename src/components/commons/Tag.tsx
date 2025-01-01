import React from 'react';

import styled from '@emotion/styled';

interface TagProps {
  bgColor: string;
  label: string;
  padding?: string;
  fontSize?: string;
  onClick?: () => void;
  height?: string;
  isSelected?: boolean;
}

const TagContainer = styled.div<{
  bgColor: string;
  padding?: string;
  height?: string;
  isSelected?: boolean;
}>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background-color: ${({ bgColor }) => bgColor};
  border-radius: 34px;
  padding: ${(props) => props.padding || '2px 6px'};
  cursor: pointer;
  ${(props) => (props.height ? `height: ${props.height};` : null)}
  border: ${(props) => (props.isSelected ? '2px solid #333' : 'none')};
`;

const Dot = styled.div<{ isSelected?: boolean }>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: ${(props) => (props.isSelected ? '#777' : '#fff')};
`;

const TagText = styled.span<{ fontSize?: string }>`
  font-family: 'Pretendard', sans-serif;
  font-weight: 600;
  font-size: ${(props) => props.fontSize || '8px'};
  line-height: 12px;
  color: #ffffff;
  text-align: center;
  white-space: nowrap;
`;

export const Tag: React.FC<TagProps> = ({
  bgColor,
  label,
  onClick,
  isSelected,
  fontSize,
  padding,
  height,
}) => {
  return (
    <TagContainer
      bgColor={bgColor}
      onClick={onClick}
      padding={padding}
      height={height}
      isSelected={isSelected}
    >
      <Dot isSelected={isSelected} />
      <TagText fontSize={fontSize}>{label}</TagText>
    </TagContainer>
  );
};
