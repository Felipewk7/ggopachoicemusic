/**
 * Frutiger Aero Audio FX Synthesizer
 * Uses native Web Audio API for skeuomorphic tactile sound effects:
 * - Glass click
 * - Bubble pop
 * - Watery vote chime
 * - Bye sparkle
 * - Victory fanfare
 */

class AeroAudio {
  constructor() {
    this.ctx = null;
    this.muted = localStorage.getItem("ggopa_muted") === "true";
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    localStorage.setItem("ggopa_muted", String(this.muted));
    return this.muted;
  }

  isMuted() {
    return this.muted;
  }

  // Crisp glass button click
  playClick() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(1200, t);
    osc.frequency.exponentialRampToValueAtTime(400, t + 0.05);

    gain.gain.setValueAtTime(0.15, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.05);
  }

  // Bubble pop sound
  playPop() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(450, t);
    osc.frequency.exponentialRampToValueAtTime(1100, t + 0.08);

    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.09);
  }

  // Watery vote chime (ascending chord)
  playVote() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const t = this.ctx.currentTime + idx * 0.04;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.12, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.25);
    });
  }

  // Sparkle / Bye Chime for songs that pass directly
  playBye() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const notes = [880, 1174.66, 1318.51, 1760]; // A5, D6, E6, A6
    notes.forEach((freq, idx) => {
      const t = this.ctx.currentTime + idx * 0.07;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.15, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.35);
    });
  }

  // Windows Vista / 7 style Victory Chime Fanfare
  playVictory() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    // Fanfare melody: G4 -> C5 -> E5 -> G5 -> C6
    const chord = [
      { f: 392.00, d: 0.12, wait: 0 },
      { f: 523.25, d: 0.14, wait: 0.12 },
      { f: 659.25, d: 0.14, wait: 0.24 },
      { f: 783.99, d: 0.22, wait: 0.38 },
      { f: 1046.50, d: 0.8, wait: 0.55 },
      { f: 1318.51, d: 0.7, wait: 0.58 },
      { f: 1567.98, d: 0.9, wait: 0.62 }
    ];

    chord.forEach(item => {
      const t = this.ctx.currentTime + item.wait;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(item.f, t);

      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + item.d);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + item.d);
    });
  }
}

const audioFX = new AeroAudio();

// Universal Environment Compatibility
if (typeof window !== "undefined") {
  window.AeroAudio = AeroAudio;
  window.audioFX = audioFX;
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = { AeroAudio, audioFX };
}

