const seesawCard = document.getElementById("seesaw-card");
const board = document.getElementById("seesaw-board");
const boardWrapper = document.getElementById("seesaw-board-wrapper");
const BOARD_WIDTH = board.offsetWidth;
const CENTER = BOARD_WIDTH / 2;

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
  const dropPoint = Math.max(0, Math.min(BOARD_WIDTH, e.clientX - boardRect.left));
  const distance = Math.round(Math.abs(dropPoint - CENTER));
  const side = dropPoint < CENTER ? "left" : "right";
  const weight = generateWeight();

  createBall(dropPoint, weight);

  console.log(`Object dropped on the ${side} side, ${distance}px from center, weight: ${weight}kg`);
}

// Event listener for seesaw card clicks
seesawCard.addEventListener("click", handleSeesawClick);
