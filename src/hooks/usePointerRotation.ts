import { useCallback, useRef } from 'react';

export const usePointerRotation = (deadZone: number, maxRotate: number) => {
  const boxRef = useRef<HTMLDivElement | null>(null);

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!boxRef.current) {
        return;
      }

      const rect = boxRef.current.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const offsetX = e.clientX - rect.left - centerX;
      const offsetY = e.clientY - rect.top - centerY;
      const rotateX = -(offsetY / centerY) * 10;
      const rotateY = (offsetX / centerX) * 10;

      const clampedRotateX = Math.max(-maxRotate, Math.min(rotateX, maxRotate));
      const clampedRotateY = Math.max(-maxRotate, Math.min(rotateY, maxRotate));

      if (Math.abs(offsetX) > deadZone || Math.abs(offsetY) > deadZone) {
        window.requestAnimationFrame(() => {
          if (boxRef.current) {
            boxRef.current.style.transform = `perspective(1000px) rotateX(${clampedRotateX}deg) rotateY(${clampedRotateY}deg)`;
          }
        });
      }
    },
    [boxRef]
  );

  const onPointerLeave = useCallback(() => {
    if (boxRef.current) {
      const box = boxRef.current;
      const originalTransition = box.style.transition ?? '';

      window.requestAnimationFrame(() => {
        box.style.transition = 'transform .2s';
        box.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
      });

      function onTransitionEnd(this: HTMLDivElement, e: TransitionEvent) {
        if (e.propertyName === 'transform') {
          this.style.transition = originalTransition;
          this.removeEventListener('transitionend', onTransitionEnd);
        }
      }
      box.addEventListener('transitionend', onTransitionEnd);
    }
  }, [boxRef]);

  return {
    boxRef,
    onPointerMove,
    onPointerLeave,
  };
};
