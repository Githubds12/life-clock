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
    const adjusted = Math.pow(remaining, 0.7);  // slower drain, looks fuller

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

    const moundHeight = Math.min(60, pileHeight * 0.65); // taller, fuller mound

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
// ===== Mute / Unmute Toggle (with persistence) =====
let isMuted = localStorage.getItem("muted") === "true"; // load saved state

function applyMuteState() {
  muteBtn.textContent = isMuted ? "Unmute" : "Mute";
  if (noiseGain) {
    noiseGain.gain.value = isMuted ? 0 : 0.9;
  }
}



// Apply state immediately on load
if (muteBtn) {
  applyMuteState();

  muteBtn.addEventListener("click", () => {
    maybeStartAudio(); // ensure audio is initialized

    isMuted = !isMuted;
    localStorage.setItem("muted", isMuted); // save to storage
    applyMuteState();
  });
}

function updateSandSound(intensity) {
  if (!noiseGain) return;

  if (isMuted) {
    // force silence, don’t let intensity update volume
    noiseGain.gain.cancelScheduledValues(audioCtx.currentTime);
    noiseGain.gain.setValueAtTime(0, audioCtx.currentTime);
    return;
  }

  // normal operation
  const g = Math.pow(clamp(intensity, 0, 1), 0.7) * 0.6;
  noiseGain.gain.linearRampToValueAtTime(g, audioCtx.currentTime + 0.08);

  if (band) {
    band.frequency.value = 1200 + Math.sin(performance.now() * 0.001) * 300;
  }
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


const sadhguruQuotes = [
  "Timely death is not a disaster.",
  "Once you are constantly aware of your mortality, your spiritual search will be unwavering.",
  "Death is a cosmic joke. If you get the joke, falling on the other side will be wonderful.",
  "Birth and death are just passages, not of life but of time.",
  "Death is a fiction of the unaware. There is only life, life, and life alone, moving from one dimension to another.",
  "Death is something that happens only once in our lives. It is important that we conduct it well.",
  "If you can transition from wakefulness to sleep consciously, you will also be able to transition from life to death consciously.",

  // 🔥 New ones added
  "Every breath you take, you are getting closer to the grave. But every breath you take, you can also get closer to your liberation.",
  "Only a person who has lived totally can die gracefully.",
  "Death is the highest relaxation. Life needs a certain amount of tension to keep it going.",
  "If you realize how fragile your life is, you will walk very gently on this planet.",
  "Only a person who is willing to die can live totally.",
  "If we cannot celebrate death as we celebrate birth, we will not know life.",
  "Life and death are like inhalation and exhalation. They always exist together.",
  "Only those who shall die, shall live.",
  "Avoiding death is avoiding life. Dodging life is inviting death.",
  "The only safe place on the planet is your grave.",

  // 🌿 Extra fresh ones
  "Mortality is not a curse – it is the very thing that makes life precious.",
  "When death comes, it is neither good nor bad. It is just the completion of a certain process.",
  "If you constantly remember that you are mortal, you will walk with intensity and involvement.",
  "Death is not the end of life – it is the end of the body. Life is beyond that.",
  "The moment you came out of your mother’s womb, the countdown to your grave started.",
  "Only when you accept death gracefully will you know how to live gracefully.",
  "When you look at your life as a limited lease of time, every moment becomes immensely valuable.",
  "Your life is ticking away like a clock. The question is, will you make it worthwhile before it stops?"
];


// Quote shuffling system with memory
let shuffledQuotes = [];
let quoteIndex = 0;

function shuffleQuotes() {
  shuffledQuotes = [...sadhguruQuotes].sort(() => Math.random() - 0.5);
  quoteIndex = 0;
  saveQuoteState();
}

function getNextQuote() {
  if (quoteIndex >= shuffledQuotes.length) {
    shuffleQuotes(); // reshuffle once all quotes are used
  }
  const q = shuffledQuotes[quoteIndex++];
  saveQuoteState();
  return q;
}

function saveQuoteState() {
  localStorage.setItem("quoteState", JSON.stringify({
    shuffledQuotes,
    quoteIndex
  }));
}

function loadQuoteState() {
  const saved = localStorage.getItem("quoteState");
  if (saved) {
    try {
      const state = JSON.parse(saved);
      if (state.shuffledQuotes && state.shuffledQuotes.length === sadhguruQuotes.length) {
        shuffledQuotes = state.shuffledQuotes;
        quoteIndex = state.quoteIndex || 0;
        return;
      }
    } catch (e) {
      console.warn("Quote state reset", e);
    }
  }
  loadQuoteState();
}
const quoteText = document.getElementById("quoteText");
const nextQuoteBtn = document.getElementById("nextQuoteBtn");

function showRandomQuote() {
  if (!quoteText) return;

  // fade out
  quoteText.classList.remove("visible");

  setTimeout(() => {
    const q = getNextQuote();
    quoteText.textContent = `"${q}" — Sadhguru`;

    // fade in
    quoteText.classList.add("visible");

    saveQuoteState();
  }, 800);
}

// === Auto cycle every 15 seconds ===
setInterval(showRandomQuote, 15000);


// Show one immediately
showRandomQuote();
quoteText.classList.add("visible");

// Button click = new quote instantly
if (nextQuoteBtn) {
  nextQuoteBtn.addEventListener("click", showRandomQuote);
}

// ====================
// 🌿 Pebbles of Wisdom
// ====================

const pebblesOfWisdom = [
  "I have no teachings at all. If you are willing, then I can deliver you into a space and a situation within yourself that you have never imagined possible in human life.",
  "Liberation is not my idea; it is the fundamental longing in every form of life.",
  "When you are torn by the pain of ignorance, then a Master arrives…",
  "‘Sadhguru’ means a dissolving agent, a catalyst to dissolve you faster.",
  "Spirituality is not something you do. If you stop all of your nonsense, you are spiritual. Spirituality is ultimate sense.",
  "The significance of human nature is that you have the discretion to decide how God should function within you. This is not a small choice, not a small responsibility, not a small honor. Is it a small honor that you can decide how God should function? Most people are letting this go by, not realizing what is being bestowed upon them.",
  "There is no such thing as ego; it is empty talk. The nasty part of you, you call it ego. Whenever you get nasty, you don’t want to see, 'It is me who is nasty.' You want to say, 'Oh, it is my ego.' This is another way of passing the buck. There is no ego. There is just you, and you, and you alone.",
  "The spiritual path has become a struggle only because of this: you have a strong sense of like and dislike, but you are trying to be all-inclusive. It’s a self-defeating process.",
  "Learning is a natural human trait. When you learn something that you did not know, it should make you joyful. But if learning is making children miserable, then we have not understood how to impart learning.",
  "Once your consciousness rises beyond the needs of security, prosperity and pleasure, you will see that flowering is the very basis of life. It is not the end-product – it is the beginning and the end. The very purpose of life is to reach the highest possible flowering.",
  "Right now, you are half alive, because you are mistaking your psychological drama for reality. If you were truly alive, everything would be flowing and flowering within you.",
  "Don’t believe what I say. Don’t disbelieve what I say. Don’t just believe or disbelieve me. Just experiment, be a scientist in your own life. If it works, it works. If it doesn’t, you throw it away. You lose nothing.",
  "Devotion means involvement with no limits, prejudice, and conditions.",
  "The moment you ascribe who you are right now to what happened yesterday, you cannot change yourself.",
  "Nothing is right and nothing is wrong. It is just limited or unlimited.",
  "Once your vision becomes absolutely clear, your body, mind, emotions and energies will function only for what you really want to do.",
  "Every little thing that you do should become an act of love.",
  "Your wealth, your money, your positions, your education, your career – all these things you might gather, but you will never gather yourself. For that, you need to look inward.",
  "Belief gives you confidence, but it deprives you of clarity. Confidence without clarity is a disaster.",
  "There is no insurance for life. Life is happening the way it is happening because of the way you are handling it. If you handle it properly, it will happen beautifully.",
  "Your personality is something that you created consciously or unconsciously. You can always create it whichever way you want.",
  "This is the fundamental nature of life: if you want to go up somewhere, you have to leave where you are right now. Only if you leave here can you go there.",
  "This body is just a piece of Earth that you carry with you. If you get it now, you can live gracefully. If you get it when they bury you, you will still be graceful, but too late.",
  "If you want flowers in your garden, you don’t have to pray to God and ask for flowers. You have to just understand the soil, manure, and water. If you handle this well, flowers will come. This is the nature of existence.",
  "What you identify yourself with, that is what you become.",
  "Peace and joy are not things that you can get from outside. They can only come from within.",
  "You cannot suffer the past or the future because they do not exist. What you are suffering is your memory and your imagination.",
  "If you resist change, you resist life.",
  "Life is just a certain amount of time and energy. If you make the best out of it, you live fully.",
  "Your mind is a projection machine. It projects your past experience into the future.",
  "To live totally means, before you fall dead, every aspect of life has been explored – nothing has been left untouched.",
  "Once you are in touch with your inner nature, nothing external will ever decide who you are.",
  "If you do not know how to be still, you can only know how to be restless.",
  "If you stop clinging to everything, your life will become very simple.",
  "Spirituality is not about looking up or down – it is about looking inward.",
  "There is no need to search for God. If you deepen your experience of life to its core, you will know the source of creation.",
  "What you call ‘life’ is just a certain combination of time and energy. Time is ticking away. Energy is not limitless. If you make the best of these two things, you will live a full life.",
  "The problem is not that there is not enough time. The problem is you do not know how to use the time you have.",
  "The fear is not of suffering. The fear is that suffering may last forever.",
  "Every moment, life is a possibility. Either you can use it or you can lose it.",
  "If you are conscious, every moment is an eternity.",
  "When you are truly in touch with life, you will naturally live joyfully.",
  "Your ideas of right and wrong are just social norms. Life knows no such boundaries.",
  "Do not try to fix whatever comes in your life. Fix yourself in such a way that whatever comes, you will be fine.",
  "If you do not know how to manage your mind, your mind will manage you.",
  "You cannot be in the present moment if you are ruled by your memory and imagination.",
  "If you can breathe consciously for even a few minutes a day, it will change the way you experience life.",
  "The most beautiful moments in life are moments when you are expressing your joy, not when you are seeking it.",
  "You don’t have to do anything to be spiritual. If you stop your distortions, you are spiritual.",
  "When you do not know what to do, just sit and watch the sky, or a flower, or a child. This is meditation.",
  "You don’t have to be serious to be spiritual. You have to be sincere.",
  "Life is neither suffering nor joy. It is what you make out of it.",
  "If you want to enjoy the journey of life, you must be willing to be flexible.",
  "Only when you realize the fragility of life will you walk gently on this planet.",
  "The only way to experience true freedom is to go beyond the limitations of the body and the mind.",
  "When you are aware of your mortality, you will naturally want to know what is beyond.",
  "The only way to be truly alive is to be conscious.",
  "Life is not about what you have. It is about how you are.",
  "When you see everything as one, you are spiritual.",
  "Do not try to control life. If you live with awareness, life will be beautiful.",
  "When you stop interfering in your own mind, peace will naturally happen.",
  "Life is not a race. It is a journey.",
  "When you are truly joyful, you do not need anything else.",
  "The more you are connected to life, the more joyful you will be.",
  "Life is not about reaching somewhere. It is about living fully here and now.",
  "When you live in gratitude, every moment becomes a celebration.",
  "If you know how to manage your mind, you know how to manage life.",
  "You are not what you gather. You are not your body, mind, or emotions. You are something beyond.",
  "The greatest crime you can commit against life is to live it half-heartedly.",
  "If you live without being a solution to at least one other life, you are a wasted life.",
  "When you realize that you are just a small part of the cosmos, you will live in humility.",
  "Your life becomes beautiful not because of what you have, but because of how you are.",
  "If you can remain joyful for no reason, you are truly free.",
  "Life is not about comfort. Life is about experiencing the ultimate possibility.",
  "The only way to live without fear is to accept death as a part of life.",
  "Every breath you take is a step towards death. Every breath you take can also be a step towards liberation.",
  "If you are willing, you can turn every moment of your life into a stepping stone for the ultimate.",
  "When you realize the value of your own life, you will naturally respect every other life.",
  "Life is not about getting somewhere. It is about being.",
  "Only if you live totally will death be a wonderful completion.",
  "The only way to experience life is to be involved in it totally.",
  "If you live in fear of suffering, you will never know life.",
  "When you live with awareness, everything in life becomes a possibility.",
  "Life is not about avoiding difficulties. It is about learning to handle them gracefully.",
  "Every human being is capable of joy. It is just that they are looking in the wrong place.",
  "Life will not be a problem if you do not make it one.",
  "When you know that you are mortal, you will naturally become more alive.",
  "Do not try to understand life. Just live it.",
  "When you are truly alive, you do not need entertainment.",
  "If you want to know the beauty of life, you must be willing to look beyond yourself.",
  "The more you are willing to see, the more you will know life.",
  "Life is not about having everything. It is about appreciating everything.",
  "When you stop chasing happiness, joy will naturally come to you.",
  "If you want to know what life is, you must be willing to experience it.",
  "When you live without resistance, life flows effortlessly.",
  "The only way to experience truth is to be open to it.",
  "When you are willing to look beyond your own nonsense, you will know life.",
  "Life is not about winning or losing. It is about experiencing.",
  "When you know how to handle your body, mind, emotions, and energy, you are a complete human being.",
  "If you want to know the essence of life, you must be willing to go beyond your limitations.",
  "Life is not about what you do. It is about how you do it.",
  "When you live in tune with existence, everything will fall into place.",
  "Life is not about being special. It is about being real.",
  "When you stop judging, you will know the beauty of life.",
  "Life is not about achieving. It is about living.",
  "When you are willing to learn, every moment is a teacher.",
  "Life is not about becoming something. It is about realizing who you are.",
  "When you are in harmony within, everything outside will be in harmony too.",
  "Life is not about controlling. It is about allowing.",
  "When you are truly free, you will know what it means to live.",
  "Life is not about creating boundaries. It is about breaking them.",
  "When you know how to simply be, you are spiritual.",
  "Life is not about surviving. It is about thriving.",
  "When you live with love, everything becomes beautiful.",
  "Life is not about running away from death. It is about embracing it.",
  "When you accept life as it is, joy will naturally happen.",
  "Life is not about searching for meaning. It is about experiencing it fully."
];let pebbleIndex = parseInt(localStorage.getItem("pebbleIndex")) || 0; // restore from storage or start at 0
const pebblesText = document.getElementById("pebblesText");
const pebblesBtn = document.getElementById("pebblesBtn");

function showPebble(index) {
  pebblesText.classList.remove("visible");

  // wait long enough for fade-out (~500ms matches CSS transition)
  setTimeout(() => {
    pebblesText.textContent = pebblesOfWisdom[index];
    pebblesText.classList.add("visible"); // triggers fade-in
  }, 600);

  // save current index
  localStorage.setItem("pebbleIndex", index);
}

// manual next
pebblesBtn.addEventListener("click", () => {
  pebbleIndex = (pebbleIndex + 1) % pebblesOfWisdom.length;
  showPebble(pebbleIndex);
});

// auto-cycle every 15 seconds
setInterval(() => {
  pebbleIndex = (pebbleIndex + 1) % pebblesOfWisdom.length;
  showPebble(pebbleIndex);
}, 15000);

const pebblesSection = document.querySelector(".pebbles-section");

if (pebblesSection) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        pebblesSection.classList.add("visible");

        // 👉 show pebble only after section is visible
        showPebble(pebbleIndex);

        observer.unobserve(pebblesSection);
      }
    });
  }, { threshold: 0 });

  observer.observe(pebblesSection);

  // If already in view on load
  if (pebblesSection.getBoundingClientRect().top < window.innerHeight) {
    pebblesSection.classList.add("visible");
    showPebble(pebbleIndex); // also trigger here
  }
}



})();