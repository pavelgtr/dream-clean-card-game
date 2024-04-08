// <----------------------------------------- INSTRUCTIONS & SIGN-IN MODALS -----------------------------------------> //

// Initialize the game
document.addEventListener("DOMContentLoaded", function() {
  displayInstructionModal();
  setupModalsAndForm();
});


function displayInstructionModal() {
  const instructionModal = document.getElementById("instructionModal");
  instructionModal.style.display = "block";

  document.getElementById("startGameButton").onclick = function () {
    instructionModal.style.display = "none";
    showSignInModal();
  };

  document.querySelector("#instructionModal .close").onclick = function () {
    instructionModal.style.display = "none";
  };
}
function showSignInModal() {
  const signinModal = document.getElementById("signinModal");
  signinModal.style.display = "block";

  document.querySelector("#signinModal .close").onclick = function () {
    signinModal.style.display = "none";
  };

  document.getElementById("signinForm").onsubmit = function (event) {
    event.preventDefault();
    const nickname = document.getElementById("nickname").value;
    const email = document.getElementById("email").value;
    localStorage.setItem("userNickname", nickname);
    localStorage.setItem("userEmail", email);
    signinModal.style.display = "none";
    // Additional actions after form submission, like starting the game, can be added here
  };
}
function setupModalsAndForm() {
  startGame();
  const savedScores = getSavedScores();
  updateScoreboard(savedScores);
  // Assuming displayScores() is intended to refresh or update the displayed scores
  displayScores(); // This will load and display the scores from localStorage
}


// < ---------------------------------------------- GAME MECHANICS ---------------------------------------------- >
function startGame() {
  gameLevel = 1; // Ensure the game starts at level one
  createCards(levelOne); // Start with level one cards
  errorCount = 0; // Reset errors if starting a new game
  scoreCount = 0; // Reset score if starting a new game
  matchedPairsCount = 0; // Reset matched pairs count
  setPointsPerMatch(); // Set initial points per match
  resetTurn();
  startTimer(); // Start the timer for the game
}
function startTimer() {
  timer = setInterval(() => {
    secondsElapsed++;
    timerDisplay.textContent = `Time: ${formatTime(secondsElapsed)}`;
  }, 1000);
}
function resetGame() {
  scoreSubmitted = false;

  stopTimer();
  finalResultsDisplayed = false;
  // This will now correctly check if the current game has finished level 3
  if (gameLevel === 3) {
    displayFinalResults(); // Show final results
    // Prepare for a new game
    gameLevel = 1; // Reset to level one for a new game
    scoreCount = 0; // Optionally reset score for a new game
    errorCount = 0; // Optionally reset errors for a new game
    // No need to create cards or start the timer here as the game has ended
    // and the player will need to manually start a new game
    return; // Exit the function to prevent further execution
  } else {
    // If not at the end of the third level, increment and prepare for the next level
    gameLevel++;
  }

  // Based on the new gameLevel, set up the game
  if (gameLevel === 1) {
    createCards(levelOne);
  } else if (gameLevel === 2) {
    createCards(levelTwo);
  } else if (gameLevel === 3) {
    createCards(levelThree);
  }

  matchedPairsCount = 0;
  setPointsPerMatch();
  resetTurn();
  startTimer(); // Restart the timer for the next level
}
function stopGame() {
  stopTimer();
  resetGame();
}
function flipCard(event) {
  //deleted index (2nd) parameter, not needed

  if (gameBoardLocked) return;
  const card = event.currentTarget;
  if (card === flippedCard1) return; // Prevents matching a card with itself by clicking the same card twice

  //check if the card has already been matched
   if (card.classList.contains('matched')) return;

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
  // Extract the base filename by removing the '.jpg' and '-1' parts
  let baseName1 = flippedCard1
    .querySelector("img")
    .src.split("/")
    .pop()
    .replace(".jpg", "")
    .replace("-1", "");
  let baseName2 = flippedCard2
    .querySelector("img")
    .src.split("/")
    .pop()
    .replace(".jpg", "")
    .replace("-1", "");
  // Check if the base filenames are the same
  const isMatch = baseName1 === baseName2;

  if (isMatch) {
    disableCards();
    const speedBonus = calculateSpeedBonus(); // Calculate the bonus
    incrementScore(speedBonus);
    matchedPairsCount++; // Increment the count of matched pairs
    checkEndOfRound(); // New function to check if the game should end
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
  // Add the matched class to both cards
  flippedCard1.classList.add('matched');
  flippedCard2.classList.add('matched');

 flippedCard1.removeEventListener("click", flipCard);
 flippedCard2.removeEventListener("click", flipCard);
 resetTurn();
 soundEffects.win.play();
}
function checkEndOfRound() {
  const totalPairs = 4; // Total number of pairs to be matched for a round
  if (matchedPairsCount === totalPairs) {
    if (gameLevel < 3) {
      // If it's round 1 or 2, congratulate and proceed to reset for the next round
      setTimeout(() => {
        alert("Congratulations! You have found all matches in this round!");
        resetGame(); // Prepares the game for the next round
      }, 1000);
    } else {
      // If it's the end of round 3, show final results instead
      setTimeout(() => {
        displayFinalResults(); // Show final results and potentially reset the game
      }, 1000);
    }
  }
}
function resetTurn() {
  [hasFlippedCard, gameBoardLocked] = [false, false];
  [flippedCard1, flippedCard2] = [null, null];
}
function incrementScore(speedBonus = 0) {
  scoreCount += pointsPerMatch + speedBonus;
  scoreDisplay.textContent = `Score: ${scoreCount}`;
  //  setTimeout(() => {
  //   alert(`Mortal! Lograste hacer un match. Tu score ahora es ${scoreCount}`);
  // }, 1000);
}
function incrementError() {
  errorCount++;
  errorDisplay.textContent = `Errors: ${errorCount}`;

  // Deduct points for error with lower limit check
  scoreCount = Math.max(0, scoreCount - 2); // Ensure score does not go below 0
  scoreDisplay.textContent = `Score: ${scoreCount}`; // Update score display
}
function stopTimer() {
  clearInterval(timer);
  secondsElapsed = 0;
  timerDisplay.textContent = "Time: 00:00";
}
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
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
function calculateSpeedBonus() {
  if (secondsElapsed < 60) {
    // less than 1 minute
    return 30;
  } else if (secondsElapsed < 120) {
    // less than 2 minutes
    return 20;
  } else if (secondsElapsed < 180) {
    // less than 3 minutes
    return 10;
  } else {
    return 0; // No bonus
  }
}



// < ---------------------------------------------- SCORE MANAGMENT ---------------------------------------------- >

function updateScoreboard(scores) {
  const scoreboardList = document.querySelector(".scoreboard-list");
  scoreboardList.innerHTML = ""; // Clear current scoreboard entries

  scores.forEach((score, index) => {
    const playerItem = document.createElement("li");
    playerItem.innerHTML = `
      <span class="player-position">${index + 1}</span>
      <span class="player-name">${score.name}</span>
      <span class="player-time">${score.time}</span>
      <span class="player-score">${score.scoreCount}</span>
    `;
    scoreboardList.appendChild(playerItem);
  });

  // Save the scores in localStorage
  localStorage.setItem("scores", JSON.stringify(scores));
}
function displayScores() {
  const scores = JSON.parse(localStorage.getItem('scores')) || [];
  updateScoreboard(scores);
}
// function displayFinalResults() {
//   console.log("displayFinalResults called");

//   if (finalResultsDisplayed) return; // Prevent multiple calls
//   finalResultsDisplayed = true;

//   document.getElementById(
//     "finalScore"
//   ).textContent = `Final Score: ${scoreCount}`;
//   document.getElementById(
//     "totalErrors"
//   ).textContent = `Total Errors: ${errorCount}`;
//   document.getElementById("totalTime").textContent = `Total Time: ${formatTime(
//     secondsElapsed
//   )}`;

//   const finalResultsModal = document.getElementById("finalResultsModal");
//   finalResultsModal.style.display = "block";

//   // Adding restart button
//   const restartButton = document.createElement("button");
//   restartButton.textContent = "Restart Game";
//   restartButton.classList.add("restart-button");
//   restartButton.onclick = function () {
//     finalResultsModal.style.display = "none";
//     resetGame();
//   };
//   finalResultsModal.appendChild(restartButton);

//   const closeButton = finalResultsModal.querySelector(".close-button");
//   closeButton.onclick = function () {
//     finalResultsModal.style.display = "none";
//     resetGame();
//   };

//   window.onclick = function (event) {
//     if (event.target == finalResultsModal) {
//       finalResultsModal.style.display = "none";
//       resetGame();
//     }
//   };

//   // Save the final score for the user
//   const finalScore = {
//     name: localStorage.getItem('userNickname') || 'You',
//     time: formatTime(secondsElapsed),
//     scoreCount: scoreCount
//   };

//   // Create a new score object for the current user
//   const currentUserScore = {
//     name: localStorage.getItem("userNickname") || "You", // Use 'You' as fallback
//     time: formatTime(secondsElapsed),
//     scoreCount: scoreCount,
//   };

//   // Get existing scores from localStorage or initialize an empty array
//   const existingScores = getSavedScores();

//   // Add the current user's score to the array of scores
//   existingScores.push(currentUserScore);

//   // Save the updated array back to localStorage
//   localStorage.setItem("scores", JSON.stringify(existingScores));

//   // Update the scoreboard with the new scores
//   updateScoreboard(existingScores);
// }

function displayFinalResults() {
  console.log("displayFinalResults called");

  if (finalResultsDisplayed || scoreSubmitted) return; // Check the flag here too
  finalResultsDisplayed = true;

  document.getElementById("finalScore").textContent = `Final Score: ${scoreCount}`;
  document.getElementById("totalErrors").textContent = `Total Errors: ${errorCount}`;
  document.getElementById("totalTime").textContent = `Total Time: ${formatTime(secondsElapsed)}`;

  const finalResultsModal = document.getElementById("finalResultsModal");
  finalResultsModal.style.display = "block";

  const restartButton = document.createElement("button");
  restartButton.textContent = "Restart Game";
  restartButton.classList.add("restart-button");
  restartButton.onclick = function () {
    finalResultsModal.style.display = "none";
    resetGame();
  };
  finalResultsModal.appendChild(restartButton);

  const closeButton = finalResultsModal.querySelector(".close-button");
  closeButton.onclick = function () {
    finalResultsModal.style.display = "none";
    // Do not call resetGame here if you don't want to start a new game immediately
  };

  if (!scoreSubmitted) {
    let existingScores = getSavedScores(); // Retrieve existing scores
    const currentUserScore = {
        name: localStorage.getItem("userNickname") || "Anonymous",
        email: localStorage.getItem("userEmail") || "No email provided", // If you want to save email as well.
        time: formatTime(secondsElapsed),
        score: scoreCount,
    };

    existingScores.push(currentUserScore); // Add new score
    localStorage.setItem("scores", JSON.stringify(existingScores)); // Save updated scores array
    updateScoreboard(existingScores); // Update the scoreboard display
    scoreSubmitted = true;
}
}
function getSavedScores() {
  // Retrieve the scores from localStorage
  const savedScores = localStorage.getItem("scores");
  return savedScores ? JSON.parse(savedScores) : [];
}



// < ---------------------------------------------- UTILITY FUNCTIONS ---------------------------------------------- >

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
       <div class="card__face card__face--front"><h3>?</h3></div>
       <div class="card__face card__face--back">
         <div class="card__content">
           <div class="card__header">
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




// < ---------------------------------------------- Global Variables and Assets ---------------------------------------------- >

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
const timerDisplay = document.getElementById("timer");
const errorDisplay = document.getElementById("errors");
const scoreDisplay = document.getElementById("score");

const soundEffects = {
  click: new Audio("../sounds/flip.wav"),
  error: new Audio("../sounds/fail.wav"),
  win: new Audio("../sounds/cheer.wav"),
};
const levelOne = [
  "../images/a.jpg",
  "../images/a-1.jpg",
  "../images/b.jpg",
  "../images/b-1.jpg",
  "../images/c.jpg",
  "../images/c-1.jpg",
  "../images/d.jpg",
  "../images/d-1.jpg",
];

const levelTwo = [
  "../images/levelTwo/a.jpg",
  "../images/levelTwo/a-1.jpg",
  "../images/levelTwo/b.jpg",
  "../images/levelTwo/b-1.jpg",
  "../images/levelTwo/c.jpg",
  "../images/levelTwo/c-1.jpg",
  "../images/levelTwo/d.jpg",
  "../images/levelTwo/d-1.jpg",
];
const levelThree = [
  "../images/levelThree/a.jpg",
  "../images/levelThree/a-1.jpg",
  "../images/levelThree/b.jpg",
  "../images/levelThree/b-1.jpg",
  "../images/levelThree/c.jpg",
  "../images/levelThree/c-1.jpg",
  "../images/levelThree/d.jpg",
  "../images/levelThree/d-1.jpg",
];



// Example scores data - replace this with actual game data
const exampleScores = [
  { name: "John Brown", time: "00:24.24", scoreCount: 100 },
  { name: "Lenora Weathers", time: "00:32.34", scoreCount: 95 },
  { name: "Juan Bocachica", time: "00:24.24", scoreCount: 80 },
  { name: "Esperanza Fugaz", time: "00:32.34", scoreCount: 75 },
  { name: "Fulgencio Batista", time: "00:35.10", scoreCount: 70 },
  { name: "Mercedes Risueño", time: "00:40.42", scoreCount: 65 },
  { name: "Armando Casas", time: "00:43.58", scoreCount: 60 },
  { name: "Luz del Alba", time: "00:45.16", scoreCount: 55 },
  { name: "Evaristo Liriano", time: "00:47.29", scoreCount: 50 },
  { name: "Dolores Delano", time: "00:52.33", scoreCount: 45 },
  { name: "Cristóbal Manguera", time: "00:54.14", scoreCount: 40 },
  { name: "Milagros Milán", time: "00:59.78", scoreCount: 35 },
];

// Call this function with actual data when needed
updateScoreboard(exampleScores);

// LocalStorage
document.getElementById("signinForm").onsubmit = function(event) {
  event.preventDefault();
  const nickname = document.getElementById("nickname").value;
  const email = document.getElementById("email").value;

  // Save the user data in localStorage
  localStorage.setItem("userNickname", nickname);
  localStorage.setItem("userEmail", email);

  // Hide the sign-in modal
  document.getElementById("signinModal").style.display = "none";

  // Begin the game after signing in
  startGame();
};

// update scores



// Example usage:
updateScoreboard(exampleScores); // Call this when you need to update the scoreboard


