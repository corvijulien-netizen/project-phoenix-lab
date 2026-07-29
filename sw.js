const CACHE='phoenix-lab-v4';
const ROOT='/project-phoenix-lab/';
const STATIC=[
  ROOT,
  ROOT+'index.html',
  ROOT+'details.html',
  ROOT+'ideas.html',
  ROOT+'lab.css?v=3',
  ROOT+'lab.js?v=3',
  ROOT+'pwa.js?v=1',
  ROOT+'manifest.webmanifest',
  ROOT+'assets/avatars/phoenix-main.svg',
  ROOT+'assets/avatars/phoenix-activite.svg',
  ROOT+'assets/avatars/phoenix-sommeil.svg',
  ROOT+'assets/avatars/phoenix-nutrition.svg',
  ROOT+'assets/avatars/phoenix-transformation.svg',
  ROOT+'assets/avatars/phoenix-sante.svg',
  ROOT+'assets/avatars/phoenix-journal.svg',
  ROOT+'assets/avatars/phoenix-trophees.svg'
];

self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(STATIC)).then(()=>self.skipWaiting()));
});

self.addEventListener('activate',event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));
});

async function networkFirst(request,fallback){
  const cache=await caches.open(CACHE);
  try{
    const response=await fetch(request);
    if(response&&response.ok)cache.put(request,response.clone());
    return response;
  }catch(error){
    return (await cache.match(request))||(fallback&&await cache.match(fallback))||Response.error();
  }
}

async function staleWhileRevalidate(request){
  const cache=await caches.open(CACHE);
  const cached=await cache.match(request);
  const network=fetch(request).then(response=>{
    if(response&&(response.ok||response.type==='opaque'))cache.put(request,response.clone());
    return response;
  }).catch(()=>null);
  return cached||network||Response.error();
}

self.addEventListener('fetch',event=>{
  const request=event.request;
  if(request.method!=='GET')return;
  const url=new URL(request.url);
  if(request.mode==='navigate'){
    event.respondWith(networkFirst(request,ROOT+'index.html'));
    return;
  }
  if(url.origin===self.location.origin){
    event.respondWith(staleWhileRevalidate(request));
    return;
  }
  if(url.hostname==='raw.githubusercontent.com'||url.hostname.endsWith('github.io')){
    event.respondWith(networkFirst(request));
  }
});
