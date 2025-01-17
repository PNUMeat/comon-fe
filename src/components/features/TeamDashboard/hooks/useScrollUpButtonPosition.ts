import { useEffect, useRef } from 'react';

import { breakpoints } from '@/constants/breakpoints.ts';

export const useScrollUpButtonPosition = () => {
  const boundRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (boundRef?.current && buttonRef?.current) {
      const button = buttonRef.current;

      const { x } = button.getBoundingClientRect();
      console.log('init', x);
      button.style.position = 'fixed';
      button.style.right = '';
      button.style.left = '0';
      button.style.transform = `translateX(${x}px)`;

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

      const onResize = () => {
        if (boundRef?.current && buttonRef?.current) {
          const button = buttonRef.current;
          const isMobile = window.innerWidth <= breakpoints.mobile;

          button.style.position = 'absolute';
          button.style.left = '';
          button.style.right = isMobile ? '0' : '-40px';
          button.style.transform = '';

          const { x } = button.getBoundingClientRect();
          button.style.position = 'fixed';
          button.style.right = '';
          button.style.left = '0';
          button.style.transform = `translateX(${x}px)`;

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
