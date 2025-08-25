(() => { 
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const dobInput = document.getElementById("dob");
  const lifespanInput = document.getElementById("lifespan");
  const ageSlider = document.getElementById("age");
  const useDOBBtn = document.getElementById("useDOB");
  const yearsLived = document.getElementById("yearsLived");
  const yearsLeft = document.getElementById("yearsLeft");
  const progressText = document.getElementById("progressText");
  const meterFill = document.getElementById("meterFill");

  const sandGradA = "#d4a74f";
  const sandGradB = "#b67d2a";

  const MS_PER_YEAR = 365.2425 * 24 * 60 * 60 * 1000;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp  = (a, b, t) => a + (b - a) * t;

  const W = canvas.width, H = canvas.height;
  const rimTop = 160, neckY = H * 0.5, rimBottom = H - 160;
  const rimLeft = W * 0.25, rimRight = W * 0.75;
  const neckHalf = 10;

  const ctrlTopY = H * 0.22, ctrlBottomY = H * 0.78;
  const leftCtrlX  = W * 0.15, rightCtrlX = W * 0.85;

  function cubicAt(p0, p1, p2, p3, t) {
    const u = 1 - t;
    return u*u*u*p0 + 3*u*u*t*p1 + 3*u*t*t*p2 + t*t*t*p3;
  }
  function solveCubicT(y, y0, y1, y2, y3) {
    let t = clamp((y - y0) / (y3 - y0), 0, 1);
    for (let i = 0; i < 8; i++) {
      const u = 1 - t;
      const yt = u*u*u*y0 + 3*u*u*t*y1 + 3*u*t*t*y2 + t*t*t*y3;
      const dyt = -3*u*u*y0 + (3*u*u - 6*u*t)*y1 + (6*u*t - 3*t*t)*y2 + 3*t*t*y3;
      const step = (yt - y) / (Math.abs(dyt) < 1e-6 ? 1e-6 : dyt);
      t = clamp(t - step, 0, 1);
    }
    return t;
  }

  function leftWallX(y) {
    const t = y <= neckY
      ? solveCubicT(y, rimTop, ctrlTopY, neckY, neckY)
      : solveCubicT(y, neckY, ctrlBottomY, rimBottom, rimBottom);
    return y <= neckY
      ? cubicAt(rimLeft, leftCtrlX, W/2 - neckHalf, W/2 - neckHalf, t)
      : cubicAt(W/2 - neckHalf, leftCtrlX, rimLeft, rimLeft, t);
  }
  function rightWallX(y) {
    const t = y <= neckY
      ? solveCubicT(y, rimTop, ctrlTopY, neckY, neckY)
      : solveCubicT(y, neckY, ctrlBottomY, rimBottom, rimBottom);
    return y <= neckY
      ? cubicAt(rimRight, rightCtrlX, W/2 + neckHalf, W/2 + neckHalf, t)
      : cubicAt(W/2 + neckHalf, rightCtrlX, rimRight, rimRight, t);
  }

  // Frame
  function drawFrame() {
    ctx.save();
    ctx.lineWidth = 4;
    ctx.lineCap = "round";

    const glassGrad = ctx.createLinearGradient(0, rimTop, W, rimBottom);
    glassGrad.addColorStop(0, "rgba(255,255,255,0.20)");
    glassGrad.addColorStop(0.5, "rgba(255,255,255,0.05)");
    glassGrad.addColorStop(1, "rgba(255,255,255,0.20)");

    ctx.beginPath();
    ctx.moveTo(rimLeft, rimTop);
    ctx.bezierCurveTo(leftCtrlX, ctrlTopY, W/2 - neckHalf, neckY, W/2 - neckHalf, neckY);
    ctx.bezierCurveTo(leftCtrlX, ctrlBottomY, rimLeft, rimBottom, rimLeft, rimBottom);
    ctx.strokeStyle = glassGrad; ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(rimRight, rimTop);
    ctx.bezierCurveTo(rightCtrlX, ctrlTopY, W/2 + neckHalf, neckY, W/2 + neckHalf, neckY);
    ctx.bezierCurveTo(rightCtrlX, ctrlBottomY, rimRight, rimBottom, rimRight, rimBottom);
    ctx.strokeStyle = glassGrad; ctx.stroke();

    ctx.restore();
  }

  // Clipping paths
  function clipTopBulb() {
    ctx.beginPath();
    ctx.moveTo(rimLeft, rimTop);
    ctx.bezierCurveTo(leftCtrlX, ctrlTopY, W/2 - neckHalf, neckY, W/2 + neckHalf, neckY);
    ctx.bezierCurveTo(rightCtrlX, ctrlTopY, rimRight, rimTop, rimRight, rimTop);
    ctx.closePath();
    ctx.clip();
  }
  function clipBottomBulb() {
    ctx.beginPath();
    ctx.moveTo(rimLeft, rimBottom);
    ctx.bezierCurveTo(leftCtrlX, ctrlBottomY, W/2 - neckHalf, neckY, W/2 + neckHalf, neckY);
    ctx.bezierCurveTo(rightCtrlX, ctrlBottomY, rimRight, rimBottom, rimRight, rimBottom);
    ctx.closePath();
    ctx.clip();
  }

  const WALL_MARGIN = 0.1; // tighter fit (almost flush with glass)

  

// --- Top Sand 
function drawTopSand(progress) {
  const remaining = 1 - progress;
  if (remaining <= 0) return null;

  // Sand depth in top bulb
  const sandHeight = (rimTop - neckY) * remaining;
  const surfaceY = neckY + sandHeight;

  ctx.save();
  clipTopBulb();

  const shade = ctx.createLinearGradient(W/2, neckY, W/2, surfaceY);
  shade.addColorStop(0, sandGradA);
  shade.addColorStop(1, sandGradB);
  ctx.fillStyle = shade;

  ctx.beginPath();

  // Start left wall at neck
  ctx.moveTo(leftWallX(neckY), neckY);

  // Up along left wall
  ctx.lineTo(leftWallX(surfaceY), surfaceY);

  // Across sand surface (cubic ensures exact endpoints at walls)
  ctx.bezierCurveTo(
    W/2 - 20, surfaceY + 10 * remaining, // left sag control
    W/2 + 20, surfaceY + 10 * remaining, // right sag control
    rightWallX(surfaceY), surfaceY       // end at right wall
  );

  // Down right wall to neck
  ctx.lineTo(rightWallX(neckY), neckY);

  ctx.closePath();
  ctx.fill();
  ctx.restore();

  return surfaceY;
}

  // --- Bottom Sand ---
  function drawBottomSand(progress) {
    const grow = clamp(progress, 0, 1);
    const maxHeight = (rimBottom - neckY) - 32;
    const pileHeight = grow * maxHeight;
    if (pileHeight <= 0) return neckY;

    const baseY = rimBottom;
    const tipY  = rimBottom - pileHeight;

    ctx.save();
    clipBottomBulb();

    const shade = ctx.createLinearGradient(W/2, tipY, W/2, baseY);
    shade.addColorStop(0, sandGradA);
    shade.addColorStop(1, sandGradB);
    ctx.fillStyle = shade;

    const step = 3.5;
    const easePow = 1.3;

    const leftBase  = leftWallX(baseY)  + WALL_MARGIN;
    const rightBase = rightWallX(baseY) - WALL_MARGIN;

    ctx.beginPath();
    ctx.moveTo(leftBase, baseY);
    ctx.lineTo(rightBase, baseY);

    for (let y = baseY - step; y >= tipY; y -= step) {
      const span = (rightWallX(y) - leftWallX(y)) - 2 * WALL_MARGIN;
      const t = (y - tipY) / (baseY - tipY);
      const half = Math.max(2, Math.pow(t, easePow) * span * 0.5);
      ctx.lineTo(Math.min(W/2 + half, rightWallX(y) - WALL_MARGIN), y);
    }

    ctx.lineTo(W/2, tipY);

    for (let y = tipY; y <= baseY - step; y += step) {
      const span = (rightWallX(y) - leftWallX(y)) - 2 * WALL_MARGIN;
      const t = (y - tipY) / (baseY - tipY);
      const half = Math.max(2, Math.pow(t, easePow) * span * 0.5);
      ctx.lineTo(Math.max(W/2 - half, leftWallX(y) + WALL_MARGIN), y);
    }

    ctx.lineTo(leftBase, baseY);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    return tipY;
  }

  // --- Stream ---
  const particles = [];
  function drawStream(topLevelY, bottomTipY, progress) {
    if (progress <= 0 || progress >= 1 || !topLevelY || !bottomTipY) return;

    const t = performance.now() * 0.002;
    const wiggle = Math.sin(t * 3.2) * 0.8 + Math.sin(t * 1.6) * 0.4;

    const topX = W/2 + wiggle;
    const botX = W/2 + wiggle * 0.3;
    const topW = 2.0, botW = 3.5;

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(topX - topW * 0.5, topLevelY + 1);
    ctx.lineTo(topX + topW * 0.5, topLevelY + 1);
    ctx.lineTo(botX + botW * 0.5, bottomTipY - 1);
    ctx.lineTo(botX - botW * 0.5, bottomTipY - 1);
    ctx.closePath();

    const g = ctx.createLinearGradient(W/2, topLevelY, W/2, bottomTipY);
    g.addColorStop(0, "rgba(236, 196, 96, 0.85)");
    g.addColorStop(1, "rgba(210, 150, 50, 0.95)");
    ctx.fillStyle = g;
    ctx.fill();
    ctx.restore();

    if (Math.random() < 0.9) {
      const ang = (Math.random() - 0.5) * 0.5;
      particles.push({
        x: botX + (Math.random() - 0.5) * 2,
        y: bottomTipY - 2,
        vx: Math.sin(ang) * (0.6 + Math.random() * 0.4),
        vy: -(0.6 + Math.random() * 0.3),
        life: 22 + (Math.random() * 10)
      });
    }

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.vy += 0.08;
      p.x  += p.vx;
      p.y  += p.vy;
      p.life--;

      ctx.fillStyle = sandGradA;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1, 0, Math.PI * 2);
      ctx.fill();

      if (p.life <= 0 || p.y > rimBottom - 2) particles.splice(i, 1);
    }
  }

  // Progress
  function computeProgress() {
    const lifespan = Math.max(1, Number(lifespanInput.value) || 100);
    let ageYears;
    if (dobInput.value) {
      const dob = new Date(dobInput.value + "T00:00:00");
      ageYears = (Date.now() - dob.getTime()) / MS_PER_YEAR;
      ageSlider.disabled = true;
    } else {
      ageYears = (Number(ageSlider.value) / 100) * lifespan;
      ageSlider.disabled = false;
    }
    ageYears = Math.max(0, ageYears);
    const pct = clamp(ageYears / lifespan, 0, 1);

    yearsLived.textContent = ageYears.toFixed(2) + " years";
    yearsLeft.textContent = Math.max(0, lifespan - ageYears).toFixed(2) + " years";
    progressText.textContent = (pct * 100).toFixed(2) + `% of ${lifespan} years`;
    meterFill.style.width = pct * 100 + "%";

    return pct;
  }

  // Loop
  let animProgress = 0;
  function draw() {
  ctx.clearRect(0, 0, W, H);

  const target = computeProgress();
  animProgress += (target - animProgress) * 0.02;

  const bottomTipY = drawBottomSand(animProgress);
  const topLevelY  = drawTopSand(animProgress);

  // stream should connect top surface → bottom pile
  drawStream(topLevelY || neckY, bottomTipY || neckY, animProgress);

  drawFrame();
  requestAnimationFrame(draw);
}


  dobInput.addEventListener("change", computeProgress);
  lifespanInput.addEventListener("input", computeProgress);
  ageSlider.addEventListener("input", () => { if (!dobInput.value) computeProgress(); });
  useDOBBtn.addEventListener("click", computeProgress);

  computeProgress();
  draw();
})();
