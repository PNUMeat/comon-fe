import { Flex } from '@/components/commons/Flex';
import { SText } from '@/components/commons/SText';
import { SimpleLoader } from '@/components/commons/SimpleLoader';
import { HeightInNumber } from '@/components/types';

import { useCallback, useEffect, useRef, useState } from 'react';

import { MAX_IMAGE_SIZE, imageAtom, isImageFitAtom } from '@/store/form';
import styled from '@emotion/styled';
import { useAtom, useAtomValue } from 'jotai';

const ImageContainer = styled.div<HeightInNumber>`
  height: ${(props) => props.h}px;
  width: 200px;
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 10px;
  border: 1px solid #c2c5fb;
  border-radius: 20px;
  background: #fff;
  box-sizing: border-box;
  justify-content: center;
`;

const PreviewImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  border-radius: 10px;
  object-fit: cover;
`;

const PlaceholderText = styled.span`
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 19px;
  letter-spacing: -0.28px;
  color: #cccccc;
  display: grid;
  place-items: center;
`;

const SideContainer = styled.div<HeightInNumber>`
  height: ${(props) => props.h}px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`;

const InfoText = styled.p`
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 19px;
  letter-spacing: -0.28px;
  color: #cccccc;
  white-space: pre-line;
`;

const AttachImageButton = styled.label`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 111px;
  height: 30px;
  padding: 5px 14px;
  border-radius: 5px;
  background: #8488ec;
  color: white;
  font-size: 16px;
  font-weight: 400;
  line-height: normal;
  cursor: pointer;
  margin-top: 4px;

  input {
    display: none;
  }
`;

const ImageRestrictionNotice = () => {
  const isEnrollImageFit = useAtomValue(isImageFitAtom);

  return (
    <InfoText>
      JPG, PNG
      <br />
      {isEnrollImageFit === null || isEnrollImageFit ? (
        `${MAX_IMAGE_SIZE}MB 용량 제한\n500x500 px 사이즈 권장`
      ) : (
        <SText color="red">10MB 용량을 초과했습니다</SText>
      )}
    </InfoText>
  );
};

/**
 * 상태가 매핑됨 (imageAtom)
 */
export const ComonImageInput: React.FC<{
  imageUrl?: string;
  isDisabled?: boolean;
}> = ({ imageUrl, isDisabled }) => {
  const [image, setImage] = useAtom(imageAtom);
  const [imageStr, setImageStr] = useState<string | null>(imageUrl ?? null);
  const workerRef = useRef<Worker | null>(null);

  console.error('???', imageStr, imageUrl, isDisabled);

  const loadCompressedImage = useCallback(
    (file: File) => {
      if (!workerRef.current) {
        workerRef.current = new Worker(
          new URL('@/workers/imageCompressor.ts', import.meta.url),
          { type: 'module' }
        );

        workerRef.current.onmessage = (e) => {
          const { compressedImage, error = undefined } = e.data;
          if (compressedImage && !error) {
            console.log('after: ', readableBytes(compressedImage.size));

            setImage(compressedImage);
            return;
          }
          console.error('이미지 압축에 실패했습니다.', error);
          // 그래도 일단 돌아는 가야 하지 않을까
          setImage(file);
        };
      }

      const reader = new FileReader();

      reader.onload = (e: ProgressEvent<FileReader>) => {
        const worker = workerRef.current;
        console.log('before: ', readableBytes(file.size));
        worker?.postMessage({
          src: e?.target?.result,
          fileType: file.type,
          fileName: '설정할 파일 이름',
          quality: 0.8,
        });
      };
      reader.readAsDataURL(file);
    },
    [setImage]
  );

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      loadCompressedImage(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!isDisabled && e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      loadCompressedImage(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) =>
    e.preventDefault();

  useEffect(() => {
    if (image) {
      const reader = new FileReader();
      reader.onload = () => setImageStr(reader.result as string);
      reader.readAsDataURL(image);
    }
  }, [image]);

  return (
    <Flex gap={'17px'}>
      <ImageContainer h={200} onDragOver={handleDragOver} onDrop={handleDrop}>
        {imageStr && <PreviewImage src={imageStr} alt="Uploaded preview" />}
        {!imageStr && image && <SimpleLoader />}
        {!imageStr && !image && (
          <PlaceholderText>이미지를 드래그하세요</PlaceholderText>
        )}
      </ImageContainer>
      <SideContainer h={200}>
        <ImageRestrictionNotice />
        <AttachImageButton>
          이미지 업로드
          <input
            type="file"
            accept="image/png, image/jpeg"
            onChange={handleImageChange}
          />
        </AttachImageButton>
      </SideContainer>
    </Flex>
  );
};

const readableBytes = (bytes: number) => {
  const i = Math.floor(Math.log(bytes) / Math.log(1024)),
    sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + sizes[i];
};
