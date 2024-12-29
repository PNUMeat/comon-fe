import { useEffect, useRef } from 'react';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $createParagraphNode,
  $createTextNode,
  $getRoot,
  $getSelection,
  LexicalNode,
} from 'lexical';

const createStyledTextNode = (text: string, style: string): LexicalNode => {
  const textNode = $createTextNode(text);
  textNode.setStyle(style);
  return textNode;
};

/** HTML -> LexicalNode[] 로 직접 변환해주는 함수 */
function importHtmlToLexicalNodes(htmlString: string): LexicalNode[] {
  const parser = new DOMParser();
  const dom = parser.parseFromString(htmlString, 'text/html');
  const body = dom.body;

  const lexicalNodes: LexicalNode[] = [];

  // DOM을 순회(재귀)하며 변환
  function traverse(node: ChildNode): LexicalNode | LexicalNode[] | null {
    // 텍스트 노드
    if (node.nodeType === Node.TEXT_NODE) {
      const textContent = node.textContent ?? '';
      if (!textContent) return null;

      // 부모가 span 태그면서 style이 있으면 가져오기
      const parentEl = node.parentElement;
      if (parentEl?.tagName === 'SPAN') {
        const style = parentEl.getAttribute('style') ?? '';
        return createStyledTextNode(textContent, style);
      } else {
        // 스타일이 없는 일반 텍스트 노드
        return $createTextNode(textContent);
      }
    }

    // 엘리먼트 노드
    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as HTMLElement;
      const tagName = element.tagName.toLowerCase();

      switch (tagName) {
        case 'p': {
          const paragraph = $createParagraphNode();
          element.childNodes.forEach((child) => {
            const childLexicalNode = traverse(child);
            if (childLexicalNode) {
              Array.isArray(childLexicalNode)
                ? paragraph.append(...childLexicalNode)
                : paragraph.append(childLexicalNode);
            }
          });
          return paragraph;
        }
        case 'span': {
          // span 아래에 #text만 있다는 가정이라면...
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
        // b, strong 등 다른 태그들도 여기에 추가로 처리
        default: {
          // children만 재귀 순회
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
  }

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
}

export const InitContentPlugin: React.FC<{ content: string }> = ({
  content,
}) => {
  const isInitializedRef = useRef(true);
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.update(() => {
      // const parser = new DOMParser();
      // const dom = parser.parseFromString(content, 'text/html');
      // const nodes = $generateNodesFromDOM(editor, dom);
      const nodes = importHtmlToLexicalNodes(content);
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
