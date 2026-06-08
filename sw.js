const CACHE_NAME = 'deldim-obra-v1';
const CACHE_ASSETS = [
  '/deldim-app/',
  '/deldim-app/index.html',
  '/deldim-app/manifest.json',
  '/deldim-app/icon-192.png',
  '/deldim-app/icon-512.png',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(CACHE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  // Don't cache Google Sheets requests
  if(e.request.url.includes('script.google.com')) return;
  e.respondWith(
    caches.match(e.request)
      .then(cached => cached || fetch(e.request))
      .catch(() => caches.match('/deldim-app/'))
  );
});
