/* 학급관리 앱 서비스 워커 — [공유 → 학급관리] 받기만 함 (화면 파일은 캐시하지 않음: 늘 최신 화면)
 * 공유된 글은 이 폰의 캐시 'cls-share' 에 잠깐 넣고 화면을 #share 로 엶 → 화면(sms.part.js)이 꺼내고 바로 지움.
 * 글은 서버(GitHub·Apps Script)로 가지 않음. */
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'POST' || u.origin !== location.origin || !u.pathname.endsWith('/share')) return;
  e.respondWith((async () => {
    const back = new URL('./#share', self.registration.scope).href;
    try {
      const f = await e.request.formData();
      const d = { title: String(f.get('title') || ''), text: String(f.get('text') || ''), url: String(f.get('url') || ''), t: Date.now() };
      const c = await caches.open('cls-share');
      await c.put(new URL('share-data', self.registration.scope).href, new Response(JSON.stringify(d), { headers: { 'Content-Type': 'application/json' } }));
    } catch (err) {}
    return Response.redirect(back, 303);
  })());
});
