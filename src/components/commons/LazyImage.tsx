import { MutableRefObject } from 'react';

export interface ILazyImage {
  altText: string;
  w: 'inherit' | number;
  maxW: number;
  h: 'inherit' | number;
  src: string;
  className?: string;
  imageRef?: MutableRefObject<HTMLImageElement | null>;
  nodeKey?: string;
  style?: React.CSSProperties;
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
  style,
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
        ...style,
      }}
      loading={'lazy'}
      className={className}
    />
  );
};
