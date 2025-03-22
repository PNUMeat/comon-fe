import { viewStyle } from '@/utils/viewStyle';

import { useRegroupImageAndArticle } from '@/hooks/useRegroupImageAndArticle.ts';

import { Box } from '@/components/commons/Box';
import { Flex } from '@/components/commons/Flex';
import { LazyImage } from '@/components/commons/LazyImage';
import { SText } from '@/components/commons/SText';
import { Spacer } from '@/components/commons/Spacer';

import { Suspense } from 'react';
import { Link } from 'react-router-dom';

import { getTeamTopic } from '@/api/dashboard';
import { deleteSubject } from '@/api/subject';
import AnnouncementIcon from '@/assets/TeamDashboard/announcement.png';
import DeleteIcon from '@/assets/TeamDashboard/deleteIcon.png';
import ModifyIcon from '@/assets/TeamDashboard/modifyIcon.png';
import styled from '@emotion/styled';
import { useQuery, useQueryClient } from '@tanstack/react-query';

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
  const queryClient = useQueryClient();

  const onClickDelete = () => {
    if (data) {
      deleteSubject(teamId, data.articleId)
        .then(() => {
          alert('문제 삭제 성공');
          queryClient.refetchQueries({
            queryKey: ['team-topic', teamId, selectedDate],
          });
        })
        .catch(() => alert('문제 삭제 실패'));
    }
  };

  const { result: selectedTopicBody } = useRegroupImageAndArticle(data);

  return data ? (
    <Box width="100%" padding="30px 40px">
      <Flex direction="column" justify="center" align="flex-start">
        <Flex justify="space-between">
          <Flex align="center" gap="8px">
            <Icon src={AnnouncementIcon} />
            <SText
              color="#333"
              fontSize="24px"
              fontWeight={700}
              whiteSpace={'normal'}
              wordBreak={'break-word'}
            >
              {data?.articleTitle}
            </SText>
          </Flex>
          {isTeamManager && (
            <Suspense fallback={<div style={{ height: '20px' }} />}>
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
                <div style={{ cursor: 'pointer' }} onClick={onClickDelete}>
                  <LazyImage
                    src={DeleteIcon}
                    altText="삭제"
                    w={20}
                    h={20}
                    maxW={16}
                  />
                </div>
              </Flex>
            </Suspense>
          )}
        </Flex>

        <Spacer h={8} />
        <SText color="#777" fontSize="14px" fontWeight={400}>
          {data?.createdDate?.slice(0, -3) || ''}
        </SText>
        <Spacer h={28} />
        <Flex align="center" gap="8px">
          <Suspense fallback={<div style={{ height: '16px' }} />}>
            <LazyImage
              src={data?.authorImageUrl || ''}
              altText={data?.authorName || ''}
              w={16}
              h={16}
              maxW={16}
              style={{ borderRadius: '50%' }}
            />
          </Suspense>
          <SText color="#333" fontSize="12px" fontWeight={600}>
            {data?.authorName}
          </SText>
        </Flex>
        <Spacer h={36} />
        {data ? (
          <TopicViewer
            dangerouslySetInnerHTML={{ __html: selectedTopicBody }}
          />
        ) : null}
      </Flex>
    </Box>
  ) : (
    <Box width="100%" padding="30px 40px">
      <SText color="#ccc" fontSize="24px" fontWeight={400}>
        문제가 등록되지 않았어요
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

  ${viewStyle}
`;
