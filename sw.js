// Tiger Production System - Service Worker
// Update versi ini setiap kali ada perubahan file biar cache refresh
const CACHE_NAME = 'tiger-system-v2';

// File-file yang akan dicache untuk bisa jalan offline
const ASSETS = [
  '/index.html',
  '/inputdkbt.html',
  '/narikreject.html',
  '/kiloanproduk.html',
  '/mps.html',
  '/cekfinacinjection.html',
  '/cekfinacdecorasi.html',
  '/daftarmesin.html',
  '/rekaptahunan.html',
  '/rekaprejectinjectiontahunan.html',
  '/logo.png',
  '/logo3.png',
  '/manifest.json'
];

// Install: cache semua aset
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[SW] Caching assets...');
      // Pakai addAll tapi toleran error (logo mungkin belum ada)
      return Promise.allSettled(
        ASSETS.map(url => cache.add(url).catch(e => console.warn('[SW] Skip:', url, e)))
      );
    }).then(() => self.skipWaiting())
  );
});

// Activate: hapus cache lama
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => { console.log('[SW] Deleting old cache:', key); return caches.delete(key); })
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch: cache-first strategy
// Ambil dari cache dulu, kalau tidak ada baru ke network
self.addEventListener('fetch', event => {
  // Skip non-GET dan chrome-extension requests
  if (event.request.method !== 'GET') return;
  if (!event.request.url.startsWith('http')) return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;

      // Tidak ada di cache, ambil dari network lalu simpan
      return fetch(event.request).then(response => {
        // Hanya cache response yang valid
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseToCache));
        return response;
      }).catch(() => {
        // Offline dan tidak ada cache - tampilkan index sebagai fallback
        return caches.match('/index.html');
      });
    })
  );
});
