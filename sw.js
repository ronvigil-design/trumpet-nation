/*
 * Trumpet offline shell.
 *
 * Strategy is split deliberately:
 *   - App code (documents, JS, CSS) is network-first, so a deploy actually
 *     reaches installed users. A cache-first shell would pin them to whatever
 *     version they installed, forever, with no way to push a safety fix.
 *   - Static assets (icons, images, fonts) are cache-first, since they are
 *     content-addressed in practice and rarely change.
 * The cache falls back on the network failing, which is what makes the app
 * usable offline.
 */

const VERSION = "v5";
const SHELL_CACHE = `trumpet-shell-${VERSION}`;
const ASSET_CACHE = `trumpet-assets-${VERSION}`;
const KEEP = new Set([SHELL_CACHE, ASSET_CACHE]);

const APP_SHELL = ["./", "./index.html", "./styles.css", "./app.js", "./manifest.webmanifest"];
const STATIC_ASSETS = ["./assets/logo-96.png", "./assets/logo-180.png", "./assets/logo-192.png", "./assets/logo-384.png", "./assets/logo-512.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(SHELL_CACHE).then((cache) => cache.addAll(APP_SHELL)),
      caches.open(ASSET_CACHE).then((cache) => cache.addAll(STATIC_ASSETS)),
    ]).then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => !KEEP.has(key)).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

/*
 * Classify by path as well as destination. `request.destination` is only set
 * for browser-initiated loads — a `fetch("app.js")` from script reports an
 * empty destination, which previously routed app code down the cache-first
 * branch and pinned it to a stale copy. Extension matching closes that hole.
 */
const APP_CODE_PATH = /\.(?:html|js|mjs|css|webmanifest)$/i;

const isAppCode = (request, url) =>
  request.mode === "navigate" ||
  request.destination === "document" ||
  request.destination === "script" ||
  request.destination === "style" ||
  url.pathname.endsWith("/") ||
  APP_CODE_PATH.test(url.pathname);

// Navigations differ only by hash, which would otherwise multiply cache
// entries (/#home, /#ask, /#serve …) for one document.
const cacheKeyFor = (request) => (request.mode === "navigate" ? "./index.html" : request);

const networkFirst = async (request) => {
  const cache = await caches.open(SHELL_CACHE);
  const key = cacheKeyFor(request);
  try {
    const response = await fetch(request);
    if (response && response.status === 200 && response.type !== "opaque") {
      cache.put(key, response.clone());
    }
    return response;
  } catch (error) {
    const cached = await cache.match(key);
    if (cached) return cached;
    if (request.mode === "navigate") {
      const shell = await cache.match("./index.html");
      if (shell) return shell;
    }
    throw error;
  }
};

const cacheFirst = async (request) => {
  const cache = await caches.open(ASSET_CACHE);
  const cached = await cache.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response && response.status === 200 && response.type !== "opaque") {
    cache.put(request, response.clone());
  }
  return response;
};

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(isAppCode(request, url) ? networkFirst(request) : cacheFirst(request));
});
