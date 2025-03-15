import { useEffect } from 'react';

import { $isCodeNode } from '@lexical/code';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $getRoot,
  $getSelection,
  $isRangeSelection,
  $setSelection,
  COMMAND_PRIORITY_CRITICAL,
  COPY_COMMAND,
  CUT_COMMAND,
  LexicalEditor,
  LexicalNode,
  PASTE_COMMAND,
} from 'lexical';

const LEXICAL_CLIPBOARD_TYPE = 'application/x-lexical-editor';

const copyNodesToClipboard = async (
  nodes: Array<LexicalNode>,
  plainText: string
): Promise<boolean> => {
  if (!nodes.length) return Promise.resolve(false);

  try {
    const serializedNodes = nodes.map((node) => node.exportJSON());
    const serializedContent = JSON.stringify(serializedNodes);

    return navigator.clipboard
      .writeText(plainText)
      .then(() => {
        try {
          const clipboardData = new ClipboardItem({
            [LEXICAL_CLIPBOARD_TYPE]: new Blob([serializedContent], {
              type: LEXICAL_CLIPBOARD_TYPE,
            }),
            'text/plain': new Blob([plainText], { type: 'text/plain' }),
            'text/html': new Blob([serializedContent], { type: 'text/html' }),
          });

          return navigator.clipboard
            .write([clipboardData])
            .then(() => {
              return true;
            })
            .catch(() => {
              return true;
            });
        } catch (error) {
          console.warn('클립보드 API 오류:', error);
          return true;
        }
      })
      .catch(() => {
        return false;
      });
  } catch (error) {
    console.error('노드 직렬화 중 오류:', error);
    return navigator.clipboard
      .writeText(plainText)
      .then(() => {
        return true;
      })
      .catch(() => {
        return false;
      });
  }
};

const copyCurrentLine = (editor: LexicalEditor): boolean => {
  selectCurrentLine(editor);

  let selectedText = '';
  let nodesToCopy: Array<LexicalNode> = [];

  editor.getEditorState().read(() => {
    const selection = $getSelection();
    if (!$isRangeSelection(selection) || selection.isCollapsed()) {
      return;
    }

    selectedText = selection.getTextContent();

    nodesToCopy = selection.getNodes();
  });

  if (nodesToCopy.length > 0) {
    copyNodesToClipboard(nodesToCopy, selectedText).then((success) => {
      if (!success) {
        navigator.clipboard.writeText(selectedText);
      }
    });
    return true;
  } else if (selectedText) {
    navigator.clipboard
      .writeText(selectedText)
      .then(() => {})
      .catch(() => {});
    return true;
  }

  return false;
};

const selectCurrentLine = (editor: LexicalEditor): boolean => {
  editor.update(() => {
    const selection = $getSelection();
    if (!$isRangeSelection(selection)) return;

    let currentNode = selection.anchor.getNode();
    if (!currentNode) return;

    const rootNode = $getRoot();

    while (
      currentNode &&
      currentNode.getTextContent().trim() === '' &&
      currentNode !== rootNode
    ) {
      const parent = currentNode.getParent();
      if (!parent || parent === rootNode) break;
      currentNode = parent;
    }

    if (currentNode === rootNode) {
      return;
    }

    const nodeText = currentNode.getTextContent();
    if (!nodeText) {
      return;
    }

    const cursorOffset = selection.anchor.offset;

    const textBeforeCursor = nodeText.substring(0, cursorOffset);

    let lineStartOffset = textBeforeCursor.lastIndexOf('\n');
    lineStartOffset = lineStartOffset === -1 ? 0 : lineStartOffset + 1;

    let lineEndOffset = nodeText.indexOf('\n', cursorOffset);
    lineEndOffset = lineEndOffset === -1 ? nodeText.length : lineEndOffset;

    const currentLineText = nodeText.substring(lineStartOffset, lineEndOffset);
    console.log('curr line:', currentLineText);

    selection.anchor.set(currentNode.getKey(), lineStartOffset, 'text');
    selection.focus.set(currentNode.getKey(), lineEndOffset, 'text');

    $setSelection(selection);
  });

  return true;
};

export const registerCopyCommand = (editor: LexicalEditor) => {
  return editor.registerCommand(
    COPY_COMMAND,
    (): boolean => {
      let shouldUseFallback = true;

      editor.getEditorState().read(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection) && selection.isCollapsed()) {
          shouldUseFallback = !copyCurrentLine(editor);
        } else if ($isRangeSelection(selection) && !selection.isCollapsed()) {
          shouldUseFallback = true;
        } else if (!$isRangeSelection(selection)) {
          shouldUseFallback = true;
        }
      });

      return !shouldUseFallback;
    },
    COMMAND_PRIORITY_CRITICAL
  );
};

export const registerCutCommand = (editor: LexicalEditor) => {
  return editor.registerCommand(
    CUT_COMMAND,
    (): boolean => {
      let shouldUseFallback = true;

      editor.getEditorState().read(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection) && selection.isCollapsed()) {
          selectCurrentLine(editor);

          shouldUseFallback = false;
        } else if ($isRangeSelection(selection) && !selection.isCollapsed()) {
          shouldUseFallback = true;
        } else if (!$isRangeSelection(selection)) {
          shouldUseFallback = true;
        }
      });

      return !shouldUseFallback;
    },
    COMMAND_PRIORITY_CRITICAL
  );
};

export const registerPasteCommand = (editor: LexicalEditor) => {
  return editor.registerCommand(
    PASTE_COMMAND,
    (event: ClipboardEvent): boolean => {
      if (!event || !event.clipboardData) {
        return false;
      }

      try {
        const formats = event.clipboardData.types;
        console.log('clipboard format', formats);

        const plainText = event.clipboardData.getData('text/plain');

        const lexicalData = event.clipboardData.getData(LEXICAL_CLIPBOARD_TYPE);

        const editorState = editor.getEditorState().read(() => {
          const selection = $getSelection();
          if (!$isRangeSelection(selection))
            return { inCodeBlock: false, nodeType: 'unknown' };

          const anchorNode = selection.anchor.getNode();
          let currentNode = anchorNode;
          let inCodeBlock = false;
          let nodeType = anchorNode.getType();

          while (currentNode) {
            if ($isCodeNode(currentNode)) {
              inCodeBlock = true;
              nodeType = 'code';
              break;
            }
            const parent = currentNode.getParent();
            if (!parent) break;
            currentNode = parent;

            if (parent.getType() !== 'text') {
              nodeType = parent.getType();
            }
          }

          return { inCodeBlock, nodeType };
        });

        const needsSpecialPasteHandling =
          editorState.inCodeBlock ||
          (plainText.startsWith('#') && editorState.nodeType !== 'heading');

        if (needsSpecialPasteHandling && plainText) {
          editor.update(() => {
            const selection = $getSelection();
            if (!$isRangeSelection(selection)) return;

            selection.insertText(plainText);
          });

          event.preventDefault();
          return true;
        }

        if (lexicalData) {
          return false;
        }

        return false;
      } catch (error) {
        console.error('클립보드 데이터 처리 중 오류:', error);
        return false;
      }
    },
    COMMAND_PRIORITY_CRITICAL
  );
};

export const registerClipboardShortcuts = (editor: LexicalEditor) => {
  const removeKeyDownListener = editor.registerRootListener(
    (rootElement: HTMLElement | null, prevRootElement: HTMLElement | null) => {
      if (rootElement !== null) {
        rootElement.addEventListener('keydown', onKeyDown, { capture: true });
      }
      if (prevRootElement !== null) {
        prevRootElement.removeEventListener('keydown', onKeyDown, {
          capture: true,
        });
      }
    }
  );

  const onKeyDown = (event: KeyboardEvent) => {
    const isCtrlOrCmd = event.ctrlKey || event.metaKey;

    if (isCtrlOrCmd) {
      if (event.key === 'x') {
        editor.dispatchCommand(CUT_COMMAND, {} as ClipboardEvent);
      } else if (event.key === 'c') {
        editor.dispatchCommand(COPY_COMMAND, {} as ClipboardEvent);
      } else if (event.key === 'v') {
        editor.dispatchCommand(PASTE_COMMAND, {} as ClipboardEvent);
      }
    }
  };

  return () => {
    removeKeyDownListener();
  };
};

export const ClipboardPlugin: React.FC = () => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    const unregisterCopy = registerCopyCommand(editor);
    const unregisterCut = registerCutCommand(editor);
    const unregisterPaste = registerPasteCommand(editor);
    const cleanup = registerClipboardShortcuts(editor);

    return () => {
      unregisterCopy();
      unregisterCut();
      unregisterPaste();
      cleanup();
    };
  }, [editor]);

  return null;
};
