/* script3d.js - Hourglass Life Visualizer (3D-styled, celestial+sound)
   - Keeps lifespan & country datasets and DOM ids
   - Adds: stars, sun & moon, glass reflections, 3D shading, glowing sand stream, bases
   - Sound starts on first user gesture (autoplay friendly)
   - Mute/Unmute toggle + softer default volume
   - Snakes removed from datasets
*/
(() => {
  let currentAge = 0; // single source of truth

  // ===== Datasets (snakes removed) =====
  const livingBeingLifespan = {
    // Mammals
    Human: 73, Dog: 13, Cat: 15, Elephant: 70, Horse: 30, Cow: 20, Rabbit: 9, Mouse: 2, Rat: 3, Pig: 15, Sheep: 12,
    Goat: 15, Kangaroo: 20, Giraffe: 25, Lion: 14, Tiger: 16, Leopard: 15, Cheetah: 12, Bear: 25, Wolf: 13, Deer: 20,
    Camel: 40, Dolphin: 40, "Blue Whale": 80, "Orca (Killer Whale)": 50, Bat: 20,
    // Birds
    Parrot: 50, Macaw: 60, Cockatoo: 70, Pigeon: 6, Crow: 14, Sparrow: 3, Eagle: 20, Owl: 15, Swan: 20, Penguin: 20,
    Chicken: 8, Duck: 10, Goose: 15, Falcon: 13, Peacock: 20,
    // Reptiles (no snakes)
    Crocodile: 70, Alligator: 50, Lizard: 5, Gecko: 10, Chameleon: 7, Frog: 10, Toad: 12,
    Tortoise: 100, "Sea Turtle": 80, "Komodo Dragon": 30,
    // Marine Life
    Goldfish: 10, "Koi Fish": 40, Shark: 30, "Great White Shark": 70, Salmon: 4, Tuna: 15, Clownfish: 10, Octopus: 3,
    Squid: 2, Lobster: 50, Crab: 8, Starfish: 10, Jellyfish: 1,
    // Insects & Arthropods
    Ant: 0.2, Bee: 0.3, Butterfly: 0.1, Dragonfly: 0.5, Mosquito: 0.05, Cockroach: 1, Spider: 2, Tarantula: 20,
    Scorpion: 5, Grasshopper: 0.5, Ladybug: 1,
    // Trees & Plants
    "Oak Tree": 300, "Pine Tree": 250, "Baobab Tree": 2000, Bamboo: 120, "Banana Plant": 25, "Sequoia Tree": 3000,
    Cactus: 150, "Mango Tree": 100, "Palm Tree": 80,
  };
  const livingBeingInput = document.getElementById("livingBeing");
  const livingBeingList = document.getElementById("livingBeingList");
  if (livingBeingList) {
    Object.keys(livingBeingLifespan).forEach((animal) => {
      const option = document.createElement("option");
      option.value = animal;
      livingBeingList.appendChild(option);
    });
  }

  const countryLifeExpectancy = {
    Afghanistan: 66.54,
    Albania: 79.95,
    Algeria: 76.38,
    Angola: 61.64,
    Argentina: 77.69,
    Armenia: 76.01,
    Australia: 84.21,
    Austria: 82.29,
    Azerbaijan: 74.43,
    Bahamas: 74.55,
    Bahrain: 81.58,
    Bangladesh: 74.67,
    Barbados: 76.18,
    Belarus: 74.18,
    Belgium: 82.4,
    Belize: 73.57,
    Benin: 60.77,
    Bhutan: 72.97,
    Bolivia: 68.58,
    "Bosnia and Herzegovina": 77.85,
    Botswana: 69.16,
    Brazil: 75.85,
    Brunei: 75.33,
    Bulgaria: 75.71,
    Burundi: 63.65,
    Cambodia: 70.67,
    Cameroon: 63.7,
    Canada: 81.65,
    "Central African Republic": 57.41,
    Chad: 55.07,
    Chile: 81.17,
    China: 77.95,
    Colombia: 77.72,
    Comoros: 66.78,
    "Costa Rica": 80.8,
    Croatia: 78.47,
    Cuba: 78.08,
    Cyprus: 81.65,
    "Czech Republic": 79.88,
    Denmark: 81.85,
    "Dominican Republic": 73.72,
    Ecuador: 77.39,
    Egypt: 71.63,
    "El Salvador": 72.1,
    Estonia: 78.49,
    Eswatini: 64.12,
    Ethiopia: 67.32,
    Finland: 81.69,
    France: 82.93,
    Gabon: 68.34,
    Gambia: 65.86,
    Georgia: 74.5,
    Germany: 80.54,
    Ghana: 65.5,
    Greece: 81.54,
    Guatemala: 72.6,
    Guinea: 60.74,
    "Guinea-Bissau": 64.08,
    Haiti: 64.94,
    Honduras: 72.88,
    Hungary: 76.77,
    Iceland: 82.61,
    India: 72.0,
    Indonesia: 71.15,
    Iran: 77.65,
    Iraq: 72.32,
    Ireland: 82.86,
    Israel: 83.2,
    Italy: 83.7,
    Jamaica: 71.48,
    Japan: 84.04,
    Jordan: 77.81,
    Kazakhstan: 74.4,
    Kenya: 63.65,
    Kosovo: 78.03,
    Kuwait: 83.19,
    Kyrgyzstan: 72.25,
    Laos: 68.96,
    Latvia: 75.68,
    Lebanon: 77.82,
    Lesotho: 57.38,
    Liberia: 62.16,
    Libya: 69.34,
    Lithuania: 76.99,
    Luxembourg: 83.36,
    Macedonia: 75.32,
    Madagascar: 63.63,
    Malawi: 67.35,
    Malaysia: 76.66,
    Maldives: 81.04,
    Mali: 60.44,
    Malta: 83.51,
    Mauritania: 68.48,
    Mauritius: 73.41,
    Mexico: 75.07,
    Moldova: 71.2,
    Mongolia: 72.12,
    Montenegro: 77.59,
    Morocco: 75.31,
    Mozambique: 63.61,
    Myanmar: 66.89,
    Namibia: 67.39,
    Nepal: 70.35,
    Netherlands: 81.91,
    "New Zealand": 83.0,
    Nicaragua: 74.95,
    Niger: 61.18,
    Nigeria: 54.46,
    "North Korea": 73.64,
    Norway: 83.11,
    Oman: 80.03,
    Pakistan: 67.65,
    Panama: 79.59,
    "Papua New Guinea": 66.13,
    Paraguay: 73.84,
    Peru: 77.74,
    Philippines: 69.83,
    Poland: 78.51,
    Portugal: 82.28,
    Qatar: 82.37,
    Romania: 76.61,
    Russia: 73.25,
    Rwanda: 67.78,
    "Saudi Arabia": 78.73,
    Senegal: 68.68,
    Serbia: 76.22,
    Seychelles: 74.96,
    "Sierra Leone": 61.79,
    Singapore: 82.9,
    Slovakia: 78.02,
    Slovenia: 81.98,
    Somalia: 58.82,
    "South Africa": 66.14,
    "South Korea": 83.43,
    "South Sudan": 57.62,
    Spain: 83.88,
    "Sri Lanka": 77.48,
    Sudan: 66.33,
    Sweden: 83.31,
    Switzerland: 84.06,
    Syria: 72.12,
    Taiwan: 80.94,
    Tajikistan: 71.79,
    Tanzania: 67.0,
    Thailand: 76.41,
    Togo: 62.74,
    Tunisia: 76.51,
    Turkey: 77.16,
    Turkmenistan: 70.07,
    Uganda: 68.25,
    Ukraine: 73.42,
    "United Arab Emirates": 82.91,
    "United Kingdom": 81.24,
    "United States": 78.39,
    Uruguay: 78.14,
    Uzbekistan: 72.39,
    Venezuela: 72.51,
    Vietnam: 74.59,
    Yemen: 69.3,
    Zambia: 66.35,
    Zimbabwe: 62.78,
  };
  const countrySelect = document.getElementById("country");
  if (countrySelect) {
    for (const country in countryLifeExpectancy) {
      const opt = document.createElement("option");
      opt.value = countryLifeExpectancy[country];
      opt.textContent = country;
      countrySelect.appendChild(opt);
    }
  }

  // ===== DOM & constants =====
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
  const muteBtn = document.getElementById("muteBtn");

  // Colors
  const sandGradA = "#d4a74f";
  const sandGradB = "#b67d2a";
  const glassEdge = "rgba(255,255,255,0.65)";
  const outline = "rgba(255,255,255,0.25)";

  const MS_PER_YEAR = 365.2425 * 24 * 60 * 60 * 1000;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;

  // Geometry
  const W = canvas.width, H = canvas.height;
  const rimTop = 160, neckY = H * 0.5, rimBottom = H - 160;
  let rimLeft = W * 0.25, rimRight = W * 0.75;
  const neckHalf = 12;
  const ctrlTopY = H * 0.28, ctrlBottomY = H * 0.72;

  // Parallax tilt
  canvas.addEventListener("mousemove", e => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const tilt = (x / rect.width - 0.5) * 15;
    rimLeft = W * 0.25 + tilt;
    rimRight = W * 0.75 + tilt;
  });

  // ===== Celestial background (stars + sun & moon) =====
  const STAR_COUNT = 180;
  const stars = Array.from({ length: STAR_COUNT }, () => ({
    x: Math.random() * W,
    y: Math.random() * (H * 0.6),
    r: Math.random() * 1.6 + 0.4,
    tw: Math.random() * 2 * Math.PI,
    spd: 0.005 + Math.random() * 0.01
  }));
  function drawSky(t) {
    // Stars
    for (const s of stars) {
      s.tw += s.spd;
      const a = 0.35 + Math.sin(s.tw) * 0.35;
      ctx.globalAlpha = clamp(a, 0, 1);
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // Sun & Moon path (based on local time)
    const now = new Date();
    const dayProg = (now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds()) / 86400; // 0..1
    const arcY = H * 0.12, arcR = W * 0.42;
    const theta = Math.PI * (1 + dayProg); // rise left -> set right

    const sunX = W / 2 + arcR * Math.cos(theta);
    const sunY = arcY + arcR * Math.sin(theta);
    const moonX = W / 2 + arcR * Math.cos(theta + Math.PI);
    const moonY = arcY + arcR * Math.sin(theta + Math.PI);

    // Sun
    const sunGrad = ctx.createRadialGradient(sunX, sunY, 4, sunX, sunY, 22);
    sunGrad.addColorStop(0, "rgba(255,215,130,1)");
    sunGrad.addColorStop(1, "rgba(255,215,130,0)");
    ctx.fillStyle = sunGrad;
    ctx.beginPath(); ctx.arc(sunX, sunY, 22, 0, Math.PI * 2); ctx.fill();

    // Moon (crescent)
    ctx.fillStyle = "rgba(200,220,255,0.9)";
    ctx.beginPath(); ctx.arc(moonX, moonY, 16, 0, Math.PI * 2); ctx.fill();
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath(); ctx.arc(moonX + 6, moonY - 2, 16, 0, Math.PI * 2); ctx.fill();
    ctx.globalCompositeOperation = "source-over";
  }

  // ===== Curve helpers =====
  function quadAt(p0, p1, p2, t) { return (1 - t) * (1 - t) * p0 + 2 * (1 - t) * t * p1 + t * t * p2; }
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
    const t = y <= neckY ? solveTForY(y, rimTop, ctrlTopY, neckY) : solveTForY(y, neckY, ctrlBottomY, rimBottom);
    return y <= neckY ? quadAt(rimLeft, W * 0.35, W / 2 - neckHalf, t) : quadAt(W / 2 - neckHalf, W * 0.35, rimLeft, t);
  }
  function rightWallX(y) {
    const t = y <= neckY ? solveTForY(y, rimTop, ctrlTopY, neckY) : solveTForY(y, neckY, ctrlBottomY, rimBottom);
    return y <= neckY ? quadAt(rimRight, W * 0.65, W / 2 + neckHalf, t) : quadAt(W / 2 + neckHalf, W * 0.65, rimRight, t);
  }
  function drawEllipse(cx, cy, rx, ry, fillStyle, strokeStyle, lineWidth = 1) {
    ctx.save(); ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
    if (fillStyle) { ctx.fillStyle = fillStyle; ctx.fill(); }
    if (strokeStyle) { ctx.lineWidth = lineWidth; ctx.strokeStyle = strokeStyle; ctx.stroke(); }
    ctx.restore();
  }

  // ===== Frame & glass (extra reflections) =====
  function drawFrame() {
    ctx.save();
    // Body tint
    const glassGradient = ctx.createLinearGradient(0, rimTop, 0, rimBottom);
    glassGradient.addColorStop(0, "rgba(255,255,255,0.03)");
    glassGradient.addColorStop(0.5, "rgba(255,255,255,0.07)");
    glassGradient.addColorStop(1, "rgba(255,255,255,0.03)");

    ctx.beginPath();
    ctx.moveTo(rimLeft, rimTop);
    ctx.quadraticCurveTo(W * 0.35, ctrlTopY, W / 2 - neckHalf, neckY);
    ctx.quadraticCurveTo(W * 0.35, ctrlBottomY, rimLeft, rimBottom);
    ctx.lineTo(rimRight, rimBottom);
    ctx.quadraticCurveTo(W * 0.65, ctrlBottomY, W / 2 + neckHalf, neckY);
    ctx.quadraticCurveTo(W * 0.65, ctrlTopY, rimRight, rimTop);
    ctx.closePath();
    ctx.fillStyle = glassGradient; ctx.fill();

    // Outer glossy edge
    ctx.lineWidth = 3;
    const edgeGrad = ctx.createLinearGradient(rimLeft, rimTop, rimRight, rimBottom);
    edgeGrad.addColorStop(0, glassEdge); edgeGrad.addColorStop(0.5, "rgba(255,255,255,0.35)"); edgeGrad.addColorStop(1, glassEdge);
    ctx.strokeStyle = edgeGrad; ctx.stroke();

    // Top & bottom rims
    const topRx = (rimRight - rimLeft) * 0.42; const bottomRx = topRx; const rimRy = 12;
    drawEllipse(W/2, rimTop, topRx, rimRy, null, outline, 1.25);
    drawEllipse(W/2, rimBottom, bottomRx, rimRy, null, outline, 1.25);
    // Neck rim
    drawEllipse(W/2, neckY, neckHalf * 0.9, 5, null, "rgba(255,255,255,0.2)", 1);

    // Long specular streaks (moves subtly)
    const t = performance.now() * 0.0002;
    const streakX = lerp(rimLeft + 20, rimRight - 20, (Math.sin(t) * 0.5 + 0.5));
    const streakGrad = ctx.createLinearGradient(streakX - 30, rimTop, streakX + 30, rimBottom);
    streakGrad.addColorStop(0, "rgba(255,255,255,0)");
    streakGrad.addColorStop(0.5, "rgba(255,255,255,0.20)");
    streakGrad.addColorStop(1, "rgba(255,255,255,0)");
    ctx.strokeStyle = streakGrad; ctx.lineWidth = 4; ctx.beginPath();
    ctx.moveTo(streakX, rimTop+10); ctx.lineTo(streakX, rimBottom-10); ctx.stroke();

    // Shadow under glass
    const shadowGrad = ctx.createRadialGradient(W / 2, rimBottom + 40, 10, W / 2, rimBottom + 40, 180);
    shadowGrad.addColorStop(0, "rgba(0,0,0,0.35)"); shadowGrad.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = shadowGrad;
    ctx.beginPath(); ctx.ellipse(W / 2, rimBottom + 40, 120, 25, 0, 0, Math.PI * 2); ctx.fill();

    ctx.restore();
  }

  // Draw wooden/metal bases
  function drawStand() {
    const baseGrad = ctx.createLinearGradient(0, 0, 0, 80);
    baseGrad.addColorStop(0, "#553311");
    baseGrad.addColorStop(1, "#2a1508");
    drawEllipse(W/2, rimBottom+40, 140, 25, baseGrad, "#111", 2);
    drawEllipse(W/2, rimTop-40, 140, 25, baseGrad, "#111", 2);
  }

  // Clips
  function clipTopBulb() {
    ctx.beginPath();
    ctx.moveTo(rimLeft, rimTop);
    ctx.quadraticCurveTo(W * 0.35, ctrlTopY, W / 2 - neckHalf, neckY);
    ctx.lineTo(W / 2 + neckHalf, neckY);
    ctx.quadraticCurveTo(W * 0.65, ctrlTopY, rimRight, rimTop);
    ctx.closePath(); ctx.clip();
  }
  function clipBottomBulb() {
    ctx.beginPath();
    ctx.moveTo(rimLeft, rimBottom);
    ctx.quadraticCurveTo(W * 0.35, ctrlBottomY, W / 2 - neckHalf, neckY);
    ctx.lineTo(W / 2 + neckHalf, neckY);
    ctx.quadraticCurveTo(W * 0.65, ctrlBottomY, rimRight, rimBottom);
    ctx.closePath(); ctx.clip();
  }

  // ===== Sand drawing =====
  function drawTopSand(progress) {
    const remaining = 1 - progress; if (remaining <= 0) return;
    const adjusted = Math.sqrt(remaining);
    const levelY = lerp(neckY, rimTop, adjusted);

    ctx.save(); clipTopBulb();

    const left = leftWallX(levelY), right = rightWallX(levelY);
    const midX = (left + right) / 2;
    const rx = (right - left) * 0.48, ry = Math.max(5, rx * 0.15);

    const verticalGrad = ctx.createLinearGradient(0, levelY, 0, rimTop);
    verticalGrad.addColorStop(0, sandGradA); verticalGrad.addColorStop(1, sandGradB);

    ctx.fillStyle = verticalGrad;
    ctx.beginPath();
    ctx.moveTo(left, levelY);
    ctx.lineTo(leftWallX(neckY), neckY);
    ctx.lineTo(rightWallX(neckY), neckY);
    ctx.lineTo(right, levelY); ctx.closePath(); ctx.fill();

    // surface ellipse
    const dip = lerp(4, 36, 1 - adjusted);
    const surfaceY = levelY + dip * 0.45;
    const surfaceGrad = ctx.createRadialGradient(midX, surfaceY, 2, midX, surfaceY, rx);
    surfaceGrad.addColorStop(0, "rgba(255,255,255,0.18)");
    surfaceGrad.addColorStop(0.3, "rgba(255,255,255,0.10)");
    surfaceGrad.addColorStop(1, "rgba(255,255,255,0.00)");
    drawEllipse(midX, surfaceY, rx, ry, surfaceGrad, "rgba(0,0,0,0.08)", 0.8);

    ctx.restore();
    return levelY;
  }

  function drawBottomSand(progress) {
    if (progress <= 0) return neckY;

    const maxHeight = rimBottom - neckY;
    const pileHeight = maxHeight * progress;
    const levelY = rimBottom - pileHeight;

    ctx.save(); clipBottomBulb();

    const left = leftWallX(levelY), right = rightWallX(levelY);
    const baseLeft = leftWallX(rimBottom), baseRight = rightWallX(rimBottom);
    const midX = (left + right) / 2;

    const moundHeight = Math.min(46, pileHeight * 0.45);
    const peakY = levelY - moundHeight;

    const bodyGrad = ctx.createLinearGradient(0, peakY, 0, rimBottom);
    bodyGrad.addColorStop(0, sandGradA); bodyGrad.addColorStop(1, sandGradB);
    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    ctx.moveTo(left, levelY);
    ctx.quadraticCurveTo((left + midX) / 2, peakY, midX, peakY);
    ctx.quadraticCurveTo((right + midX) / 2, peakY, right, levelY);
    ctx.lineTo(baseRight, rimBottom);
    ctx.lineTo(baseLeft, rimBottom);
    ctx.closePath(); ctx.fill();

    const baseRx = (baseRight - baseLeft) * 0.48;
    const baseRy = Math.max(6, baseRx * 0.16);
    const baseY = rimBottom - 2;
    const baseGlow = ctx.createRadialGradient(midX, baseY, 4, midX, baseY, baseRx);
    baseGlow.addColorStop(0, "rgba(255,255,255,0.12)");
    baseGlow.addColorStop(1, "rgba(255,255,255,0)");
    drawEllipse(midX, baseY, baseRx, baseRy, baseGlow, "rgba(0,0,0,0.08)", 0.8);

    // highlight streak on mound
    ctx.beginPath();
    ctx.moveTo(midX - 25, peakY + 6);
    ctx.quadraticCurveTo(midX, peakY - 4, midX + 25, peakY + 6);
    ctx.strokeStyle = "rgba(255,255,255,0.15)";
    ctx.lineWidth = 2; ctx.stroke();

    ctx.restore();
    return levelY;
  }

  // Falling stream + grains
  const particles = [];
  function drawStream(topLevelY, bottomLevelY) {
    if (!topLevelY || !bottomLevelY) return 0;
    if (bottomLevelY <= neckY + 2) return 0;

    ctx.save();
    const startY = neckY + 1.5, endY = bottomLevelY - 2;
    const topWidth = 10, bottomWidth = 3;

    const streamGrad = ctx.createLinearGradient(W/2, startY, W/2, endY);
    streamGrad.addColorStop(0, sandGradA); streamGrad.addColorStop(1, sandGradB);

    ctx.beginPath();
    ctx.moveTo(W / 2 - topWidth / 2, startY);
    ctx.lineTo(W / 2 + topWidth / 2, startY);
    ctx.lineTo(W / 2 + bottomWidth / 2, endY);
    ctx.lineTo(W / 2 - bottomWidth / 2, endY);
    ctx.closePath();
    ctx.fillStyle = streamGrad;
    ctx.shadowBlur = 6; ctx.shadowColor = "rgba(0,0,0,0.2)";
    ctx.fill(); ctx.shadowBlur = 0;
    ctx.restore();

    // grains
    if (Math.random() < 0.7) {
      particles.push({
        x: W / 2 + (Math.random() - 0.5) * 3,
        y: startY, vx: (Math.random() - 0.5) * 0.5, vy: 2 + Math.random() * 2,
        r: 1 + Math.random() * 1.5, life: 40
      });
    }
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx; p.y += p.vy; p.life--;
      ctx.fillStyle = sandGradA; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
      if (p.life <= 0 || p.y > endY) particles.splice(i, 1);
    }

    // return normalized stream length for sound intensity
    return clamp((endY - startY) / (rimBottom - rimTop), 0, 1);
  }

  // Sparkles (UI + in-canvas)
  const barSparkles = []; let barSparklesActive = false;
  const finalSparkles = []; let finalSparklesActive = false;
  function drawBarSparkles(bottomLevelY) {
    if (!meterFill) return;
    const barWidth = meterFill.offsetWidth, barHeight = meterFill.offsetHeight;
    if (!barSparklesActive && displayProgress >= 1) barSparklesActive = true;
    if (!barSparklesActive) return;

    if (Math.random() < 0.3) {
      barSparkles.push({
        x: Math.random() * barWidth, y: Math.random() * barHeight,
        r: 3 + Math.random() * 3, life: 60 + Math.random() * 30,
        vx: (Math.random() - 0.5) * 1, vy: -0.5 + Math.random() * 0.5,
      });
      if (bottomLevelY) {
        finalSparkles.push({
          x: W/2 + (Math.random() - 0.5) * 80, y: bottomLevelY - 5 + (Math.random() - 0.5) * 20,
          r: 3 + Math.random() * 5, life: 50 + Math.random() * 50,
          vx: (Math.random() - 0.5) * 1, vy: -0.2 + Math.random() * 0.5,
        });
      }
    }
    barSparkles.forEach((s, i) => {
      s.life--; s.x += s.vx; s.y += s.vy;
      const sparkle = document.createElement("div");
      sparkle.style.position = "absolute";
      sparkle.style.width = `${s.r * 2}px`; sparkle.style.height = `${s.r * 2}px`;
      sparkle.style.left = `${meterFill.offsetLeft + s.x}px`;
      sparkle.style.top = `${meterFill.offsetTop + s.y}px`;
      sparkle.style.borderRadius = "50%"; sparkle.style.background = "white";
      sparkle.style.opacity = Math.min(s.life / 50, 1);
      sparkle.style.pointerEvents = "none"; sparkle.style.zIndex = 1000;
      document.body.appendChild(sparkle);
      if (s.life <= 0) barSparkles.splice(i, 1);
      setTimeout(() => sparkle.remove(), 16);
    });
  }
  function drawFinalSparkles(bottomLevelY) {
    if (!finalSparklesActive && displayProgress >= 1) finalSparklesActive = true;
    if (!finalSparklesActive) return;
    if (Math.random() < 0.5) {
      finalSparkles.push({
        x: W / 2 + (Math.random() - 0.5) * 80,
        y: bottomLevelY - 5 + (Math.random() - 0.5) * 20,
        r: 2 + Math.random() * 4,
        life: 40 + Math.random() * 30,
        vx: (Math.random() - 0.5) * 1,
        vy: -0.2 + Math.random() * 0.5,
      });
    }
    for (let i = finalSparkles.length - 1; i >= 0; i--) {
      const s = finalSparkles[i];
      s.life--; s.x += s.vx; s.y += s.vy;
      ctx.fillStyle = `rgba(255,255,255,${Math.min(s.life / 50, 1)})`;
      ctx.shadowBlur = 8; ctx.shadowColor = "white";
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill();
      ctx.shadowBlur = 0;
      if (s.life <= 0) finalSparkles.splice(i, 1);
    }
  }

  // ===== Progress & intro =====
  let targetProgress = 0, displayProgress = 0;
  let introStart = null; const introDuration = 18000;

  function computeProgress() {
    const lifespan = Math.max(1, Number(lifespanInput.value) || 100);
    ageSlider.max = lifespan; ageSlider.value = clamp(currentAge, 0, lifespan);
    targetProgress = clamp(currentAge / lifespan, 0, 1);
    yearsLived.textContent = currentAge.toFixed(2) + " years";
    yearsLeft.textContent = Math.max(0, lifespan - currentAge).toFixed(2) + " years";
    progressText.textContent = (targetProgress * 100).toFixed(2) + `% of ${lifespan} years`;
  }

  // ===== WebAudio sand sound =====
  let audioCtx = null, noiseGain = null, band = null;
  function initAudio() {
    if (audioCtx) return;
    try {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      // Pink-ish noise buffer
      const bufferSize = 2 * audioCtx.sampleRate;
      const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0=0,b1=0,b2=0,b3=0,b4=0,b5=0,b6=0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        output[i] *= 0.11; // normalize
        b6 = white * 0.115926;
      }
      const src = audioCtx.createBufferSource();
      src.buffer = noiseBuffer; src.loop = true;

      band = audioCtx.createBiquadFilter();
      band.type = "bandpass"; band.frequency.value = 1400; band.Q.value = 0.8;

      noiseGain = audioCtx.createGain();
      noiseGain.gain.value = 0.0; // start silent

      src.connect(band); band.connect(noiseGain); noiseGain.connect(audioCtx.destination);
      src.start();
    } catch (e) { /* ignore if audio unavailable */ }
  }
  function maybeStartAudio() {
    initAudio();
    if (audioCtx && audioCtx.state === "suspended") audioCtx.resume();
  }

  // ===== Mute / Unmute Toggle =====
  let isMuted = false;
  if (muteBtn) {
    muteBtn.addEventListener("click", () => {
      isMuted = !isMuted;
      muteBtn.textContent = isMuted ? "Unmute" : "Mute";
    });
  }
  function updateSandSound(intensity) {
    if (!noiseGain) return;

    if (isMuted) {
      noiseGain.gain.linearRampToValueAtTime(0, (audioCtx?.currentTime || 0) + 0.05);
      return;
    }

    // Softer default volume
    const g = Math.pow(clamp(intensity, 0, 1), 0.7) * 0.005;
    noiseGain.gain.linearRampToValueAtTime(g, (audioCtx?.currentTime || 0) + 0.08);

    if (band) band.frequency.value = 1200 + Math.sin(performance.now() * 0.001) * 300;
  }

  // ===== Main loop =====
  function draw(timestamp) {
    if (introStart === null) introStart = timestamp;
    computeProgress();

    const elapsed = timestamp - introStart;
    if (elapsed < introDuration) {
      const t = elapsed / introDuration;
      displayProgress = t * targetProgress;
    } else {
      displayProgress = targetProgress;
    }

    meterFill.style.width = (displayProgress * 100).toFixed(2) + "%";
    progressText.textContent = Math.floor(displayProgress * 100) + "%";

    // Background sky
    ctx.clearRect(0, 0, W, H);
    drawSky(timestamp);

    // Glass & sand
    const bottomLevelY = drawBottomSand(displayProgress);
    const topLevelY = drawTopSand(displayProgress);
    const streamIntensity = drawStream(topLevelY, bottomLevelY);
    drawFinalSparkles(bottomLevelY);
    drawFrame();
    drawStand();

    // UI sparkles outside canvas
    drawBarSparkles(bottomLevelY);

    // Sound
    updateSandSound(streamIntensity * (displayProgress < 1 ? 1 : 0));

    requestAnimationFrame(draw);
  }
  function restartIntro() { displayProgress = 0; introStart = null; }

  // ===== Controls / events =====
  if (countrySelect) {
    countrySelect.addEventListener("change", () => {
      if (countrySelect.value) { lifespanInput.value = countrySelect.value; restartIntro(); }
    });
  }
  if (livingBeingInput) {
    livingBeingInput.addEventListener("change", () => {
      const chosen = livingBeingInput.value;
      if (livingBeingLifespan[chosen]) {
        localStorage.setItem("livingBeing", chosen);
        if (chosen === "Human") { if (countrySelect) countrySelect.disabled = false; }
        else { if (countrySelect) { countrySelect.disabled = true; countrySelect.selectedIndex = 0; } }
        lifespanInput.value = livingBeingLifespan[chosen];
        localStorage.setItem("lifespan", lifespanInput.value);
        restartIntro();
      }
    });
  }

  // Any user gesture should enable audio (policy-friendly)
  ["click","touchstart","keydown","input","change"].forEach(evt => {
    document.addEventListener(evt, maybeStartAudio, { once: true, passive: true });
  });

  ageSlider.addEventListener("input", () => {
    currentAge = parseFloat(ageSlider.value) || 0;
    if (dobInput) dobInput.value = "";
    restartIntro(); saveState(); updateFromSlider();
  });
  dobInput.addEventListener("input", () => {
    if (!dobInput.value) return;
    const dob = new Date(dobInput.value + "T00:00:00");
    currentAge = (Date.now() - dob.getTime()) / MS_PER_YEAR;
    restartIntro(); saveState(); updateFromDOB();
  });
  if (useDOBBtn) {
    useDOBBtn.addEventListener("click", () => {
      if (!dobInput.value) return;
      const dob = new Date(dobInput.value + "T00:00:00");
      currentAge = (Date.now() - dob.getTime()) / MS_PER_YEAR;
      restartIntro(); canvas.scrollIntoView({ behavior: "smooth", block: "center" });
      saveState(); updateFromDOB();
    });
  }
  lifespanInput.addEventListener("input", () => { restartIntro(); saveState(); updateStats(); });

  function saveState() {
    localStorage.setItem("lifespan", lifespanInput.value);
    localStorage.setItem("age", currentAge);
    localStorage.setItem("dob", dobInput.value);
    if (livingBeingInput) localStorage.setItem("livingBeing", livingBeingInput.value);
    if (livingBeingInput && livingBeingInput.value === "Human" && countrySelect && countrySelect.value) {
      localStorage.setItem("country", countrySelect.value);
    }
  }

  // Slider ↔ DOB synchronization
  const MS_YEAR = 365.2425 * 24 * 60 * 60 * 1000;
  function updateFromSlider() {
    const ageYears = parseFloat(ageSlider.value) || 0;
    const now = new Date();
    const dobDate = new Date(now.getTime() - ageYears * MS_YEAR);
    if (dobInput) dobInput.value = dobDate.toISOString().slice(0, 10);
    updateStats();
  }
  function updateFromDOB() {
    if (!dobInput.value) return;
    const dob = new Date(dobInput.value + "T00:00:00");
    const ageYears = (Date.now() - dob.getTime()) / MS_YEAR;
    const lifespan = parseFloat(lifespanInput.value) || 100;
    ageSlider.max = lifespan; ageSlider.value = clamp(ageYears, 0, lifespan);
    updateStats();
  }

  // Kick off
  computeProgress();
  requestAnimationFrame(draw);

  // Restore saved state on DOMContentLoaded
  document.addEventListener("DOMContentLoaded", () => {
    const savedAnimal = localStorage.getItem("livingBeing");
    const savedLifespan = localStorage.getItem("lifespan");
    const savedAge = localStorage.getItem("age");
    const savedDob = localStorage.getItem("dob");
    const savedCountry = localStorage.getItem("country");

    if (savedAnimal && livingBeingInput) {
      livingBeingInput.value = savedAnimal;
      lifespanInput.value = savedLifespan || livingBeingLifespan[savedAnimal];
      if (savedAnimal === "Human") {
        if (countrySelect) { countrySelect.disabled = false; if (savedCountry) countrySelect.value = savedCountry; }
      } else { if (countrySelect) countrySelect.disabled = true; }
    } else {
      if (livingBeingInput) livingBeingInput.value = "Human";
      lifespanInput.value = livingBeingLifespan["Human"];
      if (countrySelect) { countrySelect.disabled = false; if (savedCountry) countrySelect.value = savedCountry; }
    }

    if (savedDob) {
      dobInput.value = savedDob;
      const dob = new Date(savedDob + "T00:00:00");
      currentAge = (Date.now() - dob.getTime()) / MS_YEAR;
    } else if (savedAge) {
      currentAge = parseFloat(savedAge) || 0;
      ageSlider.value = currentAge;
    }
    ageSlider.max = Math.max(1, Number(lifespanInput.value) || 100);
    ageSlider.value = currentAge;
    updateStats();
  });

  // Stats UI
  function updateStats() {
    const dobStr = document.getElementById("dob").value;
    const lifespan = parseFloat(document.getElementById("lifespan").value);
    const ageSliderEl = document.getElementById("age");

    let ageYears = parseFloat(ageSliderEl.value);
    if (dobStr) {
      const dob = new Date(dobStr);
      const now = new Date();
      const diffMs = now - dob;
      const diffSeconds = diffMs / 1000;
      const years = diffSeconds / (365.25 * 24 * 60 * 60);
      ageYears = years;

      const days = Math.floor(diffSeconds / (24 * 60 * 60));
      const exactYears = Math.floor(days / 365.25);
      const remainingDays = Math.floor(days % 365.25);
      const months = Math.floor(remainingDays / 30.44);
      const leftoverDays = Math.floor(remainingDays % 30.44);

      const exactAgeEl = document.getElementById("exactAge");
      if (exactAgeEl) exactAgeEl.textContent = `${exactYears} years, ${months} months, ${leftoverDays} days`;
    }

    document.getElementById("yearsLived").textContent = Math.floor(ageYears);
    const yearsLeftVal = lifespan - ageYears;
    document.getElementById("yearsLeft").textContent = yearsLeftVal > 0 ? yearsLeftVal.toFixed(2) : "0";

    const progress = Math.min((ageYears / lifespan) * 100, 100);
    document.getElementById("progressText").textContent = progress.toFixed(2) + "%";
    document.getElementById("meterFill").style.width = progress + "%";
  }
})();