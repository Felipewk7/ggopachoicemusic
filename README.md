# 🎵 GGOPA Choice Music - Frutiger Aero Edition

Um web app no autêntico estilo **Frutiger Aero** (vidro aero, botões aqua/gel, auroras, reflexos, luz solar e bolhas flutuantes) para realizar embates eliminatórios ("mata-mata") e eleger a melhor música da playlist oficial do canal **GGOPA Studios**.

🔗 **Playlist Pré-configurada:** [Aura + ego playlist](https://youtube.com/playlist?list=PL7frYc2DUeyhwhL7fUT7Mcn2Zgpllg3Wo&si=nViQOaIDsuyF0237)

---

## ✨ Funcionalidades Principais

- 🎲 **Chaveamento 100% Aleatório:** A cada início ou reinício de torneio, as 32 músicas são sorteadas e embaralhadas (algoritmo Fisher-Yates), gerando confrontos únicos toda vez que você jogar.
- 🏆 **Torneio Mata-Mata Perfeito (32 Faixas):**
  - **Primeira Fase:** 16 duelos (32 músicas)
  - **Oitavas de Final:** 8 duelos (16 músicas)
  - **Quartas de Final:** 4 duelos (8 músicas)
  - **Semifinais:** 2 duelos (4 músicas)
  - **Grande Final:** 1 duelo (2 músicas) ➜ **Grande Campeã!**
- 🖼️ **Gerador de Card Frutiger Aero Exclusivo:**
  - Ao final do torneio, o site renderiza dinamicamente em alta resolução (1200x675 HD) um **Card Frutiger Aero comemorativo** com o nome da música vencedora eleita pelo usuário.
  - Botão **💾 Baixar Card Aero (.PNG)** para salvar no seu computador ou celular.
  - Botão **📋 Copiar Imagem** para colar direto no Discord, WhatsApp ou redes sociais.
- 🎧 **Player Integrado do YouTube:** Escute cada faixa diretamente na interface sem sair do site. Quando você dá play em uma música, a outra pausa automaticamente para não sobrepor o áudio.
- 🎚️ **Visualizador de Áudio (Equalizer):** Barras de áudio animadas em tempo real durante a reprodução.
- ⌨️ **Atalhos Rápidos de Teclado:**
  - `1` ou `A`: Votar na **Música 1** (Esquerda)
  - `2` ou `B`: Votar na **Música 2** (Direita)
  - `Barra de Espaço`: Alternar reprodução entre as faixas
  - `Esc`: Fechar modais
- 🗺️ **Visualizador da Árvore de Chaveamento:** Acompanhe em tempo real quais músicas venceram cada duelo ao longo de todas as fases.
- 📜 **Lista Completa das 32 Faixas:** Consulte todas as faixas da playlist com suas durações e miniaturas.
- 🔊 **Efeitos Sonoros Retrô (Web Audio API):** Sons de clique em vidro, chime aquático de voto e fanfarra triunfal no estilo Windows Vista / 7 (com botão de silenciar/ativar).
- 📱 **Totalmente Responsivo:** Design adaptado para telas mobile, tablets e computadores.

---

## 🎨 Estilo Frutiger Aero

- Gradientes celestes e aquáticos luminosos.
- Efeito vidro Aero com desfoque de fundo (`backdrop-filter: blur`).
- Botões tridimensionais skeuomórficos com brilho superior (*gloss*).
- Bolhas geradas e animadas dinamicamente subindo pela tela.
- Janela com barra de título clássica e botões orbe brilhantes (minimizar, maximizar, fechar).

---

## 🚀 Como Executar Localmente

Como o projeto é construído em puro **HTML5, CSS3 e JavaScript**, você não precisa instalar nenhuma dependência:

1. Dê um duplo clique no arquivo [`index.html`](index.html) ou abra-o em qualquer navegador moderno (Chrome, Edge, Firefox, Brave, Safari).
2. Ou inicie um servidor local se preferir:
   ```bash
   npx serve .
   ```

---

## 🌐 Como Publicar no GitHub Pages

Para publicar este projeto gratuitamente no **GitHub Pages**:

1. No **GitHub Desktop** (ou via terminal Git):
   - Faça o commit de todos os arquivos do repositório (`index.html`, `style.css`, `app.js`, `playlist-data.js`, `audio-fx.js`, `bracket-engine.js`, `.nojekyll`, etc.).
   - Clique em **Publish repository** ou faça o push para o seu repositório no GitHub.
2. No seu repositório no GitHub pelo navegador:
   - Acesse a aba **Settings** (Configurações).
   - No menu lateral esquerdo, clique em **Pages**.
   - Em **Build and deployment > Source**, selecione **Deploy from a branch**.
   - Em **Branch**, selecione `main` (ou `master`) e a pasta `/(root)`.
   - Clique em **Save**.
3. Em cerca de 1 a 2 minutos, o GitHub gerará o link público do seu site:
   `https://<seu-usuario>.github.io/ggopachoicemusic/`
