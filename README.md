# VOO-LIVRE
MELHOR JOGO DE AVIAO

**Jogar agora:** https://alexruto64-bot.github.io/VOO-LIVRE/

Jogo de avião em 3D para o navegador do computador: um caça, o céu e o teclado. Voe sobre uma floresta sem fim ou
sobre campos e lagos, com céus de fotografia, e enfrente ondas de caças inimigos no modo sobrevivência.

## Os caças

Na tela de início você escolhe qual caça pilotar. São modelos 3D de artistas do Sketchfab, com licença CC BY 4.0
(uso livre com crédito ao autor):

- **F-16D Fighting Falcon** — [General Dynamics F-16D Block 60](https://sketchfab.com/3d-models/general-dynamics-f-16d-block-60-ea8edb08d79e4eafa9c794c581f88cf3), por Muhamad Mirza Arrafi.
- **F-14 Tomcat** — [F-14 Tomcat Top Gun (Gear Up)](https://sketchfab.com/3d-models/f-14-tomcat-top-gun-gear-up-downloadable-9d2d0c87539046aa8c2198fcc47cdcf8), por dwsd.
- **F/A-18F Super Hornet** — [Boeing F/A-18E/F "Super Hornet"](https://sketchfab.com/3d-models/boeing-fa-18ef-super-hornet-f71e9fea01e24fea9b1b380161d21d38), por andertan.

Os arquivos ficam em `modelos/` (formato glTF binário, `.glb`) e são carregados só quando o caça é escolhido. Acima de
82% de motor a pós-combustão acende.

## Cenários

Escolhidos na tela de início. A escolha (e a do céu) fica guardada no navegador.

- **Floresta:** mata fechada sem fim, com morros e estrada de terra. É um quadro de floresta de uns 395 m (modelo 3D em
  `cenarios/floresta/`) repetido lado a lado e espelhado a cada quadro, para o relevo e a textura do chão emendarem sem
  degrau. Para não pesar:
  - árvores em 3D só perto do avião e só para o lado em que a câmera olha;
  - mais longe, o chão usa uma "foto de cima" do quadro, montada pelo próprio jogo com as copas das árvores;
  - o alcance das árvores 3D se ajusta sozinho: diminui se o jogo ficar lento e aumenta se sobrar fôlego.
- **Campos:** o mapa de antes, com lavouras, matas, lagos e estradas desenhados numa textura que se repete.

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
  fechada no último segundo faz ele passar direto. Se acertar, tira 30% do casco.

## Armas

- **Metralhadora** (Z): tiros infinitos.
- **Míssil guiado** (Espaço): 4 por vez. Precisa de alvo travado: mantenha a mira num inimigo por quase 1 segundo, até a
  caixa ficar azul. Um míssil novo volta a cada 20 s.
- **Foguete** (X): 12 por vez, voa reto. Um foguete novo volta a cada 6 s.

Na tela: a mira azul mostra para onde o nariz aponta; as caixas vermelhas marcam os inimigos com a distância; a seta
na borda aponta para o inimigo mais perto quando ele está fora da tela.

## Sons

Ficam em `SONS/`.

- **Motor:** ronco de turbina em repetição, mais agudo e mais alto com o motor e a velocidade. Acima de 82% entra o
  ronco da pós-combustão.
- **Armas:** disparo do canhão (os tiros dos inimigos também soam, mais longe e do lado de onde vêm) e lançamento de
  míssil.
- **Caça passando perto:** o jogo calcula quando e a que distância cada inimigo vai passar e começa o som adiantado,
  para o pico cair na passagem. Até 100 m toca o rasante (`PASSANDO LADO RAPIDO.mp3`); até 280 m, a passagem mais longe
  (`AVIAO PASSANDO 1.mp3`). O som vem do lado em que o caça está.
- **Míssil vindo:** os bipes de `MISSEL CHEGANDO.mp3` repetem enquanto um míssil persegue você e ficam mais agudos
  quando ele chega perto.

Motor, pós-combustão, canhão e lançamento de míssil são do Freesound, licença CC0:
[Idle F-22 Jet Plane](https://freesound.org/people/qubodup/sounds/187734/),
[Autocannon Shot 1](https://freesound.org/people/qubodup/sounds/854183/) e
[Launching Anti-Tank Missiles](https://freesound.org/people/qubodup/sounds/184274/), por qubodup;
[Afterburner](https://freesound.org/people/TiesWijnen/sounds/413312/), por TiesWijnen.

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
| C         | Trocar câmera (atrás do avião ou cabine)    |
| I         | Inverter ↑ ↓                                |
| P ou Esc  | Pausar (na pausa dá para trocar de caça)    |
| R         | Recomeçar                                   |
| H         | Mostrar ou esconder a lista de comandos     |

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
- **Batida:** no voo livre, encostar no chão ou numa árvore recomeça o voo. Na sobrevivência, acaba o voo.

O mundo não tem fim: na floresta, o quadro de mata se repete em todas as direções; nos campos, o chão é uma textura de
1,6 km que se repete. As árvores e as nuvens são reposicionadas em volta do avião enquanto ele voa.

## Como publicar uma versão nova

O site é publicado pelo GitHub Pages a partir da pasta raiz do branch `main`. Qualquer alteração enviada ao `main`
aparece no endereço acima em cerca de um minuto. O jogo é um arquivo só (`index.html`) e precisa de internet para
carregar a biblioteca 3D (three.js) e as fontes.
