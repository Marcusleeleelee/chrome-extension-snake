const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const box = 20; // Size of each grid box
let score = 0;

// Set canvas dimensions
canvas.width = 400; // Ensure divisible by box
canvas.height = 400; // Ensure divisible by box

// Snake and food initialization
let snake = [{ x: 9 * box, y: 10 * box }];
let food = {
  x: Math.floor(Math.random() * (canvas.width / box)) * box,
  y: Math.floor(Math.random() * (canvas.height / box)) * box,
};

// Direction control
let direction = "";
document.addEventListener("keydown", changeDirection);

function changeDirection(event) {
  const key = event.keyCode;
  if (key === 37 && direction !== "RIGHT") direction = "LEFT";
  else if (key === 38 && direction !== "DOWN") direction = "UP";
  else if (key === 39 && direction !== "LEFT") direction = "RIGHT";
  else if (key === 40 && direction !== "UP") direction = "DOWN";
}

// Game loop
function drawGame() {
  // Draw a gradient background
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, "#a8edea");
  gradient.addColorStop(1, "#fed6e3");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw snake with shadow effect
  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? "#333" : "#666";
    ctx.shadowBlur = 10;
    ctx.shadowColor = i === 0 ? "#000" : "#444";
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
    ctx.strokeStyle = "#fff";
    ctx.strokeRect(snake[i].x, snake[i].y, box, box);
  }
  ctx.shadowBlur = 0; // Reset shadow effect

  // Draw food as a glowing circle
  ctx.beginPath();
  ctx.arc(food.x + box / 2, food.y + box / 2, box / 2, 0, Math.PI * 2);
  ctx.fillStyle = "red";
  ctx.shadowBlur = 15;
  ctx.shadowColor = "red";
  ctx.fill();
  ctx.closePath();
  ctx.shadowBlur = 0; // Reset shadow effect

  // Move snake
  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  if (direction === "LEFT") snakeX -= box;
  if (direction === "UP") snakeY -= box;
  if (direction === "RIGHT") snakeX += box;
  if (direction === "DOWN") snakeY += box;

  // Check if snake eats food
  if (snakeX === food.x && snakeY === food.y) {
    score++;
    document.getElementById("score").innerText = `Score: ${score}`;
    food = {
      x: Math.floor(Math.random() * (canvas.width / box)) * box,
      y: Math.floor(Math.random() * (canvas.height / box)) * box,
    };
  } else {
    snake.pop(); // Remove tail
  }

  // Add new head
  let newHead = { x: snakeX, y: snakeY };
  snake.unshift(newHead);

  // Check collision
  if (
    snakeX < 0 ||
    snakeY < 0 ||
    snakeX >= canvas.width ||
    snakeY >= canvas.height ||
    collision(newHead, snake)
  ) {
    clearInterval(game);
    alert("Game Over! Your Score: " + score);
    location.reload();
  }
}

// Check if the snake collides with itself
function collision(head, array) {
  for (let i = 1; i < array.length; i++) {
    if (head.x === array[i].x && head.y === array[i].y) {
      return true;
    }
  }
  return false;
}

// Run game loop every 100ms
let game = setInterval(drawGame, 100);
