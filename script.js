// Memory game logic

// Character definitions
const characters = [
  { name: 'heart_mouse', src: 'char1_heart_mouse.png' },
  { name: 'star_mouse', src: 'char2_star_mouse.png' },
  { name: 'exclaim_mouse', src: 'char3_exclaim_mouse.png' },
  { name: 'viking_dog', src: 'char4_viking_dog.png' },
  { name: 'cat_turquoise', src: 'char5_cat_turquoise.png' },
  { name: 'dog_exclaim', src: 'char6_dog_exclaim.png' },
  { name: 'curly_dog', src: 'char7_curly_dog.png' },
  { name: 'chain_dog', src: 'char8_chain_dog.png' },
  { name: 'brain_dog', src: 'char9_brain_dog.png' }
];

// Duplicate and shuffle cards
function prepareCards() {
  // Duplicate each character to create pairs
  const cardSet = characters.concat(characters);
  // Shuffle array using Fisher–Yates algorithm
  for (let i = cardSet.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cardSet[i], cardSet[j]] = [cardSet[j], cardSet[i]];
  }
  return cardSet;
}

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matches = 0;
let timerInterval = null;
let startTime = null;

function startTimer() {
  startTime = Date.now();
  timerInterval = setInterval(() => {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    document.getElementById('timer').textContent = `Time: ${elapsed}s`;
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}

function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  // Start timer on first move
  if (!startTime) {
    startTimer();
  }

  this.classList.add('flipped');

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  lockBoard = true;

  checkForMatch();
}

function checkForMatch() {
  const isMatch = firstCard.dataset.name === secondCard.dataset.name;
  if (isMatch) {
    disableCards();
    matches++;
    if (matches === characters.length) {
      endGame();
    }
  } else {
    unflipCards();
  }
}

function disableCards() {
  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);
  resetBoard();
}

function unflipCards() {
  setTimeout(() => {
    firstCard.classList.remove('flipped');
    secondCard.classList.remove('flipped');
    resetBoard();
  }, 1000);
}

function resetBoard() {
  [firstCard, secondCard] = [null, null];
  lockBoard = false;
}

function endGame() {
  stopTimer();
  const elapsed = Math.floor((Date.now() - startTime) / 1000);
  const congratsEl = document.getElementById('congrats');
  const finalTime = document.getElementById('final-time');
  finalTime.textContent = `用时: ${elapsed}秒`;
  congratsEl.classList.remove('hidden');
}

function createBoard() {
  const board = document.getElementById('game-board');
  const cards = prepareCards();

  cards.forEach((cardData) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.name = cardData.name;

    const inner = document.createElement('div');
    inner.classList.add('card-inner');

    // Front face with paw print icon
    const front = document.createElement('div');
    front.classList.add('card-face', 'card-front');
    front.textContent = '🐾';

    // Back face with image
    const back = document.createElement('div');
    back.classList.add('card-face', 'card-back');
    const img = document.createElement('img');
    img.src = cardData.src;
    img.alt = cardData.name;
    back.appendChild(img);

    inner.appendChild(front);
    inner.appendChild(back);
    card.appendChild(inner);

    // Listen for click events on desktop browsers
    card.addEventListener('click', flipCard);
    // Listen for touchstart on touch devices (e.g. iPad/iPhone)
    card.addEventListener('touchstart', function (e) {
      // Prevent the simulated mouse events that follow a touch
      e.preventDefault();
      flipCard.call(card);
    });
    board.appendChild(card);
  });
}

// Initialize game when DOM is ready
window.addEventListener('DOMContentLoaded', () => {
  createBoard();
});
