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

/*------------------- new game sessison -------------------*/
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

export function addRoll(game: BowlingGame, pins: number): BowlingGame {
  if (game.isGameComplete) {
    return game;
  }

  const newGame = { ...game, frames: [...game.frames] };
  const currentFrame = { ...newGame.frames[newGame.currentFrame] };
  currentFrame.rolls = [...currentFrame.rolls];
  newGame.frames[newGame.currentFrame] = currentFrame;

  currentFrame.rolls[newGame.currentRoll].pins = pins;

  if (newGame.currentRoll === 0) {
    if (pins === 10) {
      newGame.currentFrame++;
      newGame.currentRoll = 0;
    } else {
      newGame.currentRoll = 1;
    }
  } else {
    newGame.currentFrame++;
    newGame.currentRoll = 0;
  }

  if (newGame.currentFrame >= 10) {
    newGame.isGameComplete = true;
  }

  return newGame;
}
