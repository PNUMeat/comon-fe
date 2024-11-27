import { useState } from 'react';

import ArrowButton from '@/assets/TeamDashboard/arrow.png';
import { colors } from '@/constants/colors';
import styled from '@emotion/styled';

import { Flex } from './Flex';
import { Spacer } from './Spacer';

export const Pagination = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 3; // TODO: 수정

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  return (
    <Flex justify="center">
      <PaginationContainer>
        <LeftArrow src={ArrowButton} onClick={handlePrev} />
        <Spacer width={12} h={0} />
        <PageList>
          {Array.from({ length: totalPages }, (_, index) => (
            <PageNumber
              key={index + 1}
              isActive={index + 1 === currentPage}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </PageNumber>
          ))}
        </PageList>
        <Spacer width={12} h={0} />

        <RightArrow src={ArrowButton} onClick={handleNext} />
      </PaginationContainer>
    </Flex>
  );
};

const PaginationContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 35px;
  padding: 5px 50px;
  border-radius: 30px;
  background: #fff;
  box-shadow: 5px 7px 11.6px 0px rgba(63, 63, 77, 0.07);
  max-width: 270px;
`;

const LeftArrow = styled.img`
  width: 20px;
  height: 20px;
  transform: rotate(180deg);
`;

const RightArrow = styled.img`
  width: 20px;
  height: 20px;
`;

const PageList = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin: 0 16px;
`;

const PageNumber = styled.span<{ isActive: boolean }>`
  font-size: 14px;
  font-weight: ${(props) => (props.isActive ? 'bold' : 'normal')};
  color: ${(props) => (props.isActive ? colors.buttonPurple : '#C2C5FB')};
  cursor: pointer;
  transition: color 0.3s;

  &:hover {
    color: ${colors.buttonPurple};
  }
`;
