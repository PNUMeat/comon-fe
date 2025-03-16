import { useEffect } from 'react';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $createRangeSelection,
  $getRoot,
  $getSelection,
  $isElementNode,
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

const findLineOffsetsInCodeBlock = (
  text: string,
  cursorOffset: number
): { startOffset: number; endOffset: number } => {
  // 커서 위치가 텍스트 범위를 벗어나지 않도록 보정
  const safeOffset = Math.min(Math.max(0, cursorOffset), text.length);

  // 커서 이전 텍스트에서 마지막 줄바꿈 찾기
  let startOffset = 0;
  for (let i = safeOffset - 1; i >= 0; i--) {
    if (text[i] === '\n') {
      startOffset = i + 1;
      break;
    }
  }

  // 커서 이후 텍스트에서 다음 줄바꿈 찾기
  let endOffset = text.length;
  for (let i = safeOffset; i < text.length; i++) {
    if (text[i] === '\n') {
      endOffset = i;
      break;
    }
  }

  return { startOffset, endOffset };
};

const selectCurrentLine = (editor: LexicalEditor): boolean => {
  editor.update(() => {
    const selection = $getSelection();
    if (!$isRangeSelection(selection)) return;

    let currentNode = selection.anchor.getNode();
    if (!currentNode) return;

    const rootNode = $getRoot();

    while (currentNode && currentNode !== rootNode) {
      const parent = currentNode.getParent();
      if (!parent || parent === rootNode) break;
      currentNode = parent;
    }

    if (currentNode === rootNode || !$isElementNode(currentNode)) return;

    const children = currentNode.getChildren();
    if (children.length === 1 && children[0].getType() === 'link') {
      const link = children[0];

      const newSelection = $createRangeSelection();
      newSelection.anchor.set(link.getKey(), 0, 'element');
      newSelection.focus.set(
        link.getKey(),
        link.getTextContentSize(),
        'element'
      );
      $setSelection(newSelection);
      return true;
    }

    if (currentNode.getType() === 'code') {
      const cursorOffset = selection.anchor.offset;
      // const children = currentNode.getChildren();
      // let totalOffset = 0;

      // for (const child of children) {
      //   const nodeText = child.getTextContent();
      //   const nodeLength = nodeText.length;
      //
      //   if (
      //     cursorOffset >= totalOffset &&
      //     cursorOffset <= totalOffset + nodeLength
      //   ) {
      //     const relativeOffset = cursorOffset - totalOffset;
      //
      //     const newSelection = $createRangeSelection();
      //     newSelection.anchor.set(child.getKey(), 0, 'text');
      //     newSelection.focus.set(child.getKey(), nodeLength, 'text');
      //     $setSelection(newSelection);
      //
      //     break;
      //   }
      //
      //   totalOffset += nodeLength;
      // }
      const codeText = currentNode.getTextContent();
      const { startOffset, endOffset } = findLineOffsetsInCodeBlock(
        codeText,
        cursorOffset
      );

      const newSelection = $createRangeSelection();

      newSelection.anchor.set(currentNode.getKey(), startOffset, 'text');
      newSelection.focus.set(currentNode.getKey(), endOffset, 'text');

      $setSelection(newSelection);

      // const children = currentNode.getChildren();
      // const cursorOffset = selection.anchor.offset;
      // let totalOffset = 0;
      // let currentLineNodes = [];
      // let currentLineOffset = 0;
      //
      // for (const child of children) {
      //   const nodeText = child.getTextContent();
      //   if (!nodeText) continue;
      //
      //   const lines = nodeText.split('\n');
      //
      //   for (let i = 0; i < lines.length; i++) {
      //     const isLastLine = i === lines.length - 1;
      //     const lineLength = lines[i].length + (isLastLine ? 0 : 1);
      //
      //     if (
      //       cursorOffset >= totalOffset &&
      //       cursorOffset < totalOffset + lineLength
      //     ) {
      //       const newSelection = $createRangeSelection();
      //       newSelection.anchor.set(child.getKey(), currentLineOffset, 'text');
      //       newSelection.focus.set(
      //         child.getKey(),
      //         currentLineOffset + lineLength - (isLastLine ? 0 : 1),
      //         'text'
      //       );
      //       $setSelection(newSelection);
      //       return true;
      //     }
      //
      //     totalOffset += lineLength;
      //     currentLineOffset = isLastLine ? 0 : currentLineOffset + lineLength;
      //
      //     if (!isLastLine) {
      //       currentLineNodes = [];
      //     }
      //   }
      // }
      return true;
    }

    let minLineStartOffset = Number.MAX_SAFE_INTEGER;
    let maxLineEndOffset = 0;
    let totalOffset = 0;

    const cursorOffset = selection.anchor.offset;

    for (const child of children) {
      const nodeText = child.getTextContent();
      if (nodeText) {
        const textBeforeCursor = nodeText.substring(
          0,
          cursorOffset - totalOffset > 0 ? cursorOffset - totalOffset : 0
        );
        const lineStartOffset = textBeforeCursor.lastIndexOf('\n');
        const currentLineStart =
          lineStartOffset === -1 ? 0 : lineStartOffset + 1;

        const lineEndOffset = nodeText.indexOf(
          '\n',
          Math.max(0, cursorOffset - totalOffset)
        );
        const currentLineEnd =
          lineEndOffset === -1 ? nodeText.length : lineEndOffset;

        minLineStartOffset = Math.min(
          minLineStartOffset,
          totalOffset + currentLineStart
        );
        maxLineEndOffset = Math.max(
          maxLineEndOffset,
          totalOffset + currentLineEnd
        );
      }

      totalOffset += nodeText.length;
    }

    if (minLineStartOffset === Number.MAX_SAFE_INTEGER) {
      minLineStartOffset = 0;
    }

    const parentTextLength = currentNode.getTextContentSize();
    maxLineEndOffset = Math.min(maxLineEndOffset, parentTextLength);

    const newSelection = $createRangeSelection();
    newSelection.anchor.set(
      currentNode.getKey(),
      minLineStartOffset,
      'element'
    );
    newSelection.focus.set(currentNode.getKey(), maxLineEndOffset, 'element');

    $setSelection(newSelection);
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

        const lexicalData = event.clipboardData.getData(LEXICAL_CLIPBOARD_TYPE);
        console.log('???wtf', lexicalData);
        if (lexicalData) {
          return false;
        }

        const plainText = event.clipboardData.getData('text/plain');
        if (plainText) {
          editor.update(() => {
            const selection = $getSelection();
            if (!$isRangeSelection(selection)) return;

            selection.insertText(plainText);
          });

          return true;
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
