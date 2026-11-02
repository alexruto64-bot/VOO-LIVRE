# VOO-LIVRE
MELHOR JOGO DE AVIAO

**Jogar agora:** https://alexruto64-bot.github.io/VOO-LIVRE/

Jogo de avião em 3D para o navegador do computador: um caça, o céu e o teclado. Sem inimigos, sem missão e sem
história, só voar sobre campos, matas, lagos e estradas de terra.

## Os caças

Na tela de início você escolhe qual caça pilotar. São modelos 3D de artistas do Sketchfab, com licença CC BY 4.0
(uso livre com crédito ao autor):

- **F-16D Fighting Falcon** — [General Dynamics F-16D Block 60](https://sketchfab.com/3d-models/general-dynamics-f-16d-block-60-ea8edb08d79e4eafa9c794c581f88cf3), por Muhamad Mirza Arrafi.
- **F-14 Tomcat** — [F-14 Tomcat Top Gun (Gear Up)](https://sketchfab.com/3d-models/f-14-tomcat-top-gun-gear-up-downloadable-9d2d0c87539046aa8c2198fcc47cdcf8), por dwsd.
- **F/A-18F Super Hornet** — [Boeing F/A-18E/F "Super Hornet"](https://sketchfab.com/3d-models/boeing-fa-18ef-super-hornet-f71e9fea01e24fea9b1b380161d21d38), por andertan.

Os arquivos ficam em `modelos/` (formato glTF binário, `.glb`) e são carregados só quando o caça é escolhido. Acima de
82% de motor a pós-combustão acende.

## Comandos

| Tecla     | O que faz                                   |
| --------- | ------------------------------------------- |
| ↑ ↓       | Nariz para cima / para baixo                |
| ← →       | Inclinar as asas (o avião faz a curva)      |
| A D       | Leme: vira o nariz de lado                  |
| W S       | Mais motor / menos motor                    |
| C         | Trocar câmera (atrás do avião ou cabine)    |
| I         | Inverter ↑ ↓                                |
| P ou Esc  | Pausar (na pausa dá para trocar de caça)    |
| R         | Recomeçar                                   |
| H         | Mostrar ou esconder a lista de comandos     |

## Como o voo funciona

- **Velocidade:** o motor empurra e o ar segura. Subir gasta velocidade, mergulhar ganha.
- **Curva:** com as asas inclinadas o avião vira sozinho para o lado da asa mais baixa. Soltando as setas, as asas
  voltam a nivelar devagar.
- **Estol:** abaixo de 86 km/h as asas perdem sustentação. O nariz cai e aparece o aviso ESTOL até o avião ganhar
  velocidade de novo.
- **Teto:** acima de 2.500 m o ar fica rarefeito e o motor perde força.
- **Batida:** encostar no chão ou numa árvore recomeça o voo a 320 m.

O mundo não tem fim: o chão é uma textura de 1,6 km que se repete, e as árvores e as nuvens são reposicionadas em volta
do avião enquanto ele voa.

## Como publicar uma versão nova

O site é publicado pelo GitHub Pages a partir da pasta raiz do branch `main`. Qualquer alteração enviada ao `main`
aparece no endereço acima em cerca de um minuto. O jogo é um arquivo só (`index.html`) e precisa de internet para
carregar a biblioteca 3D (three.js) e as fontes.
