// Service worker: lets the guide open with no signal, and lets phones add it
// to the home screen like an app.
//
// Every request goes to the network first, so residents always get the
// latest page and the latest sheet when they are online. Each answer is saved;
// when the network fails (or the sheet takes too long and a saved copy
// exists), the saved copy is used instead and app.js says it is offline.
//
// Only this site's own files and the published Google Sheet are saved.
// Google Analytics and everything else pass straight through, untouched.
//
// Bump CACHE when this file changes in a way that should drop old copies.
const CACHE = 'ccsm-v1';
const SHEET_KEY = 'sheet.csv';
const SHEET_TIMEOUT_MS = 6000;
const SCOPE_PATH = new URL('./', self.location).pathname;

// Saved at install so the first offline visit works even before these files
// were fetched through the worker. Versioned URLs (app.js?v=17) are stored
// without the ?v= part, so each file has exactly one saved copy.
const SHELL = [
  './',
  'app.js',
  'analytics.js',
  'styles.css',
  'ccsm_logo_web.png',
  'favicon-32.png',
  'apple-touch-icon.png',
  'icon-192.png',
  'icon-512.png',
  'manifest.webmanifest',
  'flyer/ccsm-qr.svg',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

function isSheetRequest(url) {
  return url.hostname === 'docs.google.com' && url.pathname.includes('/spreadsheets/') && url.searchParams.get('output') === 'csv';
}

// The page is the same whatever its ?share= or ?lang=, so it is saved once.
// Files are keyed by their path inside the site, without ?v=.
function getCacheKey(request, url) {
  if (isSheetRequest(url)) return SHEET_KEY;
  if (request.mode === 'navigate') return './';
  return url.pathname.slice(SCOPE_PATH.length) || './';
}

async function networkFirst(request, key, timeoutMs) {
  const cache = await caches.open(CACHE);
  const saved = await cache.match(key);

  const fromNetwork = fetch(request).then(response => {
    if (response.ok) cache.put(key, response.clone());
    return response;
  });

  if (!saved) return fromNetwork;

  // With a saved copy in hand, a dead or very slow connection falls back to it.
  const timeout = new Promise(resolve => {
    if (timeoutMs) setTimeout(() => resolve(saved), timeoutMs);
  });
  return Promise.race([fromNetwork.catch(() => saved), timeout]);
}

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  const sameSite = url.origin === self.location.origin && url.pathname.startsWith(SCOPE_PATH);
  if (!sameSite && !isSheetRequest(url)) return;
  if (url.pathname.endsWith('/sw.js')) return;

  const key = getCacheKey(request, url);
  event.respondWith(networkFirst(request, key, isSheetRequest(url) ? SHEET_TIMEOUT_MS : 0));
});
