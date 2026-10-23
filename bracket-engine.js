/**
 * Tournament Bracket Engine - Pure 32-Track Elimination
 * Handles randomized matching, round progression, and bracket history.
 */

class BracketEngine {
  constructor(songs) {
    this.initialSongs = [...songs];
    this.rounds = [];
    this.currentRoundIndex = 0;
    this.isFinished = false;
    this.champion = null;
    this.runnerUp = null;
    this.semifinalists = [];
    this.initTournament();
  }

  // Fisher-Yates shuffle for randomized seeding
  shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  getRoundLabel(participantCount) {
    if (participantCount === 2) return "Grande Final";
    if (participantCount === 4) return "Semifinais";
    if (participantCount === 8) return "Quartas de Final";
    if (participantCount === 16) return "Oitavas de Final";
    return `Primeira Fase (${participantCount} Músicas)`;
  }

  initTournament() {
    this.rounds = [];
    this.currentRoundIndex = 0;
    this.isFinished = false;
    this.champion = null;
    this.runnerUp = null;
    this.semifinalists = [];

    // Always randomize initial bracket seeding
    const shuffled = this.shuffle(this.initialSongs);
    this.setupRound(shuffled, 0);
  }

  setupRound(participants, roundIdx) {
    const pool = [...participants];
    const matches = [];

    for (let i = 0; i < pool.length; i += 2) {
      matches.push({
        id: `r${roundIdx}-m${Math.floor(i / 2)}`,
        songA: pool[i],
        songB: pool[i + 1],
        winner: null
      });
    }

    const roundData = {
      index: roundIdx,
      name: this.getRoundLabel(participants.length),
      totalParticipants: participants.length,
      matches,
      currentMatchIndex: 0,
      winners: [],
      completed: false
    };

    this.rounds.push(roundData);
  }

  getCurrentRound() {
    return this.rounds[this.currentRoundIndex];
  }

  getCurrentMatch() {
    const round = this.getCurrentRound();
    if (!round || round.completed) return null;
    return round.matches[round.currentMatchIndex] || null;
  }

  // Vote for a song in the current match
  vote(winnerSong) {
    if (this.isFinished) return null;
    const round = this.getCurrentRound();
    if (!round) return null;

    const match = round.matches[round.currentMatchIndex];
    if (!match) return null;

    match.winner = winnerSong;
    const loser = match.songA.id === winnerSong.id ? match.songB : match.songA;
    round.winners.push(winnerSong);

    // Track semifinalists
    if (round.totalParticipants === 4) {
      this.semifinalists.push(loser);
    }

    // Check if current round has more matches
    if (round.currentMatchIndex + 1 < round.matches.length) {
      round.currentMatchIndex++;
      return {
        type: "NEXT_MATCH",
        match: this.getCurrentMatch(),
        roundIndex: this.currentRoundIndex,
        roundName: round.name,
        matchIndex: round.currentMatchIndex,
        totalMatches: round.matches.length
      };
    } else {
      // Current round finished!
      round.completed = true;

      // Check if tournament has reached final winner
      if (round.winners.length === 1) {
        this.isFinished = true;
        this.champion = round.winners[0];
        this.runnerUp = loser;
        return {
          type: "TOURNAMENT_COMPLETE",
          champion: this.champion,
          runnerUp: this.runnerUp,
          semifinalists: this.semifinalists
        };
      }

      // Next round setup
      const nextParticipants = this.shuffle(round.winners);
      this.currentRoundIndex++;
      this.setupRound(nextParticipants, this.currentRoundIndex);

      const nextRound = this.getCurrentRound();
      return {
        type: "ROUND_ADVANCED",
        newRound: nextRound,
        match: this.getCurrentMatch()
      };
    }
  }

  // Get total progress percentage across the tournament
  getProgress() {
    const totalMatches = this.initialSongs.length - 1; // 32 - 1 = 31 matches
    let completedMatches = 0;

    for (const r of this.rounds) {
      for (const m of r.matches) {
        if (m.winner) completedMatches++;
      }
    }

    const pct = Math.min(100, Math.round((completedMatches / totalMatches) * 100));
    return {
      completedMatches,
      totalMatches,
      percentage: pct
    };
  }

  // Export full bracket history for visualizer
  getBracketTree() {
    return this.rounds.map(r => ({
      index: r.index,
      name: r.name,
      totalParticipants: r.totalParticipants,
      matches: r.matches.map(m => ({
        id: m.id,
        songA: m.songA,
        songB: m.songB,
        winner: m.winner
      }))
    }));
  }
}

// Universal Environment Compatibility
if (typeof window !== "undefined") {
  window.BracketEngine = BracketEngine;
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = BracketEngine;
}
