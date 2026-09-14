const CACHE = "fuerza10k-v2";
const ASSETS = ["./", "./index.html", "./manifest.json", "./icon-192.png", "./icon-512.png",
  "./exercises/monster-walk.gif", "./exercises/clamshell.gif", "./exercises/single-leg-bridge.gif",
  "./exercises/side-plank.gif", "./exercises/donkey-kick.gif", "./exercises/side-lying-abduction.gif",
  "./exercises/hip-thrust.gif", "./exercises/front-plank.gif"];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request).then(res => {
    const copy = res.clone();
    if (res.ok && e.request.url.startsWith(self.location.origin)) caches.open(CACHE).then(c => c.put(e.request, copy));
    return res;
  }).catch(() => caches.match("./index.html"))));
});