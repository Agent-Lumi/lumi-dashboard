// Lumi Dashboard Service Worker
// Provides offline support and caching

const CACHE_NAME = 'lumi-dashboard-v1-3-1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/style.css',
  '/app.js',
  '/manifest.json'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('[SW] Install complete');
        return self.skipWaiting();
      })
      .catch((err) => {
        console.error('[SW] Install failed:', err);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating...');
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[SW] Activation complete');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip cross-origin requests (except for weather API which we handle specially)
  if (url.origin !== self.location.origin && !url.hostname.includes('wttr.in')) {
    return;
  }

  // Weather API - network first, cache fallback
  if (url.hostname.includes('wttr.in')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Clone and cache successful responses
          if (response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, clone);
            });
          }
          return response;
        })
        .catch(() => {
          // Return cached weather if available
          return caches.match(request).then((cached) => {
            if (cached) {
              console.log('[SW] Serving cached weather');
              return cached;
            }
            // Return offline response
            return new Response(
              JSON.stringify({
                current_condition: [{
                  temp_F: '--',
                  weatherDesc: [{ value: 'Offline' }],
                  humidity: '--',
                  windspeedMiles: '--',
                  FeelsLikeF: '--'
                }]
              }),
              {
                headers: { 'Content-Type': 'application/json' },
                status: 200
              }
            );
          });
        })
    );
    return;
  }

  // Static assets - cache first, network fallback
  event.respondWith(
    caches.match(request)
      .then((cached) => {
        if (cached) {
          // Return cached version and update in background
          const fetchPromise = fetch(request)
            .then((networkResponse) => {
              if (networkResponse.status === 200) {
                const clone = networkResponse.clone();
                caches.open(CACHE_NAME).then((cache) => {
                  cache.put(request, clone);
                });
              }
              return networkResponse;
            })
            .catch(() => cached);
          
          return cached;
        }

        // Not in cache, fetch from network
        return fetch(request)
          .then((response) => {
            if (response.status === 200) {
              const clone = response.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(request, clone);
              });
            }
            return response;
          })
          .catch((err) => {
            console.error('[SW] Fetch failed:', err);
            // Return offline page for HTML requests
            if (request.headers.get('Accept').includes('text/html')) {
              return caches.match('/index.html');
            }
            throw err;
          });
      })
  );
});

// Background sync for offline actions (future enhancement)
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag);
});

// Push notification support (future enhancement)
self.addEventListener('push', (event) => {
  console.log('[SW] Push received:', event);
  const options = {
    body: event.data?.text() || 'Lumi Dashboard update!',
    icon: 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 192 192\'%3E%3Crect fill=\'%236f42c1\' width=\'192\' height=\'192\' rx=\'24\'/%3E%3Ctext x=\'96\' y=\'130\' font-size=\'120\' text-anchor=\'middle\'%3E%F0%9F%92%A1%3C/text%3E%3C/svg%3E',
    badge: 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 96 96\'%3E%3Crect fill=\'%236f42c1\' width=\'96\' height=\'96\' rx=\'12\'/%3E%3Ctext x=\'48\' y=\'70\' font-size=\'60\' text-anchor=\'middle\'%3E%F0%9F%92%A1%3C/text%3E%3C/svg%3E',
    tag: 'lumi-notification',
    requireInteraction: false
  };
  
  event.waitUntil(
    self.registration.showNotification('Lumi Dashboard', options)
  );
});

// Message handling from main thread
self.addEventListener('message', (event) => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
});

console.log('[SW] Service Worker loaded 💡');
