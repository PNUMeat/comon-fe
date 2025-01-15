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
          const { top, right } = boundSc.getBoundingClientRect();
          if (top <= 0) {
            buttonSc.disabled = false;
            const x = Math.min(window.innerWidth - 100, right + 30);
            const y = window.innerHeight * 0.8;
            buttonSc.style.transform = `translate(${x}px, calc(${y}px))`;
            buttonSc.style.opacity = '1';
          } else {
            buttonSc.disabled = true;
            buttonSc.style.opacity = '0';
          }
        }
      };

      const onResize = () => {
        if (boundRef?.current && buttonRef?.current) {
          const bound = boundRef.current;
          const button = buttonRef.current;
          const { right } = bound.getBoundingClientRect();

          const x = Math.min(window.innerWidth - 100, right + 30);
          const y = window.innerHeight * 0.8;
          button.style.transform = `translate(${x}px, calc(${y}px))`;
          button.style.opacity = '1';
          button.disabled = true;
        }
      };

      document.addEventListener('scroll', onScroll);
      window.addEventListener('resize', onResize);

      return () => {
        document.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onResize);
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
