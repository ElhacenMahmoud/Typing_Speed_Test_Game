const lvls = {
  easy: 5,
  normal: 3,
  hard: 2,
};

// Selectors
const startButton = document.querySelector(".start");
const lvlNameSpan = document.querySelector(".message .lvl");
const secondsSpan = document.querySelector(".message .seconds");
const theWord = document.querySelector(".the-word");
const upcomingWords = document.querySelector(".upcoming-words");
const input = document.querySelector(".input");
const timeLeftSpan = document.querySelector(".time span");
const scoreGot = document.querySelector(".score .got");
const scoreTotal = document.querySelector(".score .total");
const endgamesound = document.getElementById("End-Game");
const SuccessSound = document.getElementById("success");

let defaultLevelName = "normal";
let defaultLevelSeconds = lvls[defaultLevelName];

// Disable paste event
input.onpaste = () => false;

// Start game
startButton.onclick = () => {
  startButton.remove();
  input.focus();
  genWords();
};

let msg = prompt("Choose a level: easy, Normal, hard") || defaultLevelName;
chooselvl();

function chooselvl() {
  if (
    msg.toLowerCase() === "easy" ||
    msg.toLowerCase() === "normal" ||
    msg.toLowerCase() === "hard"
  ) {
    lvlNameSpan.textContent = msg;
    secondsSpan.textContent = lvls[msg];
    timeLeftSpan.textContent = lvls[msg];
  } else {
    lvlNameSpan.textContent = defaultLevelName;
    secondsSpan.textContent = defaultLevelSeconds;
    timeLeftSpan.textContent = defaultLevelSeconds;
  }
}
// choose levels words
const levelWords = getWordsForLevel(msg);

function genWords() {
  // Get random word from array
  const randomWord = levelWords[Math.floor(Math.random() * levelWords.length)];
  const wordIndex = levelWords.indexOf(randomWord);
  levelWords.splice(wordIndex, 1);
  theWord.textContent = randomWord;
  scoreTotal.textContent = levelWords.length;

  // Clear upcoming words
  upcomingWords.innerHTML = "";

  // Generate words
  levelWords.forEach((word) => {
    const div = document.createElement("div");
    div.textContent = word;
    upcomingWords.appendChild(div);
  });

  startPlay();
}

let firstwordbonus = 3;

function startPlay() {
  timeLeftSpan.textContent = lvls[msg] + firstwordbonus;
  let timer = setInterval(() => {
    timeLeftSpan.textContent--;
    if (timeLeftSpan.textContent === "0") {
      clearInterval(timer);
      if (theWord.textContent.toLowerCase() === input.value.toLowerCase()) {
        input.value = "";
        scoreGot.textContent++;
        if (levelWords.length > 0) {
          genWords();
        } else {
          congratsPopup();
          let yourscore = JSON.stringify(scoreGot.textContent);
          let date = new Date();
          let yourdate = JSON.stringify(date);
          localStorage.setItem("Date", yourdate);
          localStorage.setItem("Your score", yourscore);
        }
      } else {
        gameOver();
        endgamesound.play();
      }
    }
    firstwordbonus = 0;
  }, 1000);
}

function congratsPopup() {
  const popup = document.querySelector(".congrats-popup");
  popup.style.display = "block";
  const congratsMessage = document.getElementById("congrats-message");
  congratsMessage.textContent = `Congratulations, You won!`;
  SuccessSound.play();

  // Save score and date to localStorage
  const score = parseInt(scoreGot.textContent);
  const dateString = getFormattedDate();
  saveToLocalStorage(score, dateString, "win");
}

function gameOver() {
  const gameOverPopup = document.querySelector(".game-over-popup");
  gameOverPopup.style.display = "block";
  const gameOverMessage = document.getElementById("game-over-message");
  gameOverMessage.textContent = "Sorry, you lose!";

  // Save score and date to localStorage
  const score = parseInt(scoreGot.textContent);
  const dateString = getFormattedDate();
  saveToLocalStorage(score, dateString, "lose");
}

function saveToLocalStorage(score, dateString, outcome) {
  const storageKey = "typo-score-history";
  const storage = localStorage.getItem(storageKey);
  let scoreHistory = storage ? JSON.parse(storage) : [];

  const newScoreEntry = {
    score,
    date: dateString,
    outcome,
  };

  scoreHistory.push(newScoreEntry);

  localStorage.setItem(storageKey, JSON.stringify(scoreHistory));
}

function getFormattedDate() {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  return `${year}-${padZero(month)}-${padZero(day)} ${padZero(hour)}:${padZero(
    minute
  )}:${padZero(second)}`;
}

function padZero(number) {
  return (number < 10 ? "0" : "") + number;
}

fetch("./Words.json")
  .then((response) => response.json())
  .then((words) => {
    localStorage.setItem("words", JSON.stringify(words));
  });

function getWordsForLevel(level) {
  const wordsJson = JSON.parse(localStorage.getItem("words"));
  return wordsJson[level];
}

// Add event listener to play again button
document.getElementById("play-again-button").addEventListener("click", () => {
  window.location.reload();
});
document.getElementById("play-again").addEventListener("click", () => {
  window.location.reload();
});
