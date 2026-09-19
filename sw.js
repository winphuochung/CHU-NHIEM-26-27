// Service Worker cho PWA Lớp 9A1 - TH & THCS Phước Hưng (Version 4.5.0 - Network First)
const CACHE_NAME = 'phuoc-hung-9a1-v4.5.0';

const PRECACHE_ASSETS = [
  './',
  './index.html',
  './css/app.css',
  './manifest.json',
  './js/store.js',
  './js/security.js',
  './js/auth.js',
  './js/ai-analytics.js',
  './js/workspaces.js',
  './js/exam-hub.js',
  './js/gamification.js',
  './js/sync-hub.js',
  './js/voice-assistant.js',
  './js/xlsx.full.min.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('[SW] Precache failed partially:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            console.log('[Service Worker] Xóa sạch cache cũ:', name);
            return caches.delete(name);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  // Chiến lược Network-First: Ưu tiên mạng lấy code mới nhất, nếu mất mạng chuyển sang cache
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && event.request.url.startsWith('http')) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone).catch(() => {});
          });
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) return cachedResponse;
          if (event.request.headers.get('accept')?.includes('text/html')) {
            return caches.match('./index.html');
          }
        });
      })
  );
});

