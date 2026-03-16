
const CACHE_NAME = 'image-transformer-animator-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/index.css',
  '/index.tsx', // Or the compiled JS file if your build process changes this.
  // Add any other static assets like icons or manifest.json if you have them.
  // For the favicon provided in index.html:
  'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🖼️</text></svg>'
];

// Install event: Opens a cache and adds core assets to it.
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        // Filter out data URIs before trying to fetch them for caching
        const cacheableUrls = urlsToCache.filter(url => !url.startsWith('data:'));
        return cache.addAll(cacheableUrls);
      })
      .catch(error => {
        console.error('Failed to cache assets during install:', error);
      })
  );
});

// Activate event: Cleans up old caches.
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event: Serves assets from cache first, falling back to network.
self.addEventListener('fetch', (event) => {
  // Skip caching for non-GET requests or requests to external APIs (like Gemini)
  if (event.request.method !== 'GET' ||
      event.request.url.startsWith('chrome-extension://') || // Ignore browser extension requests
      event.request.url.includes('esm.sh') // Ignore requests to esm.sh CDN for react etc.
     ) {
    event.respondWith(fetch(event.request));
    return;
  }

  // For data URIs, just let the browser handle them.
  if (event.request.url.startsWith('data:')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // Not in cache - fetch from network, cache it, then return
        return fetch(event.request).then(
          (networkResponse) => {
            // Check if we received a valid response
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              // Don't cache opaque responses (e.g. from CDNs without CORS) unless necessary and understood.
              // For 'basic' type, it means same-origin.
              return networkResponse;
            }

            // IMPORTANT: Clone the response. A response is a stream
            // and because we want the browser to consume the response
            // as well as the cache consuming the response, we need
            // to clone it so we have two streams.
            const responseToCache = networkResponse.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return networkResponse;
          }
        ).catch(error => {
          console.error('Fetch failed; returning offline page or error if available.', error);
          // Optionally, return a fallback offline page here if one is cached.
          // return caches.match('/offline.html');
        });
      })
  );
});
