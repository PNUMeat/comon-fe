import { useCallback, useEffect, useRef, useState } from 'react';

import { API_BASE_URL } from '@/api/config';

type FeedbackStatus = 'idle' | 'streaming' | 'completed' | 'error';

export const useArticleFeedbackStream = (initialArticleId: number | null) => {
  const [feedback, setFeedback] = useState('');
  const [status, setStatus] = useState<FeedbackStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

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

          setFeedback((prev) => prev + chunk);
        } catch (err) {
          console.log(err);
        }
      };

      es.onerror = () => {
        closeStream();
        setStatus('completed');
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
