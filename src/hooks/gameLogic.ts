export interface Roll {
  pins: number | null;
}

/*------------------- frame for up to 2 rolls -------------------*/
export interface Frame {
  rolls: Roll[];
  score: number | null;
  isStrike: boolean;
  isSpare: boolean;
}

/*------------------- game state -------------------*/
export interface BowlingGame {
  frames: Frame[];
  currentFrame: number;
  currentRoll: number;
  totalScore: number;
  isGameComplete: boolean;
}

/*------------------- new game session -------------------*/
export function createNewGame(): BowlingGame {
  return {
    frames: Array.from({ length: 10 }, (_, index) => ({
      rolls: index === 9 ? [{ pins: null }, { pins: null }, { pins: null }] : [{ pins: null }, { pins: null }],
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

/*------------------- Record a single roll -------------------*/
export function addRoll(game: BowlingGame, pins: number): BowlingGame {
  if (game.isGameComplete) {
    return game;
  }

  /*------------------- Input validation -------------------*/
  if (pins < 0 || pins > 10) {
    return game;
  }

  /*------------------- copy of the game state -------------------*/
  const newGame = { ...game, frames: [...game.frames] };
  const currentFrame = { ...newGame.frames[newGame.currentFrame] };
  currentFrame.rolls = [...currentFrame.rolls];
  newGame.frames[newGame.currentFrame] = currentFrame;

  /*------------------- dont go higher than pin selected -------------------*/
  if (newGame.currentRoll === 1 && newGame.currentFrame < 9) {
    const firstRollPins = currentFrame.rolls[0].pins || 0;
    if (firstRollPins + pins > 10) {
      return game;
    }
  }

  if (newGame.currentFrame === 9 && newGame.currentRoll === 1) {
    const roll1 = currentFrame.rolls[0].pins;
    if (roll1 !== null && roll1 !== 10 && roll1 + pins > 10) {
      return game;
    }
  }

  currentFrame.rolls[newGame.currentRoll].pins = pins;

  /*------------------- next roll or frame -------------------*/
  if (newGame.currentRoll === 0) {
    if (pins === 10) {
      currentFrame.isStrike = true;

      if (newGame.currentFrame === 9) {
        newGame.currentRoll = 1;
      } else {
        newGame.currentFrame++;
        newGame.currentRoll = 0;
      }
    } else {
      newGame.currentRoll = 1;
    }
  } else if (newGame.currentRoll === 1) {
    const firstRollPins = currentFrame.rolls[0].pins || 0;

    /*------------------- Check if it's a spare -------------------*/
    if (firstRollPins + pins === 10) {
      currentFrame.isSpare = true;
    }

    if (newGame.currentFrame === 9 && (currentFrame.isStrike || currentFrame.isSpare)) {
      newGame.currentRoll = 2;
    } else {
      newGame.currentFrame++;
      newGame.currentRoll = 0;
    }
  } else {
    newGame.currentFrame++;
    newGame.currentRoll = 0;
  }

  if (newGame.currentFrame >= 10) {
    newGame.isGameComplete = true;
  }

  if (newGame.currentFrame === 9) {
    handleTenthFrameLogic(newGame);
  }

  calculateBasicScores(newGame);

  return newGame;
}

/*------------------- Handle special 10th frame -------------------*/
function handleTenthFrameLogic(game: BowlingGame): void {
  const tenthFrame = game.frames[9];
  const roll1 = tenthFrame.rolls[0]?.pins;
  const roll2 = tenthFrame.rolls[1]?.pins;
  const roll3 = tenthFrame.rolls[2]?.pins;

  const firstRollStrike = roll1 === 10;
  const spare = roll1 !== null && roll2 !== null && roll1 !== 10 && roll1 + roll2 === 10;
  const needsThirdRoll = firstRollStrike || spare;

  if (needsThirdRoll) {
    if (roll3 === null && game.currentRoll < 2) {
      game.isGameComplete = false;
    } else if (roll3 !== null) {
      game.isGameComplete = true;
    }
  } else {
    if (roll1 !== null && roll2 !== null) {
      game.isGameComplete = true;
    }
  }
}

/*------------------- Calculate scores with strike -------------------*/
export function calculateBasicScores(game: BowlingGame): void {
  let runningTotal = 0;

  for (let i = 0; i < 10; i++) {
    const frame = game.frames[i];
    let frameScore = null;

    if (frame.isStrike) {
      if (i === 9) {
        frameScore = calculateTenthFrameScore(frame);
      } else {
        frameScore = calculateStrikeScore(game, i);
      }
    } else if (frame.isSpare) {
      if (i === 9) {
        frameScore = calculateTenthFrameScore(frame);
      } else {
        frameScore = calculateSpareScore(game, i);
      }
    } else {
      const roll1 = frame.rolls[0].pins;
      const roll2 = frame.rolls[1].pins;

      if (roll1 !== null && roll2 !== null) {
        frameScore = roll1 + roll2;
      }
    }

    if (frameScore !== null) {
      runningTotal += frameScore;
      frame.score = runningTotal;
    } else {
      frame.score = null;
    }
  }

  game.totalScore = runningTotal;
}

function calculateStrikeScore(game: BowlingGame, frameIndex: number): number | null {
  const bonus = getNextTwoRolls(game, frameIndex);

  if (bonus === null) {
    return null;
  }

  return 10 + bonus;
}

function calculateSpareScore(game: BowlingGame, frameIndex: number): number | null {
  const bonus = getNextOneRoll(game, frameIndex);

  if (bonus === null) {
    return null; // Can't calculate yet, need more rolls
  }

  return 10 + bonus;
}

function getNextTwoRolls(game: BowlingGame, frameIndex: number): number | null {
  if (frameIndex === 8) {
    const tenthFrame = game.frames[9];
    const roll1 = tenthFrame.rolls[0]?.pins;
    const roll2 = tenthFrame.rolls[1]?.pins;

    if (roll1 === null) return null;

    if (roll1 === 10) {
      if (roll2 === null) return null;
      return roll1 + roll2;
    }

    if (roll2 === null) return null;
    return roll1 + roll2;
  }

  if (frameIndex >= 9) return null;

  const nextFrame = game.frames[frameIndex + 1];
  const roll1 = nextFrame.rolls[0]?.pins;

  if (roll1 === null) return null;

  /*------------------- If next frame is a strike -------------------*/
  if (roll1 === 10) {
    if (frameIndex + 1 === 8) {
      const tenthFrame = game.frames[9];
      const tenthRoll1 = tenthFrame.rolls[0]?.pins;
      if (tenthRoll1 === null) return null;
      return roll1 + tenthRoll1;
    } else if (frameIndex + 1 < 8) {
      const frameAfterNext = game.frames[frameIndex + 2];
      const roll2 = frameAfterNext.rolls[0]?.pins;
      if (roll2 === null) return null;
      return roll1 + roll2;
    }
  }

  const roll2 = nextFrame.rolls[1]?.pins;
  if (roll2 === null) return null;

  return roll1 + roll2;
}

function getNextOneRoll(game: BowlingGame, frameIndex: number): number | null {
  if (frameIndex === 8) {
    const tenthFrame = game.frames[9];
    const roll1 = tenthFrame.rolls[0]?.pins;
    return roll1;
  }

  if (frameIndex >= 9) return null;

  const nextFrame = game.frames[frameIndex + 1];
  const roll1 = nextFrame.rolls[0]?.pins;

  return roll1;
}

function calculateTenthFrameScore(frame: Frame): number | null {
  let total = 0;
  const roll1 = frame.rolls[0]?.pins;
  const roll2 = frame.rolls[1]?.pins;
  const roll3 = frame.rolls[2]?.pins;

  if (roll1 === null || roll2 === null) return null;

  const needsThirdRoll = roll1 === 10 || roll1 + roll2 === 10;

  if (needsThirdRoll) {
    if (roll3 === null) return null;
    total = roll1 + roll2 + roll3;
  } else {
    total = roll1 + roll2;
  }

  return total;
}
