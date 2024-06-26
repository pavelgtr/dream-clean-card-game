// leaderboard.js
import { gameState } from "./gameState.js";
import { resumeTimer } from "./timer.js";
import { levelTwo } from "./arrays.js";
import { highlightJuegoLink } from "./dom.js";
import { initializeGame } from "./main.js";
export function submitScore(nickname, email, finalScore) {
  $.ajax({
    url: "PHP/submit_score.php",
    method: "POST",
    data: {
      nickname: nickname,
      email: email,
      score: finalScore,
      game_level: gameState.gameLevel,
      total_time: gameState.totalTime,
    },
    success: function (response) {
      console.log(response);
      displayScoreBoardModal();
    },
    error: function (xhr, status, error) {
      console.error("Error submitting score:", error);
    },
  });
}

export function displayScoreBoardModal() {
  const scoreboardModal = document.getElementById("ScoreBoardModal");
  const leaderboardTable = document.getElementById("leaderboardTable");
  const currentPlayerResultTable = document.getElementById(
    "currentPlayerResultTable"
  );

  // Ensure the modal is visible
  scoreboardModal.style.display = "block";

  // Clear any existing leaderboard data
  leaderboardTable.querySelector("tbody").innerHTML = "";
  currentPlayerResultTable.querySelector("tbody").innerHTML = "";

  // Fetch leaderboard data via AJAX
  $.ajax({
    url: "PHP/get_leaderboard.php", // Path relative to your index.html
    method: "GET",
    success: function (response) {
      const leaderboardData = JSON.parse(response);
      console.log("Leaderboard Data:", leaderboardData); // Debugging output

      // Sort leaderboard data by score
      leaderboardData.sort((a, b) => b.score - a.score);

      // Assign ranks
      leaderboardData.forEach((player, index) => {
        player.rank = index + 1;
      });

      // Ensure we only display top 5 leaders
      const topFivePlayers = leaderboardData.slice(0, 5);

      // Display top five players
      topFivePlayers.forEach((player) => {
        const row = leaderboardTable.insertRow(-1);
        row.classList.add("leaderboard-row");

        const rankCell = row.insertCell(0);
        rankCell.classList.add("first-cell");
        rankCell.innerHTML = player.rank;

        const nicknameCell = row.insertCell(1);
        nicknameCell.classList.add("second-cell");
        const firstLetter = player.nickname.charAt(0).toUpperCase();
        nicknameCell.innerHTML = `<div class="blue-circle">${firstLetter}</div>${player.nickname}`;

        const scoreCell = row.insertCell(2);
        scoreCell.classList.add("third-cell");
        scoreCell.innerHTML = player.score;
      });

      // Calculate the current player's rank
      const currentScore = gameState.scoreCount;
      let currentRank = 1;

      for (const player of leaderboardData) {
        if (player.score > currentScore) {
          currentRank++;
        } else {
          break;
        }
      }

      // Populate current player result
      const row = currentPlayerResultTable.insertRow(-1);
      row.classList.add("leaderboard-row");

      const rankCell = row.insertCell(0);
      rankCell.classList.add("first-cell");
      rankCell.innerHTML = currentRank;

      const nicknameCell = row.insertCell(1);
      nicknameCell.classList.add("second-cell");
      const currentFirstLetter = gameState.playerNickname
        .charAt(0)
        .toUpperCase();
      nicknameCell.innerHTML = `<div class="blue-circle">${currentFirstLetter}</div>${gameState.playerNickname}`;

      const scoreCell = row.insertCell(2);
      scoreCell.classList.add("third-cell");
      scoreCell.innerHTML = currentScore;

      // Display the modal
      scoreboardModal.style.display = "block";
    },
    error: function (xhr, status, error) {
      console.error("Error fetching leaderboard:", error);
    },
  });

  // Update the button functionality based on game state
  const restartGameButton = document.getElementById("restartGameButton");

  // Determine the button text and functionality based on game state
  if (
    gameState.gameLevel === 2 &&
    gameState.matchedPairsCount === levelTwo.length / 2
  ) {
    restartGameButton.textContent = "Jugar";
    restartGameButton.onclick = function () {
      // Reset the game state and restart the game
      location.reload();
      initializeGame();
    };
  } else {
    restartGameButton.textContent = "Jugar";
    restartGameButton.onclick = function () {
      // Close the leaderboard modal and continue the game
      scoreboardModal.style.display = "none";
      highlightJuegoLink(document.querySelectorAll(".navigation-elements a"));
      resumeTimer();
    };
  }
}
