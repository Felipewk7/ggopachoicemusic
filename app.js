/**
 * GGOPA Choice Music - App Controller
 * Integrates Frutiger Aero UI, YouTube IFrame API, Bracket Engine, and Audio FX.
 */

// Global State
let currentSongs = [];
let bracketEngine = null;
let currentPlayingSide = null; // 'a', 'b', or null
let playerA = null;
let playerB = null;
let ytApiReady = false;

// DOM Elements
const welcomeView = document.getElementById("welcomeView");
const battleView = document.getElementById("battleView");
const victoryView = document.getElementById("victoryView");
const byeBanner = document.getElementById("byeBanner");
const byeSongName = document.getElementById("byeSongName");

// Progress elements
const roundNameEl = document.getElementById("roundName");
const matchCountEl = document.getElementById("matchCount");
const progressFill = document.getElementById("progressFill");
const totalSongsCountEl = document.getElementById("totalSongsCount");

// Combatant A elements
const cardA = document.getElementById("cardA");
const thumbA = document.getElementById("thumbA");
const titleA = document.getElementById("titleA");
const artistA = document.getElementById("artistA");
const durationA = document.getElementById("durationA");
const playOverlayA = document.getElementById("playOverlayA");
const playerContainerA = document.getElementById("playerContainerA");
const audioStateA = document.getElementById("audioStateA");
const btnVoteA = document.getElementById("btnVoteA");

// Combatant B elements
const cardB = document.getElementById("cardB");
const thumbB = document.getElementById("thumbB");
const titleB = document.getElementById("titleB");
const artistB = document.getElementById("artistB");
const durationB = document.getElementById("durationB");
const playOverlayB = document.getElementById("playOverlayB");
const playerContainerB = document.getElementById("playerContainerB");
const audioStateB = document.getElementById("audioStateB");
const btnVoteB = document.getElementById("btnVoteB");

// Champion Elements
const champThumb = document.getElementById("champThumb");
const champTitle = document.getElementById("champTitle");
const champArtist = document.getElementById("champArtist");
const champDuration = document.getElementById("champDuration");
const champPlayerBox = document.getElementById("champPlayerBox");
const champPlayOverlay = document.getElementById("champPlayOverlay");

// Modals
const bracketModalBackdrop = document.getElementById("bracketModalBackdrop");
const tracklistModalBackdrop = document.getElementById("tracklistModalBackdrop");
const bracketTreeContainer = document.getElementById("bracketTreeContainer");
const tracklistGrid = document.getElementById("tracklistGrid");

// Buttons & Toggles
const btnStartTournament = document.getElementById("btnStartTournament");
const btnViewTracks = document.getElementById("btnViewTracks");
const btnViewBracket = document.getElementById("btnViewBracket");
const btnSoundToggle = document.getElementById("btnSoundToggle");
const btnRestart = document.getElementById("btnRestart");
const btnRestartFromVictory = document.getElementById("btnRestartFromVictory");
const btnCloseBracket = document.getElementById("btnCloseBracket");
const btnCloseTracklist = document.getElementById("btnCloseTracklist");

/* ==========================================================================
   INITIALIZATION & BACKGROUND BUBBLES
   ========================================================================== */

function initBackgroundBubbles() {
  const container = document.getElementById("aeroBackground");
  if (!container) return;

  const bubbleCount = 18;
  for (let i = 0; i < bubbleCount; i++) {
    const bubble = document.createElement("div");
    bubble.className = "bubble";
    const size = Math.floor(Math.random() * 55) + 20; // 20px - 75px
    const left = Math.random() * 100; // 0% - 100%
    const duration = Math.random() * 12 + 10; // 10s - 22s
    const delay = Math.random() * 8; // 0s - 8s

    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    bubble.style.left = `${left}%`;
    bubble.style.animationDuration = `${duration}s`;
    bubble.style.animationDelay = `${delay}s`;

    container.appendChild(bubble);
  }
}

// YouTube IFrame API Callback
window.onYouTubeIframeAPIReady = function() {
  ytApiReady = true;
  console.log("YouTube IFrame API pronto!");
};

/* ==========================================================================
   AUDIO EFFECTS & SOUND TOGGLE
   ========================================================================== */

function updateSoundButton() {
  if (audioFX.isMuted()) {
    btnSoundToggle.innerHTML = "🔇 Som: Desligado";
    btnSoundToggle.classList.remove("aero-btn-green");
    btnSoundToggle.classList.add("aero-btn-glass");
  } else {
    btnSoundToggle.innerHTML = "🔊 Som: Ligado";
    btnSoundToggle.classList.add("aero-btn-green");
    btnSoundToggle.classList.remove("aero-btn-glass");
  }
}

btnSoundToggle.addEventListener("click", () => {
  audioFX.toggleMute();
  updateSoundButton();
  audioFX.playClick();
});

/* ==========================================================================
   TOURNAMENT CONTROL
   ========================================================================== */

function startTournament() {
  audioFX.playPop();
  currentSongs = getActiveSongs();
  bracketEngine = new BracketEngine(currentSongs);

  welcomeView.style.display = "none";
  victoryView.style.display = "none";
  battleView.style.display = "block";

  renderCurrentMatch();
}

function updateProgress() {
  const progress = bracketEngine.getProgress();
  const round = bracketEngine.getCurrentRound();

  roundNameEl.textContent = round.name;
  matchCountEl.textContent = `Duelo ${round.currentMatchIndex + 1} de ${round.matches.length}`;
  progressFill.style.width = `${progress.percentage}%`;
}

function renderCurrentMatch() {
  const match = bracketEngine.getCurrentMatch();
  const round = bracketEngine.getCurrentRound();

  if (!match) return;

  // Stop any currently playing audio
  stopAllPlayback();

  // Handle Bye Banner
  if (round.byeSong && round.currentMatchIndex === 0) {
    byeSongName.textContent = `"${round.byeSong.title}"`;
    byeBanner.style.display = "flex";
    audioFX.playBye();
  } else if (!round.byeSong) {
    byeBanner.style.display = "none";
  }

  // Populate Song A
  thumbA.src = match.songA.thumbnail;
  titleA.textContent = match.songA.title;
  artistA.textContent = match.songA.author || "GGOPA Studios";
  durationA.textContent = match.songA.duration ? `⏱ ${match.songA.duration}` : "Música";

  // Populate Song B
  thumbB.src = match.songB.thumbnail;
  titleB.textContent = match.songB.title;
  artistB.textContent = match.songB.author || "GGOPA Studios";
  durationB.textContent = match.songB.duration ? `⏱ ${match.songB.duration}` : "Música";

  // Reset player containers
  playerContainerA.innerHTML = "";
  playerContainerA.classList.remove("active");
  playOverlayA.style.display = "flex";
  audioStateA.textContent = "Clique para ouvir";
  cardA.classList.remove("playing");

  playerContainerB.innerHTML = "";
  playerContainerB.classList.remove("active");
  playOverlayB.style.display = "flex";
  audioStateB.textContent = "Clique para ouvir";
  cardB.classList.remove("playing");

  updateProgress();
}

/* ==========================================================================
   YOUTUBE PLAYBACK HANDLING (Head-to-head audio toggle)
   ========================================================================== */

function playSong(side) {
  audioFX.playClick();
  const match = bracketEngine.getCurrentMatch();
  if (!match) return;

  const song = side === "a" ? match.songA : match.songB;
  const container = side === "a" ? playerContainerA : playerContainerB;
  const overlay = side === "a" ? playOverlayA : playOverlayB;
  const otherContainer = side === "a" ? playerContainerB : playerContainerA;
  const otherOverlay = side === "a" ? playOverlayB : playOverlayA;
  const card = side === "a" ? cardA : cardB;
  const otherCard = side === "a" ? cardB : cardA;
  const stateText = side === "a" ? audioStateA : audioStateB;
  const otherStateText = side === "a" ? audioStateB : audioStateA;

  // Stop the other side immediately
  otherContainer.innerHTML = "";
  otherContainer.classList.remove("active");
  otherOverlay.style.display = "flex";
  otherCard.classList.remove("playing");
  otherStateText.textContent = "Pausado";

  // Embed YouTube player with autoplay
  container.innerHTML = `
    <iframe 
      id="ytplayer_${side}"
      src="https://www.youtube.com/embed/${song.id}?autoplay=1&enablejsapi=1&origin=${encodeURIComponent(window.location.origin || '*')}"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen>
    </iframe>
  `;

  container.classList.add("active");
  overlay.style.display = "none";
  card.classList.add("playing");
  stateText.textContent = "▶ Tocando agora...";
  currentPlayingSide = side;
}

function stopAllPlayback() {
  playerContainerA.innerHTML = "";
  playerContainerA.classList.remove("active");
  playOverlayA.style.display = "flex";
  cardA.classList.remove("playing");
  audioStateA.textContent = "Pronto";

  playerContainerB.innerHTML = "";
  playerContainerB.classList.remove("active");
  playOverlayB.style.display = "flex";
  cardB.classList.remove("playing");
  audioStateB.textContent = "Pronto";

  currentPlayingSide = null;
}

playOverlayA.addEventListener("click", () => playSong("a"));
playOverlayB.addEventListener("click", () => playSong("b"));

/* ==========================================================================
   VOTING & ROUND TRANSITIONS
   ========================================================================== */

function voteForSong(side) {
  audioFX.playVote();
  const match = bracketEngine.getCurrentMatch();
  if (!match) return;

  const chosenSong = side === "a" ? match.songA : match.songB;
  const winningCard = side === "a" ? cardA : cardB;

  // Quick vote animation
  winningCard.style.transform = "scale(1.05)";
  winningCard.style.filter = "brightness(1.15)";

  setTimeout(() => {
    winningCard.style.transform = "";
    winningCard.style.filter = "";

    const result = bracketEngine.vote(chosenSong);

    if (result.type === "TOURNAMENT_COMPLETE") {
      showVictoryScreen(result.champion);
    } else if (result.type === "ROUND_ADVANCED") {
      renderCurrentMatch();
    } else if (result.type === "NEXT_MATCH") {
      renderCurrentMatch();
    }
  }, 220);
}

btnVoteA.addEventListener("click", () => voteForSong("a"));
btnVoteB.addEventListener("click", () => voteForSong("b"));

/* ==========================================================================
   VICTORY SCREEN
   ========================================================================== */

function showVictoryScreen(champion) {
  stopAllPlayback();
  battleView.style.display = "none";
  byeBanner.style.display = "none";
  victoryView.style.display = "block";

  audioFX.playVictory();

  champThumb.src = champion.thumbnail;
  champTitle.textContent = champion.title;
  champArtist.textContent = champion.author || "GGOPA Studios";
  champDuration.textContent = champion.duration ? `Duração: ${champion.duration}` : "";

  // Play champion track automatically
  champPlayerBox.innerHTML = `
    <iframe 
      src="https://www.youtube.com/embed/${champion.id}?autoplay=1&enablejsapi=1"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen>
    </iframe>
  `;
  champPlayerBox.classList.add("active");
  champPlayOverlay.style.display = "none";

  // Trigger celebration bubbles
  createConfettiBubbles();
}

function createConfettiBubbles() {
  const container = document.getElementById("aeroBackground");
  for (let i = 0; i < 25; i++) {
    const bubble = document.createElement("div");
    bubble.className = "bubble";
    const size = Math.floor(Math.random() * 40) + 15;
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    bubble.style.left = `${Math.random() * 100}%`;
    bubble.style.animationDuration = `${Math.random() * 4 + 4}s`;
    bubble.style.background = `radial-gradient(circle at 30% 30%, #fff 0%, #ffd700 50%, #ff8c00 100%)`;
    container.appendChild(bubble);
  }
}

/* ==========================================================================
   MODALS: BRACKET TREE & TRACKLIST
   ========================================================================== */

function renderBracketTree() {
  if (!bracketEngine) return;
  const tree = bracketEngine.getBracketTree();
  bracketTreeContainer.innerHTML = "";

  tree.forEach((round) => {
    const col = document.createElement("div");
    col.className = "bracket-round-col";

    const title = document.createElement("div");
    title.className = "round-col-title";
    title.textContent = round.name;
    col.appendChild(title);

    if (round.byeSong) {
      const byeNode = document.createElement("div");
      byeNode.className = "bracket-match-node";
      byeNode.innerHTML = `
        <div class="match-slot bye-slot">
          <span>✨ <strong>${round.byeSong.title}</strong></span>
          <span style="font-size: 10px;">Passou Direto (Bye)</span>
        </div>
      `;
      col.appendChild(byeNode);
    }

    round.matches.forEach((m, idx) => {
      const node = document.createElement("div");
      node.className = "bracket-match-node";

      const aWinner = m.winner && m.winner.id === m.songA.id;
      const bWinner = m.winner && m.winner.id === m.songB.id;

      node.innerHTML = `
        <div class="match-slot ${aWinner ? 'winner' : ''}">
          <span>${m.songA.title}</span>
          ${aWinner ? '<span>🏆</span>' : ''}
        </div>
        <div class="match-slot ${bWinner ? 'winner' : ''}">
          <span>${m.songB.title}</span>
          ${bWinner ? '<span>🏆</span>' : ''}
        </div>
      `;
      col.appendChild(node);
    });

    bracketTreeContainer.appendChild(col);
  });
}

function renderTracklist() {
  const songs = getActiveSongs();
  tracklistGrid.innerHTML = "";

  songs.forEach((s, idx) => {
    const item = document.createElement("div");
    item.className = "track-item-card";
    item.innerHTML = `
      <div class="track-item-num">#${idx + 1}</div>
      <img class="track-item-thumb" src="${s.thumbnail}" alt="${s.title}">
      <div class="track-item-info">
        <div class="track-item-title" title="${s.title}">${s.title}</div>
        <div class="track-item-dur">${s.duration ? '⏱ ' + s.duration : 'GGOPA'}</div>
      </div>
    `;
    tracklistGrid.appendChild(item);
  });
}

btnViewBracket.addEventListener("click", () => {
  audioFX.playClick();
  renderBracketTree();
  bracketModalBackdrop.classList.add("active");
});

btnCloseBracket.addEventListener("click", () => {
  audioFX.playClick();
  bracketModalBackdrop.classList.remove("active");
});

bracketModalBackdrop.addEventListener("click", (e) => {
  if (e.target === bracketModalBackdrop) {
    bracketModalBackdrop.classList.remove("active");
  }
});

btnViewTracks.addEventListener("click", () => {
  audioFX.playClick();
  renderTracklist();
  tracklistModalBackdrop.classList.add("active");
});

btnCloseTracklist.addEventListener("click", () => {
  audioFX.playClick();
  tracklistModalBackdrop.classList.remove("active");
});

tracklistModalBackdrop.addEventListener("click", (e) => {
  if (e.target === tracklistModalBackdrop) {
    tracklistModalBackdrop.classList.remove("active");
  }
});

/* ==========================================================================
   KEYBOARD SHORTCUTS & GENERAL LISTENERS
   ========================================================================== */

document.addEventListener("keydown", (e) => {
  // If modal open, Escape closes it
  if (e.key === "Escape") {
    bracketModalBackdrop.classList.remove("active");
    tracklistModalBackdrop.classList.remove("active");
    return;
  }

  // Only handle battle shortcuts if battleView is visible
  if (battleView.style.display !== "block") return;

  if (e.key === "1" || e.key.toLowerCase() === "a") {
    voteForSong("a");
  } else if (e.key === "2" || e.key.toLowerCase() === "b") {
    voteForSong("b");
  } else if (e.code === "Space") {
    e.preventDefault();
    // Toggle play on side A or B
    if (currentPlayingSide === "a") {
      playSong("b");
    } else {
      playSong("a");
    }
  }
});

btnStartTournament.addEventListener("click", startTournament);
btnRestart.addEventListener("click", () => {
  audioFX.playPop();
  startTournament();
});
btnRestartFromVictory.addEventListener("click", () => {
  audioFX.playPop();
  startTournament();
});

// Window orb click effects
document.querySelectorAll(".window-orb").forEach((orb) => {
  orb.addEventListener("click", () => audioFX.playPop());
});

// Setup on DOM Load
document.addEventListener("DOMContentLoaded", () => {
  initBackgroundBubbles();
  updateSoundButton();
  currentSongs = getActiveSongs();
  if (totalSongsCountEl) {
    totalSongsCountEl.textContent = `${currentSongs.length} Músicas`;
  }
});
