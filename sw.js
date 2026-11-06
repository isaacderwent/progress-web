// Keeps the web app for use offline. tool/web_service_worker.dart fills in
// this build's version and the files to keep up front when the app is
// built; anything else it loads from its own address is kept the first time
// it is fetched. Everything is served from what is kept, so the app opens
// without a connection. A new build is kept in the background and takes
// over the next time the app is opened.
const version = "4aedeb0f842e4f6d";
const precache = ["./","assets/AssetManifest.bin","assets/AssetManifest.bin.json","assets/FontManifest.json","assets/NOTICES","assets/assets/fonts/Geist-Medium.ttf","assets/assets/fonts/Geist-Regular.ttf","assets/assets/fonts/Geist-SemiBold.ttf","assets/assets/fonts/GeistMono-Medium.ttf","assets/assets/fonts/OFL.txt","assets/assets/icons/LICENSE","assets/assets/icons/Phosphor-Fill.ttf","assets/assets/icons/Phosphor.ttf","assets/assets/sounds/rest_beep_end.wav","assets/assets/sounds/rest_beep_tick.wav","assets/assets/sounds/rest_chime_end.wav","assets/assets/sounds/rest_chime_tick.wav","assets/assets/sounds/rest_knock_end.wav","assets/assets/sounds/rest_knock_tick.wav","assets/fonts/MaterialIcons-Regular.otf","assets/fonts/fallback/Roboto-Regular.ttf","assets/packages/flutter_local_notifications_web/web/notifications_service_worker.js","assets/packages/material_ui/shaders/ink_sparkle.frag","assets/packages/wakelock_plus/assets/no_sleep.js","assets/shaders/ink_sparkle.frag","assets/shaders/stretch_effect.frag","canvaskit/canvaskit.js","canvaskit/canvaskit.wasm","canvaskit/chromium/canvaskit.js","canvaskit/chromium/canvaskit.wasm","drift_worker.js","favicon.png","flutter.js","flutter_bootstrap.js","icons/Icon-192.png","icons/Icon-512.png","icons/Icon-maskable-192.png","icons/Icon-maskable-512.png","icons/apple-touch-icon.png","index.html","main.dart.js","manifest.json","sqlite3.wasm","version.json"];
const kept = `progress-${version}`;

// Flutter loads one of two renderers: Chromium's own in browsers built on
// Chromium, which tell themselves apart by userAgentData, and the full one
// elsewhere. Only that one is kept up front.
const chromium = Boolean(self.navigator.userAgentData);
const wanted = (path) =>
  path.startsWith('canvaskit/chromium/') === chromium ||
  !path.startsWith('canvaskit/');

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(kept).then((cache) =>
      cache.addAll(
        precache
          .filter(wanted)
          .map((path) => new Request(path, { cache: 'no-cache' })),
      ),
    ),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(
        names.filter((name) => name !== kept).map((name) => caches.delete(name)),
      ),
    ),
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (
    request.method !== 'GET' ||
    new URL(request.url).origin !== self.location.origin
  ) {
    return;
  }
  event.respondWith(
    caches.open(kept).then(async (cache) => {
      const hit = await cache.match(request, { ignoreSearch: true });
      if (hit) return hit;
      const response = await fetch(request);
      if (response.ok) cache.put(request, response.clone());
      return response;
    }),
  );
});
