import { Flex } from '@/components/commons/Flex';

import styled from '@emotion/styled';

const Title = styled.div`
  font-size: 32px;
  line-height: 32px;
  font-weight: 700;
  font-style: normal;
  line-height: 38.19px;
  color: #333;
`;

const Subtitle = styled.p`
  font-size: 14px;
  font-weight: 400;
  line-height: 19px;
  color: #333;
  letter-spacing: -0.28px;
`;

export const ComonFormTitle: React.FC<{
  title: string;
  subtitle: string;
}> = ({ title, subtitle }) => {
  return (
    <Flex direction={'column'} align={'center'} gap={'5px'}>
      <Title>{title}</Title>
      <Subtitle>{subtitle}</Subtitle>
    </Flex>
  );
};
