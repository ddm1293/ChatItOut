// List of minimum resources needed to load application if offline
const minResources = [
  './manifest.json', 
  './icons/favicon-196.png', 
  './icons/manifest-icon-192.maskable.png', 
  './static/js/main.493fb7fa.js', 
  './static/css/main.8861d999.css', 
  './', 
  './home',
  './static/media/icon_logo.3a74f4aee1465ab95c70.png',
  './static/media/icon_collab.c4a8b73afdfc243b1a7d.png',
  './static/media/icon_welcomepage.9e08abe1dbc964da6846.png'
];

// Minimum resources are cached when page is first loaded
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open("pwa-assets").then(cache => {
      return cache.addAll(minResources);
    }))
});


// Revalidate strategy
self.addEventListener('fetch', event => {
  if (event.request.method === 'POST') { // ignore chatbot requests
    return;
  }
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      const networkFetch = fetch(event.request).then(response => {
        // update the cache with a clone of the network response
        const responseClone = response.clone();
        caches.open('pwa-assets').then(cache => {
          cache.put(event.request, responseClone);
        })
        return response;
      }).catch(function (reason) {
        console.log('ServiceWorker fetch failed: ', reason); // offline
      });
      // prioritize cached response over network
      return cachedResponse || networkFetch;
    })
  )
});
