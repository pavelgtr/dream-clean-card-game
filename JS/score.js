// score.js
import { gameState } from "./gameState.js";
import { updateScoreDisplay } from "./dom.js";

export function incrementScore(speedBonus = 0) {
  gameState.scoreCount += gameState.pointsPerMatch + speedBonus;
  updateScoreDisplay(gameState.scoreCount);
}

export function incrementError() {
  gameState.errorCount++;
  gameState.consecutiveErrors++;

  let deduction = 1;
  if (gameState.consecutiveErrors > 1) {
    deduction += (gameState.consecutiveErrors - 1) * 2;
  }

  gameState.scoreCount = Math.max(0, gameState.scoreCount - deduction);
  updateScoreDisplay(gameState.scoreCount);
}

export function setPointsPerMatch() {
  if (gameState.gameLevel === 1) {
    gameState.pointsPerMatch = 10;
  } else if (gameState.gameLevel === 2) {
    gameState.pointsPerMatch = 15;
  }
}

export function calculateSpeedBonus() {
  if (gameState.secondsElapsed < 30) {
    return 25;
  } else if (gameState.secondsElapsed >= 30 && gameState.secondsElapsed < 60) {
    return 20;
  } else if (gameState.secondsElapsed >= 60 && gameState.secondsElapsed < 90) {
    return 15;
  } else if (gameState.secondsElapsed >= 90 && gameState.secondsElapsed < 120) {
    return 10;
  } else if (
    gameState.secondsElapsed >= 120 &&
    gameState.secondsElapsed < 150
  ) {
    return 5;
  } else {
    return 1;
  }
}
