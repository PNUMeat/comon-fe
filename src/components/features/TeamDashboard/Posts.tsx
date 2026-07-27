import { useWindowWidth } from '@/hooks/useWindowWidth.ts';

import { Box } from '@/components/commons/Box';
import { Flex } from '@/components/commons/Flex';
import { LazyImage } from '@/components/commons/LazyImage';
import { SText } from '@/components/commons/SText';
import { Spacer } from '@/components/commons/Spacer';
import { Tag } from '@/components/commons/Tag';

import { Suspense, useMemo, useState } from 'react';

import { IArticle, IArticlesByDateResponse } from '@/api/dashboard';
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
  isExpanded: boolean;
  pinnedArticle?: IArticle | null;
  showPinnedSlot?: boolean;
  // 스터디방 전용: 뱃지를 고정 라벨(스터디/스터디 복습)로 표시 — TeamAdmin은 기존 카테고리 유지
  studyUi?: boolean;
  onToggleExpanded: () => void;
  onShowTopicDetail: () => void;
  onShowArticleDetail: (articleId: number) => void;
}

const categoryColors: Record<string, string> = {
  '스터디 복습': '#6E74FA',
  '스터디 예습': '#C2C4FB',
  스터디: '#FFA379',
  '코딩 테스트': '#FF5780',
};

// 캘린더와 동일한 고정 라벨 — 오늘은 '스터디', 그 외는 '스터디 복습' (백엔드 카테고리 문자열 미노출)
const getBadgeLabel = (selectedDate: string): string => {
  const today = new Date()
    .toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
    .replace(/\s/g, '')
    .replace(/[./]/g, '-')
    .replace(/-$/, '');
  return selectedDate === today ? '스터디' : '스터디 복습';
};

export const Posts: React.FC<PostsProps> = ({
  data,
  tags,
  selectedDate,
  isExpanded,
  pinnedArticle,
  showPinnedSlot = false,
  studyUi = false,
  onToggleExpanded,
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
  const listArticles = useMemo(() => {
    const articles = data?.content ?? [];

    if (!pinnedArticle) {
      return articles;
    }

    return articles.filter(
      (article) => article.articleId !== pinnedArticle.articleId
    );
  }, [data?.content, pinnedArticle]);
  const mobileArticles = pinnedArticle
    ? [pinnedArticle, ...listArticles]
    : listArticles;
  const shouldShowPinnedSlot = showPinnedSlot || !!pinnedArticle;

  const renderArticleCard = (article: IArticle) => (
    <Box
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
          whiteSpace="nowrap"
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
  );

  const renderPinnedPlaceholder = () => (
    <PinnedPlaceholderCard>
      <PinnedPlaceholderContent>
        <SText
          color="#333"
          fontSize={isMobile ? '14px' : '16px'}
          lineHeight={isMobile ? '17px' : '20px'}
          fontWeight={600}
        >
          나의 풀이
        </SText>
        <Spacer h={8} />
        <SText
          color="#777"
          fontSize={isMobile ? '9px' : '10px'}
          fontWeight={400}
          lineHeight={isMobile ? '12px' : '14px'}
          whiteSpace="nowrap"
        >
          오늘의 풀이를 등록해보세요
        </SText>
      </PinnedPlaceholderContent>
    </PinnedPlaceholderCard>
  );

  return (
    <ContentDiv height={isMobile && isExpanded ? '391px' : ''}>
      <Box width="100%" padding={padding} style={{ zIndex: 2 }}>
        <Flex justify="space-between" align="center">
          <Flex
            width={'100%'}
            justify="space-between"
            align="center"
            gap="10px"
          >
            <SText color="#333" fontSize={fontSize} fontWeight={700}>
              {selectedDate}
            </SText>
            {category && (
              <Tag
                bgColor={
                  categoryColors[
                    studyUi ? getBadgeLabel(selectedDate) : category.articleCategory
                  ]
                }
                label={studyUi ? getBadgeLabel(selectedDate) : category.articleCategory}
                padding={isMobile ? '3px 4px' : '4px 10px'}
                fontSize={isMobile ? '8px' : '10px'}
              />
            )}
          </Flex>
          <ActionGroup>
            <StyledButton
              isClicked={isButtonClicked}
              onClick={handleButtonClick}
            >
              <RocketIcon src={RocketImg} />
              문제 확인하기
            </StyledButton>
            <ToggleButton
              type="button"
              isExpanded={isExpanded}
              aria-expanded={isExpanded}
              onClick={onToggleExpanded}
            >
              {isExpanded ? '닫기' : '펼치기'}
              <ToggleCaret isExpanded={isExpanded} />
            </ToggleButton>
          </ActionGroup>
        </Flex>
      </Box>

      {isExpanded && (
        <Suspense fallback={<NoArticleDiv />}>
          {!shouldShowPinnedSlot && data?.content?.length === 0 ? (
            <NoArticleDiv>
              <Flex
                justify="center"
                align="center"
                style={{ minHeight: '216px' }}
              >
                <SText
                  color="#ccc"
                  fontSize={isMobile ? '16px' : '24px'}
                  fontWeight={400}
                >
                  게시글이 존재하지 않아요
                </SText>
              </Flex>
            </NoArticleDiv>
          ) : (
            <List>
              {shouldShowPinnedSlot && !isMobile ? (
                <PinnedContentWrapper>
                  <PinnedCardSlot>
                    {pinnedArticle
                      ? renderArticleCard(pinnedArticle)
                      : renderPinnedPlaceholder()}
                  </PinnedCardSlot>
                  <PinnedDivider />
                  <RightArticlesGrid>
                    {listArticles.map(renderArticleCard)}
                  </RightArticlesGrid>
                </PinnedContentWrapper>
              ) : (
                <ContentWrapper>
                  {showPinnedSlot &&
                    !pinnedArticle &&
                    isMobile &&
                    renderPinnedPlaceholder()}
                  {mobileArticles.map(renderArticleCard)}
                </ContentWrapper>
              )}
            </List>
          )}
        </Suspense>
      )}
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

const ActionGroup = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;

  @media (max-width: ${breakpoints.mobile}px) {
    gap: 6px;
  }
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

const ToggleButton = styled.button<{ isExpanded: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  min-width: 80px;
  height: 28px;
  padding: 7px 12px;
  border: none;
  border-radius: 10px;
  background: #fff;
  color: #333;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: ${(props) =>
    props.isExpanded
      ? '3px 6px 8.3px 0px rgba(63, 63, 77, 0.07) inset'
      : 'none'};

  @media (max-width: ${breakpoints.mobile}px) {
    min-width: 58px;
    height: 28px;
    padding: 7px 8px;
    font-size: 10px;
  }
`;

const ToggleCaret = styled.span<{ isExpanded: boolean }>`
  width: 0;
  height: 0;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 5px solid #333;
  transform: rotate(${(props) => (props.isExpanded ? '180deg' : '0deg')});
  transition: transform 0.2s ease;
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
  grid-template-columns: repeat(3, minmax(0, 1fr));
  width: calc(100% - 80px);
  max-width: 592px;
  height: 216px;
  gap: 8px;
  top: 0px;
  left: 50%;

  @media (max-width: ${breakpoints.mobile}px) {
    display: grid;
    grid-template-columns: repeat(2, calc(50% - 4px));
    gap: 8px;
    width: calc(100% - 40px);
    height: 278px;
  }
`;

const PinnedContentWrapper = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 1px minmax(0, 3fr);
  column-gap: 8px;
  width: calc(100% - 80px);
  max-width: 801px;
  height: 216px;
  align-items: start;

  @media (max-width: ${breakpoints.mobile}px) {
    display: grid;
    grid-template-columns: repeat(2, calc(50% - 4px));
    gap: 8px;
    width: calc(100% - 40px);
    height: 278px;
  }
`;

const PinnedCardSlot = styled.div`
  width: 100%;
`;

const PinnedPlaceholderCard = styled.div`
  display: flex;
  align-items: flex-start;
  width: 100%;
  height: 104px;
  padding: 20px;
  border: 1px solid #cdcfff;
  border-radius: 10px;
  background: #fff;
  box-shadow: 5px 7px 11.6px 0px rgba(63, 63, 77, 0.07);
  box-sizing: border-box;

  @media (max-width: ${breakpoints.mobile}px) {
    height: 86px;
    padding: 12px 14px;
  }
`;

const PinnedPlaceholderContent = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
  padding-right: 8px;
`;

const PinnedDivider = styled.div`
  width: 1px;
  height: 104px;
  background: #cdcfff;
`;

const RightArticlesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px 8px;
  min-width: 0;
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
  width: 100%;
  min-width: 0;

  @media (max-width: ${breakpoints.mobile}px) {
    width: 100%;
  }
`;
