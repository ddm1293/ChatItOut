importScripts(
    'https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js'
);

// workbox.loadModule('workbox-cacheable-response');
workbox.loadModule('workbox-strategies');
workbox.loadModule('workbox-routing');

const minResources = ['./', './home', './useragreement', './logo192.png', './manifest.json', './favicon.ico', './logo512.png'];
const offlineResources = [];

// Minimum resources are cached when page is first loaded
self.addEventListener("install", event => {
    event.waitUntil(
        caches.open("pwa-assets").then(cache => {
            return cache.addAll(minResources);
    })),
    event.waitUntil(
        caches.open("offline-fallbacks").then(cache => {
            return cache.addAll(offlineResources);
    }))
 });

// Serving from cache first
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    }).catch(e => {
      console.log('no internet') // TODO: offline handling
    })
  )
});

// Revalidate strategy (not working)
// self.addEventListener('fetch', event => {
//   event.respondWith(
//     caches.match(event.request).then(cachedResponse => {
//         const networkFetch = fetch(event.request).then(response => {
//           // update the cache with a clone of the network response
//           const responseClone = response.clone()
//           caches.open('pwa-assets').then(cache => {
//             cache.put(event.request, responseClone)
//           })
//           return response
//         }).catch(function (reason) {
//           console.error('ServiceWorker fetch failed: ', reason) // offline handling
//         })
//         // prioritize cached response over network
//         return cachedResponse || networkFetch
//       }
//     )
//   )
// });

// Workbox 
// const pageStrategy = new workbox.strategies.StaleWhileRevalidate({
//   cacheName: 'pwa-assets',
// //    plugins: [
// //      // Only requests that return with a 200 status are cached
// //      new workbox.cacheableResponse.Plugin({
// //         statuses: [200],
// //       }),
// //    ],
// });

 const staticStrategy  = new workbox.strategies.CacheFirst({
  cacheName: 'pwa-assets',
});

workbox.routing.registerRoute(({url}) => url.pathname.includes('/static/'), staticStrategy);

// workbox.routing.registerRoute(({request}) => request.mode === 'navigate', pageStrategy);

// Offline handling for chatbot
// workbox.routing.setCatchHandler(async (options) => {
//     const destination = options.request.destination;
//     const cache = await self.caches.open('offline-fallbacks');
//     if (destination === 'document') { // depends on type of request to GPT API
//       return (await cache.match('/offline.html')) || Response.error();
//     }
//     console.log("No network, sadge");
//     return Response.error();
//   });



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
