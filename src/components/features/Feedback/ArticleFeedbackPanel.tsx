import { Flex } from '@/components/commons/Flex';
import { Spacer } from '@/components/commons/Spacer';

import ReactMarkdown from 'react-markdown';

import styled from '@emotion/styled';

interface ArticleFeedbackPanelArgs {
  feedback: string;
  isComplete: boolean;
  isStreaming: boolean;
}

const ArticleFeedbackPanel = ({
  feedback,
  isComplete,
  isStreaming,
}: ArticleFeedbackPanelArgs) => {
  if (!(isComplete || isStreaming)) return null;

  return (
    <>
      <Flex direction="column" align="flex-start" justify="center">
        <Flex direction="row" align="center" justify="space-between"></Flex>
        <Spacer h={12} />
        <MarkdownWrapper>
          <ReactMarkdown>{feedback}</ReactMarkdown>
        </MarkdownWrapper>
      </Flex>
    </>
  );
};

export default ArticleFeedbackPanel;

const MarkdownWrapper = styled.div`
  font-size: 14px;
  line-height: 1.6;
  color: #333;

  h1,
  h2,
  h3 {
    font-weight: 700;
    margin-bottom: 8px;
    color: #000;
  }

  h3 {
    font-size: 18px;
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
