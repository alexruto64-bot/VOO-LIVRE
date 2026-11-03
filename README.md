# VOO-LIVRE
MELHOR JOGO DE AVIAO

**Jogar agora:** https://alexruto64-bot.github.io/VOO-LIVRE/

Jogo de avião em 3D para o navegador, no computador (teclado) ou no celular deitado (controles na tela). Quatro caças,
seis cenários (floresta, campos, cidade, duas ilhas de verdade e um mar com ilhotas), céus de fotografia e ondas de
caças inimigos no modo sobrevivência. Dá para instalar como app e jogar sem internet.

## Os caças

Na tela de início você escolhe qual caça pilotar. Os três primeiros são modelos 3D de artistas do Sketchfab, com
licença CC BY 4.0 (uso livre com crédito ao autor):

- **F-16D Fighting Falcon** — [General Dynamics F-16D Block 60](https://sketchfab.com/3d-models/general-dynamics-f-16d-block-60-ea8edb08d79e4eafa9c794c581f88cf3), por Muhamad Mirza Arrafi.
- **F-14 Tomcat** — [F-14 Tomcat Top Gun (Gear Up)](https://sketchfab.com/3d-models/f-14-tomcat-top-gun-gear-up-downloadable-9d2d0c87539046aa8c2198fcc47cdcf8), por dwsd.
- **F/A-18F Super Hornet** — [Boeing F/A-18E/F "Super Hornet"](https://sketchfab.com/3d-models/boeing-fa-18ef-super-hornet-f71e9fea01e24fea9b1b380161d21d38), por andertan.
- **F-16C Viper** — tirado do arquivo `Jet and flame fire with material.blend` (origem e licença a confirmar). O trem
  de pouso, que vem baixado no modelo, é escondido no voo.

Os arquivos ficam em `modelos/` (formato glTF binário, `.glb`) e são carregados só quando o caça é escolhido.

**Fogo dos motores:** refeito com a receita do material de fogo do F-16C no Blender: uma bola de fogo amassada saindo
do bocal, com ruído que muda o tempo todo, laranja-avermelhada e quase branca onde é mais densa, e um brilho em volta.
Aparece fraca a partir de 55% de motor e cresce na pós-combustão (acima de 82%). Inimigos e mísseis usam o mesmo fogo.

## Cenários

Escolhidos na tela de início. A escolha (e a do céu) fica guardada no navegador.

- **Floresta:** mata fechada sem fim, com morros, estrada de terra e três vilas em clareiras. É um quadro de floresta
  de uns 395 m (modelo [a forest (3) with a road at night for game](https://sketchfab.com/3d-models/a-forest-3-with-a-road-at-night-for-game-61f8c7817fe6457fb26e4814cfc48a3f),
  por dasy444, CC BY 4.0, em `cenarios/floresta/`) repetido lado a lado e espelhado a cada quadro, para o relevo e a
  textura do chão emendarem sem degrau. Para não pesar:
  - árvores em 3D só perto do avião e só para o lado em que a câmera olha;
  - mais longe, até o horizonte, "fotos de lado" das árvores montadas pelo próprio jogo, cada vez mais ralas;
  - o alcance das árvores se ajusta sozinho: diminui se o jogo ficar lento e aumenta se sobrar fôlego.
- **Campos:** lavouras, matas, lagos e estradas desenhados numa textura que se repete, com um aeroporto (pista pintada
  no chão) e duas vilas.
- **Cidade:** nove quarteirões de prédios para passar no meio, cercados de campos.
- **Açores:** a Ilha do Pico, com o vulcão de 2.350 m, no meio do mar. Relevo e foto de satélite do modelo
  [Ilha do Pico, Azores, Portugal](https://sketchfab.com/3d-models/ilha-do-pico-azores-portugal-54f9cfe3429741089dc22ec37a8839f4),
  por CMPLab (CC BY 4.0; feito com dados ALOS AW3D30 e Landsat).
- **Cabo Verde:** as ilhas do Fogo e da Brava, com a cratera do vulcão. Do modelo
  [Islas Fogo y Brava, Cabo Verde](https://sketchfab.com/3d-models/islas-fogo-y-brava-cabo-verde-a851f7640f294748a7bc59c38da46fbe),
  por CMPLab (CC BY 4.0; dados ASTER GDEM e Landsat).
- **Ilhotas:** mar aberto com ilhotas do Brasil em 3D (fotogrametria), repetidas com outro tamanho e outro rumo para
  formar um arquipélago: [Ilha de Urubuqueçaba](https://sketchfab.com/3d-models/ilha-de-urubuquecaba-4aec6c8b87bf4f7c9416c913fa1e1e66),
  por Emilio Cid, e a pedra de [Gravuras rupestres próximas à Ilha das Meninas](https://sketchfab.com/3d-models/gravuras-rupestres-proximas-a-ilha-das-meninas-13befe10866044d797eaea0265f3d222),
  por GeoHereditas (as duas CC BY 4.0; simplificadas e com as texturas refeitas para o jogo). O fundo do mar é feito pelo
  próprio jogo: raso e claro na beira das pedras, com espuma, e fundo mais longe.

Nas ilhas o mar tem ondas, reflexo do céu, brilho do sol, água rasa na praia e espuma. As fotos de satélite estão em
`cenarios/pico/` e `cenarios/caboverde/` (4096 px, ou 2048 px no celular), com as nuvens da foto apagadas.

**Construções:** vila, cidade e aeroporto são modelos glTF em `cenarios/construcoes/`, cada um com um mapa das alturas
das partes sólidas visto de cima, que é a colisão (dá para bater nos prédios e voar entre eles). Origem e licença dos
três modelos a confirmar.

## Céus

Três fotos de céu do [Poly Haven](https://polyhaven.com/hdris/skies) (licença CC0), na versão "só céu", que fica boa
vista do alto. A luz do sol, a névoa e a cor das nuvens acompanham cada foto.

- **Dia com nuvens** (Kloofendal 48d Partly Cloudy)
- **Entardecer** (Kloppenheim 06)
- **Nublado** (Kloofendal Overcast)

As fotos ficam em `ceu/`, cortadas do topo até um pouco abaixo do horizonte, em 8192 px (telas grandes) e 4096 px.

## Modos

- **Voo livre:** só você, o caça e o céu.
- **Sobrevivência:** ondas de caças inimigos. Cada nível traz mais caças (até 8), mais rápidos, que curvam mais
  apertado e atiram melhor. Derrube todos para passar de nível. O casco aguenta uns 25 tiros; chegando a zero, ou
  batendo no chão, o voo acaba e a pontuação fica na tela.
- **Mísseis inimigos:** de vez em quando um inimigo lança um míssil guiado em você (mais vezes nos níveis altos). Toca
  um bipe e aparece o aviso MÍSSIL. O míssil é um pouco mais lento que o caça a toda e curva menos: uma curva bem
  fechada no último segundo faz ele passar direto, e os flares enganam. Se acertar, tira 30% do casco.

## Armas

- **Metralhadora** (Z): tiros infinitos.
- **Míssil guiado** (Espaço): 4 por vez. Precisa de alvo travado: mantenha a mira num inimigo por quase 1 segundo, até a
  caixa ficar azul. Um míssil novo volta a cada 20 s.
- **Foguete** (X): 12 por vez, voa reto. Um foguete novo volta a cada 6 s.
- **Flares** (F): solta uma salva de 6 chamarizes de calor atrás do avião. Cada míssil que vem atrás de você tem 85% de
  chance de ir atrás dos flares e estourar neles. São 5 salvas; uma nova volta a cada 12 s. Os inimigos também soltam
  flares contra os seus mísseis (mais nos níveis altos).

Na tela: a mira azul mostra para onde o nariz aponta; as caixas vermelhas marcam os inimigos com a distância; a seta
na borda aponta para o inimigo mais perto quando ele está fora da tela.

## Explosões

- **No ar:** duas sequências de imagens de explosão de verdade (`efeitos/`, dos arquivos "Realtime explosion"
  Explosion 1 e 2; origem e licença a confirmar), com clarão, faíscas e destroços em chamas que caem.
- **No chão ou numa construção:** explosão maior, poeira, faíscas, destroços que quicam e as chapas de metal da
  simulação do `explosionfisic.blend` (207 chapas que voam com a velocidade das partículas da simulação, giram e ficam
  espalhadas no chão), mais um foco de fogo com fumaça preta que fica queimando. A câmera treme e se afasta para mostrar.
- **Na água:** coluna d'água, espuma e um pouco de fogo.

## Sons

Ficam em `SONS/`.

- **Motor:** ronco de turbina em repetição, mais agudo e mais alto com o motor e a velocidade. Acima de 82% entra o
  ronco da pós-combustão.
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

## Comandos

| Tecla     | O que faz                                   |
| --------- | ------------------------------------------- |
| ↓ ↑       | Puxar / empurrar o manche (nariz sobe / desce) |
| ← →       | Inclinar as asas. Para curvar, incline e puxe |
| A D       | Leme: vira o nariz de lado                  |
| W S       | Mais motor / menos motor                    |
| Z         | Metralhadora                                |
| Espaço    | Míssil guiado                               |
| X         | Foguete                                     |
| F         | Flares                                      |
| T         | Segure para olhar para trás (câmera na frente do avião) |
| C         | Trocar câmera (atrás do avião ou cabine)    |
| I         | Inverter ↑ ↓                                |
| P ou Esc  | Pausar (na pausa dá para trocar de caça)    |
| R         | Recomeçar                                   |
| H         | Mostrar ou esconder a lista de comandos     |

## No celular

O jogo é só na horizontal: com o celular em pé ele pausa e pede para deitar o aparelho. Ao decolar, entra em tela cheia.

- **Lado esquerdo:** encoste e arraste para pilotar. O manche aparece onde o dedo encostou; para baixo o nariz sobe,
  para os lados inclina as asas.
- **Lado direito:** a barra do motor (arraste para cima e para baixo) e os botões de tiro (segure), míssil, foguete e
  flares, com a quantidade que sobra de cada um.
- **Em cima:** olhar para trás (segure), trocar câmera e pausar.

No celular o jogo usa texturas menores e um alcance menor de árvores, para rodar liso.

## App e jogo sem internet

Na tela de início, em **Jogar sem internet**:

- **Baixar tudo** guarda neste aparelho os arquivos que o jogo usa (uns 50 MB; no celular, as versões menores das
  texturas). Depois disso o jogo abre e roda sem internet. Se a internet cair no meio, é só tocar de novo para continuar.
- **Instalar o app** (Chrome e Edge, no Android e no computador) põe o jogo com ícone próprio, em tela cheia e deitado.
  No iPhone e no iPad: Compartilhar → Adicionar à Tela de Início.

Quem guarda os arquivos é o service worker (`sw.js`): a página vem da internet quando dá, para pegar a versão nova; o
resto vem da cópia guardada, e o que o jogo carregar com internet também fica guardado. O manifesto do app é o
`manifest.webmanifest` e os ícones ficam em `icones/`.

## Como o voo funciona

- **Velocidade:** o motor empurra e o ar segura. Só no motor o caça chega a uns 1.100 km/h; com pós-combustão
  (acima de 82%) passa de 1.900 km/h. Subir gasta velocidade, mergulhar ganha.
- **Curva:** como num caça de verdade, inclinar as asas sozinho não vira. Incline (← →) e puxe o manche (↓): quanto
  mais inclinado, mais a puxada vira o nariz. O manche (↑ ↓) gira o nariz rápido (o dobro da versão 4), e em alta
  velocidade a curva continua mais larga.
- **Sem piloto automático:** o caça fica na posição em que você deixou. Inclinado, de faca ou de cabeça para baixo, ele
  continua assim até você mexer de novo; as asas não voltam sozinhas ao nível.
- **Estol:** abaixo de 216 km/h as asas perdem sustentação. O nariz cai e aparece o aviso ESTOL até o caça ganhar
  velocidade de novo.
- **Teto:** acima de 12.000 m o ar fica rarefeito e o motor perde força.
- **Batida:** bater no chão, numa árvore, numa construção ou na água explode o caça (ou faz o respingo). No voo livre o
  voo recomeça sozinho; na sobrevivência, acaba o voo.

O mundo não tem fim: na floresta, o quadro de mata se repete em todas as direções; nos campos, o chão é uma textura de
1,6 km que se repete; nas ilhas, o mar continua em volta. As árvores e as nuvens são reposicionadas em volta do avião
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
