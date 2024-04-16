// flip-script.js

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

const soundEffects = {
  click: new Audio("../sounds/flip.wav"),
  error: new Audio("../sounds/fail.wav"),
  win: new Audio("../sounds/cheer.wav"),
};

const timerDisplay = document.getElementById("timer");
const scoreDisplay = document.getElementById("score");

// var continueButton = document.getElementById("continue");

let form = document.getElementById("signinForm");

const nickname = document.getElementById("nickname");

var emailInput = document.getElementById("email");

const resetButton = document.querySelector(".reset");
resetButton.addEventListener("click", function () {
  resetGame();
  startGame();
});

const nextButton = document.querySelector(".next-button");
nextButton.addEventListener("click", function () {
  window.location.href = "./HTML/scoreboard.html";
});

// -------------------------------------- LOAD PAGE  --------------------------------------

document.addEventListener("DOMContentLoaded", function () {
  showSignInModal();
});

function showSignInModal() {
  createCards(levelOne); // Start with level one cards
  const signinModal = document.getElementById("signinModal");
  signinModal.style.display = "block";

  document.querySelector("#signinModal .close").onclick = function () {
    signinModal.style.display = "none";
  };

  document.getElementById("signinForm").onsubmit = function (event) {
    event.preventDefault();

    //store user name and email in localStorage
    const nickname = document.getElementById("nickname").value;
    const email = document.getElementById("email").value;
    localStorage.setItem("userNickname", nickname);
    localStorage.setItem("userEmail", email);
    // localStorage ends here in case needs to be adjusted

    signinModal.style.display = "none";

    // Check if both nickname and email are set in localStorage
    if (
      localStorage.getItem("userNickname") &&
      localStorage.getItem("userEmail")
    ) {
      startGame(); // Call startGame() only if nickname and email are set
    } else {
      console.log(
        "Nickname and email not yet submitted. Waiting for submission..."
      );
    }
  };
}

// -------------------------------------- GAME FLOW --------------------------------------
function startGame() {
  gameLevel = 1; // Ensure the game starts at level one
  totalTime = 0;
  localStorage.setItem("startTime", new Date().getTime()); // Set start time
  console.log(
    "Game started - startTime set:",
    localStorage.getItem("startTime")
  ); // Log the start time

  errorCount = 0; // Reset errors if starting a new game
  scoreCount = 0; // Reset score if starting a new game
  matchedPairsCount = 0; // Reset matched pairs count
  setPointsPerMatch(); // Set initial points per match
  resetTurn();
  startTimer(); // Start the game timer
}

function resetGame() {
  stopTimer(); // Always stop the timer when resetting the game

  console.log("Current Game Level before increment:", gameLevel); // Log current level before increment for debugging

  if (gameLevel === 3) {
    // Handle the end of the last level
    console.log("Final level reached. Calculating totalTime...");
    const currentTime = new Date().getTime();
    const startTime = localStorage.getItem("startTime");
    const elapsedTime = (currentTime - startTime) / 1000; // Convert milliseconds to seconds
    totalTime += elapsedTime;
    console.log("Final Total Time calculated:", totalTime);

    localStorage.setItem("totalTime", totalTime); // Store total time
    console.log("Total Time stored. Preparing to redirect...");

    // Delay before redirection
    setTimeout(function () {
      console.log("Redirecting to scoreboard...");
      window.location.href = "../HTML/scoreboard.html";
    }, 5000); // Delay for 5000 milliseconds (5 seconds)
  } else {
    gameLevel++; // Increment level here
    console.log("Resetting game... Current Level after increment:", gameLevel); // Log current level after increment

    // Determine the correct card set based on the current game level
    let cardSet =
      gameLevel === 1 ? levelOne : gameLevel === 2 ? levelTwo : levelThree;
    createCards(cardSet);

    // Reset game state for a new round
    matchedPairsCount = 0;
    setPointsPerMatch();
    resetTurn();
    startTimer(); // Restart the timer for the new game level
  }
}

// -------------------------------------- CARD FUNCTIONS --------------------------------------

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function createCards(imagesArray) {
  const container = document.querySelector(".cards-container");
  shuffleArray(imagesArray);
  container.innerHTML = imagesArray
    .map(
      (imageSrc, index) => `
   <div class="card">
     <div class="card__inner" onclick="flipCard(event, ${index})">
       <div class="card__face card__face--front"><img src="./images/Menu/Game-Match-GC.png" alt="card-back-design"></div>
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

// -------------------------------------- TIMER FUNCTIONS --------------------------------------

function updateTimerDisplay(seconds) {
  totalTime = seconds; // Update totalTime
  timerDisplay.innerHTML = `<img src="./images/Menu/clock.jpg" alt="Clock" style="width:20px; height:20px; vertical-align:middle;"> ${formatTime(
    seconds
  )}`;
}

function startTimer() {
  timer = setInterval(() => {
    secondsElapsed++;
    updateTimerDisplay(secondsElapsed);
  }, 1000);
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
    matchedPairsCount++;
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

function checkEndOfRound() {
  const anyCardArray = levelOne;
  const totalPairs = anyCardArray.length / 2;
  console.log("Matched pairs:", matchedPairsCount, "Total pairs:", totalPairs);

  if (matchedPairsCount === totalPairs) {
    console.log("All pairs matched. Proceeding to reset game...");
    if (gameLevel < 3) {
      setTimeout(() => {
        alert("Congratulations! You have found all matches in this round!");
        // gameLevel++; // Ensure level is incremented before reset
        resetGame();
      }, 1000);
    } else {
      setTimeout(() => {
        console.log("Transitioning to scoreboard...");
        // window.location.href = "../HTML/scoreboard.html";
        resetGame();
      }, 1000);
    }
    console.log("End of round reached."); // Add this line
  }
}

function resetTurn() {
  [hasFlippedCard, gameBoardLocked] = [false, false];
  [flippedCard1, flippedCard2] = [null, null];
}

// -------------------------------------- SCORE FUNCTIONS --------------------------------------

function incrementScore(speedBonus = 0) {
  scoreCount += pointsPerMatch + speedBonus;
  scoreDisplay.textContent = `Puntos: ${scoreCount}`;
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

// < ---------------------------------------------- ARRAYS ---------------------------------------------- >

const levelOne = [
  "../images/levelOne/a.jpg",
  "../images/levelOne/a-1.jpg",
  "../images/levelOne/b.jpg",
  "../images/levelOne/b-1.jpg",
  // "../images/levelOne/c.jpg",
  // "../images/levelOne/c-1.jpg",
  // "../images/levelOne/d.jpg",
  // "../images/levelOne/d-1.jpg",
  // "../images/levelOne/e.jpg",
  // "../images/levelOne/e-1.jpg",
  // "../images/levelOne/f.jpg",
  // "../images/levelOne/f-1.jpg",
];

const levelTwo = [
  "../images/levelTwo/a.jpg",
  "../images/levelTwo/a-1.jpg",
  "../images/levelTwo/b.jpg",
  "../images/levelTwo/b-1.jpg",
  // "../images/levelTwo/c.jpg",
  // "../images/levelTwo/c-1.jpg",
  // "../images/levelTwo/d.jpg",
  // "../images/levelTwo/d-1.jpg",
  // "../images/levelTwo/e.jpg",
  // "../images/levelTwo/e-1.jpg",
  // "../images/levelTwo/f.jpg",
  // "../images/levelTwo/f-1.jpg",
];
const levelThree = [
  "../images/levelThree/a.jpg",
  "../images/levelThree/a-1.jpg",
  "../images/levelThree/b.jpg",
  "../images/levelThree/b-1.jpg",
  // "../images/levelThree/c.jpg",
  // "../images/levelThree/c-1.jpg",
  // "../images/levelThree/d.jpg",
  // "../images/levelThree/d-1.jpg",
  // "../images/levelThree/e.jpg",
  // "../images/levelThree/e-1.jpg",
  // "../images/levelThree/f.jpg",
  // "../images/levelThree/f-1.jpg",
];

