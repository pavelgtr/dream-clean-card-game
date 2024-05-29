// main.js
import { resetGameState } from "./gameState.js";
import { showWelcomeMessage } from "./modals.js";
import { soundEffects } from "./soundEffects.js";
import { addEventListeners, setActiveLinkOnLoad } from "./dom.js";

export function initializeGame() {

  resetGameState();
  showWelcomeMessage();

  const elements = {
    hamburgerMenu: document.querySelector(".hamburger-menu"),
    mobileMenu: document.querySelector(".mobile-menu"),
    leaderboardLink: document.getElementById("leaderboardLink"),
    rulesLink: document.getElementById("rulesLink"),
    navLinks: document.querySelectorAll(".navigation-elements a"),
    mobileRulesLink: document.getElementById("mobile-rulesLink"),
    mobileLeaderboardLink: document.getElementById("mobile-leaderboardLink"),
    closeInstructionsModal: document.getElementById("closeInstructionsModal"),
    scoreboardModal: document.getElementById("ScoreBoardModal"),
  };

  addEventListeners(elements);
  setActiveLinkOnLoad(elements.navLinks);

  const volumeSlider = document.getElementById("volume-slider");
  if (volumeSlider) {
    volumeSlider.addEventListener("input", function (event) {
      const volume = event.target.value;
      Object.values(soundEffects).forEach((soundGroup) => {
        if (Array.isArray(soundGroup)) {
          soundGroup.forEach((sound) => {
            sound.volume = volume;
          });
        } else if (soundGroup instanceof Audio) {
          soundGroup.volume = volume;
        }
      });
    });
  }
}

// Call initializeGame when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", initializeGame);
