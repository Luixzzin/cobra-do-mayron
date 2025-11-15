// snake-animation/animation.js
// ----------------------------
// Responsável SOMENTE por animar a cobra visualmente no canvas

export function drawSnake(ctx, snake, grid) {
    snake.forEach((seg, i) => {
        const x = seg.x * grid;
        const y = seg.y * grid;

        // animação de brilho (pulsação leve)
        const pulse = 0.5 + Math.sin(Date.now() / 200) * 0.5;

        ctx.fillStyle = i === 0 
            ? `rgba(0, 255, 180, 1)`            // cabeça
            : `rgba(0, 200, 255, ${pulse})`;    // corpo animado

        ctx.fillRect(x, y, grid, grid);

        // bordas arredondadas / glow suave
        ctx.strokeStyle = "rgba(0,255,255,0.4)";
        ctx.lineWidth = 2;
        ctx.strokeRect(x + 1, y + 1, grid - 2, grid - 2);

        // destaca a cabeça
        if (i === 0) {
            ctx.strokeStyle = "rgba(0,255,180,0.8)";
            ctx.lineWidth = 3;
            ctx.strokeRect(x, y, grid, grid);
        }
    });
}
