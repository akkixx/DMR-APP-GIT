/**
 * Service Worker for Digital Medication Reminder (DMR) App
 * Provides offline functionality by caching essential app resources
 */

// Cache version identifier - update when making changes to cached resources
const CACHE_NAME = 'dmr-cache-v1';

// List of resources to cache for offline availability
const urlsToCache = [
  './', 
  './index.html',
  './auth.html',
  './css/styles.css',
  './js/app.js',
  './js/auth.js',
  './js/data.js'
];

/**
 * 'install' event handler
 * Triggered when the service worker is first installed
 * Caches all specified resources for offline use
 */
self.addEventListener('install', event => {
  // Ensure installation doesn't complete until cache is populated
  event.waitUntil(
    // Open (or create) the cache
    caches.open(CACHE_NAME)
      .then(cache => {
        // Add all specified URLs to the cache
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        // Skip waiting makes the service worker activate immediately
        return self.skipWaiting();
      })
  );
});

/**
 * 'fetch' event handler
 * Intercepts all fetch requests from the app
 * Serves cached resources when available, falls back to network requests
 */
self.addEventListener('fetch', event => {
  // Don't handle non-GET requests
  if (event.request.method !== 'GET') return;

  event.respondWith(
    // Check if the request matches anything in the cache
    caches.match(event.request)
      .then(response => {
        // Return cached response if found
        if (response) {
          return response;
        }

        // Clone the request because it can only be used once
        const fetchRequest = event.request.clone();

        // Make the network request
        return fetch(fetchRequest).then(response => {
          // Check if we received a valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone the response because it can only be used once
          const responseToCache = response.clone();

          // Add the response to the cache for future use
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });

          return response;
        });
      })
      .catch(() => {
        // If both cache and network fail, show offline page
        return caches.match('./index.html');
      })
  );
});

/**
 * 'activate' event handler
 * Triggered when a new service worker takes control
 * Cleans up old caches to prevent storage bloat
 */
self.addEventListener('activate', event => {
  event.waitUntil(
    // Get all cache keys
    caches.keys().then(cacheNames => {
      return Promise.all(
        // Filter for caches that don't match our current version
        cacheNames.filter(cacheName => {
          return cacheName !== CACHE_NAME;
        }).map(cacheName => {
          // Delete old caches
          return caches.delete(cacheName);
        })
      );
    })
    .then(() => {
      // Claim clients to make sure the service worker controls all pages
      return self.clients.claim();
    })
  );
}); 