export interface Roll {
  pins: number | null;
}

export interface Frame {
  rolls: Roll[];
  score: number | null;
  isStrike: boolean;
  isSpare: boolean;
}

export interface BowlingGame {
  frames: Frame[];
  currentFrame: number;
  currentRoll: number;
  totalScore: number;
  isGameComplete: boolean;
}

export function createNewGame(): BowlingGame {
  return {
    frames: Array.from({ length: 10 }, () => ({
      rolls: [{ pins: null }, { pins: null }],
      score: null,
      isStrike: false,
      isSpare: false,
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
      currentFrame.isStrike = true;
      newGame.currentFrame++;
      newGame.currentRoll = 0;
    } else {
      newGame.currentRoll = 1;
    }
  } else {
    const firstRollPins = currentFrame.rolls[0].pins || 0;

    if (firstRollPins + pins === 10) {
      currentFrame.isSpare = true;
    }

    newGame.currentFrame++;
    newGame.currentRoll = 0;
  }

  if (newGame.currentFrame >= 10) {
    newGame.isGameComplete = true;
  }

  calculateBasicScores(newGame);

  return newGame;
}

export function calculateBasicScores(game: BowlingGame): void {
  let runningTotal = 0;

  for (let i = 0; i < 10; i++) {
    const frame = game.frames[i];
    const roll1 = frame.rolls[0].pins;
    const roll2 = frame.rolls[1].pins;

    if (frame.isStrike && roll1 === 10) {
      runningTotal += 10;
      frame.score = runningTotal;
      continue;
    }

    if (roll1 === null || roll2 === null) {
      frame.score = null;
      continue;
    }

    if (frame.isSpare) {
      runningTotal += 10;
    } else {
      runningTotal += roll1 + roll2;
    }

    frame.score = runningTotal;
  }

  /*------------------- Update total score -------------------*/
  game.totalScore = runningTotal;
}
