// Perpa Rehber: uygulama dosyalarını telefonda saklar (sürüm 202611062319). Yeni sürüm yüklenince eski kayıt silinir.
const KAYIT = "perpa-rehber-202611062319";
const DOSYALAR = ["./","Perpa%20%C3%9Cr%C3%BCn%20Arama.html","Perpa%20Kat%20Plan%C4%B1.html","manifest.webmanifest","uygulama/simge-192.png","uygulama/simge-512.png","uygulama/simge-180.png","uygulama/simge-64.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(KAYIT).then(c => c.addAll(DOSYALAR)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== KAYIT).map(x => caches.delete(x)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  const u = new URL(e.request.url);
  if (e.request.method !== "GET" || u.origin !== location.origin) return; // firma siteleri ve ürün resimleri: doğrudan internetten
  // önce kayıttan; yoksa internetten alıp kaydet (açılan kat resimleri, ürün listesi)
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then(r => r || fetch(e.request).then(y => { if (y.ok) { const k = y.clone(); caches.open(KAYIT).then(c => c.put(e.request, k)); } return y; })));
});
