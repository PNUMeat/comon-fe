import { Box } from '@/components/commons/Box';
import { Flex } from '@/components/commons/Flex';
import { LazyImage } from '@/components/commons/LazyImage';
import { SText } from '@/components/commons/SText';
import { Spacer } from '@/components/commons/Spacer';

import { getTeamTopic } from '@/api/dashboard';
import AnnouncementIcon from '@/assets/TeamDashboard/announcement.png';
import styled from '@emotion/styled';
import { useQuery } from '@tanstack/react-query';

interface TopicDetailProps {
  teamId: number;
  selectedDate: string;
}

export const TopicDetail: React.FC<TopicDetailProps> = ({
  teamId,
  selectedDate,
}) => {
  const { data } = useQuery({
    queryKey: ['team-topic', teamId, selectedDate],
    queryFn: () => getTeamTopic(teamId, selectedDate),
    enabled: !!teamId && !!selectedDate,
  });

  return (
    <Box width="100%" padding="30px 40px">
      <Flex direction="column" justify="center" align="flex-start">
        <Flex align="center" gap="8px">
          <Icon src={AnnouncementIcon} />
          <SText color="#333" fontSize="24px" fontWeight={700}>
            {data?.articleTitle}
          </SText>
        </Flex>
        <Spacer h={8} />
        <SText color="#777" fontSize="14px" fontWeight={400}>
          {data?.createdDate.slice(0, -3)}
        </SText>
        <Spacer h={28} />
        <Flex align="center" gap="8px">
          <LazyImage
            src={data?.authorImageUrl || ''}
            altText={data?.authorName || ''}
            w={16}
            h={16}
            maxW={16}
            style={{ borderRadius: '50%' }}
          />
          <SText color="#333" fontSize="12px" fontWeight={600}>
            {data?.authorName}
          </SText>
        </Flex>
        <Spacer h={36} />
        {data?.imageUrl && (
          <>
            <LazyImage
              src={data.imageUrl}
              altText="이미지 불러오기 실패"
              w={600}
              h={300}
              maxW={600}
              style={{ padding: '0px 20px' }}
            />
            <Spacer h={36} />
          </>
        )}
        <div dangerouslySetInnerHTML={{ __html: data?.articleBody || '' }} />
      </Flex>
    </Box>
  );
};

const Icon = styled.img`
  width: 24px;
  height: 24px;
`;
