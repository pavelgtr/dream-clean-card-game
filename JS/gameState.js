// gameState.js
export const gameState = {
  hasFlippedCard: false,
  flippedCard1: null,
  flippedCard2: null,
  gameBoardLocked: false,
  timer: null,
  secondsElapsed: 0,
  errorCount: 0,
  consecutiveErrors: 0,
  scoreCount: 0,
  matchedPairsCount: 0,
  gameLevel: 1,
  finalResultsDisplayed: false,
  scoreSubmitted: false,
  totalTime: 0,
  elapsedTime: 0,
  startTime: null,
  currentTime: null,
  timerPaused: false,
  gameStarted: false,
  // soundEffects: {
  //   click: new Audio("./sounds/flip.wav"),
  //   error: new Audio("./sounds/fail.wav"),
  //   win: new Audio("./sounds/cheer.wav"),
  // },
  playerNickname: "",
  playerEmail: "",
};

export function resetGameState() {
  gameState.gameStarted = false;
  gameState.hasFlippedCard = false;
  gameState.flippedCard1 = null;
  gameState.flippedCard2 = null;
  gameState.gameBoardLocked = false;
  gameState.timer = null;
  gameState.secondsElapsed = 0;
  gameState.errorCount = 0;
  gameState.scoreCount = 0;
  gameState.matchedPairsCount = 0;
  gameState.gameLevel = 1;
  gameState.finalResultsDisplayed = false;
  gameState.scoreSubmitted = false;
  gameState.totalTime = 0;
  gameState.elapsedTime = 0;
  gameState.startTime = null;
  gameState.currentTime = null;
  gameState.playerNickname = ""; // Ensure this is reset
  gameState.playerEmail = ""; // Ensure this is reset
}
