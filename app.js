const board = document.getElementById("seesaw-board");
const BOARD_WIDTH = board.offsetWidth;
const CENTER = BOARD_WIDTH / 2;

// Calculates which side was clicked and the distance from center
function handleBoardClick(e) {
  const boardRect = board.getBoundingClientRect();
  const dropPoint = e.clientX - boardRect.left;
  const distance = Math.round(Math.abs(dropPoint - CENTER));
  const side = dropPoint < CENTER ? "left" : "right";

  console.log(`Object dropped on the ${side} side, ${distance}px from center`);
}

// Event listener for board clicks
board.addEventListener("click", handleBoardClick);