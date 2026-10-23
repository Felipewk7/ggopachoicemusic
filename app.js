/**
 * GGOPA Choice Music - App Controller (32 Tracks & Frutiger Aero Card Generator)
 * Integrates Frutiger Aero UI, YouTube IFrame API, Bracket Engine, and Audio FX.
 */

// Global State
let currentSongs = [];
let bracketEngine = null;
let currentPlayingSide = null; // 'a', 'b', or null
let currentChampion = null;
let ytApiReady = false;

// DOM Elements
const welcomeView = document.getElementById("welcomeView");
const battleView = document.getElementById("battleView");
const victoryView = document.getElementById("victoryView");

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

// Card Generator Elements
const aeroCardCanvas = document.getElementById("aeroCardCanvas");
const aeroCardPreview = document.getElementById("aeroCardPreview");
const cardGeneratingLoader = document.getElementById("cardGeneratingLoader");
const btnDownloadCard = document.getElementById("btnDownloadCard");
const btnCopyCard = document.getElementById("btnCopyCard");
const copyFeedback = document.getElementById("copyFeedback");

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

  const bubbleCount = 20;
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

  if (!match) return;

  // Stop any currently playing audio
  stopAllPlayback();

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

  // Quick vote bounce animation
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
   VICTORY SCREEN & FRUTIGER AERO CARD GENERATOR
   ========================================================================== */

function showVictoryScreen(champion) {
  currentChampion = champion;
  stopAllPlayback();
  battleView.style.display = "none";
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

  // Generate the Frutiger Aero Celebration Image Card
  generateFrutigerAeroCard(champion);
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

/**
 * Draws an authentic, high-resolution (1200x675) Frutiger Aero Card
 * featuring the winning song title, GGOPA Studios branding, auroras, and bubbles.
 */
function generateFrutigerAeroCard(champion) {
  const canvas = aeroCardCanvas;
  const ctx = canvas.getContext("2d");
  const W = 1200;
  const H = 675;

  cardGeneratingLoader.style.display = "flex";
  aeroCardPreview.style.display = "none";

  // Preload thumbnail with CORS fallback
  const thumbImg = new Image();
  thumbImg.crossOrigin = "anonymous";

  let finished = false;
  const proceed = (imgObj) => {
    if (finished) return;
    finished = true;
    drawAeroCanvas(ctx, W, H, champion, imgObj);
    finalizeCardExport(canvas, champion);
  };

  thumbImg.onload = () => proceed(thumbImg);
  thumbImg.onerror = () => proceed(null);

  // Safety timeout in case of CORS hang
  setTimeout(() => proceed(null), 1200);

  thumbImg.src = champion.thumbnail;
}

function drawAeroCanvas(ctx, W, H, champion, thumbImg) {
  // 1. SKY GRADIENT (Daylight Azure to Clear Cyan to Lush Green)
  const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
  bgGrad.addColorStop(0, "#0091ea");
  bgGrad.addColorStop(0.32, "#29b6f6");
  bgGrad.addColorStop(0.65, "#7ee081");
  bgGrad.addColorStop(1, "#38b000");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, W, H);

  // 2. RADIANT SUN FLARE (Top-Right)
  const sunGrad = ctx.createRadialGradient(1100, 30, 10, 1100, 30, 480);
  sunGrad.addColorStop(0, "rgba(255, 255, 255, 1)");
  sunGrad.addColorStop(0.2, "rgba(255, 245, 175, 0.75)");
  sunGrad.addColorStop(0.48, "rgba(140, 235, 255, 0.35)");
  sunGrad.addColorStop(1, "rgba(255, 255, 255, 0)");
  ctx.fillStyle = sunGrad;
  ctx.fillRect(0, 0, W, H);

  // 3. AURORA / LIQUID WAVES (Bottom-Mid)
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(0, 460);
  ctx.bezierCurveTo(340, 370, 780, 560, W, 430);
  ctx.lineTo(W, H);
  ctx.lineTo(0, H);
  ctx.closePath();
  const waveGrad = ctx.createLinearGradient(0, 420, 0, H);
  waveGrad.addColorStop(0, "rgba(255, 255, 255, 0.38)");
  waveGrad.addColorStop(0.4, "rgba(120, 245, 210, 0.28)");
  waveGrad.addColorStop(1, "rgba(46, 180, 80, 0.55)");
  ctx.fillStyle = waveGrad;
  ctx.fill();
  ctx.restore();

  // 4. FLOATING 3D GLASS BUBBLES
  const bubbleSpecs = [
    { x: 90, y: 110, r: 38 },
    { x: 180, y: 560, r: 48 },
    { x: 320, y: 80, r: 24 },
    { x: 1080, y: 490, r: 54 },
    { x: 990, y: 140, r: 32 },
    { x: 1140, y: 280, r: 42 },
    { x: 70, y: 410, r: 28 },
    { x: 1110, y: 600, r: 35 }
  ];

  bubbleSpecs.forEach(b => {
    drawCanvasBubble(ctx, b.x, b.y, b.r);
  });

  // 5. MAIN AERO GLASS WINDOW PLATE
  const winX = 85;
  const winY = 55;
  const winW = 1030;
  const winH = 565;
  const radius = 26;

  // Window Shadow
  ctx.save();
  ctx.shadowColor = "rgba(0, 40, 95, 0.32)";
  ctx.shadowBlur = 32;
  ctx.shadowOffsetY = 16;

  // Frosted Glass Fill
  ctx.fillStyle = "rgba(255, 255, 255, 0.62)";
  roundRect(ctx, winX, winY, winW, winH, radius);
  ctx.fill();
  ctx.restore();

  // Outer Crystalline Border
  ctx.save();
  ctx.strokeStyle = "rgba(255, 255, 255, 0.95)";
  ctx.lineWidth = 2.5;
  roundRect(ctx, winX, winY, winW, winH, radius);
  ctx.stroke();
  ctx.restore();

  // Window Beveled Top Gloss
  ctx.save();
  ctx.beginPath();
  roundRect(ctx, winX + 2, winY + 2, winW - 4, 170, { tl: radius, tr: radius, br: 0, bl: 0 });
  const glassGloss = ctx.createLinearGradient(0, winY, 0, winY + 170);
  glassGloss.addColorStop(0, "rgba(255, 255, 255, 0.75)");
  glassGloss.addColorStop(1, "rgba(255, 255, 255, 0.05)");
  ctx.fillStyle = glassGloss;
  ctx.fill();
  ctx.restore();

  // 6. WINDOW TITLEBAR
  // Window Orbs (Close, Minimize, Maximize)
  drawOrb(ctx, winX + 26, winY + 28, 8, "#ff5f56", "#e0443e"); // Red
  drawOrb(ctx, winX + 48, winY + 28, 8, "#ffbd2e", "#dea123"); // Amber
  drawOrb(ctx, winX + 70, winY + 28, 8, "#27c93f", "#1aab29"); // Green

  ctx.font = "bold 14px 'Segoe UI', Calibri, sans-serif";
  ctx.fillStyle = "#094067";
  ctx.fillText("GGOPA CHOICE MUSIC • CARD OFICIAL DA CAMPEÃ", winX + 96, winY + 33);

  // 7. LEFT SIDE: ALBUM ART / HOLOGRAPHIC MUSIC DISC
  const artX = winX + 45;
  const artY = winY + 75;
  const artW = 390;
  const artH = 240;
  const artRadius = 18;

  ctx.save();
  // Frame Shadow
  ctx.shadowColor = "rgba(0, 30, 70, 0.35)";
  ctx.shadowBlur = 18;
  ctx.shadowOffsetY = 8;

  if (thumbImg) {
    // Clip rounded rect and draw image
    roundRect(ctx, artX, artY, artW, artH, artRadius);
    ctx.clip();
    ctx.drawImage(thumbImg, artX, artY, artW, artH);

    // Glass shine over thumbnail
    const artGloss = ctx.createLinearGradient(artX, artY, artX, artY + artH * 0.5);
    artGloss.addColorStop(0, "rgba(255, 255, 255, 0.65)");
    artGloss.addColorStop(1, "rgba(255, 255, 255, 0)");
    ctx.fillStyle = artGloss;
    ctx.fillRect(artX, artY, artW, artH * 0.5);
  } else {
    // Draw 3D Aero Glass Holographic Disc
    drawAeroDiscArt(ctx, artX, artY, artW, artH, artRadius);
  }
  ctx.restore();

  // White border around artwork
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 3;
  roundRect(ctx, artX, artY, artW, artH, artRadius);
  ctx.stroke();

  // Reflection underneath artwork
  drawMirrorReflection(ctx, artX, artY, artW, artH, 60);

  // 8. RIGHT SIDE: CHAMPIONSHIP TITLES & BADGES
  const textX = winX + 475;
  let curY = winY + 95;

  // Gold Badge Pill
  const badgeW = 270;
  const badgeH = 34;
  ctx.save();
  const badgeGrad = ctx.createLinearGradient(textX, curY, textX, curY + badgeH);
  badgeGrad.addColorStop(0, "#fffbe6");
  badgeGrad.addColorStop(1, "#ffe58f");
  ctx.fillStyle = badgeGrad;
  ctx.strokeStyle = "#faad14";
  ctx.lineWidth = 1.5;
  roundRect(ctx, textX, curY, badgeW, badgeH, 17);
  ctx.fill();
  ctx.stroke();

  ctx.font = "900 13px 'Segoe UI', Calibri, sans-serif";
  ctx.fillStyle = "#874d00";
  ctx.fillText("👑 A GRANDE CAMPEÃ DA PLAYLIST", textX + 16, curY + 22);
  ctx.restore();

  curY += 60;

  // Song Title (Auto-wrapped bold title)
  ctx.save();
  ctx.font = "900 36px 'Segoe UI', Calibri, sans-serif";
  ctx.shadowColor = "rgba(255, 255, 255, 0.9)";
  ctx.shadowBlur = 8;
  ctx.fillStyle = "#073356";

  const maxTitleWidth = 470;
  const lines = wrapText(ctx, champion.title, maxTitleWidth);
  lines.slice(0, 3).forEach((line) => {
    ctx.fillText(line, textX, curY);
    curY += 44;
  });
  ctx.restore();

  curY += 8;

  // Artist & Origin
  ctx.font = "700 19px 'Segoe UI', Calibri, sans-serif";
  ctx.fillStyle = "#0284c7";
  ctx.fillText("🎵 " + (champion.author || "GGOPA Studios") + " • Aura + Ego Playlist", textX, curY);

  curY += 34;

  // Duration & Stats Pill
  ctx.save();
  ctx.font = "700 14px 'Segoe UI', Calibri, sans-serif";
  const statText = `⏱ Duração: ${champion.duration || 'GGOPA'}  •  🏆 1º Lugar entre 32 Músicas`;
  const statW = ctx.measureText(statText).width + 24;
  ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
  ctx.strokeStyle = "rgba(255, 255, 255, 0.95)";
  roundRect(ctx, textX, curY - 18, statW, 30, 15);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#0b4e7a";
  ctx.fillText(statText, textX + 12, curY + 3);
  ctx.restore();

  // 9. BOTTOM FOOTER RIBBON
  const footY = winY + winH - 45;
  ctx.save();
  ctx.font = "600 13px 'Segoe UI', Calibri, sans-serif";
  ctx.fillStyle = "#1e587e";
  ctx.fillText("✨ Eleita no GGOPA Choice Music • Torneio Eliminatório Frutiger Aero", winX + 45, footY);

  const rightBrand = "ggopachoicemusic • GitHub Pages";
  const brandW = ctx.measureText(rightBrand).width;
  ctx.fillText(rightBrand, winX + winW - brandW - 45, footY);
  ctx.restore();
}

/**
 * Draws a 3D Frutiger Aero transparent bubble on canvas
 */
function drawCanvasBubble(ctx, x, y, r) {
  ctx.save();
  // Outer gradient
  const bGrad = ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, r * 0.1, x, y, r);
  bGrad.addColorStop(0, "rgba(255, 255, 255, 0.85)");
  bGrad.addColorStop(0.3, "rgba(255, 255, 255, 0.35)");
  bGrad.addColorStop(0.7, "rgba(125, 225, 255, 0.28)");
  bGrad.addColorStop(1, "rgba(255, 255, 255, 0.75)");

  ctx.fillStyle = bGrad;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();

  // Specular gleam highlight
  ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
  ctx.beginPath();
  ctx.ellipse(x - r * 0.35, y - r * 0.35, r * 0.3, r * 0.18, -Math.PI / 4, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/**
 * Draws an Aero Titlebar Orb
 */
function drawOrb(ctx, x, y, r, c1, c2) {
  ctx.save();
  const orbGrad = ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, r * 0.1, x, y, r);
  orbGrad.addColorStop(0, "#ffffff");
  orbGrad.addColorStop(0.4, c1);
  orbGrad.addColorStop(1, c2);

  ctx.fillStyle = orbGrad;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "rgba(0,0,0,0.15)";
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.restore();
}

/**
 * Draws mirror reflection below artwork
 */
function drawMirrorReflection(ctx, x, y, w, h, refH) {
  ctx.save();
  const refGrad = ctx.createLinearGradient(x, y + h, x, y + h + refH);
  refGrad.addColorStop(0, "rgba(255, 255, 255, 0.35)");
  refGrad.addColorStop(1, "rgba(255, 255, 255, 0)");
  ctx.fillStyle = refGrad;
  ctx.fillRect(x, y + h + 2, w, refH);
  ctx.restore();
}

/**
 * Fallback Holographic Aero Disc if thumbnail CORS fails
 */
function drawAeroDiscArt(ctx, x, y, w, h, r) {
  const cx = x + w / 2;
  const cy = y + h / 2;
  const discR = 85;

  ctx.fillStyle = "#0c2340";
  roundRect(ctx, x, y, w, h, r);
  ctx.fill();

  // Outer iridescent disc
  const discGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, discR);
  discGrad.addColorStop(0, "#ffffff");
  discGrad.addColorStop(0.3, "#38bdf8");
  discGrad.addColorStop(0.7, "#0284c7");
  discGrad.addColorStop(1, "#082f49");
  ctx.fillStyle = discGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, discR, 0, Math.PI * 2);
  ctx.fill();

  // Spindle
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(cx, cy, 24, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#0284c7";
  ctx.beginPath();
  ctx.arc(cx, cy, 12, 0, Math.PI * 2);
  ctx.fill();
}

/**
 * Helper to auto-wrap long text on canvas
 */
function wrapText(ctx, text, maxWidth) {
  const words = text.split(" ");
  const lines = [];
  let currentLine = words[0];

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const width = ctx.measureText(currentLine + " " + word).width;
    if (width < maxWidth) {
      currentLine += " " + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  lines.push(currentLine);
  return lines;
}

/**
 * Helper to draw rounded rectangle
 */
function roundRect(ctx, x, y, w, h, r) {
  if (typeof r === "number") {
    r = { tl: r, tr: r, br: r, bl: r };
  }
  ctx.beginPath();
  ctx.moveTo(x + r.tl, y);
  ctx.lineTo(x + w - r.tr, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r.tr);
  ctx.lineTo(x + w, y + h - r.br);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r.br, y + h);
  ctx.lineTo(x + r.bl, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r.bl);
  ctx.lineTo(x, y + r.tl);
  ctx.quadraticCurveTo(x, y, x + r.tl, y);
  ctx.closePath();
}

/**
 * Completes the card generation and wires download/copy actions
 */
function finalizeCardExport(canvas, champion) {
  try {
    const dataUrl = canvas.toDataURL("image/png");
    aeroCardPreview.src = dataUrl;
    cardGeneratingLoader.style.display = "none";
    aeroCardPreview.style.display = "block";

    // Download action
    btnDownloadCard.onclick = () => {
      audioFX.playClick();
      const cleanName = champion.title
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9_\-]/g, "_")
        .substring(0, 32);

      const link = document.createElement("a");
      link.download = `ggopa-aero-${cleanName}.png`;
      link.href = dataUrl;
      link.click();
    };

    // Copy to clipboard action
    btnCopyCard.onclick = async () => {
      audioFX.playClick();
      try {
        canvas.toBlob(async (blob) => {
          if (!blob) return;
          try {
            await navigator.clipboard.write([
              new ClipboardItem({ "image/png": blob })
            ]);
            copyFeedback.style.display = "inline-block";
            setTimeout(() => {
              copyFeedback.style.display = "none";
            }, 3500);
          } catch (e) {
            // Fallback download if clipboard is not permitted
            btnDownloadCard.click();
          }
        });
      } catch (err) {
        btnDownloadCard.click();
      }
    };
  } catch (e) {
    console.warn("Canvas export fallback:", e);
    cardGeneratingLoader.style.display = "none";
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

    round.matches.forEach((m) => {
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
  if (e.key === "Escape") {
    bracketModalBackdrop.classList.remove("active");
    tracklistModalBackdrop.classList.remove("active");
    return;
  }

  if (battleView.style.display !== "block") return;

  if (e.key === "1" || e.key.toLowerCase() === "a") {
    voteForSong("a");
  } else if (e.key === "2" || e.key.toLowerCase() === "b") {
    voteForSong("b");
  } else if (e.code === "Space") {
    e.preventDefault();
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
