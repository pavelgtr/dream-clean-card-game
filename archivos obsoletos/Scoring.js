//Scoring.js

import { scoreCount } from "./Globals.js";
// import { displayScores} from 
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
  export function displayScores() {
    const scores = JSON.parse(localStorage.getItem('scores')) || [];
    updateScoreboard(scores);
  }
  
  
  export function displayFinalResults() {
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
