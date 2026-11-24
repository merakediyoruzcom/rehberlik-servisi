/**
 * Service Worker — Rehberlik Servisi
 * Tüm varlıkları yerel olarak önbelleğe alır ve çevrimdışı çalışmayı sağlar.
 */

const CACHE_NAME = 'rehberlikservisi-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './css/app.css',
  './css/print.css',
  './js/db.js',
  './js/app.js',
  './js/modules/agenda.js',
  './js/modules/students.js',
  './js/modules/sessions.js',
  './js/modules/classes.js',
  './js/modules/ozelegitim.js',
  './js/modules/reports.js',
  './js/modules/settings.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
