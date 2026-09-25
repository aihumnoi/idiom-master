const CACHE_NAME = 'idiom-master-v13';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/data/idioms.js',
  '/data/idioms.json',
  '/data/oxford3000.js',
  '/data/oxford3000.json',
  '/data/sentences.js',
  '/data/sentences.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/icon-180.png',
  '/icons/icon-32.png'
];
const CDN_CACHE = 'idiom-master-cdn-v5';

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('message', e => {
  if (e.data && e.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE_NAME && k !== CDN_CACHE).map(k => caches.delete(k))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = e.request.url;
  const isCDN = url.includes('cdn.tailwindcss.com') || url.includes('cdnjs.cloudflare.com') || url.includes('fonts.googleapis.com') || url.includes('fonts.gstatic.com');
  if (isCDN) {
    e.respondWith(
      caches.open(CDN_CACHE).then(cache => cache.match(e.request).then(cached => {
        if (cached) return cached;
        return fetch(e.request).then(res => {
          if (res.ok) cache.put(e.request, res.clone());
          return res;
        }).catch(() => cached);
      }))
    );
    return;
  }

  // Network first for data files so updates to idioms/oxford/sentences are immediately reflected!
  if (url.includes('/data/')) {
    e.respondWith(
      fetch(e.request).then(res => {
        if (res.ok) {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
        }
        return res;
      }).catch(() => caches.match(e.request))
    );
    return;
  }

  // Network first for html, cache first for assets
  if (e.request.mode === 'navigate') {
    e.respondWith(fetch(e.request).then(res => {
      const clone = res.clone();
      caches.open(CACHE_NAME).then(c => c.put('/index.html', clone));
      return res;
    }).catch(() => caches.match('/index.html').then(c => c || caches.match('/'))));
    return;
  }

  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request).then(res => {
      if (res.ok && (e.request.url.includes('/assets/') || e.request.url.includes('cdn.tailwindcss') || e.request.url.includes('cdnjs.cloudflare'))) {
        const clone = res.clone();
        caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
      }
      return res;
    }).catch(() => cached))
  );
});
