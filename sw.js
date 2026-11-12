// Offline-støtte. HTML hentes nettverk-først (så oppdateringer når ut),
// cache brukes som reserve uten dekning. CDN-ressurser caches etter bruk.
const CACHE = "broytelogg-v2";
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
  if (url.hostname === "tile.openstreetmap.org") return; // alltid nett, aldri cache

  // Sidenavigasjon og eget skall: nettverk først, cache som reserve
  if (e.request.mode === "navigate" || url.origin === location.origin) {
    e.respondWith(
      fetch(e.request).then(res => {
        if (res.ok) {
          const kopi = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, kopi));
        }
        return res;
      }).catch(() => caches.match(e.request).then(hit => hit || caches.match("./index.html")))
    );
    return;
  }
  // CDN (leaflet, fonter): cache først — innholdet er versjonslåst
  if (url.hostname === "unpkg.com" || url.hostname.endsWith("gstatic.com") || url.hostname.endsWith("googleapis.com")) {
    e.respondWith(
      caches.match(e.request).then(hit => hit || fetch(e.request).then(res => {
        if (res.ok) {
          const kopi = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, kopi));
        }
        return res;
      }))
    );
  }
});
