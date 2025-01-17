/// <reference lib="webworker" />
/// <reference lib="es2015" />
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { ExpirationPlugin } from 'workbox-expiration';
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';

precacheAndRoute(self.__WB_MANIFEST || []);

declare const self: ServiceWorkerGlobalScope;

// Cache First (폰트 & 이미지)
registerRoute(
  ({ request, url }) =>
    request.destination === 'font' ||
    ['woff', 'woff2', 'png', 'jpg', 'jpeg', 'svg', 'gif', 'webp'].includes(
      url.pathname.split('.').pop() || ''
    ),
  new CacheFirst({
    cacheName: 'static-cache',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 60 * 60 * 24 * 30,
      }),
    ],
  })
);

// Stale While Revalidate (CSS, JS, API)
registerRoute(
  ({ request }) => ['style', 'script', 'worker'].includes(request.destination),
  new StaleWhileRevalidate({
    cacheName: 'dynamic-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 60 * 60 * 24 * 7, // 7일
      }),
    ],
  })
);

self.addEventListener('activate', (event: ExtendableEvent) => {
  const cacheWhitelist = ['static-cache', 'dynamic-cache'];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
