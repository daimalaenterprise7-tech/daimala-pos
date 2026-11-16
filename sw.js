const V='daimala-v3';
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(['./','./index.html','./manifest.json'])).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
 const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
 if(u.origin===location.origin){
  // The app itself: always try the network first so updates show up, fall back to the saved copy offline.
  e.respondWith(fetch(r.url,{cache:'no-cache'}).then(res=>{if(res.ok){const cp=res.clone();caches.open(V).then(c=>c.put(r.mode==='navigate'?'./index.html':r,cp))}return res}).catch(()=>caches.match(r).then(m=>m||caches.match('./index.html'))));return}
 if(u.hostname==='www.gstatic.com'||u.hostname==='cdnjs.cloudflare.com'){
  // Firebase code: use the saved copy, refresh it in the background.
  e.respondWith(caches.match(r).then(m=>{const net=fetch(r).then(res=>{const cp=res.clone();caches.open(V).then(c=>c.put(r,cp));return res}).catch(()=>m);return m||net}));}
});
