import { ImageNode } from '@/components/features/Post/nodes/ImageNode';
import { FloatingLinkEditorPlugin } from '@/components/features/Post/plugins/FloatingLinkEditorPlugin';
import { GrabContentPlugin } from '@/components/features/Post/plugins/GrabContentPlugin';
import { ImagePlugin } from '@/components/features/Post/plugins/ImagePlugin';
import { InitContentPlugin } from '@/components/features/Post/plugins/InitContentPlugin';
import { ToolbarPlugin } from '@/components/features/Post/plugins/ToolbarPlugin';

import { ChangeEvent, forwardRef, memo, useCallback, useState } from 'react';

import { postTitleAtom } from '@/store/posting';
import styled from '@emotion/styled';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { useSetAtom } from 'jotai';

import './editor.css';

const onError = (error: Error) => console.error(error);

const editorTheme = {
  image: 'editor-image',
  link: 'editor-link',
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
  nodes: [ImageNode, AutoLinkNode, LinkNode],
  onError,
};

const EditorContainer = styled.div`
  position: relative;
  padding: 20px 50px;
  // min-height: 600px;
`;

const PostWrap = styled.div`
  width: 100%;
  min-height: 867px;
  flex-shrink: 0;
  border-radius: 20px;
  border: 1px solid #cdcfff;
  padding: 0 30px;
  box-sizing: border-box;
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

const PostEditor: React.FC<{
  forwardContent?: (content: string) => void;
  content?: string;
  // TODO : 링크 생성 후 다른 화면을 클릭하면 링크 에딧 탭이 꺼져야 사용이 자연스러운데, 내용이 있어야만 selection이 업데이트 됨
  //  임시방편이다.
}> = ({ forwardContent, content = '<br/>'.repeat(35) }) => {
  const [floatingAnchorElem, setFloatingAnchorElem] =
    useState<HTMLDivElement | null>(null);
  const [isLinkEditMode, setIsLinkEditMode] = useState<boolean>(false);
  const setPostTitle = useSetAtom(postTitleAtom);

  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem);
    }
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <PostWrap>
        <input
          type={'text'}
          placeholder={'제목을 입력하세요'}
          style={{
            fontSize: '32px',
            fontStyle: 'normal',
            fontWeight: '700',
            lineHeight: 'normal',
            color: '#CCC',
            border: 'none',
            margin: '40px 10px',
          }}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setPostTitle(e.target.value)
          }
        />
        <ToolbarPlugin setIsLinkEditMode={setIsLinkEditMode} />
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
        </PostContainer>
      </PostWrap>
    </LexicalComposer>
  );
};

// 이거 안하면 React DevTools에서 ForwardRef라고 나옴
PostEditor.displayName = 'PostEditor';
export default memo(PostEditor);
