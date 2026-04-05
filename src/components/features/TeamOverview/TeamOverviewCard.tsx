import { Button } from '@/components/commons/Button';
import { Flex } from '@/components/commons/Flex';
import { GlassCard } from '@/components/commons/GlassCard';
import { SText } from '@/components/commons/SText';
import { Spacer } from '@/components/commons/Spacer';

import { Link } from 'react-router-dom';

import { PATH } from '@/routes/path';
import styled from '@emotion/styled';

interface TeamOverviewCardProps {
  imgUrl: string;
  teamId: number;
  teamName: string;
  teamExplain: string;
  totalSolveCount: number;
  memberCount: number;
}

export const TeamOverviewCard = ({
  imgUrl,
  teamId,
  teamName,
  teamExplain,
  totalSolveCount,
  memberCount,
}: TeamOverviewCardProps) => {
  return (
    <GlassCard style={{ minHeight: '338px', height: '338px', width: '1120px' }}>
      <CardImage src={imgUrl} />
      <Flex direction="column" padding="24px 56px">
        <Heading>{teamName}</Heading>
        <Spacer h={21} />
        <Description>{teamExplain}</Description>
        <Spacer h={14} />
        <Flex gap="8px">
          <Badge>
            <span style={{ color: '#8488EC' }}>{memberCount} members</span>
          </Badge>
          <Badge>
            🔥 &nbsp;누적{' '}
            <span style={{ color: '#8488EC', fontWeight: 500 }}>
              {totalSolveCount}
            </span>
            풀이
          </Badge>
        </Flex>
        <Spacer h={35} />
        <Link
          to={`${PATH.TEAM_DASHBOARD}/${teamId}`}
          style={{ textDecoration: 'none', width: '100%' }}
        >
          <Button
            padding="16px"
            style={{ borderRadius: '11px', width: '100%' }}
          >
            <SText fontWeight={700} fontSize="16px">
              스터디 둘러보기
            </SText>
          </Button>
        </Link>
      </Flex>
    </GlassCard>
  );
};

const Heading = styled.h1`
  font-size: 28px;
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
  border-radius: 40px 40px 0 0;
`;
