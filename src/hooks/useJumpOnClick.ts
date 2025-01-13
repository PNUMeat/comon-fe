import { useEffect, useRef } from 'react';

/**
 * 스크롤 보내고 싶은 곳에 boundRef
 * 스크롤 트리거 걸고 싶은 곳에 buttonRef, onClickJump
 */
export const useJumpOnClick = () => {
  const boundRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (boundRef?.current && buttonRef?.current) {
      const onScroll = () => {
        if (boundRef?.current && buttonRef?.current) {
          const boundSc = boundRef.current;
          const buttonSc = buttonRef.current;
          const { top } = boundSc.getBoundingClientRect();
          if (top <= 0) {
            buttonSc.disabled = false;
            buttonSc.style.opacity = '1';
          } else {
            buttonSc.disabled = true;
            buttonSc.style.opacity = '0';
          }
        }
      };

      document.addEventListener('scroll', onScroll);
      document.addEventListener('resize', onScroll);

      return () => {
        document.removeEventListener('scroll', onScroll);
        document.removeEventListener('resize', onScroll);
      };
    }
  }, [boundRef, buttonRef]);

  const onClickJump = () => {
    if (boundRef.current) {
      boundRef.current?.scrollIntoView({
        behavior: 'smooth',
      });
    }
  };

  return {
    boundRef,
    buttonRef,
    onClickJump,
  };
};
