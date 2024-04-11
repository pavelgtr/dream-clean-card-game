// TODO timer starts before modal is completed
// TODO game matching is ending before all cards are matched

// <----------------------------------------- INSTRUCTIONS & SIGN-IN MODALS -----------------------------------------> //

// Initialize the game
document.addEventListener("DOMContentLoaded", function () {
  // displayInstructionModal();
  setupModalsAndForm();
});

// no instructions for now
//   function displayInstructionModal() {
//   const instructionModal = document.getElementById("instructionModal");
//   instructionModal.style.display = "block";

//   document.getElementById("startGameButton").onclick = function () {
//     instructionModal.style.display = "none";
//     showSignInModal();
//   };

//   document.querySelector("#instructionModal .close").onclick = function () {
//     instructionModal.style.display = "none";
//   };
// }

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
  };
}
function setupModalsAndForm() {
  startGame();
  showSignInModal();
}

// < ---------------------------------------------- GAME MECHANICS ---------------------------------------------- >

function startGame() {
  gameLevel = 1; // Ensure the game starts at level one
  totalTime = 0;
  createCards(levelOne); // Start with level one cards
  errorCount = 0; // Reset errors if starting a new game
  scoreCount = 0; // Reset score if starting a new game
  matchedPairsCount = 0; // Reset matched pairs count
  setPointsPerMatch(); // Set initial points per match
  resetTurn();
  // startTimer();
}

function updateTimerDisplay(seconds) {
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
function resetGame() {
  scoreSubmitted = false;

  stopTimer();
  finalResultsDisplayed = false;
  // This will now correctly check if the current game has finished level 3
  if (gameLevel === 3) {
    totalTime += secondsElapsed;
    localStorage.setItem('totalTime', totalTime);

    displayFinalResults(); // I don't need this function right now******
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
  // Extract the base filename by removing the '.jpg' and '-1' parts
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
  flippedCard1.classList.add("matched");
  flippedCard2.classList.add("matched");

  flippedCard1.removeEventListener("click", flipCard);
  flippedCard2.removeEventListener("click", flipCard);
  resetTurn();
  soundEffects.win.play();
}
function checkEndOfRound() {
  const anyCardArray = levelOne;
  const totalPairs = anyCardArray.length / 2; // Total number of pairs to be matched for a round
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
  scoreDisplay.textContent = `Puntos: ${scoreCount}`;
  //  setTimeout(() => {
  //   alert(`Mortal! Lograste hacer un match. Tu score ahora es ${scoreCount}`);
  // }, 1000);
}
function incrementError() {
  errorCount++;
  // errorDisplay.textContent = `Errors: ${errorCount}`;

  // Deduct points for error with lower limit check
  scoreCount = Math.max(0, scoreCount - 2); // Ensure score does not go below 0
  scoreDisplay.textContent = `Puntos: ${scoreCount}`; // Update score display
}
function stopTimer() {
  clearInterval(timer);
  secondsElapsed = 0;
  // timerDisplay.textContent = "Time: 00:00";
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

// removed from createCards  <div class="card__content">
// <div class="card__header">

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
let totalTime = 0;

const timerDisplay = document.getElementById("timer");
// const errorDisplay = document.getElementById("errors");
const scoreDisplay = document.getElementById("score");

var continueButton = document.getElementById("continue");

let form = document.getElementById("signinForm");

const nickname = document.getElementById("nickname");

var emailInput = document.getElementById("email");

// Add click event listener to the button

continueButton.addEventListener("click", function (event) {
  if (nickname.checkValidity() && emailInput.checkValidity()) {
    console.log("Name:", nickname.value, "Email:", emailInput.value); 
    try {
      startTimer();
    } catch (error) {
      console.error("Error starting timer:", error); // Log the error for debugging
      // Display a user-friendly message (e.g., an alert box)
      alert("Oops! Something went wrong starting the game. Please try again.");
    }
  } else {
    form.reportValidity();
  }
});

const resetButton = document.querySelector(".reset"); // Using querySelector to select the first match
resetButton.addEventListener("click", function () {
  resetGame(); // Call your reset function
  startGame();
});

// Select the next button and attach a function to show an alert
const nextButton = document.querySelector(".next-button"); // Using querySelector to select the first match
nextButton.addEventListener("click", function () {
  // alert("Siguiente Paso"); // Show your desired alert
  window.location.href = "./HTML/scoreboard.html";
});

const soundEffects = {
  click: new Audio("../sounds/flip.wav"),
  error: new Audio("../sounds/fail.wav"),
  win: new Audio("../sounds/cheer.wav"),
};


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







