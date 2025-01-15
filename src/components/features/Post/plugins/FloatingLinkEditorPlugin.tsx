import {
  getSelectedNode,
  setFloatingElemPositionForLinkEditor,
} from '@/components/features/Post/utils';

import {
  Dispatch,
  Fragment,
  MouseEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import * as React from 'react';
import { createPortal } from 'react-dom';

import {
  $createLinkNode,
  $isAutoLinkNode,
  $isLinkNode,
  TOGGLE_LINK_COMMAND,
} from '@lexical/link';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $findMatchingParent,
  mergeRegister,
  objectKlassEquals,
} from '@lexical/utils';
import {
  $createTextNode,
  $getSelection,
  $isLineBreakNode,
  $isRangeSelection,
  $isTextNode,
  BaseSelection,
  CLICK_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  COMMAND_PRIORITY_HIGH,
  COMMAND_PRIORITY_LOW,
  KEY_ESCAPE_COMMAND,
  LexicalEditor,
  PASTE_COMMAND,
  SELECTION_CHANGE_COMMAND,
} from 'lexical';

const validateUrl = (url: string) => {
  // 이거 정규식 쓰면 페이지가 얼어요
  // const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
  // return urlRegex.test(url);
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const FloatingLinkEditor: React.FC<{
  editor: LexicalEditor;
  isLink: boolean;
  setIsLink: Dispatch<boolean>;
  anchorElem: HTMLElement;
  isLinkEditMode: boolean;
  setIsLinkEditMode: Dispatch<boolean>;
}> = ({
  editor,
  isLink,
  setIsLink,
  anchorElem,
  isLinkEditMode,
  setIsLinkEditMode,
}) => {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [linkUrl, setLinkUrl] = useState('');
  const [editedLinkUrl, setEditedLinkUrl] = useState('https://');
  const [lastSelection, setLastSelection] = useState<BaseSelection | null>(
    null
  );

  const updateLinkEditor = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const node = getSelectedNode(selection);
      const linkParent = $findMatchingParent(node, $isLinkNode);

      if (linkParent) {
        setLinkUrl(linkParent.getURL());
      } else if ($isLinkNode(node)) {
        setLinkUrl(node.getURL());
      } else {
        setLinkUrl('');
      }
      if (isLinkEditMode) {
        setEditedLinkUrl(linkUrl);
      }
    }
    const editorElem = editorRef.current;
    const nativeSelection = window.getSelection();
    const activeElement = document.activeElement;

    if (editorElem === null) {
      return;
    }

    const rootElement = editor.getRootElement();

    if (
      selection !== null &&
      nativeSelection !== null &&
      rootElement !== null &&
      rootElement.contains(nativeSelection.anchorNode) &&
      editor.isEditable()
    ) {
      const domRect: DOMRect | undefined =
        nativeSelection.focusNode?.parentElement?.getBoundingClientRect();
      if (domRect) {
        domRect.y += 40;
        setFloatingElemPositionForLinkEditor(domRect, editorElem, anchorElem);
      }

      setLastSelection(selection);
    } else if (!activeElement || activeElement.className !== 'link-input') {
      if (rootElement !== null) {
        setFloatingElemPositionForLinkEditor(null, editorElem, anchorElem);
      }

      setLastSelection(null);
      setIsLinkEditMode(false);
      setLinkUrl('');
    }

    return true;
  }, [anchorElem, editor, setIsLinkEditMode, isLinkEditMode, linkUrl]);

  useEffect(() => {
    const scrollerElem = anchorElem.parentElement;

    const update = () => {
      editor.getEditorState().read(() => {
        updateLinkEditor();
      });
    };

    if (scrollerElem) {
      scrollerElem.addEventListener('scroll', update);
    }

    return () => {
      if (scrollerElem) {
        scrollerElem.removeEventListener('scroll', update);
      }
    };
  }, [anchorElem.parentElement, editor, updateLinkEditor]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateLinkEditor();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updateLinkEditor();
          return true;
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        KEY_ESCAPE_COMMAND,
        () => {
          if (isLink) {
            setIsLink(false);
            return true;
          }
          return false;
        },
        COMMAND_PRIORITY_HIGH
      ),
      editor.registerCommand(
        PASTE_COMMAND,
        (event) => {
          const selection = $getSelection();
          if (
            !$isRangeSelection(selection) ||
            !objectKlassEquals(event, ClipboardEvent)
          ) {
            return false;
          }

          const clipboardEvent = event as ClipboardEvent;
          if (clipboardEvent.clipboardData === null) {
            return false;
          }

          const clipboardText = clipboardEvent.clipboardData.getData('text');

          if (!validateUrl(clipboardText)) {
            return false;
          }

          const linkNode = $createLinkNode(clipboardText, {
            title: clipboardText,
          });

          const linkTextNode = $createTextNode(clipboardText);
          linkNode.append(linkTextNode);

          editor.dispatchCommand(TOGGLE_LINK_COMMAND, {
            url: clipboardText,
            target: '_blank',
          });

          editor.update(() => {
            selection.insertNodes([linkNode]);
          });

          event.preventDefault();
          return true;
        },
        COMMAND_PRIORITY_LOW
      )
    );
  }, [editor, updateLinkEditor, setIsLink, isLink]);

  useEffect(() => {
    editor.getEditorState().read(() => {
      updateLinkEditor();
    });
  }, [editor, updateLinkEditor]);

  useEffect(() => {
    if (isLinkEditMode && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLinkEditMode, isLink]);

  const monitorInputInteraction = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleLinkSubmission();
      setEditedLinkUrl('https://');

      setIsLinkEditMode(false);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      setIsLinkEditMode(false);

      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    }
  };

  const handleLinkSubmission = () => {
    if (lastSelection === null) {
      return;
    }

    if (linkUrl !== '') {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, {
        url: editedLinkUrl,
        target: '_blank',
      });

      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          const parent = getSelectedNode(selection).getParent();
          if ($isLinkNode(parent)) {
            parent.setTarget('_blank');

            const firstChild = parent.getFirstChild();
            if ($isTextNode(firstChild)) {
              if (validateUrl(firstChild.getTextContent())) {
                firstChild.setTextContent(editedLinkUrl);
                parent.setTitle(editedLinkUrl);
              }
            }
          } else if ($isAutoLinkNode(parent)) {
            const linkNode = $createLinkNode(parent.getURL(), {
              rel: parent.__rel,
              target: parent.__target,
              title: parent.__title,
            });
            linkNode.setTarget('_blank');
            parent.replace(linkNode, true);
          }
        }
      });
      setIsLinkEditMode(false);
    }
  };

  return (
    <div
      ref={editorRef}
      className={'link-editor'}
      onClick={(e: MouseEvent<HTMLDivElement>) => {
        if (!(e.target instanceof HTMLAnchorElement)) {
          e.preventDefault();
        }
      }}
    >
      {!isLink ? null : isLinkEditMode ? (
        <Fragment>
          <input
            ref={inputRef}
            className={'link-input'}
            value={editedLinkUrl}
            onChange={(event) => {
              setEditedLinkUrl(event.target.value);
            }}
            onClick={(e: MouseEvent<HTMLInputElement>) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onKeyDown={(event) => {
              monitorInputInteraction(event);
            }}
          />
          <div>
            <button onClick={handleLinkSubmission}>확인</button>
            <button onClick={() => setIsLinkEditMode(false)}>취소</button>
          </div>
        </Fragment>
      ) : (
        <div className={'link-view'}>
          <a
            href={linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ zIndex: 11 }}
          >
            {linkUrl}
          </a>
          <div>
            <button
              onClick={() => editor.dispatchCommand(TOGGLE_LINK_COMMAND, null)}
            >
              삭제
            </button>
            <button
              onClick={() => {
                setEditedLinkUrl(linkUrl);
                setIsLinkEditMode(true);
              }}
            >
              수정
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export const FloatingLinkEditorPlugin: React.FC<{
  anchorElem?: HTMLElement;
  isLinkEditMode: boolean;
  setIsLinkEditMode: Dispatch<boolean>;
}> = ({ anchorElem = document.body, isLinkEditMode, setIsLinkEditMode }) => {
  const [editor] = useLexicalComposerContext();
  const [activeEditor, setActiveEditor] = useState(editor);
  const [isLink, setIsLink] = useState(false);

  useEffect(() => {
    const updateToolbar = () => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const focusNode = getSelectedNode(selection);
        const focusLinkNode = $findMatchingParent(focusNode, $isLinkNode);
        const focusAutoLinkNode = $findMatchingParent(
          focusNode,
          $isAutoLinkNode
        );

        if (!(focusLinkNode || focusAutoLinkNode)) {
          setIsLink(false);
          return;
        }

        const badNode = selection
          .getNodes()
          .filter((node) => !$isLineBreakNode(node))
          .find((node) => {
            const linkNode = $findMatchingParent(node, $isLinkNode);
            const autoLinkNode = $findMatchingParent(node, $isAutoLinkNode);

            return (
              (focusLinkNode && !focusLinkNode.is(linkNode)) ||
              (linkNode && !linkNode.is(focusLinkNode)) ||
              (focusAutoLinkNode && !focusAutoLinkNode.is(autoLinkNode)) ||
              (autoLinkNode &&
                (!autoLinkNode.is(focusAutoLinkNode) ||
                  autoLinkNode.getIsUnlinked()))
            );
          });
        if (!badNode) {
          setIsLink(true);
        } else {
          setIsLink(false);
        }
      }
    };

    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_payload, newEditor) => {
          updateToolbar();
          setActiveEditor(newEditor);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL
      ),
      editor.registerCommand(
        CLICK_COMMAND,
        (payload) => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            const node = getSelectedNode(selection);
            const linkNode = $findMatchingParent(node, $isLinkNode);
            if ($isLinkNode(linkNode) && (payload.metaKey || payload.ctrlKey)) {
              window.open(linkNode.getURL(), '_blank');
              return true;
            }
          }
          return false;
        },
        COMMAND_PRIORITY_LOW
      )
    );
  }, [editor]);

  return createPortal(
    <FloatingLinkEditor
      editor={activeEditor}
      isLink={isLink}
      anchorElem={anchorElem}
      setIsLink={setIsLink}
      isLinkEditMode={isLinkEditMode}
      setIsLinkEditMode={setIsLinkEditMode}
    />,
    anchorElem
  );
};
