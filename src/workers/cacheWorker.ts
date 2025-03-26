/// <reference lib="webworker" />
/// <reference lib="es2015" />
import { ManifestEntry } from 'workbox-build';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { ExpirationPlugin } from 'workbox-expiration';
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheFirst } from 'workbox-strategies';

export type {};

const filteredManifest = (self.__WB_MANIFEST as ManifestEntry[]).filter(
  (entry) =>
    !entry.url.endsWith('.js') &&
    !entry.url.endsWith('.css') &&
    !entry.url.endsWith('.html')
);

precacheAndRoute(filteredManifest);

declare const self: ServiceWorkerGlobalScope;

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
        purgeOnQuotaError: true,
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
