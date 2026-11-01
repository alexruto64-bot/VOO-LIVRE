# VOO-LIVRE
MELHOR JOGO DE AVIAO

**Jogar agora:** https://alexruto64-bot.github.io/VOO-LIVRE/

Jogo de avião em 3D para o navegador do computador: um avião, o céu e o teclado. Sem inimigos, sem missão e sem
história, só voar sobre campos, matas, lagos e estradas de terra.

## Comandos

| Tecla     | O que faz                                   |
| --------- | ------------------------------------------- |
| ↑ ↓       | Nariz para cima / para baixo                |
| ← →       | Inclinar as asas (o avião faz a curva)      |
| A D       | Leme: vira o nariz de lado                  |
| W S       | Mais motor / menos motor                    |
| C         | Trocar câmera (atrás do avião ou cabine)    |
| I         | Inverter ↑ ↓                                |
| P ou Esc  | Pausar                                      |
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
