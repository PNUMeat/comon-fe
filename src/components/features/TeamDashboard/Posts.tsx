import { Box } from '@/components/commons/Box';
import { Button } from '@/components/commons/Button';
import { Flex } from '@/components/commons/Flex';
import { LazyImage } from '@/components/commons/LazyImage';
import { SText } from '@/components/commons/SText';
import { Spacer } from '@/components/commons/Spacer';
import { Tag } from '@/components/commons/Tag';

import { IArticlesByDateResponse } from '@/api/dashboard';
import styled from '@emotion/styled';

interface PostsProps {
  data: IArticlesByDateResponse;
  tags: {
    subjectDate: string;
    articleCategory: string;
  }[];
  selectedDate: string;
  onShowTopicDetail: () => void;
  onShowArticleDetail: (articleId: number) => void;
}

export const Posts: React.FC<PostsProps> = ({
  data,
  tags,
  selectedDate,
  onShowTopicDetail,
  onShowArticleDetail,
}) => {
  const categoryColors: Record<string, string> = {
    '스터디 복습': '#6E74FA',
    '스터디 예습': '#C2C4FB',
    스터디: '#FFA379',
    '코딩 테스트': '#FF5780',
  };

  const getCategoryForSelectedDate = () => {
    if (!selectedDate) return null;
    return tags.find((tag) => tag.subjectDate === selectedDate) || null;
  };

  const category = getCategoryForSelectedDate();

  const handleArticleClick = (articleId: number) => {
    onShowArticleDetail(articleId);
  };

  return (
    <div style={{ position: 'relative' }}>
      <Box width="100%" padding="20px 40px" style={{ zIndex: 2 }}>
        <Flex justify="space-between" align="center">
          <Flex width={35} justify="space-between" align="center">
            <SText color="#333" fontSize="24px" fontWeight={700}>
              {selectedDate}
            </SText>
            {category && (
              <Tag
                bgColor={categoryColors[category.articleCategory]}
                label={category.articleCategory}
                padding="4px 10px"
                fontSize="10px"
              />
            )}
          </Flex>
          <Button padding="8px 14px" onClick={onShowTopicDetail}>
            주제 확인하기
          </Button>
        </Flex>
      </Box>
      {data?.content.length === 0 ? (
        <NoArticleDiv>
          <Flex justify="center" align="center" style={{ minHeight: '216px' }}>
            <SText color="#ccc" fontSize="24px" fontWeight={400}>
              게시글이 존재하지 않아요
            </SText>
          </Flex>
        </NoArticleDiv>
      ) : (
        <List>
          {data?.content.map((article) => (
            <Box
              width="100%"
              height="104px"
              padding="20px"
              key={article.articleId}
              onClick={() => handleArticleClick(article.articleId)}
            >
              <Flex direction="column">
                <SText color="#333" fontSize="16px" fontWeight={600}>
                  {article.articleTitle}
                </SText>
                <Spacer h={8} />
                <SText color="#777" fontSize="12px" fontWeight={400}>
                  {article.createdDate.slice(0, -3)}
                </SText>
                <Spacer h={12} />
                <Flex align="center" gap="6px">
                  <LazyImage
                    src={article.memberImage}
                    altText={article.memberName}
                    w={16}
                    h={16}
                    maxW={16}
                    style={{ borderRadius: '50%' }}
                  />
                  <SText color="#333" fontSize="12px" fontWeight={600}>
                    {article.memberName}
                  </SText>
                </Flex>
              </Flex>
            </Box>
          ))}
        </List>
      )}
      <Spacer h={260} />
    </div>
  );
};

const NoArticleDiv = styled.div`
  position: absolute;
  top: 0px;
  left: 50%;
  padding: 90px 40px;
  min-height: 216px;
  transform: translateX(-50%);
  width: calc(100% - 80px);
  z-index: 1;
  border-radius: 20px;
  background: #fff;
`;

const List = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  position: absolute;
  top: 0px;
  left: 50%;
  padding: 90px 40px;
  min-height: 216px;
  transform: translateX(-50%);
  width: calc(100% - 80px);
  z-index: 1;
  border-radius: 20px;
  background: #fff;
`;
