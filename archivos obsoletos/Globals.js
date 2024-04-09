
// Globals.js

export let hasFlippedCard = false;
export let flippedCard1 = null, flippedCard2 = null;
export let gameBoardLocked = false;
export let timer = null;
export let secondsElapsed = 0;
export let errorCount = 0;
export let scoreCount = 0;
export let matchedPairsCount = 0;
export let gameLevel = 1;
export let finalResultsDisplayed = false;
export let scoreSubmitted = false;

// DOM elements
export const timerDisplay = document.getElementById("timer");
export const errorDisplay = document.getElementById("errors");
export const scoreDisplay = document.getElementById("score");

// Sound effects
export const soundEffects = {
  click: new Audio("../sounds/flip.wav"),
  error: new Audio("../sounds/fail.wav"),
  win: new Audio("../sounds/cheer.wav"),
};

// Levels
export const levelOne = [
  "../images/a.jpg",
  "../images/a-1.jpg",
  "../images/b.jpg",
  "../images/b-1.jpg",
  "../images/c.jpg",
  "../images/c-1.jpg",
  "../images/d.jpg",
  "../images/d-1.jpg",
];

export const levelTwo = [
  "../images/levelTwo/a.jpg",
  "../images/levelTwo/a-1.jpg",
  "../images/levelTwo/b.jpg",
  "../images/levelTwo/b-1.jpg",
  "../images/levelTwo/c.jpg",
  "../images/levelTwo/c-1.jpg",
  "../images/levelTwo/d.jpg",
  "../images/levelTwo/d-1.jpg",
];

export const levelThree = [
  "../images/levelThree/a.jpg",
  "../images/levelThree/a-1.jpg",
  "../images/levelThree/b.jpg",
  "../images/levelThree/b-1.jpg",
  "../images/levelThree/c.jpg",
  "../images/levelThree/c-1.jpg",
  "../images/levelThree/d.jpg",
  "../images/levelThree/d-1.jpg",
];

// Example scores data - replace this with actual game data
export const exampleScores = [
    { name: "John Brown", time: "00:24.24", scoreCount: 100 },
    { name: "Lenora Weathers", time: "00:32.34", scoreCount: 95 },
    { name: "Juan Bocachica", time: "00:24.24", scoreCount: 80 },
    { name: "Esperanza Fugaz", time: "00:32.34", scoreCount: 75 },
    { name: "Fulgencio Batista", time: "00:35.10", scoreCount: 70 },
    { name: "Mercedes Risueño", time: "00:40.42", scoreCount: 65 },
    { name: "Armando Casas", time: "00:43.58", scoreCount: 60 },
    { name: "Luz del Alba", time: "00:45.16", scoreCount: 55 },
    { name: "Evaristo Liriano", time: "00:47.29", scoreCount: 50 },
    { name: "Dolores Delano", time: "00:52.33", scoreCount: 45 },
    { name: "Cristóbal Manguera", time: "00:54.14", scoreCount: 40 },
    { name: "Milagros Milán", time: "00:59.78", scoreCount: 35 },
];