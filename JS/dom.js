// dom.js
import { displayScoreBoardModal } from "./leaderBoard.js";
import { pauseTimer, resumeTimer } from "./timer.js";
import { flipCard } from "./gameFlow.js";
import { gameState } from "./gameState.js";
import { showSignInModal } from "./modals.js";

export function toggleRoundTwoVisibility() {
  const roundTwoElements = document.querySelectorAll(".round-two-show");
  roundTwoElements.forEach((el) => {
    el.style.display = gameState.gameLevel === 2 ? "block" : "none";
  });
}

export function createCards(imagesArray) {
  const container = document.querySelector(".cards-container");
  shuffleArray(imagesArray);
  container.innerHTML = imagesArray
    .map(
      (imageSrc, index) => `
   <div class="card created-card">
     <div class="card__inner" data-index="${index}">
       <div class="card__face card__face--front"><img src="./images/Menu/card-front.png" alt="card-back-design"></div>
       <div class="card__face card__face--back">
             <img src="${imageSrc}" alt="Card image ${index}" class="pp">
           </div>
         </div>
       </div>
     </div>
   </div>
 `
    )
    .join("");

  // Attach event listeners to the card elements
  const cardElements = container.querySelectorAll(".card__inner");
  cardElements.forEach((card) => {
    card.addEventListener("click", handleCardClick);
    card.addEventListener("touchend", handleCardClick); // Add touchend event for mobile responsiveness
  });
}

export function generateCardId(imgSrc) {
  const baseName = imgSrc.substring(imgSrc.lastIndexOf("/") + 1);
  const id = baseName
    .replace(/-1\.png$|\.png$/, "") // Remove "-1.png" or ".png"
    .replace(/%20/g, " "); // Replace "%20" with spaces
  return id;
}

function handleCardClick(event) {
  event.preventDefault(); // Prevent the default action to ensure smooth handling

  const index = event.currentTarget.dataset.index;
  flipCard(event, index);
}

export function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export function updateTimerDisplay(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const formattedTime = `${mins.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
  const timerDisplay = document.querySelector("#timer span");
  timerDisplay.textContent = formattedTime;
}

export function updateScoreDisplay(score) {
  const scoreDisplay = document.querySelector("#score span");
  scoreDisplay.textContent = score;
}

export function addEventListeners(elements) {
  if (elements.hamburgerMenu && elements.mobileMenu) {
    elements.hamburgerMenu.addEventListener("click", toggleMobileMenu);
  }

  if (elements.leaderboardLink) {
    elements.leaderboardLink.addEventListener("click", function (event) {
      event.preventDefault();
      hideAllModals();
      displayScoreBoardModal();
      setActiveLink(event);
      if (gameState.gameStarted) {
        pauseTimer();
      }
    });
  }

  if (elements.rulesLink) {
    elements.rulesLink.addEventListener("click", function (event) {
      event.preventDefault();
      hideAllModals();
      showModal("FullInstructionsModal");
      setActiveLink(event);
      if (gameState.gameStarted) {
        pauseTimer();
      }
    });

    if (elements.mobileRulesLink) {
      elements.mobileRulesLink.addEventListener("click", function (event) {
        event.preventDefault();
        hideAllModals();
        showModal("FullInstructionsModal");
        elements.mobileMenu.style.display = "none";
        if (gameState.gameStarted) {
          pauseTimer();
        }
      });
    }

    if (elements.mobileLeaderboardLink) {
      elements.mobileLeaderboardLink.addEventListener(
        "click",
        function (event) {
          event.preventDefault();
          hideAllModals();
          displayScoreBoardModal();
          elements.mobileMenu.style.display = "none";
          if (gameState.gameStarted) {
            pauseTimer();
          }
        }
      );
    }

    // add a function here to startGame  when the start button is clicked. The button is in elements.closeInstructionsModal
  }

  if (elements.closeInstructionsModal) {
    elements.closeInstructionsModal.addEventListener("click", function () {
      closeModal("FullInstructionsModal");
      highlightJuegoLink(elements.navLinks);
      if (gameState.gameStarted) {
        resumeTimer();
      } else {
        showSignInModal();
        hideModal("welcomeModal");
        hideModal("leaderboardModal");
      }
    });
  }

  if (elements.scoreboardModal) {
    const closeButton = elements.scoreboardModal.querySelector(".close-button");
    if (closeButton) {
      closeButton.addEventListener("click", function () {
        elements.scoreboardModal.style.display = "none";
        highlightJuegoLink(elements.navLinks);
        if (gameState.gameStarted) {
          resumeTimer();
        } else {
          showModal("welcomeModal");
        }
      });
    }

    const restartGameButton =
      elements.scoreboardModal.querySelector("#restartGameButton");
    if (restartGameButton) {
      restartGameButton.addEventListener("click", function () {
        elements.scoreboardModal.style.display = "none";
        highlightJuegoLink(elements.navLinks);
        if (gameState.gameStarted) {
          resumeTimer();
        } else {
          showSignInModal();
          hideModal("welcomeModal");
          hideModal("leaderboardModal");
          hideModal("fullInstructionsModal");
        }
      });
    }
  }

  elements.navLinks.forEach((link) => {
    link.addEventListener("click", setActiveLink);
  });
}

// Helper function to hide all modals
function hideAllModals() {
  hideModal("welcomeModal");
  hideModal("FullInstructionsModal");
  hideModal("ScoreBoardModal");
  hideModal("signinModal"); // Add other modals as necessary
}

export function setActiveLink(event) {
  const navLinks = document.querySelectorAll(".navigation-elements a");
  navLinks.forEach((link) => {
    link.classList.remove("active");
  });
  event.currentTarget.classList.add("active");
}

export function highlightJuegoLink(navLinks) {
  navLinks.forEach((link) => {
    link.classList.remove("active");
  });
  const juegoLink = document.querySelector(
    ".navigation-elements a[href='index.html']"
  );
  if (juegoLink) {
    juegoLink.classList.add("active");
  }
}

export function setActiveLinkOnLoad(navLinks) {
  navLinks.forEach((link) => {
    if (link.href === window.location.href) {
      link.classList.add("active");
    }
  });
}

export function toggleMobileMenu() {
  const mobileMenu = document.querySelector(".mobile-menu");
  if (mobileMenu) {
    mobileMenu.style.display =
      mobileMenu.style.display === "flex" ? "none" : "flex";
  }
}

export function showModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = "block";
  }
}

export function hideModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = "none";
  }
}

export function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = "none";
  }
}

export function triggerConfetti() {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
  });
}

document
  .getElementById("leaderboardLink")
  .addEventListener("click", function (event) {
    event.preventDefault();

    console.log("Leaderboard modal displayed");
  });
