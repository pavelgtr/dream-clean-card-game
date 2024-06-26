// gameFlow.js
import { gameState, resetGameState } from "./gameState.js";
import {
  soundEffects,
  getNextClickSound,
  getNextWinSound,
  getNextLoseSound,
} from "./soundEffects.js";
import {
  createCards,
  generateCardId,
  shuffleArray,
  updateTimerDisplay,
  updateScoreDisplay,
  triggerConfetti,
  toggleRoundTwoVisibility,
} from "./dom.js";
import { levelOne, levelTwo } from "./arrays.js";
import { startTimer, stopTimer, pauseTimer, resumeTimer } from "./timer.js";
import {
  incrementScore,
  incrementError,
  setPointsPerMatch,
  calculateSpeedBonus,
} from "./score.js";
import { displayRoundScoreModal } from "./modals.js";

import { submitScore } from "./leaderBoard.js";
import { displayfinalRoundCompletionModal } from "./modals.js";

export function startGame(nickname, email) {
  resetGameState(); // Reset the game state before starting a new game
  gameState.gameStarted = true;
  gameState.startTime = Date.now();
  gameState.gameLevel = 1;
  gameState.totalTime = 0;
  gameState.errorCount = 0;
  gameState.scoreCount = 0;
  gameState.matchedPairsCount = 0;
  gameState.playerNickname = nickname; // Ensure this is set
  gameState.playerEmail = email; // Ensure this is set
  console.log("Game started with Nickname:", gameState.playerNickname);
  console.log("Game started with Email:", gameState.playerEmail);
  setPointsPerMatch();
  resetTurn();
  startTimer();
}

export function resetTurn() {
  gameState.hasFlippedCard = false;
  gameState.gameBoardLocked = false;
  gameState.flippedCard1 = null;
  gameState.flippedCard2 = null;
}

export function resetGame() {
  console.log("Current Game Level before increment:", gameState.gameLevel);

  if (gameState.gameLevel === 2) {
    displayfinalRoundCompletionModal();
    console.log("Final level reached. Calculating totalTime...");
    console.log(`Elapsed time for the final round: ${elapsedTime} seconds`);
    gameState.totalTime += elapsedTime;
    console.log("Final Total Time calculated:", gameState.totalTime);

    setTimeout(function () {
      console.log("Redirecting to scoreboard...");
    }, 500);
  } else {
    gameState.gameLevel++;
    toggleRoundTwoVisibility();
    console.log(
      "Resetting game... Current Level after increment:",
      gameState.gameLevel
    );
    console.log(`Elapsed time for the round: ${gameState.elapsedTime} seconds`);
    console.log("Total Time calculated:", gameState.totalTime);

    let cardSet =
      gameState.gameLevel === 1
        ? levelOne
        : gameState.gameLevel === 2
        ? levelTwo
        : levelThree;
    createCards(cardSet);

    gameState.matchedPairsCount = 0;
    setPointsPerMatch();
    resetTurn();
  }
}

export function flipCard(event) {
  if (gameState.gameBoardLocked) return;

  const card = event.currentTarget;

  if (card === gameState.flippedCard1) return;

  if (card.classList.contains("matched")) return;

  const clickSound = getNextClickSound();
  clickSound.play();
  card.classList.add("is-flipped");

  // Get the card ID from the image source
  const imgElement = card.querySelector(".card__face--back img");
  const imgSrc = imgElement.src;
  const cardId = generateCardId(imgSrc);

  // Log the ID
  console.log(`Card ID: ${cardId}`);

  gameState.currentCardId = cardId; // Store the current card ID

  if (!gameState.hasFlippedCard) {
    gameState.hasFlippedCard = true;
    gameState.flippedCard1 = card;
    gameState.flippedCard1Id = cardId; // Store the ID
  } else {
    gameState.flippedCard2 = card;
    gameState.gameBoardLocked = true;
    gameState.flippedCard2Id = cardId; // Store the ID
    checkForMatch();
  }
}

const tipData = {
  "Dishwashing Liquid": {
    title: "Dishwasher soap",
    description: "Jabón para el lavado manual de vajillas, vasos y cubertería.",
  },
  "All purpose cleaner": {
    title: "All purpose Cleaner",
    description: "Limpiador para pisos, paredes y superficies en general.",
  },
  "Neutral Floor Cleaner": {
    title: "Neutral Floor Cleaner",
    description: "Limpiador de pisos duros como mármol, cerámica y madera.",
  },
  Detergent: {
    title: "Laundry Detergent",
    description: "Detergente concentrado para el lavado de todo tipo de ropas.",
  },
  "Bathroom Cleaner": {
    title: "Bathroom Cleaner",
    description:
      "Remueve residuos, desinfecta y limpia las superficies del baño.",
  },
  "Glass Cleaner": {
    title: "Glass Cleaner",
    description:
      "Limpiador para vidrios, cristales, espejos, aluminio y acero inoxidable.",
  },
};

function showTipContainer() {
  const tipContainer = document.querySelector(".tip-container");
  const tipsId = document.querySelector("#tips");
  const timer = document.querySelector("#timer");

  // Check if a card has been flipped
  if (!gameState.flippedCard1) {
    document.querySelector("#tip-title").textContent = "Consejo";
    document.querySelector(".tip-text p").innerHTML = `
        <span id="tip-title">Consejo</span> Voltea una carta primero y recibirás un consejo.
      `;
    tipContainer.removeAttribute("id");
    tipsId.style.display = "none";

    // Update the timer order
    if (window.innerWidth <= 950) {
      timer.style.order = "1";
    }

    // Automatically hide the tip container after 1.5 seconds
    setTimeout(() => {
      hideTipContainer();
    }, 1000); // Adjust the timing as needed
    return; // Exit the function
  }

  const cardId = gameState.currentCardId; // Use the stored card ID

  if (tipData[cardId]) {
    document.querySelector("#tip-title").textContent = tipData[cardId].title;
    document.querySelector(
      ".tip-text p"
    ).innerHTML = `<span id="tip-title">${tipData[cardId].title}</span> ${tipData[cardId].description}`;
  }

  tipContainer.removeAttribute("id");
  tipsId.style.display = "none";

  // Update the timer order
  if (window.innerWidth <= 950) {
    timer.style.order = "1";
  }

  console.log("showing tip container for", cardId);
}

function hideTipContainer() {
  setTimeout(() => {
    const tipContainer = document.querySelector(".tip-container");
    const tipsId = document.querySelector("#tips");
    const timer = document.querySelector("#timer");

    tipContainer.setAttribute("id", "hide");
    tipsId.style.display = "block";

    // Remove the timer order
    if (window.innerWidth <= 950) {
      timer.style.order = ""; // Remove the inline style
    }
  }, 1000);
}

document.addEventListener("DOMContentLoaded", () => {
  const tipImage = document.querySelector("#tipImage");

  tipImage.addEventListener("click", showTipContainer);
});

export function checkForMatch() {
  let baseName1 = gameState.flippedCard1
    .querySelector(".card__face--back img")
    .src.split("/")
    .pop()
    .replace(".jpg", "")
    .replace("-1", "");
  let baseName2 = gameState.flippedCard2
    .querySelector(".card__face--back img")
    .src.split("/")
    .pop()
    .replace(".jpg", "")
    .replace("-1", "");

  const isMatch = baseName1 === baseName2;

  if (isMatch) {
    disableCards();
    const speedBonus = calculateSpeedBonus();
    let firstTryBonus = 0;

    if (gameState.errorCount === 0) {
      firstTryBonus = 100;
      triggerConfetti();
    }

    incrementScore(speedBonus + firstTryBonus);
    gameState.matchedPairsCount++;
    const winSound = getNextWinSound();
    setTimeout(() => {
      winSound.play();
    }, 1000);
    checkEndOfRound();
    gameState.consecutiveErrors = 0;
  } else {
    // showTipContainer(); // Show the tip container if cards do not match

    unflipCards();
  }
}

export function unflipCards() {
  setTimeout(() => {
    gameState.flippedCard1.classList.remove("is-flipped");
    gameState.flippedCard2.classList.remove("is-flipped");
    const loseSound = getNextLoseSound();
    loseSound.play();
    incrementError();
    hideTipContainer(); // Hide the tip container if cards do not match
    resetTurn();
  }, 1500);
}

export function disableCards() {
  gameState.flippedCard1.classList.add("matched");
  gameState.flippedCard2.classList.add("matched");

  gameState.flippedCard1.removeEventListener("click", flipCard);
  gameState.flippedCard2.removeEventListener("click", flipCard);
  resetTurn();
}

export function checkEndOfRound() {
  const anyCardArray = levelOne;
  const totalPairs = anyCardArray.length / 2;
  console.log(
    "Matched pairs:",
    gameState.matchedPairsCount,
    "Total pairs:",
    totalPairs
  );

  gameState.currentTime = new Date().getTime();
  gameState.elapsedTime = (gameState.currentTime - gameState.startTime) / 1000; // Update elapsedTime in gameState
  console.log("Elapsed time at this point:", gameState.elapsedTime, "seconds");

  if (gameState.matchedPairsCount === totalPairs) {
    triggerConfetti();
    stopTimer();
    console.log("All pairs matched. Proceeding to reset game...");
    if (gameState.gameLevel < 2) {
      console.log("stopTimer Called");

      setTimeout(() => {
        console.log("About to display round score modal");
        resetGame();
        displayRoundScoreModal();
      }, 1000);
    } else {
      setTimeout(() => {
        triggerConfetti();
        console.log("Transitioning to scoreboard...");
        displayfinalRoundCompletionModal();
      }, 1000);
    }
    console.log("End of round reached.");
    console.log("Current Game Level before increment:", gameState.gameLevel);
  }
}

export function endGame() {
  const nickname = gameState.playerNickname;
  const email = gameState.playerEmail;
  const finalScore = gameState.scoreCount;
  console.log("Ending game with Nickname:", nickname); // Add this
  console.log("Ending game with Email:", email); // Add this
  submitScore(nickname, email, finalScore);
}
