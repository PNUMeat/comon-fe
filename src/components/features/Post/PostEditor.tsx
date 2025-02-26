import { viewStyle } from '@/utils/viewStyle';

import { useImageCompressor } from '@/hooks/useImageCompressor.ts';

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
  useRef,
  useState,
} from 'react';

import { breakpoints } from '@/constants/breakpoints';
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
import { useAtom } from 'jotai';
import {
  $getNearestNodeFromDOMNode,
  $getNodeByKey,
  $getRoot,
  $isLineBreakNode,
  DOMExportOutput,
  EditorThemeClasses,
  LexicalEditor,
  LexicalNode,
  TextNode,
} from 'lexical';

import './editor.css';

const onError = (error: Error) => console.error(error);

const editorTheme: EditorThemeClasses = {
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
    atrule: 'o', // 'tokenAttr'
    attr: 'o', // 'tokenAttr'
    boolean: 'p', // 'tokenProperty'
    builtin: 'q', // 'tokenSelector'
    cdata: 'r', // 'tokenComment'
    char: 'q', // 'tokenSelector'
    class: 's', // 'tokenFunction'
    'class-name': 's', // 'tokenFunction'
    comment: 'r', // 'tokenComment'
    constant: 'p', // 'tokenProperty'
    deleted: 'p', // 'tokenProperty'
    doctype: 'r', // 'tokenComment'
    entity: 't', // 'tokenOperator'
    function: 's', // 'tokenFunction'
    important: 'u', // 'tokenVariable'
    inserted: 'q', // 'tokenSelector'
    keyword: 'o', // 'tokenAttr'
    namespace: 'u', // 'tokenVariable'
    number: 'p', // 'tokenProperty'
    operator: 't', // 'tokenOperator'
    prolog: 'r', // 'tokenComment'
    property: 'p', // 'tokenProperty'
    punctuation: 'v', // 'tokenPunctuation'
    regex: 'u', // 'tokenVariable'
    selector: 'q', // 'tokenSelector'
    string: 'q', // 'tokenSelector'
    symbol: 'p', // 'tokenProperty'
    tag: 'p', // 'tokenProperty'
    url: 't', // 'tokenOperator'
    variable: 'u', // 'tokenVariable'
  },
};

type ExportHandler = (
  _editor: LexicalEditor,
  node: LexicalNode
) => DOMExportOutput;

type ConvertNode = typeof CodeNode | typeof TextNode | typeof CodeHighlightNode;

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
    export: new Map<ConvertNode, ExportHandler>([
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
      [
        CodeHighlightNode,
        (_editor: LexicalEditor, node: LexicalNode): DOMExportOutput => {
          const highlightNode = node as CodeHighlightNode;
          const element = document.createElement('span');

          element.textContent = highlightNode.getTextContent();
          const type = highlightNode.getHighlightType();
          if (type) {
            const highlights = editorTheme.codeHighlight as Record<
              string,
              string
            >;
            const className = highlights[type];
            if (className) {
              element.className = className;
            }
          }

          return { element };
        },
      ],
      [
        TextNode,
        (_editor: LexicalEditor, node: LexicalNode): DOMExportOutput => {
          const textNode = node as TextNode;
          const element = document.createElement('span');
          const format = textNode.getFormat();
          const style = textNode.getStyle();

          if (format === 1) {
            element.className = 'editor-text-bold';
          } else if (format === 2) {
            element.className = 'editor-text-italic';
          } else if (format === 3) {
            element.className = 'editor-text-bold editor-text-italic';
          } else if (format === 4) {
            element.className = 'editor-text-strikethrough';
          } else if (format === 5) {
            element.className = 'editor-text-bold editor-text-strikethrough';
          } else if (format === 6) {
            element.className = 'editor-text-italic editor-text-strikethrough';
          } else if (format === 7) {
            element.className =
              'editor-text-bold editor-text-italic editor-text-strikethrough';
          }

          element.textContent = textNode.getTextContent();
          element.setAttribute('style', style);

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
  min-height: 700px;
  ${viewStyle}

  .codeblock {
    max-width: 100%;
  }

  @media (max-width: ${breakpoints.mobile}px) {
    min-height: 400px;
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

  @media (max-width: ${breakpoints.mobile}px) {
    padding: 0 10px;
    width: calc(100% - 12px);
    min-height: 500px;
  }
`;

const EditorPlaceholder = styled.div`
  position: absolute;
  pointer-events: none;
  user-select: none;
  color: #ccc;
  top: 24px;
  left: 50px;

  @media (max-width: ${breakpoints.mobile}px) {
    size: 14px;
    left: 20px;
  }
`;

const blobUrlToFile = async (blobUrl: string, fileName: string) => {
  return await fetch(blobUrl, {
    mode: 'cors',
    // headers: {
    //   'Access-Control-Allow-Origin': 'https://test.codemonster.site/',
    //   Origin: 'https://test.codemonster.site/',
    // },
  })
    .then((res) => res.blob())
    .then((blob) => new File([blob], fileName, { type: blob.type }))
    .catch(async (error) => {
      console.error('Error converting blob URL to file:', error);
      // throw error;
      return await fetch(
        'https://d1onwxr2n696de.cloudfront.net/article/00cd8b80-6698-436d-8041-fe539310efb9.png',
        {
          mode: 'cors',
        }
      )
        .then((res) => res.blob())
        .then((blob) => new File([blob], fileName, { type: blob.type }));
    });
};

const findImgElement = (element: HTMLElement): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const maxAttempts = 10; // 10 * 100ms
    let attempts = 0;

    const intervalId = setInterval(() => {
      attempts++;
      const img = element.querySelector('img');

      if (img) {
        clearInterval(intervalId);
        resolve(img);
      } else if (attempts >= maxAttempts) {
        clearInterval(intervalId);
        reject(new Error('Failed to find img element after max attempts'));
      }
    }, 100);
  });
};

const useDetectImageMutation = () => {
  const [editor] = useLexicalComposerContext();
  const [images, setImages] = useAtom(postImagesAtom);
  const { compressImage } = useImageCompressor({ quality: 1, maxSizeMb: 1 });
  const firstNodeKey = useRef('');

  useEffect(() => {
    Promise.resolve().then(() => {
      // if (firstNodeKey.current !== '') {
      console.log('???');
      editor.read(() => {
        const rootElement = editor.getRootElement();
        if (!rootElement) {
          return;
        }
        const imgs = rootElement.querySelectorAll('.editor-image');
        const imgNodes = Array.from(imgs)
          .map((img) => $getNearestNodeFromDOMNode(img))
          .filter((imgNode) => imgNode !== null);

        if (imgNodes.length > 0) {
          firstNodeKey.current = imgNodes[0]?.getKey();
        }
      });
      // }
    });
  }, [editor]);

  useEffect(() => {
    const unregisterMutationListener = editor.registerMutationListener(
      ImageNode,
      (mutations) => {
        mutations.forEach((mutation, nodeKey) => {
          if (mutation === 'created') {
            editor.update(() => {
              const element = editor.getElementByKey(nodeKey);
              if (!element) {
                return;
              }

              const node = $getNodeByKey(nodeKey);
              if (!node) {
                return;
              }

              console.log('nodeKey', firstNodeKey.current, images);
              // if (images.length === 0 && firstNodeKey.current === '') {
              if (firstNodeKey.current === '') {
                firstNodeKey.current = nodeKey;
              }
              // 이미지 최대 하나로 제한
              else {
                if (nodeKey !== firstNodeKey.current) {
                  node.remove();
                  alert('이미지는 최대 하나 까지만 넣을 수 있어요');
                }
                return;
              }

              const parentNodeKey = node
                .getParentKeys()
                .filter((key) => key !== 'root')[0];
              const parent = editor.getElementByKey(parentNodeKey);
              if (!parent) {
                return;
              }

              const imgs = parent.querySelectorAll('.editor-image');
              const line = $getRoot()
                .getChildren()
                .findIndex((node) => node.getKey() === parentNodeKey);

              // 이거 아직 이미지가 하나
              Promise.all(
                [...imgs].map((img) =>
                  findImgElement(img as HTMLElement).then((foundImg) => {
                    let myNodeKey = '';
                    editor.read(() => {
                      const node = $getNearestNodeFromDOMNode(img);
                      if (node) {
                        myNodeKey = node.getKey();
                      }
                    });
                    return blobUrlToFile(foundImg.src, `img-${myNodeKey}`);
                  })
                )
              )
                .then(async (results) => {
                  const compressedImg = [];

                  for (const imgFile of results) {
                    const requestId = `${imgFile.name}-${Date.now()}.jpg`;
                    const res = await compressImage(requestId, imgFile);
                    compressedImg.push(res);
                  }

                  const imgObjs = compressedImg.map((img, idx) => ({
                    key: img.name.split('-')[1].split('.')[0],
                    img: img,
                    line: line,
                    idx: idx,
                  }));
                  // console.log('new img objs', imgObjs);

                  setImages((prev) => {
                    const filteredNewImages = imgObjs.filter(
                      (newImg) =>
                        !prev.some(
                          (img) =>
                            img.line === newImg.line && img.idx === newImg.idx
                        )
                    );
                    // console.log('new img arr', filteredNewImages);
                    if (filteredNewImages.length === 0) {
                      // console.log('no new img');
                      return prev;
                    }

                    const targetNewLine = line;
                    const rearrangedArr = prev.map((imgObj) => {
                      if (imgObj.line > targetNewLine) {
                        return { ...imgObj, line: imgObj.line + 1 };
                      }
                      return imgObj;
                    });
                    const fin = [...rearrangedArr, ...filteredNewImages];
                    console.error('add fin', fin);
                    return fin;
                  });
                })
                .catch((err) => {
                  console.error('Promise.all error', err);
                });
            });
            return;
          }

          if (mutation === 'destroyed') {
            setImages((prev) =>
              prev.filter((imgObj) => imgObj.key !== nodeKey)
            );
            if (firstNodeKey.current === nodeKey) {
              firstNodeKey.current = '';
            }
          }
        });
      }
    );

    return () => {
      // firstNodeKey.current = '';
      unregisterMutationListener();
    };
  }, [editor, images]);
};

const PostWriteSection = forwardRef<
  HTMLDivElement,
  {
    children: React.ReactNode;
  }
>(({ children }, ref) => {
  const [editor] = useLexicalComposerContext();
  useDetectImageMutation();

  const onPaste = (event: React.ClipboardEvent<HTMLDivElement>) => {
    const items = event.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.startsWith('image/')) {
        const file = items[i].getAsFile();
        if (file) {
          const imageURL = URL.createObjectURL(file);
          const imgPayload: InsertImagePayload = {
            altText: '붙여넣은 이미지',
            maxWidth: 600,
            src: imageURL,
          };
          editor.dispatchCommand(INSERT_IMAGE_COMMAND, imgPayload);
        }
        break;
      }
    }
  };

  const onClick = useCallback(() => {
    editor.focus();
  }, [editor]);

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

  @media (max-width: ${breakpoints.mobile}px) {
    font-size: 18px;
    margin: 30px 0;
  }
`;

const PostSectionWrap: React.FC<{
  shouldHighlight?: boolean;
  children: ReactNode;
}> = ({ shouldHighlight, children }) => {
  const [editor] = useLexicalComposerContext();

  const onDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        const imageURL = URL.createObjectURL(file);
        const imgPayload: InsertImagePayload = {
          altText: '붙여넣은 이미지',
          maxWidth: 600,
          src: imageURL,
        };
        editor.dispatchCommand(INSERT_IMAGE_COMMAND, imgPayload);
      }
    }
  }, []);

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
          placeholder={setTag ? '문제를 입력하세요' : '제목을 입력하세요'}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            if (forwardTitle) {
              forwardTitle(e.target.value);
            }
          }}
          defaultValue={title}
          maxLength={50}
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
              <EditorPlaceholder>
                기본적인 마크다운 단축키와 코드블록을 지원해요. 코드를 붙여넣어
                보세요.
              </EditorPlaceholder>
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
