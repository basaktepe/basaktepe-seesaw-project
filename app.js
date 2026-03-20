const seesawCard = document.getElementById("seesaw-card");
const board = document.getElementById("seesaw-board");
const boardWrapper = document.getElementById("seesaw-board-wrapper");
const leftWeightEl = document.getElementById("left-weight");
const rightWeightEl = document.getElementById("right-weight");
const nextWeightEl = document.getElementById("next-weight");
const tiltAngleEl = document.getElementById("tilt-angle");
const resetBtn = document.getElementById("reset-btn");
const logList = document.getElementById("activity-list");
// Returns the center point of the board
function getCenter() {
  return board.offsetWidth / 2;
}

const STORAGE_KEY = "seesawState";

// Stores dropped objects: { weight, distance, side, dropPoint }
const objects = [];
let nextWeight = generateWeight();

// Returns a color based on weight: light=blue, medium=purple, heavy=red
function getColorByWeight(weight) {
  return weight <= 3 ? "rgb(59, 130, 246)"
       : weight <= 6 ? "rgb(147, 51, 234)"
       : "rgb(239, 68, 68)";
}

// Generates a random weight between 1 and 10
function generateWeight() {
  return Math.floor(Math.random() * 10) + 1;
}

// Calculates torque for each side and returns the tilt angle (capped at ±30°)
function calculateAngle() {
  let leftTorque = 0;
  let rightTorque = 0;

  objects.forEach((obj) => {
    if (obj.side === "left") {
      leftTorque += obj.weight * obj.distance;
    } else {
      rightTorque += obj.weight * obj.distance;
    }
  });

  return Math.max(-30, Math.min(30, (rightTorque - leftTorque) / 10));
}

// Applies the tilt angle to the board wrapper
function tiltBoard() {
  const angle = calculateAngle();
  boardWrapper.style.transform = `rotate(${angle}deg)`;
}

// Updates the info panel with current state
function updateUI() {
  const angle = calculateAngle();
  const leftTotal = objects
    .filter((obj) => obj.side === "left")
    .reduce((sum, obj) => sum + obj.weight, 0);

  const rightTotal = objects
    .filter((obj) => obj.side === "right")
    .reduce((sum, obj) => sum + obj.weight, 0);

  leftWeightEl.textContent = leftTotal + " kg";
  rightWeightEl.textContent = rightTotal + " kg";
  tiltAngleEl.textContent = angle.toFixed(1) + "°";
  nextWeightEl.textContent = nextWeight + " kg";
}

// Saves current state to localStorage
function saveState() {
  const state = { objects, nextWeight };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

// Loads saved state from localStorage and restores balls on the board
function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return;

  const state = JSON.parse(saved);
  state.objects.forEach((obj) => objects.push(obj));
  nextWeight = state.nextWeight;

  objects.forEach((obj) => {
    placeBall(obj.dropPoint, obj.weight);
    addLog(obj.weight, obj.side, obj.distance);
  });
  tiltBoard();
  updateUI();
}

// Places a ball directly on the board without animation
function placeBall(dropPoint, weight) {
  const ball = document.createElement("div");
  const size = 18 + weight * 4;
  const boardHeight = 14;

  ball.className = "seesaw-ball";
  ball.textContent = weight;
  ball.style.width = size + "px";
  ball.style.height = size + "px";
  ball.style.backgroundColor = getColorByWeight(weight);
  ball.style.left = dropPoint - size / 2 + "px";
  ball.style.bottom = boardHeight + "px";

  boardWrapper.appendChild(ball);
}

// Creates a ball element that falls from the top to the board, calls onLand when it arrives
function createBall(dropPoint, weight, onLand) {
  const ball = document.createElement("div");
  const size = 18 + weight * 4;
  const boardHeight = 14;
  const wrapperHeight = boardWrapper.offsetHeight;

  ball.className = "seesaw-ball";
  ball.textContent = weight;
  ball.style.width = size + "px";
  ball.style.height = size + "px";
  ball.style.backgroundColor = getColorByWeight(weight);
  ball.style.left = dropPoint - size / 2 + "px";
  ball.style.bottom = wrapperHeight + "px";

  ball.addEventListener("transitionend", () => onLand(), { once: true });

  boardWrapper.appendChild(ball);

  requestAnimationFrame(() => {
    ball.style.bottom = boardHeight + "px";
  });
}

function handleSeesawClick(e) {
  const boardRect = board.getBoundingClientRect();
  const center = getCenter();
  const dropPoint = Math.max(0, Math.min(board.offsetWidth, e.clientX - boardRect.left));
  const distance = Math.round(Math.abs(dropPoint - center));
  const side = dropPoint < center ? "left" : "right";
  const weight = nextWeight;
  nextWeight = generateWeight();

  objects.push({ weight, distance, side, dropPoint });
  createBall(dropPoint, weight, () => {
    addLog(weight, side, distance);
    tiltBoard();
    updateUI();
    saveState();
  });
}

// Activity log entry
function addLog(weight, side, distance) {
  const li = document.createElement("li");
  li.textContent = `${weight}kg dropped on ${side} side at ${distance}px from center`;
  logList.prepend(li);
}

// Clears all objects, resets board and UI, removes balls from DOM
function handleReset() {
  objects.length = 0;
  nextWeight = generateWeight();

  document.querySelectorAll(".seesaw-ball").forEach((ball) => ball.remove());
  logList.innerHTML = "";

  boardWrapper.style.transform = "rotate(0deg)";
  saveState();
  updateUI();
}

//  Distance grid
function renderGrid() {
  const center = getCenter();
  const step = 50;

  for (let offset = step; offset <= center; offset += step) {
    [center - offset, center + offset].forEach((pos) => {
      const tick = document.createElement("div");
      tick.className = "grid-tick";
      tick.style.left = pos + "px";
      board.appendChild(tick);

      const label = document.createElement("div");
      label.className = "grid-label";
      label.style.left = pos + "px";
      label.textContent = offset;
      board.appendChild(label);
    });
  }
}

// Restore previous state or start fresh
renderGrid();
loadState();
nextWeightEl.textContent = nextWeight + " kg";

// Event listeners
seesawCard.addEventListener("click", handleSeesawClick);
resetBtn.addEventListener("click", handleReset);
