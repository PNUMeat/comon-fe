import { useCallback, useRef } from 'react';

type PointerRotationArgs = {
  mouseIgnorePadding: number;
  maxRotateDeg: number;
  z: number;
};

export const usePointerRotation = ({
  mouseIgnorePadding,
  maxRotateDeg,
  z,
}: PointerRotationArgs) => {
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

      const clampedRotateX = Math.max(
        -maxRotateDeg,
        Math.min(rotateX, maxRotateDeg)
      );
      const clampedRotateY = Math.max(
        -maxRotateDeg,
        Math.min(rotateY, maxRotateDeg)
      );

      if (
        Math.abs(offsetX) > mouseIgnorePadding ||
        Math.abs(offsetY) > mouseIgnorePadding
      ) {
        window.requestAnimationFrame(() => {
          if (boxRef.current) {
            boxRef.current.style.transform = `perspective(1000px) rotateX(${clampedRotateX}deg) rotateY(${clampedRotateY}deg) translateZ(${z}px`;
          }
        });
      }
    },
    [maxRotateDeg, z]
  );

  const onPointerLeave = useCallback(() => {
    if (boxRef.current) {
      const box = boxRef.current;
      const originalTransition = box.style.transition ?? '';

      window.requestAnimationFrame(() => {
        box.style.transition = 'transform .2s';
        box.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0)`;
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
