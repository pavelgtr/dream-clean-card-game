import { gameState } from "./gameState.js";
import { updateTimerDisplay } from "./dom.js";
import { resetGame } from "./gameFlow.js";

export function startTimer() {
  // Check if the timer was paused
  if (gameState.timerPaused) {
    gameState.startTime = Date.now() - gameState.secondsElapsed * 1000;
  } else {
    gameState.startTime = Date.now();
  }

  if (gameState.timer) {
    clearInterval(gameState.timer);
  }
  gameState.timer = setInterval(() => {
    const now = Date.now();
    gameState.secondsElapsed = Math.floor((now - gameState.startTime) / 1000);

    // Check if the maximum time of 5999 seconds (99:99) has been reached
    if (gameState.secondsElapsed >= 5999) {
      gameState.secondsElapsed = 5999; // Cap the secondsElapsed at 5999
      stopTimer(); // Optionally stop the timer if needed
      resetGame(); // Reset the game if needed
    }

    updateTimerDisplay(gameState.secondsElapsed);
  }, 1000);

  gameState.timerPaused = false;
}

export function stopTimer() {
  clearInterval(gameState.timer);
  gameState.timer = null;
  gameState.timerPaused = false;
}

export function pauseTimer() {
  clearInterval(gameState.timer);
  gameState.timerPaused = true;
}

export function resumeTimer() {
  startTimer();
}

export function formatTime(seconds) {
  if (isNaN(seconds)) {
    console.error("Invalid time value passed to formatTime:", seconds);
    return "00:00";
  }

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
}
