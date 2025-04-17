import { viewStyle } from '@/utils/viewStyle.ts';

import { useRegroupImageAndArticle } from '@/hooks/useRegroupImageAndArticle.ts';

import { SText } from '@/components/commons/SText.tsx';

import { useEffect, useRef, useState } from 'react';

import { ITopicResponse } from '@/api/dashboard.ts';
import styled from '@emotion/styled';

const GapFlex = styled.div<{
  gap?: number;
  padding?: string;
  cursor?: string;
  justifyContent?: string;
}>`
  display: flex;
  align-items: center;
  justify-content: ${(props) => props.justifyContent ?? 'start'};
  gap: ${(props) => props.gap ?? 0}px;
  ${(props) => (props.padding ? `padding: ${props.padding};` : '')}
  ${(props) => (props.cursor ? `cursor: ${props.cursor};` : '')}
  height: 57px;
  width: 100%;
`;

const PostSubjectViewWrap = styled.div<{
  height: number;
  show: boolean;
}>`
  display: grid;
  grid-template-columns: ${({ show }) => (show ? '1fr' : 'auto auto')};
  grid-template-rows: ${({ show }) => (show ? '1fr auto' : '1fr')};

  justify-content: space-between;

  width: 100%;
  min-height: 57px;
  height: ${(props) => props.height}px;
  border: 1px solid #f15ca7;
  border-radius: 10px;
  margin: 20px 0;
  padding: 0 40px;
  box-sizing: border-box;
  transition: height 0.5s ease;
  overflow: hidden;
`;

const minShowHeight = 114;

const waitForImageLoad = (img: HTMLImageElement) => {
  return new Promise<void>((resolve) => {
    if (img.complete) {
      resolve();
    } else {
      const handleDone = () => {
        img.removeEventListener('load', handleDone);
        img.removeEventListener('error', handleDone);
        resolve();
      };
      img.addEventListener('load', handleDone);
      img.addEventListener('error', handleDone);
    }
  });
};

export const PostSubjectViewer: React.FC<{
  data: ITopicResponse | undefined;
  articleBodyFallback?: string;
  titlePrefix?: string;
  commentOpen?: string;
  commentClose?: string;
}> = ({
  data,
  articleBodyFallback = '문제가 등록되지 않았어요',
  titlePrefix = '문제',
  commentOpen = '문제 접기',
  commentClose = '펼쳐서 확인하기',
}) => {
  const [height, setHeight] = useState<number>(0);
  const [show, setShow] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (show && contentRef.current) {
      const content = contentRef.current;
      const images = content.querySelectorAll('img');
      if (images.length === 0) {
        setHeight(minShowHeight + content.clientHeight);
        return;
      }

      Promise.all(Array.from(images).map(waitForImageLoad))
        .then(() => {
          setHeight(minShowHeight + content.clientHeight);
        })
        .catch(() => {
          setHeight(minShowHeight + content.clientHeight);
        });
    }
  }, [show]);

  const { result } = useRegroupImageAndArticle(data);

  const handleCopy = (event: React.ClipboardEvent<HTMLDivElement>) => {
    const selection = window.getSelection();

    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);

    if (
      !contentRef.current ||
      !contentRef.current.contains(range.commonAncestorContainer)
    )
      return;

    const fragment = range.cloneContents();
    const div = document.createElement('div');
    div.appendChild(fragment);
    const html = div.innerHTML;
    const text = selection.toString();

    event?.preventDefault?.();
    event.clipboardData?.setData('text/html-viewer', html);
    event.clipboardData?.setData('text/plain', text);
  };

  return (
    <PostSubjectViewWrap
      height={show ? Math.max(height, minShowHeight) : 57}
      show={show}
    >
      <GapFlex gap={20}>
        {data?.articleTitle ? (
          <SText
            color={'#ccc'}
            fontSize={'20px'}
            fontWeight={700}
            fontFamily={'Pretendard'}
          >
            {titlePrefix}
          </SText>
        ) : null}
        <SText
          color={data?.articleTitle ? '#333' : '#ccc'}
          fontSize={'20px'}
          fontWeight={700}
          fontFamily={'Pretendard'}
          whiteSpace={'normal'}
          wordBreak={'break-word'}
        >
          {data?.articleTitle ?? articleBodyFallback}
        </SText>
      </GapFlex>
      {show && data ? (
        <TopicViewer
          ref={contentRef}
          onCopy={handleCopy}
          dangerouslySetInnerHTML={{
            __html: result,
          }}
        />
      ) : null}
      <GapFlex
        gap={12}
        padding={'0 10px'}
        cursor={'pointer'}
        onClick={() => setShow((prev) => !prev)}
        justifyContent={'end'}
      >
        <SText
          color={'#777'}
          fontSize={'16px'}
          fontWeight={400}
          fontFamily={'Pretendard'}
        >
          {show ? commentOpen : commentClose}
        </SText>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="17"
          height="10"
          viewBox="0 0 17 10"
          fill="none"
          style={{
            transform: show ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s ease',
          }}
        >
          <path d="M0 0 L8.5 10 L17 0" stroke="#CCCCCC" strokeWidth="1.5" />
        </svg>
      </GapFlex>
    </PostSubjectViewWrap>
  );
};

//TODO: TopicDetail에서 가져옴
const TopicViewer = styled.div`
  line-height: 1.5;

  ${viewStyle}
`;
