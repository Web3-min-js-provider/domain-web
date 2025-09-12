const CACHE_NAME = 'autotradebot-v2';
const API_CACHE = 'api-cache-v2';
const APP_SHELL = [
  '/',
  '/index.html',
  '/manifest.json',
  '/app-logo.png',
  '/app-bot.js',
  'https://cdn.tailwindcss.com',
  'https://s3.tradingview.com/tv.js'
];

// INSTALL: Precache app shell
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      cache.addAll(APP_SHELL)
    )
  );
  self.skipWaiting();
});

// ACTIVATE: Clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME && key !== API_CACHE)
          .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// FETCH: App shell = cache first, API = network first w/ fallback
self.addEventListener('fetch', event => {
  const url = event.request.url;

  // Handle API/cache logic for CoinGecko and TradingView
  if (/coingecko\.com\/api|tradingview/i.test(url)) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          return caches.open(API_CACHE).then(cache => {
            cache.put(event.request, response.clone());
            return response;
          });
        })
        .catch(() => caches.open(API_CACHE).then(cache => cache.match(event.request)))
    );
    return;
  }

  // Serve app shell assets from cache first
  if (APP_SHELL.some(path => url.endsWith(path) || url.includes(path))) {
    event.respondWith(
      caches.match(event.request).then(resp => resp || fetch(event.request))
    );
    return;
  }
});

// Listen for skipWaiting message
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});
