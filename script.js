const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const overlay = document.getElementById("overlay");
const scoreEl = document.getElementById("score");
const levelEl = document.getElementById("level");

canvas.width = 550;
canvas.height = 550;

const GRID = 25;

let snake, direction, nextDir, food;
let score, level, speed;
let running = false;
let loop;

// Reseta tudo
function reset() {
  snake = [{ x: 10, y: 10 }];
  direction = { x: 1, y: 0 };
  nextDir = { x: 1, y: 0 };
  food = randomFood();

  score = 0;
  level = 1;
  speed = 9;

  scoreEl.textContent = score;
  levelEl.textContent = level;

  running = true;
  overlay.classList.add("hidden");
}

// Gera comida
function randomFood() {
  return {
    x: Math.floor(Math.random() * (canvas.width / GRID)),
    y: Math.floor(Math.random() * (canvas.height / GRID))
  };
}

// Game Loop
function tick() {
  if (!running) return;

  direction = nextDir;

  const head = {
    x: snake[0].x + direction.x,
    y: snake[0].y + direction.y
  };

  // teletransporte nas bordas
  head.x = (head.x + canvas.width / GRID) % (canvas.width / GRID);
  head.y = (head.y + canvas.height / GRID) % (canvas.height / GRID);

  // colisão
  if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
    return gameOver();
  }

  snake.unshift(head);

  // comer
  if (head.x === food.x && head.y === food.y) {
    score += 10;
    scoreEl.textContent = score;

    if (score % 50 === 0) {
      level++;
      levelEl.textContent = level;
      speed += 1;
    }

    food = randomFood();
  } else {
    snake.pop();
  }

  draw();

  clearTimeout(loop);
  loop = setTimeout(tick, 1000 / speed);
}

// Desenho
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // comida
  ctx.fillStyle = "#ff0066";
  ctx.shadowBlur = 25;
  ctx.shadowColor = "#ff0066";
  ctx.fillRect(food.x * GRID, food.y * GRID, GRID - 2, GRID - 2);

  ctx.shadowBlur = 0;

  // cobra
  snake.forEach((part, index) => {
    ctx.fillStyle = index === 0 ? "#00eaff" : "#0088aa";
    ctx.shadowBlur = index === 0 ? 25 : 10;
    ctx.shadowColor = "#00eaff";

    ctx.fillRect(part.x * GRID, part.y * GRID, GRID - 2, GRID - 2);
  });

  ctx.shadowBlur = 0;
}

function gameOver() {
  running = false;
  clearTimeout(loop);

  overlay.classList.remove("hidden");
  overlay.querySelector(".title").textContent = "GAME OVER";
}

// controles
window.addEventListener("keydown", (e) => {
  const k = e.key.toLowerCase();

  const map = {
    arrowup: { x: 0, y: -1 },
    w: { x: 0, y: -1 },
    arrowdown: { x: 0, y: 1 },
    s: { x: 0, y: 1 },
    arrowleft: { x: -1, y: 0 },
    a: { x: -1, y: 0 },
    arrowright: { x: 1, y: 0 },
    d: { x: 1, y: 0 }
  };

  if (map[k]) {
    const dir = map[k];

    if (!(dir.x === -direction.x && dir.y === -direction.y)) {
      nextDir = dir;
    }
  }

  if (k === " ") {
    reset();
    tick();
  }
});

// inicia automaticamente
reset();
tick();
