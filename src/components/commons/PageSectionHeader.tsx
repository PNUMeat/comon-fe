import { Flex } from '@/components/commons/Flex';
import { HeightInNumber } from '@/components/types';

import { colors } from '@/constants/colors';
import styled from '@emotion/styled';

interface IPageSectionHeader extends HeightInNumber {
  children: React.ReactNode;
}

export const PageSectionHeader = styled(Flex)<IPageSectionHeader>`
  border-radius: 20px;
  background-color: ${colors.headerPurple};
  align-items: center;
  height: ${(props) => props.h ?? 40}px;
  padding: 0 25px;
  font-size: 20px;
  font-weight: 600;
  line-height: 23.87px;
  text-align: center;
  color: #333;
`;
