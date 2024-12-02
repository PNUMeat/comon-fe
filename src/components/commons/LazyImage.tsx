import { MutableRefObject } from 'react';

export interface ILazyImage {
  altText: string;
  w: 'inherit' | number;
  maxW: number;
  h: 'inherit' | number;
  src: string;
  className?: string;
  imageRef?: MutableRefObject<HTMLImageElement | null>;
}

const imageCache = new Set();

export const LazyImage: React.FC<ILazyImage> = ({
  altText,
  w,
  maxW,
  h,
  src,
  className,
  imageRef,
}) => {
  if (!imageCache.has(src)) {
    throw new Promise((resolve) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        imageCache.add(src);
        resolve(null);
      };
      img.onerror = () => {
        // 잘못된 src 재시도 방지
        imageCache.add(src);
      };
    });
  }

  return (
    <img
      src={src}
      alt={altText}
      ref={imageRef}
      style={{
        width: w,
        maxWidth: maxW,
        height: h,
        objectFit: 'cover',
      }}
      loading={'lazy'}
      className={className}
    />
  );
};
