import { useCallback, useEffect, useRef, useState } from 'react';

import { API_BASE_URL } from '@/api/config';

type FeedbackStatus = 'idle' | 'streaming' | 'completed' | 'error';

const END_MARKER = '스트리밍 종료';

export const useArticleFeedbackStream = (initialArticleId: number | null) => {
  const [feedback, setFeedback] = useState('');
  const [status, setStatus] = useState<FeedbackStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const feedbackRef = useRef<string>('');

  const closeStream = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
  }, []);

  const start = useCallback(
    (overrideArticleId?: number) => {
      const targetId = overrideArticleId ?? initialArticleId;

      if (!targetId) return;
      if (eventSourceRef.current) return;

      setStatus('streaming');
      setError(null);
      setFeedback('');

      const es = new EventSource(
        `${API_BASE_URL}/api/v1/articles/${targetId}/feedback/stream`,
        { withCredentials: true }
      );

      eventSourceRef.current = es;

      es.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data);
          const chunk = parsed.content;

          feedbackRef.current += chunk;
          setFeedback((prev) => prev + chunk);

          if (feedbackRef.current.includes(END_MARKER)) {
            closeStream();
            const finalFeedback = feedbackRef.current
              .replace(END_MARKER, '')
              .trim();
            setFeedback(finalFeedback);
            feedbackRef.current = finalFeedback;
            setStatus('completed');
          }
        } catch (err) {
          console.log(err);
        }
      };

      es.onerror = () => {
        closeStream();

        if (feedbackRef.current.includes(END_MARKER)) {
          const finalFeedback = feedbackRef.current
            .replace(END_MARKER, '')
            .trim();
          setFeedback(finalFeedback);
          feedbackRef.current = finalFeedback;
          setStatus('completed');
        } else if (feedbackRef.current.length > 0) {
          setError('응답이 비정상적으로 종료되었습니다.');
          setStatus('error');
        } else {
          setError('피드백 생성에 실패했습니다. 다시 시도해주세요.');
          setStatus('error');
        }
      };
    },
    [initialArticleId, closeStream]
  );

  const stop = useCallback(() => {
    closeStream();
    setStatus('completed');
  }, [closeStream]);

  useEffect(() => {
    return () => {
      closeStream();
    };
  }, [closeStream]);

  return {
    feedback,
    status,
    error,
    isStreaming: status === 'streaming',
    hasCompleted: status === 'completed',
    start,
    stop,
  };
};
