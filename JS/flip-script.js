// TODO: - Add a restart button under the game. This will allow players to reset the game state
// and start a new game without refreshing the page.

// TODO: Add sound effects for different actions in the game:
// - Click action: Play a sound when a card is flipped.
// - Error action: Play a sound when a mismatched pair is flipped back.
// - Win action: Play a sound when all pairs are successfully matched and the player wins.

// TODO: Resize the game container to better fit different screen sizes or to make the game
// more visually appealing. This might involve adjusting the CSS for the `.cards-container`
// and possibly the individual card sizes as well.


function submitForm() {
  // TODO: send to a server)
  const email = document.getElementById("email").value;
  const name = document.getElementById("name").value;
  alert(
    `¡Gracias por unirte, ${name}! Tu correo ${email} ha sido registrado. ¡Comencemos el juego!`
  );

  // Clear fields
  document.getElementById("email").value = "";
  document.getElementById("name").value = "";

  // Redirect to the next page
  window.location.href = "flip-card.html"; // Redirects to the game page
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
  "../images/g.jpg",
  "../images/g.jpg",
  "../images/h.jpg",
  "../images/h.jpg",
  "../images/i.jpg",
  "../images/i.jpg",
  "../images/j.jpg",
  "../images/j.jpg",
];

console.log("the total number of photos in the array:", imagesArray.length);
// Shuffle the imagesArray first

//the below contains the click action for the cards, in the forEach
function createCards(imagesArray) {
  const container = document.querySelector(".cards-container");
  container.innerHTML = "";
  // Iterate over each image source in the imagesArray.
  // `imageSrc` is the current image URL being processed, and `index` is its position in the array.
  imagesArray.forEach((imageSrc, index) => {
    // Create a new <div> element to serve as the container for the card.
    const cardElement = document.createElement("div");
    // Assign the 'card' class to this new div for styling purposes.
    cardElement.className = "card";

    // Set the innerHTML of the cardElement with the structure of the card.
    // This includes a front face that shows a question mark and a back face that shows the image.
    // The image's source (`src`) is set to `imageSrc`, the current item in the array.
    // The `alt` attribute of the image is set to a descriptive text including the index of the image.

    cardElement.innerHTML = `
            <div class="card__inner">
                <div class="card__face card__face--front">
                    <h2>?</h2>
                </div>
                <div class="card__face card__face--back">
                    <div class="card__content">
                        <div class="card__header">
                            <img src="${imageSrc}" alt="Card image ${index}" class="pp">
                        </div>
                    </div>
                </div>
            </div>
        `;

    // Select the '.card__inner' element within the cardElement and add an event listener to it.
    // This event listener listens for a 'click' event. When the card is clicked, the `flipCard` function is called.
    // The `flipCard` function is responsible for handling the logic that occurs when a card is clicked, 
    // such as flipping the card to reveal its face.
    cardElement.querySelector(".card__inner").addEventListener("click", flipCard);

    // Append the newly created cardElement to the 'container'.
    // 'container' is assumed to be a reference to a DOM element that acts as the parent container for all the cards.
    container.appendChild(cardElement);
  });
}

function shuffleArray(array) {
  //function takes any array

  console.log("Original array:", array);
  for (let i = array.length - 1; i > 0; i--) {
    //loop through array.count backwards
    const j = Math.floor(Math.random() * (i + 1)); //generate random interger
    console.log(`Indices to swap: ${i} with ${j}`);
    [array[i], array[j]] = [array[j], array[i]];
    console.log(`Array after swap ${i} with ${j}:`, array.slice()); // Log the array after each swap
  }

  console.log("Array after shuffling:", array.slice()); // Log the final shuffled array
}

shuffleArray(imagesArray); // shuffle the array by calling this function
createCards(imagesArray); // Call the function with your array

let hasFlippedCard = false;
let flippedCard1, flippedCard2;
let gameBoardLocked = false;


// This function is called whenever a card is clicked.
function flipCard() {

// First, check if the board is "locked". If so, return immediately and do nothing.
  // This prevents any action if the game logic has temporarily disabled interaction,
  // for example, while waiting for two unmatched cards to flip back over.
  if (gameBoardLocked) return;

   // Prevent the same card from being matched with itself by checking if
  // the clicked card (`this`) is the same as `firstCard`.
  // If it is, simply return without doing anything further.
  if (this === flippedCard1) return; // this = the card that was clicked 

  // Add the "is-flipped" class to the card that was clicked (`this`),
  // which should trigger any associated CSS to visually flip the card.
  this.classList.add("is-flipped");

  // Play the flip sound
  document.getElementById("flip-sound").play();


  // Check if a card has already been flipped during this turn.
  if (!hasFlippedCard) {
    // If no card has been flipped yet, mark that we have now flipped a card,
    // store the current card as `firstCard`, and wait for the next card flip.
    hasFlippedCard = true;
    flippedCard1 = this;
  } else {
    // If a card has already been flipped (meaning this is the second card being flipped),
    // store the current card as `secondCard`, lock the board to prevent more flips,
    // and call `checkForMatch` to see if the two flipped cards match.
    flippedCard2 = this;
    gameBoardLocked = true;
    checkForMatch();
  }
}

function checkForMatch() {
  let isMatch =
    flippedCard1.querySelector("img").src === flippedCard2.querySelector("img").src;

  isMatch ? disableCards() : unflipCards();
}

function disableCards() {
  flippedCard1.removeEventListener("click", flipCard);
  flippedCard2.removeEventListener("click", flipCard);
  resetBoard();
}

// Define the function unflipCards.
function unflipCards() {
    // Lock the game board to prevent any more cards from being flipped.
    // This is likely a safeguard to ensure that no additional actions can occur 
    // while the currently flipped cards are being processed.
    gameBoardLocked = true;
  
    // Set a delay before executing the code inside the setTimeout.
    // This gives a visual delay, allowing the player to see the second card 
    // before both cards are flipped back over if they do not match.
    setTimeout(() => {
      // Remove the "is-flipped" class from both flippedCard1 and flippedCard2.
      // This class likely controls the visual state of the cards (flipped to show the front or back).
      // Removing it would change the cards back to their initial state, showing their back sides.
      flippedCard1.classList.remove("is-flipped");
      flippedCard2.classList.remove("is-flipped");
  
      // Call the resetBoard function after the two cards have been flipped back.
      // This function likely resets the variables and state of the game board, allowing for further actions.
      // This may include unlocking the game board and clearing references to the currently flipped cards.
      resetBoard();
    }, 2000); // The delay is set to 1500 milliseconds, or 1.5 seconds.
  }

function resetBoard() {
  [hasFlippedCard, gameBoardLocked] = [false, false];
  [flippedCard1, flippedCard2] = [null, null];
}

function resetBoard() {
  // Reset the board for the next turn
  [hasFlippedCard, gameBoardLocked] = [false, false];
  [flippedCard1, flippedCard2] = [null, null];
}

