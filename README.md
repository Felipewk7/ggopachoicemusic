# 🎵 GGOPA Choice Music - Frutiger Aero Edition

Um web app no autêntico estilo **Frutiger Aero** (vidro aero, botões aqua/gel, auroras, reflexos, luz solar e bolhas flutuantes) para realizar embates eliminatórios ("mata-mata") e eleger a melhor música da playlist oficial do canal **GGOPA Studios**.

🔗 **Playlist Pré-configurada:** [Aura + ego playlist](https://youtube.com/playlist?list=PL7frYc2DUeyhwhL7fUT7Mcn2Zgpllg3Wo&si=nViQOaIDsuyF0237)

---

## ✨ Novidades e Funcionalidades Principais

- 🎨 **3 Temas Frutiger Aero Alternáveis em Tempo Real:**
  - 🌿 **Clássico:** Céu azul cristalino, colinas verdes esmeralda, reflexos dourados de sol e botões aqua.
  - 🔮 **Roxo Ametista (Crepúsculo):** Gradiente crepuscular profundo, auroras em magenta e violeta elétrico, vidros lavanda e botões ametista.
  - 🌅 **Laranja com Ciano (Pôr do Sol Tropical):** Céu vibrante de entardecer tangerina com águas tropicais em ciano turquesa, brilho solar quente e botões contrastantes.
  - *Sua preferência de tema é salva automaticamente e altera tanto a interface quanto as cores do Card gerado ao final!*

- ⚡ **Animações de Transição de Rodada:**
  - Ao concluir todos os duelos de uma fase (ex: *Primeira Fase* ➜ *Oitavas de Final* ➜ *Quartas* ➜ *Semifinais* ➜ *Grande Final*), uma tela de transição com efeito de vidro, zoom dinâmico e som harmônico anuncia a nova etapa e o número de músicas restantes.

- 🗺️ **Botão de Chaveamento Dinâmico & Árvore Interativa:**
  - **Botão com Badge em Tempo Real:** O botão de chaveamento na barra superior exibe um contador pulsante que acompanha a fase e duelo atual (ex: *16 Duelos*, *Oitavas (3/8)*, *Grande Final!*).
  - **Destaque do Duelo Atual:** No modal da árvore de chaveamento, o confronto ativo em andamento ganha borda neon pulsante e a insígnia `⚔️ DUELO ATUAL`.
  - **Botão "🎯 Ir para Duelo Atual":** Centraliza e rola suavemente a visualização até o duelo em andamento.

- 🏆 **Torneio Mata-Mata Perfeito (32 Faixas):**
  - **Primeira Fase:** 16 duelos (32 músicas)
  - **Oitavas de Final:** 8 duelos (16 músicas)
  - **Quartas de Final:** 4 duelos (8 músicas)
  - **Semifinais:** 2 duelos (4 músicas)
  - **Grande Final:** 1 duelo (2 músicas) ➜ **Grande Campeã!**

- 🖼️ **Gerador de Card Frutiger Aero Exclusivo:**
  - Renderiza em alta resolução (**1200 x 675 HD**) um card Frutiger Aero comemorativo personalizado com o nome da música vencedora e adaptado às cores do tema visual que você escolheu.
  - **💾 Baixar Card Aero (.PNG)** para salvar no seu computador ou celular.
  - **📋 Copiar Imagem** para colar direto no Discord, WhatsApp ou redes sociais.

- 🎧 **Player Integrado do YouTube:** Escute cada faixa diretamente na interface sem sair do site. Quando você dá play em uma música, a outra pausa automaticamente.
- 🎚️ **Equalizador Animado:** Barras de áudio saltam e dançam em tempo real durante a reprodução.
- ⌨️ **Atalhos Rápidos de Teclado:**
  - `1` ou `A`: Votar na **Música 1** (Esquerda)
  - `2` ou `B`: Votar na **Música 2** (Direita)
  - `Barra de Espaço`: Alternar reprodução entre as faixas
  - `Esc`: Fechar modais
- 🔊 **Efeitos Sonoros Retrô (Web Audio API):** Clique em vidro, chime de voto, acorde de transição de fase e fanfarra triunfal do Windows Vista / 7 (com botão de silenciar/ativar).
- 📱 **Totalmente Responsivo:** Design adaptado para telas mobile, tablets e computadores.

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
   - Faça o commit dos arquivos do repositório (`index.html`, `style.css`, `app.js`, `playlist-data.js`, `audio-fx.js`, `bracket-engine.js`, `.nojekyll`, etc.).
   - Clique em **Publish repository** ou faça o push para o seu repositório no GitHub.
2. No seu repositório no GitHub pelo navegador:
   - Acesse a aba **Settings** (Configurações).
   - No menu lateral esquerdo, clique em **Pages**.
   - Em **Build and deployment > Source**, selecione **Deploy from a branch**.
   - Em **Branch**, selecione `main` (ou `master`) e a pasta `/(root)`.
   - Clique em **Save**.
3. Em cerca de 1 a 2 minutos, o GitHub gerará o link público do seu site:
   `https://<seu-usuario>.github.io/ggopachoicemusic/`
