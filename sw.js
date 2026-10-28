// Keeps the app working offline. Bump VERSION whenever you upload changed files.
const VERSION = "karteikasten-v1";
const FILES = ["./", "./index.html", "./manifest.webmanifest", "./icons/apple-touch-icon.png", "./icons/icon-192.png", "./icons/icon-512.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

// Network first for the page (so updates arrive), cache first for everything else.
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  if (e.request.mode === "navigate") {
    e.respondWith(fetch(e.request).then(r => {
      const copy = r.clone(); caches.open(VERSION).then(c => c.put("./index.html", copy)); return r;
    }).catch(() => caches.match("./index.html")));
    return;
  }
  e.respondWith(caches.match(e.request).then(hit => hit || fetch(e.request)));
});
