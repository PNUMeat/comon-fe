import { parseHtmlStrToLexicalNodes } from '@/components/features/Post/plugins/utils.ts';

import { useEffect } from 'react';

import { $createCodeNode, DEFAULT_CODE_LANGUAGE } from '@lexical/code';
import { $generateHtmlFromNodes } from '@lexical/html';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $createTextNode,
  $getSelection,
  $insertNodes,
  $isElementNode,
  $isRangeSelection,
  $isTextNode,
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
  'of',
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
  editor: LexicalEditor,
  nodes: Array<LexicalNode>,
  plainText: string
): Promise<boolean> => {
  if (!nodes.length || !navigator.clipboard || !window.ClipboardItem) {
    return false;
  }

  try {
    const serializedNodes = nodes.map((node) => node.exportJSON());
    const serializedContent = JSON.stringify(serializedNodes);

    const htmlString = $generateHtmlFromNodes(editor, null);

    const clipboardItem = new ClipboardItem({
      [LEXICAL_CLIPBOARD_TYPE]: new Blob([serializedContent], {
        type: LEXICAL_CLIPBOARD_TYPE,
      }),
      'text/plain': new Blob([plainText], { type: 'text/plain' }),
      'text/html': new Blob([htmlString], { type: 'text/html' }),
      'text/html-viewer': new Blob([htmlString], { type: 'text/html' }),
    });

    await navigator.clipboard.write([clipboardItem]);
    return true;
  } catch (error) {
    console.warn('클립보드 복사 실패:', error);
    return false;
  }
};

const registerCopyCommand = (editor: LexicalEditor) => {
  return editor.registerCommand(
    COPY_COMMAND,
    (): boolean => {
      let shouldUseFallback = true;

      editor.getEditorState().read(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection) && selection.isCollapsed()) {
          // shouldUseFallback = !copyCurrentLine(editor);
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
            copyNodesToClipboard(editor, nodesToCopy, selectedText);
            shouldUseFallback = true;
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
  return editor.registerCommand<ClipboardEvent>(
    CUT_COMMAND,
    (event: ClipboardEvent): boolean => {
      const shouldUseFallback = true;

      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection) && selection.isCollapsed()) {
          const anchor = selection.anchor;
          const node = anchor.getNode();
          const topLevel = $isTextNode(node)
            ? node.getTopLevelElementOrThrow()
            : node;

          const first = topLevel.getFirstDescendant();
          const last = topLevel.getLastDescendant();

          if ($isTextNode(first) && $isTextNode(last)) {
            selection.setTextNodeRange(
              first,
              0,
              last,
              last.getTextContentSize()
            );

            const sanitizeHtml = (html: string): string => {
              const container = document.createElement('div');
              container.innerHTML = html;

              container.querySelectorAll('a').forEach((a) => {
                a.removeAttribute('target');
              });

              return container.innerHTML;
            };
            const htmlString = sanitizeHtml(
              $generateHtmlFromNodes(editor, selection)
            );

            event.clipboardData?.setData('text/html', htmlString);
            event.clipboardData?.setData('text/html-viewer', htmlString);

            const target: LexicalNode | null = topLevel.getNextSibling();

            if (target && $isElementNode(target)) {
              const targetDescendant = target.getFirstDescendant();
              if (targetDescendant && $isTextNode(targetDescendant)) {
                selection.setTextNodeRange(
                  targetDescendant,
                  0,
                  targetDescendant,
                  0
                );
              }
            }
            topLevel.remove();
          }
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
      const html = event.clipboardData?.getData('text/html');
      if (html) {
        return false;
      }

      try {
        const lexicalData = event.clipboardData.getData(LEXICAL_CLIPBOARD_TYPE);
        if (lexicalData) {
          return false;
        }

        const viewerData = event.clipboardData.getData('text/html-viewer');
        if (viewerData) {
          const nodes = parseHtmlStrToLexicalNodes(viewerData);

          editor.update(() => {
            const selection = $getSelection();

            if (!$isRangeSelection(selection)) return;

            if (nodes.length > 0) {
              selection.insertNodes(nodes);
            }
          });
          return true;
        }

        const plainText = event.clipboardData.getData('text/plain');
        if (plainText) {
          if (looksLikeCode(plainText)) {
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

export const ClipboardPlugin: React.FC = () => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    const unregisterCopy = registerCopyCommand(editor);
    const unregisterCut = registerCutCommand(editor);
    const unregisterPaste = registerPasteCommand(editor);

    return () => {
      unregisterCopy();
      unregisterCut();
      unregisterPaste();
    };
  }, [editor]);

  return null;
};
