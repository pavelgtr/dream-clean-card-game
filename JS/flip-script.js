// -------------------------------------- VARIABLES  --------------------------------------

const gameState = {
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
  soundEffects: {
    click: new Audio("./sounds/flip.wav"),
    error: new Audio("./sounds/fail.wav"),
    win: new Audio("./sounds/cheer.wav"),
  },
};

const soundEffects = {
  buttonClick: new Audio("./sounds/Glass Button Ding.wav"),
  startGame: new Audio("./sounds/Cards Card Flick.wav"),
  clickSounds: [
    new Audio("./sounds/Mountain Audio - Cardboard Game Card Flip - 1.mp3"),
    new Audio("./sounds/Mountain Audio - Cardboard Game Card Flip - 2.mp3"),
    new Audio("./sounds/Mountain Audio - Cardboard Game Card Flip - 3.mp3"),
    new Audio("./sounds/Mountain Audio - Cardboard Game Card Flip - 4.mp3"),
    new Audio("./sounds/Mountain Audio - Cardboard Game Card Flip - 5.mp3"),
    new Audio("./sounds/Mountain Audio - Cardboard Game Card Flip - 6.mp3"),
  ],
  winSounds: [
    new Audio("./sounds/Slot Win 1.mp3"),
    new Audio("./sounds/Slot Win 2.mp3"),
    new Audio("./sounds/Slot Win 3.mp3"),
    new Audio("./sounds/Slot Win 4.mp3"),
    new Audio("./sounds/Slot Win 5.mp3"),
    new Audio("./sounds/Slot Win 6.mp3"),
  ],
  loseSounds: [
    new Audio("./sounds/Application Fail 1.mp3"),
    new Audio("./sounds/Application Fail 2.mp3"),
    new Audio("./sounds/Application Fail 3.mp3"),
  ],
  currentClickIndex: 0,
  currentWinIndex: 0,
  currentLoseIndex: 0,
};

let timerDisplay = document.querySelector("#timer span");
let scoreDisplay = document.querySelector("#score span");

let form = document.getElementById("signinForm");

let nickname = document.getElementById("nickname");

var email = document.getElementById("email");

// -------------------------------------- LOAD PAGE  --------------------------------------

document.addEventListener("DOMContentLoaded", function () {
  showWelcomeMessage();

  // TESTING calls below to be removed in final version
  // displayGameInstructionsModal();
  // displayRound2InstructionsModal();
  // displayfinalRoundCompletionModal();
  // displayRoundScoreModal();
  // showSignInModal();
  // createCards(levelOne);
  // displayScoreBoardModal();
  // showFullInstructionsModal();

  // Initialize the necessary elements
  const elements = {
    hamburgerMenu: document.querySelector(".hamburger-menu"),
    mobileMenu: document.querySelector(".mobile-menu"),
    leaderboardLink: document.getElementById("leaderboardLink"),
    rulesLink: document.getElementById("rulesLink"),
    navLinks: document.querySelectorAll(".navigation-elements a"),
    mobileRulesLink: document.getElementById("mobile-rulesLink"),
    mobileLeaderboardLink: document.getElementById("mobile-leaderboardLink"),
    closeInstructionsModal: document.getElementById("closeInstructionsModal"),
    scoreboardModal: document.getElementById("ScoreBoardModal"),
  };

  // Add event listeners
  addEventListeners(elements);
  setActiveLinkOnLoad(elements.navLinks);
});

function addEventListeners(elements) {
  if (elements.hamburgerMenu && elements.mobileMenu) {
    elements.hamburgerMenu.addEventListener("click", toggleMobileMenu);
  }

  if (elements.mobileRulesLink) {
    elements.mobileRulesLink.addEventListener("click", function (event) {
      event.preventDefault();
      showModal("FullInstructionsModal");
      elements.mobileMenu.style.display = "none"; // Close the mobile menu
      pauseTimer();
    });
  }

  if (elements.mobileLeaderboardLink) {
    elements.mobileLeaderboardLink.addEventListener("click", function (event) {
      event.preventDefault();
      displayScoreBoardModal();
      elements.mobileMenu.style.display = "none"; // Close the mobile menu
      pauseTimer();
    });
  }

  if (elements.leaderboardLink) {
    elements.leaderboardLink.addEventListener("click", function (event) {
      event.preventDefault();
      displayScoreBoardModal();
      setActive;
      setActiveLink(event);
      pauseTimer();
    });
  }

  if (elements.rulesLink) {
    elements.rulesLink.addEventListener("click", function (event) {
      event.preventDefault();
      showModal("FullInstructionsModal");
      setActiveLink(event);
      pauseTimer();
    });
  }

  if (elements.closeInstructionsModal) {
    elements.closeInstructionsModal.addEventListener("click", function () {
      closeModal("FullInstructionsModal");
      highlightJuegoLink(elements.navLinks);
      resumeTimer();
    });
  }

  if (elements.scoreboardModal) {
    const closeButton = elements.scoreboardModal.querySelector(".close-button");
    if (closeButton) {
      closeButton.addEventListener("click", function () {
        elements.scoreboardModal.style.display = "none";
        highlightJuegoLink(elements.navLinks);
        resumeTimer();
      });
    }
  }

  elements.navLinks.forEach((link) => {
    link.addEventListener("click", setActiveLink);
  });
}

function setActiveLink(event) {
  const navLinks = document.querySelectorAll(".navigation-elements a");
  navLinks.forEach((link) => {
    link.classList.remove("active");
  });
  event.currentTarget.classList.add("active");
}

function highlightJuegoLink(navLinks) {
  navLinks.forEach((link) => {
    link.classList.remove("active");
  });
  const juegoLink = document.querySelector(
    ".navigation-elements a[href='index.html']"
  );
  if (juegoLink) {
    juegoLink.classList.add("active");
  }
}

function setActiveLinkOnLoad(navLinks) {
  navLinks.forEach((link) => {
    if (link.href === window.location.href) {
      link.classList.add("active");
    }
  });
}

function toggleMobileMenu() {
  const mobileMenu = document.querySelector(".mobile-menu");
  if (mobileMenu) {
    mobileMenu.style.display =
      mobileMenu.style.display === "flex" ? "none" : "flex";
  }
}

function showModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = "block";
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = "none";
  }
}

// Temporary function to call modal on page load for testing

function showFullInstructionsModal() {
  const fullInstructionsModal = document.getElementById(
    "FullInstructionsModal"
  );
  fullInstructionsModal.style.display = "block";
}

function showSignInModal() {
  const signinModal = document.getElementById("signinModal");
  signinModal.style.display = "block";

  form.onsubmit = function (event) {
    event.preventDefault();
    nickname = document.getElementById("nickname").value;
    email = document.getElementById("email").value;
    soundEffects.startGame.play();
    signinModal.style.display = "none";
    displayGameInstructionsModal();
    startGame(nickname, email);
    console.log("Nickname:", nickname);
    console.log("Email:", email);
  };
}

function showWelcomeMessage() {
  createCards(levelOne); // Start with level one cards
  const welcomeModal = document.getElementById("welcomeModal");
  welcomeModal.style.display = "block";
  const welcomeContinueButton = document.getElementById("welcomeContinue");
  welcomeContinueButton.addEventListener("click", function () {
    welcomeModal.style.display = "none";
    soundEffects.startGame.play(); // Play the start game sound
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
  gameState.startTime = Date.now(); //Store the start time in milliseconds since the epoch
  gameState.gameLevel = 1; // Ensure the game starts at level one
  gameState.totalTime = 0;
  // localStorage.setItem("startTime", gameState.startTime);
  gameState.errorCount = 0; // Reset errors if starting a new game
  gameState.scoreCount = 0; // Reset score if starting a new game
  gameState.matchedPairsCount = 0; // Reset matched pairs count
  setPointsPerMatch(); // Set initial points per match
  resetTurn();
  startTimer();

  // Store nickname and email in gameState
  gameState.playerNickname = nickname;
  gameState.playerEmail = email;
}

function resetTurn() {
  // Set hasFlippedCard and gameBoardLocked to false
  gameState.hasFlippedCard = false;
  gameState.gameBoardLocked = false;

  // Set flippedCard1 and flippedCard2 to null
  gameState.flippedCard1 = null;
  gameState.flippedCard2 = null;
}

function resetGame() {
  console.log("Current Game Level before increment:", gameState.gameLevel);

  if (gameState.gameLevel === 2) {
    displayfinalRoundCompletionModal();

    // Handle the end of the last level
    console.log("Final level reached. Calculating totalTime...");
    console.log(`Elapsed time for the final round: ${elapsedTime} seconds`);
    gameState.totalTime += elapsedTime;
    console.log("Final Total Time calculated:", gameState.totalTime);

    // store the nickname and total score in the local storage

    // Delay before redirection
    setTimeout(function () {
      console.log("Redirecting to scoreboard...");

      // window.location.href = "./HTML/scoreboard.html";
    }, 500);
  } else {
    gameState.gameLevel++;
    console.log(
      "Resetting game... Current Level after increment:",
      gameState.gameLevel
    );
    console.log(`Elapsed time for the round: ${gameState.elapsedTime} seconds`);

    // gameState.totalTime += gameState.elapsedTime;
    console.log("Total Time calculated:", gameState.totalTime);
    // Determine the correct card set based on the current game level
    let cardSet =
      gameState.gameLevel === 1
        ? levelOne
        : gameState.gameLevel === 2
        ? levelTwo
        : levelThree;
    createCards(cardSet);

    // Reset game state for a new round
    gameState.matchedPairsCount = 0;
    setPointsPerMatch();
    resetTurn();
    // will put this in score modal
    // startTimer();
  }
}

// -------------------------------------- TIMER FUNCTIONS --------------------------------------

function startTimer() {
  if (gameState.timerPaused) {
    gameState.startTime = Date.now() - gameState.secondsElapsed * 1000; // Adjust start time
  } else {
    gameState.startTime = Date.now(); // Store the start time in milliseconds
  }

  if (gameState.timer) {
    clearInterval(gameState.timer); // Clear existing timer if it exists
  }
  gameState.timer = setInterval(() => {
    const now = Date.now();
    gameState.secondsElapsed = Math.floor((now - gameState.startTime) / 1000);
    updateTimerDisplay(gameState.secondsElapsed);
  }, 1000);
  gameState.timerPaused = false; // Reset timerPaused state
}

function updateTimerDisplay(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const formattedTime = `${mins.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
  // const timerDisplay = document.querySelector("#timer span");
  timerDisplay.textContent = formattedTime;
}

function stopTimer() {
  clearInterval(gameState.timer);
  gameState.timer = null;
  gameState.timerPaused = false;
}

function pauseTimer() {
  clearInterval(gameState.timer); // Clear the interval to stop the timer
  gameState.timerPaused = true; // Set timerPaused to true
}

function resumeTimer() {
  startTimer(); // Resume the timer by starting it again
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

// -------------------------------------- CARD Sounds  --------------------------------------

function getNextClickSound() {
  const sound = soundEffects.clickSounds[soundEffects.currentClickIndex];
  soundEffects.currentClickIndex =
    (soundEffects.currentClickIndex + 1) % soundEffects.clickSounds.length;
  return sound;
}

function getNextWinSound() {
  const sound = soundEffects.winSounds[soundEffects.currentWinIndex];
  soundEffects.currentWinIndex =
    (soundEffects.currentWinIndex + 1) % soundEffects.winSounds.length;
  return sound;
}

function getNextLoseSound() {
  const sound = soundEffects.loseSounds[soundEffects.currentLoseIndex];
  soundEffects.currentLoseIndex =
    (soundEffects.currentLoseIndex + 1) % soundEffects.loseSounds.length;
  return sound;
}

// -------------------------------------- CARD FLIP FUNCTIONS --------------------------------------
function flipCard(event) {
  if (gameState.gameBoardLocked) return;
  const card = event.currentTarget;
  if (card === gameState.flippedCard1) return;

  if (card.classList.contains("matched")) return;

  const clickSound = getNextClickSound();
  clickSound.play();
  card.classList.add("is-flipped");

  if (!gameState.hasFlippedCard) {
    gameState.hasFlippedCard = true;
    gameState.flippedCard1 = card;
  } else {
    gameState.flippedCard2 = card;
    gameState.gameBoardLocked = true;
    checkForMatch();
  }
}

function checkForMatch() {
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

    // Check if the match was made on the first try
    if (gameState.errorCount === 0) {
      firstTryBonus = 100;
      triggerConfetti(); // Trigger the confetti animation
    }

    incrementScore(speedBonus + firstTryBonus);
    gameState.matchedPairsCount++;
    const winSound = getNextWinSound();
    setTimeout(() => {
      winSound.play();
    }, 1000);
    checkEndOfRound();
    gameState.consecutiveErrors = 0; // Reset consecutive errors
  } else {
    unflipCards();
  }
}

function unflipCards() {
  setTimeout(() => {
    gameState.flippedCard1.classList.remove("is-flipped");
    gameState.flippedCard2.classList.remove("is-flipped");
    const loseSound = getNextLoseSound();
    loseSound.play();
    incrementError();
    resetTurn();
  }, 1500);
}

function disableCards() {
  gameState.flippedCard1.classList.add("matched");
  gameState.flippedCard2.classList.add("matched");

  gameState.flippedCard1.removeEventListener("click", flipCard);
  gameState.flippedCard2.removeEventListener("click", flipCard);
  resetTurn();
}

// -------------------------------------- SCORE FUNCTIONS --------------------------------------

function incrementScore(speedBonus = 0) {
  gameState.scoreCount += gameState.pointsPerMatch + speedBonus;
  // Update scoreDisplay to target the span for text content
  // const scoreDisplay = document.querySelector("#score span");
  scoreDisplay.textContent = gameState.scoreCount;
}

function incrementError() {
  gameState.errorCount++;
  gameState.consecutiveErrors++;

  let deduction = 1; // Base deduction
  if (gameState.consecutiveErrors > 1) {
    deduction += (gameState.consecutiveErrors - 1) * 2; // Increase deduction by 2 for each consecutive error
  }

  gameState.scoreCount = Math.max(0, gameState.scoreCount - deduction);
  scoreDisplay.textContent = gameState.scoreCount;
}

function setPointsPerMatch() {
  if (gameState.gameLevel === 1) {
    gameState.pointsPerMatch = 10;
  } else if (gameState.gameLevel === 2) {
    gameState.pointsPerMatch = 15;
  }
}

function checkEndOfRound() {
  const anyCardArray = levelOne;
  const totalPairs = anyCardArray.length / 2;
  console.log(
    "Matched pairs:",
    gameState.matchedPairsCount,
    "Total pairs:",
    totalPairs
  );

  gameState.currentTime = new Date().getTime();
  elapsedTime = (gameState.currentTime - gameState.startTime) / 1000;
  console.log("Elapsed time as this point:", elapsedTime, "seconds");
  if (gameState.matchedPairsCount === totalPairs) {
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
        console.log("Transitioning to scoreboard...");
        displayfinalRoundCompletionModal(); // resetGame();
      }, 1000);
    }
    console.log("End of round reached."); // Add this line
    console.log("Current Game Level before increment:", gameState.gameLevel);
  }
}

function triggerConfetti() {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
  });
}
// ---------------------------------------------MODALS ---------------------------------------------

function displayRoundScoreModal() {
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
    soundEffects.buttonClick.play(); // Play the button click sound
  });
}

function displayfinalRoundCompletionModal() {
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
    soundEffects.buttonClick.play(); // Play the button click sound
    // displayScoreBoardModal();
    endGame();
  });
}

function endGame() {
  // Assume we get the nickname from local storage or a global variable
  const nickname = gameState.playerNickname;
  const email = gameState.playerEmail;
  const finalScore = gameState.scoreCount;

  // updateLeaderboard(nickname, email, finalScore); // Pass email here for updates/inserts
  submitScore(nickname, email, finalScore); // Pass data directly
  // // Now display the scoreboard modal
  // // Condition to check if scoreboard modal should be displayed
  // if (!gameState.finalResultsDisplayed) {
  //   gameState.finalResultsDisplayed = true; // Set a flag to prevent re-display
  //   displayScoreBoardModal();
  // }
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
    soundEffects.buttonClick.play(); // Play the button click sound
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
    soundEffects.startGame.play(); // Play the start game sound
    startTimer();
  });
}

// -------------------------------------- REGLAS MODAL EVENT LISTENER--------------------------------------
document.addEventListener("DOMContentLoaded", function () {
  const rulesLink = document.getElementById("rulesLink");
  const fullInstructionsModal = document.getElementById(
    "FullInstructionsModal"
  );
  const closeInstructionsModal = document.getElementById(
    "closeInstructionsModal"
  );

  rulesLink.addEventListener("click", function (event) {
    event.preventDefault(); // Prevent the default link behavior
    fullInstructionsModal.style.display = "block";
  });

  closeInstructionsModal.addEventListener("click", function () {
    fullInstructionsModal.style.display = "none";
    highlightJuegoLink(); // Highlight the "Juego" link
  });
});

// -------------------------------------- SCOREBOARD MODAL DYNAMIC REaL  --------------------------------------

function displayScoreBoardModal() {
  const scoreboardModal = document.getElementById("ScoreBoardModal");
  const leaderboardTable = document.getElementById("leaderboardTable");
  const currentPlayerResultTable = document.getElementById(
    "currentPlayerResultTable"
  );

  // Clear any existing leaderboard data
  leaderboardTable.querySelector("tbody").innerHTML = "";
  currentPlayerResultTable.querySelector("tbody").innerHTML = "";

  // Fetch leaderboard data via AJAX
  $.ajax({
    url: "PHP/get_leaderboard.php", // Path relative to your index.html
    method: "GET",
    success: function (response) {
      // Handle the success response from the server
      const leaderboardData = JSON.parse(response);
      console.log("Leaderboard Data:", leaderboardData); // Debugging output

      // Find the current player's data (case-insensitive)
      console.log(
        "Current Player Nickname (gameState):",
        gameState.playerNickname
      ); // Debugging output

      // Trim and lowercase the current player's nickname
      const currentNickname = gameState.playerNickname.trim().toLowerCase();
      console.log(
        "Trimmed and Lowercased Current Player Nickname:",
        currentNickname
      ); // Debugging output

      // Check each player nickname in leaderboard data
      leaderboardData.forEach((player) => {
        console.log(
          "Comparing with Leaderboard Nickname:",
          player.nickname.trim().toLowerCase()
        );
      });

      // Find the current player's data in the leaderboard
      const currentPlayerData = leaderboardData.find(
        (player) => player.nickname.trim().toLowerCase() === currentNickname
      );
      console.log("Current Player Data:", currentPlayerData); // Debugging output

      // If the current player is not in the top 5, add their data to the leaderboardData
      if (!currentPlayerData) {
        leaderboardData.push({
          rank: "N/A",
          nickname: gameState.playerNickname,
          score: gameState.scoreCount,
        });
      }

      // Sort the leaderboard data by score in descending order
      leaderboardData.sort((a, b) => b.score - a.score);

      // Assign ranks based on sorted order
      leaderboardData.forEach((player, index) => {
        player.rank = index + 1;
      });

      // Slice the leaderboard data to get the top 5 players
      const topFivePlayers = leaderboardData.slice(0, 5);

      // Populate table with the top 5 players
      topFivePlayers.forEach((player) => {
        const row = leaderboardTable.insertRow(-1); // Insert a new row at the end of the table
        row.classList.add("leaderboard-row");

        const rankCell = row.insertCell(0); // Insert a new cell for the rank
        rankCell.classList.add("first-cell");
        rankCell.innerHTML = player.rank; // Use the rank from the response

        const nicknameCell = row.insertCell(1); // Insert a new cell for the nickname
        nicknameCell.classList.add("second-cell");
        const firstLetter = player.nickname.charAt(0).toUpperCase(); // Get the first letter of the nickname
        nicknameCell.innerHTML = `<div class="blue-circle">${firstLetter}</div>${player.nickname}`;

        const scoreCell = row.insertCell(2); // Insert a new cell for the score
        scoreCell.classList.add("third-cell");
        scoreCell.innerHTML = player.score;
      });

      // Populate current player result
      const row = currentPlayerResultTable.insertRow(-1);
      row.classList.add("leaderboard-row");

      const rankCell = row.insertCell(0);
      rankCell.classList.add("first-cell");
      rankCell.innerHTML = currentPlayerData ? currentPlayerData.rank : "N/A";

      const nicknameCell = row.insertCell(1);
      nicknameCell.classList.add("second-cell");
      const currentFirstLetter = gameState.playerNickname
        .charAt(0)
        .toUpperCase();
      nicknameCell.innerHTML = `<div class="blue-circle">${currentFirstLetter}</div>${
        currentPlayerData
          ? currentPlayerData.nickname
          : gameState.playerNickname
      }`;

      const scoreCell = row.insertCell(2);
      scoreCell.classList.add("third-cell");
      scoreCell.innerHTML = currentPlayerData
        ? currentPlayerData.score
        : gameState.scoreCount;

      // Display the modal
      scoreboardModal.style.display = "block";
    },
    error: function (xhr, status, error) {
      console.error("Error fetching leaderboard:", error);
    },
  });

  // Remove the existing event listener before adding a new one to prevent multiple listeners
  const restartGameButton = document.getElementById("restartGameButton");
  // restartGameButton.removeEventListener("click", restartGameHandler);
  restartGameButton.addEventListener("click", restartGame);
}

function restartGameHandler() {
  if (gameState.finalResultsDisplayed) {
    // Restart the game only if the player has completed the game
    resetGameState();
    startGame(); // Assuming startGame() is set up to reinitialize the game.
  } else {
    // Resume the game if it was paused
    resumeTimer();
  }
  const scoreboardModal = document.getElementById("ScoreBoardModal");
  scoreboardModal.style.display = "none"; // Hide the modal after starting/resuming the game
  highlightJuegoLink(); // Highlight the "Juego" link
}

// -------------------------------------- CRUD --------------------------------------
function submitScore(nickname, email, finalScore) {
  $.ajax({
    // Use jQuery to make an AJAX request
    url: "PHP/submit_score.php", // Path relative to your index.html
    method: "POST", // Use POST method
    data: {
      // Pass the player data to the server
      nickname: nickname,
      email: email,
      score: finalScore,
      game_level: gameState.gameLevel,
      total_time: gameState.totalTime,
    },
    success: function (response) {
      // Handle the success response from the server
      console.log(response); // Log success message from PHP
      // Optionally, update the UI or display a confirmation to the user
      displayScoreBoardModal();
    },
    error: function (xhr, status, error) {
      console.error("Error submitting score:", error);
      // Handle errors appropriately (e.g., display an error message)
    },
  });
}

// <-------------------------------------- RESET GAME STATE -------------------------------------->

function restartGame() {
  location.reload(); // This will reload the page
}

function resetGameState() {
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

  // Assuming there is a function to re-create cards or reset the UI
  // showWelcomeMessage(); // This should be tailored to your game's logic
  createCards(levelOne); // Start with level one cards
}
// < ---------------------------------------------- ARRAYS ---------------------------------------------- >

const levelOne = [
  "./images/levelOne/All Purpose Cleaner-1.png",
  "./images/levelOne/All Purpose Cleaner.png",
  "./images/levelOne/Bathroom Cleaner-1.png",
  "./images/levelOne/Bathroom Cleaner.png",
  "./images/levelOne/Detergent-1.png",
  "./images/levelOne/Detergent.png",
  "./images/levelOne/Dishwashing Liquid-1.png",
  "./images/levelOne/Dishwashing Liquid.png",
  "./images/levelOne/Glass Cleaner-1.png",
  "./images/levelOne/Glass Cleaner.png",
  "./images/levelOne/Neutral Floor Cleaner-1.png",
  "./images/levelOne/Neutral Floor Cleaner.png",
];

const levelTwo = [
  "./images/levelTwo/All purpose cleaner-1.png",
  "./images/levelTwo/All purpose cleaner.png",
  "./images/levelTwo/Bathroom Cleaner-1.png",
  "./images/levelTwo/Bathroom Cleaner.png",
  "./images/levelTwo/Detergent-1.png",
  "./images/levelTwo/Detergent.png",
  "./images/levelTwo/Dishwashing Liquid-1.png",
  "./images/levelTwo/Dishwashing Liquid.png",
  "./images/levelTwo/Glass Cleaner-1.png",
  "./images/levelTwo/Glass Cleaner.png",
  "./images/levelTwo/Neutral Floor Cleaner-1.png",
  "./images/levelTwo/Neutral Floor Cleaner.png",
];

// -------------------------------------- SCOREBOARD MODAL STAIC FOR TESTING --------------------------------------
// -------------------------------------- SCOREBOARD MODAL STAIC FOR TESTING --------------------------------------
// -------------------------------------- SCOREBOARD MODAL STAIC FOR TESTING --------------------------------------
// -------------------------------------- SCOREBOARD MODAL STAIC FOR TESTING --------------------------------------
// -------------------------------------- SCOREBOARD MODAL STAIC FOR TESTING --------------------------------------
// -------------------------------------- SCOREBOARD MODAL STAIC FOR TESTING --------------------------------------
// -------------------------------------- SCOREBOARD MODAL STAIC FOR TESTING --------------------------------------
// -------------------------------------- SCOREBOARD MODAL STAIC FOR TESTING --------------------------------------
// -------------------------------------- SCOREBOARD MODAL STAIC FOR TESTING --------------------------------------

// function displayScoreBoardModal() {
//   const leaderboardTable = document.getElementById("leaderboardTable");
//   const currentPlayerResultTable = document.getElementById(
//     "currentPlayerResultTable"
//   );

//   // Clear any existing leaderboard data
//   leaderboardTable.querySelector("tbody").innerHTML = "";
//   currentPlayerResultTable.querySelector("tbody").innerHTML = "";

//   // Hardcoded leaderboard data
//   const leaderboardData = [
//     { rank: 1, nickname: "Julia", score: 180 },
//     { rank: 2, nickname: "Pedro", score: 178 },
//     { rank: 3, nickname: "José", score: 170 },
//     { rank: 4, nickname: "María", score: 160 },
//     { rank: 5, nickname: "Luisa", score: 150 },
//   ];

//   const currentPlayerData = { rank: 3, nickname: "Ana", score: 140 };

//   // Populate table with the top 5 players
//   leaderboardData.forEach((player) => {
//     const row = leaderboardTable.insertRow(-1); // Insert a new row at the end of the table
//     row.classList.add("leaderboard-row");

//     const rankCell = row.insertCell(0); // Insert a new cell for the rank
//     rankCell.classList.add("first-cell");
//     rankCell.innerHTML = player.rank; // Use the rank from the response

//     const nicknameCell = row.insertCell(1); // Insert a new cell for the nickname
//     nicknameCell.classList.add("second-cell");
//     const firstLetter = player.nickname.charAt(0).toUpperCase(); // Get the first letter of the nickname
//     nicknameCell.innerHTML = `<div class="blue-circle">${firstLetter}</div>${player.nickname}`;

//     const scoreCell = row.insertCell(2); // Insert a new cell for the score
//     scoreCell.classList.add("third-cell");
//     scoreCell.innerHTML = player.score;
//   });

//   // Populate current player result
//   const row = currentPlayerResultTable.insertRow(-1);
//   row.classList.add("leaderboard-row");

//   const rankCell = row.insertCell(0);
//   rankCell.classList.add("first-cell");
//   rankCell.innerHTML = currentPlayerData.rank;

//   const nicknameCell = row.insertCell(1);
//   nicknameCell.classList.add("second-cell");
//   const currentFirstLetter = currentPlayerData.nickname.charAt(0).toUpperCase();
//   nicknameCell.innerHTML = `<div class="blue-circle">${currentFirstLetter}</div>${currentPlayerData.nickname}`;

//   const scoreCell = row.insertCell(2);
//   scoreCell.classList.add("third-cell");
//   scoreCell.innerHTML = currentPlayerData.score;

//   // Display the modal
//   const scoreboardModal = document.getElementById("ScoreBoardModal");
//   scoreboardModal.style.display = "block";

//   // Add close button functionality
//   document.querySelector(".close-button").onclick = function () {
//     scoreboardModal.style.display = "none";
//   };
// }
