(() => {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const dobInput = document.getElementById("dob");
  const lifespanInput = document.getElementById("lifespan");
  const ageSlider = document.getElementById("age");
  const useDOBBtn = document.getElementById("useDOB");
  const exactAge = document.getElementById("exactAge");
  const yearsLived = document.getElementById("yearsLived");
  const yearsLeft = document.getElementById("yearsLeft");
  const progressText = document.getElementById("progressText");
  const meterFill = document.getElementById("meterFill");

  const sandGradA = "#d4a74f";
  const sandGradB = "#b67d2a";

  const MS_PER_YEAR = 365.2425 * 24 * 60 * 60 * 1000;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;

  const W = canvas.width, H = canvas.height;
  const rimTop = 160, neckY = H * 0.5, rimBottom = H - 160;
  const rimLeft = W * 0.25, rimRight = W * 0.75;
  const neckHalf = 10;
  const ctrlTopY = H * 0.28, ctrlBottomY = H * 0.72;

  // Quadratic helpers
  function quadAt(p0, p1, p2, t) {
    return (1 - t) * (1 - t) * p0 + 2 * (1 - t) * t * p1 + t * t * p2;
  }
  function solveTForY(y, y0, y1, y2) {
    const A = y0 - 2 * y1 + y2, B = 2 * (y1 - y0), C = y0 - y;
    if (Math.abs(A) < 1e-6) return clamp(-C / B, 0, 1);
    const disc = B * B - 4 * A * C;
    const t1 = (-B + Math.sqrt(Math.max(0, disc))) / (2 * A);
    const t2 = (-B - Math.sqrt(Math.max(0, disc))) / (2 * A);
    const c = [t1, t2].filter((t) => t >= 0 && t <= 1);
    return c.length ? c[0] : clamp(t1, 0, 1);
  }
  function leftWallX(y) {
    const t = y <= neckY
      ? solveTForY(y, rimTop, ctrlTopY, neckY)
      : solveTForY(y, neckY, ctrlBottomY, rimBottom);
    return y <= neckY
      ? quadAt(rimLeft, W * 0.35, W / 2 - neckHalf, t)
      : quadAt(W / 2 - neckHalf, W * 0.35, rimLeft, t);
  }
  function rightWallX(y) {
    const t = y <= neckY
      ? solveTForY(y, rimTop, ctrlTopY, neckY)
      : solveTForY(y, neckY, ctrlBottomY, rimBottom);
    return y <= neckY
      ? quadAt(rimRight, W * 0.65, W / 2 + neckHalf, t)
      : quadAt(W / 2 + neckHalf, W * 0.65, rimRight, t);
  }

  // Glass frame
  function drawFrame() {
    ctx.save();
    ctx.lineWidth = 4;
    ctx.lineCap = "round";

    const glassGrad = ctx.createLinearGradient(0, rimTop, W, rimBottom);
    glassGrad.addColorStop(0, "rgba(255,255,255,0.2)");
    glassGrad.addColorStop(0.5, "rgba(255,255,255,0.05)");
    glassGrad.addColorStop(1, "rgba(255,255,255,0.2)");

    // Left side
    ctx.beginPath();
    ctx.moveTo(rimLeft, rimTop);
    ctx.quadraticCurveTo(W * 0.35, ctrlTopY, W / 2 - neckHalf, neckY);
    ctx.quadraticCurveTo(W * 0.35, ctrlBottomY, rimLeft, rimBottom);
    ctx.strokeStyle = glassGrad;
    ctx.stroke();

    // Right side
    ctx.beginPath();
    ctx.moveTo(rimRight, rimTop);
    ctx.quadraticCurveTo(W * 0.65, ctrlTopY, W / 2 + neckHalf, neckY);
    ctx.quadraticCurveTo(W * 0.65, ctrlBottomY, rimRight, rimBottom);
    ctx.strokeStyle = glassGrad;
    ctx.stroke();

    // Shadow under hourglass
    const shadowGrad = ctx.createRadialGradient(W/2, rimBottom+40, 10, W/2, rimBottom+40, 180);
    shadowGrad.addColorStop(0, "rgba(0,0,0,0.4)");
    shadowGrad.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = shadowGrad;
    ctx.beginPath();
    ctx.ellipse(W/2, rimBottom+40, 120, 25, 0, 0, Math.PI*2);
    ctx.fill();
    ctx.restore();
  }

  // Bulb clipping
  function clipTopBulb() {
    ctx.beginPath();
    ctx.moveTo(rimLeft, rimTop);
    ctx.quadraticCurveTo(W * 0.35, ctrlTopY, W / 2 - neckHalf, neckY);
    ctx.lineTo(W / 2 + neckHalf, neckY);
    ctx.quadraticCurveTo(W * 0.65, ctrlTopY, rimRight, rimTop);
    ctx.closePath();
    ctx.clip();
  }
  function clipBottomBulb() {
    ctx.beginPath();
    ctx.moveTo(rimLeft, rimBottom);
    ctx.quadraticCurveTo(W * 0.35, ctrlBottomY, W / 2 - neckHalf, neckY);
    ctx.lineTo(W / 2 + neckHalf, neckY);
    ctx.quadraticCurveTo(W * 0.65, ctrlBottomY, rimRight, rimBottom);
    ctx.closePath();
    ctx.clip();
  }

    
  // Top sand
// Top sand with gravity bowl effect
function drawTopSand(progress) {
  const remaining = 1 - progress;
  if (remaining <= 0) return;

  const levelY = lerp(neckY, rimTop, remaining);

  ctx.save();
  clipTopBulb();

  const left = leftWallX(levelY);
  const right = rightWallX(levelY);
  const midX = (left + right) / 2;

  // Dip increases as sand drains
  const dip = lerp(5, 40, 1 - remaining); 
  const surfaceDipY = levelY + dip;

  // Gradient
  const sandShade = ctx.createLinearGradient(0, levelY, 0, neckY);
  sandShade.addColorStop(0, sandGradA);
  sandShade.addColorStop(1, sandGradB);
  ctx.fillStyle = sandShade;

  ctx.beginPath();
  ctx.moveTo(left, levelY);
  ctx.quadraticCurveTo(midX, surfaceDipY, right, levelY); // bowl surface
  ctx.lineTo(W / 2 + 2, neckY);
  ctx.lineTo(W / 2 - 2, neckY);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
  return levelY;
}


// Bottom sand with conical heap effect
function drawBottomSand(progress) {
  const maxHeight = rimBottom - neckY - 30;
  const pileHeight = progress * maxHeight;
  if (pileHeight <= 0) return neckY;

  ctx.save();
  clipBottomBulb();

  const pileTipY = rimBottom - pileHeight;
  const baseY = rimBottom;

  // Spread widens with pile height
  const spread = lerp(20, 80, progress); 
  const leftBase = W / 2 - spread / 2;
  const rightBase = W / 2 + spread / 2;

  // Gradient
  const sandShade = ctx.createLinearGradient(W / 2, pileTipY, W / 2, baseY);
  sandShade.addColorStop(0, sandGradA);
  sandShade.addColorStop(1, sandGradB);
  ctx.fillStyle = sandShade;

  ctx.beginPath();
  ctx.moveTo(leftBase, baseY);
  ctx.quadraticCurveTo(W / 2, pileTipY, rightBase, baseY); // rounded cone
  ctx.closePath();
  ctx.fill();

  ctx.restore();
  return pileTipY;
}





  // Bottom sand (cone pile)
  function drawBottomSand(progress) {
    const pileHeight = progress * (rimBottom - neckY - 30);
    if (pileHeight <= 0) return neckY;

    ctx.save();
    clipBottomBulb();

    const pileTipY = rimBottom - pileHeight;
    const baseY = rimBottom;

    const leftBase = leftWallX(baseY);
    const rightBase = rightWallX(baseY);

    const sandShade = ctx.createLinearGradient(W/2, pileTipY, W/2, baseY);
    sandShade.addColorStop(0, sandGradA);
    sandShade.addColorStop(1, sandGradB);
    ctx.fillStyle = sandShade;

    ctx.beginPath();
    ctx.moveTo(leftBase, baseY);
    ctx.lineTo(W/2, pileTipY);
    ctx.lineTo(rightBase, baseY);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
    return pileTipY;
  }

  // Falling stream + particles
  const particles = [];
function drawStream(topLevelY, bottomLevelY) {
  ctx.save();
  ctx.strokeStyle = sandGradA;
  ctx.lineWidth = 2;

  // Start & end near neck and pile
  const startY = neckY + 2;
  const endY = bottomLevelY - 2;

  // Draw thin main stream
  ctx.beginPath();
  ctx.moveTo(W / 2, startY);
  ctx.lineTo(W / 2, endY);
  ctx.stroke();
  ctx.restore();

  // Emit random sand granules
  if (Math.random() < 0.7) {
    particles.push({
      x: W / 2 + (Math.random() - 0.5) * 3,  // slight spread
      y: startY,
      vx: (Math.random() - 0.5) * 0.5,       // small side drift
      vy: 2 + Math.random() * 2,             // fall speed
      r: 1 + Math.random() * 1.5,            // grain size
      life: 40
    });
  }

  // Update & draw particles
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.life--;

    ctx.fillStyle = sandGradA;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();

    if (p.life <= 0 || p.y > endY) particles.splice(i, 1);
  }
}



  // Progress & stats
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

    // Update text
    yearsLived.textContent = ageYears.toFixed(2) + " years";
    yearsLeft.textContent = Math.max(0, lifespan - ageYears).toFixed(2) + " years";
    progressText.textContent = (pct * 100).toFixed(2) + `% of ${lifespan} years`;
    meterFill.style.width = pct * 100 + "%";

    return pct;
  }

  // Main loop
  function draw() {
    ctx.clearRect(0, 0, W, H);
    const p = computeProgress();
    const bottomLevelY = drawBottomSand(p);
    const topLevelY = drawTopSand(p);
    drawStream(topLevelY, bottomLevelY);
    drawFrame();
    requestAnimationFrame(draw);
  }

  // Events
  dobInput.addEventListener("change", computeProgress);
  lifespanInput.addEventListener("input", computeProgress);
  ageSlider.addEventListener("input", () => { if (!dobInput.value) computeProgress(); });
  useDOBBtn.addEventListener("click", computeProgress);

  computeProgress();
  draw();
})();
