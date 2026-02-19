const CACHE_NAME = 'flash-rh-v1';
const PRECACHE_URLS = [
    '/',
    '/login',
    '/manifest.json',
];

// Install: precache core assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(PRECACHE_URLS);
        })
    );
    self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys
                    .filter((key) => key !== CACHE_NAME)
                    .map((key) => caches.delete(key))
            );
        })
    );
    self.clients.claim();
});

// Fetch: network-first for API, cache-first for static assets
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') return;

    // Network-first for API and auth calls
    if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/auth/')) {
        return;
    }

    // Stale-while-revalidate for everything else
    event.respondWith(
        caches.open(CACHE_NAME).then(async (cache) => {
            const cachedResponse = await cache.match(request);
            const networkPromise = fetch(request).then((response) => {
                if (response.ok) {
                    cache.put(request, response.clone());
                }
                return response;
            }).catch(() => cachedResponse);

            return cachedResponse || networkPromise;
        })
    );
});
