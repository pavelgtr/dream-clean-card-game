// Initialization
let cards = generateCards(); // Creates pairs of cards for each product
shuffle(cards); // Randomly orders the cards on the game board

let currentLevel = 1;
let moves = 0;
let score = 0;
let matchedPairs = 0;

function startGame() {
  displayCards(faceDown);
  attachEventListeners(); // Listen for card clicks
}

function cardClicked(card) {
  if (twoCardsFlipped() && !isAMatch()) {
    flipCardsBack();
    moves++;
    updateMovesDisplay();
  } else if (isAMatch()) {
    showProductInfo(card.productID); // Displays product benefits
    score += calculateScore();
    matchedPairs++;
    updateScoreDisplay();
    if (matchedPairs === totalPairsForLevel(currentLevel)) {
      currentLevel++;
      loadNextLevel();
    }
  }
}

function loadNextLevel() {
  if (currentLevel > MAX_LEVEL) {
    showGameOverScreen();
  } else {
    increaseDifficulty(); // More cards, less time, etc.
    resetBoard();
    startGame();
  }
}

// Utility Functions
function generateCards() { /* Generates card objects */ }
function shuffle(array) { /* Shuffles the array */ }
function displayCards(mode) { /* Display cards based on mode */ }
function attachEventListeners() { /* For card click handling */ }
function twoCardsFlipped() { /* Checks if two cards are flipped */ }
function isAMatch() { /* Checks if the flipped cards match */ }
function flipCardsBack() { /* Flips cards back over */ }
function showProductInfo(productID) { /* Displays product info */ }
function calculateScore() { /* Calculates score based on game state */ }
function updateScoreDisplay() { /* Updates UI with the new score */ }
function increaseDifficulty() { /* Adjusts game for next level */ }
function resetBoard() { /* Prepares game board for next level */ }


function submitForm() {
    // Example of capturing data - in reality, you'd do more (store, send to a server, etc.)
    const email = document.getElementById('email').value;
    const name = document.getElementById('name').value;
    alert(`Thank you for joining, ${name}! Your email ${email} has been recorded. Let's start the game!`);
    
    // Clear fields
    document.getElementById('email').value = '';
    document.getElementById('name').value = '';

    // Here you would redirect to the next page or change the view.
    // window.location.href = 'next-page-url.html'; // Uncomment and replace with your actual next page URL
}