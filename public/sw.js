// Astro PU PWA Service Worker
const CACHE_NAME = 'sofamap-cache-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/favicon.png',
  '/manifest.json'
];

// Install Event - Pre-cache core assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// Activate Event - Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event - Handle caching strategies
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Only handle GET requests and same-origin or typical static assets
  if (request.method !== 'GET') return;

  // Stale-While-Revalidate for HTML pages (Navigation)
  if (request.mode === 'navigate' || (request.headers.get('accept') && request.headers.get('accept').includes('text/html'))) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(request).then((cachedResponse) => {
          const fetchPromise = fetch(request).then((networkResponse) => {
            if (networkResponse.status === 200) {
              cache.put(request, networkResponse.clone());
            }
            return networkResponse;
          }).catch(() => {
            // Offline fallback if not in cache
            return cachedResponse || caches.match('/');
          });
          return cachedResponse || fetchPromise;
        });
      })
    );
    return;
  }

  // Cache-First for static assets (CSS, JS, Images, Fonts)
  const isStaticAsset = 
    url.origin === self.location.origin && 
    (url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|otf|json)$/) || 
     url.pathname.includes('/_astro/'));

  if (isStaticAsset) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(request).then((networkResponse) => {
          if (networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return networkResponse;
        }).catch(() => {
          // If offline and request fails
          return new Response('Offline resource not available', { status: 503, statusText: 'Service Unavailable' });
        });
      })
    );
    return;
  }

  // Network-First or normal fetch for everything else (like API, external links)
  event.respondWith(
    fetch(request).catch(() => {
      return caches.match(request);
    })
  );
});
