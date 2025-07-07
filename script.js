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
  grid.innerHTML = ''; // Clear any existing grid cells
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.className = 'grid-cell'; // Each cell represents a grid square
    grid.appendChild(cell);
  }
}

// Ensure the grid is created when the page loads
createGrid();

// Spawns a new item in a random grid cell
function spawnWaterCan() {
  if (!gameActive) return; // Stop if the game is not active
  const cells = document.querySelectorAll('.grid-cell');
  // Clear all cells before spawning a new water can
  cells.forEach(cell => (cell.innerHTML = ''));

  // Select a random cell from the grid to place the water can
  const randomCell = cells[Math.floor(Math.random() * cells.length)];

  // Use a template literal to create the wrapper and water-can element
  randomCell.innerHTML = `
    <div class="water-can-wrapper">
      <div class="water-can"></div>
    </div>
  `;

  // Add click handler for the water can
  const can = randomCell.querySelector('.water-can');
  can.addEventListener('click', function (e) {
    if (!gameActive) return;
    // Visual feedback: animate cell
    randomCell.classList.add('collected');
    setTimeout(() => randomCell.classList.remove('collected'), 400);
    // Remove can after click
    can.style.visibility = 'hidden';
    // Update score
    currentCans++;
    document.getElementById('current-cans').textContent = currentCans;
    // Optional: feedback
    document.getElementById('feedback').textContent = "Nice! +1 can";
    // Check for win
    if (currentCans >= GOAL_CANS) {
      endGame();
      document.getElementById('feedback').textContent = "Congratulations! You collected enough cans!";
    }
  });
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
  createGrid(); // Set up the game grid
  spawnInterval = setInterval(spawnWaterCan, 1000); // Spawn water cans every second
  startTimer(); // Start the countdown timer
  document.getElementById('feedback').textContent = ""; // Clear feedback
}

function endGame() {
  gameActive = false; // Mark the game as inactive
  clearInterval(spawnInterval); // Stop spawning water cans
  clearInterval(timerInterval); // Stop the timer
  // Optionally, show feedback to the user
  document.getElementById('feedback').textContent = "Time's up! Game over.";
}

// Set up click handler for the start button
document.getElementById('start-game').addEventListener('click', startGame);
