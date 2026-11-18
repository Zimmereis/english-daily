/* English Daily offline cache. Pages and data come from the network first, so new versions show up right away;
   the cached copy is used only when there is no connection. Fonts are cached first (they never change). */
const CACHE = "ed-v1";
self.addEventListener("install", (e) => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then((c) => c.add("/")).catch(() => {}));
});
self.addEventListener("activate", (e) => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k !== CACHE) await caches.delete(k);
    await self.clients.claim();
  })());
});
self.addEventListener("fetch", (e) => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== "GET" || url.origin !== location.origin || url.pathname.startsWith("/api/") || url.pathname.endsWith(".apk")) return;
  const put = (res) => { if (res.ok && !res.redirected) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); } return res; };
  if (url.pathname.startsWith("/fonts/")) {
    e.respondWith(caches.match(req).then((hit) => hit || fetch(req).then(put)));
    return;
  }
  e.respondWith(fetch(req).then(put).catch(async () =>
    (await caches.match(req)) || (req.mode === "navigate" ? await caches.match("/") : Response.error())));
});
