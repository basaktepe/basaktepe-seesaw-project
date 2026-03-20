const seesawCard = document.getElementById("seesaw-card");
const board = document.getElementById("seesaw-board");
const boardWrapper = document.getElementById("seesaw-board-wrapper");
const leftWeightEl = document.getElementById("left-weight");
const rightWeightEl = document.getElementById("right-weight");
const nextWeightEl = document.getElementById("next-weight");
const tiltAngleEl = document.getElementById("tilt-angle");
// Returns the center point of the board 
function getCenter() {
  return board.offsetWidth / 2;
}

// Stores dropped objects: { weight, distance, side }
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

  objects.push({ weight, distance, side });
  createBall(dropPoint, weight, () => {
    tiltBoard();
    updateUI();
  });
}

// Initialize UI with first next weight
nextWeightEl.textContent = nextWeight + " kg";

// Event listener for seesaw card clicks
seesawCard.addEventListener("click", handleSeesawClick);
