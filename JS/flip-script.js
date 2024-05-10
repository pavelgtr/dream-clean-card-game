// -------------------------------------- VARIABLES  --------------------------------------

let hasFlippedCard = false;
let flippedCard1, flippedCard2;
let gameBoardLocked = false;
let timer = null;
let secondsElapsed = 0;
let errorCount = 0;
let scoreCount = 0;
let matchedPairsCount = 0;
let gameLevel = 1;
let finalResultsDisplayed = false;
let scoreSubmitted = false;
let totalTime = 0;
let elapsedTime;
let startTime;
let currentTime;
const soundEffects = {
  click: new Audio("./sounds/flip.wav"),
  error: new Audio("./sounds/fail.wav"),
  win: new Audio("./sounds/cheer.wav"),
};

const timerDisplay = document.querySelector("#timer span");
const scoreDisplay = document.querySelector("#score span");

let form = document.getElementById("signinForm");

const nickname = document.getElementById("nickname");

var emailInput = document.getElementById("email");

// -------------------------------------- LOAD PAGE  --------------------------------------

document.addEventListener("DOMContentLoaded", function () {
  showWelcomeMessage();
  // displayScoreBoardModal();
});

function showSignInModal() {
  createCards(levelOne); // Start with level one cards
  const signinModal = document.getElementById("signinModal");
  signinModal.style.display = "block";

  document.getElementById("signinForm").onsubmit = function (event) {
    event.preventDefault();
    const nickname = document.getElementById("nickname").value;
    const email = document.getElementById("email").value;
    localStorage.setItem("userNickname", nickname);
    localStorage.setItem("userEmail", email);
    signinModal.style.display = "none";
    displayGameInstructionsModal();
  };
}

function showWelcomeMessage() {
  const welcomeModal = document.getElementById("welcomeModal");
  welcomeModal.style.display = "block";
  const welcomeContinueButton = document.getElementById("welcomeContinue");
  welcomeContinueButton.addEventListener("click", function () {
    welcomeModal.style.display = "none";
    showSignInModal();
  });
}

function createCards(imagesArray) {
  const container = document.querySelector(".cards-container");
  // shuffleArray(imagesArray);
  container.innerHTML = imagesArray
    .map(
      (imageSrc, index) => `
   <div class="card created-card">
     <div class="card__inner" onclick="flipCard(event, ${index})">
       <div class="card__face card__face--front"><img src="./images/Menu/Back.png" alt="card-back-design"></div>
       <div class="card__face card__face--back">
             <img src="${imageSrc}" alt="Card image ${index}" class="pp">
           </div>
         </div>
       </div>
     </div>
   </div>
 `
    )
    .join("");
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// -------------------------------------- GAME FLOW --------------------------------------
function startGame() {
  gameLevel = 1; // Ensure the game starts at level one
  totalTime = 0;
  localStorage.setItem("startTime", startTime);
  errorCount = 0; // Reset errors if starting a new game
  scoreCount = 0; // Reset score if starting a new game
  matchedPairsCount = 0; // Reset matched pairs count
  setPointsPerMatch(); // Set initial points per match
  resetTurn();
  startTimer();
}

function resetTurn() {
  // Set hasFlippedCard and gameBoardLocked to false
  hasFlippedCard = false;
  gameBoardLocked = false;

  // Set flippedCard1 and flippedCard2 to null
  flippedCard1 = null;
  flippedCard2 = null;
}

function resetGame() {
  stopTimer();
  console.log("Current time:", formatTime(currentTime / 1000));
  console.log("Start time:", formatTime(startTime / 1000));
  console.log(
    "Elapsed time for the round (in seconds):",
    (currentTime - startTime) / 1000
  );
  console.log("Current Game Level before increment:", gameLevel);

  if (gameLevel === 3) {
    // Handle the end of the last level
    console.log("Final level reached. Calculating totalTime...");
    console.log(`Elapsed time for the final round: ${elapsedTime} seconds`);
    totalTime += elapsedTime;
    console.log("Final Total Time calculated:", totalTime);

    // store the nickname and total score in the local storage

    // Delay before redirection
    setTimeout(function () {
      console.log("Redirecting to scoreboard...");
      // window.location.href = "./HTML/scoreboard.html";
      displayRound3CompletionModal();
    }, 500);
  } else {
    gameLevel++;
    console.log("Resetting game... Current Level after increment:", gameLevel);
    console.log(`Elapsed time for the round: ${elapsedTime} seconds`);

    totalTime += elapsedTime;
    console.log("Total Time calculated:", totalTime);
    // Determine the correct card set based on the current game level
    let cardSet =
      gameLevel === 1 ? levelOne : gameLevel === 2 ? levelTwo : levelThree;
    createCards(cardSet);

    // Reset game state for a new round
    matchedPairsCount = 0;
    setPointsPerMatch();
    resetTurn();
    // will put this in score modal
    // startTimer();
  }
}

// -------------------------------------- TIMER FUNCTIONS --------------------------------------

function startTimer() {
  if (timer !== null) {
    clearInterval(timer);
  }

  startTime = new Date().getTime(); // Store the start time
  timer = setInterval(() => {
    secondsElapsed++;
    updateTimerDisplay(secondsElapsed);
  }, 1000);
}

function updateTimerDisplay(seconds) {
  // Ensure the timerDisplay variable targets the span where the time should be displayed
  const timerDisplay = document.querySelector("#timer span");
  timerDisplay.textContent = formatTime(seconds);
}

function stopTimer() {
  clearInterval(timer);
  secondsElapsed = 0;
  updateTimerDisplay(secondsElapsed);
}

function formatTime(seconds) {
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

function calculateSpeedBonus() {
  if (secondsElapsed < 60) {
    return 30;
  } else if (secondsElapsed < 120) {
    return 20;
  } else if (secondsElapsed < 180) {
    return 10;
  } else {
    return 0;
  }
}

// -------------------------------------- CARD FLIP FUNCTIONS --------------------------------------
function flipCard(event) {
  if (gameBoardLocked) return;
  const card = event.currentTarget;
  if (card === flippedCard1) return;

  if (card.classList.contains("matched")) return;

  soundEffects.click.play();
  card.classList.add("is-flipped");

  if (!hasFlippedCard) {
    hasFlippedCard = true;
    flippedCard1 = card;
  } else {
    flippedCard2 = card;
    gameBoardLocked = true;
    checkForMatch();
  }
}

function checkForMatch() {
  let baseName1 = flippedCard1
    .querySelector(".card__face--back img")
    .src.split("/")
    .pop()
    .replace(".jpg", "")
    .replace("-1", "");
  let baseName2 = flippedCard2
    .querySelector(".card__face--back img")

    .src.split("/")
    .pop()
    .replace(".jpg", "")
    .replace("-1", "");

  const isMatch = baseName1 === baseName2;

  if (isMatch) {
    disableCards();
    const speedBonus = calculateSpeedBonus();
    incrementScore(speedBonus);
    matchedPairsCount++; // Increment matched pairs count
    checkEndOfRound();
  } else {
    unflipCards();
  }
}

function unflipCards() {
  setTimeout(() => {
    flippedCard1.classList.remove("is-flipped");
    flippedCard2.classList.remove("is-flipped");
    soundEffects.error.play();
    incrementError();
    resetTurn();
  }, 1500);
}

function disableCards() {
  flippedCard1.classList.add("matched");
  flippedCard2.classList.add("matched");

  flippedCard1.removeEventListener("click", flipCard);
  flippedCard2.removeEventListener("click", flipCard);
  resetTurn();
  soundEffects.win.play();
}

// -------------------------------------- SCORE FUNCTIONS --------------------------------------

function incrementScore(speedBonus = 0) {
  scoreCount += pointsPerMatch + speedBonus;
  // Update scoreDisplay to target the span for text content
  const scoreDisplay = document.querySelector("#score span");
  scoreDisplay.textContent = scoreCount;
}

function incrementError() {
  errorCount++;
  scoreCount = Math.max(0, scoreCount - 2);
  scoreDisplay.textContent = `Puntos: ${scoreCount}`;
}

function setPointsPerMatch() {
  if (gameLevel === 1) {
    pointsPerMatch = 10;
  } else if (gameLevel === 2) {
    pointsPerMatch = 15;
  } else if (gameLevel === 3) {
    pointsPerMatch = 20;
  }
}

function checkEndOfRound() {
  const anyCardArray = levelOne;
  const totalPairs = anyCardArray.length / 2;
  console.log("Matched pairs:", matchedPairsCount, "Total pairs:", totalPairs);

  currentTime = new Date().getTime();
  elapsedTime = (currentTime - startTime) / 1000;
  if (matchedPairsCount === totalPairs) {
    console.log("Elapsed time for the round:", elapsedTime, "seconds");
    stopTimer();
    console.log("All pairs matched. Proceeding to reset game...");
    if (gameLevel < 3) {
      setTimeout(() => {
        // alert("Congratulations! You have found all matches in this round!");
        displayRoundScoreModal();
        resetGame();
      }, 200);
    } else {
      setTimeout(() => {
        console.log("Transitioning to scoreboard...");
        // window.location.href = "./HTML/scoreboard.html";
        resetGame();
      }, 1000);
    }
    console.log("End of round reached."); // Add this line
    console.log("Current Game Level before increment:", gameLevel);
  }
}

// ---------------------------------------------MODALS ---------------------------------------------

function displayRoundScoreModal() {
  const roundScoreModal = document.getElementById("roundScoreModal");
  const gameLevelElement = document.getElementById("gameLevel");
  const roundOneScoreElement = document.getElementById("roundOneScore");
  const nextRoundButton = document.getElementById("nextRoundButton");

  gameLevelElement.textContent = `NIVEL ${gameLevel} COMPLETADO`;
  roundOneScoreElement.textContent = scoreCount;

  roundScoreModal.style.display = "block";

  document.getElementById("next-level").textContent = gameLevel + 1;
  nextRoundButton.addEventListener("click", function () {
    roundScoreModal.style.display = "none";
    if (gameLevel == 2) {
      displayRound2InstructionsModal();
    } else if (gameLevel == 3) {
      displayRound3InstructionsModal();
    }
    // startTimer();
  });
}

function displayRound3CompletionModal() {
  const round3CompletionModal = document.getElementById(
    "Round3CompletionModal"
  );
  round3CompletionModal.style.display = "block";
  const round3CompletionPoints = document.getElementById(
    "round3CompletionPoints"
  );
  round3CompletionPoints.textContent = `${scoreCount}`;
  const viewLeaderboardBtn = document.getElementById("viewLeaderboardBtn");
  viewLeaderboardBtn.addEventListener("click", function () {
    round3CompletionModal.style.display = "none";
    // window.location.href = "./HTML/scoreboard.html";
    // displayScoreBoardModal();
    endGame();
  });
}

function endGame() {
  // Assume we get the nickname from local storage or a global variable
  const nickname = localStorage.getItem("userNickname");
  const finalScore = scoreCount; // scoreCount should be your game's scoring variable

  // Update the leaderboard with the final score
  updateLeaderboard(nickname, finalScore);

  // Now display the scoreboard modal
  displayScoreBoardModal();
}

function displayGameInstructionsModal() {
  const gameInstructionsModal = document.getElementById(
    "gameInstructionsModal"
  );
  gameInstructionsModal.style.display = "block";
  const startGameButton = document.getElementById("startGameButton");
  startGameButton.addEventListener("click", function () {
    gameInstructionsModal.style.display = "none";
    startGame();
  });
}

function displayRound2InstructionsModal() {
  const round2InstructionsModal = document.getElementById(
    "Round2InstructionsModal"
  );
  round2InstructionsModal.style.display = "block";
  const round2ContinueBtn = document.getElementById("round2ContinueBtn");
  round2ContinueBtn.addEventListener("click", function () {
    round2InstructionsModal.style.display = "none";
    startTimer();
  });
}

function displayRound3InstructionsModal() {
  const round3InstructionsModal = document.getElementById(
    "Round3InstructionsModal"
  );
  round3InstructionsModal.style.display = "block";
  const round3ContinueBtn = document.getElementById("round3ContinueBtn");
  round3ContinueBtn.addEventListener("click", function () {
    round3InstructionsModal.style.display = "none";
    startTimer();
  });
}

function displayScoreBoardModal() {
  const scoreboardModal = document.getElementById("ScoreBoardModal");
  const playerNicknameDisplay = document.getElementById("player-nickname");
  const playerScoreDisplay = document.getElementById("player-score");

  // Retrieve current player's nickname and score
  const currentNickname = localStorage.getItem("userNickname");
  const currentScore = scoreCount; // Assuming scoreCount holds the current score

  // Display current player's nickname and score
  playerNicknameDisplay.textContent = currentNickname;
  playerScoreDisplay.textContent = `Puntos: ${currentScore}`;

  // Show the modal
  if (scoreboardModal) {
    scoreboardModal.style.display = "block";
  } else {
    console.error("ScoreBoardModal not found!");
  }
}

// -------------------------------------- LOCAL STORAGE --------------------------------------

function updateLeaderboard(nickname, score) {
  // Retrieve the existing leaderboard from local storage or initialize it as an empty array if not found
  let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];

  // Create an object for the current player's nickname and score
  let playerData = { nickname: nickname, score: score };

  // Add the current player's data to the leaderboard array
  leaderboard.push(playerData);

  // Sort the leaderboard array by score in descending order to ensure the highest scores are first
  leaderboard.sort((a, b) => b.score - a.score);

  // Trim the leaderboard to only the top 5 scores to save space and maintain focus on the highest scores
  leaderboard = leaderboard.slice(0, 5);

  // Save the updated leaderboard array back to local storage as a JSON string
  localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
}

// < ---------------------------------------------- ARRAYS ---------------------------------------------- >

const levelOne = [
  "./images/levelOne/a.jpg",
  "./images/levelOne/a-1.jpg",
  "./images/levelOne/b.jpg",
  "./images/levelOne/b-1.jpg",
  // "./images/levelOne/c.jpg",
  // "./images/levelOne/c-1.jpg",
  // "./images/levelOne/d.jpg",
  // "./images/levelOne/d-1.jpg",
  // "./images/levelOne/e.jpg",
  // "./images/levelOne/e-1.jpg",
  // "./images/levelOne/f.jpg",
  // "./images/levelOne/f-1.jpg",
];

const levelTwo = [
  "./images/levelTwo/a.jpg",
  "./images/levelTwo/a-1.jpg",
  "./images/levelTwo/b.jpg",
  "./images/levelTwo/b-1.jpg",
  // "./images/levelTwo/c.jpg",
  // "./images/levelTwo/c-1.jpg",
  // "./images/levelTwo/d.jpg",
  // "./images/levelTwo/d-1.jpg",
  // "./images/levelTwo/e.jpg",
  // "./images/levelTwo/e-1.jpg",
  // "./images/levelTwo/f.jpg",
  // "./images/levelTwo/f-1.jpg",
];
const levelThree = [
  "./images/levelThree/a.jpg",
  "./images/levelThree/a-1.jpg",
  "./images/levelThree/b.jpg",
  "./images/levelThree/b-1.jpg",
  // "./images/levelThree/c.jpg",
  // "./images/levelThree/c-1.jpg",
  // "./images/levelThree/d.jpg",
  // "./images/levelThree/d-1.jpg",
  // "./images/levelThree/e.jpg",
  // "./images/levelThree/e-1.jpg",
  // "./images/levelThree/f.jpg",
  // "./images/levelThree/f-1.jpg",
];
