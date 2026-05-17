import { useEffect } from 'react';
import toast from 'react-hot-toast';

import { registerFcmToken } from '@/api/fcm';
import { messaging } from '@/firebase';
import { authStatusAtom } from '@/store/auth';
import { getToken, onMessage } from 'firebase/messaging';
import { useAtomValue } from 'jotai';

const registerFcmServiceWorker = () =>
  navigator.serviceWorker.register('/firebase-messaging-sw.js');

const DEFAULT_NOTIFICATION_MESSAGE = '댓글이 달렸습니다 : ';

const formatCommentNotificationMessage = (comment?: string) =>
  comment
    ? `${DEFAULT_NOTIFICATION_MESSAGE} ${comment}`
    : DEFAULT_NOTIFICATION_MESSAGE;

const getToastMessage = (message?: string) =>
  message?.startsWith(DEFAULT_NOTIFICATION_MESSAGE)
    ? message
    : formatCommentNotificationMessage(message);

interface FcmDataPayload {
  [key: string]: string | FcmDataPayload | undefined;
}

const isDataPayload = (value: unknown): value is FcmDataPayload =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const getStringValue = (
  value: string | FcmDataPayload | undefined
): string | undefined => (typeof value === 'string' ? value : undefined);

const getCommentMessageFromPayload = (payload: {
  notification?: { body?: string; title?: string };
  data?: Record<string, string>;
}) => {
  let data: FcmDataPayload = payload.data ?? {};

  if (typeof payload.data?.data === 'string') {
    try {
      const parsedData: unknown = JSON.parse(payload.data.data);
      data = isDataPayload(parsedData) ? parsedData : payload.data;
    } catch {
      data = payload.data;
    }
  }

  const content = isDataPayload(data.content) ? data.content : data;
  const comment =
    getStringValue(content.body) ??
    getStringValue(data.body) ??
    payload.notification?.body ??
    payload.notification?.title;

  return formatCommentNotificationMessage(comment);
};

const showBrowserNotification = async (message: string) => {
  if (Notification.permission !== 'granted') return;
  if (document.hasFocus()) return;

  const registration = await navigator.serviceWorker.ready;
  await registration.showNotification('Code Monster', {
    body: message,
    icon: '/web-app-manifest-192x192.png',
  });
};

export const useFcmToken = () => {
  const authStatus = useAtomValue(authStatusAtom);

  useEffect(() => {
    if (authStatus !== 'authenticated') return;

    const setup = async () => {
      if (!('Notification' in window)) {
        console.warn('[FCM] Notification API is not supported');
        return;
      }

      if (!('serviceWorker' in navigator)) {
        console.warn('[FCM] Service Worker is not supported');
        return;
      }

      const permission = await Notification.requestPermission();
      if (permission !== 'granted') return;

      const fcmRegistration = await registerFcmServiceWorker();

      const token = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
        serviceWorkerRegistration: fcmRegistration,
      });

      if (token) {
        await registerFcmToken(token);
      }
    };

    setup().catch(console.error);

    const unsubscribeOnMessage = onMessage(messaging, (payload) => {
      const message = getCommentMessageFromPayload(payload);
      toast(message, { icon: '🔔' });
      showBrowserNotification(message).catch(console.error);
    });

    const handleSwMessage = (event: MessageEvent) => {
      if (event.data?.type === 'FCM_MESSAGE') {
        toast(getToastMessage(event.data.message ?? event.data.body), {
          icon: '🔔',
        });
      }
    };
    navigator.serviceWorker.addEventListener('message', handleSwMessage);

    return () => {
      unsubscribeOnMessage();
      navigator.serviceWorker.removeEventListener('message', handleSwMessage);
    };
  }, [authStatus]);
};
