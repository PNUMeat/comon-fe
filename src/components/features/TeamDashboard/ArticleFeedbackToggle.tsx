import { useArticleFeedback } from '@/hooks/useArticleFeedback';

import ArticleFeedbackPanel from '@/components/features/Feedback/ArticleFeedbackPanel';

import { useState } from 'react';

import { breakpoints } from '@/constants/breakpoints';
import styled from '@emotion/styled';

interface ArticleFeedbackToggleProps {
  articleId: number;
}

export const ArticleFeedbackToggle = ({
  articleId,
}: ArticleFeedbackToggleProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { feedback, isError, isLoading, isStreaming, isComplete } =
    useArticleFeedback(articleId);

  return (
    <Wrapper>
      <ToggleButton
        type="button"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <Caret isOpen={isOpen} />
        AI 피드백 다시보기
      </ToggleButton>
      {isOpen && (
        <Content>
          {isLoading && <Message>AI 피드백을 불러오는 중이에요.</Message>}
          {isError && <Message>AI 피드백을 불러오지 못했어요.</Message>}
          {!isLoading && !isError && !feedback && (
            <Message>아직 저장된 AI 피드백이 없어요.</Message>
          )}
          {feedback && (
            <ArticleFeedbackPanel
              feedback={feedback}
              isComplete={isComplete}
              isStreaming={isStreaming}
            />
          )}
        </Content>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.section`
  width: 100%;
  padding: 24px 16px;
  box-sizing: border-box;

  @media (max-width: ${breakpoints.mobile}px) {
    padding: 18px 8px;
  }
`;

const ToggleButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  border: none;
  background: transparent;
  color: #333;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;

  @media (max-width: ${breakpoints.mobile}px) {
    font-size: 15px;
  }
`;

const Caret = styled.span<{ isOpen: boolean }>`
  width: 0;
  height: 0;
  border-top: 5px solid transparent;
  border-bottom: 5px solid transparent;
  border-left: 7px solid #333;
  transform: rotate(${({ isOpen }) => (isOpen ? '90deg' : '0deg')});
  transition: transform 0.2s ease;
`;

const Content = styled.div`
  margin-top: 18px;
  padding-left: 17px;
`;

const Message = styled.p`
  margin: 0;
  color: #777;
  font-size: 14px;
  line-height: 1.6;
`;
