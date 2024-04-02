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
  window.location.href = "game.html"; // Redirects to the game page
}

//photos array

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
  // "../images/i.jpg",
  // "../images/i.jpg",
  // '../images/j.jpg',
  // '../images/j.jpg',
];

// Fisher-Yates Shuffle function
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1)); // Random index from 0 to i
    [array[i], array[j]] = [array[j], array[i]]; // Swap elements
  }
  return array;
}

// Shuffled images array
var shuf_images = shuffle(imagesArray.slice()); // Create a copy of the array to shuffle

// Select the game container div
const gameContainer = document.querySelector(".game");

// Loop through the shuffled images array and create image elements
shuf_images.forEach((src) => {
  // Create a new div for the card item
  let box = document.createElement("div");
  box.className = "item";

  // Create a new img element and set the src attribute to the image path
  let image = document.createElement("img");
  image.src = src;
  image.alt = "Memory game image";

  // Append the img to the card item div
  box.appendChild(image);

  // Append the card item to the game container
  gameContainer.appendChild(box);
});


