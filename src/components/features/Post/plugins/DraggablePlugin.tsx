import { Fragment, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { postImagesAtom } from '@/store/posting.ts';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { eventFiles } from '@lexical/rich-text';
import {
  calculateZoomLevel,
  isHTMLElement,
  mergeRegister,
} from '@lexical/utils';
import { useSetAtom } from 'jotai';
import {
  $getNearestNodeFromDOMNode,
  $getNodeByKey,
  $getRoot,
  COMMAND_PRIORITY_HIGH,
  COMMAND_PRIORITY_LOW,
  DRAGOVER_COMMAND,
  DROP_COMMAND,
  LexicalEditor,
} from 'lexical';

const SPACE = 4;
const TARGET_LINE_HALF_HEIGHT = 2;
const DRAGGABLE_BLOCK_MENU_CLASSNAME = 'draggable-block-menu';
const DRAG_DATA_FORMAT = 'application/x-lexical-drag-block';
const TEXT_BOX_HORIZONTAL_PADDING = 28;

const Downward = 1;
const Upward = -1;
const Indeterminate = 0;

let prevIndex = Infinity;

class Point {
  private readonly _x: number;
  private readonly _y: number;
  constructor(x: number, y: number) {
    this._x = x;
    this._y = y;
  }

  get x(): number {
    return this._x;
  }

  get y(): number {
    return this._y;
  }

  equals({ x, y }: { x: number; y: number }): boolean {
    return this.x === x && this.y === y;
  }

  calcDeltaXTo({ x }: { x: number }): number {
    return this.x - x;
  }

  calcDeltaYTo({ y }: { y: number }): number {
    return this.y - y;
  }

  calcHorizontalDistanceTo(point: Point): number {
    return Math.abs(this.calcDeltaXTo(point));
  }

  calcVerticalDistance(point: Point): number {
    return Math.abs(this.calcDeltaYTo(point));
  }

  calcDistanceTo(point: Point): number {
    return Math.sqrt(
      Math.pow(this.calcDeltaXTo(point), 2) +
        Math.pow(this.calcDeltaYTo(point), 2)
    );
  }
}

const isPoint = (x: unknown): x is Point => {
  return x instanceof Point;
};

class Rect {
  private readonly _top: number;
  private readonly _right: number;
  private readonly _bottom: number;
  private readonly _left: number;

  constructor(left: number, top: number, right: number, bottom: number) {
    const [physicTop, physicBottom] =
      top <= bottom ? [top, bottom] : [bottom, top];
    const [physicLeft, physicRight] =
      left <= right ? [left, right] : [right, left];

    this._top = physicTop;
    this._right = physicRight;
    this._left = physicLeft;
    this._bottom = physicBottom;
  }

  get top(): number {
    return this._top;
  }

  get right(): number {
    return this._right;
  }

  get bottom(): number {
    return this._bottom;
  }

  get left(): number {
    return this._left;
  }

  get width(): number {
    return Math.abs(this._left - this._right);
  }

  get height(): number {
    return Math.abs(this._bottom - this._top);
  }

  equals({
    top,
    left,
    bottom,
    right,
  }: {
    top: number;
    left: number;
    bottom: number;
    right: number;
  }): boolean {
    return (
      top === this._top &&
      bottom === this._bottom &&
      left === this._left &&
      right === this._right
    );
  }

  contains(target: Point | Rect):
    | boolean
    | {
        reason: {
          isOnTopSide: boolean;
          isOnBottomSide: boolean;
          isOnLeftSide: boolean;
          isOnRightSide: boolean;
        };
        result: boolean;
      } {
    if (isPoint(target)) {
      const { x, y } = target;

      const isOnTopSide = y < this._top;
      const isOnBottomSide = y > this._bottom;
      const isOnLeftSide = x < this._left;
      const isOnRightSide = x > this._right;

      const result =
        !isOnTopSide && !isOnBottomSide && !isOnLeftSide && !isOnRightSide;

      return {
        reason: {
          isOnBottomSide,
          isOnLeftSide,
          isOnRightSide,
          isOnTopSide,
        },
        result,
      };
    } else {
      const { top, left, bottom, right } = target;

      return (
        top >= this._top &&
        top <= this._bottom &&
        bottom >= this._top &&
        bottom <= this._bottom &&
        left >= this._left &&
        left <= this._right &&
        right >= this._left &&
        right <= this._right
      );
    }
  }

  intersectsWith(rect: Rect): boolean {
    const { left: x1, top: y1, width: w1, height: h1 } = rect;
    const { left: x2, top: y2, width: w2, height: h2 } = this;
    const maxX = x1 + w1 >= x2 + w2 ? x1 + w1 : x2 + w2;
    const maxY = y1 + h1 >= y2 + h2 ? y1 + h1 : y2 + h2;
    const minX = x1 <= x2 ? x1 : x2;
    const minY = y1 <= y2 ? y1 : y2;
    return maxX - minX <= w1 + w2 && maxY - minY <= h1 + h2;
  }

  generateNewRect({
    left = this.left,
    top = this.top,
    right = this.right,
    bottom = this.bottom,
  }: Partial<{
    left: number;
    top: number;
    right: number;
    bottom: number;
  }>): Rect {
    return new Rect(left, top, right, bottom);
  }

  static fromLTRB(
    left: number,
    top: number,
    right: number,
    bottom: number
  ): Rect {
    return new Rect(left, top, right, bottom);
  }

  static fromLWTH(
    left: number,
    width: number,
    top: number,
    height: number
  ): Rect {
    return new Rect(left, top, left + width, top + height);
  }

  static fromPoints(startPoint: Point, endPoint: Point): Rect {
    const { y: top, x: left } = startPoint;
    const { y: bottom, x: right } = endPoint;
    return Rect.fromLTRB(left, top, right, bottom);
  }

  static fromDOM(dom: HTMLElement): Rect {
    const { top, width, left, height } = dom.getBoundingClientRect();
    return Rect.fromLWTH(left, width, top, height);
  }
}

const getCurrentIndex = (keysLength: number) => {
  if (keysLength === 0) {
    return Infinity;
  }

  if (prevIndex >= 0 && prevIndex < keysLength) {
    return prevIndex;
  }

  return Math.floor(keysLength / 2);
};

const getTopLevelNodeKeys = (editor: LexicalEditor) => {
  return editor.getEditorState().read(() => $getRoot().getChildrenKeys());
};

const getCollapsedMargins = (
  elem: HTMLElement
): {
  marginTop: number;
  marginBottom: number;
} => {
  const getMargin = (
    element: Element | null,
    margin: 'marginTop' | 'marginBottom'
  ): number =>
    element ? parseFloat(window.getComputedStyle(element)[margin]) : 0;

  const { marginTop, marginBottom } = window.getComputedStyle(elem);
  const prevElemSiblingMarginBottom = getMargin(
    elem.previousElementSibling,
    'marginBottom'
  );
  const nextElemSiblingMarginTop = getMargin(
    elem.nextElementSibling,
    'marginTop'
  );
  const collapsedTopMargin = Math.max(
    parseFloat(marginTop),
    prevElemSiblingMarginBottom
  );
  const collapsedBottomMargin = Math.max(
    parseFloat(marginBottom),
    nextElemSiblingMarginTop
  );

  return { marginBottom: collapsedBottomMargin, marginTop: collapsedTopMargin };
};

const getBlockElement = (
  anchorElem: HTMLElement,
  editor: LexicalEditor,
  event: MouseEvent,
  useEdgeAsDefault = false
): HTMLElement | null => {
  const anchorElementRect = anchorElem.getBoundingClientRect();
  const topLevelNodeKeys = getTopLevelNodeKeys(editor);

  let blockElem: HTMLElement | null = null;

  editor.getEditorState().read(() => {
    if (useEdgeAsDefault) {
      const [firstNode, lastNode] = [
        editor.getElementByKey(topLevelNodeKeys[0]),
        editor.getElementByKey(topLevelNodeKeys[topLevelNodeKeys.length - 1]),
      ];

      const [firstNodeRect, lastNodeRect] = [
        firstNode?.getBoundingClientRect(),
        lastNode?.getBoundingClientRect(),
      ];

      if (firstNodeRect && lastNodeRect) {
        const firstNodeZoom = calculateZoomLevel(firstNode);
        const lastNodeZoom = calculateZoomLevel(lastNode);

        if (event.y / firstNodeZoom < firstNodeRect.top) {
          blockElem = firstNode;
        } else if (event.y / lastNodeZoom > lastNodeRect.bottom) {
          blockElem = lastNode;
        }

        if (blockElem) {
          return;
        }
      }
    }

    let index = getCurrentIndex(topLevelNodeKeys.length);
    let direction = Indeterminate;

    while (index >= 0 && index < topLevelNodeKeys.length) {
      const key = topLevelNodeKeys[index];
      const elem = editor.getElementByKey(key);

      if (elem === null) {
        break;
      }

      const zoom = calculateZoomLevel(elem);
      const point = new Point(event.x / zoom, event.y / zoom);
      const domRect = Rect.fromDOM(elem);
      const { marginTop, marginBottom } = getCollapsedMargins(elem);
      const rect = domRect.generateNewRect({
        bottom: domRect.bottom + marginBottom,
        left: anchorElementRect.left,
        right: anchorElementRect.right,
        top: domRect.top - marginTop,
      });

      const {
        result,
        reason: { isOnTopSide, isOnBottomSide },
      } = rect.contains(point) as {
        result: boolean;
        reason: {
          isOnTopSide: boolean;
          isOnBottomSide: boolean;
          isOnLeftSide: boolean;
          isOnRightSide: boolean;
        };
      };

      if (result) {
        blockElem = elem;
        prevIndex = index;
        break;
      }

      if (direction === Indeterminate) {
        if (isOnTopSide) {
          direction = Upward;
        } else if (isOnBottomSide) {
          direction = Downward;
        } else {
          direction = Infinity;
        }
      }

      index += direction;
    }
  });

  return blockElem;
};

const isOnMenu = (element: HTMLElement) => {
  return !!element.closest(`.${DRAGGABLE_BLOCK_MENU_CLASSNAME}`);
};

const setMenuPosition = (
  targetElem: HTMLElement | null,
  floatingElem: HTMLElement,
  anchorElem: HTMLElement
) => {
  if (!targetElem) {
    floatingElem.style.opacity = '0';
    floatingElem.style.transform = 'translate(-10000px, -10000px)';
    return;
  }

  const targetRect = targetElem.getBoundingClientRect();
  const targetStyle = window.getComputedStyle(targetElem);
  const floatingElemRect = floatingElem.getBoundingClientRect();
  const anchorElementRect = anchorElem.getBoundingClientRect();

  const top =
    targetRect.top +
    (parseInt(targetStyle.lineHeight, 10) - floatingElemRect.height) / 2 -
    anchorElementRect.top;

  const left = SPACE;

  floatingElem.style.opacity = '1';
  floatingElem.style.transform = `translate(${left}px, ${top}px)`;
};

const setDragImage = (
  dataTransfer: DataTransfer,
  draggableBlockElem: HTMLElement
) => {
  const { transform } = draggableBlockElem.style;

  draggableBlockElem.style.transform = 'translateZ(0)';
  dataTransfer.setDragImage(draggableBlockElem, 0, 0);

  setTimeout(() => {
    draggableBlockElem.style.transform = transform;
  });
};

const setTargetLine = (
  targetLineElem: HTMLElement,
  targetBlockElem: HTMLElement,
  mouseY: number,
  anchorElem: HTMLElement
) => {
  const { top: targetBlockElemTop, height: targetBlockElemHeight } =
    targetBlockElem.getBoundingClientRect();
  const { top: anchorTop, width: anchorWidth } =
    anchorElem.getBoundingClientRect();
  const { marginTop, marginBottom } = getCollapsedMargins(targetBlockElem);
  let lineTop = targetBlockElemTop;
  const clientY = mouseY - window.scrollY;
  if (clientY >= targetBlockElemTop) {
    lineTop += targetBlockElemHeight + marginBottom / 2;
  } else {
    lineTop -= marginTop / 2;
  }

  const top = lineTop - anchorTop - TARGET_LINE_HALF_HEIGHT;
  const left = TEXT_BOX_HORIZONTAL_PADDING - SPACE;

  targetLineElem.style.transform = `translate(${left}px, ${top}px)`;
  targetLineElem.style.width = `${
    anchorWidth - (TEXT_BOX_HORIZONTAL_PADDING - SPACE) * 2
  }px`;
  targetLineElem.style.opacity = '.4';
};

const hideTargetLine = (targetLineElem: HTMLElement | null) => {
  if (targetLineElem) {
    targetLineElem.style.opacity = '0';
    targetLineElem.style.transform = 'translate(-10000px, -10000px)';
  }
};

const useDraggableBlockMenu = (
  editor: LexicalEditor,
  anchorElem: HTMLElement,
  isEditable: boolean
) => {
  const scrollerElem = anchorElem.parentElement;

  const menuRef = useRef(null);
  const targetLineRef = useRef(null);
  const isDraggingBlockRef = useRef<boolean>(false);
  const [draggableBlockElem, setDraggableBlockElem] =
    useState<HTMLElement | null>(null);
  const setPostImages = useSetAtom(postImagesAtom);

  useEffect(() => {
    const onMouseMove = (event: MouseEvent) => {
      const target = event.target;

      if (!isHTMLElement(target as EventTarget)) {
        setDraggableBlockElem(null);
        return;
      }

      if (isOnMenu(target as HTMLElement)) {
        return;
      }

      const _draggableBlockElem = getBlockElement(anchorElem, editor, event);

      setDraggableBlockElem(_draggableBlockElem);
    };

    const onMouseLeave = () => {
      setDraggableBlockElem(null);
    };

    scrollerElem?.addEventListener('mousemove', onMouseMove);
    scrollerElem?.addEventListener('mouseleave', onMouseLeave);

    return () => {
      scrollerElem?.removeEventListener('mousemove', onMouseMove);
      scrollerElem?.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [scrollerElem, anchorElem, editor]);

  useEffect(() => {
    if (menuRef.current) {
      setMenuPosition(draggableBlockElem, menuRef.current, anchorElem);
    }
  }, [anchorElem, draggableBlockElem]);

  useEffect(() => {
    const onDragover = (event: DragEvent) => {
      if (!isDraggingBlockRef.current) {
        return false;
      }
      const [isFileTransfer] = eventFiles(event);
      if (isFileTransfer) {
        return false;
      }
      const { pageY, target } = event;
      if (!isHTMLElement(target as EventTarget)) {
        return false;
      }
      const targetBlockElem = getBlockElement(anchorElem, editor, event, true);
      const targetLineElem = targetLineRef.current;
      if (targetBlockElem === null || targetLineElem === null) {
        return false;
      }
      setTargetLine(
        targetLineElem,
        targetBlockElem,
        pageY / calculateZoomLevel(target as Element),
        anchorElem
      );

      event.preventDefault();
      return true;
    };

    const $onDrop = (event: DragEvent) => {
      if (!isDraggingBlockRef.current) {
        return false;
      }

      const [isFileTransfer] = eventFiles(event);
      if (isFileTransfer) {
        return false;
      }

      const { target, dataTransfer, pageY } = event;
      const dragData = dataTransfer?.getData(DRAG_DATA_FORMAT) || '';
      const draggedNode = $getNodeByKey(dragData);

      if (!draggedNode) {
        return false;
      }

      if (!isHTMLElement(target as EventTarget)) {
        return false;
      }

      const targetBlockElem = getBlockElement(anchorElem, editor, event, true);
      if (!targetBlockElem) {
        return false;
      }

      const targetNode = $getNearestNodeFromDOMNode(targetBlockElem);
      if (!targetNode) {
        return false;
      }
      if (targetNode === draggedNode) {
        return true;
      }

      const targetBlockElemTop = targetBlockElem.getBoundingClientRect().top;

      const clientY =
        pageY / calculateZoomLevel(target as Element) - window.scrollY;
      if (clientY >= targetBlockElemTop) {
        targetNode.insertAfter(draggedNode);
      } else {
        targetNode.insertBefore(draggedNode);
      }

      editor.read(() => {
        const dragElement = editor.getElementByKey(dragData);
        if (!dragElement) {
          return;
        }
        const imgs = dragElement.querySelectorAll('img');
        const imgArray = [...imgs];
        if (imgArray.length === 0) {
          return;
        }

        const line = $getRoot()
          .getChildren()
          .findIndex((node) => node.getKey() === dragData);
        const imgNodeKeys = imgArray
          .map((img) => $getNearestNodeFromDOMNode(img)?.getKey())
          .filter((key) => key !== undefined);

        // console.log('my img keys', imgArray, imgNodeKeys);

        setPostImages((prev) => {
          const targets = prev.filter((img) => imgNodeKeys.includes(img.key));
          const targetOriginLine = targets[0].line;
          const targetNewLine = line;
          if (targetOriginLine === targetNewLine) {
            return prev;
          }

          const rangeStart = Math.min(targetOriginLine, targetNewLine);
          const rangeEnd = Math.max(targetOriginLine, targetNewLine);

          const rearrangedArr = prev.map((imgObj) => {
            if (imgNodeKeys.includes(imgObj.key)) {
              // console.log('이동됨', imgObj.key);
              return { ...imgObj, line: targetNewLine };
            }

            if (imgObj.line >= rangeStart && imgObj.line <= rangeEnd) {
              if (
                targetNewLine < targetOriginLine &&
                imgObj.line >= targetNewLine
                // && imgObj.line < targetOriginLine
              ) {
                // console.log('아래로 밀러남', imgObj.key);
                return { ...imgObj, line: imgObj.line + 1 };
              }

              if (
                targetNewLine > targetOriginLine &&
                imgObj.line > targetOriginLine
                // && imgObj.line <= targetNewLine
              ) {
                // console.log('위로 밀려남', imgObj.key);
                return { ...imgObj, line: imgObj.line - 1 };
              }
            }
            // console.log('그대로', imgObj.key);
            return imgObj;
          });
          console.error('rearrange fin', rearrangedArr);
          return rearrangedArr;
        });
      });

      setDraggableBlockElem(null);

      return true;
    };

    return mergeRegister(
      editor.registerCommand(
        DRAGOVER_COMMAND,
        (event) => {
          return onDragover(event);
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        DROP_COMMAND,
        (event) => {
          return $onDrop(event);
        },
        COMMAND_PRIORITY_HIGH
      )
    );
  }, [anchorElem, editor]);

  const onDragStart = (event: React.DragEvent<HTMLDivElement>) => {
    const dataTransfer = event.dataTransfer;
    if (!dataTransfer || !draggableBlockElem) {
      return;
    }

    setDragImage(dataTransfer, draggableBlockElem);
    let nodeKey = '';
    editor.update(() => {
      const node = $getNearestNodeFromDOMNode(draggableBlockElem);
      if (node) {
        nodeKey = node.getKey();
      }
    });

    isDraggingBlockRef.current = true;
    dataTransfer.setData(DRAG_DATA_FORMAT, nodeKey);
  };

  const onDragEnd = () => {
    isDraggingBlockRef.current = false;
    hideTargetLine(targetLineRef.current);
  };

  return createPortal(
    <Fragment>
      <div
        className="icon draggable-block-menu"
        ref={menuRef}
        draggable={true}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      >
        <div className={isEditable ? 'icon' : ''}>::</div>
      </div>
      <div className="draggable-block-target-line" ref={targetLineRef} />
    </Fragment>,
    anchorElem
  );
};

export const DraggablePlugin = ({ anchorElem = document.body }) => {
  const [editor] = useLexicalComposerContext();
  return useDraggableBlockMenu(editor, anchorElem, editor._editable);
};
