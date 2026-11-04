// Todos os valores de referência do jogo, num lugar só: o jogo (index.html) e a tabela de ajustes (ajustes.html) leem esta lista.
// Cada jogo tem os seus valores, e na sobrevivência cada nível tem os dele. O que for mudado na tabela fica neste navegador
// (localStorage 'voo-ajustes', no formato { jogo: { nível: { id: valor } } }) e o jogo usa ao decolar; os padrões são os daqui.
// Ao mudar este arquivo, suba o número de ?v= nas duas páginas e no "Baixar tudo": o service worker guarda os arquivos pelo nome.
// Os tamanhos em cm são os de um celular comum, com a tela deitada de 7 cm de altura.
window.VOO_TABELA = (() => {
  const CHAVE = 'voo-ajustes';
  const MODOS = [
    { id: 'sobrevivencia', nome: 'Sobrevivência', niveis: 15 },
    { id: 'equipe', nome: 'Mata-mata 5 × 5', niveis: 1 },
    { id: 'livre', nome: 'Voo livre', niveis: 1 },
  ];
  const COMBATE = ['sobrevivencia', 'equipe'];
  // padrao: um número, uma conta com o nível ou { jogo: um dos dois }. min e max: até onde a tabela deixa ir.
  const v = (id, nome, uni, padrao, min, max, nota) => ({ id, nome, uni, padrao, min, max, nota });
  const soCombate = (i) => Object.assign(i, { modos: COMBATE });
  // na sobrevivência o piloto melhora do nível 1 ao 10; do 11 em diante fica como o do 10
  const porNivel = (inicio, fim, casas = 0) => (n) => +(inicio + (fim - inicio) * Math.min(1, (n - 1) / 9)).toFixed(casas);
  // categorias da tabela. Um texto no meio dos itens é um subtítulo; modos: os jogos em que a categoria aparece (sem isso, todos)
  const GRUPOS = [
    { id: 'caca', titulo: 'Caça', itens: [
      'Velocidade',
      v('velNormal', 'Normal, sem comandos', 'km/h', 1000, 300, 2500),
      v('velMaxima', 'Máxima acelerando', 'km/h', 2500, 500, 5000),
      v('tempoMaxima', 'Tempo da normal até a máxima', 's', 4.5, 0.5, 20),
      v('velMinima', 'Mínima freando', 'km/h', 250, 100, 1000),
      v('tempoFreada', 'Freada de 1.500 km/h até a mínima', 's', 2, 0.2, 10),
      v('tempoVoltaFreio', 'Volta da mínima até a normal', 's', 3, 0.5, 20),
      v('tempoVoltaMaxima', 'Volta da máxima até a normal', 's', 10.4, 0.5, 30),
      v('velEstol', 'Estol abaixo de', 'km/h', 270, 100, 800),
      'Gasolina',
      v('gasolinaDura', 'Duração com o acelerador apertado', 's', 15, 1, 120),
      v('gasolinaEnche', 'Tempo para encher do zero', 's', 20, 1, 120, '20 s é 5% por segundo'),
      'Curva',
      v('curvaNormal', 'Curva na velocidade normal', '°/s', 46, 10, 180),
      v('curvaMaxima', 'Curva na velocidade máxima', '°/s', 18, 5, 180),
      v('rolagemNormal', 'Giro das asas na velocidade normal', '°/s', 183, 30, 360),
      v('rolagemMaxima', 'Giro das asas na velocidade máxima', '°/s', 149, 30, 360),
    ] },
    { id: 'mira', titulo: 'Mira e assistência', modos: COMBATE, nota: 'Os tamanhos em cm são os de um celular com a tela deitada de 7 cm de altura.', itens: [
      'Tamanhos na tela',
      v('circuloVazio', 'Círculo vazio: largura', 'cm', 2.8, 1, 6),
      v('circuloComAlvo', 'Círculo com alguém dentro: largura', 'cm', 3.5, 1, 7),
      v('cruz', 'Cruz da mira: largura', 'cm', 0.36, 0.1, 2),
      v('quadradoLargura', 'Quadrado azul: largura', 'cm', 0.63, 0.1, 3),
      v('quadradoAltura', 'Quadrado azul: altura', 'cm', 0.63, 0.1, 3),
      v('quadradoLongeLargura', 'Quadrado azul de longe: largura', 'cm', 0.25, 0.05, 3),
      v('quadradoLongeAltura', 'Quadrado azul de longe: altura', 'cm', 0.25, 0.05, 3),
      v('quadradoVerdeLargura', 'Quadrado verde: largura', 'cm', 0.32, 0.05, 3),
      v('quadradoVerdeAltura', 'Quadrado verde: altura', 'cm', 0.32, 0.05, 3),
      'Assistência de mira',
      v('assistSuave', 'Assistência suave: força máxima', '°/s', 25, 0, 180, 'Age assim que um inimigo entra no círculo'),
      v('assistSuaveRapidez', 'Assistência suave: rapidez', 'por s', 2, 0.1, 20, 'Quanto do desvio ela corrige por segundo'),
      v('assistForte', 'Assistência forte: força máxima', '°/s', 90, 0, 360, 'Age com a mira da metralhadora travada'),
      v('assistForteRapidez', 'Assistência forte: rapidez', 'por s', 8, 0.1, 30, 'Quanto do desvio ela corrige por segundo'),
      'Trava da metralhadora',
      v('miraTempo', 'Tempo para travar', 's', 1.25, 0.1, 10),
      v('miraDistancia', 'Distância para travar', 'm', 2500, 200, 6000),
      v('miraSolta', 'Solta a mais de', 'm', 3000, 300, 8000, 'Tem de ser maior que a distância para travar'),
      v('miraDesvio', 'Solta com desvio de', '°', 17, 2, 60),
    ] },
    { id: 'tiro', titulo: 'Tiro', itens: [
      v('tirosPorSegundo', 'Tiros por segundo', '', 13.3, 1, 40),
      v('tiroVel', 'Velocidade do tiro', 'km/h', 3420, 500, 12000, 'É somada à velocidade do caça que atira'),
      soCombate(v('danoTiro', 'Dano por tiro', '%', 1.5, 0.1, 50)),
      v('tiroVoo', 'Tempo de voo dos tiros', 's', 3.2, 0.5, 10),
      v('zoomTiro', 'Zoom ao atirar', '%', 50, 0, 150),
    ] },
    { id: 'missil', titulo: 'Míssil teleguiado', itens: [
      soCombate(v('missilTempo', 'Tempo para travar', 's', 1.2, 0.1, 10)),
      soCombate(v('missilDistancia', 'Distância para travar', 'm', 5500, 500, 15000)),
      v('missilVel', 'Velocidade', 'km/h', 5000, 1000, 12000),
      v('missilTempoVel', 'Tempo até a velocidade máxima', 's', 2.4, 0.2, 10),
      v('missilCurva', 'Curva do míssil', '°/s', 120, 10, 360),
      v('missilAr', 'Tempo no ar', 's', 14, 1, 60),
      v('missilQtd', 'Quantidade', '', 4, 1, 20),
      v('missilVolta', 'Volta um a cada', 's', 20, 1, 300),
      soCombate(v('missilDano', 'Dano', '%', 50, 1, 100)),
    ] },
    { id: 'foguete', titulo: 'Míssil normal', nota: 'É o foguete, sem guia: vai reto para onde o nariz aponta.', itens: [
      v('fogueteVel', 'Velocidade', 'km/h', 5000, 1000, 12000),
      v('fogueteTempoVel', 'Tempo até a velocidade máxima', 's', 2.4, 0.2, 10),
      v('fogueteAr', 'Tempo no ar', 's', 8, 1, 60),
      v('fogueteQtd', 'Quantidade', '', 12, 1, 60),
      v('fogueteVolta', 'Volta um a cada', 's', 6, 1, 300),
      soCombate(v('fogueteDano', 'Dano', '%', 60, 1, 100)),
    ] },
    { id: 'flares', titulo: 'Flares', modos: COMBATE, itens: [
      v('flaresQtd', 'Salvas', '', 3, 0, 20, 'Na sobrevivência não voltam; no mata-mata, voltam ao renascer'),
      v('flaresAlcance', 'Funcionam com o míssil a menos de', 'km', 2, 0.2, 10),
      v('flaresReto', 'Chance voando reto', '%', 45, 0, 100),
      v('flaresCurva', 'Chance em curva fechada', '%', 80, 0, 100),
      v('flaresEspera', 'Espera entre salvas', 's', 3, 0, 30),
    ] },
    { id: 'pilotos', titulo: 'Pilotos do computador', modos: COMBATE, nota: 'Velocidade, travas e armas deles são as mesmas das outras categorias. Aqui fica só o jeito de pilotar.', itens: [
      'Voo',
      v('pilotoCurva', 'Curva usada', '%', { sobrevivencia: porNivel(60, 100), equipe: 80 }, 10, 100, '100% é a curva toda do caça'),
      v('pilotoPrevisao', 'Olha à frente para não bater no chão', 's', { sobrevivencia: porNivel(2.4, 3.5, 1), equipe: 3 }, 0.5, 10),
      'Desvio de colisão',
      v('evitarTempo', 'Olha à frente para não bater em outro caça', 's', 1.2, 0, 6),
      v('evitarDistancia', 'Distância segura de outro caça', 'm', 100, 0, 1000, '0 desliga o desvio'),
      'Ataque',
      v('pilotoRajada', 'Tiros por rajada', '', { sobrevivencia: porNivel(4, 10), equipe: 12 }, 1, 60),
      v('pilotoPausa', 'Pausa entre rajadas', 's', { sobrevivencia: porNivel(3.6, 1.2, 2), equipe: 1.6 }, 0.1, 20),
      v('pilotoPontaria', 'Pontaria: quanto antecipa o alvo', '%', { sobrevivencia: porNivel(30, 100), equipe: 92 }, 0, 100),
      v('pilotoAntecipa', 'Pontaria: quanto conta com a curva do alvo', '%', { sobrevivencia: porNivel(0, 60), equipe: 90 }, 0, 100),
      v('pilotoEspera', 'Espera entre lançamentos', 's', { sobrevivencia: porNivel(30, 16, 1), equipe: 12 }, 1, 120),
      v('pilotoMisseis', 'Mísseis no ar contra o mesmo alvo', '', { sobrevivencia: (n) => Math.min(3, 1 + Math.floor((n - 1) / 3)), equipe: 2 }, 1, 10),
      'Defesa',
      v('pilotoFuga', 'Fuga de quem está atrás', '%', { sobrevivencia: porNivel(0, 100), equipe: 56 }, 0, 100),
      v('pilotoFlares', 'Chance de soltar flares', '%', { sobrevivencia: porNivel(25, 85), equipe: 58 }, 0, 100),
    ] },
    { id: 'ondas', titulo: 'Ondas de inimigos', modos: ['sobrevivencia'], itens: [
      v('cacasNoNivel', 'Caças neste nível', '', (n) => Math.min(1 + n, 8), 1, 30),
      v('chegadaIntervalo', 'Tempo entre a chegada de um caça e outro', 's', 1.5, 0.2, 20),
      v('consertoCasco', 'Conserto do casco ao chegar neste nível', '%', 25, 0, 100),
    ] },
    { id: 'partida', titulo: 'Partida', modos: ['equipe'], itens: [
      v('duracaoPartida', 'Duração', 'min', 5, 1, 30),
      v('renascerTempo', 'Tempo para voltar depois de cair', 's', 4, 1, 30),
      v('renascerProtecao', 'Proteção ao voltar', 's', 2.5, 0, 20),
    ] },
    { id: 'radar', titulo: 'Radar', modos: COMBATE, itens: [
      v('radarAlcance', 'Alcance do radar', 'km', 10, 2, 50),
    ] },
  ];
  const ehItem = (i) => typeof i !== 'string';
  const ITENS = GRUPOS.flatMap((g) => g.itens).filter(ehItem);
  const dadosDe = (modo) => MODOS.find((m) => m.id === modo) || MODOS[0];
  // as categorias de um jogo, só com o que vale nele
  const gruposDe = (modo) => GRUPOS.filter((g) => !g.modos || g.modos.includes(modo))
    .map((g) => Object.assign({}, g, { itens: g.itens.filter((i) => !ehItem(i) || !i.modos || i.modos.includes(modo)) }));
  function padraoDe(i, modo, nivel) {
    const p = typeof i.padrao === 'object' ? i.padrao[modo] : i.padrao;
    return typeof p === 'function' ? p(nivel) : p;
  }

  // o que foi mudado na tabela, só os valores válidos e diferentes do padrão
  function ler() {
    let guardados = {};
    try { guardados = JSON.parse(localStorage.getItem(CHAVE)) || {}; } catch (e) { /* sem armazenamento ou texto inválido */ }
    const r = {};
    for (const m of MODOS) {
      r[m.id] = {};
      for (let n = 1; n <= m.niveis; n++) {
        const g = (guardados[m.id] || {})[n] || {}, novos = {};
        for (const i of ITENS) {
          const x = g[i.id];
          if (Number.isFinite(x) && x >= i.min && x <= i.max && x !== padraoDe(i, m.id, n)) novos[i.id] = x;
        }
        r[m.id][n] = novos;
      }
    }
    return r;
  }
  function salvar(novos) {
    try { localStorage.setItem(CHAVE, JSON.stringify(novos)); return true; } catch (e) { return false; }
  }
  const temMudancas = () => Object.values(ler()).some((m) => Object.values(m).some((n) => Object.keys(n).length));
  // os valores de um jogo e nível: os padrões, mais o que foi mudado, mais as regras que não deixam o jogo quebrar.
  // Depois do último nível, vale o que está nele.
  function valores(modo, nivel) {
    const m = dadosDe(modo), n = Math.min(m.niveis, Math.max(1, nivel || 1));
    const r = {};
    for (const i of ITENS) r[i.id] = padraoDe(i, m.id, n);
    Object.assign(r, ler()[m.id][n]);
    r.velNormal = Math.max(r.velNormal, r.velMinima + 10);
    r.velMaxima = Math.max(r.velMaxima, r.velNormal + 10);
    r.circuloComAlvo = Math.max(r.circuloComAlvo, r.circuloVazio);
    r.miraSolta = Math.max(r.miraSolta, r.miraDistancia + 100);
    return r;
  }
  return { CHAVE, MODOS, gruposDe, padraoDe, ler, salvar, temMudancas, valores };
})();
