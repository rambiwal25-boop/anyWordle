const grid = document.getElementById("grid");
const input = document.getElementById("input");
const statusText = document.getElementById("status");

const words = ["apple", "table", "chair", "water", "light"];
let secret = words[Math.floor(Math.random() * words.length)];

let row = 0;
const maxRows = 6;

// 🎯 create grid
for (let i = 0; i < 30; i++) {
  const box = document.createElement("div");
  box.classList.add("box");
  grid.appendChild(box);
}

const boxes = document.querySelectorAll(".box");

// 🧠 check word using Wiktionary
async function isValidWord(word) {
  try {
    const url = `https://en.wiktionary.org/w/api.php?action=query&titles=${word}&format=json&origin=*`;
    const res = await fetch(url);
    const data = await res.json();

    const pages = data.query.pages;
    const pageId = Object.keys(pages)[0];

    return pageId !== "-1"; // valid if page exists
  } catch {
    return false;
  }
}

// 🎯 handle guess
async function submitGuess() {
  const guess = input.value.toLowerCase();

  if (guess.length !== 5) {
    statusText.innerText = "Enter 5-letter word";
    return;
  }

  statusText.innerText = "Checking...";

  const valid = await isValidWord(guess);

  if (!valid) {
    statusText.innerText = "Invalid word!";
    return;
  }

  statusText.innerText = "";

  // 🎨 color logic
  for (let i = 0; i < 5; i++) {
    const box = boxes[row * 5 + i];
    box.innerText = guess[i];

    if (guess[i] === secret[i]) {
      box.classList.add("green");
    } else if (secret.includes(guess[i])) {
      box.classList.add("yellow");
    } else {
      box.classList.add("gray");
    }
  }

  // 🏆 win check
  if (guess === secret) {
    statusText.innerText = "You Win! 🎉";
    return;
  }

  row++;
  input.value = "";

  // ❌ lose check
  if (row === maxRows) {
    statusText.innerText = "Game Over! Word was: " + secret;
  }
}