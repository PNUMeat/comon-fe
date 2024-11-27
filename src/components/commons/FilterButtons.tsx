import { useState } from 'react';

import { colors } from '@/constants/colors';
import styled from '@emotion/styled';

const filters = ['전체', '최근 순', '오래된 순', '활동 순'];

export const FilterButtons = () => {
  const [activeFilter, setActiveFilter] = useState('전체');

  return (
    <FilterGroup>
      {filters.map((filter) => (
        <FilterButton
          key={filter}
          isActive={filter === activeFilter}
          onClick={() => setActiveFilter(filter)}
        >
          {filter}
        </FilterButton>
      ))}
    </FilterGroup>
  );
};

const FilterGroup = styled.div`
  display: flex;
  gap: 3px;
`;

const FilterButton = styled.button<{ isActive: boolean }>`
  width: 60px;
  height: 28px;
  font-size: 10px;
  border: 1px solid ${colors.borderPurple};
  border-radius: 34px;
  background-color: ${(props) => (props.isActive ? '#535353' : '#fff')};
  color: ${(props) => (props.isActive ? '#fff' : '#535353')};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${(props) => (props.isActive ? '#444' : '#f4f4f4')};
  }
`;
