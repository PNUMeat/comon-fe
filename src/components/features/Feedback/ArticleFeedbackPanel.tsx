import { Box } from '@/components/commons/Box';
import { Flex } from '@/components/commons/Flex';
import { SText } from '@/components/commons/SText';
import { Spacer } from '@/components/commons/Spacer';

import ReactMarkdown from 'react-markdown';

import styled from '@emotion/styled';

interface ArticleFeedbackPanelArgs {
  feedback: string;
  isStreaming: boolean;
}

const ArticleFeedbackPanel = ({
  feedback,
  isStreaming,
}: ArticleFeedbackPanelArgs) => {
  return (
    <Box width="100%" borderRadius="10px" padding="30px">
      <Flex direction="column" align="flex-start" justify="center">
        <Flex direction="row" align="center" justify="space-between">
          <SText fontSize="24px" fontWeight={700}>
            AI 코드 리뷰
          </SText>

          {isStreaming && (
            <StreamingBadge>
              <Dot />
              <Dot />
              <Dot />
              <SText fontSize="11px" style={{ marginLeft: 6 }}>
                코드를 분석하는 중이에요...
              </SText>
            </StreamingBadge>
          )}
        </Flex>

        <Spacer h={12} />
        {feedback ? (
          <MarkdownWrapper>
            <ReactMarkdown>{feedback}</ReactMarkdown>
          </MarkdownWrapper>
        ) : (
          <SText fontSize="13px" color="#999">
            아직 도착한 피드백이 없어요. 잠시만 기다려 주세요.
          </SText>
        )}
      </Flex>
    </Box>
  );
};

export default ArticleFeedbackPanel;

const MarkdownWrapper = styled.div`
  margin-top: 4px;
  font-size: 18px;
  line-height: 1.6;
  color: #333;

  h1,
  h2,
  h3 {
    font-weight: 700;
    margin-top: 35px;
    margin-bottom: 8px;
    color: #000;
  }

  h3 {
    font-size: 20px;
  }

  p {
    margin-bottom: 8px;
    white-space: pre-wrap;
  }

  ul,
  ol {
    padding-left: 20px;
    margin-bottom: 8px;
  }

  li {
    margin-bottom: 4px;
  }

  code {
    background-color: rgba(135, 131, 120, 0.15);
    padding: 2px 4px;
    border-radius: 4px;
    font-family: monospace;
    font-size: 0.9em;
    color: #eb5757;
  }

  pre {
    background-color: #f6f8fa;
    padding: 12px;
    border-radius: 8px;
    overflow-x: auto;

    code {
      background-color: transparent;
      padding: 0;
      color: inherit;
    }
  }
`;

const StreamingBadge = styled.div`
  display: flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 999px;
  background: rgba(127, 92, 255, 0.08);
`;

const Dot = styled.span`
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #7f5cff;
  margin-right: 2px;
  animation: blink 1.2s infinite ease-in-out;

  &:nth-of-type(2) {
    animation-delay: 0.15s;
  }
  &:nth-of-type(3) {
    animation-delay: 0.3s;
  }

  @keyframes blink {
    0% {
      opacity: 0.2;
    }
    20% {
      opacity: 1;
    }
    100% {
      opacity: 0.2;
    }
  }
`;
