import { useEffect } from 'react';

import { $createCodeNode, DEFAULT_CODE_LANGUAGE } from '@lexical/code';
import { $generateNodesFromDOM } from '@lexical/html';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $createRangeSelection,
  $createTextNode,
  $getRoot,
  $getSelection,
  $insertNodes,
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
import PrismLib from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-typescript';

const LEXICAL_CLIPBOARD_TYPE = 'application/x-lexical-editor';
const CODE_KEYWORDS = [
  'null',
  '#include',
  'function',
  'class',
  'def',
  'import',
  'const',
  'let',
  'var',
  'public',
  'private',
  'return',
  '=>',
  'not',
  'and',
  'or',
  'self',
  'lambda',
  'pass',
  'None',
  'True',
  'False',
  'static',
  'while',
  'for',
  'if',
  'else',
  '&&',
  '||',
  'print',
  'console.log',
  ';',
  '*',
  '>>',
  '<<',
];

const looksLikeCode = (text: string): boolean => {
  const lines = text.split('\n');
  if (lines.length < 2) return false;

  let indentCnt = 0;
  let keywordCnt = 0;

  for (const line of lines) {
    if (/^\s{2,}|\t/.test(line)) {
      indentCnt++;
    }

    for (const keyword of CODE_KEYWORDS) {
      if (line.includes(keyword)) {
        keywordCnt++;
      }
    }
  }

  return (
    keywordCnt > 0 &&
    indentCnt >= lines.length / 2 &&
    keywordCnt >= lines.length / 3
  );
};

const Prism = PrismLib;
const LANGUAGE_PREFERENCE = ['python', 'javascript', 'java', 'cpp', 'c'];

const detectLanguageByPrism = (text: string): string => {
  const languages = Object.keys(Prism.languages).filter(
    (lang) => typeof Prism.languages[lang] === 'object' && lang !== 'meta'
  );

  let bestMatch = DEFAULT_CODE_LANGUAGE;
  let bestScore = 0;

  for (const lang of languages) {
    const tokens = Prism.tokenize(text, Prism.languages[lang]);
    const tokenScore = tokens.filter((t) => typeof t !== 'string').length;

    if (tokenScore > bestScore) {
      bestScore = tokenScore;
      bestMatch = lang;
    } else if (tokenScore === bestScore) {
      const currentIndex = LANGUAGE_PREFERENCE.indexOf(lang);
      const bestIndex = LANGUAGE_PREFERENCE.indexOf(bestMatch);
      if (
        currentIndex !== -1 &&
        (bestIndex === -1 || currentIndex < bestIndex)
      ) {
        bestMatch = lang;
      }
    }
  }

  return bestMatch;
};

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

    while (currentNode && currentNode !== rootNode) {
      const parent = currentNode.getParent();
      if (!parent || parent === rootNode) break;
      currentNode = parent;
    }

    if (currentNode === rootNode || !$isElementNode(currentNode)) return;

    const children = currentNode.getChildren();
    if (children.length === 1 && children[0].getType() === 'link') {
      // const link = children[0];
      //
      // const newSelection = $createRangeSelection();
      // newSelection.anchor.set(link.getKey(), 0, 'element');
      // newSelection.focus.set(
      //   link.getKey(),
      //   link.getTextContentSize(),
      //   'element'
      // );
      // $setSelection(newSelection);
      return true;
    }

    if (currentNode.getType() === 'code') {
      // const children = currentNode.getChildren();
      // const cursorOffset = selection.anchor.offset;
      // let totalOffset = 0;
      let foundLine = false;

      // for (const child of children) {
      //   const nodeText = child.getTextContent();
      //   if (!nodeText) continue;
      //
      //   if (totalOffset + nodeText.length < cursorOffset) {
      //     totalOffset += nodeText.length;
      //     continue;
      //   }
      //
      //   const relativeOffset = cursorOffset - totalOffset;
      //   const textBeforeCursor = nodeText.substring(0, relativeOffset);
      //   const textAfterCursor = nodeText.substring(relativeOffset);
      //
      //   let lineStartOffset = 0;
      //   const lastNewlineBeforeCursor = textBeforeCursor.lastIndexOf('\n');
      //   if (lastNewlineBeforeCursor !== -1) {
      //     lineStartOffset = lastNewlineBeforeCursor + 1;
      //   }
      //
      //   let lineEndOffset = nodeText.length;
      //   const firstNewlineAfterCursor = textAfterCursor.indexOf('\n');
      //   if (firstNewlineAfterCursor !== -1) {
      //     lineEndOffset = relativeOffset + firstNewlineAfterCursor;
      //   }
      //
      //   const newSelection = $createRangeSelection();
      //   newSelection.anchor.set(child.getKey(), lineStartOffset, 'text');
      //   newSelection.focus.set(child.getKey(), lineEndOffset, 'text');
      //   $setSelection(newSelection);
      //
      foundLine = true;
      //   break;
      // }

      if (foundLine) {
        return true;
      }
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

const registerCopyCommand = (editor: LexicalEditor) => {
  return editor.registerCommand(
    COPY_COMMAND,
    (): boolean => {
      let shouldUseFallback = true;

      editor.getEditorState().read(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection) && selection.isCollapsed()) {
          shouldUseFallback = !copyCurrentLine(editor);
        } else if ($isRangeSelection(selection) && !selection.isCollapsed()) {
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
            shouldUseFallback = false;
          }
        } else if (!$isRangeSelection(selection)) {
          shouldUseFallback = true;
        }
      });

      return !shouldUseFallback;
    },
    COMMAND_PRIORITY_CRITICAL
  );
};

const registerCutCommand = (editor: LexicalEditor) => {
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

const registerPasteCommand = (editor: LexicalEditor) => {
  return editor.registerCommand(
    PASTE_COMMAND,
    (event: ClipboardEvent): boolean => {
      if (!event || !event.clipboardData) {
        return false;
      }

      try {
        const lexicalData = event.clipboardData.getData(LEXICAL_CLIPBOARD_TYPE);
        if (lexicalData) {
          console.log('??', lexicalData);
          return false;
        }

        const viewerData = event.clipboardData.getData('text/html-viewer');
        if (viewerData) {
          const parser = new DOMParser();
          const doc = parser.parseFromString(viewerData, 'text/html');

          editor.update(() => {
            const selection = $getSelection();

            if (!$isRangeSelection(selection)) return;

            const nodes = $generateNodesFromDOM(editor, doc);

            if (nodes.length > 0) {
              selection.insertNodes(nodes);
            }
          });
          return true;
        }

        const plainText = event.clipboardData.getData('text/plain');
        if (plainText) {
          if (looksLikeCode(plainText)) {
            // event.preventDefault();
            const language = detectLanguageByPrism(plainText);

            editor.update(() => {
              const codeNode = $createCodeNode();
              codeNode.setLanguage(language);
              codeNode.append($createTextNode(plainText));

              $insertNodes([codeNode]);
            });

            return true;
          }

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

const registerClipboardShortcuts = (editor: LexicalEditor) => {
  const onKeyDown = (event: KeyboardEvent) => {
    const isCtrlOrCmd = event.ctrlKey || event.metaKey;

    if (isCtrlOrCmd) {
      // if (event.key === 'x') {
      //   editor.dispatchCommand(CUT_COMMAND, {} as ClipboardEvent);
      // } else
      if (event.key === 'c') {
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
