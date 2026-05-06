import { isDevMode } from '@/utils/cookie.ts';

const getServiceWorkerUrl = () =>
  isDevMode() ? '/src/workers/cacheWorker.ts' : '/cacheWorker.js';

let registrationPromise: Promise<ServiceWorkerRegistration | null> | null =
  null;

export const registerAppServiceWorker =
  async (): Promise<ServiceWorkerRegistration | null> => {
    if (!('serviceWorker' in navigator)) {
      console.warn('[ServiceWorker] Service Worker is not supported');
      return null;
    }

    if (!registrationPromise) {
      registrationPromise = navigator.serviceWorker
        .register(getServiceWorkerUrl(), {
          type: 'module',
        })
        .then((registration) => {
          console.log('[ServiceWorker] registration successful:', registration);
          return registration;
        })
        .catch((error) => {
          registrationPromise = null;
          console.log('[ServiceWorker] registration failed:', error);
          return null;
        });
    }

    return registrationPromise;
  };
