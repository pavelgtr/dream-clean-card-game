// InstructionsAndModals.js

import { startGame } from "./GameMechanics.js";
import { displayScores }  from "./Scoring.js";

export function displayInstructionModal() {
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

    document.getElementById("signinForm").onsubmit = handleSignInSubmit;
}


 function handleSignInSubmit(event) {
    event.preventDefault();
    const nickname = document.getElementById("nickname").value;
    const email = document.getElementById("email").value;
    localStorage.setItem("userNickname", nickname);
    localStorage.setItem("userEmail", email);
    document.getElementById("signinModal").style.display = "none";
    
    // After sign-in, the game can start.
    startGame(); // This function needs to be accessible globally or imported if using modules.
}

export function setupModalsAndForm() {
    startGame();
    const savedScores = getSavedScores();
    updateScoreboard(savedScores);
    // Assuming displayScores() is intended to refresh or update the displayed scores
    displayScores(); // This will load and display the scores from localStorage
  }
