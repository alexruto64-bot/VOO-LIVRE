# VOO-LIVRE
MELHOR JOGO DE AVIAO

**Jogar agora:** https://alexruto64-bot.github.io/VOO-LIVRE/

Jogo de avião em 3D para o navegador, no computador (teclado) ou no celular deitado (controles na tela). Quatro caças,
quatro cenários (floresta, uma cidade grande, os Açores com ilhas de verdade e um mar com ilhotas), céus de fotografia
e três modos: voo livre, sobrevivência (você contra ondas de caças) e mata-mata 5 × 5 em equipe. Abre numa capa, como
um jogo de console, com menu, configurações de gráficos e de som e música de fundo. Dá para instalar como app e jogar
sem internet.

## Menu e configurações

O jogo abre na capa: uma arte feita por inteligência artificial, com uma cidade à beira-mar e o céu laranja do pôr do sol,
em `texturas/capa_cidade.jpg` (`capa_cidade_peq.jpg` em telas pequenas). Foi gerada com o
[FLUX.1 schnell](https://huggingface.co/black-forest-labs/FLUX.1-schnell), da Black Forest Labs (licença Apache 2.0), e
o céu foi esquentado depois. Um toque ou uma tecla leva ao menu principal, com a mesma arte atrás. Na tela Jogar aparecem
o caça e o cenário escolhidos, com a câmera passeando em volta dele:

- **Jogar:** modo, caça, cenário (com miniaturas, `cenarios/*_mini.jpg`) e céu, e o botão Decolar. As escolhas ficam
  guardadas no navegador.
- **Configurações:** gráficos em baixo, médio ou alto (o jogo recarrega para trocar); volume geral, da música e dos
  efeitos; sensibilidade do manche; inverter o manche; câmera tremendo com as explosões; e o jogo sem internet. A pausa
  também abre as Configurações (menos os gráficos, que só mudam no menu).
- **Como jogar:** os comandos do teclado e do celular, as armas, os pontos e os modos.
- **Créditos:** de onde vem cada modelo, textura, céu, som e música.

Gráficos: **alto** (o padrão no computador) tem as texturas grandes, mais árvores e o alcance maior; **médio** (o padrão
no celular) usa texturas menores e menos árvores; **baixo** é o médio com menos pixels na tela, sem suavizar o
serrilhado, com menos fumaça e com as árvores e os detalhes do chão mais perto.

No menu dá para usar as setas ↑ ↓, Enter e Esc, e as opções fazem um tique ao passar e ao escolher. O recorde da
sobrevivência (pontos e nível) fica guardado neste navegador e aparece no menu; quando você o bate, o fim de voo mostra
"Novo recorde!".

## Os caças

Na tela Jogar você escolhe qual caça pilotar. Os três primeiros são modelos 3D de artistas do Sketchfab, com
licença CC BY 4.0 (uso livre com crédito ao autor):

- **F-16D Fighting Falcon** — [General Dynamics F-16D Block 60](https://sketchfab.com/3d-models/general-dynamics-f-16d-block-60-ea8edb08d79e4eafa9c794c581f88cf3), por Muhamad Mirza Arrafi.
- **F-14 Tomcat** — [F-14 Tomcat Top Gun (Gear Up)](https://sketchfab.com/3d-models/f-14-tomcat-top-gun-gear-up-downloadable-9d2d0c87539046aa8c2198fcc47cdcf8), por dwsd.
- **F/A-18F Super Hornet** — [Boeing F/A-18E/F "Super Hornet"](https://sketchfab.com/3d-models/boeing-fa-18ef-super-hornet-f71e9fea01e24fea9b1b380161d21d38), por andertan.
- **F-16C Viper** — tirado do arquivo `Jet and flame fire with material.blend` (origem e licença a confirmar). O trem
  de pouso, que vem baixado no modelo, é escondido no voo.

Os arquivos ficam em `modelos/` (formato glTF binário, `.glb`) e são carregados só quando o caça é escolhido.

**Fogo dos motores:** refeito com a receita do material de fogo do F-16C no Blender: uma bola de fogo amassada saindo
do bocal, com ruído que muda o tempo todo, laranja-avermelhada e quase branca onde é mais densa, e um brilho em volta.
Aparece fraca na velocidade normal e cresce quando você acelera. Inimigos e mísseis usam o mesmo fogo.

## Cenários

Escolhidos na tela Jogar. A escolha (e a do céu) fica guardada no navegador.

- **Floresta:** mata fechada sem fim, com morros, estrada de terra e três vilas em clareiras. É um quadro de floresta
  de uns 395 m (modelo [a forest (3) with a road at night for game](https://sketchfab.com/3d-models/a-forest-3-with-a-road-at-night-for-game-61f8c7817fe6457fb26e4814cfc48a3f),
  por dasy444, CC BY 4.0, em `cenarios/floresta/`) repetido lado a lado e espelhado a cada quadro, para o relevo e a
  textura do chão emendarem sem degrau. Para não pesar:
  - árvores em 3D só perto do avião e só para o lado em que a câmera olha;
  - mais longe, até o horizonte, "fotos de lado" das árvores montadas pelo próprio jogo, cada vez mais ralas;
  - o alcance das árvores se ajusta sozinho: diminui se o jogo ficar lento e aumenta se sobrar fôlego.
- **Cidade:** uma cidade grande de uns 11 x 10 km, cercada de floresta. É uma grade de quadras de 860 x 744 m (o
  tamanho das quadras do modelo 3D do centro), cada uma com 4 x 4 lotes separados por ruas; entre as quadras, avenidas.
  No meio ficam as 9 quadras do modelo 3D (o centro, com prédios de até 350 m); em volta, uns 15 mil prédios feitos pelo
  jogo, altos perto do centro (torres de vidro de até 300 m) e mais baixos longe dele, com uma torre aqui e outra ali.
  As paredes são fotos de fachadas de verdade do [ambientCG](https://ambientcg.com/) (CC0: vidro escuro, vidro verde,
  escritório branco, tijolo, concreto e tijolo com pilares), e o vidro reflete o céu. Entre os prédios há praças,
  estacionamentos e bosques: pedaços da mata do cenário floresta, com as mesmas árvores. A leste fica o aeroporto
  (o terminal, pista de 3 km, taxiways e hangares). Dá para voar entre os prédios e bater neles (e os caças que vêm
  atrás também batem). O tipo de cada lote fica numa textura pequena, lida pelo chão e pelo gerador dos prédios.
- **Açores:** um arquipélago de uns 51 x 53 km. A Ilha do Pico, com o vulcão de 2.350 m (relevo e foto de satélite do
  modelo [Ilha do Pico, Azores, Portugal](https://sketchfab.com/3d-models/ilha-do-pico-azores-portugal-54f9cfe3429741089dc22ec37a8839f4),
  por CMPLab, CC BY 4.0; dados ALOS AW3D30 e Landsat), e ao sul as ilhas do Fogo e da Brava, com a cratera do vulcão
  do Fogo (do modelo [Islas Fogo y Brava, Cabo Verde](https://sketchfab.com/3d-models/islas-fogo-y-brava-cabo-verde-a851f7640f294748a7bc59c38da46fbe),
  por CMPLab, CC BY 4.0; dados ASTER GDEM e Landsat), mais perto do que na vida real. O jogo acrescentou obstáculos
  para fugir rente a eles: as Agulhas (34 torres de pedra de 180 a 360 m saindo do mar raso, no canal entre o Pico e o
  Fogo, com uns 300 m entre uma e outra), a Ilha dos Cânions (um planalto de uns 400 m cortado por três cânions de
  água, que dá para atravessar voando baixo) e dois ilhéus vulcânicos com cratera. No mata-mata uma equipe chega pelo
  sul e a outra pelo norte, e a briga começa no meio das Agulhas.
- **Ilhotas:** mar aberto com ilhotas do Brasil em 3D (fotogrametria), repetidas com outro tamanho e outro rumo para
  formar um arquipélago: [Ilha de Urubuqueçaba](https://sketchfab.com/3d-models/ilha-de-urubuquecaba-4aec6c8b87bf4f7c9416c913fa1e1e66),
  por Emilio Cid, e a pedra de [Gravuras rupestres próximas à Ilha das Meninas](https://sketchfab.com/3d-models/gravuras-rupestres-proximas-a-ilha-das-meninas-13befe10866044d797eaea0265f3d222),
  por GeoHereditas (as duas CC BY 4.0; simplificadas e com as texturas refeitas para o jogo). O fundo do mar é feito pelo
  próprio jogo: raso e claro na beira das pedras, com espuma, e fundo mais longe.

Nas ilhas o mar tem ondas, reflexo do céu, brilho do sol, água rasa na praia e espuma. O relevo e a foto de satélite
dos Açores ficam em `cenarios/acores/` (4096 px, ou 2048 px no celular), montados a partir dos do Pico e do Fogo e
Brava (ainda sobram umas nuvens na foto do Pico).

**Construções:** vila, o centro da cidade e o aeroporto são modelos glTF em `cenarios/construcoes/`, cada um com um
mapa das alturas das partes sólidas visto de cima, que é a colisão (dá para bater nos prédios e voar entre eles).
Origem e licença dos três modelos a confirmar.

**Tamanhos:** tudo foi conferido ao lado do caça (15 a 19 m de comprimento), para nenhum prédio ficar menor que ele:
a cidade e as vilas estão no dobro do tamanho original do modelo, o aeroporto em 1,5 vez, a Ilha de Urubuqueçaba em
2,6 a 3,4 vezes (uns 700 m) e as pedras em 6 a 9 vezes (300 a 470 m).

## Visual

- **Montanhas das ilhas:** o relevo entre os pontos da grade é uma curva suave (sem as quinas retas de antes), e de
  perto entram texturas de verdade do [Poly Haven](https://polyhaven.com/) (CC0): rocha, grama com pedras e terra,
  escolhidas pela inclinação e pela cor da foto de satélite, em vários tamanhos para a repetição não aparecer, com o
  relevo fino de cada uma. Nas encostas íngremes a textura também é projetada de lado, para não esticar. No mar das
  ilhotas, o fundo raso é de areia de praia.
- **Árvores dos campos e da cidade:** fotos das árvores "Island Tree" 01 e 02 do Poly Haven (CC0), tiradas de frente,
  de lado e de cima, em três planos por árvore, com 14 a 24 m de altura. A placa de vídeo leva cada árvore para perto
  da câmera, sem custo a cada quadro. De longe, o chão das matas é pintado com copas vistas de cima feitas com as
  mesmas fotos. As texturas ficam em `texturas/` (no celular, as versões `_peq`).

## Céus

Três fotos de céu do [Poly Haven](https://polyhaven.com/hdris/skies) (licença CC0), na versão "só céu", que fica boa
vista do alto. A luz do sol, a névoa e a cor das nuvens acompanham cada foto.

- **Dia com nuvens** (Kloofendal 48d Partly Cloudy)
- **Entardecer** (Kloppenheim 06)
- **Nublado** (Kloofendal Overcast)

As fotos ficam em `ceu/`, cortadas do topo até um pouco abaixo do horizonte, em 8192 px (telas grandes) e 4096 px.

## Modos

- **Voo livre:** só você, o caça e o céu.
- **Sobrevivência:** só você contra ondas de caças inimigos, até acabar a vida. Os caças são iguais ao seu; o que muda é o
  piloto. No nível 1 são 2 caças com pilotos fracos, que usam 60% da curva, atiram pouco e demoram a lançar mísseis; cada
  nível traz um caça a mais (até 8), com pilotos que curvam mais apertado, atiram melhor, antecipam para onde você vai,
  fogem de quem está atrás deles e usam mais os flares. Ao passar de nível o casco ganha um conserto de 25%.
- **Mata-mata 5 × 5:** a sua equipe (você e mais 4 caças do computador, a equipe 1) contra outra de 5, por 5 minutos.
  Cada equipe nasce de um lado do mapa; quem cai volta na base da equipe uns segundos depois. Ganha a equipe com mais
  pontos (a soma dos pontos dos pilotos). No fim aparece o placar das duas equipes, do melhor para o pior; os 3
  primeiros da equipe que venceu ganham medalha. Os companheiros aparecem com um losango verde e o nome; em cima, no
  meio, o placar das equipes e o relógio; no canto, quem derrubou quem. Na pausa dá para ver o placar.

## Vida e pontos

- Todos os caças têm vida de 100%. Um míssil guiado tira 50%; um foguete (o míssil sem guia), 60%; a metralhadora
  acertando sem parar acaba com a vida em 5 segundos (1,5% por tiro). Bater no chão, num prédio ou no mar derruba na
  hora; uma trombada tira 60%.
- Cada 1% de vida tirado de um adversário vale 1 ponto (derrubar um caça inteiro, 100 pontos). Quem derruba um caça
  sozinho, sem ninguém mais ter acertado nele, ganha mais 30 pontos.
- Um caça que bate no chão ou num prédio dá os pontos que faltavam para quem o atacou por último ou, se ninguém, para
  quem ele perseguia: fugir rente aos obstáculos derruba quem vem atrás.
- **Caças do computador:** são iguais ao seu: mesma velocidade, gasolina, curva, travas, armas e munição. Um caça do
  computador que deixa você 1,2 s dentro do círculo dele, a até 5,5 km, lança um míssil guiado. Toca um bipe e aparece o
  aviso MÍSSIL, com a distância. Uma curva bem fechada no último segundo faz o míssil passar direto, e os flares enganam,
  com as regras abaixo. Os caças do computador também lançam foguetes e, atrás de você, travam a mira como você trava.

## Armas

- **Metralhadora** (Z): tiros infinitos, 13 por segundo. Atirando, a câmera dá um zoom de 50%. Fique atrás de um
  inimigo, a até 2.500 m, com a cruz da mira em cima dele por 1,25 segundo: o anel laranja se fecha, a mira trava e o caça
  segue o inimigo sozinho.
- **Míssil guiado** (Espaço): 4 por vez. Só lança com alvo travado: o inimigo precisa ficar 1,2 segundo dentro do círculo
  tracejado (uns 14° em volta da cruz), a até 5,5 km. Com alguém dentro, o círculo cresce. Depois do tempo, o círculo e a
  caixa dele ficam vermelhos. Se ele sair do círculo, a trava cai. Voa a 5.000 km/h e curva 120° por segundo; se o alvo sai da frente dele, perde a trava e segue reto. Um míssil
  novo volta a cada 20 s.
- **Foguete** (X): 12 por vez, voa reto, a 5.000 km/h, por 8 s. Um foguete novo volta a cada 6 s.
- **Flares** (F): solta uma salva de 6 chamarizes de calor atrás do avião. Só funcionam com o míssil a menos de 2 km:
  cada míssil perto tem 45% de chance de ir atrás deles com o caça em linha reta e 80% em curva fechada (manche mais que
  meio puxado). Entre duas salvas há 3 s de espera. São 3 salvas e elas não voltam sozinhas: acabando, só quando você cair
  e renascer no mata-mata (na sobrevivência, no próximo voo). Os inimigos seguem as mesmas regras.

No mata-mata, quem cai volta na base com todas as armas e o tanque cheios.

Na tela: a mira é uma cruz pequena que mostra para onde o nariz aponta e fica vermelha quando há um inimigo embaixo dela.
Em volta dela fica o círculo tracejado do míssil: verde vazio, laranja travando e vermelho travado. Assim que um inimigo
entra no círculo, a assistência suave vai levando o nariz até ele, até 25° por segundo, sem precisar de trava; o manche
manda mais que ela. À esquerda do círculo fica
a velocidade; à direita, a gasolina. As caixas azuis marcam os inimigos com a distância e a vida, com uma barra de vida em cima, e cada acerto seu mostra o
dano em cima do inimigo; com o míssil travado, a
caixa fica vermelha e redonda. Com a mira travada (1,25 s atrás do inimigo, o anel laranja fechado), a assistência leva o
nariz até o ponto onde os tiros vão encontrar o inimigo, até 90° por segundo. Para sair, puxe o manche para o lado
contrário. A trava também solta se o nariz desvia mais de 17° desse ponto, se o inimigo fica de lado ou passa de 3.000 m.
A seta na borda aponta para o inimigo mais perto quando ele está fora da tela.

**Radar:** no canto de cima, à esquerda, nos combates. Você é o triângulo branco no centro, com a frente do caça para
cima; vermelho é inimigo, verde é companheiro, e cada triângulo aponta para onde aquele caça voa. O círculo de dentro
marca 5,5 km, o alcance do míssil; quem está a mais de 10 km fica na borda, mais apagado.

## Explosões

- **No ar:** duas sequências de imagens de explosão de verdade (`efeitos/`, dos arquivos "Realtime explosion"
  Explosion 1 e 2; origem e licença a confirmar), com clarão, faíscas e destroços em chamas que caem.
- **No chão ou numa construção:** explosão maior, poeira, faíscas, destroços que quicam e as chapas de metal da
  simulação do `explosionfisic.blend` (207 chapas que voam com a velocidade das partículas da simulação, giram e ficam
  espalhadas no chão), mais um foco de fogo com fumaça preta que fica queimando. A câmera treme e se afasta para mostrar.
- **Na água:** coluna d'água, espuma e um pouco de fogo.

## Sons e música

Os sons ficam em `SONS/`.

- **Motor:** ronco de turbina em repetição, mais agudo e mais alto com a velocidade. Acelerando, entra o ronco da
  pós-combustão.
- **Armas:** disparo do canhão (os tiros dos inimigos também soam, mais longe e do lado de onde vêm), lançamento de
  míssil (estouro, ronco do motor e o míssil indo embora) e flares.
- **Míssil inimigo:** o ronco do motor dele fica mais alto e mais agudo conforme chega perto, e passa zunindo quando
  erra.
- **Caça passando perto:** o jogo calcula quando e a que distância cada inimigo vai passar e começa o som adiantado,
  para o pico cair na passagem. Até 100 m toca o rasante (`PASSANDO LADO RAPIDO.mp3`); até 280 m, a passagem mais longe
  (`AVIAO PASSANDO 1.mp3`). O som vem do lado em que o caça está.
- **Míssil vindo:** os bipes de `MISSEL CHEGANDO.mp3` repetem enquanto um míssil persegue você e ficam mais agudos
  quando ele chega perto.
- **Explosões:** no ar, no chão (com destroços caindo), pequenas e na água.

Do Freesound, licença CC0:
[Idle F-22 Jet Plane](https://freesound.org/people/qubodup/sounds/187734/),
[Autocannon Shot 1](https://freesound.org/people/qubodup/sounds/854183/) e
[Big Water Splash](https://freesound.org/people/qubodup/sounds/442773/), por qubodup;
[Afterburner](https://freesound.org/people/TiesWijnen/sounds/413312/), por TiesWijnen;
[rpg launcher](https://freesound.org/people/klangfabrik/sounds/249298/), por klangfabrik;
[Rocket Loop](https://freesound.org/people/Mozfoo/sounds/458377/), por Mozfoo;
[Woosh](https://freesound.org/people/northern87/sounds/88532/), por northern87;
[flare fire into sky](https://freesound.org/people/kyles/sounds/450833/), por kyles;
[explosion big 01](https://freesound.org/people/derplayer/sounds/587194/), por derplayer;
[Deep Explosion with Falling Debris](https://freesound.org/people/Robo9418/sounds/841831/), por Robo9418;
[CTS 7290](https://freesound.org/people/areniporgen/sounds/693421/), por areniporgen.

**Música** (em `musica/`): o tema do menu toca nas telas do menu, no voo livre e no fim de voo; o de batalha, nos
combates. A troca é suave e a música abaixa na pausa; o volume dela fica em Configurações. As duas são de Kevin MacLeod
([incompetech.com](https://incompetech.com/)), licença [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/),
editadas para tocar em loop e com o volume igualado:
[Five Armies](https://incompetech.com/music/royalty-free/index.html?isrc=USUAN1100875) (menu) e
[Clash Defiant](https://incompetech.com/music/royalty-free/index.html?isrc=USUAN1600003) (batalha). Os sons dos menus
(o tique ao passar por uma opção e ao escolher) são gerados pelo jogo.

## Comandos

| Tecla     | O que faz                                   |
| --------- | ------------------------------------------- |
| ↓ ↑       | Puxar / empurrar o manche (nariz sobe / desce) |
| ← →       | Inclinar as asas. Para curvar, incline e puxe |
| A D       | Leme: vira o nariz de lado                  |
| W S       | Segure: W acelera (gasta gasolina), S freia |
| Z         | Metralhadora                                |
| Espaço    | Míssil guiado                               |
| X         | Foguete                                     |
| F         | Flares                                      |
| T         | Segure para olhar para trás (câmera na frente do avião) |
| C         | Trocar câmera (atrás do avião ou cabine)    |
| I         | Inverter ↑ ↓                                |
| P ou Esc  | Pausar (na pausa: configurações, trocar de caça ou voltar ao menu) |
| R         | Recomeçar (nos combates, começa tudo de novo) |
| H         | Mostrar ou esconder a lista de comandos     |

## No celular

O jogo é só na horizontal: com o celular em pé ele pausa e pede para deitar o aparelho. Ao decolar, entra em tela cheia.

- **Lado esquerdo:** encoste e arraste para pilotar. O manche aparece onde o dedo encostou; para baixo o nariz sobe,
  para os lados inclina as asas.
- **Lado direito:** os botões de acelerar e frear (segure, um em cima do outro), tiro (segure), míssil, foguete e flares,
  com a quantidade que sobra de cada um.
- **Em cima:** olhar para trás (segure), trocar câmera e pausar.

Os botões têm ícones (as quantidades de míssil, foguete e flares aparecem embaixo de cada um). As mensagens e os avisos
aparecem embaixo do avião, à esquerda dos botões, para não tapar a vista. A velocidade e a gasolina ficam dos lados do
círculo da mira.

No celular os gráficos começam no médio (texturas menores, menos árvores e um alcance menor das texturas do chão), para
rodar liso; dá para trocar em Configurações. Os caças do computador, de longe (mais de 700 m), viram uma silhueta
simples do mesmo tamanho, para não pesar.

## App e jogo sem internet

Em **Configurações**, na parte **Jogar sem internet**:

- **Baixar tudo** guarda neste aparelho os arquivos que o jogo usa (uns 60 MB; no celular, as versões menores das
  texturas). Depois disso o jogo abre e roda sem internet. Se a internet cair no meio, é só tocar de novo para continuar.
- **Instalar o app** (Chrome e Edge, no Android e no computador) põe o jogo com ícone próprio, em tela cheia e deitado.
  No iPhone e no iPad: Compartilhar → Adicionar à Tela de Início.

Quem guarda os arquivos é o service worker (`sw.js`): a página vem da internet quando dá, para pegar a versão nova; o
resto vem da cópia guardada, e o que o jogo carregar com internet também fica guardado. O manifesto do app é o
`manifest.webmanifest` e os ícones ficam em `icones/`.

## Como o voo funciona

- **Velocidade:** sem acelerar nem frear, o caça fica nos 1.000 km/h (subindo perde um pouco, mergulhando ganha).
  Acelerar (W ou o botão de cima) leva a 2.500 km/h em uns 4,5 s. Frear (S ou o botão de baixo) não gasta nada: o caça cai
  rápido até 250 km/h (de 1.500 km/h, em 2 s) e, segurando, fica nisso.
- **Gasolina:** o tanque cheio dura 15 s de acelerador apertado. Solto, ele enche 5% por segundo (20 s do zero ao cheio),
  então dá para usar um pouco mesmo sem esperar encher. Se acabar com o botão apertado, é preciso soltar para acelerar de
  novo com o que voltou.
- **Curva:** como num caça de verdade, inclinar as asas sozinho não vira. Incline (← →) e puxe o manche (↓): quanto
  mais inclinado, mais a puxada vira o nariz. O manche (↑ ↓) gira o nariz uns 46° por segundo até 1.000 km/h (mais rápido
  se estiver devagar); daí até 2.500 km/h o caça vai ficando pesado, até 18° por segundo.
- **Sem piloto automático:** o caça fica na posição em que você deixou. Inclinado, de faca ou de cabeça para baixo, ele
  continua assim até você mexer de novo; as asas não voltam sozinhas ao nível.
- **Estol:** abaixo de 270 km/h as asas perdem sustentação. O nariz cai aos poucos, o caça afunda e aparece o aviso
  ESTOL até ganhar velocidade de novo. Segurando o freio até os 250 km/h, ele estola: é só soltar o freio e baixar o nariz.
- **Teto:** acima de 12.000 m o ar fica rarefeito e o caça perde velocidade.
- **Batida:** bater no chão, numa árvore, numa construção ou na água explode o caça (ou faz o respingo). No voo livre o
  voo recomeça sozinho; na sobrevivência, acaba o voo; no mata-mata, você volta na base da equipe.

O mundo não tem fim: na floresta, o quadro de mata se repete em todas as direções; em volta da cidade, a mata continua
(o chão é uma textura de 1,6 km que se repete); nas ilhas, o mar continua em volta. As árvores e as nuvens são reposicionadas em volta do avião
enquanto ele voa.

## Como publicar uma versão nova

O site é publicado pelo GitHub Pages a partir da pasta raiz do branch `main`. Qualquer alteração enviada ao `main`
aparece no endereço acima em cerca de um minuto. O jogo é um arquivo só (`index.html`); a biblioteca 3D (three.js
r147) vai junto, em `js/`, para o jogo rodar sem internet. Só as fontes vêm do Google (sem elas, o jogo usa as do
aparelho).

Se um arquivo do jogo mudar mantendo o mesmo nome (um modelo, uma textura, um som), aumente o número do cache em
`sw.js` (`ARQUIVOS`) e em `index.html` (`CACHE_ARQUIVOS`): assim quem baixou o jogo recebe o arquivo novo. Arquivo novo,
com nome novo, não precisa disso; só precisa entrar na lista de `arquivosDoJogo()` no `index.html`, para o "Baixar
tudo" pegar.
