// Perpa Rehber: uygulama dosyalarını telefonda saklar (sürüm 202611070120). Yeni sürüm yüklenince eski kayıt silinir.
const KAYIT = "perpa-rehber-202611070120";
const DOSYALAR = ["./","Perpa%20%C3%9Cr%C3%BCn%20Arama.html","Perpa%20Kat%20Plan%C4%B1.html","manifest.webmanifest","uygulama/simge-192.png","uygulama/simge-512.png","uygulama/simge-180.png","uygulama/simge-64.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(KAYIT).then(c => c.addAll(DOSYALAR)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== KAYIT).map(x => caches.delete(x)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  const u = new URL(e.request.url);
  if (e.request.method !== "GET" || u.origin !== location.origin) return; // firma siteleri ve ürün resimleri: doğrudan internetten
  const kaydet = y => { if (y.ok) { const k = y.clone(); caches.open(KAYIT).then(c => c.put(e.request, k)); } return y; };
  // sayfalar: önce internetten (güncelleme hemen görünsün), internet yoksa kayıttan
  // (cache: "no-cache": tarayıcının sakladığı eski kopya değil, sunucuya "değişti mi" diye sorulur)
  if (e.request.mode === "navigate" || /\.html$|\/$/.test(u.pathname)) { e.respondWith(fetch(e.request.url, { cache: "no-cache", credentials: "same-origin" }).then(kaydet).catch(() => caches.match(e.request, { ignoreSearch: true }))); return; }
  // resimler, ürün listesi: önce kayıttan; yoksa internetten alıp kaydet (yeni sürümde kayıt yenilenir)
  // (urunler.js?v=... sürümlü: sürüm değişince kayıtta bulunmaz, yenisi iner)
  e.respondWith(caches.match(e.request, { ignoreSearch: !/[?&]v=/.test(u.search) }).then(r => r || fetch(e.request).then(kaydet)));
});
