const CACHE='tcc-continuity-4.5.677-shell-simulation-batch1202-20260828-1';
const CACHE_PREFIX='tcc-continuity-';
const LEGACY_CACHE_PREFIX='tcc-v4.5.677-working-';
const APP_SHELL=[
  "./",
  "./index.html",
  "./styles.css",
  "./styles.css?v=4.5.677-shell-simulation-batch1202-20260828",
  "./app.js",
  "./app.js?v=4.5.677-shell-simulation-batch1202-20260828",
  "./manifest.webmanifest",
  "./manifest.webmanifest?v=4.5.677-shell-simulation-batch1202-20260828",
  "./icon.svg",
  "./icon.svg?v=4.5.677-shell-simulation-batch1202-20260828",
  "./apple-touch-icon.png",
  "./apple-touch-icon.png?v=4.5.677-shell-simulation-batch1202-20260828",
  "./home-hero.jpg",
  "./home-portugal-lock.jpg",
  "./world-map-premium.png",
  "./world-map-vector.svg",
  "./compass-mark.svg",
  "./compass-mark.svg?v=4.5.677-shell-simulation-batch1202-20260828",
  "./launch-ipad-air-2360x1640.png",
  "./launch-ipad-air-2360x1640.png?v=4.5.677-shell-simulation-batch1202-20260828",
  "./launch-ipad-classic-2048x1536.png",
  "./launch-ipad-classic-2048x1536.png?v=4.5.677-shell-simulation-batch1202-20260828",
  "./launch-ipad-102-2160x1620.png",
  "./launch-ipad-102-2160x1620.png?v=4.5.677-shell-simulation-batch1202-20260828",
  "./launch-ipad-pro105-2224x1668.png",
  "./launch-ipad-pro105-2224x1668.png?v=4.5.677-shell-simulation-batch1202-20260828",
  "./launch-ipad-mini6-2266x1488.png",
  "./launch-ipad-mini6-2266x1488.png?v=4.5.677-shell-simulation-batch1202-20260828",
  "./launch-ipad-pro11-2388x1668.png",
  "./launch-ipad-pro11-2388x1668.png?v=4.5.677-shell-simulation-batch1202-20260828",
  "./launch-ipad-pro129-2732x2048.png",
  "./launch-ipad-pro129-2732x2048.png?v=4.5.677-shell-simulation-batch1202-20260828",
  "./launch-ipad-pro11-m4-2420x1668.png",
  "./launch-ipad-pro11-m4-2420x1668.png?v=4.5.677-shell-simulation-batch1202-20260828",
  "./launch-ipad-pro13-m4-2752x2064.png",
  "./launch-ipad-pro13-m4-2752x2064.png?v=4.5.677-shell-simulation-batch1202-20260828",
  "./banner-algeria.jpg",
  "./banner-caribbean.jpg",
  "./banner-croatia.jpg",
  "./banner-cruise-princess.jpg",
  "./banner-motorhome-europe.jpg",
  "./banner-motorhome-usa.jpg",
  "./header-journey-history.jpg",
  "./header-checklist.jpg",
  "./header-vault.jpg",
  "./header-settings.jpg",
  "./banner-cyprus.jpg",
  "./banner-czech-republic.jpg",
  "./banner-egypt.jpg",
  "./banner-france.jpg",
  "./banner-germany.jpg",
  "./banner-greece.jpg",
  "./banner-hungary.jpg",
  "./banner-indonesia.jpg",
  "./banner-ireland.jpg",
  "./banner-italy.jpg",
  "./banner-japan.jpg",
  "./banner-jordan.jpg",
  "./banner-morocco.jpg",
  "./banner-netherlands.jpg",
  "./banner-portugal.jpg",
  "./banner-russia.jpg",
  "./banner-spain.jpg",
  "./banner-thailand.jpg",
  "./banner-turkey.jpg",
  "./banner-united-kingdom.jpg",
  "./banner-united-states.jpg",
  "./banner-vietnam.jpg",
  "./banner-world.jpg",
  "./ui-icon-bank-anz.png",
  "./ui-icon-bank-commonwealth.png",
  "./ui-icon-bank-me.png",
  "./ui-icon-bank-nab.png",
  "./ui-icon-bank-westpac.png",
  "./ui-icon-bank-wise.png",
  "./prestige-budget.png",
  "./prestige-calendar.png",
  "./prestige-checklist.png",
  "./prestige-cruise.png",
  "./prestige-flight.png",
  "./prestige-itinerary.png",
  "./prestige-stay.png",
  "./prestige-train.png",
  "./prestige-vault.png",
  "./streaming-netflix.webp",
  "./streaming-disney.svg",
  "./streaming-prime.svg",
  "./streaming-apple.svg",
  "./streaming-max.svg",
  "./streaming-paramount.svg",
  "./streaming-stan.webp",
  "./streaming-binge.svg",
  "./streaming-kayo.png",
  "./streaming-youtube.svg",
  "./streaming-afl.png",
  "./streaming-nfl.webp",
  "./streaming-abc.png",
  "./streaming-sbs.svg",
  "./streaming-seven.svg",
  "./streaming-nine.png"
];
function scopeInfo(){
  const scope=new URL(self.registration.scope);
  const scopePath=scope.pathname.endsWith('/')?scope.pathname:`${scope.pathname}/`;
  return {scope,scopePath};
}
function isWithinAppScope(url){
  const requestUrl=url instanceof URL?url:new URL(url);
  const {scope,scopePath}=scopeInfo();
  return requestUrl.origin===scope.origin&&requestUrl.pathname.startsWith(scopePath);
}
function isAppEntryNavigation(url){
  const requestUrl=url instanceof URL?url:new URL(url);
  const {scope,scopePath}=scopeInfo();
  return requestUrl.origin===scope.origin&&(requestUrl.pathname===scopePath||requestUrl.pathname===`${scopePath}index.html`);
}
function isRuntimeCoreRequest(url){
  const requestUrl=url instanceof URL?url:new URL(url);
  if(!isWithinAppScope(requestUrl))return false;
  const name=requestUrl.pathname.split('/').pop();
  return name==='app.js'||name==='styles.css'||name==='manifest.webmanifest';
}
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(APP_SHELL)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>(key.startsWith(CACHE_PREFIX)&&key!==CACHE)||(key.startsWith(LEGACY_CACHE_PREFIX)&&key!==CACHE)).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET') return;
  if(event.request.mode==='navigate'){
    event.respondWith(caches.open(CACHE).then(cache=>fetch(event.request,{cache:'no-cache'}).then(response=>{
      if(response&&response.ok&&isAppEntryNavigation(event.request.url))cache.put('./index.html',response.clone());
      return response;
    }).catch(()=>cache.match('./index.html').then(cached=>cached||Response.error()))));
    return;
  }
  if(isRuntimeCoreRequest(event.request.url)){
    event.respondWith(caches.open(CACHE).then(cache=>fetch(event.request,{cache:'no-cache'}).then(response=>{
      if(response&&response.ok)cache.put(event.request,response.clone());
      return response;
    }).catch(()=>cache.match(event.request).then(cached=>cached||Response.error()))));
    return;
  }
  event.respondWith(caches.open(CACHE).then(cache=>cache.match(event.request).then(cached=>cached||fetch(event.request).then(response=>{
    if(response&&response.ok&&isWithinAppScope(event.request.url))cache.put(event.request,response.clone());
    return response;
  }).catch(()=>Response.error()))));
});
