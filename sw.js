// Service Worker cho PWA Lớp 9A1 - TH & THCS Phước Hưng (Version 4.2.0 - Network First)
const CACHE_NAME = 'phuoc-hung-9a1-v4.2.0';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          console.log('[Service Worker] Xóa sạch cache cũ:', name);
          return caches.delete(name);
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  // Luôn ưu tiên tải trực tiếp từ máy chủ mạng để cập nhật mã nguồn mới nhất tức thì
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        return networkResponse;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});
