// Tiger Production System - Service Worker
// Update versi ini setiap kali ada perubahan file biar cache refresh
const CACHE_NAME = 'tiger-system-v4';

// File-file yang akan dicache untuk bisa jalan offline
const ASSETS = [
  './index.html',
  './dashboard.html',
  './inputdkbt.html',
  './narikreject.html',
  './kiloanproduk.html',
  './mps.html',
  './cekfinacinjection.html',
  './cekfinacdecorasi.html',
  './daftarmesin.html',
  './rekaptahunan.html',
  './rekaprejectinjectiontahunan.html',
  './logo.png',
  './logo3.png',
  './manifest.json'
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

// Fetch: Kombinasi Network-First (untuk HTML) & Cache-First (untuk Assets)
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  if (!event.request.url.startsWith('http')) return;

  // Cek apakah request-nya untuk file HTML
  const isHtml = event.request.headers.get('accept').includes('text/html');

  if (isHtml) {
    // 1. NETWORK-FIRST untuk HTML
    // Selalu ambil versi paling baru dari server dulu biar UI dan Logic selalu up-to-date
    event.respondWith(
      fetch(event.request).then(networkResponse => {
        // Kalau sukses dari server, simpan/update ke cache
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseToCache));
        }
        return networkResponse;
      }).catch(() => {
        // Kalau offline/gagal fetch, baru ambil dari cache
        return caches.match(event.request).then(cachedResponse => {
          return cachedResponse || caches.match('./dashboard.html');
        });
      })
    );
  } else {
    // 2. CACHE-FIRST untuk Assets (Gambar, CSS, JS eksternal)
    // Biar loading tetap ngebut
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        if (cachedResponse) return cachedResponse;

        return fetch(event.request).then(networkResponse => {
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseToCache));
          }
          return networkResponse;
        });
      })
    );
  }
});
