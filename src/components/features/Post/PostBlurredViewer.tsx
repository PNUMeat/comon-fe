import { viewStyle } from '@/utils/viewStyle.ts';

import { useRef } from 'react';

import styled from '@emotion/styled';

const ArticleBlurWrap = styled.div`
  width: 100%;
  position: relative;
  overflow-x: hidden;
`;

// const OverlayText = styled.div<{ isVisible: boolean }>`
//   position: absolute;
//   white-space: pre;
//   // top: 0;
//   top: 500px;
//   left: 10%;
//   transform: translate(0, ${({ isVisible }) => (isVisible ? '-400px' : '0')});
//   transition:
//     transform 0.4s ease,
//     opacity 0.5s ease;
//   background: rgba(0, 0, 0, 0.6);
//   color: white;
//   padding: 10px 20px;
//   border-radius: 8px;
//   font-size: 20px;
//   font-weight: bold;
//   // opacity: 1;
//   // opacity: ${({ isVisible }) => (isVisible ? 1 : 0)};
// `;

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
  `
      : ''}
`;

export const PostBlurredViewer: React.FC<{
  shouldBlur: boolean;
  article: string;
}> = ({ shouldBlur, article }) => {
  // const overlayRef = useRef<HTMLDivElement | null>(null);
  const viewerRef = useRef<HTMLDivElement | null>(null);
  // const overlayBoundRef = useRef<number | null>(null);
  // const [isVisible, setIsVisible] = useState(false);

  // useEffect(() => {
  //   const observer = new IntersectionObserver(
  //     ([entry]) => {
  //       if (entry.isIntersecting) {
  //         setIsVisible(true);
  //
  //         setTimeout(() => {
  //           if (overlayRef?.current !== null && viewerRef?.current !== null) {
  //             const overlay = overlayRef.current;
  //             const { x, y } = overlay.getBoundingClientRect();
  //             // const { y: viewerY } = viewerRef.current.getBoundingClientRect();
  //             overlay.style.opacity = '0';
  //             overlay.style.transition = 'none';
  //             overlay.style.position = 'fixed';
  //             overlay.style.left = '0';
  //             overlay.style.top = '0';
  //             overlay.style.transform = `translate(${x}px, ${y}px)`;
  //             overlay.style.opacity = '1';
  //
  //             overlayBoundRef.current = y;
  //
  //             const onScroll = () => {
  //               if (
  //                 viewerRef?.current !== null &&
  //                 overlayRef.current !== null &&
  //                 overlayBoundRef?.current !== null
  //               ) {
  //                 const viewer = viewerRef.current;
  //                 const overlayBound = overlayBoundRef.current;
  //                 const { y } = viewer.getBoundingClientRect();
  //                 if (overlayBound <= y) {
  //                   overlayBoundRef.current = -1;
  //                   document.removeEventListener('scroll', onScroll);
  //                   setIsVisible(false);
  //                   // overlay.style.opacity = '0';
  //                   overlay.style.position = 'absolute';
  //                   overlay.style.left = '10%';
  //                   overlay.style.top = '500px';
  //                   overlay.style.transform = '';
  //                   overlay.style.transition =
  //                     'transform 0.4s ease, opacity 0.5s ease';
  //                 }
  //               }
  //             };
  //
  //             document.addEventListener('scroll', onScroll);
  //           }
  //         }, 500);
  //       } else {
  //         setIsVisible(false);
  //       }
  //     },
  //     { threshold: 0.9 }
  //   );
  //
  //   if (overlayRef.current) {
  //     observer.observe(overlayRef.current);
  //   }
  //
  //   return () => {
  //     if (overlayRef.current) {
  //       observer.unobserve(overlayRef.current);
  //     }
  //   };
  // }, []);

  return (
    <ArticleBlurWrap ref={viewerRef}>
      <ArticleViewer
        shouldBlur={shouldBlur}
        dangerouslySetInnerHTML={{
          __html: article,
        }}
      />
      {/*{shouldBlur && (*/}
      {/*  <OverlayText ref={overlayRef} isVisible={isVisible}>*/}
      {/*    팀에 참가하고*/}
      {/*    <br />*/}
      {/*    함께 코테 풀이를 공유하세요!*/}
      {/*  </OverlayText>*/}
      {/*)}*/}
    </ArticleBlurWrap>
  );
};
