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


const timerDisplay = document.getElementById("timer");
const errorDisplay = document.getElementById("errors");
const scoreDisplay = document.getElementById('score');


const soundEffects = {
 click: new Audio("../sounds/flip.wav"),
 error: new Audio("../sounds/fail.wav"),
 win: new Audio("../sounds/cheer.wav"),
};






const imagesArray = [
 "../images/a.jpg",
 "../images/a-1.jpg",
 "../images/b.jpg",
 "../images/b-1.jpg",
 "../images/c.jpg",
 "../images/c-1.jpg",
 "../images/d.jpg",
 "../images/d-1.jpg",
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






function flipCard(event, index) {
 if (gameBoardLocked) return;
 const card = event.currentTarget;
 if (card === flippedCard1) return;


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
 } else {
   unflipCards();
 }
}


function incrementScore() {
 scoreCount++;
 scoreDisplay.textContent = `Score: ${scoreCount}`;
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


}


function stopGame() {
 stopTimer();
 resetGame();


}


function resetGame() {
 stopTimer();
 errorCount = 0;
 errorDisplay.textContent = "Errors: 0";
 createCards(imagesArray);
 resetTurn();
}




// Initialize the game
document.addEventListener("DOMContentLoaded", startGame);




function stopTimer() {
 clearInterval(timer);
 secondsElapsed = 0;
 timerDisplay.textContent = "Time: 00:00";
}
