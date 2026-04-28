const CACHE_NAME = 'aqsa3-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/src/styles.css',
    '/src/scripts.js',
    '/fonts/fonts.css',
    '/fonts/AmiriQuran-Regular.ttf',
    '/fonts/AmiriQuran-Regular.woff',
    '/fonts/AmiriQuran-Regular.woff2',
    '/fonts/OpenSans-Regular.ttf',
    '/fonts/OpenSans-Regular.woff',
    '/fonts/OpenSans-Regular.woff2',
    '/fonts/SolaimanLipi-Regular.ttf',
    '/fonts/SolaimanLipi-Regular.woff',
    '/fonts/SolaimanLipi-Regular.woff2',
    '/manifest.json',
    '/icons/icon-192.png',
    '/icons/icon-512.png',
    '/icons/favicon.ico',
    '/icons/bismillah.svg',
    '/icons/ellipsis.svg',
    '/icons/unmark.svg',
];

// Install event: cache app shell
self.addEventListener('install', event => {
    console.log('Service Worker installing...');
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(urlsToCache);
        })
    );
});

// Activate event: clean up old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(name => {
                    if (name !== CACHE_NAME) {
                        return caches.delete(name);
                    }
                })
            );
        })
    );
});

// Fetch event: serve from cache if available
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});