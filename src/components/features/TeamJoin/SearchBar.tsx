import { ChangeEvent, FC, KeyboardEvent } from 'react';

import MagnifierIcon from '@/assets/TeamJoin/search.png';
import { breakpoints } from '@/constants/breakpoints';
import { colors } from '@/constants/colors';
import styled from '@emotion/styled';

interface SearchBarProps {
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  onSearch: () => void;
}

export const SearchBar: FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder,
  onSearch,
}) => {
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <SearchBarWrapper>
      <SearchInput
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        onKeyDown={handleKeyDown}
      />
      <SearchIcon onClick={onSearch} />
    </SearchBarWrapper>
  );
};

const SearchBarWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 0px 16px;
  width: 260px;
  height: 34px;
  border: 1px solid ${colors.borderPurple};
  border-radius: 52px;
  background-color: #fff;

  @media (max-width: ${breakpoints.mobile}px) {
    width: 150px;
    height: 24px;
    padding: 0px 12px;
  }
`;

const SearchInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  font-size: 16px;
  color: #333;
  background-color: transparent;

  &::placeholder {
    color: #ccc;
  }

  @media (max-width: ${breakpoints.mobile}px) {
    font-size: 12px;
  }
`;

const SearchIcon = styled.div`
  width: 18px;
  height: 18px;
  margin-left: 8px;
  background: url(${MagnifierIcon}) no-repeat center;
  background-size: contain;
  cursor: pointer;
`;
