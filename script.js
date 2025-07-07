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
    img.src = 'images/water-can-transparent.png'; // Path to the water can image
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
    // Remove all previous event listeners by replacing with a clone
    const newImg = img.cloneNode(true);
    newImg.style.visibility = 'hidden';
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
      showConfetti();
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

function showConfetti() {
  // Create canvas
  const canvas = document.createElement('canvas');
  canvas.id = 'confetti-canvas';
  canvas.style.position = 'fixed';
  canvas.style.top = 0;
  canvas.style.left = 0;
  canvas.style.pointerEvents = 'none';
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  const confettiCount = 120;
  const confetti = [];

  for (let i = 0; i < confettiCount; i++) {
    confetti.push({
      x: Math.random() * canvas.width,
      y: Math.random() * -canvas.height,
      r: Math.random() * 6 + 4,
      d: Math.random() * confettiCount,
      color: `hsl(${Math.floor(Math.random() * 360)},90%,60%)`,
      tilt: Math.random() * 10 - 10,
      tiltAngleIncremental: (Math.random() * 0.07) + .05,
      tiltAngle: 0
    });
  }

  let angle = 0;
  let tiltAngle = 0;

  function drawConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    angle += 0.01;
    tiltAngle += 0.1;

    for (let i = 0; i < confetti.length; i++) {
      let c = confetti[i];
      c.tiltAngle += c.tiltAngleIncremental;
      c.y += (Math.cos(angle + c.d) + 3 + c.r / 2) / 2;
      c.x += Math.sin(angle);
      c.tilt = Math.sin(c.tiltAngle - (i % 3)) * 15;

      ctx.beginPath();
      ctx.lineWidth = c.r;
      ctx.strokeStyle = c.color;
      ctx.moveTo(c.x + c.tilt + c.r / 3, c.y);
      ctx.lineTo(c.x + c.tilt, c.y + c.tilt + c.r / 5);
      ctx.stroke();
    }
  }

  let animationFrame;
  function animateConfetti() {
    drawConfetti();
    animationFrame = requestAnimationFrame(animateConfetti);
  }
  animateConfetti();

  // Remove confetti after 2.5 seconds
  setTimeout(() => {
    cancelAnimationFrame(animationFrame);
    if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
  }, 2500);
}

// Add this function to reset the game state and UI
function resetGame() {
  gameActive = false;
  clearInterval(spawnInterval);
  clearInterval(timerInterval);
  currentCans = 0;
  timer = 30;
  document.getElementById('current-cans').textContent = currentCans;
  document.getElementById('timer').textContent = timer;
  document.getElementById('feedback').textContent = "";
  document.getElementById('achievements').textContent = "";
  createGrid();
}

// Set up click handler for the start button
document.getElementById('start-game').addEventListener('click', startGame);

// Optionally, add a reset button and handler
// Example: Add this after your start button in index.html
// <button id="reset-game">Reset Game</button>

// Add event listener for reset button
document.getElementById('reset-game')?.addEventListener('click', resetGame);
