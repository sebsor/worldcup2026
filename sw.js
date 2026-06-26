const CACHE='wc2026-v5';
const STATIC=['/','index.html','manifest.json'];

self.addEventListener('install',function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(STATIC);}));
  self.skipWaiting();
});

self.addEventListener('activate',function(e){
  e.waitUntil(caches.keys().then(function(keys){
    return Promise.all(keys.filter(function(k){return k!==CACHE;}).map(function(k){return caches.delete(k);}));
  }));
  self.clients.claim();
});

self.addEventListener('fetch',function(e){
  var url=e.request.url;
  // Always fetch data and flag images fresh
  if(url.indexOf('raw.githubusercontent.com')!==-1||url.indexOf('flagcdn.com')!==-1){
    e.respondWith(fetch(e.request).catch(function(){return caches.match(e.request);}));
    return;
  }
  e.respondWith(caches.match(e.request).then(function(r){return r||fetch(e.request);}));
});
