import { useEffect, useRef } from 'react';

function debounce<T extends (...args: Parameters<T>) => ReturnType<T>>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      func(...args);
      timeoutId = null;
    }, delay);
  };
}

export const useBottomBound = () => {
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const effectRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!bottomRef || !bottomRef.current || !effectRef || !effectRef.current) {
      return;
    }
    const bottom = bottomRef.current;
    const effect = effectRef.current;
    const fadeIn = 0;
    const fadeOut = 3000 + fadeIn;
    let animationFrameId: number | null = null;
    let startTime: number | null = null;
    let fadeOutStartTime: number | null = null;

    const debouncedSmoothScroll = debounce(
      (target: number, duration: number = 500) => {
        const start = window.pageYOffset;
        const startTime = performance.now();

        const scroll = (currentTime: number) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const linear = (t: number) => t;

          const currentPosition = start + (target - start) * linear(progress);

          // window.scrollTo(0, targetScrollPosition);
          window.scrollTo(0, currentPosition);

          if (elapsed < duration) {
            requestAnimationFrame(scroll);
          }
        };

        requestAnimationFrame(scroll);
      },
      350
    );

    const animate = (pos: number) => (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      if (elapsed < fadeIn) {
        animationFrameId = requestAnimationFrame(animate(pos));
        return;
      }

      if (effect.style.opacity === '' || effect.style.opacity === '0') {
        effect.style.opacity = '1';
        Array.from(effect.children).forEach((child) => {
          (child as HTMLElement).style.opacity = '1';
        });
        fadeOutStartTime = timestamp;

        const currentScrollPosition = window.pageYOffset;
        debouncedSmoothScroll(currentScrollPosition - 100);
      }

      if (fadeOutStartTime) {
        const fadeOutElapsed = timestamp - fadeOutStartTime;
        if (fadeOutElapsed < fadeOut) {
          const opacity = 1 - fadeOutElapsed / fadeOut;
          effect.style.opacity = opacity.toString();
          animationFrameId = requestAnimationFrame(animate(pos));
        } else {
          effect.style.opacity = '0';
          Array.from(effect.children).forEach((child) => {
            (child as HTMLElement).style.opacity = '0';
          });
          animationFrameId = null;
        }
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const { bottom } = document.body.getBoundingClientRect();
          if (animationFrameId !== null) {
            cancelAnimationFrame(animationFrameId);
            effect.style.opacity = '0';
            Array.from(effect.children).forEach((child) => {
              (child as HTMLElement).style.opacity = '0';
            });
          }
          animationFrameId = requestAnimationFrame(animate(bottom));
        }
      },
      { threshold: 1.0 }
    );

    observer.observe(bottom);

    return () => {
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
      observer.disconnect();
    };
  }, []);

  return {
    bottomRef,
    effectRef,
  };
};
