// src/workers/fileCacher.ts

/// <reference lib="webworker" />
/// <reference lib="es2015" />

export type {};

declare const self: ServiceWorkerGlobalScope;

const CACHE_NAME = 'cache-v1';

const FONT_FILES: string[] = [
  '/src/assets/fonts/NanumSquareNeo-Variable.woff2',
  '/src/assets/fonts/NanumSquareNeoTTF-aLt.woff2',
  '/src/assets/fonts/NanumSquareNeoTTF-bRg.woff2',
  '/src/assets/fonts/NanumSquareNeoTTF-cBd.woff2',
  '/src/assets/fonts/NanumSquareNeoTTF-dEb.woff2',
  '/src/assets/fonts/NanumSquareNeoTTF-eHv.woff2',

  '/src/assets/fonts/Pretendard-Black.subset.woff2',
  '/src/assets/fonts/Pretendard-Bold.subset.woff2',
  '/src/assets/fonts/Pretendard-ExtraBold.subset.woff2',
  '/src/assets/fonts/Pretendard-ExtraLight.subset.woff2',
  '/src/assets/fonts/Pretendard-Light.subset.woff2',
  '/src/assets/fonts/Pretendard-Medium.subset.woff2',
  '/src/assets/fonts/Pretendard-Regular.subset.woff2',
  '/src/assets/fonts/Pretendard-SemiBold.subset.woff2',
  '/src/assets/fonts/Pretendard-Thin.subset.woff2',
];

const IMAGE_FILES = [
  '/public/favicon.svg',
  '/public/favicon-96x96.png',
  '/public/web-app-manifest-129x192.png',
  '/public/web-app-manifest-512x512.png',
];

const CACHE_TARGETS = [...FONT_FILES, ...IMAGE_FILES];

self.addEventListener('install', (event: ExtendableEvent) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(CACHE_TARGETS);
      })
      .then(() => {
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Cache failed:', error);
      })
  );
});

self.addEventListener('fetch', (event: FetchEvent) => {
  if (event.request.url.match(/\.(woff2?|svg|png)$/)) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        if (response) {
          return response;
        }

        return fetch(event.request).then((networkResponse) => {
          if (
            !networkResponse ||
            networkResponse.status !== 200 ||
            networkResponse.type !== 'basic'
          ) {
            return networkResponse;
          }

          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return networkResponse;
        });
      })
    );
  }
});

self.addEventListener('activate', (event: ExtendableEvent) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );

  return self.clients.claim();
});
