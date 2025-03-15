// // 필요한 노드 타입 import
// 추가적인 노드 타입
import { useEffect } from 'react';

import { $createLinkNode } from '@lexical/link';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $createRangeSelection,
  $getSelection,
  $isElementNode,
  $isLineBreakNode,
  $isNodeSelection,
  $isParagraphNode,
  $isRangeSelection,
  $setSelection,
  COMMAND_PRIORITY_CRITICAL,
  COMMAND_PRIORITY_HIGH,
  createCommand,
} from 'lexical';
// 필요한 노드 타입 import
import { $createParagraphNode, $createTextNode } from 'lexical';

//
// export const CUT_LINE_COMMAND = createCommand('cut-line');
//
// /**
//  * 현재 커서가 위치한 줄을 찾는 함수
//  */
// function $findCurrentLine(selection) {
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
//   // 현재 노드가 블록 레벨 노드가 아니면 부모 블록 노드 찾기
//   let blockNode = currentNode;
//   while (
//     blockNode &&
//     !$isParagraphNode(blockNode) &&
//     !$isElementNode(blockNode)
//   ) {
//     blockNode = blockNode.getParent();
//   }
//
//   if (!blockNode) {
//     return null;
//   }
//
//   return {
//     blockNode,
//     nodes: blockNode.getChildren(),
//     offset,
//   };
// }
//
// /**
//  * 노드를 직렬화하여 텍스트로 변환하는 함수
//  */
// function serializeNodeForClipboard(node) {
//   if ($isLineBreakNode(node)) {
//     return '\n';
//   }
//
//   if (node.exportJSON) {
//     try {
//       // 노드의 JSON 표현을 클립보드에 포함
//       const jsonStr = JSON.stringify(node.exportJSON());
//       return jsonStr;
//     } catch (e) {
//       console.error('노드 직렬화 실패:', e);
//     }
//   }
//
//   console.log('??!!', node.getTextContent());
//
//   // 기본적으로 텍스트 내용 반환
//   return node.getTextContent ? node.getTextContent() : '';
// }
//
// /**
//  * 현재 커서가 위치한 줄을 잘라내는 함수
//  */
// function cutCurrentLine(editor) {
//   return editor.update(() => {
//     const selection = $getSelection();
//     const lineInfo = $findCurrentLine(selection);
//
//     if (!lineInfo) {
//       return false;
//     }
//
//     const { blockNode, nodes } = lineInfo;
//
//     // 1. 노드들을 직렬화하여 클립보드에 복사할 데이터 준비
//     // 내부 클립보드를 위한 JSON 데이터
//     const nodeData = nodes
//       .map((node) => {
//         return node.exportJSON ? node.exportJSON() : null;
//       })
//       .filter(Boolean);
//
//     // 외부 클립보드를 위한 텍스트 데이터
//     const textData = nodes.map(serializeNodeForClipboard).join('');
//
//     // 2. 클립보드에 데이터 복사
//     try {
//       // 내부와 외부 클립보드 모두에 복사
//       const clipboardData = new DataTransfer();
//       clipboardData.setData('text/plain', textData);
//       clipboardData.setData(
//         'application/x-lexical-nodes',
//         JSON.stringify(nodeData)
//       );
//
//       console.log('??', textData, clipboardData);
//
//       // 최신 브라우저용 클립보드 API 사용
//       navigator.clipboard.writeText(textData).catch((e) => {
//         console.warn('클립보드 API 실패:', e);
//       });
//     } catch (error) {
//       console.error('클립보드 복사 실패:', error);
//     }
//
//     // 3. 현재 줄 삭제
//     // 방법 1: 블록 노드 전체를 삭제하고 새 빈 블록으로 대체
//     const parentNode = blockNode.getParent();
//     const blockNodeKey = blockNode.getKey();
//     const blockNodeIndex = parentNode.getChildren().indexOf(blockNode);
//
//     blockNode.remove();
//
//     // 4. 새 빈 블록 노드 생성 및 삽입
//     const newParagraph = $createParagraphNode();
//
//     if (blockNodeIndex === 0) {
//       // 첫 번째 블록이었다면 부모의 첫 자식으로 추가
//       parentNode.append(newParagraph);
//     } else {
//       // 원래 위치에 삽입
//       const previousSibling = parentNode.getChildAtIndex(blockNodeIndex - 1);
//       if (previousSibling) {
//         previousSibling.insertAfter(newParagraph);
//       } else {
//         parentNode.append(newParagraph);
//       }
//     }
//
//     // 5. 커서 위치 재설정
//     const newSelection = $createRangeSelection();
//     newSelection.anchor.set(newParagraph.getKey(), 0, 'element');
//     newSelection.focus.set(newParagraph.getKey(), 0, 'element');
//     $setSelection(newSelection);
//
//     return true;
//   });
// }
//
// /**
//  * 에디터에 Ctrl+X 핸들러 등록
//  */
// export function registerCutLinePlugin(editor) {
//   return editor.registerCommand(
//     CUT_LINE_COMMAND,
//     () => {
//       return cutCurrentLine(editor);
//     },
//     COMMAND_PRIORITY_CRITICAL
//   );
// }
//
// /**
//  * 단축키 리스너 등록
//  */
// export const registerCutLineShortcut = (editor) => {
//   // 에디터에 키보드 이벤트 리스너 등록
//   const removeKeyDownListener = editor.registerRootListener(
//     (rootElement, prevRootElement) => {
//       if (rootElement !== null) {
//         rootElement.addEventListener('keydown', onKeyDown);
//       }
//       if (prevRootElement !== null) {
//         prevRootElement.removeEventListener('keydown', onKeyDown);
//       }
//     }
//   );
//
//   // 키보드 이벤트 핸들러
//   function onKeyDown(event) {
//     // Ctrl+X 감지
//     if (event.key === 'x' && (event.ctrlKey || event.metaKey)) {
//       // 텍스트가 선택되어 있지 않은 경우에만 줄 잘라내기 실행
//       const selection = window.getSelection();
//       if (!selection || selection.toString() === '') {
//         event.preventDefault();
//         editor.dispatchCommand(CUT_LINE_COMMAND, null);
//       }
//       // 텍스트가 선택된 경우는 기본 동작(선택 영역 잘라내기) 수행
//     }
//   }
//
//   // 정리 함수 리턴
//   return () => {
//     removeKeyDownListener();
//   };
// };
//
// export const CutLinePlugin = () => {
//   const [editor] = useLexicalComposerContext();
//
//   registerCutLinePlugin(editor);
//   registerCutLineShortcut(editor);
//
//   return null;
// };

// 커스텀 커맨드 생성
export const CUT_LINE_COMMAND = createCommand('cut-line');
export const PASTE_LINE_COMMAND = createCommand('paste-line');

/**
 * 현재 커서가 위치한 줄을 찾는 함수
 */
function $findCurrentLine(selection) {
  if (!$isRangeSelection(selection) && !$isNodeSelection(selection)) {
    return null;
  }

  let currentNode;
  let offset = 0;

  if ($isRangeSelection(selection)) {
    currentNode = selection.anchor.getNode();
    offset = selection.anchor.offset;
  } else if ($isNodeSelection(selection)) {
    currentNode = selection.getNodes()[0];
  }

  if (!currentNode) {
    return null;
  }

  // 현재 노드가 블록 레벨 노드가 아니면 부모 블록 노드 찾기
  let blockNode = currentNode;
  while (
    blockNode &&
    !$isParagraphNode(blockNode) &&
    !$isElementNode(blockNode)
  ) {
    blockNode = blockNode.getParent();
  }

  if (!blockNode) {
    return null;
  }

  return {
    blockNode,
    nodes: blockNode.getChildren(),
    offset,
  };
}

/**
 * 노드를 직렬화하여 텍스트로 변환하는 함수
 */
function serializeNodeForClipboard(node) {
  if ($isLineBreakNode(node)) {
    return '\n';
  }

  if (node.exportJSON) {
    try {
      // 노드의 JSON 표현을 클립보드에 포함
      const jsonStr = JSON.stringify(node.exportJSON());
      return jsonStr;
    } catch (e) {
      console.error('노드 직렬화 실패:', e);
    }
  }

  // 기본적으로 텍스트 내용 반환
  return node.getTextContent ? node.getTextContent() : '';
}

// 클립보드 데이터 저장용 캐시
let internalClipboardData = null;

/**
 * 현재 커서가 위치한 줄을 잘라내는 함수
 */
function cutCurrentLine(editor) {
  return editor.update(() => {
    const selection = $getSelection();
    const lineInfo = $findCurrentLine(selection);

    if (!lineInfo) {
      return false;
    }

    const { blockNode, nodes } = lineInfo;

    // 1. 노드들을 직렬화하여 클립보드에 복사할 데이터 준비
    // 내부 클립보드를 위한 JSON 데이터
    const nodeData = nodes
      .map((node) => {
        return node.exportJSON ? node.exportJSON() : null;
      })
      .filter(Boolean);

    // 내부 클립보드에 저장
    internalClipboardData = {
      type: 'line',
      nodes: nodeData,
      timestamp: Date.now(),
    };

    // 외부 클립보드를 위한 텍스트 데이터
    const textData = nodes.map(serializeNodeForClipboard).join('');

    // 2. 클립보드에 데이터 복사
    try {
      // 최신 브라우저용 클립보드 API 사용
      navigator.clipboard.writeText(textData).catch((e) => {
        console.warn('클립보드 API 실패:', e);
        // 폴백: 임시 텍스트 영역 사용
        const textarea = document.createElement('textarea');
        textarea.value = textData;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      });
    } catch (error) {
      console.error('클립보드 복사 실패:', error);
    }

    // 3. 현재 줄 삭제
    const parentNode = blockNode.getParent();
    const blockNodeKey = blockNode.getKey();
    const blockNodeIndex = parentNode.getChildren().indexOf(blockNode);

    blockNode.remove();

    // 4. 새 빈 블록 노드 생성 및 삽입
    const newParagraph = $createParagraphNode();

    if (blockNodeIndex === 0) {
      // 첫 번째 블록이었다면 부모의 첫 자식으로 추가
      parentNode.append(newParagraph);
    } else {
      // 원래 위치에 삽입
      const previousSibling = parentNode.getChildAtIndex(blockNodeIndex - 1);
      if (previousSibling) {
        previousSibling.insertAfter(newParagraph);
      } else {
        parentNode.append(newParagraph);
      }
    }

    // 5. 커서 위치 재설정
    const newSelection = $createRangeSelection();
    newSelection.anchor.set(newParagraph.getKey(), 0, 'element');
    newSelection.focus.set(newParagraph.getKey(), 0, 'element');
    $setSelection(newSelection);

    return true;
  });
}

/**
 * 노드 JSON으로부터 노드를 생성하는 함수
 */
function createNodesFromJSON(editor, nodesJSON) {
  // 여기서는 노드 타입을 기반으로 적절한 노드 생성 로직을 구현해야 합니다
  // 이 부분은 lexical의 내부 구현에 의존적이므로 단순 예시로 제공합니다

  const deserializeNodes = (nodeData) => {
    const { type, ...rest } = nodeData;

    // 노드 타입에 따라 적절한 노드 생성 함수 호출
    switch (type) {
      case 'text':
        return $createTextNode(rest.text);
      case 'paragraph':
        const para = $createParagraphNode();
        if (rest.children) {
          rest.children.forEach((child) => {
            const childNode = deserializeNodes(child);
            if (childNode) {
              para.append(childNode);
            }
          });
        }
        return para;
      case 'link':
        const link = $createLinkNode(rest.url);
        if (rest.children) {
          rest.children.forEach((child) => {
            const childNode = deserializeNodes(child);
            if (childNode) {
              link.append(childNode);
            }
          });
        }
        return link;
      // 다른 노드 타입에 대한 처리 추가
      default:
        console.warn('지원하지 않는 노드 타입:', type);
        return null;
    }
  };

  return nodesJSON.map(deserializeNodes).filter(Boolean);
}

/**
 * 현재 커서 위치에 클립보드의 내용을 붙여넣는 함수
 */
function pasteCurrentLine(editor) {
  return editor.update(() => {
    const selection = $getSelection();
    if (!$isRangeSelection(selection)) {
      return false;
    }

    // 내부 클립보드에서 데이터 가져오기
    if (!internalClipboardData || internalClipboardData.type !== 'line') {
      // 내부 클립보드에 데이터가 없으면 기본 붙여넣기로 폴백
      return false;
    }

    const { nodes: nodesJSON } = internalClipboardData;

    // 외부 클립보드에서 텍스트 가져오기
    navigator.clipboard
      .readText()
      .then((text) => {
        if (!text) return;

        editor.update(() => {
          const selection = $getSelection();
          if (!$isRangeSelection(selection)) return;

          try {
            // 1. 현재 줄 확인
            const lineInfo = $findCurrentLine(selection);
            if (!lineInfo) return;

            const { blockNode } = lineInfo;

            // 2. 노드 생성
            // 이 부분은 노드 타입에 따라 복잡할 수 있습니다.
            // 아래는 간단한 텍스트 노드 처리만 예시로 제공합니다.

            try {
              // 내부 클립보드 데이터(노드 JSON)가 있는 경우
              if (nodesJSON && nodesJSON.length > 0) {
                // 노드 JSON으로부터 노드 생성
                const nodes = createNodesFromJSON(editor, nodesJSON);
                if (nodes && nodes.length > 0) {
                  // 기존 블록 노드를 새 노드로 대체
                  blockNode.getChildren().forEach((child) => child.remove());
                  nodes.forEach((node) => blockNode.append(node));
                }
              } else {
                // 일반 텍스트로 처리
                blockNode.clear();
                blockNode.append($createTextNode(text));
              }
            } catch (err) {
              console.error('노드 생성 실패:', err);
              // 폴백: 텍스트만 삽입
              blockNode.clear();
              blockNode.append($createTextNode(text));
            }

            // 3. 커서 위치 재설정
            const newSelection = $createRangeSelection();
            newSelection.anchor.set(
              blockNode.getKey(),
              blockNode.getChildrenSize(),
              'element'
            );
            newSelection.focus.set(
              blockNode.getKey(),
              blockNode.getChildrenSize(),
              'element'
            );
            $setSelection(newSelection);
          } catch (error) {
            console.error('붙여넣기 실패:', error);
          }
        });
      })
      .catch((error) => {
        console.error('클립보드 읽기 실패:', error);
      });

    return true;
  });
}

/**
 * 에디터에 Ctrl+X 핸들러 등록
 */
export function registerCutLinePlugin(editor) {
  return editor.registerCommand(
    CUT_LINE_COMMAND,
    () => {
      return cutCurrentLine(editor);
    },
    COMMAND_PRIORITY_CRITICAL
  );
}

/**
 * 에디터에 Ctrl+V 핸들러 등록
 */
export function registerPasteLinePlugin(editor) {
  return editor.registerCommand(
    PASTE_LINE_COMMAND,
    () => {
      return pasteCurrentLine(editor);
    },
    COMMAND_PRIORITY_HIGH
  );
}

/**
 * 단축키 리스너 등록
 */
export function registerClipboardShortcuts(editor) {
  // 에디터에 키보드 이벤트 리스너 등록
  const removeKeyDownListener = editor.registerRootListener(
    (rootElement, prevRootElement) => {
      if (rootElement !== null) {
        rootElement.addEventListener('keydown', onKeyDown);
      }
      if (prevRootElement !== null) {
        prevRootElement.removeEventListener('keydown', onKeyDown);
      }
    }
  );

  // 키보드 이벤트 핸들러
  function onKeyDown(event) {
    const isCtrlOrCmd = event.ctrlKey || event.metaKey;

    // Ctrl+X 감지
    if (event.key === 'x' && isCtrlOrCmd) {
      // 텍스트가 선택되어 있지 않은 경우에만 줄 잘라내기 실행
      const selection = window.getSelection();
      if (!selection || selection.toString() === '') {
        event.preventDefault();
        editor.dispatchCommand(CUT_LINE_COMMAND);
      }
      // 텍스트가 선택된 경우는 기본 동작(선택 영역 잘라내기) 수행
    }

    // Ctrl+V 감지
    if (event.key === 'v' && isCtrlOrCmd) {
      // 텍스트가 선택되어 있지 않고 내부 클립보드 데이터가 있는 경우
      if (internalClipboardData && internalClipboardData.type === 'line') {
        const selection = window.getSelection();
        if (!selection || selection.toString() === '') {
          event.preventDefault();
          editor.dispatchCommand(PASTE_LINE_COMMAND);
        }
      }
      // 텍스트가 선택되거나 내부 클립보드 데이터가 없는 경우는 기본 동작(붙여넣기) 수행
    }
  }

  // 정리 함수 리턴
  return () => {
    removeKeyDownListener();
  };
}

/**
 * 사용 예시
 */
export function CutLinePlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    // 잘라내기 기능 등록
    registerCutLinePlugin(editor);

    // 붙여넣기 기능 등록
    registerPasteLinePlugin(editor);

    // 단축키 등록
    const cleanup = registerClipboardShortcuts(editor);

    return () => {
      cleanup();
    };
  }, [editor]);

  return null;
}
