import { DragEventHandler, MutableRefObject, useState } from 'react';

import { postImagesAtom } from '@/store/posting';
import styled from '@emotion/styled';
import { useSetAtom } from 'jotai';

const gray300 = '#CBD5E0';
const gray500 = '#A0AEC0';

const ImageInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  padding: 16px;
  position: fixed;
  background-color: #fff;
  border: 2px solid #c2c5fb;
  border-radius: 8px;
  z-index: 999999;
  transform: translate(-360px, 9px);
`;

const LabelBox = styled.label`
  border: 2px dashed ${gray300};
  border-radius: 6px;
  padding: 16px;
  text-align: center;
  cursor: pointer;
  white-space: nowrap;
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const TextInput = styled.input<{ disabled?: boolean }>`
  width: 100%;
  padding: 8px;
  border: 1px solid ${gray300};
  border-radius: 4px;
  box-sizing: border-box;
  opacity: ${(props) => (props.disabled ? 0.6 : 1)};
`;

const InsertButton = styled.button`
  background-color: #3182ce;
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #2b6cb0;
  }
`;

const InfoText = styled.p<{ color?: string }>`
  margin: 0;
  padding: 0;
  color: ${(props) => props.color || '#555'};
`;

interface ImageInputBoxProps {
  imageInputRef: MutableRefObject<HTMLDivElement | null>;
  insertImage: (payload: { altText: string; src: string }) => void;
  closeImageInput: () => void;
}

const createImagePreviewUrl = (file: File) => URL.createObjectURL(file);

export const ImageInputBox: React.FC<ImageInputBoxProps> = ({
  imageInputRef,
  insertImage,
  closeImageInput,
}) => {
  const [fileInput, setFileInput] = useState<File | null>(null);
  const [urlInput, setUrlInput] = useState('');
  const [altText, setAltText] = useState('');
  const setPostImages = useSetAtom(postImagesAtom);

  const switchToFileImage = (file: File | null) => {
    setFileInput(file);
    setUrlInput('');
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    switchToFileImage(file);
  };

  const onConfirm = () => {
    if (!fileInput) {
      console.error({
        title: '이미지 파일을 넣거나 이미지 url을 기입해주세요.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    insertImage({
      src: fileInput ? createImagePreviewUrl(fileInput) : urlInput,
      altText: altText || '이미지',
    });
    // TODO : 이렇게?
    setPostImages([fileInput]);
    closeImageInput();
  };

  const onDrop: DragEventHandler<HTMLLabelElement> = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;
    switchToFileImage(file);
  };

  const onDragEnd: DragEventHandler<HTMLLabelElement> = (e) => {
    e.preventDefault();
  };

  return (
    <ImageInputContainer
      ref={imageInputRef}
      onClick={(e) => e.stopPropagation()}
    >
      <LabelBox htmlFor="file-input" onDrop={onDrop} onDragOver={onDragEnd}>
        <InfoText color={urlInput ? gray300 : gray500}>
          {fileInput
            ? fileInput.name
            : '첨부할 이미지를 끌어오거나 클릭해 선택해주세요.'}
        </InfoText>
        <HiddenFileInput
          id="file-input"
          type="file"
          accept="image/*"
          onChange={onFileChange}
          disabled={Boolean(urlInput)}
        />
      </LabelBox>
      <TextInput
        type="text"
        placeholder="이미지 설명"
        value={altText}
        onChange={(e) => setAltText(e.target.value)}
      />

      <InsertButton onClick={onConfirm}>추가하기</InsertButton>
    </ImageInputContainer>
  );
};
