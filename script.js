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

  const sandGradA = "#fde047";
  const sandGradB = "#f59e0b";
  const frameStroke =
    getComputedStyle(document.documentElement).getPropertyValue("--frame") ||
    "#cbd5e1";

  const MS_PER_YEAR = 365.2425 * 24 * 60 * 60 * 1000;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;

  const W = canvas.width, H = canvas.height;
  const rimTop = 180, neckY = H * 0.5, rimBottom = H - 180;
  const rimLeft = W * 0.21, rimRight = W * 0.79;
  const neckHalf = 12;
  const ctrlTopY = H * 0.28, ctrlBottomY = H * 0.72;

  // Particle stream
  const particles = [];
  const particleCount = 220;
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: W / 2 + (Math.random() - 0.5) * neckHalf * 2,
      y: rimTop + Math.random() * (neckY - rimTop),
      vy: 1.5 + Math.random() * 2,
      radius: 1 + Math.random() * 0.6,
    });
  }

  // Helpers
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
      ? quadAt(rimLeft, W * 0.32, W / 2 - neckHalf, t)
      : quadAt(W / 2 - neckHalf, W * 0.32, rimLeft, t);
  }
  function rightWallX(y) {
    const t = y <= neckY
      ? solveTForY(y, rimTop, ctrlTopY, neckY)
      : solveTForY(y, neckY, ctrlBottomY, rimBottom);
    return y <= neckY
      ? quadAt(rimRight, W * 0.68, W / 2 + neckHalf, t)
      : quadAt(W / 2 + neckHalf, W * 0.68, rimRight, t);
  }

  // Frame & glass with 3D depth
  function drawFrame() {
    ctx.save();
    ctx.lineWidth = 8;
    ctx.lineCap = "round";

    const glassGrad = ctx.createLinearGradient(0, rimTop, W, rimBottom);
    glassGrad.addColorStop(0, "rgba(255,255,255,0.25)");
    glassGrad.addColorStop(0.5, "rgba(255,255,255,0.05)");
    glassGrad.addColorStop(1, "rgba(255,255,255,0.25)");

    ctx.beginPath();
    ctx.moveTo(rimLeft, rimTop);
    ctx.quadraticCurveTo(W * 0.32, ctrlTopY, W / 2 - neckHalf, neckY);
    ctx.quadraticCurveTo(W * 0.32, ctrlBottomY, rimLeft, rimBottom);
    ctx.strokeStyle = glassGrad;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(rimRight, rimTop);
    ctx.quadraticCurveTo(W * 0.68, ctrlTopY, W / 2 + neckHalf, neckY);
    ctx.quadraticCurveTo(W * 0.68, ctrlBottomY, rimRight, rimBottom);
    ctx.strokeStyle = glassGrad;
    ctx.stroke();
    ctx.restore();

    // Metallic rim
    const frameGrad = ctx.createLinearGradient(0, rimTop, 0, rimBottom);
    frameGrad.addColorStop(0, "#e5e7eb");
    frameGrad.addColorStop(0.5, "#9ca3af");
    frameGrad.addColorStop(1, "#4b5563");

    ctx.save();
    ctx.lineWidth = 14;
    ctx.strokeStyle = frameGrad;
    ctx.beginPath();
    ctx.moveTo(rimLeft - 15, rimTop - 20);
    ctx.lineTo(rimRight + 15, rimTop - 20);
    ctx.moveTo(rimLeft - 15, rimBottom + 20);
    ctx.lineTo(rimRight + 15, rimBottom + 20);
    ctx.stroke();
    ctx.restore();

    // 3D cone gradient for bulbs
    const coneGrad = ctx.createRadialGradient(W/2, neckY, 20, W/2, neckY, W/1.2);
    coneGrad.addColorStop(0, "rgba(255,255,255,0.08)");
    coneGrad.addColorStop(1, "rgba(0,0,0,0.4)");
    ctx.save();
    ctx.globalCompositeOperation = "multiply";
    ctx.fillStyle = coneGrad;
    ctx.fillRect(0, 0, W, H);
    ctx.restore();

    // Drop shadow under hourglass
    const shadowGrad = ctx.createRadialGradient(W/2, rimBottom+40, 10, W/2, rimBottom+40, 180);
    shadowGrad.addColorStop(0, "rgba(0,0,0,0.5)");
    shadowGrad.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = shadowGrad;
    ctx.beginPath();
    ctx.ellipse(W/2, rimBottom+40, 140, 30, 0, 0, Math.PI*2);
    ctx.fill();
  }


    // Bulb clipping
  function clipTopBulb() {
    ctx.beginPath();
    ctx.moveTo(rimLeft, rimTop);
    ctx.quadraticCurveTo(W * 0.32, ctrlTopY, W / 2 - neckHalf, neckY);
    ctx.lineTo(W / 2 + neckHalf, neckY);
    ctx.quadraticCurveTo(W * 0.68, ctrlTopY, rimRight, rimTop);
    ctx.closePath();
    ctx.clip();
  }
  function clipBottomBulb() {
    ctx.beginPath();
    ctx.moveTo(rimLeft, rimBottom);
    ctx.quadraticCurveTo(W * 0.32, ctrlBottomY, W / 2 - neckHalf, neckY);
    ctx.lineTo(W / 2 + neckHalf, neckY);
    ctx.quadraticCurveTo(W * 0.68, ctrlBottomY, rimRight, rimBottom);
    ctx.closePath();
    ctx.clip();
  }

  // Top sand
  function drawTopSand(progress) {
    const filled = progress;
    const levelY = lerp(neckY, rimTop, filled);
    ctx.save();
    clipTopBulb();

    const left = leftWallX(levelY), right = rightWallX(levelY);
    const midX = (left + right) / 2;
    const topShade = ctx.createRadialGradient(midX, levelY, 20, midX, levelY, 200);
    topShade.addColorStop(0, "rgba(255, 255, 200, 0.8)");
    topShade.addColorStop(1, sandGradB);
    ctx.fillStyle = topShade;

    ctx.beginPath();
    ctx.moveTo(left, levelY);
    ctx.quadraticCurveTo(midX, levelY + 25, right, levelY);
    ctx.lineTo(rightWallX(rimTop), rimTop);
    ctx.lineTo(leftWallX(rimTop), rimTop);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    return levelY;
  }

  // Bottom sand
  function drawBottomSand(progress) {
    const remaining = 1 - progress;
    const levelY = lerp(neckY, rimBottom, remaining);
    ctx.save();
    clipBottomBulb();

    const left = leftWallX(levelY), right = rightWallX(levelY);
    const midX = (left + right) / 2;
    const bottomShade = ctx.createRadialGradient(midX, levelY, 30, midX, levelY, 250);
    bottomShade.addColorStop(0, "rgba(255, 230, 150, 0.9)");
    bottomShade.addColorStop(1, sandGradB);
    ctx.fillStyle = bottomShade;

    ctx.beginPath();
    ctx.moveTo(left, levelY);
    ctx.quadraticCurveTo(midX, levelY - 25, right, levelY);
    ctx.lineTo(rightWallX(rimBottom), rimBottom);
    ctx.lineTo(leftWallX(rimBottom), rimBottom);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    return levelY;
  }

  // Falling sand
  function drawNeckParticles(topLevelY, bottomLevelY) {
    ctx.save();
    for (const p of particles) {
      ctx.beginPath();
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 2);
      g.addColorStop(0, "#fffde7");
      g.addColorStop(1, sandGradB);
      ctx.fillStyle = g;
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();

      p.y += p.vy;
      if (p.y > bottomLevelY - 5) {
        p.y = topLevelY + 3;
        p.x = W / 2 + (Math.random() - 0.5) * neckHalf * 1.5;
      }
    }
    ctx.restore();

    const glow = ctx.createLinearGradient(W / 2, topLevelY, W / 2, bottomLevelY);
    glow.addColorStop(0, "rgba(255,255,200,0.6)");
    glow.addColorStop(1, "rgba(255,200,100,0.1)");
    ctx.fillStyle = glow;
    ctx.fillRect(W / 2 - 2, topLevelY, 4, bottomLevelY - topLevelY);
  }

  // Progress & age logic
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

    const now = new Date();
    if (dobInput.value) {
      const dob = new Date(dobInput.value + "T00:00:00");
      const totalDays = (now - dob) / (24 * 60 * 60 * 1000);
      const years = Math.floor(totalDays / 365.2425);
      const remDays = totalDays - years * 365.2425;
      const months = Math.floor(remDays / 30.436875);
      const days = Math.floor(remDays - months * 30.436875);
      exactAge.textContent = `${years}y ${months}m ${days}d`;
    } else {
      exactAge.textContent = `Age: ${ageYears.toFixed(1)} years`;
    }

    yearsLived.textContent = ageYears.toFixed(2) + " years";
    yearsLeft.textContent = Math.max(0, lifespan - ageYears).toFixed(2) + " years";
    progressText.textContent = (pct * 100).toFixed(2) + `% of ${lifespan} years`;
    meterFill.style.width = pct * 100 + "%";

    return pct;
  }

  // Main draw loop
  function draw() {
    ctx.clearRect(0, 0, W, H);
    const p = computeProgress();
    const bottomLevelY = drawBottomSand(p);
    const topLevelY = drawTopSand(p);
    drawNeckParticles(topLevelY, bottomLevelY);
    drawFrame();
    requestAnimationFrame(draw);
  }

  // Events
  dobInput.addEventListener("change", computeProgress);
  lifespanInput.addEventListener("input", computeProgress);
  ageSlider.addEventListener("input", () => {
    if (!dobInput.value) computeProgress();
  });
  useDOBBtn.addEventListener("click", computeProgress);

  computeProgress();
  draw();
})();
