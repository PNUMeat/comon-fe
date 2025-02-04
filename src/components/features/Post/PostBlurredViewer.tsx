import { viewStyle } from '@/utils/viewStyle.ts';

import { forwardRef, useEffect, useRef, useState } from 'react';

import styled from '@emotion/styled';

const ArticleBlurWrap = styled.div`
  width: 100%;
  position: relative;
  overflow: visible;
`;

const BlurSticky = styled.div`
  position: -webkit-sticky;
  position: sticky;
  top: 300px;
  width: 100%;
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
  text-align: center;
  z-index: 999;
  transform: translateY(min(100%, 400px));
  transition:
    opacity 0.8s ease-out,
    transform 0.8s ease-out;
  opacity: 0;

  &.visible {
    opacity: 1;
    transform: translateY(0);
  }
`;

const BlurStickyText = styled.div`
  color: #333;
  text-align: center;
  text-shadow: 5px 7px 11.6px rgba(63, 63, 77, 0.07);
  font-family: Pretendard;
  font-size: 34px;
  font-style: normal;
  font-weight: 700;
  line-height: 50px;
  letter-spacing: -0.32px;
`;

const BlurTeamJoinButton = styled.button`
  display: flex;
  width: 261px;
  height: 72px;
  padding: 20px 44px 20px 62px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;

  border-radius: 20px;
  background: linear-gradient(98deg, #fe82db 6.1%, #68e4ff 103.66%);
  box-shadow: 5px 7px 11.6px 0px rgba(63, 63, 77, 0.07);
`;

const BlurTeamJoinButtonText = styled.div`
  color: #fff;
  text-align: center;
  font-family: 'Pretendard';
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
`;

const BlurredLayerAndSticky = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <BlurSticky ref={ref} className={className} {...props}>
    <BlurStickyText>
      지금 팀에 참가하고 <br /> 함께 코테 풀이를 공유하세요!
    </BlurStickyText>
    <BlurTeamJoinButton>
      <BlurTeamJoinButtonText>팀 참가하기 {'->'}</BlurTeamJoinButtonText>
    </BlurTeamJoinButton>
  </BlurSticky>
));

BlurredLayerAndSticky.displayName = 'BlurredLayerAndSticky';

const ArticleViewer = styled.div<{
  shouldBlur: boolean;
}>`
  line-height: 1.5;
  ${viewStyle}

  ${(props) =>
    props.shouldBlur
      ? `
  filter: blur(5px);
  pointer-events: none;
  user-select: none;
  position: relative;
  transform: translateY(-200px);
  `
      : ''}
`;

export const PostBlurredViewer: React.FC<{
  shouldBlur: boolean;
  article: string;
}> = ({ shouldBlur, article }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const stickyRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // if (containerRef.current !== null && stickyRef.current !== null) {
    //   const element = stickyRef.current;
    //   const container = containerRef.current;
    //   const containerHeight = Math.round(
    //     container.getBoundingClientRect().height
    //   );
    //   const fittestHeight = Math.min(400, containerHeight);
    //   element.style.transform = `translateY(${fittestHeight}px)`;
    // }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 1 }
    );

    if (stickyRef.current) {
      observer.observe(stickyRef.current);
    }

    return () => {
      if (stickyRef.current) {
        observer.unobserve(stickyRef.current);
      }
    };
  }, []);

  return (
    <ArticleBlurWrap ref={containerRef}>
      {shouldBlur && (
        <BlurredLayerAndSticky
          ref={stickyRef}
          className={isVisible ? 'visible' : ''}
        />
      )}
      <ArticleViewer
        shouldBlur={shouldBlur}
        dangerouslySetInnerHTML={{
          __html: article,
        }}
      />
    </ArticleBlurWrap>
  );
};
