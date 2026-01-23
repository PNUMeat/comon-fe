import { useCallback, useEffect, useRef, useState } from 'react';

import {
  getArticleFeedback,
  getStartArticleFeedbackStream,
} from '@/api/postings';
import axios from 'axios';

type FeedbackStatus = 'idle' | 'loading' | 'streaming' | 'complete' | 'error';

type StreamMessage = { type: 'PROCESSING'; content: string } | { type: 'DONE' };

export const useArticleFeedback = (articleId: number | null) => {
  const [feedback, setFeedback] = useState('');
  const [status, setStatus] = useState<FeedbackStatus>('idle');

  const eventSourceRef = useRef<EventSource | null>(null);
  const feedbackRef = useRef('');
  const rafRef = useRef<number | null>(null);

  const flushToState = useCallback(() => {
    if (rafRef.current !== null) return;

    rafRef.current = requestAnimationFrame(() => {
      setFeedback(feedbackRef.current);
      rafRef.current = null;
    });
  }, []);

  const closeStream = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }

    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const fetchFeedback = useCallback(async () => {
    if (!articleId) return;

    setStatus('loading');

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
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        setStatus('idle');
        return;
      }
      setStatus('error');
    }
  }, [articleId]);

  useEffect(() => {
    if (!articleId) return;
    if (status === 'streaming') return;
    fetchFeedback();
  }, [articleId, fetchFeedback]);

  const startStream = useCallback(
    (overrideArticleId?: number) => {
      const targetId = overrideArticleId ?? articleId;
      if (!targetId) return;

      if (
        eventSourceRef.current &&
        eventSourceRef.current.readyState !== EventSource.CLOSED
      ) {
        return;
      }

      closeStream();

      setStatus('streaming');
      setFeedback('');
      feedbackRef.current = '';

      const es = getStartArticleFeedbackStream(targetId, {
        onMessage: (message: StreamMessage) => {
          if (message.type === 'DONE') {
            flushToState();
            closeStream();
            setStatus('complete');
            return;
          }

          feedbackRef.current += message.content;
          flushToState();
        },

        onError: () => {
          closeStream();

          if (feedbackRef.current.length > 0) setStatus('complete');
          else setStatus('error');
          
        },
      });

      eventSourceRef.current = es;
    },
    [articleId, closeStream, flushToState]
  );

  useEffect(() => {
    return () => closeStream();
  }, [closeStream]);

  return {
    feedback,
    status,
    isError: status === 'error',
    isLoading: status === 'loading',
    isStreaming: status === 'streaming',
    isComplete: status === 'complete',
    startStream,
    stop: closeStream,
  };
};
