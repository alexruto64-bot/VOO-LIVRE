// Service worker do Voo Livre: guarda o jogo no aparelho para ele abrir e rodar sem internet.
// - As páginas (o jogo e a tabela de ajustes) vêm da rede quando dá (para pegar a versão nova); sem rede, ou com a rede
//   lenta, vêm da cópia guardada.
// - Os outros arquivos do jogo (modelos, texturas, sons) vêm da cópia guardada; o que ainda não estiver guardado vem
//   da rede e fica guardado. O botão "Baixar tudo" da tela de início guarda de uma vez o que falta.
// - As fontes do Google vêm da cópia guardada e são atualizadas por trás quando há internet.
// Se um arquivo do jogo mudar mantendo o mesmo nome, aumente o número de ARQUIVOS aqui e no index.html
// (CACHE_ARQUIVOS): a cópia antiga é apagada e o arquivo novo é baixado de novo.
const PAGINA = 'voo-pagina-1';
const ARQUIVOS = 'voo-arquivos-1';
const FONTES = 'voo-fontes-1';
const NOSSOS = [PAGINA, ARQUIVOS, FONTES];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(PAGINA).then((c) => c.addAll(['./', 'ajustes.html', 'manifest.webmanifest'])).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys()
    .then((nomes) => Promise.all(nomes.filter((n) => n.startsWith('voo-') && !NOSSOS.includes(n)).map((n) => caches.delete(n))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (req.mode === 'navigate' && url.origin === location.origin) {
    e.respondWith(pagina(req, e));
  } else if (url.origin === location.origin) {
    if (req.headers.has('x-voo-baixar')) return;      // o "Baixar tudo" da página guarda o arquivo ele mesmo
    e.respondWith(arquivo(req, e));
  } else if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    e.respondWith(fonte(req, e));
  }
});

// a página: rede primeiro, mas sem esperar mais de 4 s; a cópia fica sempre com a última versão que chegou
async function pagina(req, e) {
  const cache = await caches.open(PAGINA);
  const chave = new URL(req.url).pathname.endsWith('/ajustes.html') ? 'ajustes.html' : './';
  const rede = fetch(req).then((r) => {
    if (r.ok && !r.redirected) cache.put(chave, r.clone());
    return r;
  });
  e.waitUntil(rede.then(() => {}, () => {}));
  const guardada = cache.match(chave);
  try {
    return await Promise.race([rede, new Promise((_, desistir) => setTimeout(desistir, 4000))]);
  } catch (_) {
    return (await guardada) || rede;
  }
}

// os arquivos: cópia guardada primeiro; o que vier da rede é guardado enquanto chega (sem atrasar o jogo)
async function arquivo(req, e) {
  const guardado = await caches.match(req, { ignoreVary: true });
  if (guardado) return guardado;
  const r = await fetch(req);
  if (r.status === 200 && r.type === 'basic') {
    const copia = r.clone();
    e.waitUntil(caches.open(ARQUIVOS).then((c) => c.put(req, copia)).catch(() => {}));
  }
  return r;
}

async function fonte(req, e) {
  const cache = await caches.open(FONTES);
  const guardada = await cache.match(req, { ignoreVary: true });
  const rede = fetch(req).then((r) => {
    if (r.ok || r.type === 'opaque') cache.put(req, r.clone());
    return r;
  });
  e.waitUntil(rede.then(() => {}, () => {}));
  // uma cópia "opaca" (guardada pelo <link> da página) não serve para um pedido com CORS
  if (guardada && !(guardada.type === 'opaque' && req.mode === 'cors')) return guardada;
  return rede.catch(() => Response.error());
}
