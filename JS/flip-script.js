 // TODO: Puntos:
// Bono por rapidez:  +10 si terminas en menos 3 minutos, +20  en menos de 2 minutos, +30 en menos de 1 minuto (analizar los break points de tiempo)
// Error: take away -2 points, also keep track of errors throughout, don't reset on every round 
// declare match end after three rounds 



// <----------------------------------------- INSTRUCTIONS & SIGN-IN MODALS -----------------------------------------> //

window.onload = function () {
  // First, show the instruction modal
  const instructionModal = document.getElementById("instructionModal");
  const instructionSpan = instructionModal.querySelector(".close");

  instructionModal.style.display = "block";

  // Close the instruction modal when the 'x' is clicked
  instructionSpan.onclick = function () {
    instructionModal.style.display = "none";
  };

  // Close the instruction modal and show sign-in modal when 'Start Game' is clicked
  const startGameButton = document.getElementById("startGameButton");
  startGameButton.onclick = function () {
    instructionModal.style.display = "none";
    showSignInModal();
  };

  function showSignInModal() {
    const signinModal = document.getElementById("signinModal");
    const signinSpan = signinModal.querySelector(".close");
    const form = document.getElementById("signinForm");

    signinModal.style.display = "block";

    // Close the sign-in modal when the 'x' is clicked
    signinSpan.onclick = function () {
      signinModal.style.display = "none";
    };

    // When the user submits the sign-in form, capture the data
    form.onsubmit = function (event) {
      event.preventDefault(); // Prevent the form from submitting normally
      const nickname = document.getElementById("nickname").value;
      const email = document.getElementById("email").value;

      // TODO: Handle the nickname and email (store them, send them to a server, etc.)

      signinModal.style.display = "none";
    };
  }

  // Close modals when clicking outside of them
  window.onclick = function (event) {
    if (event.target == instructionModal) {
      instructionModal.style.display = "none";
    } else if (event.target == signinModal) {
      signinModal.style.display = "none";
    }
  };
};


let hasFlippedCard = false;
let flippedCard1, flippedCard2;
let gameBoardLocked = false;
let timer = null;
let secondsElapsed = 0;
let errorCount = 0;
let scoreCount = 0;
let matchedPairsCount = 0;
let gameLevel = 1; 

function setPointsPerMatch() {
  if (gameLevel === 1) {
    pointsPerMatch = 10;
  } else if (gameLevel === 2) {
    pointsPerMatch = 15;
  } else if (gameLevel === 3) {
    pointsPerMatch = 20;
  }
}


const timerDisplay = document.getElementById("timer");
const errorDisplay = document.getElementById("errors");
const scoreDisplay = document.getElementById('score');


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
 container.innerHTML = imagesArray.map((imageSrc, index) => `
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
 `).join("");
}


function flipCard(event) { //deleted index (2nd) parameter, not needed 

 if (gameBoardLocked) return;
 const card = event.currentTarget;
 if (card === flippedCard1) return; // Prevents matching a card with itself by clicking the same card twice

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
 let baseName1 = flippedCard1.querySelector("img").src.split('/').pop().replace('.jpg', '').replace('-1', '');
 let baseName2 = flippedCard2.querySelector("img").src.split('/').pop().replace('.jpg', '').replace('-1', '');
  // Check if the base filenames are the same
 const isMatch = baseName1 === baseName2;

 if (isMatch) {
   disableCards();
   incrementScore();
   matchedPairsCount++; // Increment the count of matched pairs
   checkEndOfRound(); // New function to check if the game should end
 } else {
   unflipCards();
 }
}

function checkEndOfRound() {
  // Check if all pairs are matched
  const totalPairs = 4; // Total number of pairs to be matched for a round
  if (matchedPairsCount === totalPairs) {
    setTimeout(() => {
      alert('Congratulations! You have found all matches in this round!');
      // Logic to start the next round or reset the game
      resetGame(); // or startNextRound(); if you have a function to advance the round
    }, 1000);
  }
}

function incrementScore() {
 scoreCount += pointsPerMatch;
 scoreDisplay.textContent = `Score: ${scoreCount}`;
 setTimeout(() => {
  alert(`Mortal! Lograste hacer un match. Tu score ahora es ${scoreCount}`);
}, 1000);
}


function disableCards() {
 flippedCard1.removeEventListener("click", flipCard);
 flippedCard2.removeEventListener("click", flipCard);
 resetTurn();
 soundEffects.win.play();
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

function resetTurn() {
 [hasFlippedCard, gameBoardLocked] = [false, false];
 [flippedCard1, flippedCard2] = [null, null];
}

function incrementError() {
 errorCount++;
 errorDisplay.textContent = `Errors: ${errorCount}`;
}

function startTimer() {
 timer = setInterval(() => {
   secondsElapsed++;
   timerDisplay.textContent = `Time: ${formatTime(secondsElapsed)}`;
 }, 1000);
}

function formatTime(seconds) {
 const mins = Math.floor(seconds / 60);
 const secs = seconds % 60;
 return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

function startGame() {
 resetGame();
 startTimer();
 setPointsPerMatch(); // Set points per match based on the current game level

}

function stopGame() {
 stopTimer();
 resetGame();


}

function resetGame() {
 stopTimer();
 errorCount = 0;
 
 errorDisplay.textContent = "Errors: 0";

 if ((scoreCount >= 40) && (scoreCount < 80)) {
  gameLevel = 2;
  createCards(levelTwo);
  matchedPairsCount = 0;
} else if (scoreCount >= 80) {
  gameLevel = 3;
  createCards(levelThree); // This should be levelThree for the third level
  matchedPairsCount = 0;
} else {
  gameLevel = 1;
  createCards(levelOne);
}

 setPointsPerMatch(); // Update points per match based on the new level
 
 resetTurn();
}




// Initialize the game
document.addEventListener("DOMContentLoaded", startGame);




function stopTimer() {
 clearInterval(timer);
 secondsElapsed = 0;
 timerDisplay.textContent = "Time: 00:00";
}
