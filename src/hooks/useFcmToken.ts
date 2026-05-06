import { useEffect } from 'react';
import toast from 'react-hot-toast';

import { registerFcmToken } from '@/api/fcm';
import { messaging } from '@/firebase';
import { authStatusAtom } from '@/store/auth';
import { registerAppServiceWorker } from '@/workers/registerServiceWorker';
import { getToken, onMessage } from 'firebase/messaging';
import { useAtomValue } from 'jotai';

export const useFcmToken = () => {
  const authStatus = useAtomValue(authStatusAtom);

  useEffect(() => {
    console.log('[FCM] authStatus:', authStatus);
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

      console.log('[FCM] requesting notification permission...');
      const permission = await Notification.requestPermission();
      console.log('[FCM] permission:', permission);
      if (permission !== 'granted') return;

      console.log('[FCM] registering app SW...');
      const registration = await registerAppServiceWorker();
      if (!registration) return;
      console.log('[FCM] SW registered:', registration);

      console.log('[FCM] waiting for SW ready...');
      await navigator.serviceWorker.ready;
      console.log('[FCM] SW ready');

      console.log('[FCM] getting token...');
      const token = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
        serviceWorkerRegistration: registration,
      });
      console.log('[FCM] token:', token);

      if (token) {
        await registerFcmToken(token);
        console.log('[FCM] token registered to server');
      }
    };

    setup().catch(console.error);

    const unsubscribe = onMessage(messaging, (payload) => {
      const { title, body } = payload.notification ?? {};
      if (title) {
        toast(body ?? title, { icon: '🔔' });
      }
    });

    return unsubscribe;
  }, [authStatus]);
};
