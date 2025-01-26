import { ChangeEvent, FC, KeyboardEvent, useRef } from 'react';

import MagnifierIcon from '@/assets/TeamJoin/search.png';
import { breakpoints } from '@/constants/breakpoints';
import { colors } from '@/constants/colors';
import { useKeyword } from '@/pages/TeamJoin/KeywordPageControlContext.tsx';
import styled from '@emotion/styled';

interface SearchBarProps {
  placeholder?: string;
}

export const SearchBar: FC<SearchBarProps> = ({ placeholder }) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { keyword, setKeyword, setPage } = useKeyword();

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length === 0) {
      setKeyword('');
      setPage(0);
    }
  };

  const forwardKeyword = () => {
    if (inputRef && inputRef.current) {
      const input = inputRef.current;
      if (input.value.trim().length > 0) {
        setKeyword(input.value);
        setPage(0);
      }
    }
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      forwardKeyword();
    }
  };

  const onClickSearch = () => forwardKeyword();

  return (
    <SearchBarWrapper>
      <SearchInput
        ref={inputRef}
        onChange={onChange}
        placeholder={placeholder}
        onKeyDown={onKeyDown}
        defaultValue={keyword}
      />
      <SearchIcon onClick={onClickSearch} />
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
