// dom.js
import { gameState } from "./gameState.js";
import { levelOne, levelTwo } from "./arrays.js";
import { displayScoreBoardModal } from "./leaderBoard.js";
import { pauseTimer, resumeTimer } from "./timer.js";
import { flipCard } from "./gameFlow.js";

export function createCards(imagesArray) {
  const container = document.querySelector(".cards-container");
  shuffleArray(imagesArray);
  container.innerHTML = imagesArray
    .map(
      (imageSrc, index) => `
   <div class="card created-card">
     <div class="card__inner" data-index="${index}">
       <div class="card__face card__face--front"><img src="./images/Menu/Back.png" alt="card-back-design"></div>
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
  });
}

function handleCardClick(event) {
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

  if (elements.mobileRulesLink) {
    elements.mobileRulesLink.addEventListener("click", function (event) {
      event.preventDefault();
      showModal("FullInstructionsModal");
      elements.mobileMenu.style.display = "none";
      pauseTimer();
    });
  }

  if (elements.mobileLeaderboardLink) {
    elements.mobileLeaderboardLink.addEventListener("click", function (event) {
      event.preventDefault();
      displayScoreBoardModal();
      elements.mobileMenu.style.display = "none";
      pauseTimer();
    });
  }

  if (elements.leaderboardLink) {
    elements.leaderboardLink.addEventListener("click", function (event) {
      event.preventDefault();
      displayScoreBoardModal();
      setActiveLink(event);
      pauseTimer();
    });
  }

  if (elements.rulesLink) {
    elements.rulesLink.addEventListener("click", function (event) {
      event.preventDefault();
      showModal("FullInstructionsModal");
      setActiveLink(event);
      pauseTimer();
    });
  }

  if (elements.closeInstructionsModal) {
    elements.closeInstructionsModal.addEventListener("click", function () {
      closeModal("FullInstructionsModal");
      highlightJuegoLink(elements.navLinks);
      resumeTimer();
    });
  }

  if (elements.scoreboardModal) {
    const closeButton = elements.scoreboardModal.querySelector(".close-button");
    if (closeButton) {
      closeButton.addEventListener("click", function () {
        elements.scoreboardModal.style.display = "none";
        highlightJuegoLink(elements.navLinks);
        resumeTimer();
      });
    }

    const restartGameButton =
      elements.scoreboardModal.querySelector("#restartGameButton");
    if (restartGameButton) {
      restartGameButton.addEventListener("click", function () {
        elements.scoreboardModal.style.display = "none";
        highlightJuegoLink(elements.navLinks);
        resumeTimer();
      });
    }
  }

  elements.navLinks.forEach((link) => {
    link.addEventListener("click", setActiveLink);
  });
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
