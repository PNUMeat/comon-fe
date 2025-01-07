import { TextMatchTransformer } from '@/components/features/Post/utils';

import { $createLinkNode, $isLinkNode, LinkNode } from '@lexical/link';
import {
  $createListItemNode,
  $createListNode,
  $isListItemNode,
  $isListNode,
  ListItemNode,
  ListNode,
} from '@lexical/list';
import type { Transformer } from '@lexical/markdown';
import {
  $createHeadingNode,
  $createQuoteNode,
  $isHeadingNode,
  $isQuoteNode,
  HeadingNode,
  HeadingTagType,
  QuoteNode,
} from '@lexical/rich-text';
import {
  $createLineBreakNode,
  $createTextNode,
  $isTextNode,
  ElementNode,
  LexicalNode,
} from 'lexical';

const BOLD_ITALIC_STAR: Transformer = {
  format: ['bold', 'italic'] as const,
  tag: '***',
  type: 'text-format',
};

const BOLD_ITALIC_UNDERSCORE: Transformer = {
  format: ['bold', 'italic'] as const,
  intraword: false,
  tag: '___',
  type: 'text-format',
};

const BOLD_STAR: Transformer = {
  format: ['bold'] as const,
  tag: '**',
  type: 'text-format',
};

const BOLD_UNDERSCORE: Transformer = {
  format: ['bold'] as const,
  intraword: false,
  tag: '__',
  type: 'text-format',
};

const STRIKETHROUGH: Transformer = {
  format: ['strikethrough'] as const,
  tag: '~~',
  type: 'text-format',
};

const ITALIC_STAR: Transformer = {
  format: ['italic'] as const,
  tag: '*',
  type: 'text-format',
};

const ITALIC_UNDERSCORE: Transformer = {
  format: ['italic'] as const,
  intraword: false,
  tag: '_',
  type: 'text-format',
};

const LIST_INDENT_SIZE = 4;

const createBlockNode = (createNode: (match: string[]) => ElementNode) => {
  return (
    parentNode: ElementNode,
    children: LexicalNode[],
    match: string[]
    // isImport: boolean
  ): void => {
    const node = createNode(match);
    node.append(...children);
    parentNode.replace(node);
    node.select(0, 0);
  };
};

const getIndent = (whitespaces: string): number => {
  const tabs = whitespaces.match(/\t/g);
  const spaces = whitespaces.match(/ /g);
  let indent = 0;

  if (tabs) {
    indent += tabs.length;
  }

  if (spaces) {
    indent += Math.floor(spaces.length / LIST_INDENT_SIZE);
  }

  return indent;
};

const listReplace = (listType: 'bullet' | 'number' | 'check') => {
  return (
    parentNode: ElementNode,
    children: LexicalNode[],
    match: string[]
  ): void => {
    const previousNode = parentNode.getPreviousSibling();
    const nextNode = parentNode.getNextSibling();
    const listItem = $createListItemNode(
      listType === 'check' ? match[3] === 'x' : undefined
    );
    const listStyles = ['disc', 'circle', 'square'];

    if ($isListNode(nextNode) && nextNode.getListType() === listType) {
      const firstChild = nextNode.getFirstChild();
      if (firstChild !== null) {
        firstChild.insertBefore(listItem);
      } else {
        nextNode.append(listItem);
      }
      parentNode.remove();
    } else if (
      $isListNode(previousNode) &&
      previousNode.getListType() === listType
    ) {
      previousNode.append(listItem);
      parentNode.remove();
    } else {
      const list = $createListNode(listType);
      list.append(listItem);
      parentNode.replace(list);
    }

    listItem.append(...children);
    listItem.select(0, 0);
    const indent = getIndent(match[1]);
    if (indent) {
      listItem.setIndent(indent);
      listItem.setStyle(
        `list-style-type: ${listStyles[indent % listStyles.length]}`
      );
    }
  };
};

const listExport = (
  listNode: ListNode,
  traverseChildren: (node: ElementNode) => string,
  depth: number
): string => {
  const output: string[] = [];
  const children = listNode.getChildren();
  let index = 0;

  for (const listItemNode of children) {
    if ($isListItemNode(listItemNode)) {
      if (listItemNode.getChildrenSize() === 1) {
        const firstChild = listItemNode.getFirstChild();
        if ($isListNode(firstChild)) {
          output.push(listExport(firstChild, traverseChildren, depth + 1));
          continue;
        }
      }
      const indent = ' '.repeat(depth * LIST_INDENT_SIZE);
      const listType = listNode.getListType();
      const prefix =
        listType === 'number'
          ? `${listNode.getStart() + index}. `
          : listType === 'check'
            ? `- [${listItemNode.getChecked() ? 'x' : ' '}] `
            : '- ';
      output.push(indent + prefix + traverseChildren(listItemNode));
      index++;
    }
  }

  return output.join('\n');
};

const HEADING: Transformer = {
  dependencies: [HeadingNode],
  export: (
    node: LexicalNode,
    traverseChildren: (node: ElementNode) => string
  ): string | null => {
    if (!$isHeadingNode(node)) {
      return null;
    }
    const level = Number(node.getTag().slice(1));
    return '#'.repeat(level) + ' ' + traverseChildren(node);
  },
  regExp: /^(#{1,6})\s/,
  replace: createBlockNode((match) => {
    const tag = ('h' + match[1].length) as HeadingTagType;
    return $createHeadingNode(tag);
  }),
  type: 'element',
};

const QUOTE: Transformer = {
  dependencies: [QuoteNode],
  export: (
    node: LexicalNode,
    traverseChildren: (node: ElementNode) => string
  ): string | null => {
    if (!$isQuoteNode(node)) {
      return null;
    }

    const lines = traverseChildren(node).split('\n');
    const output: string[] = [];
    for (const line of lines) {
      output.push('> ' + line);
    }
    return output.join('\n');
  },
  regExp: /^>\s/,
  replace: (
    parentNode: ElementNode,
    children: Array<LexicalNode>,
    _match: string[],
    isImport?: boolean
  ) => {
    if (isImport) {
      const previousNode = parentNode.getPreviousSibling();
      if ($isQuoteNode(previousNode)) {
        previousNode.splice(previousNode.getChildrenSize(), 0, [
          $createLineBreakNode(),
          ...children,
        ]);
        previousNode.select(0, 0);
        parentNode.remove();
        return;
      }
    }

    const node = $createQuoteNode();
    node.append(...children);
    parentNode.replace(node);
    node.select(0, 0);
  },
  type: 'element',
};

const UNORDERED_LIST: Transformer = {
  dependencies: [ListNode, ListItemNode],
  export: (
    node: LexicalNode,
    traverseChildren: (node: ElementNode) => string
  ): string | null => {
    return $isListNode(node) ? listExport(node, traverseChildren, 0) : null;
  },
  regExp: /^(\s*)[-*+]\s/,
  replace: listReplace('bullet'),
  type: 'element',
};

const ORDERED_LIST: Transformer = {
  dependencies: [ListNode, ListItemNode],
  export: (
    node: LexicalNode,
    traverseChildren: (node: ElementNode) => string
  ): string | null => {
    return $isListNode(node) ? listExport(node, traverseChildren, 0) : null;
  },
  regExp: /^(\s*)(\d{1,})\.\s/,
  replace: listReplace('number'),
  type: 'element',
};

const LINK: TextMatchTransformer = {
  dependencies: [LinkNode],
  export: (node, _exportChildren, exportFormat) => {
    if (!$isLinkNode(node)) {
      return null;
    }
    const title = node.getTitle();
    const linkContent = title
      ? `[${node.getTextContent()}](${node.getURL()} "${title}")`
      : `[${node.getTextContent()}](${node.getURL()})`;
    const firstChild = node.getFirstChild();
    if (node.getChildrenSize() === 1 && $isTextNode(firstChild)) {
      return exportFormat(firstChild, linkContent);
    } else {
      return linkContent;
    }
  },
  importRegExp:
    /(?:\[([^[]+)\])(?:\((?:([^()\s]+)(?:\s"((?:[^"]*\\")*[^"]*)"\s*)?)\))/,
  regExp:
    /(?:\[([^[]+)\])(?:\((?:([^()\s]+)(?:\s"((?:[^"]*\\")*[^"]*)"\s*)?)\))$/,
  replace: (textNode, match) => {
    const [, linkText, linkUrl, linkTitle] = match;
    const linkNode = $createLinkNode(linkUrl, { title: linkTitle });
    const linkTextNode = $createTextNode(linkText);
    linkTextNode.setFormat(textNode.getFormat());
    linkNode.append(linkTextNode);
    textNode.replace(linkNode);
  },
  trigger: ')',
  type: 'text-match',
};

export const SHORTCUTS: Array<Transformer> = [
  HEADING,
  LINK,
  QUOTE,
  UNORDERED_LIST,
  ORDERED_LIST,
  BOLD_ITALIC_STAR,
  BOLD_ITALIC_UNDERSCORE,
  BOLD_STAR,
  BOLD_UNDERSCORE,
  STRIKETHROUGH,
  ITALIC_STAR,
  ITALIC_UNDERSCORE,
];
