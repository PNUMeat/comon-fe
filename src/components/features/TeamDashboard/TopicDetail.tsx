import { Box } from '@/components/commons/Box';
import { Flex } from '@/components/commons/Flex';
import { LazyImage } from '@/components/commons/LazyImage';
import { SText } from '@/components/commons/SText';
import { Spacer } from '@/components/commons/Spacer';

import { Link } from 'react-router-dom';

import { getTeamTopic } from '@/api/dashboard';
import { deleteSubject } from '@/api/subject';
import AnnouncementIcon from '@/assets/TeamDashboard/announcement.png';
import DeleteIcon from '@/assets/TeamDashboard/deleteIcon.png';
import ModifyIcon from '@/assets/TeamDashboard/modifyIcon.png';
import styled from '@emotion/styled';
import { useQuery } from '@tanstack/react-query';

interface TopicDetailProps {
  teamId: number;
  selectedDate: string;
  isTeamManager?: boolean;
}

export const TopicDetail: React.FC<TopicDetailProps> = ({
  teamId,
  selectedDate,
  isTeamManager = false,
}) => {
  const { data } = useQuery({
    queryKey: ['team-topic', teamId, selectedDate],
    queryFn: () => getTeamTopic(teamId, selectedDate),
    enabled: !!teamId && !!selectedDate,
  });

  const onClickDelete = () => {
    if (data) {
      deleteSubject(teamId, data.articleId)
        .then(() => alert('주제 삭제 성공'))
        .catch(() => alert('주제 삭제 실패'));
    }
  };

  const selectedTopicBody = data?.imageUrl
    ? data?.articleBody?.replace(/src="\?"/, `src="${data.imageUrl}"`)
    : data?.articleBody;

  return data ? (
    <Box width="100%" padding="30px 40px">
      <Flex direction="column" justify="center" align="flex-start">
        <Flex justify="space-between">
          <Flex align="center" gap="8px">
            <Icon src={AnnouncementIcon} />
            <SText color="#333" fontSize="24px" fontWeight={700}>
              {data?.articleTitle}
            </SText>
          </Flex>
          {isTeamManager && (
            <Flex width={7} gap="16px">
              <Link
                to={`/team-subject/${teamId}/${selectedDate}`}
                state={{
                  articleBody: data?.articleBody,
                  articleId: data?.articleId,
                  articleTitle: data?.articleTitle,
                  articleCategory: data?.articleCategory,
                }}
              >
                <LazyImage
                  src={ModifyIcon}
                  altText="수정"
                  w={20}
                  h={20}
                  maxW={20}
                />
              </Link>
              <div onClick={onClickDelete}>
                <LazyImage
                  src={DeleteIcon}
                  altText="삭제"
                  w={20}
                  h={20}
                  maxW={16}
                />
              </div>
            </Flex>
          )}
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
              h="auto"
              maxW={600}
              style={{ padding: '0px 20px' }}
            />
            <Spacer h={36} />
          </>
        )}
        <TopicViewer
          dangerouslySetInnerHTML={{ __html: selectedTopicBody ?? '' }}
        />
      </Flex>
    </Box>
  ) : (
    <Box width="100%" padding="30px 40px">
      <SText color="#ccc" fontSize="24px" fontWeight={400}>
        주제가 등록되지 않았어요
      </SText>
    </Box>
  );
};

const Icon = styled.img`
  width: 24px;
  height: 24px;
`;

const TopicViewer = styled.div`
  line-height: 1.5;

  & img {
    max-width: 600px;
    object-fit: contain;
  }
`;
