// Game configuration and state variables
const GOAL_CANS = 25;        // Total items needed to collect
let currentCans = 0;         // Current number of items collected
let gameActive = false;      // Tracks if game is currently running
let spawnInterval;          // Holds the interval for spawning items
let timer = 30;              // Timer in seconds
let timerInterval;           // Holds the interval for the timer

// Creates the 3x3 game grid where items will appear
function createGrid() {
  const grid = document.querySelector('.game-grid');
  grid.innerHTML = '';
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.className = 'grid-cell';
    // Add the can image to every cell
    const img = document.createElement('img');
    img.src = 'images/yellow-can.png';
    img.alt = 'Yellow Jerry Can';
    img.className = 'jerry-can-img water-can-img';
    img.style.visibility = 'hidden'; // Hide by default
    cell.appendChild(img);
    grid.appendChild(cell);
  }
}

// Ensure the grid is created when the page loads
createGrid();

// Show a can in a random cell, hide all others
function spawnWaterCan() {
  if (!gameActive) return;
  const cells = document.querySelectorAll('.grid-cell');
  // Hide all cans and remove previous click handlers
  cells.forEach(cell => {
    const img = cell.querySelector('.water-can-img');
    img.style.visibility = 'hidden';
    // Remove all previous event listeners by cloning the node
    const newImg = img.cloneNode(true);
    cell.replaceChild(newImg, img);
  });

  // Pick a random cell to show the can
  const randomCell = cells[Math.floor(Math.random() * cells.length)];
  const canImg = randomCell.querySelector('.water-can-img');
  canImg.style.visibility = 'visible';

  // Add click handler
  canImg.onclick = function () {
    if (!gameActive || canImg.style.visibility === 'hidden') return;
    randomCell.classList.add('collected');
    setTimeout(() => randomCell.classList.remove('collected'), 400);
    canImg.style.visibility = 'hidden';
    // Update score
    currentCans++;
    document.getElementById('current-cans').textContent = currentCans;
    document.getElementById('feedback').textContent = "Nice! +1 can";
    if (currentCans >= GOAL_CANS) {
      endGame();
      document.getElementById('feedback').textContent = "Congratulations! You collected enough cans!";
    }
  };
}

function updateTimerDisplay() {
  document.getElementById('timer').textContent = timer;
}

function startTimer() {
  timer = 30;
  updateTimerDisplay();
  timerInterval = setInterval(() => {
    timer--;
    updateTimerDisplay();
    if (timer <= 0) {
      endGame();
    }
  }, 1000);
}

// Initializes and starts a new game
function startGame() {
  if (gameActive) return; // Prevent starting a new game if one is already active
  gameActive = true;
  currentCans = 0;
  document.getElementById('current-cans').textContent = currentCans;
  document.getElementById('feedback').textContent = ""; // Clear feedback
  document.getElementById('achievements').textContent = ""; // Clear achievements
  createGrid(); // Set up the game grid
  spawnInterval = setInterval(spawnWaterCan, 1000); // Spawn water cans every second
  startTimer(); // Start the countdown timer
}

// Ends the game, stopping all actions and showing final messages
function endGame() {
  gameActive = false; // Mark the game as inactive
  clearInterval(spawnInterval); // Stop spawning water cans
  clearInterval(timerInterval); // Stop the timer
  // Optionally, show feedback to the user
  document.getElementById('feedback').textContent = "Time's up! Game over.";
}

// Set up click handler for the start button
document.getElementById('start-game').addEventListener('click', startGame);
