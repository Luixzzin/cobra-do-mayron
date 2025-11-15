const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const overlay = document.getElementById("overlay");
const scoreEl = document.getElementById("score");
const levelEl = document.getElementById("level");

// Ajustar tamanho REAL do canvas para o tamanho visual (responsivo)
function adjustCanvas() {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
}
adjustCanvas();
window.addEventListener("resize", adjustCanvas);

const GRID = 25;

let snake, direction, nextDir, food;
let score, level, speed;
let running = false;
let loop;

// Reset geral
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

// Gerar comida
function randomFood() {
  return {
    x: Math.floor(Math.random() * (canvas.width / GRID)),
    y: Math.floor(Math.random() * (canvas.height / GRID))
  };
}

// Loop principal
function tick() {
  if (!running) return;

  direction = nextDir;

  const head = {
    x: snake[0].x + direction.x,
    y: snake[0].y + direction.y
  };

  const maxX = Math.floor(canvas.width / GRID);
  const maxY = Math.floor(canvas.height / GRID);

  // Teletransporte
  head.x = (head.x + maxX) % maxX;
  head.y = (head.y + maxY) % maxY;

  // Colisão com si mesmo
  if (snake.some(seg => seg.x === head.x && seg.y === head.y)) {
    return gameOver();
  }

  snake.unshift(head);

  // Comer fruta
  if (head.x === food.x && head.y === food.y) {
    score += 10;
    scoreEl.textContent = score;

    if (score % 50 === 0) {
      level++;
      levelEl.textContent = level;
      speed++;
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

  // Comida
  ctx.fillStyle = "#ff0066";
  ctx.shadowBlur = 30;
  ctx.shadowColor = "#ff0066";
  ctx.fillRect(food.x * GRID, food.y * GRID, GRID - 2, GRID - 2);

  ctx.shadowBlur = 0;

  // Cobra
  snake.forEach((part, i) => {
    ctx.fillStyle = i === 0 ? "#00ffff" : "#0099bb";
    ctx.shadowBlur = i === 0 ? 25 : 10;
    ctx.shadowColor = "#00eaff";

    ctx.fillRect(part.x * GRID, part.y * GRID, GRID - 2, GRID - 2);
  });

  ctx.shadowBlur = 0;
}

// Game over
function gameOver() {
  running = false;
  clearTimeout(loop);

  overlay.querySelector(".title").textContent = "GAME OVER";
  overlay.querySelector(".sub").textContent = "Pressione ESPAÇO para reiniciar";
  overlay.classList.remove("hidden");
}

// Controles
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
    const d = map[k];
    if (!(d.x === -direction.x && d.y === -direction.y)) {
      nextDir = d;
    }
  }

  if (k === " ") {
    reset();
    tick();
  }
});

// Começa parado na tela inicial esperando ESPAÇO
overlay.classList.remove("hidden");
