import { useCallback, useRef } from 'react';

const readableBytes = (bytes: number) => {
  const i = Math.floor(Math.log(bytes) / Math.log(1024)),
    sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + sizes[i];
};

export const useImageCompressor = (quality: number) => {
  const workerRef = useRef<Worker | null>(null);

  const compressImage = useCallback((file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      if (!workerRef.current) {
        workerRef.current = new Worker(
          new URL('@/workers/imageCompressor.ts', import.meta.url),
          { type: 'module' }
        );
      }

      const worker = workerRef.current;

      worker.onmessage = (e) => {
        const { compressedImage, error } = e.data;
        if (error) {
          console.error('이미지 압축 실패:', error);
          reject(error);
          return;
        }

        console.log('after:', readableBytes(compressedImage.size));
        resolve(compressedImage);
      };

      worker.onerror = (err) => {
        console.error('Worker 오류:', err);
        reject(err);
      };

      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        console.log('before:', readableBytes(file.size));
        worker.postMessage({
          src: e?.target?.result,
          fileType: file.type,
          fileName: file.name,
          quality: quality,
        });
      };
      reader.readAsDataURL(file);
    });
  }, []);

  return {
    compressImage,
  };
};
