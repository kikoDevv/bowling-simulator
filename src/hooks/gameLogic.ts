export interface Roll {
  pins: number | null;
}

export interface Frame {
  rolls: Roll[];
  score: number | null;
}

/*------------------- game state -------------------*/
export interface BowlingGame {
  frames: Frame[];
  currentFrame: number;
  currentRoll: number;
  totalScore: number;
  isGameComplete: boolean;
}

/*------------------- new game sesstion -------------------*/
export function createNewGame(): BowlingGame {
  return {
    frames: Array.from({ length: 10 }, () => ({
      rolls: [{ pins: null }, { pins: null }],
      score: null,
    })),
    currentFrame: 0,
    currentRoll: 0,
    totalScore: 0,
    isGameComplete: false,
  };
}
