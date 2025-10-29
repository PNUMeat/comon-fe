import { ImageInputBox } from '@/components/features/Post/segments/ImageInputBox';
import { InsertImagePayload } from '@/components/features/Post/utils';

import { Fragment, ReactNode, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

export const InsertImageButton: React.FC<{
  insertImage: (payload: InsertImagePayload) => void;
  buttonLabel: ReactNode;
}> = ({ insertImage, buttonLabel }) => {
  const [showImageInsertBox, setShowImageInsertBox] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const imageInputRef = useRef<HTMLDivElement | null>(null);
  const closeImageInputBox = () => setShowImageInsertBox(false);

  useEffect(() => {
    const button = buttonRef.current;
    const imageInput = imageInputRef.current;

    if (showImageInsertBox && button && imageInput) {
      const { top, left } = button.getBoundingClientRect();
      imageInput.style.top = `${top + button.offsetHeight + 4}px`;
      imageInput.style.left = `${Math.min(left, window.innerWidth - 20)}px`;
    }
  }, [imageInputRef, buttonRef, showImageInsertBox]);

  useEffect(() => {
    const button = buttonRef.current;
    if (!button || !showImageInsertBox) {
      return;
    }

    const onClick = (e: DocumentEventMap['click']) => {
      const target = e.target;
      if (!button.contains(target as Node)) {
        setShowImageInsertBox(false);
      }
    };

    document.addEventListener('click', onClick);

    return () => {
      document.removeEventListener('click', onClick);
    };
  }, [buttonRef, showImageInsertBox]);

  return (
    <Fragment>
      <button ref={buttonRef} onClick={() => setShowImageInsertBox(true)}>
        {buttonLabel}
      </button>
      {showImageInsertBox &&
        createPortal(
          <ImageInputBox
            imageInputRef={imageInputRef}
            insertImage={insertImage}
            closeImageInput={closeImageInputBox}
          />,
          document.body
        )}
    </Fragment>
  );
};
