import { ILazyImage, LazyImage } from '@/components/commons/LazyImage';
import { $isImageNode } from '@/components/features/Post/nodes/ImageNode';

import React, { Suspense, useCallback, useEffect, useRef } from 'react';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import useLexicalEditable from '@lexical/react/useLexicalEditable';
import { useLexicalNodeSelection } from '@lexical/react/useLexicalNodeSelection';
import { mergeRegister } from '@lexical/utils';
import {
  $getSelection,
  CLICK_COMMAND,
  COMMAND_PRIORITY_LOW,
  KEY_BACKSPACE_COMMAND,
  KEY_DELETE_COMMAND,
} from 'lexical';

const LazyEditorImage: React.FC<ILazyImage> = ({
  altText,
  w,
  maxW,
  h,
  src,
  nodeKey,
}) => {
  const [editor] = useLexicalComposerContext();
  const isEditable = useLexicalEditable();
  const [isSelected, setSelected, clearSelection] = useLexicalNodeSelection(
    nodeKey as string
  );

  const imageRef = useRef<HTMLImageElement | null>(null);
  const isFocused = isSelected && isEditable;

  // TODO: selection이 커서 및 클릭 기반으로 변경되기 때문에 삭제 버튼을 만들기가 까다로움
  const deleteImage = useCallback(
    (payload: KeyboardEvent) => {
      const deleteSelection = $getSelection();
      payload.preventDefault();
      editor.update(() => {
        if (deleteSelection) {
          deleteSelection.getNodes().forEach((node) => {
            if ($isImageNode(node)) {
              // removeImagePreviewUrl(node.getSrc());
              node.remove();
            }
          });
        }
      });

      return false;
    },
    [editor, isSelected]
  );

  const onClick = useCallback(
    (event: MouseEvent) => {
      if (event.target === imageRef.current) {
        clearSelection();
        setSelected(true);

        return true;
      }

      return false;
    },
    [isSelected, setSelected, clearSelection]
  );

  useEffect(() => {
    const unregister = mergeRegister(
      editor.registerCommand<MouseEvent>(
        CLICK_COMMAND,
        onClick,
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        KEY_DELETE_COMMAND,
        deleteImage,
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        KEY_BACKSPACE_COMMAND,
        deleteImage,
        COMMAND_PRIORITY_LOW
      )
    );

    return () => {
      unregister();
    };
  }, [editor]);

  return (
    <Suspense fallback={null}>
      <div style={{ position: 'relative' }}>
        {isFocused && (
          <div
            style={{
              color: 'white',
              backgroundColor: 'black',
              position: 'absolute',
            }}
          >
            backspace 또는 del 키를 통해 삭제
          </div>
        )}
        <LazyImage
          altText={altText}
          w={w}
          maxW={maxW}
          h={h}
          src={src}
          className={isFocused ? 'focused' : undefined}
          imageRef={imageRef}
          nodeKey={nodeKey}
        />
      </div>
    </Suspense>
  );
};

export default LazyEditorImage;
