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
  const v = (id, nome, uni, padrao, min, max) => ({ id, nome, uni, padrao, min, max });
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
      v('gasolinaEnche', 'Tempo para encher do zero', 's', 20, 1, 120),
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
      v('assistSuave', 'Assistência suave: força máxima', '°/s', 25, 0, 180),
      v('assistSuaveRapidez', 'Assistência suave: rapidez', 'por s', 2, 0.1, 20),
      v('assistForte', 'Assistência forte: força máxima', '°/s', 90, 0, 360),
      v('assistForteRapidez', 'Assistência forte: rapidez', 'por s', 8, 0.1, 30),
      'Trava da metralhadora',
      v('miraTempo', 'Tempo para travar', 's', 1.25, 0.1, 10),
      v('miraDistancia', 'Distância para travar', 'm', 2500, 200, 6000),
      v('miraSolta', 'Solta a mais de', 'm', 3000, 300, 8000),
      v('miraDesvio', 'Solta com desvio de', '°', 17, 2, 60),
    ] },
    { id: 'tiro', titulo: 'Tiro', itens: [
      v('tirosPorSegundo', 'Tiros por segundo', '', 13.3, 1, 40),
      v('tiroVel', 'Velocidade do tiro', 'km/h', 3420, 500, 12000),
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
    { id: 'foguete', titulo: 'Míssil normal', nota: 'É o foguete, sem guia: vai reto para onde o nariz apontava.', itens: [
      v('fogueteVel', 'Velocidade', 'km/h', 5000, 1000, 12000),
      v('fogueteTempoVel', 'Tempo até a velocidade máxima', 's', 2.4, 0.2, 10),
      v('fogueteAr', 'Tempo no ar', 's', 8, 1, 60),
      v('fogueteQtd', 'Quantidade', '', 12, 1, 60),
      v('fogueteVolta', 'Volta um a cada', 's', 6, 1, 300),
      soCombate(v('fogueteDano', 'Dano', '%', 60, 1, 100)),
    ] },
    { id: 'flares', titulo: 'Flares', modos: COMBATE, itens: [
      v('flaresQtd', 'Salvas', '', 3, 0, 20),
      v('flaresAlcance', 'Funcionam com o míssil a menos de', 'km', 2, 0.2, 10),
      v('flaresReto', 'Chance voando reto', '%', 45, 0, 100),
      v('flaresCurva', 'Chance em curva fechada', '%', 80, 0, 100),
      v('flaresEspera', 'Espera entre salvas', 's', 3, 0, 30),
    ] },
    { id: 'pilotos', titulo: 'Pilotos do computador', modos: COMBATE, nota: 'Velocidade, travas e armas deles são as mesmas das outras categorias. Aqui fica só o jeito de pilotar.', itens: [
      'Voo',
      v('pilotoCurva', 'Curva usada', '%', { sobrevivencia: porNivel(60, 100), equipe: 80 }, 10, 100),
      v('pilotoPrevisao', 'Olha à frente para não bater no chão', 's', { sobrevivencia: porNivel(2.4, 3.5, 1), equipe: 3 }, 0.5, 10),
      'Desvio de colisão',
      v('evitarTempo', 'Olha à frente para não bater em outro caça', 's', 1.2, 0, 6),
      v('evitarDistancia', 'Distância segura de outro caça', 'm', 100, 0, 1000),
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

  // Explicação de cada valor, para a tabela: o selo (para que lado ele fica melhor), como funciona, o que acontece ao aumentar e
  // ao diminuir e, quando ajuda, um exemplo feito com os valores que estão valendo.
  const n = (x, casas = 0) => x.toLocaleString('pt-BR', { maximumFractionDigits: casas });
  const raioCurva = (kmh, graus) => kmh / 3.6 / (graus * Math.PI / 180);     // o raio do círculo de uma curva, em metros
  const alcanceTiro = (t) => (t.velNormal + t.tiroVel) / 3.6 * t.tiroVoo;
  // até onde vai um míssil: sai na velocidade do caça e leva um tempo até a dele
  const alcanceMissil = (t, kmh, ate, voo) => (kmh * voo - (kmh - Math.min(t.velNormal, kmh)) * ate / 2) / 3.6 / 1000;
  const umaVolta = (graus) => n(360 / graus, 1) + ' s';
  const acertos = (dano) => { const q = Math.ceil(100 / dano); return 'Derruba com ' + q + (q === 1 ? ' acerto.' : ' acertos.'); };
  const MAIOR = { tipo: 'bom', texto: '▲ Maior = melhor' }, MENOR = { tipo: 'bom', texto: '▼ Menor = melhor' };
  const DEPENDE = { tipo: 'neutro', texto: '◆ Depende: tem lado bom e lado ruim' }, DESENHO = { tipo: 'neutro', texto: '◆ Só muda o desenho' };
  const MAIS_AJUDA = { tipo: 'bom', texto: '▲ Maior = mais ajuda para mirar' };
  const PILOTO_MAIOR = { tipo: 'dificil', texto: '▲ Maior = piloto mais difícil' }, PILOTO_MENOR = { tipo: 'dificil', texto: '▼ Menor = piloto mais difícil' };
  const AJUDA = {
    velNormal: [DEPENDE, 'A velocidade do caça sem apertar acelerar nem frear. Todos os caças voam nela.',
      'Chega mais rápido na briga, mas a curva fica mais aberta e sobra menos tempo para mirar.',
      'A curva fica mais fechada e sobra mais tempo para mirar, mas fica mais fácil de ser alcançado.',
      (t) => `O caça anda ${n(t.velNormal / 3.6)} m a cada segundo.`],
    velMaxima: [MAIOR, 'A velocidade que o caça alcança segurando o acelerador. Gasta gasolina.',
      'Alcança e foge melhor.', 'Acelerar ajuda menos a fugir ou a alcançar alguém.',
      (t) => `O caça anda ${n(t.velMaxima / 3.6)} m a cada segundo.`],
    tempoMaxima: [MENOR, 'Quantos segundos de acelerador apertado para ir da velocidade normal até a máxima. É a força do motor.',
      'Demora mais para ganhar velocidade.', 'O arranque fica mais forte.',
      (t) => `Chegar na máxima gasta ${n(Math.min(100, t.tempoMaxima / t.gasolinaDura * 100))}% da gasolina.`],
    velMinima: [DEPENDE, 'A velocidade mais baixa a que o caça chega segurando o freio.',
      'Freia menos, e fica mais longe de estolar.', 'Dá para frear mais e deixar o inimigo passar, mas pode estolar.',
      (t) => (t.velMinima < t.velEstol ? 'Com estes valores, segurar o freio até o fim faz o caça estolar.' : 'Com estes valores, segurar o freio não faz o caça estolar.')],
    tempoFreada: [MENOR, 'Quantos segundos de freio para cair de 1.500 km/h até a velocidade mínima. É a força do freio.',
      'O freio fica mais fraco.', 'O caça freia mais de repente.'],
    tempoVoltaFreio: [MENOR, 'Depois de soltar o freio, quantos segundos o caça leva da velocidade mínima até a normal.',
      'Fica devagar por mais tempo depois de frear.', 'Recupera a velocidade mais rápido.'],
    tempoVoltaMaxima: [MAIOR, 'Depois de soltar o acelerador, quantos segundos o caça leva da velocidade máxima até a normal.',
      'Segura a velocidade por mais tempo, sem gastar gasolina.', 'Perde a velocidade logo depois de soltar o acelerador.'],
    velEstol: [MENOR, 'Abaixo desta velocidade, as asas do seu caça não seguram: o nariz cai e ele afunda até ganhar velocidade de novo.',
      'Estola mais cedo.', 'Dá para voar bem mais devagar sem cair.',
      (t) => `A curva de todos os caças começa a enfraquecer abaixo de ${n(t.velEstol * 1.8)} km/h.`],
    gasolinaDura: [MAIOR, 'Quantos segundos o tanque cheio aguenta com o acelerador apertado. Voar normal e frear não gastam gasolina.',
      'Acelera por mais tempo.', 'A gasolina acaba mais rápido.'],
    gasolinaEnche: [MENOR, 'Quantos segundos a gasolina leva para encher do zero, com o acelerador solto.',
      'Demora mais para poder acelerar de novo.', 'A gasolina volta mais rápido.',
      (t) => `Enche ${n(100 / t.gasolinaEnche, 1)}% por segundo.`],
    curvaNormal: [MAIOR, 'Quantos graus o nariz do caça gira em 1 segundo, com o manche todo puxado, na velocidade normal. Uma volta completa tem 360°. Mais devagar ele vira um pouco mais; mais rápido, menos.',
      'Vira mais rápido e faz curvas mais fechadas: fica mais fácil mirar e fugir de míssil.', 'O caça fica pesado e demora mais para virar.',
      (t) => `Uma volta completa leva ${umaVolta(t.curvaNormal)}, num círculo de ${n(raioCurva(t.velNormal, t.curvaNormal))} m de raio.`],
    curvaMaxima: [MAIOR, 'O mesmo giro do nariz, mas na velocidade máxima. Entre a normal e a máxima, o valor vai mudando aos poucos.',
      'O caça continua virando bem mesmo muito rápido.', 'Em alta velocidade ele fica travado: acelerar passa a atrapalhar a curva.',
      (t) => `Uma volta completa leva ${umaVolta(t.curvaMaxima)}, num círculo de ${n(raioCurva(t.velMaxima, t.curvaMaxima))} m de raio.`],
    rolagemNormal: [MAIOR, 'Quantos graus as asas inclinam em 1 segundo, com o manche todo para o lado, na velocidade normal. É o giro do caça em volta dele mesmo.',
      'Começa as curvas mais depressa. Alto demais, fica difícil de controlar.', 'Demora mais para inclinar e começar a curva.',
      (t) => `Um giro completo das asas leva ${umaVolta(t.rolagemNormal)}.`],
    rolagemMaxima: [MAIOR, 'O mesmo giro das asas, mas na velocidade máxima.',
      'O caça continua ágil em alta velocidade.', 'Em alta velocidade ele demora mais para inclinar.',
      (t) => `Um giro completo das asas leva ${umaVolta(t.rolagemMaxima)}.`],

    circuloVazio: [MAIOR, 'O círculo tracejado do meio da tela. Para travar o míssil teleguiado, o inimigo precisa entrar nele; é aí também que a assistência suave começa. Os caças do computador usam o mesmo círculo.',
      'Fica mais fácil pegar alguém no círculo, para você e para eles.', 'É preciso mirar com mais precisão para travar.',
      (t) => `Ocupa ${n(t.circuloVazio / 7 * 100)}% da altura da tela.`],
    circuloComAlvo: [MAIOR, 'O tamanho do círculo depois que um inimigo entra nele. Enquanto o inimigo seguir aqui dentro, a trava continua contando.',
      'Fica mais difícil o inimigo escapar da trava.', 'O inimigo escapa da trava com mais facilidade. Não pode ser menor que o círculo vazio.'],
    cruz: [DESENHO, 'A cruz no meio da tela. Não muda para onde os tiros vão nem a dificuldade de acertar.',
      'Fica mais fácil de ver, mas cobre mais a tela.', 'Atrapalha menos a visão, mas some mais no meio da ação.'],
    quadradoLargura: [DESENHO, 'Largura do quadrado azul em volta dos inimigos a até 2,5 km. Não muda a dificuldade de acertar.',
      'Fica mais fácil de ver, mas cobre mais o caça.', 'Mostra mais o caça, mas chama menos atenção.'],
    quadradoAltura: [DESENHO, 'Altura do quadrado azul em volta dos inimigos a até 2,5 km.',
      'Fica mais fácil de ver, mas cobre mais o caça.', 'Mostra mais o caça, mas chama menos atenção.'],
    quadradoLongeLargura: [DESENHO, 'Largura do quadrado azul dos inimigos a mais de 2,5 km.',
      'Fica mais fácil achar quem está longe, mas embola quando vêm vários juntos.', 'Embola menos, mas fica mais difícil achar quem está longe.'],
    quadradoLongeAltura: [DESENHO, 'Altura do quadrado azul dos inimigos a mais de 2,5 km.',
      'Fica mais fácil achar quem está longe, mas embola quando vêm vários juntos.', 'Embola menos, mas fica mais difícil achar quem está longe.'],
    quadradoVerdeLargura: [DESENHO, 'Largura do quadrado verde em volta dos companheiros de equipe.',
      'Fica mais fácil achar os companheiros, mas cobre mais a tela.', 'Atrapalha menos, mas fica mais difícil achar os companheiros.'],
    quadradoVerdeAltura: [DESENHO, 'Altura do quadrado verde em volta dos companheiros de equipe.',
      'Fica mais fácil achar os companheiros, mas cobre mais a tela.', 'Atrapalha menos, mas fica mais difícil achar os companheiros.'],
    assistSuave: [MAIS_AJUDA, 'Com um inimigo dentro do círculo, o nariz do seu caça vai sozinho até ele. Este número é o limite dessa ajuda: quantos graus por segundo ela pode girar o nariz. Só você tem essa ajuda.',
      'O caça centraliza no inimigo com mais força, e sobra menos controle para o seu manche.', 'A ajuda fica mais fraca. Com 0, ela desliga.',
      (t) => `É ${n(t.assistSuave / t.curvaNormal * 100)}% da curva normal do caça.`],
    assistSuaveRapidez: [MAIS_AJUDA, 'O quanto do desvio a assistência suave corrige em 1 segundo. Quanto mais perto do centro, mais suave ela fica.',
      'Chega ao centro mais depressa.', 'Vai ao centro bem devagar.',
      (t) => `Com o inimigo a 10° do nariz, ela gira ${n(Math.min(10 * t.assistSuaveRapidez, t.assistSuave), 1)}°/s; a 2°, gira ${n(Math.min(2 * t.assistSuaveRapidez, t.assistSuave), 1)}°/s.`],
    assistForte: [MAIS_AJUDA, 'Com a metralhadora travada, o nariz segue sozinho o ponto onde os tiros vão encontrar o inimigo. Este número é o limite dessa força. Os caças do computador também têm.',
      'A mira fica mais grudada no alvo, a sua e a deles.', 'Fica mais fácil o alvo escapar da mira travada. Com 0, ela desliga.',
      (t) => `É ${n(t.assistForte / t.curvaNormal * 100)}% da curva normal do caça.`],
    assistForteRapidez: [MAIS_AJUDA, 'O quanto do desvio a assistência forte corrige em 1 segundo. Quanto mais perto do centro, mais suave ela fica.',
      'A mira volta ao alvo mais depressa.', 'A mira volta ao alvo mais devagar.',
      (t) => `Com o alvo a 5° do nariz, ela gira ${n(Math.min(5 * t.assistForteRapidez, t.assistForte), 1)}°/s; a 1°, gira ${n(Math.min(t.assistForteRapidez, t.assistForte), 1)}°/s.`],
    miraTempo: [MENOR, 'Quantos segundos é preciso ficar atrás do inimigo, com a cruz em cima dele, para a metralhadora travar. Vale também para os caças do computador.',
      'Demora mais para travar.', 'Trava quase na hora.'],
    miraDistancia: [MAIOR, 'A maior distância em que a metralhadora trava. Os caças do computador também só atiram até aqui.',
      'Trava de mais longe, e os caças do computador atiram de mais longe.', 'É preciso chegar mais perto.',
      (t) => (alcanceTiro(t) < t.miraDistancia ? `Atenção: com estes valores, os tiros só chegam a ${n(alcanceTiro(t))} m, antes da distância da trava.` : `Os tiros chegam a ${n(alcanceTiro(t))} m com o caça na velocidade normal.`)],
    miraSolta: [MAIOR, 'Com a mira travada, se o inimigo se afastar mais que esta distância, a trava solta. Precisa ser maior que a distância para travar.',
      'O inimigo precisa ir mais longe para escapar.', 'A trava solta com mais facilidade.'],
    miraDesvio: [MAIOR, 'Com a mira travada, se o ponto onde os tiros vão encontrar o inimigo sair mais que estes graus do nariz, a trava solta. É assim que puxar o manche para o lado solta a mira.',
      'Fica mais difícil perder a trava.', 'Uma curva do inimigo já solta a trava.'],

    tirosPorSegundo: [MAIOR, 'Quantos tiros a metralhadora dá em 1 segundo. Os caças do computador atiram no mesmo ritmo.',
      'Mais tiros no ar e mais dano por segundo.', 'Atira mais devagar e dá menos dano por segundo.'],
    tiroVel: [MAIOR, 'A velocidade que o tiro ganha ao sair do caça. Ela é somada à velocidade do próprio caça.',
      'O tiro chega mais depressa, fica mais fácil acertar quem se mexe e ele vai mais longe.', 'É preciso mirar mais à frente do alvo, e o tiro alcança menos.',
      (t) => `Com o caça na velocidade normal, o tiro sai a ${n(t.velNormal + t.tiroVel)} km/h.`],
    danoTiro: [MAIOR, 'Quanto da vida cada tiro tira. Todo caça tem 100% de vida.',
      'Derruba mais rápido, e você também cai mais rápido.', 'As brigas duram mais.',
      (t) => `${n(t.tirosPorSegundo, 1)} tiros por segundo × ${n(t.danoTiro, 1)}% = ${n(t.tirosPorSegundo * t.danoTiro, 1)}% por segundo: acertando tudo, derruba em ${n(100 / (t.tirosPorSegundo * t.danoTiro), 1)} s.`],
    tiroVoo: [MAIOR, 'Quantos segundos o tiro voa antes de sumir. Junto com a velocidade, define até onde ele chega.',
      'O tiro chega mais longe.', 'O tiro some antes e pode não chegar em quem está longe.',
      (t) => `Os tiros chegam a ${n(alcanceTiro(t))} m com o caça na velocidade normal.`],
    zoomTiro: [DEPENDE, 'Quanto a câmera aproxima enquanto você segura a metralhadora. Com 0, não aproxima.',
      'O alvo fica maior na tela, mas você vê menos em volta.', 'Você vê mais em volta, mas o alvo fica menor.',
      (t) => `A câmera fica ${n(1 + t.zoomTiro / 100, 1)} vez mais perto.`],

    missilTempo: [MENOR, 'Quantos segundos o inimigo precisa ficar dentro do círculo para o míssil travar. Vale também para eles contra você.',
      'Demora mais para travar, e fica mais fácil fugir do círculo.', 'Trava quase na hora, para todos.'],
    missilDistancia: [MAIOR, 'A maior distância em que o míssil trava. É também o círculo de dentro do radar.',
      'Trava de mais longe, para você e para eles.', 'É preciso chegar mais perto para lançar.'],
    missilVel: [DEPENDE, 'A velocidade máxima do míssil.',
      'Chega mais rápido e sobra menos tempo para reagir, mas a curva fica mais aberta e ele passa direto com mais facilidade.', 'Dá mais tempo para fugir, mas a curva dele fica mais fechada.',
      (t) => `Anda ${n(t.missilVel / 3.6)} m a cada segundo.`],
    missilTempoVel: [MENOR, 'Quantos segundos o míssil leva para sair da velocidade do caça até a velocidade máxima dele.',
      'Sai mais devagar, e dá mais tempo para reagir.', 'Dispara quase na velocidade máxima.'],
    missilCurva: [MAIOR, 'Quantos graus o míssil consegue virar em 1 segundo para ir atrás do alvo. É a força de perseguição dele. Se o alvo sair 75° da frente do míssil, ele perde a trava e segue reto.',
      'Fica mais difícil de despistar: acompanha melhor as curvas e acerta mais.', 'Faz curvas abertas: uma curva fechada do alvo faz ele passar direto.',
      (t) => { const m = raioCurva(t.missilVel, t.missilCurva), c = raioCurva(t.velNormal, t.curvaNormal); return `O míssil vira num círculo de ${n(m)} m de raio, e o caça na velocidade normal, de ${n(c)} m. ` + (m > c ? 'O caça vira mais fechado: por isso uma curva forte consegue despistar.' : 'O míssil vira mais fechado que o caça: só a curva quase não despista.'); }],
    missilAr: [MAIOR, 'Quantos segundos o míssil voa antes de explodir sozinho. Junto com a velocidade, define até onde ele persegue.',
      'Persegue por mais tempo e vai mais longe.', 'Explode antes: dá para fugir só ganhando distância.',
      (t) => `Voa até uns ${n(alcanceMissil(t, t.missilVel, t.missilTempoVel, t.missilAr), 1)} km.`],
    missilQtd: [MAIOR, 'Quantos mísseis cada caça leva, o seu e os do computador.',
      'Mais mísseis para todos.', 'Cada míssil passa a valer mais.'],
    missilVolta: [MENOR, 'De quantos em quantos segundos volta 1 míssil, até encher de novo.',
      'Demora mais para ter míssil de novo.', 'Os mísseis voltam mais rápido.'],
    missilDano: [MAIOR, 'Quanto da vida um acerto tira. Todo caça tem 100% de vida.',
      'Derruba com menos acertos, e você também cai com menos.', 'São precisos mais acertos.',
      (t) => acertos(t.missilDano)],

    fogueteVel: [MAIOR, 'A velocidade máxima do míssil normal.',
      'Chega antes, e fica mais fácil acertar quem se mexe.', 'Dá tempo de o alvo sair da frente.',
      (t) => `Anda ${n(t.fogueteVel / 3.6)} m a cada segundo.`],
    fogueteTempoVel: [MENOR, 'Quantos segundos ele leva para sair da velocidade do caça até a velocidade máxima dele.',
      'Sai mais devagar.', 'Dispara quase na velocidade máxima.'],
    fogueteAr: [MAIOR, 'Quantos segundos ele voa antes de explodir sozinho. Junto com a velocidade, define o alcance.',
      'Vai mais longe.', 'Explode antes de chegar em quem está longe.',
      (t) => `Voa até uns ${n(alcanceMissil(t, t.fogueteVel, t.fogueteTempoVel, t.fogueteAr), 1)} km.`],
    fogueteQtd: [MAIOR, 'Quantos mísseis normais cada caça leva, o seu e os do computador.',
      'Mais tiros para todos.', 'Cada um passa a valer mais.'],
    fogueteVolta: [MENOR, 'De quantos em quantos segundos volta 1, até encher de novo.',
      'Demora mais para ter de novo.', 'Voltam mais rápido.'],
    fogueteDano: [MAIOR, 'Quanto da vida um acerto tira. Todo caça tem 100% de vida.',
      'Derruba com menos acertos, e você também cai com menos.', 'São precisos mais acertos.',
      (t) => acertos(t.fogueteDano)],

    flaresQtd: [MAIOR, 'Quantas vezes cada caça pode soltar flares. Na sobrevivência não voltam; no mata-mata, voltam ao renascer.',
      'Mais chances de escapar dos mísseis, para você e para eles.', 'Cada salva precisa ser usada na hora certa. Com 0, ninguém tem.'],
    flaresAlcance: [MAIOR, 'Os flares só enganam um míssil que já está perto. Este número é essa distância: mais longe que isso, a salva é desperdiçada.',
      'Funcionam mais cedo.', 'É preciso esperar o míssil chegar bem perto.'],
    flaresReto: [MAIOR, 'A chance de cada míssil cair nos flares quando você solta sem estar em curva fechada.',
      'Os flares ficam mais eficazes, e os mísseis acertam menos.', 'Os flares falham mais: é preciso fazer a curva junto.'],
    flaresCurva: [MAIOR, 'A mesma chance, soltando em curva fechada: com o manche mais que meio puxado. Para os caças do computador, é quando estão fugindo.',
      'Os flares ficam mais eficazes, e os mísseis acertam menos.', 'Mesmo com a curva, os flares falham mais.'],
    flaresEspera: [MENOR, 'Quantos segundos é preciso esperar depois de uma salva para soltar outra.',
      'Não dá para soltar uma salva logo depois da outra.', 'Dá para soltar salvas seguidas.'],

    pilotoCurva: [PILOTO_MAIOR, 'Quanto da curva do caça o piloto usa para perseguir alguém. Com 100%, ele vira tanto quanto você com o manche todo puxado.',
      'Ele faz curvas mais fechadas e fica mais difícil de despistar.', 'Ele faz curvas largas e fica fácil entrar atrás dele.'],
    pilotoPrevisao: [PILOTO_MAIOR, 'Quantos segundos à frente o piloto olha para não bater no chão, em morros e em prédios.',
      'Ele sobe antes e quase não bate.', 'Ele bate mais quando persegue alguém rente ao chão: dá para derrubá-lo voando baixo.'],
    evitarTempo: [DEPENDE, 'Quantos segundos à frente o piloto calcula se vai passar perto de outro caça. Se for passar, ele quebra a curva para longe.',
      'Desvia mais cedo e com folga, mas larga o ataque antes.', 'Desvia em cima da hora e ataca por mais tempo. Baixo demais, ele pode bater.'],
    evitarDistancia: [DEPENDE, 'A distância em que o piloto quer passar dos outros caças. Se a conta der menos que isso, ele desvia. Vale para você, inimigos e aliados.',
      'Passa mais longe de todos, mas larga o ataque mais vezes.', 'Passa mais perto e aumenta o risco de batida. Com 0, o desvio desliga e os caças voltam a bater de frente.'],
    pilotoRajada: [PILOTO_MAIOR, 'Quantos tiros o piloto dá de cada vez, antes de parar.',
      'Rajadas mais longas e mais dano.', 'Rajadas mais curtas e menos dano.'],
    pilotoPausa: [PILOTO_MENOR, 'Quantos segundos, em média, ele espera entre uma rajada e outra.',
      'Passa mais tempo sem atirar.', 'Atira quase sem parar.'],
    pilotoPontaria: [PILOTO_MAIOR, 'O quanto o piloto mira à frente do alvo, no ponto onde os tiros vão encontrá-lo. 100% é a conta certa; 0% é mirar onde o alvo está agora, e os tiros passam atrás.',
      'Ele acerta mais, mesmo com você em movimento.', 'Os tiros dele passam mais atrás de você.'],
    pilotoAntecipa: [PILOTO_MAIOR, 'O quanto o piloto conta com a curva que o alvo está fazendo. Com 0%, ele mira como se o alvo fosse seguir reto.',
      'Ele continua acertando mesmo com você em curva.', 'Fazer uma curva já basta para sair dos tiros dele.'],
    pilotoEspera: [PILOTO_MENOR, 'Quantos segundos, em média, o piloto espera entre um lançamento e outro, de míssil e de foguete.',
      'Ele lança menos.', 'Ele lança mais seguido.'],
    pilotoMisseis: [PILOTO_MAIOR, 'Quantos mísseis dos pilotos podem estar no ar ao mesmo tempo contra o mesmo alvo.',
      'Vêm vários juntos, e fica mais difícil despistar todos.', 'Vêm menos mísseis de uma vez.'],
    pilotoFuga: [PILOTO_MAIOR, 'O quanto o piloto reage para fugir quando tem alguém colado atrás dele ou um míssil chegando. Com 0%, ele nunca foge.',
      'Ele foge mais depressa, e fica mais difícil mantê-lo na mira.', 'Ele fica mais tempo voando reto na sua frente.'],
    pilotoFlares: [PILOTO_MAIOR, 'A chance de o piloto soltar flares quando um míssil chega perto dele.',
      'Seus mísseis acertam menos.', 'Seus mísseis acertam mais.'],

    cacasNoNivel: [{ tipo: 'dificil', texto: '▲ Maior = jogo mais difícil' }, 'Quantos caças inimigos vêm neste nível.',
      'Mais inimigos para enfrentar.', 'O nível fica mais fácil e mais curto.'],
    chegadaIntervalo: [{ tipo: 'dificil', texto: '▼ Menor = jogo mais difícil' }, 'Quantos segundos entre a chegada de um caça e a do próximo, no começo do nível.',
      'Chegam aos poucos: dá para enfrentar um de cada vez.', 'Chegam quase todos juntos.'],
    consertoCasco: [{ tipo: 'bom', texto: '▲ Maior = jogo mais fácil' }, 'Quanto de vida você recupera ao chegar neste nível, até o máximo de 100%.',
      'Você chega com mais vida.', 'Os danos se acumulam de um nível para o outro.'],
    duracaoPartida: [DEPENDE, 'Quantos minutos dura a partida. Ganha a equipe com mais pontos.',
      'Partidas mais longas.', 'Partidas mais curtas.'],
    renascerTempo: [MENOR, 'Quantos segundos até voltar para a base depois de cair. Vale para você e para os caças do computador.',
      'Cair custa mais caro.', 'Volta logo para a briga.'],
    renascerProtecao: [MAIOR, 'Quantos segundos nada acerta o caça logo depois de voltar para a base. Vale para você e para os caças do computador.',
      'Mais tempo para sair da base em segurança.', 'Dá para ser acertado logo ao voltar.'],
    radarAlcance: [DEPENDE, 'A distância que a borda do radar representa. Quem está mais longe aparece na borda, mais apagado, só para mostrar o lado.',
      'Mostra caças mais longe, mas eles ficam mais juntos no centro.', 'Mostra melhor quem está perto, mas enxerga menos longe.'],
  };

  const ehItem = (i) => typeof i !== 'string';
  const ITENS = GRUPOS.flatMap((g) => g.itens).filter(ehItem);
  for (const i of ITENS) {
    const [selo, como, mais, menos, exemplo] = AJUDA[i.id];
    Object.assign(i, { selo, como, mais, menos, exemplo });
  }
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
