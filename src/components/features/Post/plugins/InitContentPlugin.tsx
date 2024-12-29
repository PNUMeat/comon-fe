import { $createImageNode } from '@/components/features/Post/nodes/ImageNode';

import { useEffect, useRef } from 'react';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $createParagraphNode,
  $createTextNode,
  $getRoot,
  $getSelection,
  $isTextNode,
  LexicalNode,
} from 'lexical';

const createStyledTextNode = (text: string, style: string): LexicalNode => {
  const textNode = $createTextNode(text);
  textNode.setStyle(style);
  return textNode;
};

/** HTML -> LexicalNode[] 로 직접 변환해주는 함수 예시 */
const parseHtmlStrToLexicalNodes = (htmlString: string): LexicalNode[] => {
  const parser = new DOMParser();
  const dom = parser.parseFromString(htmlString, 'text/html');
  const { body } = dom;

  const lexicalNodes: LexicalNode[] = [];

  const traverse = (node: ChildNode): LexicalNode | LexicalNode[] | null => {
    // 텍스트 노드
    if (node.nodeType === Node.TEXT_NODE) {
      const textContent = node.textContent ?? '';
      if (!textContent) return null;

      // 부모가 <span style="..."> 일 경우
      const parentEl = node.parentElement;
      if (parentEl?.tagName === 'SPAN') {
        const style = parentEl.getAttribute('style') ?? '';

        return createStyledTextNode(textContent, style);
      } else {
        return $createTextNode(textContent);
      }
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as HTMLElement;
      const tagName = element.tagName.toLowerCase();

      switch (tagName) {
        // <p> -> ParagraphNode
        case 'p': {
          const paragraph = $createParagraphNode();
          element.childNodes.forEach((child) => {
            const childLexicalNode = traverse(child);
            if (childLexicalNode) {
              if (Array.isArray(childLexicalNode)) {
                paragraph.append(...childLexicalNode);
              } else {
                paragraph.append(childLexicalNode);
              }
            }
          });
          return paragraph;
        }

        // <span> -> 자식 텍스트 노드들 처리
        case 'span': {
          let nodes: LexicalNode[] = [];
          element.childNodes.forEach((child) => {
            const childLexicalNode = traverse(child);
            if (childLexicalNode) {
              if (Array.isArray(childLexicalNode)) {
                nodes = nodes.concat(childLexicalNode);
              } else {
                nodes.push(childLexicalNode);
              }
            }
          });
          return nodes;
        }

        // <b>, <strong>, <bold> -> 내부 TextNode에 bold 포맷 적용
        case 'b':
        case 'strong':
        case 'bold': {
          const nodes: LexicalNode[] = [];
          element.childNodes.forEach((child) => {
            const childLexicalNode = traverse(child);
            if (childLexicalNode) {
              if (Array.isArray(childLexicalNode)) {
                childLexicalNode.forEach((n) => {
                  if ($isTextNode(n)) {
                    n.setFormat('bold');
                  }
                });
                nodes.push(...childLexicalNode);
              } else {
                if ($isTextNode(childLexicalNode)) {
                  childLexicalNode.setFormat('bold');
                }
                nodes.push(childLexicalNode);
              }
            }
          });
          return nodes;
        }

        case 'img': {
          const src = element.getAttribute('src') || '';
          const alt = element.getAttribute('alt') || '';
          if (!src) {
            return null;
          }

          return $createImageNode({
            altText: alt,
            src: src,
            maxWidth: 600,
          });
        }

        default: {
          let nodes: LexicalNode[] = [];
          element.childNodes.forEach((child) => {
            const childLexicalNode = traverse(child);
            if (childLexicalNode) {
              if (Array.isArray(childLexicalNode)) {
                nodes = nodes.concat(childLexicalNode);
              } else {
                nodes.push(childLexicalNode);
              }
            }
          });
          return nodes;
        }
      }
    }

    return null;
  };

  body.childNodes.forEach((child) => {
    const result = traverse(child);
    if (result) {
      if (Array.isArray(result)) {
        lexicalNodes.push(...result);
      } else {
        lexicalNodes.push(result);
      }
    }
  });

  return lexicalNodes;
};

export const InitContentPlugin: React.FC<{ content: string }> = ({
  content,
}) => {
  const isInitializedRef = useRef(true);
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.update(() => {
      const nodes = parseHtmlStrToLexicalNodes(content);
      $getRoot().select();
      const selection = $getSelection();
      if (selection && isInitializedRef.current) {
        selection.insertNodes(nodes);
        isInitializedRef.current = false;
      }
    });
  }, [editor]);

  return null;
};
