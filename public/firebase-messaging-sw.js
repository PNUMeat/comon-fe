importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js');
importScripts(
  'https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js'
);

const firebaseConfig = {
  apiKey: __VITE_FIREBASE_API_KEY__,
  authDomain: __VITE_FIREBASE_AUTH_DOMAIN__,
  projectId: __VITE_FIREBASE_PROJECT_ID__,
  storageBucket: __VITE_FIREBASE_STORAGE_BUCKET__,
  messagingSenderId: __VITE_FIREBASE_MESSAGING_SENDER_ID__,
  appId: __VITE_FIREBASE_APP_ID__,
  measurementId: __VITE_FIREBASE_MEASUREMENT_ID__,
};

firebase.initializeApp(firebaseConfig);

const DEFAULT_NOTIFICATION_MESSAGE = '댓글이 달렸습니다 : ';
const formatCommentNotificationMessage = (comment) =>
  comment
    ? `${DEFAULT_NOTIFICATION_MESSAGE} ${comment}`
    : DEFAULT_NOTIFICATION_MESSAGE;

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

const parsePayload = (payload) => {
  if (!payload) return {};

  let data = payload.data ?? {};
  if (typeof payload.data?.data === 'string') {
    try {
      data = JSON.parse(payload.data.data);
    } catch {
      data = payload.data;
    }
  }

  const content = data.content ?? data;
  const notification = payload.notification ?? {};
  const comment = notification.body ?? content.body ?? data.body;

  return {
    title: notification.title ?? content.title ?? data.title ?? 'Code Monster',
    body: formatCommentNotificationMessage(comment),
    icon:
      notification.icon ??
      content.icon ??
      data.icon ??
      '/web-app-manifest-192x192.png',
    url: data.url ?? '/',
  };
};

const showFcmNotification = (payload) => {
  const { title, body, icon, url } = parsePayload(payload);

  if (!body && !title) return Promise.resolve();

  return self.registration.showNotification(title, {
    body,
    icon,
    data: { url },
  });
};

self.addEventListener('push', (event) => {
  let payload = {};

  try {
    payload = event.data?.json() ?? {};
  } catch {
    payload = {
      data: {
        body: event.data?.text(),
      },
    };
  }

  const { body } = parsePayload(payload);

  event.waitUntil(
    Promise.all([
      showFcmNotification(payload),
      self.clients
        .matchAll({ type: 'window', includeUncontrolled: true })
        .then((clients) => {
          clients.forEach((client) => {
            client.postMessage({ type: 'FCM_MESSAGE', message: body });
          });
        }),
    ])
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const url = event.notification.data?.url ?? '/';

  event.waitUntil(
    self.clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((clients) => {
        const client = clients.find((client) => 'focus' in client);

        if (client) {
          client.navigate(url);
          return client.focus();
        }

        return self.clients.openWindow(url);
      })
  );
});
