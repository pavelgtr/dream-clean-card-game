// const card = document.querySelector('.card__inner'); 

// card.addEventListener('click', function() {
//     card.classList.toggle('is-flipped')
// });
function submitForm() {
    // Example of capturing data - in reality, you'd do more (store, send to a server, etc.)
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
    '../images/j.jpg',
    '../images/j.jpg',
  ];

  // Shuffle the imagesArray first
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

shuffleArray(imagesArray);

// Then create the cards
function createCards(imagesArray) {
    const container = document.querySelector('.cards-container');

    // Clear out any existing cards first (if necessary)
    container.innerHTML = '';

    imagesArray.forEach((imageSrc, index) => {
        // Create card elements
        const cardElement = document.createElement('div');
        cardElement.className = 'card';
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

        // Add flip event
        cardElement.querySelector('.card__inner').addEventListener('click', function() {
            this.classList.toggle('is-flipped');
        });

        // Append to container
        container.appendChild(cardElement);
    });
}

createCards(imagesArray); // Call the function with your array



