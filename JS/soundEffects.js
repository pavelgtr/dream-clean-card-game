// soundEffects.js
export const soundEffects = {
  buttonClick: new Audio("./sounds/Glass Button Ding.wav"),
  startGame: new Audio("./sounds/Cards Card Flick.wav"),
  clickSounds: [
    new Audio("./sounds/Mountain Audio - Cardboard Game Card Flip - 1.mp3"),
    new Audio("./sounds/Mountain Audio - Cardboard Game Card Flip - 2.mp3"),
    new Audio("./sounds/Mountain Audio - Cardboard Game Card Flip - 3.mp3"),
    new Audio("./sounds/Mountain Audio - Cardboard Game Card Flip - 4.mp3"),
    new Audio("./sounds/Mountain Audio - Cardboard Game Card Flip - 5.mp3"),
    new Audio("./sounds/Mountain Audio - Cardboard Game Card Flip - 6.mp3"),
  ],
  winSounds: [
    new Audio("./sounds/Slot Win 1.mp3"),
    new Audio("./sounds/Slot Win 2.mp3"),
    new Audio("./sounds/Slot Win 3.mp3"),
    new Audio("./sounds/Slot Win 4.mp3"),
    new Audio("./sounds/Slot Win 5.mp3"),
    new Audio("./sounds/Slot Win 6.mp3"),
  ],
  loseSounds: [
    new Audio("./sounds/Application Fail 1.mp3"),
    new Audio("./sounds/Application Fail 2.mp3"),
    new Audio("./sounds/Application Fail 3.mp3"),
  ],
  currentClickIndex: 0,
  currentWinIndex: 0,
  currentLoseIndex: 0,
};

export function getNextClickSound() {
  const sound = soundEffects.clickSounds[soundEffects.currentClickIndex];
  soundEffects.currentClickIndex =
    (soundEffects.currentClickIndex + 1) % soundEffects.clickSounds.length;
  return sound;
}

export function getNextWinSound() {
  const sound = soundEffects.winSounds[soundEffects.currentWinIndex];
  soundEffects.currentWinIndex =
    (soundEffects.currentWinIndex + 1) % soundEffects.winSounds.length;
  return sound;
}

export function getNextLoseSound() {
  const sound = soundEffects.loseSounds[soundEffects.currentLoseIndex];
  soundEffects.currentLoseIndex =
    (soundEffects.currentLoseIndex + 1) % soundEffects.loseSounds.length;
  return sound;
}
