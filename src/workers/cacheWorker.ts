/// <reference lib="webworker" />
/// <reference lib="es2015" />
import { ManifestEntry } from 'workbox-build';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { ExpirationPlugin } from 'workbox-expiration';
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheFirst } from 'workbox-strategies';

export type {};

const precacheManifest = (self.__WB_MANIFEST ?? []) as ManifestEntry[];

const filteredManifest = precacheManifest.filter(
  (entry) => !/\.(js|css|html)(\?.*)?$/.test(entry.url)
);

precacheAndRoute(filteredManifest);

declare const self: ServiceWorkerGlobalScope;

type PushPayload = {
  notification?: {
    title?: string;
    body?: string;
    icon?: string;
    url?: string;
  };
  data?: {
    title?: string;
    body?: string;
    icon?: string;
    url?: string;
  };
  title?: string;
  body?: string;
  icon?: string;
  url?: string;
};

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

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event: ExtendableEvent) => {
  const cacheWhitelist = ['static-cache', 'dynamic-cache'];
  event.waitUntil(
    Promise.all([
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (!cacheWhitelist.includes(cacheName)) {
              return caches.delete(cacheName);
            }
          })
        );
      }),
      self.clients.claim(),
    ])
  );
});

self.addEventListener('push', (event: PushEvent) => {
  const rawData = event.data?.text() ?? '';

  let data: PushPayload = {};
  try {
    data = rawData ? JSON.parse(rawData) : {};
  } catch {
    data = { data: { body: rawData } };
  }

  const notification = data.notification ?? data.data ?? data;
  const title = notification.title;
  const body = notification.body ?? rawData;
  const icon = notification.icon;
  const clickUrl = data.data?.url ?? notification.url ?? '/';

  if (!body) return;

  const notificationTitle = title ?? 'Code Monster';

  event.waitUntil(
    Promise.all([
      self.registration.showNotification(notificationTitle, {
        body,
        icon: icon ?? '/web-app-manifest-192x192.png',
        data: { url: clickUrl },
      }),
      self.clients
        .matchAll({ type: 'window', includeUncontrolled: true })
        .then((clients) => {
          clients.forEach((client) => {
            client.postMessage({ type: 'FCM_MESSAGE', title, body });
          });
        }),
    ])
  );
});

self.addEventListener('notificationclick', (event: NotificationEvent) => {
  event.notification.close();

  const url = event.notification.data?.url ?? '/';

  event.waitUntil(
    self.clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((clients) => {
        const client = clients.find((c) => c.visibilityState === 'visible');
        if (client) {
          client.navigate(url);
          return client.focus();
        }
        return self.clients.openWindow(url);
      })
  );
});
