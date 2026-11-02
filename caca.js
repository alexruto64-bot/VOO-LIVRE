// caca.js — o caça do Voo Livre: bimotor de asas móveis construído peça por peça,
// com as formas do Grumman F-14 Tomcat. Frente do avião = eixo -Z. Medidas em metros,
// no tamanho real (19,1 m de comprimento). Expõe window.VooLivre.criarCaca().
(function () {
  'use strict';
  const T = window.THREE;
  if (!T) { console.error('caca.js: carregue o three.js antes'); return; }

  const NARIZ = -9.55;                       // z da ponta do nariz
  const z = (s) => NARIZ + s;                // estação s (metros desde o nariz) -> z
  const rad = (g) => g * Math.PI / 180;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

  // Números aleatórios com semente: os detalhes saem sempre iguais.
  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  let rand = mulberry32(14);
  const entre = (a, b) => a + (b - a) * rand();

  // ---------- geometria: anéis e "loft" (pele esticada entre anéis) ----------
  function centro(anel) {
    const c = new T.Vector3();
    for (const p of anel) c.add(p);
    return c.multiplyScalar(1 / anel.length);
  }
  function perimetro(anel) {
    let l = 0;
    for (let i = 0; i < anel.length; i++) l += anel[i].distanceTo(anel[(i + 1) % anel.length]);
    return l;
  }

  // Superelipse: n=2 é uma elipse, n grande vira um retângulo de cantos redondos.
  // Começa no lado direito (+x) e sobe; op.lado=-1 espelha em x mantendo essa ordem.
  function anel(zc, w, hT, hB, yc, n, N, op) {
    op = op || {};
    const xc = op.xc || 0, lado = op.lado || 1;
    const pts = [];
    for (let i = 0; i < N; i++) {
      const t = (i / N) * Math.PI * 2;
      const c = Math.cos(t), s = Math.sin(t);
      const sx = Math.sign(c) * Math.pow(Math.abs(c), 2 / n) * w;
      const sy = Math.sign(s) * Math.pow(Math.abs(s), 2 / n) * (s >= 0 ? hT : hB);
      const p = new T.Vector3(lado * sx + xc, sy + yc, zc);
      if (op.ajuste) op.ajuste(p, t);
      pts.push(p);
    }
    return pts;
  }
  const aneisDe = (lista, N, op) =>
    lista.map(([s, w, hT, hB, yc, n, extra]) => anel(z(s), w, hT, hB, yc, n, N, Object.assign({}, op, extra || {})));

  // Perfil de asa: bordo de ataque redondo, bordo de fuga afiado, mais grosso a 30% da corda.
  function anelAsa(x, zBA, corda, esp, yc, N) {
    const pts = [];
    for (let i = 0; i < N; i++) {
      const t = (i / N) * Math.PI * 2;
      const u = (1 - Math.cos(t)) / 2;
      const perfil = Math.pow(1 - u, 0.7) * (0.45 + 0.55 * Math.sin(Math.PI * Math.min(1, u * 1.6)));
      pts.push(new T.Vector3(x, yc + Math.sin(t) * esp * 0.5 * perfil, zBA + u * corda));
    }
    return pts;
  }

  // op.cor(c, p, f): cor por vértice. op.normalizado: v vai de 0 a 1 ao longo da peça
  // (para texturas com adesivos); senão u e v repetem a cada 4 m (linhas de painel).
  function loft(aneis, op) {
    op = op || {};
    const n = aneis[0].length, m = aneis.length, st = n + 1;
    const centros = aneis.map(centro);
    const dist = [0];
    for (let j = 1; j < m; j++) dist.push(dist[j - 1] + centros[j].distanceTo(centros[j - 1]));
    const total = dist[m - 1] || 1;
    const uEsc = op.normalizado ? 1 : perimetro(aneis[Math.floor(m / 2)]) * 0.25;
    const vEsc = op.normalizado ? 1 / total : 0.25;
    const pos = [], uv = [], cor = [], idx = [];
    const c = new T.Color();
    for (let j = 0; j < m; j++) {
      for (let i = 0; i <= n; i++) {
        const p = aneis[j][i % n];
        pos.push(p.x, p.y, p.z);
        uv.push((i / n) * uEsc, dist[j] * vEsc);
        if (op.cor) { op.cor(c, p, j / (m - 1)); cor.push(c.r, c.g, c.b); }
      }
    }
    for (let j = 0; j < m - 1; j++) {
      for (let i = 0; i < n; i++) {
        const a = j * st + i, b = a + 1, c2 = a + st, d = c2 + 1;
        idx.push(a, c2, b, b, c2, d);
      }
    }
    // Orientação: a normal de uma face do meio tem de apontar para fora do anel.
    const jm = Math.floor((m - 1) / 2);
    const pa = aneis[jm][0], pb = aneis[jm][1 % n], pc = aneis[jm + 1][0];
    const normal = new T.Vector3().subVectors(pc, pa).cross(new T.Vector3().subVectors(pb, pa));
    if (normal.dot(new T.Vector3().subVectors(pa, centros[jm])) < 0) {
      for (let k = 0; k < idx.length; k += 3) { const t = idx[k + 1]; idx[k + 1] = idx[k + 2]; idx[k + 2] = t; }
    }
    const g = new T.BufferGeometry();
    g.setAttribute('position', new T.Float32BufferAttribute(pos, 3));
    g.setAttribute('uv', new T.Float32BufferAttribute(uv, 2));
    if (op.cor) g.setAttribute('color', new T.Float32BufferAttribute(cor, 3));
    g.setIndex(idx);
    g.computeVertexNormals();
    // Emenda do anel: o primeiro e o último vértice ficam com a mesma normal.
    const na = g.attributes.normal;
    for (let j = 0; j < m; j++) {
      const a = j * st, b = a + n;
      const x = na.getX(a) + na.getX(b), y = na.getY(a) + na.getY(b), zz = na.getZ(a) + na.getZ(b);
      const l = Math.hypot(x, y, zz) || 1;
      na.setXYZ(a, x / l, y / l, zz / l);
      na.setXYZ(b, x / l, y / l, zz / l);
    }
    return g;
  }

  // Tampa (leque) fechando um anel; `fora` diz para que lado a face deve olhar.
  function tampa(anel, fora, cor) {
    const c = centro(anel);
    const n = anel.length;
    const pos = [c.x, c.y, c.z], uv = [0.5, 0.5], idx = [], cores = [];
    for (const p of anel) { pos.push(p.x, p.y, p.z); uv.push(0.5, 0.5); }
    for (let i = 0; i < n; i++) idx.push(0, 1 + i, 1 + ((i + 1) % n));
    const nrm = new T.Vector3().subVectors(anel[0], c).cross(new T.Vector3().subVectors(anel[1], c));
    if (nrm.dot(fora) < 0) for (let k = 0; k < idx.length; k += 3) { const t = idx[k + 1]; idx[k + 1] = idx[k + 2]; idx[k + 2] = t; }
    const g = new T.BufferGeometry();
    g.setAttribute('position', new T.Float32BufferAttribute(pos, 3));
    g.setAttribute('uv', new T.Float32BufferAttribute(uv, 2));
    if (cor) {
      const k = new T.Color();
      cor(k, c, 1); cores.push(k.r, k.g, k.b);
      for (const p of anel) { cor(k, p, 1); cores.push(k.r, k.g, k.b); }
      g.setAttribute('color', new T.Float32BufferAttribute(cores, 3));
    }
    g.setIndex(idx);
    g.computeVertexNormals();
    return g;
  }

  // Interpolação linear em tabelas (estação -> valor).
  function interpolador(xs, ys) {
    return (x) => {
      if (x <= xs[0]) return ys[0];
      for (let i = 1; i < xs.length; i++) {
        if (x <= xs[i]) { const f = (x - xs[i - 1]) / (xs[i] - xs[i - 1]); return ys[i - 1] + (ys[i] - ys[i - 1]) * f; }
      }
      return ys[ys.length - 1];
    };
  }
  // Para um conjunto de anéis: v(s) normalizado e perímetro(s), usados para posicionar adesivos.
  function mapasDe(secoes, aneis) {
    const ss = secoes.map((s) => s[0]);
    const cs = aneis.map(centro);
    const dist = [0];
    for (let j = 1; j < cs.length; j++) dist.push(dist[j - 1] + cs[j].distanceTo(cs[j - 1]));
    const total = dist[dist.length - 1];
    return { v: interpolador(ss, dist.map((d) => d / total)), perim: interpolador(ss, aneis.map(perimetro)), total };
  }

  // Chapa extrudada a partir de um contorno plano (asa fixa, empenagens, luva).
  function chapa(pontos, espessura, bisel) {
    const forma = new T.Shape();
    pontos.forEach(([a, b], i) => (i ? forma.lineTo(a, b) : forma.moveTo(a, b)));
    forma.closePath();
    return new T.ExtrudeGeometry(forma, {
      depth: espessura, bevelEnabled: true, bevelThickness: bisel, bevelSize: bisel, bevelSegments: 2, curveSegments: 4,
    });
  }
  // Contorno em (x, s), espessura em y, topo em yTopo.
  function chapaPlana(pontos, espessura, bisel, yTopo) {
    const g = chapa(pontos, espessura, bisel);
    g.rotateX(Math.PI / 2);                   // (x, s, e) -> (x, -e, s)
    g.translate(0, yTopo - bisel, NARIZ);
    return g;
  }
  // Contorno em (s, y), espessura em x, centrada em x=0.
  function chapaLateral(pontos, espessura, bisel) {
    const g = chapa(pontos, espessura, bisel);
    g.rotateY(-Math.PI / 2);                  // (s, y, e) -> (-e, y, s)
    g.translate(espessura / 2, 0, NARIZ);
    return g;
  }

  // ---------- texturas ----------
  function texturaCanvas(w, h, desenhar, op) {
    op = op || {};
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    desenhar(c.getContext('2d'), w, h);
    const t = new T.CanvasTexture(c);
    t.wrapS = t.wrapT = op.repetir ? T.RepeatWrapping : T.ClampToEdgeWrapping;
    t.flipY = !!op.flipY;
    t.anisotropy = 8;
    return t;
  }

  // Linhas de painel, rebites e sujeira leve sobre um cinza quase branco;
  // a cor de verdade vem das cores por vértice.
  function pintarPaineis(c, w, h, densidade) {
    c.fillStyle = '#e3e6e9';
    c.fillRect(0, 0, w, h);
    c.lineWidth = 1.2;
    c.strokeStyle = 'rgba(28, 34, 44, 0.30)';
    for (let i = 0; i < densidade; i++) {
      const y = Math.round(entre(0, h)) + 0.5;
      c.beginPath(); c.moveTo(0, y); c.lineTo(w, y); c.stroke();
    }
    for (let i = 0; i < densidade * 1.5; i++) {
      const x = Math.round(entre(0, w)) + 0.5, y0 = entre(0, h);
      c.beginPath(); c.moveTo(x, y0); c.lineTo(x, Math.min(h, y0 + entre(h * 0.04, h * 0.3))); c.stroke();
    }
    c.strokeStyle = 'rgba(28, 34, 44, 0.22)';
    for (let i = 0; i < densidade; i++) {
      c.strokeRect(Math.round(entre(0, w)) + 0.5, Math.round(entre(0, h)) + 0.5, entre(w * 0.02, w * 0.09), entre(h * 0.01, h * 0.05));
    }
    c.fillStyle = 'rgba(28, 34, 44, 0.12)';
    for (let i = 0; i < densidade * 60; i++) c.fillRect(entre(0, w), entre(0, h), 1.5, 1.5);
    c.fillStyle = 'rgba(0, 0, 0, 0.045)';
    for (let i = 0; i < densidade * 2; i++) {
      c.beginPath(); c.ellipse(entre(0, w), entre(0, h), entre(10, 70), entre(4, 22), entre(0, 3), 0, Math.PI * 2); c.fill();
    }
  }

  // Prepara o canvas para desenhar um adesivo em centímetros sobre um loft, visto de fora.
  // (cu, cv) é o centro em pixels; pxU/pxV são pixels por metro; upU diz se "para cima"
  // é +u (1) ou -u (-1); direitaV diz se "para a direita" de quem olha é +v (1) ou -v (-1).
  function transformar(c, cu, cv, pxU, pxV, upU, direitaV) {
    c.setTransform(0, direitaV * pxV / 100, -upU * pxU / 100, 0, cu, cv);
  }

  // Insígnia do Voo Livre: anel ciano, disco branco e estrela vermelha. Medidas em cm.
  function insignia(c, raio) {
    c.beginPath(); c.arc(0, 0, raio, 0, Math.PI * 2); c.fillStyle = '#74e0ff'; c.fill();
    c.beginPath(); c.arc(0, 0, raio * 0.72, 0, Math.PI * 2); c.fillStyle = '#f4f6f8'; c.fill();
    c.beginPath();
    for (let i = 0; i < 10; i++) {
      const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? raio * 0.22 : raio * 0.55;
      c.lineTo(Math.cos(a) * r, Math.sin(a) * r);
    }
    c.closePath(); c.fillStyle = '#c8352b'; c.fill();
  }

  const FONTE = '"Arial Narrow", "Liberation Sans Narrow", Arial, Helvetica, sans-serif';

  // Arte das derivas: boné preto com raio amarelo, código VL e número.
  // dir=1: nariz à direita do canvas; dir=-1: nariz à esquerda. 200 px por metro.
  // Cobre s de 15,0 a 18,5 e y de 0,25 a 3,05 (relativo à base da deriva).
  function arteDeriva(dir) {
    return texturaCanvas(700, 560, (c, W, H) => {
      const X = (s) => (dir > 0 ? (18.5 - s) : (s - 15.0)) * 200;
      const Y = (y) => (3.05 - y) * 200;
      const sBA = (y) => 15.0 + (y - 0.25) / 2.7 * 2.3;   // bordo de ataque inclinado
      c.clearRect(0, 0, W, H);
      const poligono = (pts) => { c.beginPath(); pts.forEach(([s, y], i) => (i ? c.lineTo(X(s), Y(y)) : c.moveTo(X(s), Y(y)))); c.closePath(); c.fill(); };
      c.fillStyle = '#15171b';
      poligono([[sBA(1.95), 1.95], [17.3, 2.95], [18.45, 2.95], [18.45, 1.95]]);
      c.fillStyle = '#ffb547';
      poligono([[sBA(1.86), 1.86], [sBA(1.95), 1.95], [18.45, 1.95], [18.45, 1.86]]);
      poligono([[17.0, 2.85], [17.65, 2.85], [17.4, 2.5], [17.95, 2.5], [17.25, 2.05], [17.5, 2.42], [17.05, 2.42]]);
      c.fillStyle = '#1f2328';
      c.textAlign = 'center'; c.textBaseline = 'middle';
      c.font = 'bold 200px ' + FONTE;
      c.fillText('VL', X(17.3), Y(1.1));
      c.font = 'bold 58px ' + FONTE;
      c.fillText('101', X(18.0), Y(0.5));
    }, { flipY: true });
  }

  window.VooLivre = window.VooLivre || {};
  window.VooLivre._interno = { T, z, rad, clamp, entre, anel, aneisDe, anelAsa, loft, tampa, mapasDe, chapaPlana, chapaLateral,
    texturaCanvas, pintarPaineis, transformar, insignia, arteDeriva, FONTE, NARIZ, reiniciarSemente: () => { rand = mulberry32(14); } };
})();

// ---------- o caça ----------
(function () {
  'use strict';
  const I = window.VooLivre._interno;
  const { T, z, rad, clamp, entre, aneisDe, anelAsa, loft, tampa, mapasDe, chapaPlana, chapaLateral,
    texturaCanvas, pintarPaineis, transformar, insignia, arteDeriva, FONTE, NARIZ } = I;

  // Cores da pele: cinza-gaivota em cima, mais claro embaixo; radome um pouco mais escuro.
  function corPele(c, p) {
    const t = clamp((p.y + 0.6) / 0.8, 0, 1);
    c.setRGB(0.74 - 0.20 * t, 0.77 - 0.19 * t, 0.81 - 0.17 * t);
    if (p.z < z(1.85)) c.lerp(new T.Color(0.52, 0.53, 0.55), clamp((z(1.85) - p.z) / 0.5, 0, 1));
  }
  function corAsa(c, p) {
    const t = clamp(0.5 + p.y * 6, 0, 1);
    c.setRGB(0.74 - 0.20 * t, 0.77 - 0.19 * t, 0.81 - 0.17 * t);
  }

  function criarCaca() {
    I.reiniciarSemente();
    const g = new T.Group();
    const partes = { petalas: [], plumas: [], luzesNav: [], faroisForma: [], beacons: [] };
    const malha = (geo, mat, pai) => { const m = new T.Mesh(geo, mat); m.castShadow = m.receiveShadow = true; (pai || g).add(m); return m; };

    // --- materiais
    const texPaineis = texturaCanvas(1024, 1024, (c, w, h) => pintarPaineis(c, w, h, 16), { repetir: true });
    const pele = (mapa, extra) => new T.MeshStandardMaterial(Object.assign({ map: mapa, vertexColors: true, metalness: 0.18, roughness: 0.55, envMapIntensity: 0.7 }, extra || {}));
    const matPele = pele(texPaineis);
    const matChapa = new T.MeshStandardMaterial({ map: texPaineis, color: 0x878e96, metalness: 0.18, roughness: 0.55, envMapIntensity: 0.7 });
    const matEscuro = new T.MeshStandardMaterial({ color: 0x1a1e24, metalness: 0.3, roughness: 0.75 });
    const matDuto = new T.MeshStandardMaterial({ color: 0x0e1217, metalness: 0.1, roughness: 0.95 });
    const matMetal = new T.MeshStandardMaterial({ color: 0x4b4f55, metalness: 0.85, roughness: 0.42 });
    const matMetalQuente = new T.MeshStandardMaterial({ color: 0x5a4a44, metalness: 0.8, roughness: 0.5, emissive: 0x000000 });
    const matVidro = new T.MeshStandardMaterial({ color: 0x8fc4e6, metalness: 0.25, roughness: 0.04, transparent: true, opacity: 0.34, envMapIntensity: 1.4, depthWrite: false });
    const matCabine = new T.MeshStandardMaterial({ color: 0x23272d, metalness: 0.2, roughness: 0.85 });
    const matAssento = new T.MeshStandardMaterial({ color: 0x33373d, metalness: 0.1, roughness: 0.9 });
    const matMacacao = new T.MeshStandardMaterial({ color: 0x4f5a3c, roughness: 0.95 });
    const matCapacete = new T.MeshStandardMaterial({ color: 0xe9e9e3, metalness: 0.1, roughness: 0.35 });
    const matVisor = new T.MeshStandardMaterial({ color: 0x151a22, metalness: 0.6, roughness: 0.15 });

    // --- fuselagem dianteira e dorso (até se fundir ao corpo central)
    const secFus = [
      [0.0, 0.02, 0.02, 0.02, -0.17, 2],
      [0.5, 0.25, 0.25, 0.25, -0.14, 2],
      [1.2, 0.45, 0.45, 0.45, -0.09, 2.1],
      [2.0, 0.59, 0.59, 0.57, -0.04, 2.2],
      [2.8, 0.67, 0.65, 0.63, 0.0, 2.3],
      [3.6, 0.73, 0.70, 0.69, 0.04, 2.4],
      [4.6, 0.79, 0.68, 0.77, 0.06, 2.5],
      [5.6, 0.83, 0.66, 0.81, 0.06, 2.6],
      [6.8, 0.87, 0.62, 0.80, 0.06, 2.8],
      [8.0, 0.94, 0.58, 0.70, 0.04, 3.0],
      [9.5, 1.04, 0.52, 0.56, 0.02, 3.5],
      [11.5, 1.14, 0.46, 0.44, 0.0, 4],
      [13.4, 1.18, 0.40, 0.38, 0.0, 4],
    ];
    const aneisFus = aneisDe(secFus, 44);
    const mFus = mapasDe(secFus, aneisFus);
    const texFus = texturaCanvas(1024, 2048, (c, W, H) => {
      pintarPaineis(c, W, H, 26);
      // radome e painel antirreflexo na frente do para-brisa
      c.fillStyle = 'rgba(40, 44, 50, 0.14)'; c.fillRect(0, 0, W, mFus.v(1.85) * H);
      c.fillStyle = '#2a2d33'; c.fillRect(0.185 * W, mFus.v(2.5) * H, 0.13 * W, (mFus.v(3.55) - mFus.v(2.5)) * H);
      // portas do trem do nariz (embaixo)
      c.strokeStyle = 'rgba(28, 34, 44, 0.45)'; c.lineWidth = 2;
      c.strokeRect(0.72 * W, mFus.v(1.9) * H, 0.06 * W, (mFus.v(4.1) - mFus.v(1.9)) * H);
      // número 101 nos dois lados do nariz
      for (const lado of [1, -1]) {
        const s = 2.45, t = Math.atan2(0.14, 0.64);
        const u = lado > 0 ? t / (2 * Math.PI) : 0.5 - t / (2 * Math.PI);
        const pxU = W / mFus.perim(s), pxV = H * (mFus.v(s + 0.5) - mFus.v(s - 0.5));
        transformar(c, u * W, mFus.v(s) * H, pxU, pxV, lado, -lado);
        c.fillStyle = '#23262b'; c.textAlign = 'center'; c.textBaseline = 'middle';
        c.font = 'bold 44px ' + FONTE; c.fillText('101', 0, 0);
        // seta amarela de resgate junto à cabine
        const t2 = Math.atan2(0.56, 0.46);
        const u2 = lado > 0 ? t2 / (2 * Math.PI) : 0.5 - t2 / (2 * Math.PI);
        transformar(c, u2 * W, mFus.v(4.1) * H, W / mFus.perim(4.1), H * (mFus.v(4.6) - mFus.v(3.6)), lado, -lado);
        c.fillStyle = '#ffb547'; c.beginPath(); c.moveTo(-8, -6); c.lineTo(8, 0); c.lineTo(-8, 6); c.closePath(); c.fill();
        c.setTransform(1, 0, 0, 1, 0, 0);
      }
      // porta do canhão, lado esquerdo
      c.fillStyle = '#3a3f46';
      c.fillRect((0.5 + 0.012) * W, mFus.v(2.95) * H, 0.035 * W, (mFus.v(3.7) - mFus.v(2.95)) * H);
      c.fillStyle = '#0d0f12'; c.beginPath(); c.arc((0.5 + 0.03) * W, mFus.v(3.02) * H, 8, 0, Math.PI * 2); c.fill();
    });
    const matFus = pele(texFus);
    malha(loft(aneisFus, { cor: corPele, normalizado: true }), matFus);
    malha(tampa(aneisFus[aneisFus.length - 1], new T.Vector3(0, 0, 1), corPele), matPele);

    // --- corpo central ("panqueca") entre os motores, afinando na cauda
    const secPanq = [
      [6.3, 0.95, 0.38, 0.36, 0.03, 5],
      [7.5, 1.40, 0.41, 0.40, 0.0, 6],
      [10.5, 1.45, 0.41, 0.40, 0.0, 6],
      [13.5, 1.45, 0.39, 0.36, 0.0, 6],
      [16.0, 1.45, 0.31, 0.24, 0.03, 5],
      [17.6, 1.30, 0.18, 0.12, 0.07, 4],
      [18.6, 0.70, 0.06, 0.04, 0.10, 3],
      [18.9, 0.25, 0.02, 0.02, 0.11, 2],
    ];
    const aneisPanq = aneisDe(secPanq, 40);
    malha(loft(aneisPanq, { cor: corPele }), matPele);
    malha(tampa(aneisPanq[0], new T.Vector3(0, 0, -1), corPele), matPele);

    window.VooLivre._montar = { g, partes, malha, mat: { pele, matPele, matChapa, matEscuro, matDuto, matMetal, matMetalQuente, matVidro, matCabine, matAssento, matMacacao, matCapacete, matVisor, texPaineis }, corPele, corAsa };
    return montarResto();
  }

  let montarResto = () => { throw new Error('caca.js incompleto'); };
  window.VooLivre._definirResto = (fn) => { montarResto = fn; };
  window.VooLivre.criarCaca = criarCaca;
})();

// ---------- motores: naceles, entradas de ar, bocais e pós-combustão ----------
(function () {
  'use strict';
  const I = window.VooLivre._interno;
  const { T, z, rad, clamp, aneisDe, anel, loft, tampa, mapasDe, texturaCanvas, pintarPaineis, transformar, insignia, FONTE } = I;

  function motores() {
    const M = window.VooLivre._montar;
    const { g, partes, malha, mat, corPele } = M;

    // Lábio inclinado: o topo da entrada de ar fica mais à frente que a base.
    const rake = (p) => { p.z += 0.5 * (0.5 - (p.y + 0.36) / 1.6); };
    const secNac = [
      [5.66, 0.46, 0.76, 0.76, -0.36, 8, { ajuste: rake }],
      [5.60, 0.50, 0.80, 0.80, -0.36, 8, { ajuste: rake }],
      [6.20, 0.56, 0.80, 0.80, -0.36, 7],
      [7.50, 0.62, 0.78, 0.78, -0.34, 5],
      [9.50, 0.64, 0.76, 0.75, -0.33, 4],
      [12.0, 0.64, 0.72, 0.70, -0.31, 3.2],
      [14.5, 0.62, 0.66, 0.64, -0.29, 2.6],
      [16.5, 0.58, 0.60, 0.58, -0.27, 2.2],
      [18.3, 0.52, 0.52, 0.52, -0.25, 2],
    ];
    const secDuto = [
      [5.68, 0.45, 0.75, 0.75, -0.36, 8, { ajuste: rake }],
      [6.3, 0.43, 0.70, 0.70, -0.36, 6],
      [7.8, 0.34, 0.50, 0.50, -0.34, 4],
      [8.3, 0.04, 0.04, 0.04, -0.34, 2],
    ];

    for (const lado of [1, -1]) {
      const xc = lado * 1.35;
      const aneis = aneisDe(secNac, 36, { xc, lado });
      const m = mapasDe(secNac, aneis);
      const tex = texturaCanvas(1024, 2048, (c, W, H) => {
        pintarPaineis(c, W, H, 24);
        // sombra interna do lábio
        const gr = c.createLinearGradient(0, 0, 0, m.v(6.3) * H);
        gr.addColorStop(0, 'rgba(0,0,0,0.35)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
        c.fillStyle = gr; c.fillRect(0, 0, W, m.v(6.3) * H);
        // portas do trem principal, embaixo
        c.strokeStyle = 'rgba(28, 34, 44, 0.45)'; c.lineWidth = 2;
        c.strokeRect(0.70 * W, m.v(9.0) * H, 0.1 * W, (m.v(12.6) - m.v(9.0)) * H);
        // insígnia e nome no lado de fora
        const u = Math.atan2(0.12, 0.64) / (2 * Math.PI);
        const pxU = (s) => W / m.perim(s), pxV = (s) => H * (m.v(s + 0.5) - m.v(s - 0.5));
        transformar(c, u * W, m.v(9.3) * H, pxU(9.3), pxV(9.3), 1, -lado);
        insignia(c, 40);
        transformar(c, u * W, m.v(13.8) * H, pxU(13.8), pxV(13.8), 1, -lado);
        c.fillStyle = '#2d3136'; c.textAlign = 'center'; c.textBaseline = 'middle';
        c.font = 'bold 30px ' + FONTE; c.fillText('VOO LIVRE', 0, 0);
        c.setTransform(1, 0, 0, 1, 0, 0);
        // faixas de aviso do motor (vermelhas) perto do lábio
        c.fillStyle = 'rgba(200, 53, 43, 0.85)';
        c.fillRect(0, m.v(6.05) * H, W, 3);
      });
      malha(loft(aneis, { cor: corPele, normalizado: true }), mat.pele(tex));
      // duto escuro por dentro e rampa inclinada no lado de dentro
      const aneisDuto = aneisDe(secDuto, 36, { xc, lado });
      malha(loft(aneisDuto), mat.matDuto).castShadow = false;
      const rampa = malha(new T.BoxGeometry(0.03, 1.45, 1.7), mat.matEscuro);
      rampa.position.set(xc - lado * 0.36, -0.36, z(6.75));
      rampa.rotation.y = lado * rad(9);
      // placa separadora entre a entrada e a fuselagem
      const placa = malha(new T.BoxGeometry(0.03, 1.55, 1.2), mat.matChapa);
      placa.position.set(xc - lado * 0.5, -0.36, z(6.1));

      // bocal: corpo convergente, duto interno com turbina e pétalas móveis
      const aneisBocal = aneisDe([[18.25, 0.52, 0.52, 0.52, -0.25, 2], [18.75, 0.46, 0.46, 0.46, -0.25, 2]], 28, { xc, lado });
      malha(loft(aneisBocal), mat.matMetalQuente);
      const aneisInt = aneisDe([[18.76, 0.43, 0.43, 0.43, -0.25, 2], [18.3, 0.40, 0.40, 0.40, -0.25, 2]], 28, { xc, lado });
      malha(loft(aneisInt), mat.matDuto).castShadow = false;
      const turbina = malha(tampa(aneisInt[aneisInt.length - 1], new T.Vector3(0, 0, 1)), new T.MeshStandardMaterial({ color: 0x2a2d33, metalness: 0.7, roughness: 0.6, emissive: 0xff6a1a, emissiveIntensity: 0 }));
      turbina.castShadow = false;
      partes.plumas.push({ turbina });
      const centroBocal = new T.Vector3(xc, -0.25, z(18.72));
      const petalas = [];
      for (let i = 0; i < 14; i++) {
        const pivoA = new T.Object3D();
        pivoA.position.copy(centroBocal);
        pivoA.rotation.z = (i / 14) * Math.PI * 2;
        const pivoB = new T.Object3D();
        pivoB.position.set(0.44, 0, 0);
        const petala = malha(new T.BoxGeometry(0.025, 0.2, 0.5), mat.matMetal, pivoB);
        petala.position.z = 0.25;
        pivoA.add(pivoB); g.add(pivoA);
        petalas.push(pivoB);
      }
      partes.petalas.push(petalas);

      // pós-combustão: cone de chama com gradiente, núcleo e diamantes de choque
      const texChama = texturaCanvas(16, 256, (c, w, h) => {
        const gr = c.createLinearGradient(0, 0, 0, h);
        gr.addColorStop(0, '#9fd8ff'); gr.addColorStop(0.1, '#ffb060'); gr.addColorStop(0.3, '#ff7a1a'); gr.addColorStop(0.65, '#7a2606'); gr.addColorStop(1, '#000000');
        c.fillStyle = gr; c.fillRect(0, 0, w, h);
      });
      const geoChama = new T.ConeGeometry(0.4, 1, 20, 1, true);
      geoChama.rotateX(Math.PI / 2); geoChama.translate(0, 0, 0.5);
      const matChama = new T.MeshBasicMaterial({ map: texChama, transparent: true, blending: T.AdditiveBlending, depthWrite: false, side: T.DoubleSide, opacity: 0.7 });
      const pluma = new T.Group();
      pluma.position.set(xc, -0.25, z(19.1));
      const chama = new T.Mesh(geoChama, matChama);
      const nucleo = new T.Mesh(geoChama, new T.MeshBasicMaterial({ color: 0x9fd6ff, transparent: true, blending: T.AdditiveBlending, depthWrite: false, opacity: 0.3 }));
      nucleo.scale.set(0.45, 0.45, 0.55);
      pluma.add(chama, nucleo);
      const diamantes = [];
      for (let k = 0; k < 4; k++) {
        const d = new T.Mesh(new T.OctahedronGeometry(0.2), new T.MeshBasicMaterial({ color: 0xcfe9ff, transparent: true, blending: T.AdditiveBlending, depthWrite: false, opacity: 0.45 }));
        d.scale.set(1, 1, 2.4);
        d.position.z = 0.8 + k * 0.95;
        pluma.add(d); diamantes.push(d);
      }
      pluma.visible = false;
      g.add(pluma);
      partes.plumas[partes.plumas.length - 1].pluma = pluma;
      partes.plumas[partes.plumas.length - 1].diamantes = diamantes;
      partes.plumas[partes.plumas.length - 1].chama = chama;
    }
  }
  window.VooLivre._motores = motores;
})();

// ---------- asas móveis, luvas, derivas, estabilizadores e nadadeiras ----------
(function () {
  'use strict';
  const I = window.VooLivre._interno;
  const { T, z, rad, anelAsa, loft, chapaPlana, chapaLateral, arteDeriva, texturaCanvas } = I;

  function superficies() {
    const M = window.VooLivre._montar;
    const { g, partes, malha, mat, corAsa } = M;

    // Luvas fixas: a plataforma triangular na frente do pivô, com o topo rente ao dorso.
    const decWalk = texturaCanvas(64, 256, (c, w, h) => {
      c.clearRect(0, 0, w, h); c.fillStyle = 'rgba(40, 44, 50, 0.35)'; c.fillRect(6, 4, w - 12, h - 8);
    }, { flipY: true });
    const matWalk = new T.MeshBasicMaterial({ map: decWalk, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 });
    for (const lado of [1, -1]) {
      const luva = malha(chapaPlana([[1.1 * lado, 6.0], [2.05 * lado, 5.75], [2.95 * lado, 8.45], [2.95 * lado, 9.6], [1.1 * lado, 10.4]], 0.3, 0.05, 0.47), mat.matChapa);
      luva.name = 'luva';
      const walk = new T.Mesh(new T.PlaneGeometry(0.5, 3.6), matWalk);
      walk.name = 'walk';
      walk.rotation.x = -Math.PI / 2;
      walk.position.set(lado * 1.55, 0.485, z(8.1));
      g.add(walk);
    }

    // Asas móveis: pivô na luva; o enflechamento gira o grupo inteiro.
    const N = 28, envergadura = 6.5;
    const luzPonta = (cor) => new T.Mesh(new T.SphereGeometry(0.06, 10, 8), new T.MeshBasicMaterial({ color: cor }));
    for (const lado of [1, -1]) {
      const secs = [];
      for (let i = 0; i <= 12; i++) {
        const f = i / 12, x = f * envergadura;
        secs.push(anelAsa(x * lado, -0.2 + x * Math.tan(rad(20)), 3.3 - f * 1.95, 0.26 - f * 0.17, 0, N));
      }
      secs.push(anelAsa((envergadura + 0.08) * lado, -0.2 + envergadura * Math.tan(rad(20)) + 0.12, 1.1, 0.02, 0, N));
      const asa = new T.Group();
      asa.position.set(lado * 2.75, 0.44, z(8.9));
      malha(loft(secs, { cor: corAsa }), mat.matPele, asa);
      const luz = luzPonta(lado < 0 ? 0xff2a2a : 0x2aff6a);
      luz.position.set(lado * envergadura, 0, -0.2 + envergadura * Math.tan(rad(20)) + 0.55);
      asa.add(luz);
      partes.luzesNav.push(luz);
      g.add(asa);
      if (lado > 0) partes.asaD = asa; else partes.asaE = asa;
    }

    // Derivas duplas, levemente abertas para fora, com leme móvel e adesivos nas duas faces.
    const artes = { 1: arteDeriva(1), '-1': arteDeriva(-1) };
    const matDecal = (dir) => new T.MeshStandardMaterial({ map: artes[dir], transparent: true, alphaTest: 0.4, metalness: 0.15, roughness: 0.55, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 });
    for (const lado of [1, -1]) {
      const deriva = new T.Group();
      deriva.position.set(lado * 1.35, 0.3, 0);
      deriva.rotation.z = -lado * rad(4);
      malha(chapaLateral([[15.0, 0.0], [17.3, 2.7], [17.75, 2.7], [17.75, 0.0]], 0.1, 0.035), mat.matChapa, deriva);
      const leme = new T.Group();
      leme.position.set(0, 0, z(17.75));
      malha(chapaLateral([[0.0, 0.0], [0.0, 2.7], [0.6, 2.7], [0.68, 0.0]], 0.09, 0.03).translate(0, 0, -I.NARIZ), mat.matChapa, leme);
      deriva.add(leme);
      for (const face of [1, -1]) {
        const dir = face;                           // face olhando para +x: nariz à direita do canvas
        const plano = new T.Mesh(new T.PlaneGeometry(3.5, 2.8), matDecal(dir));
        plano.rotation.y = face * Math.PI / 2;
        plano.position.set(face * 0.085, 1.4, z(16.75));
        deriva.add(plano);
      }
      // luz de formação na ponta e luz branca de cauda
      const forma = new T.Mesh(new T.PlaneGeometry(0.45, 0.07), new T.MeshBasicMaterial({ color: 0xa9ff8a, side: T.DoubleSide }));
      forma.rotation.y = Math.PI / 2;
      forma.position.set(lado * 0.09, 2.45, z(17.6));
      deriva.add(forma); partes.faroisForma.push(forma);
      g.add(deriva);
      if (lado > 0) { partes.derivaD = deriva; partes.lemeD = leme; } else { partes.derivaE = deriva; partes.lemeE = leme; }
    }

    // Estabilizadores totalmente móveis, muito enflechados, com leve anedro.
    for (const lado of [1, -1]) {
      const estab = new T.Group();
      estab.position.set(lado * 1.95, -0.12, z(17.0));
      estab.rotation.z = -lado * rad(3);
      const geo = chapaPlana([[0, -1.6], [3.4 * lado, 2.1], [3.4 * lado, 2.9], [0, 1.1]], 0.12, 0.04, 0.06);
      geo.translate(0, 0, -I.NARIZ);               // chapaPlana soma NARIZ; aqui a origem é o pivô
      malha(geo, mat.matChapa, estab);
      g.add(estab);
      if (lado > 0) partes.estabD = estab; else partes.estabE = estab;
    }

    // Nadadeiras ventrais sob os motores, abertas para fora.
    for (const lado of [1, -1]) {
      const nad = new T.Group();
      nad.position.set(lado * 1.5, -0.78, 0);
      nad.rotation.z = lado * rad(22);
      malha(chapaLateral([[16.3, 0.0], [18.3, 0.0], [18.3, -0.5], [17.1, -0.5]], 0.05, 0.015), mat.matChapa, nad);
      g.add(nad);
    }
  }
  window.VooLivre._superficies = superficies;
})();

// ---------- cabine, detalhes, luzes e animação ----------
(function () {
  'use strict';
  const I = window.VooLivre._interno;
  const { T, z, rad, clamp, aneisDe, loft } = I;

  function cabineEDetalhes() {
    const M = window.VooLivre._montar;
    const { g, partes, malha, mat } = M;

    // Canopy em bolha alongada para dois tripulantes, apoiado no dorso da fuselagem.
    const secCan = [
      [3.45, 0.44, 0.05, 0.02, 0.73, 2.2],
      [3.9, 0.56, 0.42, 0.02, 0.73, 2.2],
      [4.5, 0.64, 0.63, 0.02, 0.74, 2.2],
      [5.2, 0.66, 0.67, 0.02, 0.73, 2.2],
      [6.0, 0.62, 0.60, 0.02, 0.71, 2.2],
      [6.8, 0.50, 0.36, 0.02, 0.68, 2.2],
      [7.35, 0.28, 0.08, 0.02, 0.64, 2.2],
    ];
    const canopy = malha(loft(aneisDe(secCan, 36)), mat.matVidro);
    canopy.castShadow = false; canopy.renderOrder = 10;
    // arcos do canopy (para-brisa, meio e traseira)
    for (const [s, w, h, yc] of [[3.98, 0.58, 0.47, 0.73], [5.6, 0.645, 0.645, 0.72], [7.0, 0.44, 0.28, 0.67]]) {
      const aro = aneisDe([[s - 0.045, w * 1.02, h * 1.02, 0.02, yc, 2.2], [s + 0.045, w * 1.02, h * 1.02, 0.02, yc, 2.2]], 36);
      malha(loft(aro), mat.matEscuro);
    }
    // soleira escura e interior
    const piso = malha(new T.BoxGeometry(1.16, 0.06, 3.7), mat.matCabine);
    piso.position.set(0, 0.74, z(5.45));
    const painel = malha(new T.BoxGeometry(0.9, 0.34, 0.5), mat.matCabine);
    painel.position.set(0, 0.92, z(4.05));
    const hud = malha(new T.BoxGeometry(0.26, 0.2, 0.02), mat.matVidro);
    hud.position.set(0, 1.15, z(4.28)); hud.rotation.x = -0.3;
    const console = malha(new T.BoxGeometry(0.3, 0.3, 0.9), mat.matCabine);
    console.position.set(0, 0.9, z(5.5));
    for (const s of [4.95, 6.15]) {
      const assento = malha(new T.BoxGeometry(0.5, 0.56, 0.5), mat.matAssento);
      assento.position.set(0, 1.0, z(s + 0.2));
      const encosto = malha(new T.BoxGeometry(0.3, 0.26, 0.16), mat.matAssento);
      encosto.position.set(0, 1.3, z(s + 0.36));
      const torso = malha(new T.BoxGeometry(0.42, 0.42, 0.3), mat.matMacacao);
      torso.position.set(0, 0.98, z(s));
      const capacete = malha(new T.SphereGeometry(0.16, 18, 14), mat.matCapacete);
      capacete.position.set(0, 1.25, z(s - 0.02));
      const visor = malha(new T.SphereGeometry(0.165, 18, 14, 0, Math.PI * 2, Math.PI * 0.3, Math.PI * 0.32), mat.matVisor);
      visor.position.copy(capacete.position); visor.rotation.x = -Math.PI / 2;
    }

    // Detalhes do nariz: tubo de pitot, sondas de ângulo de ataque, pod infravermelho e bojo do canhão.
    const pitot = malha(new T.CylinderGeometry(0.012, 0.02, 1.1, 8), mat.matMetal);
    pitot.rotation.x = Math.PI / 2; pitot.position.set(0, -0.17, z(-0.5));
    for (const lado of [1, -1]) {
      const sonda = malha(new T.ConeGeometry(0.025, 0.22, 8), mat.matMetal);
      sonda.rotation.x = -Math.PI / 2; sonda.position.set(lado * 0.56, 0.05, z(2.05));
    }
    const pod = malha(new T.CylinderGeometry(0.14, 0.14, 0.7, 16), mat.matEscuro);
    pod.rotation.x = Math.PI / 2; pod.position.set(0, -0.72, z(2.9));
    const lentePod = malha(new T.SphereGeometry(0.13, 16, 12), mat.matVisor);
    lentePod.position.set(0, -0.72, z(2.55));
    const canhao = malha(new T.CylinderGeometry(0.1, 0.12, 0.8, 12), mat.matChapa);
    canhao.rotation.x = Math.PI / 2; canhao.position.set(-0.68, -0.05, z(3.35));

    // Antenas, bojos de guerra eletrônica, gancho de parada e luzes anticolisão.
    for (const [x, y, s, inv] of [[0, 0.62, 8.7, 1], [0, -0.92, 5.2, -1], [0, 0.48, 12.6, 1]]) {
      const antena = malha(new T.BoxGeometry(0.03, 0.22, 0.32), mat.matChapa);
      antena.position.set(x, y + inv * 0.1, z(s));
      antena.rotation.x = inv * 0.35;
    }
    for (const lado of [1, -1]) {
      const bojo = malha(new T.SphereGeometry(0.16, 14, 10), mat.matChapa);
      bojo.scale.set(1, 0.6, 1.6); bojo.position.set(lado * 0.55, 0.14, z(18.3));
    }
    const gancho = malha(new T.CylinderGeometry(0.035, 0.045, 2.2, 8), mat.matMetal);
    gancho.rotation.x = Math.PI / 2 - 0.12; gancho.position.set(0, -0.3, z(17.6));
    const garra = malha(new T.BoxGeometry(0.16, 0.14, 0.2), mat.matMetal);
    garra.position.set(0, -0.44, z(18.75));
    for (const [y, s] of [[0.56, 8.2], [-0.9, 6.3]]) {
      const beacon = new T.Mesh(new T.SphereGeometry(0.07, 10, 8), new T.MeshBasicMaterial({ color: 0xff3030 }));
      beacon.position.set(0, y, z(s)); g.add(beacon); partes.beacons.push(beacon);
    }
    // luz branca de cauda e luzes de formação nas laterais
    const cauda = new T.Mesh(new T.SphereGeometry(0.05, 10, 8), new T.MeshBasicMaterial({ color: 0xffffff }));
    cauda.position.set(0, 0.11, z(18.95)); g.add(cauda); partes.luzesNav.push(cauda);
    for (const lado of [1, -1]) {
      for (const [x, y, s] of [[0.56, -0.1, 1.9], [1.35 + 0.64, -0.3, 12.5]]) {
        const f = new T.Mesh(new T.PlaneGeometry(0.4, 0.07), new T.MeshBasicMaterial({ color: 0xa9ff8a, side: T.DoubleSide }));
        f.rotation.y = lado * Math.PI / 2; f.position.set(lado * (x + 0.01), y, z(s));
        g.add(f); partes.faroisForma.push(f);
      }
    }
  }

  // Monta tudo e devolve o avião com a função de animação.
  window.VooLivre._definirResto(function () {
    const M = window.VooLivre._montar;
    window.VooLivre._motores();
    window.VooLivre._superficies();
    cabineEDetalhes();
    const { g, partes } = M;
    g.traverse((o) => { if (o.isMesh && o.material && o.material.isMeshBasicMaterial) o.castShadow = false; });

    const estado = { enflechamento: 20, tempo: 0, luzes: true };
    function atualizar(dt, e) {
      e = e || {};
      estado.tempo += dt;
      // asas: o mecanismo move cerca de 8 graus por segundo
      const alvo = clamp(e.enflechamento == null ? 20 : e.enflechamento, 20, 68);
      estado.enflechamento += clamp(alvo - estado.enflechamento, -8 * dt, 8 * dt);
      partes.asaD.rotation.y = -rad(estado.enflechamento - 20);
      partes.asaE.rotation.y = rad(estado.enflechamento - 20);
      // superfícies de comando
      const arf = clamp(e.arfagem || 0, -1, 1), rol = clamp(e.rolagem || 0, -1, 1), gui = clamp(e.guinada || 0, -1, 1);
      partes.estabD.rotation.x = -(arf - 0.5 * rol) * rad(16);
      partes.estabE.rotation.x = -(arf + 0.5 * rol) * rad(16);
      partes.lemeD.rotation.y = partes.lemeE.rotation.y = -gui * rad(25);
      // motor: pétalas abrem na pós-combustão, turbina brilha, chama cresce
      const motor = clamp(e.motor == null ? 0 : e.motor, 0, 1);
      const pc = clamp((motor - 0.82) / 0.18, 0, 1);
      const tilt = rad(15 - 13 * pc);
      for (const lista of partes.petalas) for (const p of lista) p.rotation.y = -tilt;
      const tremor = 0.9 + 0.1 * Math.sin(estado.tempo * 37) * Math.sin(estado.tempo * 23 + 1);
      for (const m of partes.plumas) {
        m.turbina.material.emissiveIntensity = 0.15 * motor + 1.6 * pc;
        m.pluma.visible = pc > 0.01;
        m.pluma.scale.set(1, 1, (0.6 + 5.2 * pc) * tremor);
        m.chama.material.opacity = 0.45 + 0.3 * pc;
        m.diamantes.forEach((d, k) => { d.visible = k < Math.round(pc * 4); });
      }
      // luzes
      const luzes = e.luzes !== false;
      const pisca = (estado.tempo % 1.3) < 0.12;
      for (const b of partes.beacons) b.visible = luzes && pisca;
      for (const l of partes.luzesNav) l.visible = luzes;
      for (const f of partes.faroisForma) f.visible = luzes;
    }
    atualizar(0, {});
    return { grupo: g, partes, atualizar, estado, comprimento: 19.1 };
  });
})();
