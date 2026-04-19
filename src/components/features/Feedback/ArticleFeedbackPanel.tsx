import { Flex } from '@/components/commons/Flex';
import { Spacer } from '@/components/commons/Spacer';

import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';
import Prism from 'prismjs';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-rust';

import styled from '@emotion/styled';

interface ArticleFeedbackPanelArgs {
  feedback: string;
  isComplete: boolean;
  isStreaming: boolean;
}

const LANG_ALIASES: Record<string, string> = {
  'c++': 'cpp',
  'c#': 'csharp',
  js: 'javascript',
  ts: 'typescript',
  py: 'python',
};

type CodeProps = {
  children?: React.ReactNode;
  className?: string;
};

function CodeBlock({ children, className }: CodeProps) {
  const match = /language-([\w+#-]+)/.exec(className || '');
  if (match) {
    const rawLang = match[1].toLowerCase();
    const lang = LANG_ALIASES[rawLang] ?? rawLang;
    const code = String(children).replace(/\n$/, '');
    const grammar = Prism.languages[lang];
    if (grammar) {
      const highlighted = Prism.highlight(code, grammar, lang);
      return (
        <code
          className={`language-${lang}`}
          dangerouslySetInnerHTML={{ __html: highlighted }}
        />
      );
    }
  }
  return <code className={className}>{children}</code>;
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
          <ReactMarkdown components={{ code: CodeBlock as Components['code'] }}>
            {feedback}
          </ReactMarkdown>
        </MarkdownWrapper>
      </Flex>
    </>
  );
};

export default ArticleFeedbackPanel;

const MarkdownWrapper = styled.div`
  font-size: 14px;
  line-height: 1.7;
  color: #333;
  width: 100%;

  h1,
  h2,
  h3 {
    font-weight: 700;
    margin-top: 20px;
    margin-bottom: 8px;
    color: #111;
    line-height: 1.4;
  }

  h1 {
    font-size: 22px;
  }

  h2 {
    font-size: 20px;
  }

  h3 {
    font-size: 17px;
    border-bottom: 1px solid #eee;
    padding-bottom: 4px;
  }

  strong,
  b {
    font-weight: 700;
    color: #111;
  }

  em,
  i {
    font-style: italic;
    color: #555;
  }

  p {
    margin-bottom: 10px;
  }

  ul,
  ol {
    padding-left: 20px;
    margin-bottom: 10px;
  }

  li {
    margin-bottom: 6px;
    line-height: 1.6;
  }

  code {
    background-color: rgba(135, 131, 120, 0.15);
    padding: 2px 5px;
    border-radius: 4px;
    font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
    font-size: 0.88em;
    color: #c7254e;
  }

  pre {
    background-color: #f6f8fa;
    padding: 16px;
    border-radius: 8px;
    overflow-x: auto;
    margin-bottom: 14px;
    border: 1px solid #e1e4e8;

    code {
      background-color: transparent;
      padding: 0;
      color: #24292e;
      font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
      font-size: 13px;
      line-height: 1.6;
    }
  }

  .token.comment,
  .token.prolog,
  .token.doctype,
  .token.cdata {
    color: #6a737d;
    font-style: italic;
  }
  .token.punctuation {
    color: #24292e;
  }
  .token.keyword,
  .token.operator,
  .token.selector {
    color: #d73a49;
  }
  .token.boolean,
  .token.number,
  .token.constant,
  .token.symbol {
    color: #005cc5;
  }
  .token.string,
  .token.char,
  .token.attr-value,
  .token.regex {
    color: #22863a;
  }
  .token.function,
  .token.class-name,
  .token.attr-name {
    color: #6f42c1;
  }
  .token.builtin {
    color: #005cc5;
  }
  .token.variable {
    color: #e36209;
  }

  hr {
    border: none;
    border-top: 1px solid #e5e5e5;
    margin: 20px 0;
  }

  blockquote {
    border-left: 3px solid #d0d7de;
    padding-left: 14px;
    color: #57606a;
    margin: 10px 0;
  }
`;
