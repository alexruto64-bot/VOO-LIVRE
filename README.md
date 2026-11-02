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

## Modos

- **Voo livre:** só você, o caça e o céu.
- **Sobrevivência:** ondas de caças inimigos. Cada nível traz mais caças (até 8), mais rápidos, que curvam mais
  apertado e atiram melhor. Derrube todos para passar de nível. O casco aguenta uns 25 tiros; chegando a zero, ou
  batendo no chão, o voo acaba e a pontuação fica na tela.

## Armas

- **Metralhadora** (Z): tiros infinitos.
- **Míssil guiado** (Espaço): 4 por vez. Precisa de alvo travado: mantenha a mira num inimigo por quase 1 segundo, até a
  caixa ficar azul. Um míssil novo volta a cada 20 s.
- **Foguete** (X): 12 por vez, voa reto. Um foguete novo volta a cada 6 s.

Na tela: a mira azul mostra para onde o nariz aponta; as caixas vermelhas marcam os inimigos com a distância; a seta
na borda aponta para o inimigo mais perto quando ele está fora da tela.

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
  mais inclinado, mais a puxada vira o nariz. Inclinado sem puxar, o nariz vai caindo. A puxada é limitada a uns 9 g,
  então em alta velocidade a curva é mais larga.
- **Estol:** abaixo de 216 km/h as asas perdem sustentação. O nariz cai e aparece o aviso ESTOL até o caça ganhar
  velocidade de novo.
- **Teto:** acima de 12.000 m o ar fica rarefeito e o motor perde força.
- **Batida:** no voo livre, encostar no chão ou numa árvore recomeça o voo. Na sobrevivência, acaba o voo.

O mundo não tem fim: o chão é uma textura de 1,6 km que se repete, e as árvores e as nuvens são reposicionadas em volta
do avião enquanto ele voa.

## Como publicar uma versão nova

O site é publicado pelo GitHub Pages a partir da pasta raiz do branch `main`. Qualquer alteração enviada ao `main`
aparece no endereço acima em cerca de um minuto. O jogo é um arquivo só (`index.html`) e precisa de internet para
carregar a biblioteca 3D (three.js) e as fontes.
