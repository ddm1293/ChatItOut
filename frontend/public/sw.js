// importScripts(
//   'https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js'
// );

// workbox.loadModule('workbox-strategies');
// workbox.loadModule('workbox-routing');

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

// Cache First strategy
// self.addEventListener("fetch", event => {
//   event.respondWith(
//     caches.match(event.request).then(response => {
//       return response || fetch(event.request);
//     }).catch(e => {
//       console.log('no internet');
//     })
//   )
// });

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

// Workbox Revalidate (shows offline page immediately)
// const pageStrategy = new workbox.strategies.StaleWhileRevalidate({
//   cacheName: 'pwa-assets',
//   //  plugins: [
//   //    // Only requests that return with a 200 status are cached
//   //    new workbox.cacheableResponse.Plugin({
//   //       statuses: [200],
//   //     }),
//   //  ],
// });

// Workbox Cache First
//  const staticStrategy  = new workbox.strategies.CacheFirst({
//   cacheName: 'pwa-assets',
// });



/////////////////////////////////////////////////////////////////////////////////////////////////////////////

// WHAT TO CACHE (minimum resources):

// - The main page HTML (your app's start_url).
// - CSS stylesheets needed for the main user interface.
// - Images used in the user interface.
// - JavaScript files required to render the user interface.
// - Data, such as a JSON file, required to render a basic experience.
// - Web fonts.
// - On a multi-page application, other HTML documents that you want to serve fast or while offline.

// If all your app assets will download fast, don't consume a lot of space, and don't need to be updated
// in every request, caching all your assets would be a valid strategy.

//////////////////////////////////
/////////////////////////////////

// WHEN TO CACHE:

// You don't need to cache all the assets at once, you can cache assets many times during the lifecycle of your PWA, such as:
// - On installation of the service worker.
// - After the first page load.
// - When the user navigates to a section or route.
// - When the network is idle.

// One of the most common scenarios is to cache a minimum set of assets when the service worker is installed


/////////////////////////////////
/////////////////////////////////


// CACHE STRATEGIES: best bet is stale while revalidate most likely

///////////////////////////////
///////////////////////////////

// OFFLINE

// Use your service worker to show your own offline messaging, avoiding a generic and confusing browser error.

// can make a separate route for chatbot? most likely a network first or netowrk only route
// - if it throws an error, use the offline fallback stragegy --> setCatchHandler()
// - https://web.dev/learn/pwa/workbox/#offline-fallback 
