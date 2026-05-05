const CACHE_NAME = 'aqsa-cache-v1.3.2';
const urlsToCache = [
    '/',
    '/manifest.json',
    '/index.html',
    '/src/styles.css',
    '/src/scripts.js',
    '/fonts/fonts.css',
    '/fonts/Hafs.ttf',
    '/fonts/Hafs.woff',
    '/fonts/Hafs.woff2',
    '/fonts/Majeed.ttf',
    '/fonts/Majeed.woff',
    '/fonts/Majeed.woff2',
    '/fonts/Mushaf.ttf',
    '/fonts/Mushaf.woff',
    '/fonts/Mushaf.woff2',
    '/fonts/OpenSans.ttf',
    '/fonts/OpenSans.woff',
    '/fonts/OpenSans.woff2',
    '/fonts/Bornomala.ttf',
    '/fonts/Bornomala.woff',
    '/fonts/Bornomala.woff2',
    '/fonts/July.ttf',
    '/fonts/July.woff',
    '/fonts/July.woff2',
    '/fonts/Purno.ttf',
    '/fonts/Purno.woff',
    '/fonts/Purno.woff2',
    '/icons/icon-192.png',
    '/icons/icon-512.png',
    '/icons/favicon.ico',
    '/icons/bismillah.svg',
    '/icons/ellipsis.svg',
    '/icons/unmark.svg',
];

// Install event: cache app shell
self.addEventListener('install', event => {
    //console.log('Service Worker installing...');
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