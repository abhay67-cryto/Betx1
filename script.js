let balance = 1000;
let multiplier = 1.0;
let gameInterval;
let crashPoint;
let isPlaying = false;
let currentBet = 0;

function startGame() {
  const betInput = document.getElementById("bet");
  currentBet = parseInt(betInput.value);

  if (isPlaying || currentBet <= 0 || currentBet > balance) {
    alert("Invalid bet or game already running!");
    return;
  }

  balance -= currentBet;
  updateBalance();
  isPlaying = true;
  multiplier = 1.0;
  crashPoint = (Math.random() * 5 + 1).toFixed(2); // Random crash point
  document.getElementById("cashoutBtn").disabled = false;
  document.getElementById("status").innerText = "";
  updateMultiplier();

  gameInterval = setInterval(() => {
    multiplier = (multiplier + 0.1).toFixed(2);
    updateMultiplier();

    if (multiplier >= crashPoint) {
      clearInterval(gameInterval);
      document.getElementById("cashoutBtn").disabled = true;
      document.getElementById("status").innerText = `Plane crashed at x${crashPoint}. You lost ₹${currentBet}.`;
      isPlaying = false;
    }
  }, 500);
}

function cashOut() {
  clearInterval(gameInterval);
  const winnings = Math.floor(currentBet * multiplier);
  balance += winnings;
  updateBalance();
  document.getElementById("status").innerText = `You cashed out at x${multiplier}. You won ₹${winnings}!`;
  document.getElementById("cashoutBtn").disabled = true;
  isPlaying = false;
}

function updateMultiplier() {
  document.getElementById("multiplier").innerText = multiplier;
}

function updateBalance() {
  document.getElementById("balance").innerText = balance;
}
