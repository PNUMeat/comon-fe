import { useCallback, useRef } from 'react';

const readableBytes = (bytes: number) => {
  const i = Math.floor(Math.log(bytes) / Math.log(1000)),
    sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + sizes[i];
};

type ImageCompressorOption = {
  quality: number;
  maxSizeMb?: number;
};

export const useImageCompressor = ({
  quality,
  maxSizeMb,
}: ImageCompressorOption) => {
  const workerRef = useRef<Worker | null>(null);

  const compressImage = useCallback(
    (requestId: string, file: File): Promise<File> => {
      return new Promise((resolve, reject) => {
        if (!workerRef.current) {
          workerRef.current = new Worker(
            new URL('@/workers/imageCompressor.ts', import.meta.url),
            { type: 'module' }
          );
        }

        const worker = workerRef.current;

        worker.onmessage = (e) => {
          const {
            requestId: responseId,
            compressedImage,
            maxSizeMb,
            path,
            error,
          } = e.data;

          if (error) {
            console.error('이미지 압축 실패:', error);
            reject(error);
            return;
          }

          console.log(
            'after:',
            compressedImage.size,
            readableBytes(compressedImage.size),
            'maxSize: ',
            maxSizeMb,
            responseId,
            compressedImage.type,
            'path: ',
            path
          );
          resolve(compressedImage);
        };

        worker.onerror = (err) => {
          console.error('Worker 오류:', err);
          reject(err);
        };

        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
          console.log(
            'before:',
            readableBytes(file.size),
            'maxSize: ',
            maxSizeMb,
            file.type
          );
          worker.postMessage({
            requestId: requestId,
            src: e?.target?.result,
            fileType: file.type,
            quality: quality,
            maxSizeMb: maxSizeMb,
          });
        };
        reader.readAsDataURL(file);
      });
    },
    []
  );

  return {
    compressImage,
  };
};
