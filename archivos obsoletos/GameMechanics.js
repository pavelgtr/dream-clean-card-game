// GameMechanics.js

import { createCards } from "./Utilities.js";
import { displayFinalResults } from "./Scoring.js";
import { gameLevel, errorCount, scoreCount, matchedPairsCount, levelOne } from "./Globals.js";

export function startGame() {
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
