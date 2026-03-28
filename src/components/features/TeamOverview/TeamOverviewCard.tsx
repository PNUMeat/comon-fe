import { Button } from '@/components/commons/Button';
import { Flex } from '@/components/commons/Flex';
import { GlassCard } from '@/components/commons/GlassCard';
import { SText } from '@/components/commons/SText';

import styled from '@emotion/styled';

interface TeamOverviewCardProps {
  data: {
    imgSrc: string;
    title: string;
    description: string;
    count: number;
    solveCount: number;
  };
}

export const TeamOverviewCard = ({ data }: TeamOverviewCardProps) => {
  const { imgSrc, title, description, count, solveCount } = data;
  return (
    <GlassCard>
      <CardImage src={imgSrc} />
      <Flex direction="column" gap="22px" padding="37px 56px">
        <Heading>{title}</Heading>
        <Description>{description}</Description>
        <Flex gap="8px">
          <Badge>
            <span style={{ color: '#8488EC' }}>{count} members</span>
          </Badge>
          <Badge>
            🔥 &nbsp;누적{' '}
            <span style={{ color: '#8488EC', fontWeight: 500 }}>
              {solveCount}
            </span>
            풀이
          </Badge>
        </Flex>
        <Button padding="19px" style={{ borderRadius: '20px' }}>
          <SText fontWeight={700}>스터디 둘러보기</SText>
        </Button>
      </Flex>
    </GlassCard>
  );
};

const Heading = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: #333;
`;

const Description = styled.p`
  font-size: 18px;
  font-weight: 500;
  color: #777;
`;

const Badge = styled.div`
  backgrount-color: #f4f4f4;
  border: 1px solid #cdcfff;
  padding: 5.5px 14px;
  border-radius: 5px;
  font-weight: 400;
  color: #777777;
`;

const CardImage = styled.img`
  width: 100%;
  height: 174px;
  object-fit: cover;
  border-radius: 20px 20px 0 0;
`;
