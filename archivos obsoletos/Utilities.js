// Utilities.js
// Contains shared utility functions used across the game.

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
  export function createCards(imagesArray) {
    const container = document.querySelector(".cards-container");
    console.log("Original array:", imagesArray);
    // shuffleArray(imagesArray);
    const shuffledImages = shuffleArray(imagesArray.slice()); // Ensure we operate on a copy

    console.log("Shuffled array:", shuffledImages); 

    container.innerHTML = imagesArray
      .map(
        (imageSrc, index) => `
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
   `
      )
      .join("");
  }

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

// Add any other utility functions needed by your game here.
