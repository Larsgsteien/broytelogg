// Enkel offline-støtte: app-skallet og kartbiblioteket caches,
// karttiles hentes fra nett (cache-first ville fylt lageret).
const CACHE = "broytelogg-v1";
const SKALL = ["./", "./index.html", "./manifest.json", "./icon.svg"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SKALL)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});
self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET") return;
  if (url.hostname === "tile.openstreetmap.org") return; // alltid nett
  // cache-first for eget skall + CDN (leaflet, fonter)
  e.respondWith(
    caches.match(e.request).then(hit => hit || fetch(e.request).then(res => {
      if (res.ok && (url.origin === location.origin || url.hostname === "unpkg.com" || url.hostname.endsWith("gstatic.com") || url.hostname.endsWith("googleapis.com"))) {
        const kopi = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, kopi));
      }
      return res;
    }).catch(() => caches.match("./index.html")))
  );
});
