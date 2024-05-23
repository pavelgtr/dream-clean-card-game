// modals.js
import { gameState } from "./gameState.js";
import { soundEffects } from "./soundEffects.js";
import { startGame, endGame } from "./gameFlow.js";
import { displayScoreBoardModal } from "./leaderBoard.js";
import { levelOne } from "./arrays.js";
import { createCards } from "./dom.js";
import { startTimer } from "./timer.js";

export function showWelcomeMessage() {
  createCards(levelOne);
  const welcomeModal = document.getElementById("welcomeModal");
  welcomeModal.style.display = "block";
  const welcomeContinueButton = document.getElementById("welcomeContinue");
  welcomeContinueButton.addEventListener("click", function () {
    welcomeModal.style.display = "none";
    soundEffects.startGame.play();
    showSignInModal();
  });
}

export function showSignInModal() {
  const signinModal = document.getElementById("signinModal");
  signinModal.style.display = "block";

  const form = document.getElementById("signinForm");
  form.onsubmit = function (event) {
    event.preventDefault();
    const nickname = document.getElementById("nickname").value;
    const email = document.getElementById("email").value;
    soundEffects.startGame.play();
    signinModal.style.display = "none";
    displayGameInstructionsModal(nickname, email);
    console.log("Nickname:", nickname);
    console.log("Email:", email);
  };
}

export function displayGameInstructionsModal(nickname, email) {
  const gameInstructionsModal = document.getElementById(
    "gameInstructionsModal"
  );
  gameInstructionsModal.style.display = "block";
  const startGameButton = document.getElementById("startGameButton");
  startGameButton.addEventListener("click", function () {
    gameInstructionsModal.style.display = "none";
    startGame(nickname, email);
    soundEffects.buttonClick.play();
  });
}

export function displayRound2InstructionsModal() {
  const round2InstructionsModal = document.getElementById(
    "Round2InstructionsModal"
  );
  round2InstructionsModal.style.display = "block";
  const round2ContinueBtn = document.getElementById("round2ContinueBtn");
  round2ContinueBtn.addEventListener("click", function () {
    round2InstructionsModal.style.display = "none";
    soundEffects.startGame.play();
    startTimer();
  });
}

export function displayRoundScoreModal() {
  const roundScoreModal = document.getElementById("roundScoreModal");
  const gameLevelElement = document.getElementById("gameLevel");
  const roundOneScoreElement = document.getElementById("roundOneScore");
  const nextRoundButton = document.getElementById("nextRoundButton");

  gameLevelElement.textContent = `NIVEL ${gameState.gameLevel - 1} COMPLETADO`;
  roundOneScoreElement.textContent = gameState.scoreCount;

  roundScoreModal.style.display = "block";

  document.getElementById("next-level").textContent = gameState.gameLevel;
  nextRoundButton.addEventListener("click", function () {
    roundScoreModal.style.display = "none";
    displayRound2InstructionsModal();
    soundEffects.buttonClick.play();
  });
}

export function displayfinalRoundCompletionModal() {
  const finalRoundCompletionModal = document.getElementById(
    "FinalRoundCompletionModal"
  );
  finalRoundCompletionModal.style.display = "block";
  const round3CompletionPoints = document.getElementById(
    "round3CompletionPoints"
  );
  round3CompletionPoints.textContent = `${gameState.scoreCount}`;
  const viewLeaderboardBtn = document.getElementById("viewLeaderboardBtn");
  viewLeaderboardBtn.addEventListener("click", function () {
    finalRoundCompletionModal.style.display = "none";
    soundEffects.buttonClick.play();
    endGame();
  });
}
