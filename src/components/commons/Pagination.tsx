import ArrowButton from '@/assets/TeamJoin/pagination_arrow.png';
import { breakpoints } from '@/constants/breakpoints';
import { colors } from '@/constants/colors';
import styled from '@emotion/styled';

import { Flex } from './Flex';
import { Spacer } from './Spacer';

interface IPaginationProps {
  totalPages: number;
  onPageChange: (page: number) => void;
  currentPageProp: number;
  hideShadow?: boolean;
  marginTop?: string;
}

export const Pagination = ({
  totalPages,
  onPageChange,
  currentPageProp,
  hideShadow,
  marginTop,
}: IPaginationProps) => {
  const handlePageChange = (page: number) => {
    onPageChange(page);
  };

  const handlePrev = () => {
    if (currentPageProp > 0) {
      handlePageChange(currentPageProp - 1);
    }
  };

  const handleNext = () => {
    if (currentPageProp < totalPages - 1) {
      handlePageChange(currentPageProp + 1);
    }
  };

  return (
    <Flex justify="center">
      <PaginationContainer hideShadow={hideShadow} marginTop={marginTop}>
        <LeftArrow src={ArrowButton} onClick={handlePrev} />
        <Spacer width={12} h={0} />
        <PageList>
          {Array.from({ length: totalPages }, (_, index) => (
            <PageNumber
              key={index + 1}
              isActive={index + 1 === currentPageProp + 1}
              onClick={() => handlePageChange(index)}
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

const PaginationContainer = styled.div<{
  hideShadow?: boolean;
  marginTop?: string;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 35px;
  padding: 5px 50px;
  border-radius: 30px;
  background: #fff;
  box-shadow: ${(props) =>
    props.hideShadow ? '' : '5px 7px 11.6px 0px rgba(63, 63, 77, 0.07)'};
  max-width: 270px;
  z-index: 999;
  margin-top: ${(props) => props.marginTop || '0px'};

  @media (max-width: ${breakpoints.mobile}px) {
    max-width: 220px;
    height: 20px;
    margin-top: ${({ marginTop }) =>
      marginTop ? `calc(${marginTop} + 30px)` : '0px'};
  }
`;

const LeftArrow = styled.img`
  width: 20px;
  height: 20px;
  transform: rotate(180deg);
  cursor: pointer;

  @media (max-width: ${breakpoints.mobile}px) {
    width: 16px;
    height: 16px;
  }
`;

const RightArrow = styled.img`
  width: 20px;
  height: 20px;
  cursor: pointer;

  @media (max-width: ${breakpoints.mobile}px) {
    width: 16px;
    height: 16px;
  }
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
