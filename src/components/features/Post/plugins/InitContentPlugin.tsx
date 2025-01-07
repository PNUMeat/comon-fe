import { $createImageNode } from '@/components/features/Post/nodes/ImageNode';

import { useEffect, useRef } from 'react';

import { $createLinkNode } from '@lexical/link';
import { $createListItemNode, $createListNode } from '@lexical/list';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $createHeadingNode, HeadingTagType } from '@lexical/rich-text';
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

const mergeStyles = (parentStyle: string, childStyle: string): string => {
  if (!parentStyle) {
    return childStyle;
  }
  if (!childStyle) {
    return parentStyle;
  }
  return parentStyle + '; ' + childStyle;
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
        // <a> -> LinkNode
        case 'a': {
          const href = element.getAttribute('href') ?? '';
          const target = element.getAttribute('target');
          const linkNode = $createLinkNode(href);

          if (target === '_blank') {
            linkNode.setTarget('_blank');
          }

          element.childNodes.forEach((child) => {
            const childLexicalNode = traverse(child);
            if (childLexicalNode) {
              if (Array.isArray(childLexicalNode)) {
                linkNode.append(...childLexicalNode);
              } else {
                linkNode.append(childLexicalNode);
              }
            }
          });

          if (target === '_blank') {
            linkNode.setRel('noopener noreferrer');
          }

          return linkNode;
        }

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

        // <h1>, <h2>, <h3>, <h4>, <h5>, <h6> -> HeadingNode
        case 'h1':
        case 'h2':
        case 'h3':
        case 'h4':
        case 'h5':
        case 'h6': {
          const headingLevel = ('h' +
            parseInt(tagName[1], 10)) as HeadingTagType;
          const headingNode = $createHeadingNode(headingLevel);

          element.childNodes.forEach((child) => {
            const childLexicalNode = traverse(child);
            if (childLexicalNode) {
              if (Array.isArray(childLexicalNode)) {
                headingNode.append(...childLexicalNode);
              } else {
                headingNode.append(childLexicalNode);
              }
            }
          });

          return headingNode;
        }

        // <ul>, <ol> -> ListNode
        case 'ul':
        case 'ol': {
          const isOrdered = tagName === 'ol';
          const listNode = $createListNode(isOrdered ? 'number' : 'bullet');

          element.childNodes.forEach((child) => {
            const childLexicalNode = traverse(child);
            if (childLexicalNode) {
              if (Array.isArray(childLexicalNode)) {
                listNode.append(...childLexicalNode);
              } else {
                listNode.append(childLexicalNode);
              }
            }
          });

          return listNode;
        }

        // <li> -> ListItemNode
        case 'li': {
          const listItemNode = $createListItemNode();

          element.childNodes.forEach((child) => {
            const childLexicalNode = traverse(child);
            if (childLexicalNode) {
              if (Array.isArray(childLexicalNode)) {
                listItemNode.append(...childLexicalNode);
              } else {
                listItemNode.append(childLexicalNode);
              }
            }
          });

          return listItemNode;
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

        // <b>, <strong> -> 내부 TextNode에 bold 포맷 적용
        case 'b':
        case 'strong': {
          const currentTagStyle = element.getAttribute('style') ?? '';
          const nodes: LexicalNode[] = [];

          element.childNodes.forEach((child) => {
            const childLexicalNode = traverse(child);
            if (childLexicalNode) {
              if (Array.isArray(childLexicalNode)) {
                childLexicalNode.forEach((n) => {
                  if ($isTextNode(n)) {
                    if (currentTagStyle) {
                      n.setStyle(
                        mergeStyles(n.getStyle() ?? '', currentTagStyle)
                      );
                    }
                    n.setFormat('bold');
                  }
                });
                nodes.push(...childLexicalNode);
              } else {
                if ($isTextNode(childLexicalNode)) {
                  childLexicalNode.setFormat('bold');
                  if (currentTagStyle) {
                    childLexicalNode.setStyle(
                      mergeStyles(
                        childLexicalNode.getStyle() ?? '',
                        currentTagStyle
                      )
                    );
                  }
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
      $getRoot().clear().select();
      const selection = $getSelection();
      if (selection && isInitializedRef.current) {
        selection.insertNodes(nodes);
        isInitializedRef.current = false;
      }
    });
  }, [editor]);

  return null;
};
