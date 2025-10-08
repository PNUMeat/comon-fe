import { ImagePayload } from '@/components/features/Post/nodes/ImageNode';

import { $isAtNodeEnd } from '@lexical/selection';
import {
  ElementNode,
  Klass,
  LexicalCommand,
  LexicalNode,
  RangeSelection,
  TextNode,
  createCommand,
} from 'lexical';

export type InsertImagePayload = Readonly<ImagePayload>;
export const INSERT_IMAGE_COMMAND: LexicalCommand<InsertImagePayload> =
  createCommand('INSERT_IMAGE_COMMAND');

export const getSelectedNode = (
  selection: RangeSelection
): TextNode | ElementNode => {
  const anchor = selection.anchor;
  const focus = selection.focus;
  const anchorNode = selection.anchor.getNode();
  const focusNode = selection.focus.getNode();
  if (anchorNode === focusNode) {
    return anchorNode;
  }
  const isBackward = selection.isBackward();
  if (isBackward) {
    return $isAtNodeEnd(focus) ? anchorNode : focusNode;
  } else {
    return $isAtNodeEnd(anchor) ? focusNode : anchorNode;
  }
};

const VERTICAL_GAP = 10;
const HORIZONTAL_OFFSET = 5;

export const setFloatingElemPositionForLinkEditor = (
  targetRect: DOMRect | null,
  floatingElem: HTMLElement,
  anchorElem: HTMLElement,
  verticalGap: number = VERTICAL_GAP,
  horizontalOffset: number = HORIZONTAL_OFFSET
) => {
  const scrollerElem = anchorElem.parentElement;

  if (targetRect === null || !scrollerElem) {
    floatingElem.style.opacity = '0';
    floatingElem.style.transform = 'translate(-10000px, -10000px)';
    return;
  }

  const floatingElemRect = floatingElem.getBoundingClientRect();
  const anchorElementRect = anchorElem.getBoundingClientRect();
  const editorScrollerRect = scrollerElem.getBoundingClientRect();

  let top = targetRect.top - verticalGap;
  let left = targetRect.left - horizontalOffset;

  if (top < editorScrollerRect.top) {
    top += floatingElemRect.height + targetRect.height + verticalGap * 2;
  }

  if (left + floatingElemRect.width > editorScrollerRect.right) {
    left = editorScrollerRect.right - floatingElemRect.width - horizontalOffset;
  }

  top -= anchorElementRect.top;
  left -= anchorElementRect.left;

  floatingElem.style.opacity = '1';
  floatingElem.style.transform = `translate(${left}px, ${top}px)`;
};

export type TextMatchTransformer = Readonly<{
  dependencies: Array<Klass<LexicalNode>>;
  /**
   * Determines how a node should be exported to markdown
   */
  export?: (
    node: LexicalNode,
    exportChildren: (node: ElementNode) => string,
    exportFormat: (node: TextNode, textContent: string) => string
  ) => string | null;
  /**
   * This regex determines what text is matched during markdown imports
   */
  importRegExp?: RegExp;
  /**
   * This regex determines what text is matched for markdown shortcuts while typing in the editor
   */
  regExp: RegExp;
  /**
   * Determines how the matched markdown text should be transformed into a node during the markdown import process
   */
  replace?: (node: TextNode, match: RegExpMatchArray) => void;
  /**
   * For import operations, this function can be used to determine the end index of the match, after `importRegExp` has matched.
   * Without this function, the end index will be determined by the length of the match from `importRegExp`. Manually determining the end index can be useful if
   * the match from `importRegExp` is not the entire text content of the node. That way, `importRegExp` can be used to match only the start of the node, and `getEndIndex`
   * can be used to match the end of the node.
   *
   * @returns The end index of the match, or false if the match was unsuccessful and a different transformer should be tried.
   */
  getEndIndex?: (node: TextNode, match: RegExpMatchArray) => number | false;
  /**
   * Single character that allows the transformer to trigger when typed in the editor. This does not affect markdown imports outside of the markdown shortcut plugin.
   * If the trigger is matched, the `regExp` will be used to match the text in the second step.
   */
  trigger?: string;
  type: 'text-match';
}>;

export type MultilineElementTransformer = {
  /**
   * Use this function to manually handle the import process, once the `regExpStart` has matched successfully.
   * Without providing this function, the default behavior is to match until `regExpEnd` is found, or until the end of the document if `regExpEnd.optional` is true.
   *
   * @returns a tuple or null. The first element of the returned tuple is a boolean indicating if a multiline element was imported. The second element is the index of the last line that was processed. If null is returned, the next multilineElementTransformer will be tried. If undefined is returned, the default behavior will be used.
   */
  handleImportAfterStartMatch?: (args: {
    lines: Array<string>;
    rootNode: ElementNode;
    startLineIndex: number;
    startMatch: RegExpMatchArray;
    transformer: MultilineElementTransformer;
  }) => [boolean, number] | null | undefined;
  dependencies: Array<Klass<LexicalNode>>;
  /**
   * `export` is called when the `$convertToMarkdownString` is called to convert the editor state into markdown.
   *
   * @return return null to cancel the export, even though the regex matched. Lexical will then search for the next transformer.
   */
  export?: (
    node: LexicalNode,

    traverseChildren: (node: ElementNode) => string
  ) => string | null;
  /**
   * This regex determines when to start matching
   */
  regExpStart: RegExp;
  /**
   * This regex determines when to stop matching. Anything in between regExpStart and regExpEnd will be matched
   */
  regExpEnd?:
    | RegExp
    | {
        /**
         * Whether the end match is optional. If true, the end match is not required to match for the transformer to be triggered.
         * The entire text from regexpStart to the end of the document will then be matched.
         */
        optional?: true;
        regExp: RegExp;
      };
  /**
   * `replace` is called only when markdown is imported in the editor, not when it's typed
   *
   * @return return false to cancel the transform, even though the regex matched. Lexical will then search for the next transformer.
   */
  replace: (
    rootNode: ElementNode,
    /**
     * During markdown shortcut transforms, children nodes may be provided to the transformer. If this is the case, no `linesInBetween` will be provided and
     * the children nodes should be used instead of the `linesInBetween` to create the new node.
     */
    children: Array<LexicalNode> | null,
    startMatch: Array<string>,
    endMatch: Array<string> | null,
    /**
     * linesInBetween includes the text between the start & end matches, split up by lines, not including the matches themselves.
     * This is null when the transformer is triggered through markdown shortcuts (by typing in the editor)
     */
    linesInBetween: Array<string> | null,
    /**
     * Whether the match is from an import operation (e.g. through `$convertFromMarkdownString`) or not (e.g. through typing in the editor).
     */
    isImport: boolean
  ) => boolean | void;
  type: 'multiline-element';
};

export const getVisiblePageNumbers = (
  totalPages: number,
  pagesPerView: number,
  currentPage: number
) => {
  if (totalPages <= pagesPerView)
    return Array.from({ length: totalPages }, (_, index) => index + 1);

  const currentBlock = Math.floor(currentPage / pagesPerView);
  const startPage = currentBlock * pagesPerView;
  const pagesToShow = Math.min(pagesPerView, totalPages - startPage);

  return Array.from(
    { length: pagesToShow },
    (_, index) => startPage + index + 1
  );
};
