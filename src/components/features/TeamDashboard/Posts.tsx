import { Box } from '@/components/commons/Box';
import { Flex } from '@/components/commons/Flex';
import { LazyImage } from '@/components/commons/LazyImage';
import { SText } from '@/components/commons/SText';
import { Spacer } from '@/components/commons/Spacer';
import { Tag } from '@/components/commons/Tag';

import { useState } from 'react';

import { IArticlesByDateResponse } from '@/api/dashboard';
import RocketImg from '@/assets/TeamDashboard/rocket.png';
import { selectedPostIdAtom } from '@/store/dashboard';
import styled from '@emotion/styled';
import { useAtom } from 'jotai';

interface PostsProps {
  data?: IArticlesByDateResponse;
  tags: {
    subjectDate: string;
    articleCategory: string;
  }[];
  selectedDate: string;
  onShowTopicDetail: () => void;
  onShowArticleDetail: (articleId: number) => void;
}

const categoryColors: Record<string, string> = {
  '스터디 복습': '#6E74FA',
  '스터디 예습': '#C2C4FB',
  스터디: '#FFA379',
  '코딩 테스트': '#FF5780',
};

export const Posts: React.FC<PostsProps> = ({
  data,
  tags,
  selectedDate,
  onShowTopicDetail,
  onShowArticleDetail,
}) => {
  const [selectedId, setSelectedId] = useAtom(selectedPostIdAtom);
  const [isButtonClicked, setIsButtonClicked] = useState(false);

  const getCategoryForSelectedDate = () => {
    if (!selectedDate) return null;
    return tags.find((tag) => tag.subjectDate === selectedDate) || null;
  };

  const category = getCategoryForSelectedDate();

  const handleButtonClick = () => {
    setIsButtonClicked(true);
    onShowTopicDetail();
  };

  const handleArticleClick = (articleId: number) => {
    setIsButtonClicked(false);
    onShowArticleDetail(articleId);
    setSelectedId(articleId);
  };

  return (
    <div style={{ position: 'relative' }}>
      <Box width="100%" padding="10px 40px" style={{ zIndex: 2 }}>
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
          <StyledButton isClicked={isButtonClicked} onClick={handleButtonClick}>
            <RocketIcon src={RocketImg} />
            주제 확인하기
          </StyledButton>
        </Flex>
      </Box>
      {data?.content?.length === 0 ? (
        <NoArticleDiv>
          <Flex justify="center" align="center" style={{ minHeight: '216px' }}>
            <SText color="#ccc" fontSize="24px" fontWeight={400}>
              게시글이 존재하지 않아요
            </SText>
          </Flex>
        </NoArticleDiv>
      ) : (
        <List>
          {data?.content?.map((article) => (
            <Box
              width="100%"
              height="104px"
              padding="20px"
              key={article.articleId}
              style={{
                cursor: 'pointer',
                boxShadow:
                  selectedId === article.articleId
                    ? '3px 6px 8.3px 0px rgba(63, 63, 77, 0.07) inset'
                    : undefined,
                backgroundColor:
                  selectedId === article.articleId ? '#F5F5F5' : '#fff',
              }}
              onClick={() => handleArticleClick(article.articleId)}
            >
              <Flex direction="column">
                <SText
                  color="#333"
                  fontSize="16px"
                  fontWeight={600}
                  lineHeight={'16px'}
                >
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
                  <SText
                    color="#333"
                    fontSize="12px"
                    fontWeight={600}
                    lineHeight={'12px'}
                  >
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

const StyledButton = styled.button<{ isClicked: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
  border: none;
  border-radius: 10px;
  color: #333;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  position: relative;
  gap: 4px;
  box-shadow: ${(props) =>
    props.isClicked
      ? '3px 6px 8.3px 0px rgba(63, 63, 77, 0.07) inset'
      : 'none'};
  background: ${(props) => (props.isClicked ? '#E5E5E5' : '#fff')};

  &:before {
    content: '';
    position: absolute;
    top: -1px;
    left: -1px;
    right: -1px;
    bottom: -1px;
    border-radius: 10px;
    background: linear-gradient(90deg, #ffd482, #ff377f);
    z-index: -1;
  }
`;

const RocketIcon = styled.img`
  width: 24px;
  height: 24px;
`;
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
