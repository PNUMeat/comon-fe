import { useWindowWidth } from '@/hooks/useWindowWidth.ts';

import { Box } from '@/components/commons/Box';
import { Flex } from '@/components/commons/Flex';
import { LazyImage } from '@/components/commons/LazyImage';
import { SText } from '@/components/commons/SText';
import { Spacer } from '@/components/commons/Spacer';
import { Tag } from '@/components/commons/Tag';

import { Suspense, useState } from 'react';

import { IArticlesByDateResponse } from '@/api/dashboard';
import RocketImg from '@/assets/TeamDashboard/rocket.png';
import { breakpoints } from '@/constants/breakpoints.ts';
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

  const width = useWindowWidth();
  const isMobile = width <= breakpoints.mobile;

  const fontSize = isMobile ? '18px' : '24px';
  const padding = isMobile ? '10px 16px' : '10px 40px';
  const flexWidth = isMobile ? 'auto' : 35;

  return (
    <ContentDiv height={isMobile ? '391px' : ''}>
      <Box width="100%" padding={padding} style={{ zIndex: 2 }}>
        <Flex justify="space-between" align="center">
          <Flex
            width={flexWidth}
            justify="space-between"
            align="center"
            gap="10px"
          >
            <SText color="#333" fontSize={fontSize} fontWeight={700}>
              {selectedDate}
            </SText>
            {category && (
              <Tag
                bgColor={categoryColors[category.articleCategory]}
                label={category.articleCategory}
                padding={isMobile ? '3px 4px' : '4px 10px'}
                fontSize={isMobile ? '8px' : '10px'}
              />
            )}
          </Flex>
          <StyledButton isClicked={isButtonClicked} onClick={handleButtonClick}>
            <RocketIcon src={RocketImg} />
            문제 확인하기
          </StyledButton>
        </Flex>
      </Box>

      <Suspense fallback={<NoArticleDiv />}>
        {data?.content?.length === 0 ? (
          <NoArticleDiv>
            <Flex
              justify="center"
              align="center"
              style={{ minHeight: '216px' }}
            >
              <SText
                color="#ccc"
                fontSize={isMobile ? '20px' : '24px'}
                fontWeight={400}
              >
                게시글이 존재하지 않아요
              </SText>
            </Flex>
          </NoArticleDiv>
        ) : (
          <List>
            <ContentWrapper>
              {data?.content?.map((article) => (
                <Box
                  // TODO: 100%로 하면 grid로 width가 계산되어 피그마 디자인(145px)과 달라집니다.
                  width="100%"
                  height={isMobile ? '86px' : '104px'}
                  padding={isMobile ? '12px 14px' : '20px'}
                  key={article.articleId}
                  style={{
                    cursor: 'pointer',
                    boxShadow:
                      selectedId === article.articleId
                        ? '4px 4px 8.2px 0px rgba(104, 104, 104, 0.20) inset'
                        : undefined,
                    backgroundColor: '#fff',
                  }}
                  onClick={() => handleArticleClick(article.articleId)}
                >
                  <Flex direction="column">
                    <PostTitleWrap>
                      <SText
                        color="#333"
                        fontSize={isMobile ? '14px' : '16px'}
                        lineHeight={isMobile ? '17px' : '20px'}
                        fontWeight={600}
                        shouldCut
                      >
                        {article.articleTitle}
                      </SText>
                    </PostTitleWrap>
                    <Spacer h={8} />
                    <SText
                      color="#777"
                      fontSize={isMobile ? '10px' : '12px'}
                      fontWeight={400}
                    >
                      {article.createdDate.slice(0, -3)}
                    </SText>
                    <Spacer h={12} />
                    <Flex align="center" gap="6px">
                      <LazyImage
                        src={article.memberImage}
                        altText={article.memberName}
                        w={isMobile ? 14 : 16}
                        h={isMobile ? 14 : 16}
                        maxW={16}
                        style={{ borderRadius: '50%' }}
                      />
                      <SText
                        color="#333"
                        fontSize={isMobile ? '10px' : '12px'}
                        fontWeight={600}
                      >
                        {article.memberName}
                      </SText>
                    </Flex>
                  </Flex>
                </Box>
              ))}
            </ContentWrapper>
          </List>
        )}
      </Suspense>
    </ContentDiv>
  );
};

const ContentDiv = styled.div<{ height: string }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: ${(props) => props.height};
`;

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

  @media (max-width: ${breakpoints.mobile}px) {
    font-size: 10px;
    padding: 7px 11px;
  }
`;

const RocketIcon = styled.img`
  width: 24px;
  height: 24px;

  @media (max-width: ${breakpoints.mobile}px) {
    width: 16px;
    height: 16px;
  }
`;
const NoArticleDiv = styled.div`
  top: 0px;
  left: 50%;
  padding: 90px 40px;
  height: 216px;
  width: calc(100% - 80px);
  z-index: 1;
  border-radius: 20px;
  margin-top: -50px;
  background: #fff;
`;

const ContentWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(3, calc(33.33% - 8px));
  width: calc(100% - 80px);
  height: 216px;
  gap: 8px;
  top: 0px;
  left: 50%;

  @media (max-width: ${breakpoints.mobile}px) {
    display: grid;
    grid-template-columns: repeat(2, calc(50% - 4px));
    gap: 8px;
    width: calc(100% - 40px);
    height: auto;
  }
`;

const List = styled.div`
  display: flex;
  justify-content: center;
  height: 100%;
  width: 100%;
  z-index: 1;
  border-radius: 20px;
  background: #fff;
  margin-top: -20px;
  padding: 53px 0 100px 0;

  @media (max-width: ${breakpoints.mobile}px) {
    padding-bottom: 67px;
    position: relative;
  }
`;

const PostTitleWrap = styled.div`
  width: 164px;

  @media (max-width: ${breakpoints.mobile}px) {
    width: 105px;
  }
`;
