import { viewStyle } from '@/utils/viewStyle';

import { ImageNode } from '@/components/features/Post/nodes/ImageNode';
import { CodeActionPlugin } from '@/components/features/Post/plugins/CodeActionPlugin';
import { DraggablePlugin } from '@/components/features/Post/plugins/DraggablePlugin';
import { FloatingLinkEditorPlugin } from '@/components/features/Post/plugins/FloatingLinkEditorPlugin';
import { GrabContentPlugin } from '@/components/features/Post/plugins/GrabContentPlugin';
import { HighlightCodePlugin } from '@/components/features/Post/plugins/HighlightCodePlugin';
import { ImagePlugin } from '@/components/features/Post/plugins/ImagePlugin';
import { InitContentPlugin } from '@/components/features/Post/plugins/InitContentPlugin';
import { MaxIndentPlugin } from '@/components/features/Post/plugins/MaxIndentPlugin';
import { ToolbarPlugin } from '@/components/features/Post/plugins/ToolbarPlugin';
import { SHORTCUTS } from '@/components/features/Post/plugins/markdownShortcuts';
import {
  INSERT_IMAGE_COMMAND,
  InsertImagePayload,
} from '@/components/features/Post/utils';

import {
  ChangeEvent,
  Fragment,
  ReactNode,
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useState,
} from 'react';

import { postImagesAtom } from '@/store/posting';
import styled from '@emotion/styled';
import { CodeHighlightNode, CodeNode } from '@lexical/code';
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
import { addClassNamesToElement } from '@lexical/utils';
import { useAtom, useSetAtom } from 'jotai';
import {
  $isLineBreakNode,
  DOMExportOutput,
  LexicalEditor,
  LexicalNode,
} from 'lexical';

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
  code: 'codeblock',
  codeHighlight: {
    atrule: 'tokenAttr',
    attr: 'tokenAttr',
    boolean: 'tokenProperty',
    builtin: 'tokenSelector',
    cdata: 'tokenComment',
    char: 'tokenSelector',
    class: 'tokenFunction',
    'class-name': 'tokenFunction',
    comment: 'tokenComment',
    constant: 'tokenProperty',
    deleted: 'tokenProperty',
    doctype: 'tokenComment',
    entity: 'tokenOperator',
    function: 'tokenFunction',
    important: 'tokenVariable',
    inserted: 'tokenSelector',
    keyword: 'tokenAttr',
    namespace: 'tokenVariable',
    number: 'tokenProperty',
    operator: 'tokenOperator',
    prolog: 'tokenComment',
    property: 'tokenProperty',
    punctuation: 'tokenPunctuation',
    regex: 'tokenVariable',
    selector: 'tokenSelector',
    string: 'tokenSelector',
    symbol: 'tokenProperty',
    tag: 'tokenProperty',
    url: 'tokenOperator',
    variable: 'tokenVariable',
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
    CodeNode,
    CodeHighlightNode,
  ],
  html: {
    export: new Map([
      [
        CodeNode,
        (_editor: LexicalEditor, node: LexicalNode): DOMExportOutput => {
          const codeNode = node as CodeNode;
          const element = document.createElement('pre');
          addClassNamesToElement(element, 'codeblock');
          element.setAttribute('spellcheck', 'false');
          const language = codeNode.getLanguage();

          if (language) {
            element.setAttribute('data-highlight-language', language);
          }

          const children = codeNode.getChildren();
          const childrenLength = children.length;

          let gutter = '1';
          let count = 1;
          for (let i = 0; i < childrenLength; i++) {
            if ($isLineBreakNode(children[i])) {
              gutter += '\n' + ++count;
            }
          }

          element.setAttribute('data-gutter', gutter);
          return { element };
        },
      ],
    ]),
  },
  editorState: undefined,
  onError,
};

const EditorContainer = styled.div`
  position: relative;
  padding: 20px 50px;
  // padding: 20px 20px;
  ${viewStyle}
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
  // drag event
  z-index: 20;
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
  top: 24px;
`;

const useDetectImageDeletion = () => {
  const [editor] = useLexicalComposerContext();
  const setImages = useSetAtom(postImagesAtom);

  useEffect(() => {
    const unregisterMutationListener = editor.registerMutationListener(
      ImageNode,
      (mutations) => {
        // mutations.forEach((mutation, nodeKey) => {
        mutations.forEach((mutation) => {
          if (mutation === 'destroyed') {
            setImages([]);
          }
        });
      }
    );

    return () => {
      unregisterMutationListener();
    };
  }, [editor]);
};

const PostWriteSection = forwardRef<
  HTMLDivElement,
  {
    children: React.ReactNode;
  }
>(({ children }, ref) => {
  const [editor] = useLexicalComposerContext();
  const [images, setImages] = useAtom(postImagesAtom);
  useDetectImageDeletion();

  const onPaste = (event: React.ClipboardEvent<HTMLDivElement>) => {
    const items = event.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.startsWith('image/')) {
        const file = items[i].getAsFile();
        // TODO: 이미지 여러개 들어갈때 수정
        if (file && images.length === 0) {
          const imageURL = URL.createObjectURL(file);
          const imgPayload: InsertImagePayload = {
            altText: '붙여넣은 이미지',
            maxWidth: 600,
            src: imageURL,
          };
          editor.dispatchCommand(INSERT_IMAGE_COMMAND, imgPayload);
          setImages([file]);
        }
        break;
      }
    }
  };

  const onClick = useCallback(() => {
    editor.focus();
  }, []);

  return (
    <EditorContainer
      ref={ref as React.Ref<HTMLDivElement>}
      onClick={onClick}
      onPaste={onPaste}
    >
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

const PostSectionWrap: React.FC<{
  shouldHighlight?: boolean;
  children: ReactNode;
}> = ({ shouldHighlight, children }) => {
  const [editor] = useLexicalComposerContext();
  const [images, setImages] = useAtom(postImagesAtom);

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      const files = event.dataTransfer.files;
      if (files.length > 0) {
        const file = files[0];
        if (file.type.startsWith('image/') && images.length === 0) {
          const imageURL = URL.createObjectURL(file);
          const imgPayload: InsertImagePayload = {
            altText: '붙여넣은 이미지',
            maxWidth: 600,
            src: imageURL,
          };
          editor.dispatchCommand(INSERT_IMAGE_COMMAND, imgPayload);
          setImages([file]);
        }
      }
    },
    [images]
  );

  const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  return (
    <PostWrap
      shouldHighlight={shouldHighlight}
      onDrop={onDrop}
      onDragOver={onDragOver}
    >
      {children}
    </PostWrap>
  );
};

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
      <PostSectionWrap shouldHighlight={Boolean(setTag)}>
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
        <PostWriteSection ref={onRef}>
          <RichTextPlugin
            contentEditable={<ContentEditable className={'content-editable'} />}
            ErrorBoundary={LexicalErrorBoundary}
            placeholder={
              <EditorPlaceholder>내용을 작성해주세요</EditorPlaceholder>
            }
          />
          {floatingAnchorElem && (
            <Fragment>
              <FloatingLinkEditorPlugin
                anchorElem={floatingAnchorElem}
                isLinkEditMode={isLinkEditMode}
                setIsLinkEditMode={setIsLinkEditMode}
              />
              <CodeActionPlugin anchorElem={floatingAnchorElem} />
              <DraggablePlugin anchorElem={floatingAnchorElem} />
            </Fragment>
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
          <HighlightCodePlugin />
        </PostWriteSection>
      </PostSectionWrap>
    </LexicalComposer>
  );
};

// 이거 안하면 React DevTools에서 ForwardRef라고 나옴
PostEditor.displayName = 'PostEditor';
export default memo(PostEditor);
