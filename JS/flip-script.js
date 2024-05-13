// -------------------------------------- VARIABLES  --------------------------------------

const gameState = {
  hasFlippedCard: false,
  flippedCard1: null,
  flippedCard2: null,
  gameBoardLocked: false,
  timer: null,
  secondsElapsed: 0,
  errorCount: 0,
  scoreCount: 0,
  matchedPairsCount: 0,
  gameLevel: 1,
  finalResultsDisplayed: false,
  scoreSubmitted: false,
  totalTime: 0,
  elapsedTime: 0,
  startTime: null,
  currentTime: null,
  soundEffects: {
    click: new Audio("./sounds/flip.wav"),
    error: new Audio("./sounds/fail.wav"),
    win: new Audio("./sounds/cheer.wav"),
  },
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
    // localStorage.setItem("userNickname", nickname);
    // localStorage.setItem("userEmail", email);
    signinModal.style.display = "none";
    displayGameInstructionsModal();
    startGame(nickname, email);
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
  // console.log("Current time:", formatTime(gameState.currentTime / 1000));
  // console.log("Start time:", formatTime(gameState.startTime / 1000));
  // console.log(
  //   "Elapsed time for the round (in seconds):",
  //   (gameState.currentTime - gameState.startTime) / 1000
  // );
  console.log("Current Game Level before increment:", gameState.gameLevel);

  if (gameState.gameLevel === 3) {
    displayRound3CompletionModal();

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
  gameState.startTime = Date.now(); // Store the start time in milliseconds
  if (gameState.timer) {
    clearInterval(gameState.timer); // Clear existing timer if it exists
  }
  gameState.timer = setInterval(() => {
    gameState.secondsElapsed++;
    updateTimerDisplay(gameState.secondsElapsed);
  }, 1000);
}

// Function to update the timer display
function updateTimerDisplay(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const formattedTime = `${mins.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
  const timerDisplay = document.querySelector("#timer span");
  timerDisplay.textContent = formattedTime;
}

// Function to stop the timer
function stopTimer() {
  clearInterval(gameState.timer);
  gameState.currentTime = Date.now();
  gameState.elapsedTime = (gameState.currentTime - gameState.startTime) / 1000;
  gameState.totalTime += gameState.elapsedTime; // Add elapsed time to total time
  console.log(
    `Total Time after stopping timer: ${gameState.totalTime} seconds`
  );
  gameState.secondsElapsed = 0; // Reset seconds elapsed
  updateTimerDisplay(gameState.secondsElapsed);
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
  if (gameState.secondsElapsed < 60) {
    return 30;
  } else if (gameState.secondsElapsed < 120) {
    return 20;
  } else if (gameState.secondsElapsed < 180) {
    return 10;
  } else {
    return 0;
  }
}

// -------------------------------------- CARD FLIP FUNCTIONS --------------------------------------
function flipCard(event) {
  if (gameState.gameBoardLocked) return;
  const card = event.currentTarget;
  if (card === gameState.flippedCard1) return;

  if (card.classList.contains("matched")) return;

  gameState.soundEffects.click.play();
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
    incrementScore(speedBonus);
    gameState.matchedPairsCount++; // Increment matched pairs count
    checkEndOfRound();
  } else {
    unflipCards();
  }
}

function unflipCards() {
  setTimeout(() => {
    gameState.flippedCard1.classList.remove("is-flipped");
    gameState.flippedCard2.classList.remove("is-flipped");
    gameState.soundEffects.error.play();
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
  gameState.soundEffects.win.play();
}

// -------------------------------------- SCORE FUNCTIONS --------------------------------------

function incrementScore(speedBonus = 0) {
  gameState.scoreCount += gameState.pointsPerMatch + speedBonus;
  // Update scoreDisplay to target the span for text content
  const scoreDisplay = document.querySelector("#score span");
  scoreDisplay.textContent = gameState.scoreCount;
}

function incrementError() {
  gameState.errorCount++;
  gameState.scoreCount = Math.max(0, gameState.scoreCount - 2);
  scoreDisplay.textContent = `Puntos: ${gameState.scoreCount}`;
}

function setPointsPerMatch() {
  if (gameState.gameLevel === 1) {
    gameState.pointsPerMatch = 10;
  } else if (gameState.gameLevel === 2) {
    gameState.pointsPerMatch = 15;
  } else if (gameState.gameLevel === 3) {
    gameState.pointsPerMatch = 20;
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
    if (gameState.gameLevel < 3) {
      console.log("stopTimer Called");

      setTimeout(() => {
        console.log("About to display round score modal");
        resetGame();
        displayRoundScoreModal();
      }, 1000);
    } else {
      setTimeout(() => {
        console.log("Transitioning to scoreboard...");
        // window.location.href = "./HTML/scoreboard.html";
        // resetGame();
      }, 1000);
    }
    console.log("End of round reached."); // Add this line
    console.log("Current Game Level before increment:", gameState.gameLevel);
  }
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
    if (gameState.gameLevel == 2) {
      displayRound2InstructionsModal();
    } else if (gameState.gameLevel == 3) {
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
  round3CompletionPoints.textContent = `${gameState.scoreCount}`;
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
  const nickname = gameState.playerNickname;
  const email = gameState.playerEmail;
  const finalScore = gameState.scoreCount;

  // updateLeaderboard(nickname, email, finalScore); // Pass email here for updates/inserts
  submitScore(nickname, email, finalScore); // Pass data directly
  // Now display the scoreboard modal
  // Condition to check if scoreboard modal should be displayed
  if (!gameState.finalResultsDisplayed) {
    gameState.finalResultsDisplayed = true; // Set a flag to prevent re-display
    displayScoreBoardModal();
  }
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

// THERES A PROBLEM WITH THIS FUNCTION
function displayScoreBoardModal() {
  const scoreboardModal = document.getElementById("ScoreBoardModal");
  const leaderboardTable = document.getElementById("leaderboardTable");
  const playerNicknameDisplay = document.getElementById("player-nickname");
  const playerScoreDisplay = document.getElementById("player-score");

  // Clear any existing leaderboard data
  leaderboardTable.querySelector("tbody").innerHTML = ""; // Clear only the body, not the header

  // Fetch leaderboard data via AJAX
  $.ajax({
    url: "PHP/get_leaderboard.php",
    method: "GET",
    success: function (response) {
      const leaderboardData = JSON.parse(response);

      // Populate table with leaderboard data (Top 5)
      leaderboardData.slice(0, 5).forEach((player, index) => {
        const row = leaderboardTable.insertRow();
        const rankCell = row.insertCell();
        const nicknameCell = row.insertCell();
        const scoreCell = row.insertCell();

        rankCell.textContent = index + 1; // Rank starts from 1
        nicknameCell.textContent = player.nickname;
        scoreCell.textContent = player.score;
      });

      // Display current player's nickname and score
      const currentNickname = gameState.playerNickname;
      const currentScore = gameState.scoreCount;
      playerNicknameDisplay.textContent = currentNickname;
      playerScoreDisplay.textContent = `Puntos: ${currentScore}`;

      // Show the modal
      scoreboardModal.style.display = "block";
    },
    error: function (xhr, status, error) {
      console.error("Error fetching leaderboard:", error);
      // Optionally, display an error message to the user
    },
  });
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
    },
    error: function (xhr, status, error) {
      console.error("Error submitting score:", error);
      // Handle errors appropriately (e.g., display an error message)
    },
  });
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

// function updateLeaderboard(nickname, email, score) {
//   let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];

//   // Check if the player already exists in the leaderboard by email
//   let existingPlayer = leaderboard.find((player) => player.email === email);

//   if (existingPlayer) {
//     // Update the player's nickname and score if the new score is higher
//     existingPlayer.nickname = nickname;
//     if (existingPlayer.score < score) {
//       existingPlayer.score = score;
//     }
//   } else {
//     // Add new player to the leaderboard
//     leaderboard.push({ nickname: nickname, email: email, score: score });
//   }

//   // Sort the leaderboard by score in descending order
//   leaderboard.sort((a, b) => b.score - a.score);

//   // Optionally trim the leaderboard to only keep the top N entries
//   leaderboard = leaderboard.slice(0, 5);

//   // Save the updated leaderboard
//   localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
// }
