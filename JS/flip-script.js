// function submitForm() {
//   // Example of capturing data - in reality, you'd do more (store, send to a server, etc.)
//   const email = document.getElementById("email").value;
//   const name = document.getElementById("name").value;
//   alert(
//     `¡Gracias por unirte, ${name}! Tu correo ${email} ha sido registrado. ¡Comencemos el juego!`
//   );

//   // Clear fields
//   document.getElementById("email").value = "";
//   document.getElementById("name").value = "";

//   // Redirect to the next page
//   window.location.href = "HTML/flip-card.html"; // Redirects to the game page
// }


window.onload = function() {
  const modal = document.getElementById("myModal");
  const span = document.getElementsByClassName("close")[0];
  const form = document.getElementById("signinForm");

  // When the user loads the page, open the modal
  modal.style.display = "block";

  // When the user clicks on <span> (x), close the modal
  span.onclick = function() {
    modal.style.display = "none";
  }

  // When the user submits the form, capture the nickname and email, then close the modal
  form.onsubmit = function(event) {
    event.preventDefault(); // Prevent form from submitting normally
    const nickname = document.getElementById("nickname").value;
    const email = document.getElementById("email").value;
    
    // TODO: You can store or use the nickname and email as needed

    modal.style.display = "none";
  }

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }
}


const imagesArray = [
  "../images/a.jpg",
  "../images/a.jpg",
  "../images/b.jpg",
  "../images/b.jpg",
  "../images/c.jpg",
  "../images/c.jpg",
  "../images/d.jpg",
  "../images/d.jpg",
  "../images/e.jpg",
  "../images/e.jpg",
  "../images/f.jpg",
  "../images/f.jpg",
  // "../images/g.jpg",
  // "../images/g.jpg",
  // "../images/h.jpg",
  // "../images/h.jpg",
  // "../images/i.jpg",
  // "../images/i.jpg",
  // "../images/j.jpg",
  // "../images/j.jpg",
];

const soundEffects = {
  click: new Audio("../sounds/flip.wav"),
  error: new Audio("../sounds/fail.wav"),
  win: new Audio("../sounds/cheer.wav"),
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
const playButton = document.getElementById("play-button");
const scoreDisplay = document.getElementById('score');

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

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
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
  const isMatch = flippedCard1.querySelector("img").src === flippedCard2.querySelector("img").src;
  isMatch ? (disableCards(), incrementScore()) : unflipCards();
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

function stopTimer() {
  clearInterval(timer);
  secondsElapsed = 0;
  timerDisplay.textContent = "Time: 00:00";
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

function startGame() {
  resetGame();
  startTimer();
 
  
  // Change the button text to 'Stop'
  playButton.textContent = 'Stop';

  // Add an event listener for the 'Stop' button functionality
  playButton.removeEventListener('click', startGame); // Remove the event listener for starting the game
  playButton.addEventListener('click', stopGame); // Add the event listener for stopping the game
}

function stopGame() {
  stopTimer();
  resetGame();

  // Change the button text back to 'Play'
  playButton.textContent = 'Play';

  // Change event listeners back for the next round
  playButton.removeEventListener('click', stopGame); // Remove the event listener for stopping the game
  playButton.addEventListener('click', startGame); // Add the event listener for starting the game
}

function resetGame() {
  stopTimer();
  errorCount = 0;
  errorDisplay.textContent = "Errors: 0";
  createCards(imagesArray);
  resetTurn();
}

playButton.addEventListener("click", startGame);

// Initialize the game
document.addEventListener("DOMContentLoaded", startGame);


