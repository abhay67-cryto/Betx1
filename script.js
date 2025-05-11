let balance = 1000;
let multiplier = 1.0;
let crashPoint = 0;
let currentBet = 0;
let gameInterval;
let isPlaying = false;
let planePos = 0;

function startGame() {
  const betInput = document.getElementById("bet");
  currentBet = parseInt(betInput.value);

  if (isPlaying || isNaN(currentBet) || currentBet <= 0 || currentBet > balance) {
    alert("Invalid bet or game in progress.");
    return;
  }

  multiplier = 1.0;
  crashPoint = (Math.random() * 5 + 1).toFixed(2);
  planePos = 0;
  document.getElementById("plane").style.left = '0%';
  balance -= currentBet;
  updateUI();

  document.getElementById("cashoutBtn").disabled = false;
  document.getElementById("startBtn").disabled = true;
  document.getElementById("status").innerText = '';
  isPlaying = true;

  gameInterval = setInterval(() => {
    multiplier = (parseFloat(multiplier) + 0.1).toFixed(2);
    document.getElementById("multiplier").innerText = multiplier;

    planePos += 1.5;
    document.getElementById("plane").style.left = planePos + '%';

    if (multiplier >= crashPoint) {
      clearInterval(gameInterval);
      isPlaying = false;
      document.getElementById("cashoutBtn").disabled = true;
      document.getElementById("startBtn").disabled = false;
      document.getElementById("status").innerText = `Crashed at x${crashPoint}. You lost ₹${currentBet}.`;
    }
  }, 200);
}

function cashOut() {
  clearInterval(gameInterval);
  const winnings = Math.floor(currentBet * multiplier);
  balance += winnings;
  updateUI();
  document.getElementById("status").innerText = `Cashed out at x${multiplier}. Won ₹${winnings}!`;
  document.getElementById("cashoutBtn").disabled = true;
  document.getElementById("startBtn").disabled = false;
  isPlaying = false;
}

function updateUI() {
  document.getElementById("balance").innerText = balance;
}
