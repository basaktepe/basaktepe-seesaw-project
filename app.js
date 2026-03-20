const seesawCard = document.getElementById("seesaw-card");
const board = document.getElementById("seesaw-board");
const boardWrapper = document.getElementById("seesaw-board-wrapper");
// Returns the center point of the board 
function getCenter() {
  return board.offsetWidth / 2;
}

// Stores dropped objects: { weight, distance, side }
const objects = [];

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

// Creates a ball element that falls from the top of the seesaw area to the board
function createBall(dropPoint, weight) {
  const seesaw = document.getElementById("seesaw");
  const ball = document.createElement("div");
  const size = 18 + weight * 4;
  const wrapperBottom = 50;
  const boardHeight = 14;
  const landingBottom = wrapperBottom + boardHeight;

  ball.className = "seesaw-ball";
  ball.textContent = weight;
  ball.style.width = size + "px";
  ball.style.height = size + "px";
  ball.style.backgroundColor = getColorByWeight(weight);
  ball.style.left = dropPoint - size / 2 + "px";
  ball.style.bottom = seesaw.offsetHeight + "px";

  seesaw.appendChild(ball);

  requestAnimationFrame(() => {
    ball.style.bottom = landingBottom + "px";
  });
}


function handleSeesawClick(e) {
  const boardRect = board.getBoundingClientRect();
  const center = getCenter();
  const dropPoint = Math.max(0, Math.min(board.offsetWidth, e.clientX - boardRect.left));
  const distance = Math.round(Math.abs(dropPoint - center));
  const side = dropPoint < center ? "left" : "right";
  const weight = generateWeight();

  objects.push({ weight, distance, side });
  createBall(dropPoint, weight);
  tiltBoard();
}

// Event listener for seesaw card clicks
seesawCard.addEventListener("click", handleSeesawClick);
