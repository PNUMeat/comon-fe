// import {
//   $isImageNode,
//   ImageNode,
// } from '@/components/features/Post/nodes/ImageNode';
//
// import { useEffect } from 'react';
//
// import {
//   $createCodeNode,
//   $isCodeHighlightNode,
//   $isCodeNode,
//   CodeHighlightNode,
//   CodeNode,
// } from '@lexical/code';
// import { $createLinkNode, $isLinkNode, LinkNode } from '@lexical/link';
// import {
//   $isListItemNode,
//   $isListNode,
//   ListItemNode,
//   ListNode,
// } from '@lexical/list';
// import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
// import {
//   $createHeadingNode,
//   $isHeadingNode,
//   HeadingNode,
//   HeadingTagType,
//   QuoteNode,
// } from '@lexical/rich-text';
// import {
//   $createLineBreakNode,
//   $createRangeSelection,
//   $getSelection,
//   $isElementNode,
//   $isLineBreakNode,
//   $isNodeSelection,
//   $isParagraphNode,
//   $isRangeSelection,
//   $isTextNode,
//   $setSelection,
//   COMMAND_PRIORITY_CRITICAL,
//   COMMAND_PRIORITY_HIGH,
//   CommandPayloadType,
//   ElementNode,
//   LexicalCommand,
//   LexicalEditor,
//   LexicalNode,
//   NodeKey,
//   SerializedLexicalNode,
//   SerializedTextNode,
//   TextFormatType,
//   TextNode,
//   createCommand,
// } from 'lexical';
// import { $createParagraphNode, $createTextNode } from 'lexical';
//
// export const CUT_LINE_COMMAND: LexicalCommand<void> = createCommand('cut-line');
// export const PASTE_LINE_COMMAND: LexicalCommand<void> =
//   createCommand('paste-line');
// export const COPY_LINE_COMMAND: LexicalCommand<void> =
//   createCommand('copy-line');
//
// interface InternalClipboardData {
//   type: string;
//   nodes: SerializedLexicalNode[];
//   nodeType?: string;
//   textContent?: string;
//   timestamp: number;
// }
//
// function $findCurrentLine(selection: ReturnType<typeof $getSelection>) {
//   if (!$isRangeSelection(selection) && !$isNodeSelection(selection)) {
//     return null;
//   }
//
//   let currentNode;
//   let offset = 0;
//
//   if ($isRangeSelection(selection)) {
//     currentNode = selection.anchor.getNode();
//     offset = selection.anchor.offset;
//   } else if ($isNodeSelection(selection)) {
//     currentNode = selection.getNodes()[0];
//   }
//
//   if (!currentNode) {
//     return null;
//   }
//
//   let blockNode = currentNode;
//   while (
//     blockNode &&
//     !$isParagraphNode(blockNode) &&
//     !$isElementNode(blockNode) &&
//     !$isHeadingNode(blockNode) &&
//     !$isCodeNode(blockNode) &&
//     !$isListNode(blockNode) &&
//     !$isListItemNode(blockNode) &&
//     !$isQuoteNode(blockNode)
//   ) {
//     const parent = blockNode.getParent();
//     if (!parent) break;
//     blockNode = parent;
//   }
//
//   if (!blockNode) {
//     return null;
//   }
//
//   return {
//     blockNode: blockNode as ElementNode,
//     nodes: (blockNode as ElementNode).getChildren(),
//     offset,
//   };
// }
//
// function $isQuoteNode(node: LexicalNode): node is QuoteNode {
//   return node instanceof QuoteNode;
// }
//
// function serializeNodeForClipboard(node: LexicalNode): string {
//   if ($isLineBreakNode(node)) {
//     return '\n';
//   }
//
//   if ($isCodeHighlightNode(node)) {
//     return node.getTextContent();
//   }
//
//   if ($isTextNode(node)) {
//     return node.getTextContent();
//   }
//
//   if ($isLinkNode(node)) {
//     return node.getTextContent();
//   }
//
//   return node.getTextContent ? node.getTextContent() : '';
// }
//
// function extractTextFromNode(node: LexicalNode): string {
//   if ($isTextNode(node)) {
//     return node.getTextContent();
//   } else if ($isLineBreakNode(node)) {
//     return '\n';
//   } else if ($isCodeHighlightNode(node)) {
//     return node.getTextContent();
//   } else if ($isLinkNode(node)) {
//     return node.getTextContent();
//   } else if ($isCodeNode(node)) {
//     const codeContent = node.getTextContent();
//     if (codeContent && codeContent.trim() !== '') {
//       return codeContent;
//     }
//     return node.getChildren().map(extractTextFromNode).join('');
//   } else if ($isElementNode(node)) {
//     const children = node.getChildren();
//     return children.map(extractTextFromNode).join('');
//   }
//   return node.getTextContent ? node.getTextContent() : '';
// }
//
// function extractCodeText(codeNode: LexicalNode): string {
//   if (!$isCodeNode(codeNode)) {
//     return '';
//   }
//
//   const textContent = [];
//   const children = codeNode.getChildren();
//
//   for (const child of children) {
//     if ($isCodeHighlightNode(child)) {
//       textContent.push(child.getTextContent());
//     } else if ($isLineBreakNode(child)) {
//       textContent.push('\n');
//     } else if ($isTextNode(child)) {
//       textContent.push(child.getTextContent());
//     }
//   }
//
//   return textContent.join('');
// }
//
// let internalClipboardData: InternalClipboardData | null = null;
//
// function preserveTextNodeFormat(textNode: TextNode): SerializedTextNode {
//   const serialized = textNode.exportJSON() as SerializedTextNode;
//   if (textNode.hasFormat('bold')) {
//     serialized.format = serialized.format | 1;
//   }
//   if (textNode.hasFormat('italic')) {
//     serialized.format = serialized.format | 2;
//   }
//   if (textNode.hasFormat('underline')) {
//     serialized.format = serialized.format | 8;
//   }
//   if (textNode.hasFormat('strikethrough')) {
//     serialized.format = serialized.format | 4;
//   }
//   if (textNode.hasFormat('subscript')) {
//     serialized.format = serialized.format | 32;
//   }
//   if (textNode.hasFormat('superscript')) {
//     serialized.format = serialized.format | 64;
//   }
//
//   if (textNode.getStyle()) {
//     serialized.style = textNode.getStyle();
//   }
//
//   return serialized;
// }
//
// function cutCurrentLine(editor: LexicalEditor): boolean {
//   return editor.update(() => {
//     try {
//       const selection = $getSelection();
//       const lineInfo = $findCurrentLine(selection);
//
//       if (!lineInfo) {
//         return false;
//       }
//
//       const { blockNode, nodes } = lineInfo;
//
//       let nodeType = 'paragraph';
//       if ($isHeadingNode(blockNode)) {
//         nodeType = `heading-${blockNode.getTag()}`;
//       } else if ($isCodeNode(blockNode)) {
//         nodeType = `code-${blockNode.getLanguage() || 'plain'}`;
//       } else if ($isListNode(blockNode)) {
//         nodeType = `list-${blockNode.getListType()}`;
//       } else if ($isQuoteNode(blockNode)) {
//         nodeType = 'quote';
//       } else if ($isImageNode(blockNode)) {
//         nodeType = 'image';
//       } else if ($isLinkNode(blockNode)) {
//         nodeType = 'link';
//       }
//
//       const nodeData = nodes
//         .map((node: LexicalNode) => {
//           if ($isTextNode(node)) {
//             return preserveTextNodeFormat(node);
//           } else if ($isLinkNode(node)) {
//             const linkJSON = node.exportJSON();
//             if (linkJSON.children) {
//               linkJSON.children = linkJSON.children.map(
//                 (child: SerializedLexicalNode) => {
//                   if (child.type === 'text') {
//                     const textNode = node
//                       .getChildren()
//                       .find(
//                         (n) =>
//                           $isTextNode(n) &&
//                           n.getTextContent() ===
//                             (child as SerializedTextNode).text
//                       );
//                     if (textNode && $isTextNode(textNode)) {
//                       return preserveTextNodeFormat(textNode);
//                     }
//                   }
//                   return child;
//                 }
//               );
//             }
//             return linkJSON;
//           } else {
//             return node.exportJSON ? node.exportJSON() : null;
//           }
//         })
//         .filter(Boolean) as SerializedLexicalNode[];
//
//       let textContent = '';
//
//       if ($isCodeNode(blockNode)) {
//         textContent = extractCodeText(blockNode);
//       } else {
//         textContent = blockNode.getTextContent();
//         if (!textContent || textContent.trim() === '') {
//           textContent = extractTextFromNode(blockNode);
//         }
//       }
//
//       internalClipboardData = {
//         type: 'line',
//         nodes: nodeData,
//         nodeType: nodeType,
//         textContent: textContent,
//         timestamp: Date.now(),
//       };
//
//       const textData = textContent;
//
//       try {
//         navigator.clipboard.writeText(textData).catch((e) => {
//           const textarea = document.createElement('textarea');
//           textarea.value = textData;
//           document.body.appendChild(textarea);
//           textarea.select();
//           document.execCommand('copy');
//           document.body.removeChild(textarea);
//         });
//       } catch (error) {
//       }
//
//       const parentNode = blockNode.getParent();
//       if (!parentNode) {
//         return false;
//       }
//
//       const blockNodeIndex = parentNode.getChildren().indexOf(blockNode);
//
//       blockNode.remove();
//
//       const newParagraph = $createParagraphNode();
//
//       if (blockNodeIndex === 0) {
//         parentNode.append(newParagraph);
//       } else {
//         const previousSibling = parentNode.getChildAtIndex(blockNodeIndex - 1);
//         if (previousSibling) {
//           previousSibling.insertAfter(newParagraph);
//         } else {
//           parentNode.append(newParagraph);
//         }
//       }
//
//       const newSelection = $createRangeSelection();
//       newSelection.anchor.set(newParagraph.getKey(), 0, 'element');
//       newSelection.focus.set(newParagraph.getKey(), 0, 'element');
//       $setSelection(newSelection);
//
//       return true;
//     } catch (error) {
//       return false;
//     }
//   });
// }
//
// function createCodeNodeWithText(language: string, text: string): CodeNode {
//   const codeNode = $createCodeNode(language);
//
//   const lines = text.split('\n');
//
//   for (let i = 0; i < lines.length; i++) {
//     if (i > 0) {
//       codeNode.append($createLineBreakNode());
//     }
//
//     if (lines[i]) {
//       codeNode.append($createTextNode(lines[i]));
//     }
//   }
//
//   return codeNode;
// }
//
// function applyTextNodeFormat(textNode: TextNode, format: number) {
//   if (format & 1) textNode.toggleFormat('bold');
//   if (format & 2) textNode.toggleFormat('italic');
//   if (format & 4) textNode.toggleFormat('strikethrough');
//   if (format & 8) textNode.toggleFormat('underline');
//   if (format & 32) textNode.toggleFormat('subscript');
//   if (format & 64) textNode.toggleFormat('superscript');
//   return textNode;
// }
//
// function createNodesFromJSON(
//   nodesJSON: SerializedLexicalNode[]
// ): LexicalNode[] {
//   const deserializeNode = (
//     nodeData: SerializedLexicalNode
//   ): LexicalNode | null => {
//     if (!nodeData || !nodeData.type) {
//       return null;
//     }
//
//     const { type, ...rest } = nodeData;
//
//     switch (type) {
//       case 'text': {
//         const textNode = $createTextNode(rest.text || '');
//         if (rest.format) {
//           applyTextNodeFormat(textNode, rest.format as number);
//         }
//         if (rest.style) {
//           textNode.setStyle(rest.style as string);
//         }
//         if (rest.mode) {
//           textNode.setMode(rest.mode as number);
//         }
//         if (rest.detail) {
//           textNode.setDetail(rest.detail as number);
//         }
//         return textNode;
//       }
//
//       case 'paragraph': {
//         const para = $createParagraphNode();
//         if (rest.children) {
//           (rest.children as SerializedLexicalNode[]).forEach((child) => {
//             const childNode = deserializeNode(child);
//             if (childNode) {
//               para.append(childNode);
//             }
//           });
//         }
//         return para;
//       }
//
//       case 'heading': {
//         const headingNode = $createHeadingNode(rest.tag as HeadingTagType);
//         if (rest.children) {
//           (rest.children as SerializedLexicalNode[]).forEach((child) => {
//             const childNode = deserializeNode(child);
//             if (childNode) {
//               headingNode.append(childNode);
//             }
//           });
//         }
//         return headingNode;
//       }
//
//       case 'quote': {
//         const quoteNode = new QuoteNode();
//         if (rest.children) {
//           (rest.children as SerializedLexicalNode[]).forEach((child) => {
//             const childNode = deserializeNode(child);
//             if (childNode) {
//               quoteNode.append(childNode);
//             }
//           });
//         }
//         return quoteNode;
//       }
//
//       case 'code': {
//         const codeNode = $createCodeNode((rest.language as string) || '');
//         if (rest.children) {
//           (rest.children as SerializedLexicalNode[]).forEach((child) => {
//             const childNode = deserializeNode(child);
//             if (childNode) {
//               codeNode.append(childNode);
//             }
//           });
//         }
//         return codeNode;
//       }
//
//       case 'code-highlight': {
//         if (rest.text) {
//           return $createTextNode(rest.text as string);
//         }
//         return new CodeHighlightNode((rest.highlightType as string) || '');
//       }
//
//       case 'linebreak': {
//         return $createLineBreakNode();
//       }
//
//       case 'link': {
//         const link = $createLinkNode((rest.url as string) || '');
//         if (rest.target) {
//           link.setTarget(rest.target as string);
//         }
//         if (rest.rel) {
//           link.setRel(rest.rel as string);
//         }
//         if (rest.children) {
//           (rest.children as SerializedLexicalNode[]).forEach((child) => {
//             const childNode = deserializeNode(child);
//             if (childNode) {
//               link.append(childNode);
//             }
//           });
//         }
//         return link;
//       }
//
//       case 'list': {
//         const listNode = new ListNode(
//           rest.listType as string,
//           rest.start as number
//         );
//         if (rest.children) {
//           (rest.children as SerializedLexicalNode[]).forEach((child) => {
//             const childNode = deserializeNode(child);
//             if (childNode) {
//               listNode.append(childNode);
//             }
//           });
//         }
//         return listNode;
//       }
//
//       case 'listitem': {
//         const listItemNode = new ListItemNode(
//           rest.value as string,
//           rest.checked as boolean
//         );
//         if (rest.children) {
//           (rest.children as SerializedLexicalNode[]).forEach((child) => {
//             const childNode = deserializeNode(child);
//             if (childNode) {
//               listItemNode.append(childNode);
//             }
//           });
//         }
//         return listItemNode;
//       }
//
//       case 'image': {
//         if (rest.src) {
//           return new ImageNode(
//             rest.src as string,
//             (rest.altText as string) || '',
//             (rest.maxWidth as number) || 600,
//             rest.width as number,
//             rest.height as number,
//             rest.key as NodeKey
//           );
//         }
//         return null;
//       }
//
//       default:
//         return null;
//     }
//   };
//
//   return nodesJSON.map(deserializeNode).filter(Boolean) as LexicalNode[];
// }
//
// function pasteCurrentLine(editor: LexicalEditor): void {
//   return editor.update(() => {
//     try {
//       const selection = $getSelection();
//       if (!$isRangeSelection(selection)) {
//         adjustCursorAfterPaste(editor);
//         return false;
//       }
//
//       if (!internalClipboardData || internalClipboardData.type !== 'line') {
//         adjustCursorAfterPaste(editor);
//         return false;
//       }
//
//       const { nodes: nodesJSON, nodeType, textContent } = internalClipboardData;
//
//       if (!selection.isCollapsed()) {
//         selection.removeText();
//       }
//
//       const anchorNode = selection.anchor.getNode();
//
//       try {
//         if (textContent) {
//           if ($isTextNode(anchorNode)) {
//             const currentTextContent = anchorNode.getTextContent();
//             const offset = selection.anchor.offset;
//             const beforeText = currentTextContent.slice(0, offset);
//             const afterText = currentTextContent.slice(offset);
//
//             const format = anchorNode.getFormat();
//             const style = anchorNode.getStyle();
//
//             anchorNode.setTextContent(beforeText);
//
//             const parentNode = anchorNode.getParent();
//             if (parentNode && $isElementNode(parentNode)) {
//               if (nodesJSON && nodesJSON.length > 0) {
//                 const formattedNodes = createNodesFromJSON(nodesJSON);
//                 let lastInsertedNode = anchorNode;
//
//                 formattedNodes.forEach(node => {
//                   lastInsertedNode.insertAfter(node);
//                   lastInsertedNode = node;
//                 });
//
//                 if (afterText) {
//                   const afterTextNode = $createTextNode(afterText);
//                   if (format) afterTextNode.setFormat(format);
//                   if (style) afterTextNode.setStyle(style);
//                   lastInsertedNode.insertAfter(afterTextNode);
//                 }
//
//                 const lastNode = formattedNodes[formattedNodes.length - 1];
//                 const newSelection = $createRangeSelection();
//
//                 if ($isTextNode(lastNode)) {
//                   const lastNodeContent = lastNode.getTextContent();
//                   newSelection.anchor.set(lastNode.getKey(), lastNodeContent.length, 'text');
//                   newSelection.focus.set(lastNode.getKey(), lastNodeContent.length, 'text');
//                 } else if ($isElementNode(lastNode)) {
//                   newSelection.anchor.set(lastNode.getKey(), lastNode.getChildrenSize(), 'element');
//                   newSelection.focus.set(lastNode.getKey(), lastNode.getChildrenSize(), 'element');
//                 }
//
//                 $setSelection(newSelection);
//               } else {
//                 const newTextNode = $createTextNode(textContent);
//                 if (format) newTextNode.setFormat(format);
//                 if (style) newTextNode.setStyle(style);
//
//                 anchorNode.insertAfter(newTextNode);
//
//                 if (afterText) {
//                   const afterTextNode = $createTextNode(afterText);
//                   if (format) afterTextNode.setFormat(format);
//                   if (style) afterTextNode.setStyle(style);
//                   newTextNode.insertAfter(afterTextNode);
//                 }
//
//                 const newSelection = $createRangeSelection();
//                 newSelection.anchor.set(newTextNode.getKey(), textContent.length, 'text');
//                 newSelection.focus.set(newTextNode.getKey(), textContent.length, 'text');
//                 $setSelection(newSelection);
//               }
//
//               return true;
//             }
//           } else if ($isElementNode(anchorNode)) {
//             const textNode = $createTextNode(textContent);
//             const offset = selection.anchor.offset;
//
//             if (offset >= anchorNode.getChildrenSize()) {
//               anchorNode.append(textNode);
//             } else {
//               const childNode = anchorNode.getChildAtIndex(offset);
//               if (childNode) {
//                 childNode.insertBefore(textNode);
//               } else {
//                 anchorNode.append(textNode);
//               }
//             }
//
//             const newSelection = $createRangeSelection();
//             newSelection.anchor.set(textNode.getKey(), textContent.length, 'text');
//             newSelection.focus.set(textNode.getKey(), textContent.length, 'text');
//             $setSelection(newSelection);
//
//             return true;
//           }
//         }
//
//         if (nodesJSON && nodesJSON.length > 0) {
//           const nodes = createNodesFromJSON(nodesJSON);
//
//           if (nodes && nodes.length > 0) {
//             if ($isTextNode(anchorNode)) {
//               const currentTextContent = anchorNode.getTextContent();
//               const offset = selection.anchor.offset;
//               const beforeText = currentTextContent.slice(0, offset);
//               const afterText = currentTextContent.slice(offset);
//
//               anchorNode.setTextContent(beforeText);
//
//               const parentNode = anchorNode.getParent();
//               if (parentNode && $isElementNode(parentNode)) {
//                 const anchorIndex = parentNode.getChildren().indexOf(anchorNode);
//
//                 let lastInsertedNode = anchorNode;
//                 nodes.forEach(node => {
//                   lastInsertedNode.insertAfter(node);
//                   lastInsertedNode = node;
//                 });
//
//                 if (afterText) {
//                   const afterTextNode = $createTextNode(afterText);
//                   lastInsertedNode.insertAfter(afterTextNode);
//                 }
//
//                 const lastNode = nodes[nodes.length - 1];
//                 const newSelection = $createRangeSelection();
//
//                 if ($isTextNode(lastNode)) {
//                   const lastNodeContent = lastNode.getTextContent();
//                   newSelection.anchor.set(lastNode.getKey(), lastNodeContent.length, 'text');
//                   newSelection.focus.set(lastNode.getKey(), lastNodeContent.length, 'text');
//                 } else if ($isElementNode(lastNode)) {
//                   newSelection.anchor.set(lastNode.getKey(), lastNode.getChildrenSize(), 'element');
//                   newSelection.focus.set(lastNode.getKey(), lastNode.getChildrenSize(), 'element');
//                 }
//
//                 $setSelection(newSelection);
//                 return true;
//               }
//             } else if ($isElementNode(anchorNode)) {
//               const offset = selection.anchor.offset;
//
//               if (offset >= anchorNode.getChildrenSize()) {
//                 nodes.forEach(node => anchorNode.append(node));
//               } else {
//                 const childNode = anchorNode.getChildAtIndex(offset);
//                 if (childNode) {
//                   let prevNode = childNode.getPreviousSibling() || null;
//                   nodes.forEach(node => {
//                     if (prevNode) {
//                       prevNode.insertAfter(node);
//                       prevNode = node;
//                     } else {
//                       childNode.insertBefore(node);
//                       prevNode = node;
//                     }
//                   });
//                 } else {
//                   nodes.forEach(node => anchorNode.append(node));
//                 }
//               }
//
//               const lastNode = nodes[nodes.length - 1];
//               const newSelection = $createRangeSelection();
//
//               if ($isTextNode(lastNode)) {
//                 const lastNodeContent = lastNode.getTextContent();
//                 newSelection.anchor.set(lastNode.getKey(), lastNodeContent.length, 'text');
//                 newSelection.focus.set(lastNode.getKey(), lastNodeContent.length, 'text');
//               } else if ($isElementNode(lastNode)) {
//                 newSelection.anchor.set(lastNode.getKey(), lastNode.getChildrenSize(), 'element');
//                 newSelection.focus.set(lastNode.getKey(), lastNode.getChildrenSize(), 'element');
//               }
//
//               $setSelection(newSelection);
//               return true;
//             }
//           }
//         }
//
//         nativePasteAtCursor(editor, selection, textContent);
//         return true;
//       } catch (err) {
//         nativePasteAtCursor(editor, selection, textContent);
//         return true;
//       }
//
//       return true;
//     } catch (error) {
//       adjustCursorAfterPaste(editor);
//       return false;
//     }
//   });
// }
//
// function nativePasteAtCursor(
//   editor: LexicalEditor,
//   selection: ReturnType<typeof $createRangeSelection>,
//   text?: string
// ): void {
//   if (!selection.isCollapsed()) {
//     selection.removeText();
//   }
//
//   if (text) {
//     const anchorNode = selection.anchor.getNode();
//     const offset = selection.anchor.offset;
//
//     if ($isTextNode(anchorNode)) {
//       const content = anchorNode.getTextContent();
//       const beforeText = content.slice(0, offset);
//       const afterText = content.slice(offset);
//
//       const format = anchorNode.getFormat();
//       const style = anchorNode.getStyle();
//
//       anchorNode.setTextContent(beforeText);
//
//       const newTextNode = $createTextNode(text);
//       if (format) newTextNode.setFormat(format);
//       if (style) newTextNode.setStyle(style);
//
//       anchorNode.insertAfter(newTextNode);
//
//       if (afterText) {
//         const afterTextNode = $createTextNode(afterText);
//         if (format) afterTextNode.setFormat(format);
//         if (style) afterTextNode.setStyle(style);
//         newTextNode.insertAfter(afterTextNode);
//       }
//
//       const newSelection = $createRangeSelection();
//       newSelection.anchor.set(newTextNode.getKey(), text.length, 'text');
//       newSelection.focus.set(newTextNode.getKey(), text.length, 'text');
//       $setSelection(newSelection);
//     } else {
//       selection.insertText(text);
//     }
//   } else {
//     navigator.clipboard.readText()
//       .then(clipboardText => {
//         if (clipboardText) {
//           editor.update(() => {
//             const currentSelection = $getSelection();
//             if ($isRangeSelection(currentSelection)) {
//               const anchorNode = currentSelection.anchor.getNode();
//               const offset = currentSelection.anchor.offset;
//
//               if ($isTextNode(anchorNode)) {
//                 const content = anchorNode.getTextContent();
//                 const beforeText = content.slice(0, offset);
//                 const afterText = content.slice(offset);
//
//                 const format = anchorNode.getFormat();
//                 const style = anchorNode.getStyle();
//
//                 anchorNode.setTextContent(beforeText);
//
//                 const newTextNode = $createTextNode(clipboardText);
//                 if (format) newTextNode.setFormat(format);
//                 if (style) newTextNode.setStyle(style);
//
//                 anchorNode.insertAfter(newTextNode);
//
//                 if (afterText) {
//                   const afterTextNode = $createTextNode(afterText);
//                   if (format) afterTextNode.setFormat(format);
//                   if (style) afterTextNode.setStyle(style);
//                   newTextNode.insertAfter(afterTextNode);
//                 }
//
//                 const newSelection = $createRangeSelection();
//                 newSelection.anchor.set(newTextNode.getKey(), clipboardText.length, 'text');
//                 newSelection.focus.set(newTextNode.getKey(), clipboardText.length, 'text');
//                 $setSelection(newSelection);
//               } else {
//                 currentSelection.insertText(clipboardText);
//               }
//             }
//           });
//         }
//       })
//       .catch(error => {
//       });
//   }
// }
//
// function adjustCursorAfterPaste(editor: LexicalEditor): void {
//   setTimeout(() => {
//     editor.update(() => {
//       const selection = $getSelection();
//       if ($isRangeSelection(selection)) {
//         const node = selection.anchor.getNode();
//         if ($isTextNode(node)) {
//           const textLength = node.getTextContent().length;
//           const newSelection = $createRangeSelection();
//           newSelection.anchor.set(node.getKey(), textLength, 'text');
//           newSelection.focus.set(node.getKey(), textLength, 'text');
//           $setSelection(newSelection);
//         }
//       }
//     });
//   }, 0);
// }
//
// function useFallbackClipboard(
//   editor: LexicalEditor,
//   blockNode: ElementNode
// ): void {
//   navigator.clipboard
//     .readText()
//     .then((text) => {
//       if (!text) return;
//
//       editor.update(() => {
//         try {
//           blockNode.clear();
//           const textNode = $createTextNode(text);
//           blockNode.append(textNode);
//
//           const newSelection = $createRangeSelection();
//           newSelection.anchor.set(textNode.getKey(), text.length, 'text');
//           newSelection.focus.set(textNode.getKey(), text.length, 'text');
//           $setSelection(newSelection);
//         } catch (error) {
//         }
//       });
//     })
//     .catch((error) => {
//     });
// }
//
// export function registerCutLinePlugin(editor: LexicalEditor) {
//   return editor.registerCommand<void, boolean>(
//     CUT_LINE_COMMAND,
//     () => {
//       return cutCurrentLine(editor);
//     },
//     COMMAND_PRIORITY_CRITICAL
//   );
// }
//
// export function registerCopyLinePlugin(editor: LexicalEditor) {
//   return editor.registerCommand<void, boolean>(
//     COPY_LINE_COMMAND,
//     () => {
//       let hasSelection = false;
//       editor.getEditorState().read(() => {
//         const selection = $getSelection();
//         if ($isRangeSelection(selection) && !selection.isCollapsed()) {
//           hasSelection = true;
//         }
//       });
//       if (hasSelection) {
//         return false;
//       }
//       return cutCurrentLine(editor);
//     },
//     COMMAND_PRIORITY_CRITICAL
//   );
// }
//
// export function registerPasteLinePlugin(editor: LexicalEditor) {
//   return editor.registerCommand<void, boolean>(
//     PASTE_LINE_COMMAND,
//     () => {
//       return pasteCurrentLine(editor);
//     },
//     COMMAND_PRIORITY_HIGH
//   );
// }
//
// export function registerClipboardShortcuts(editor: LexicalEditor) {
//   const removeKeyDownListener = editor.registerRootListener(
//     (rootElement: HTMLElement | null, prevRootElement: HTMLElement | null) => {
//       if (rootElement !== null) {
//         rootElement.addEventListener('keydown', onKeyDown, { capture: true });
//       }
//       if (prevRootElement !== null) {
//         prevRootElement.removeEventListener('keydown', onKeyDown, {
//           capture: true,
//         });
//       }
//     }
//   );
//
//   function onKeyDown(event: KeyboardEvent) {
//     const isCtrlOrCmd = event.ctrlKey || event.metaKey;
//
//     if (event.key === 'x' && isCtrlOrCmd) {
//       const selection = window.getSelection();
//       if (!selection || selection.toString() === '') {
//         event.preventDefault();
//         event.stopPropagation();
//
//         editor.dispatchCommand(CUT_LINE_COMMAND, void 0);
//       } else {
//         event.preventDefault();
//         event.stopPropagation();
//
//         copySelectedContent(editor);
//
//         editor.update(() => {
//           const editorSelection = $getSelection();
//           if ($isRangeSelection(editorSelection)) {
//             editorSelection.removeText();
//           }
//         });
//
//         document.execCommand('copy');
//       }
//     }
//
//     if (event.key === 'c' && isCtrlOrCmd) {
//       const selection = window.getSelection();
//       if (!selection || selection.toString() === '') {
//         event.preventDefault();
//         event.stopPropagation();
//
//         editor.dispatchCommand(COPY_LINE_COMMAND, void 0);
//       } else {
//         event.preventDefault();
//         event.stopPropagation();
//
//         copySelectedContent(editor);
//
//         document.execCommand('copy');
//       }
//     }
//
//     if (event.key === 'v' && isCtrlOrCmd) {
//       if (internalClipboardData && internalClipboardData.type === 'line') {
//         const selection = window.getSelection();
//         if (!selection || selection.toString() === '') {
//           event.preventDefault();
//           event.stopPropagation();
//
//           editor.dispatchCommand(PASTE_LINE_COMMAND, void 0);
//         }
//       } else {
//         adjustCursorAfterPaste(editor);
//       }
//     }
//   }
//
//   return () => {
//     removeKeyDownListener();
//   };
// }
//
// function copySelectedContent(editor: LexicalEditor): void {
//   editor.update(() => {
//     const selection = $getSelection();
//     if (!$isRangeSelection(selection)) {
//       return;
//     }
//
//     const nodes: LexicalNode[] = selection.getNodes();
//     if (nodes.length === 0) {
//       return;
//     }
//
//     const textContent = selection.getTextContent();
//
//     const nodeData = nodes
//       .map((node: LexicalNode) => {
//         if ($isTextNode(node)) {
//           return preserveTextNodeFormat(node);
//         } else if ($isLinkNode(node)) {
//           const linkJSON = node.exportJSON();
//           if (linkJSON.children) {
//             linkJSON.children = linkJSON.children.map((child: SerializedLexicalNode) => {
//               if (child.type === 'text') {
//                 const textNode = node.getChildren().find(n =>
//                   $isTextNode(n) && n.getTextContent() === (child as SerializedTextNode).text
//                 );
//                 if (textNode && $isTextNode(textNode)) {
//                   return preserveTextNodeFormat(textNode);
//                 }
//               }
//               return child;
//             });
//           }
//           return linkJSON;
//         } else {
//           return node.exportJSON ? node.exportJSON() : null;
//         }
//       })
//       .filter(Boolean) as SerializedLexicalNode[];
//
//     const nodeType = 'line';
//
//     internalClipboardData = {
//       type: 'line',
//       nodes: nodeData,
//       nodeType: nodeType,
//       textContent: textContent,
//       timestamp: Date.now(),
//     };
//   });
// }
//
// export const CutLinePlugin: React.FC = () => {
//   const [editor] = useLexicalComposerContext();
//
//   useEffect(() => {
//     const unregisterCut = registerCutLinePlugin(editor);
//
//     const unregisterCopy = registerCopyLinePlugin(editor);
//
//     const unregisterPaste = registerPasteLinePlugin(editor);
//
//     const cleanup = registerClipboardShortcuts(editor);
//
//     return () => {
//       unregisterCut();
//       unregisterCopy();
//       unregisterPaste();
//       cleanup();
//     };
//   }, [editor]);
//
//   return null;
// };
// 나중에 살리기
