/**
 * Tournament Bracket Engine
 * Handles randomized matching, odd-number byes, round progression, and bracket history.
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

  // Fisher-Yates shuffle for true random bracket generation
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
    if (participantCount === 3 || participantCount === 4) return "Semifinal";
    if (participantCount <= 8) return "Quartas de Final";
    if (participantCount <= 16) return "Oitavas de Final";
    return `Rodada de ${participantCount} Músicas`;
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
    let pool = [...participants];
    let byeSong = null;

    // Handle odd number of participants: 1 song gets a BYE (passes directly)
    if (pool.length % 2 !== 0) {
      // Last song in the randomized pool gets the bye
      byeSong = pool.pop();
    }

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
      byeSong,
      currentMatchIndex: 0,
      winners: byeSong ? [byeSong] : [], // Bye song automatically moves to next round
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

    // Track semifinalists if in semifinals
    if (round.totalParticipants <= 4 && round.totalParticipants > 2) {
      this.semifinalists.push(loser);
    }

    // Check if round has more matches
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

      // Check if tournament is finished
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

      // Prepare next round with winners
      // Shuffle winners for fresh matchups
      const nextParticipants = this.shuffle(round.winners);
      this.currentRoundIndex++;
      this.setupRound(nextParticipants, this.currentRoundIndex);

      const nextRound = this.getCurrentRound();
      return {
        type: "ROUND_ADVANCED",
        newRound: nextRound,
        byeSong: nextRound.byeSong,
        match: this.getCurrentMatch()
      };
    }
  }

  // Get total progress percentage across the entire tournament
  getProgress() {
    let totalEstimatedMatches = 0;
    let n = this.initialSongs.length;
    // In single elimination, total matches = n - 1
    totalEstimatedMatches = n - 1;

    let completedMatches = 0;
    for (const r of this.rounds) {
      for (const m of r.matches) {
        if (m.winner) completedMatches++;
      }
    }

    const pct = Math.min(100, Math.round((completedMatches / totalEstimatedMatches) * 100));
    return {
      completedMatches,
      totalMatches: totalEstimatedMatches,
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
      })),
      byeSong: r.byeSong
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

