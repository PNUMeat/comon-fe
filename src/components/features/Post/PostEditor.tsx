import { ImageNode } from '@/components/features/Post/nodes/ImageNode';
import { FloatingLinkEditorPlugin } from '@/components/features/Post/plugins/FloatingLinkEditorPlugin';
import { GrabContentPlugin } from '@/components/features/Post/plugins/GrabContentPlugin';
import { ImagePlugin } from '@/components/features/Post/plugins/ImagePlugin';
import { InitContentPlugin } from '@/components/features/Post/plugins/InitContentPlugin';
import { MaxIndentPlugin } from '@/components/features/Post/plugins/MaxIndentPlugin';
import { ToolbarPlugin } from '@/components/features/Post/plugins/ToolbarPlugin';
import { SHORTCUTS } from '@/components/features/Post/plugins/markdownShortcuts';

import { ChangeEvent, forwardRef, memo, useCallback, useState } from 'react';

import styled from '@emotion/styled';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { ListItemNode, ListNode } from '@lexical/list';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { TabIndentationPlugin } from '@lexical/react/LexicalTabIndentationPlugin';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';

import './editor.css';

const onError = (error: Error) => console.error(error);

const editorTheme = {
  image: 'editor-image',
  link: 'editor-link',
  list: {
    nested: {
      listitem: 'nested',
    },
    listitem: 'editor-listitem',
  },
  quote: 'editor-quote',
  text: {
    bold: 'editor-text-bold',
    italic: 'editor-text-italic',
    overflowed: 'editor-text-overflowed',
    hashtag: 'editor-text-hashtag',
    underline: 'editor-text-underline',
    strikethrough: 'editor-text-strikethrough',
    underlineStrikethrough: 'editor-text-underlineStrikethrough',
    code: 'editor-text-code',
  },
};

const initialConfig = {
  namespace: 'comon',
  theme: editorTheme,
  nodes: [
    ImageNode,
    AutoLinkNode,
    LinkNode,
    HeadingNode,
    QuoteNode,
    ListNode,
    ListItemNode,
  ],
  editorState: undefined,
  onError,
};

const EditorContainer = styled.div`
  position: relative;
  padding: 20px 50px;
  & {
    h1 {
      font-size: 32px;
      font-weight: 600;
      line-height: 1.2;
    }

    h2 {
      font-size: 28px;
      font-weight: 500;
      line-height: 1.3;
    }

    h3 {
      font-size: 24px;
      font-weight: 500;
      line-height: 1.4;
    }

    h4 {
      font-size: 20px;
      font-weight: 500;
      line-height: 1.5;
    }

    h5 {
      font-size: 16px;
      font-weight: 500;
      line-height: 1.6;
      color: rgba(55, 53, 47, 0.8);
    }

    h6 {
      font-size: 14px;
      font-weight: 500;
      line-height: 1.6;
      color: rgba(55, 53, 47, 0.6);
    }

    p + h1,
    p + h2,
    p + h3,
    p + h4,
    p + h5,
    p + h6 {
      margin-top: 32px;
    }

    .editor-text-italic {
      font-style: italic;
    }

    .editor-text-underline {
      text-decoration: underline;
    }

    .editor-text-strikethrough {
      text-decoration: line-through;
    }

    .editor-quote {
      margin: 0;
      margin-left: 20px;
      font-size: 15px;
      color: rgb(101, 103, 107);
      border-left-color: rgb(206, 208, 212);
      border-left-width: 4px;
      border-left-style: solid;
      padding-left: 16px;
    }

    ul,
    ol {
      padding: 0;
      margin: 0;
      margin-left: 16px;
    }

    .editor-listitem {
      margin: 8px 32px 8px 32px;
    }

    .nested {
      list-style-type: none;
    }
  }

  & ul {
    list-style-type: disc;
  }

  & ul ul {
    list-style-type: circle;
  }

  & ul ul ul {
    list-style-type: square;
  }

  & ul ul ul ul {
    list-style-type: disc;
  }

  & ul ul ul ul ul {
    list-style-type: circle;
  }

  & ul ul ul ul ul ul {
    list-style-type: square;
  }

  & ol {
    list-style-type: decimal;
  }

  & ol ol {
    list-style-type: lower-alpha;
  }

  & ol ol ol {
    list-style-type: lower-roman;
  }

  & ol ol ol ol {
    list-style-type: decimal;
  }

  & ol ol ol ol ol {
    list-style-type: lower-alpha;
  }

  & ol ol ol ol ol ol {
    list-style-type: lower-roman;
  }
`;

const PostWrap = styled.div<{ shouldHighlight?: boolean }>`
  width: 100%;
  min-height: 867px;
  flex-shrink: 0;
  border-radius: 20px;
  border: 1px solid #cdcfff;
  padding: 0 30px;
  box-sizing: border-box;
  position: relative;
  ${(props) =>
    props.shouldHighlight
      ? `
    &::before {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 20px;
      padding: 1px;
      background: linear-gradient(45deg, #ff5080, #ffd482, #ff377f);
      -webkit-mask:
        linear-gradient(#fff 0 0) content-box,
        linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask:
        linear-gradient(#fff 0 0) content-box,
        linear-gradient(#fff 0 0);
      mask-composite: exclude;
      z-index: -1;
      pointer-events: none;
    }
  `
      : ''}
`;

const EditorPlaceholder = styled.div`
  position: absolute;
  pointer-events: none;
  user-select: none;
  color: #ccc;
  top: 18px;
`;

const PostContainer = forwardRef<
  HTMLDivElement,
  {
    children: React.ReactNode;
  }
>(({ children }, ref) => {
  const [editor] = useLexicalComposerContext();

  const onClick = useCallback(() => {
    editor.focus();
  }, []);

  return (
    <EditorContainer ref={ref as React.Ref<HTMLDivElement>} onClick={onClick}>
      {children}
    </EditorContainer>
  );
});

const TitleInput = styled.input`
  font-size: 32px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  border: none;
  padding: 0 10px;
  margin: 40px 0;
  outline: none;
  width: calc(100% - 20px);
  height: calc(100% - 1px);

  ::placeholder {
    color: #ccc;
  }
`;

const PostEditor: React.FC<{
  forwardTitle?: (title: string) => void;
  forwardContent?: (content: string) => void;
  content?: string;
  title?: string;
  tag?: string;
  setTag?: (tag: string) => void;
  // TODO : 링크 생성 후 다른 화면을 클릭하면 링크 에딧 탭이 꺼져야 사용이 자연스러운데, 내용이 있어야만 selection이 업데이트 됨
  //  임시방편이다.
  // }> = ({ forwardContent, content = '<br/>'.repeat(35) }) => {
}> = ({ forwardContent, forwardTitle, content, setTag, title, tag }) => {
  const [floatingAnchorElem, setFloatingAnchorElem] =
    useState<HTMLDivElement | null>(null);
  const [isLinkEditMode, setIsLinkEditMode] = useState<boolean>(false);

  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem);
    }
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <PostWrap
        shouldHighlight={Boolean(setTag)}
        // onClick={() => console.log('??')}
      >
        <TitleInput
          type={'text'}
          placeholder={setTag ? '주제를 입력하세요' : '제목을 입력하세요'}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            if (forwardTitle) {
              forwardTitle(e.target.value);
            }
          }}
          defaultValue={title}
        />
        <ToolbarPlugin
          setIsLinkEditMode={setIsLinkEditMode}
          setTag={setTag}
          articleCategory={tag}
        />
        <PostContainer ref={onRef}>
          <RichTextPlugin
            contentEditable={<ContentEditable className={'content-editable'} />}
            ErrorBoundary={LexicalErrorBoundary}
            placeholder={
              <EditorPlaceholder>내용을 작성해주세요</EditorPlaceholder>
            }
          />
          {floatingAnchorElem && (
            <FloatingLinkEditorPlugin
              anchorElem={floatingAnchorElem}
              isLinkEditMode={isLinkEditMode}
              setIsLinkEditMode={setIsLinkEditMode}
            />
          )}
          <ImagePlugin />
          <LinkPlugin />
          <HistoryPlugin />
          {content && <InitContentPlugin content={content} />}
          {forwardContent && (
            <GrabContentPlugin forwardContent={forwardContent} />
          )}
          <MarkdownShortcutPlugin transformers={SHORTCUTS} />
          <ListPlugin />
          <TabIndentationPlugin />
          <MaxIndentPlugin />
        </PostContainer>
      </PostWrap>
    </LexicalComposer>
  );
};

// 이거 안하면 React DevTools에서 ForwardRef라고 나옴
PostEditor.displayName = 'PostEditor';
export default memo(PostEditor);
