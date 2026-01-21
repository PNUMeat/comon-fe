import { useCallback, useEffect, useRef, useState } from 'react';

import {
  getArticleFeedback,
  getStartArticleFeedbackStream,
} from '@/api/postings';
import axios from 'axios';

type FeedbackStatus = 'idle' | 'loading' | 'streaming' | 'complete' | 'error';

const END_MARKER = '스트리밍 종료';

export const useArticleFeedback = (articleId: number | null) => {
  const [feedback, setFeedback] = useState('');
  const [status, setStatus] = useState<FeedbackStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const feedbackRef = useRef<string>('');

  const closeStream = useCallback(() => {
    eventSourceRef.current?.close();
    eventSourceRef.current = null;
  }, []);

  const fetchFeedback = useCallback(async () => {
    if (!articleId) return;

    setStatus('loading');
    setError(null);

    try {
      const res = await getArticleFeedback(articleId);

      const body = res.data.feedbackBody;
      if (!body) {
        setStatus('idle');
        return;
      }

      setFeedback(body);
      feedbackRef.current = body;
      setStatus('complete');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 404) {
          setStatus('idle');
          return;
        }
      }

      setError('AI 피드백을 불러오지 못했습니다.');
      setStatus('error');
    }
  }, [articleId]);

  useEffect(() => {
    if (!articleId) return;
    fetchFeedback();
  }, [articleId, fetchFeedback]);

  const startStream = useCallback(
    (overrideArticleId?: number) => {
      const targetId = overrideArticleId ?? articleId;
      if (!targetId) return;
      if (eventSourceRef.current) return;

      setStatus('streaming');
      setError(null);
      setFeedback('');
      feedbackRef.current = '';

      const es = getStartArticleFeedbackStream(targetId, {
        onMessage: (chunk) => {
          feedbackRef.current += chunk;
          setFeedback((prev) => prev + chunk);

          if (feedbackRef.current.includes(END_MARKER)) {
            const finalText = feedbackRef.current
              .replace(END_MARKER, '')
              .trim();

            setFeedback(finalText);
            feedbackRef.current = finalText;

            closeStream();
            setStatus('complete');
          }
        },
        onError: () => {
          closeStream();

          if (feedbackRef.current.length > 0) {
            setStatus('complete' as FeedbackStatus);
          } else {
            setError('AI 피드백 생성에 실패했습니다.');
            setStatus('error');
          }
        },
      });

      eventSourceRef.current = es;
    },
    [articleId, closeStream]
  );

  useEffect(() => {
    return () => closeStream();
  }, [closeStream]);

  return {
    feedback,
    status,
    error,
    isLoading: status === 'loading',
    isStreaming: status === 'streaming',
    isComplete: status === 'complete',
    startStream,
    stop: closeStream,
  };
};
