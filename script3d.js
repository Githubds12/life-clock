/* script3d.js - Hourglass Life Visualizer (3D-styled, celestial+sound)
   - Keeps lifespan & country datasets and DOM ids
   - Adds: stars, sun & moon, glass reflections, 3D shading, glowing sand stream, bases
   - Sound starts on first user gesture (autoplay friendly)
   - Mute/Unmute toggle + softer default volume
   - Snakes removed from datasets
*/
(() => {
  let currentAge = 0; // single source of truth
let clockInterval = null; // A variable to hold our timer

// This function will be called once to start the clock
function startContinuousClock() {
  if (clockInterval) clearInterval(clockInterval); // Prevent multiple timers

  const savedDob = localStorage.getItem("dob");

  if (savedDob) {
    const dob = new Date(savedDob + "T00:00:00");
    const MS_PER_YEAR = 365.2425 * 24 * 60 * 60 * 1000;

    clockInterval = setInterval(() => {
      currentAge = (Date.now() - dob.getTime()) / MS_PER_YEAR;
      computeProgress();
    }, 1000); // Update every second
  }
}

  // ===== Datasets (snakes removed) =====
  const livingBeingLifespan = {
    // Mammals
    Human: 73,
    Dog: 13,
    Cat: 15,
    Elephant: 70,
    Horse: 30,
    Cow: 20,
    Rabbit: 9,
    Mouse: 2,
    Rat: 3,
    Pig: 15,
    Sheep: 12,
    Goat: 15,
    Kangaroo: 20,
    Giraffe: 25,
    Lion: 14,
    Tiger: 16,
    Leopard: 15,
    Cheetah: 12,
    Bear: 25,
    Wolf: 13,
    Deer: 20,
    Camel: 40,
    Dolphin: 40,
    "Blue Whale": 80,
    "Orca (Killer Whale)": 50,
    Bat: 20,
    // Birds
    Parrot: 50,
    Macaw: 60,
    Cockatoo: 70,
    Pigeon: 6,
    Crow: 14,
    Sparrow: 3,
    Eagle: 20,
    Owl: 15,
    Swan: 20,
    Penguin: 20,
    Chicken: 8,
    Duck: 10,
    Goose: 15,
    Falcon: 13,
    Peacock: 20,
    // Reptiles (no snakes)
    Crocodile: 70,
    Alligator: 50,
    Lizard: 5,
    Gecko: 10,
    Chameleon: 7,
    Frog: 10,
    Toad: 12,
    Tortoise: 100,
    "Sea Turtle": 80,
    "Komodo Dragon": 30,
    // Marine Life
    Goldfish: 10,
    "Koi Fish": 40,
    Shark: 30,
    "Great White Shark": 70,
    Salmon: 4,
    Tuna: 15,
    Clownfish: 10,
    Octopus: 3,
    Squid: 2,
    Lobster: 50,
    Crab: 8,
    Starfish: 10,
    Jellyfish: 1,
    // Insects & Arthropods
    Ant: 0.2,
    Bee: 0.3,
    Butterfly: 0.1,
    Dragonfly: 0.5,
    Mosquito: 0.05,
    Cockroach: 1,
    Spider: 2,
    Tarantula: 20,
    Scorpion: 5,
    Grasshopper: 0.5,
    Ladybug: 1,
    // Trees & Plants
    "Oak Tree": 300,
    "Pine Tree": 250,
    "Baobab Tree": 2000,
    Bamboo: 120,
    "Banana Plant": 25,
    "Sequoia Tree": 3000,
    Cactus: 150,
    "Mango Tree": 100,
    "Palm Tree": 80,
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
  const W = canvas.width,
    H = canvas.height;
  const rimTop = 160,
    neckY = H * 0.5,
    rimBottom = H - 160;
  let rimLeft = W * 0.25,
    rimRight = W * 0.75;
  const neckHalf = 12;
  const ctrlTopY = H * 0.28,
    ctrlBottomY = H * 0.72;

  // Parallax tilt
  canvas.addEventListener("mousemove", (e) => {
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
    spd: 0.005 + Math.random() * 0.01,
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
    const dayProg =
      (now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds()) /
      86400; // 0..1
    const arcY = H * 0.12,
      arcR = W * 0.42;
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
    ctx.beginPath();
    ctx.arc(sunX, sunY, 22, 0, Math.PI * 2);
    ctx.fill();

    // Moon (crescent)
    ctx.fillStyle = "rgba(200,220,255,0.9)";
    ctx.beginPath();
    ctx.arc(moonX, moonY, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(moonX + 6, moonY - 2, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = "source-over";
  }

  // ===== Curve helpers =====
  function quadAt(p0, p1, p2, t) {
    return (1 - t) * (1 - t) * p0 + 2 * (1 - t) * t * p1 + t * t * p2;
  }
  function solveTForY(y, y0, y1, y2) {
    const A = y0 - 2 * y1 + y2,
      B = 2 * (y1 - y0),
      C = y0 - y;
    if (Math.abs(A) < 1e-6) return clamp(-C / B, 0, 1);
    const disc = B * B - 4 * A * C;
    const t1 = (-B + Math.sqrt(Math.max(0, disc))) / (2 * A);
    const t2 = (-B - Math.sqrt(Math.max(0, disc))) / (2 * A);
    const c = [t1, t2].filter((t) => t >= 0 && t <= 1);
    return c.length ? c[0] : clamp(t1, 0, 1);
  }
  function leftWallX(y) {
    const t =
      y <= neckY
        ? solveTForY(y, rimTop, ctrlTopY, neckY)
        : solveTForY(y, neckY, ctrlBottomY, rimBottom);
    return y <= neckY
      ? quadAt(rimLeft, W * 0.35, W / 2 - neckHalf, t)
      : quadAt(W / 2 - neckHalf, W * 0.35, rimLeft, t);
  }
  function rightWallX(y) {
    const t =
      y <= neckY
        ? solveTForY(y, rimTop, ctrlTopY, neckY)
        : solveTForY(y, neckY, ctrlBottomY, rimBottom);
    return y <= neckY
      ? quadAt(rimRight, W * 0.65, W / 2 + neckHalf, t)
      : quadAt(W / 2 + neckHalf, W * 0.65, rimRight, t);
  }
  function drawEllipse(cx, cy, rx, ry, fillStyle, strokeStyle, lineWidth = 1) {
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
    if (fillStyle) {
      ctx.fillStyle = fillStyle;
      ctx.fill();
    }
    if (strokeStyle) {
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = strokeStyle;
      ctx.stroke();
    }
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
    ctx.fillStyle = glassGradient;
    ctx.fill();

    // Outer glossy edge
    ctx.lineWidth = 3;
    const edgeGrad = ctx.createLinearGradient(
      rimLeft,
      rimTop,
      rimRight,
      rimBottom
    );
    edgeGrad.addColorStop(0, glassEdge);
    edgeGrad.addColorStop(0.5, "rgba(255,255,255,0.35)");
    edgeGrad.addColorStop(1, glassEdge);
    ctx.strokeStyle = edgeGrad;
    ctx.stroke();

    // Top & bottom rims
    const topRx = (rimRight - rimLeft) * 0.42;
    const bottomRx = topRx;
    const rimRy = 12;
    drawEllipse(W / 2, rimTop, topRx, rimRy, null, outline, 1.25);
    drawEllipse(W / 2, rimBottom, bottomRx, rimRy, null, outline, 1.25);
    // Neck rim
    drawEllipse(
      W / 2,
      neckY,
      neckHalf * 0.9,
      5,
      null,
      "rgba(255,255,255,0.2)",
      1
    );

    // Long specular streaks (moves subtly)
    const t = performance.now() * 0.0002;
    const streakX = lerp(rimLeft + 20, rimRight - 20, Math.sin(t) * 0.5 + 0.5);
    const streakGrad = ctx.createLinearGradient(
      streakX - 30,
      rimTop,
      streakX + 30,
      rimBottom
    );
    streakGrad.addColorStop(0, "rgba(255,255,255,0)");
    streakGrad.addColorStop(0.5, "rgba(255,255,255,0.20)");
    streakGrad.addColorStop(1, "rgba(255,255,255,0)");
    ctx.strokeStyle = streakGrad;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(streakX, rimTop + 10);
    ctx.lineTo(streakX, rimBottom - 10);
    ctx.stroke();

    // Shadow under glass
    const shadowGrad = ctx.createRadialGradient(
      W / 2,
      rimBottom + 40,
      10,
      W / 2,
      rimBottom + 40,
      180
    );
    shadowGrad.addColorStop(0, "rgba(0,0,0,0.35)");
    shadowGrad.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = shadowGrad;
    ctx.beginPath();
    ctx.ellipse(W / 2, rimBottom + 40, 120, 25, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // Draw wooden/metal bases
  function drawStand() {
    const baseGrad = ctx.createLinearGradient(0, 0, 0, 80);
    baseGrad.addColorStop(0, "#553311");
    baseGrad.addColorStop(1, "#2a1508");
    drawEllipse(W / 2, rimBottom + 40, 140, 25, baseGrad, "#111", 2);
    drawEllipse(W / 2, rimTop - 40, 140, 25, baseGrad, "#111", 2);
  }

  // Clips
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

  // ===== Sand drawing =====
  function drawTopSand(progress) {
    const remaining = 1 - progress;
    if (remaining <= 0) return;
    const adjusted = Math.pow(remaining, 0.7); // slower drain, looks fuller

    const levelY = lerp(neckY, rimTop, adjusted);

    ctx.save();
    clipTopBulb();

    const left = leftWallX(levelY),
      right = rightWallX(levelY);
    const midX = (left + right) / 2;
    const rx = (right - left) * 0.48,
      ry = Math.max(5, rx * 0.15);

    const verticalGrad = ctx.createLinearGradient(0, levelY, 0, rimTop);
    verticalGrad.addColorStop(0, sandGradA);
    verticalGrad.addColorStop(1, sandGradB);

    ctx.fillStyle = verticalGrad;
    ctx.beginPath();
    ctx.moveTo(left, levelY);
    ctx.lineTo(leftWallX(neckY), neckY);
    ctx.lineTo(rightWallX(neckY), neckY);
    ctx.lineTo(right, levelY);
    ctx.closePath();
    ctx.fill();

    // surface ellipse
    const dip = lerp(4, 36, 1 - adjusted);
    const surfaceY = levelY + dip * 0.45;
    const surfaceGrad = ctx.createRadialGradient(
      midX,
      surfaceY,
      2,
      midX,
      surfaceY,
      rx
    );
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

    ctx.save();
    clipBottomBulb();

    const left = leftWallX(levelY),
      right = rightWallX(levelY);
    const baseLeft = leftWallX(rimBottom),
      baseRight = rightWallX(rimBottom);
    const midX = (left + right) / 2;

    const moundHeight = Math.min(60, pileHeight * 0.65); // taller, fuller mound

    const peakY = levelY - moundHeight;

    const bodyGrad = ctx.createLinearGradient(0, peakY, 0, rimBottom);
    bodyGrad.addColorStop(0, sandGradA);
    bodyGrad.addColorStop(1, sandGradB);
    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    ctx.moveTo(left, levelY);
    ctx.quadraticCurveTo((left + midX) / 2, peakY, midX, peakY);
    ctx.quadraticCurveTo((right + midX) / 2, peakY, right, levelY);
    ctx.lineTo(baseRight, rimBottom);
    ctx.lineTo(baseLeft, rimBottom);
    ctx.closePath();
    ctx.fill();

    const baseRx = (baseRight - baseLeft) * 0.48;
    const baseRy = Math.max(6, baseRx * 0.16);
    const baseY = rimBottom - 2;
    const baseGlow = ctx.createRadialGradient(
      midX,
      baseY,
      4,
      midX,
      baseY,
      baseRx
    );
    baseGlow.addColorStop(0, "rgba(255,255,255,0.12)");
    baseGlow.addColorStop(1, "rgba(255,255,255,0)");
    drawEllipse(midX, baseY, baseRx, baseRy, baseGlow, "rgba(0,0,0,0.08)", 0.8);

    // highlight streak on mound
    ctx.beginPath();
    ctx.moveTo(midX - 25, peakY + 6);
    ctx.quadraticCurveTo(midX, peakY - 4, midX + 25, peakY + 6);
    ctx.strokeStyle = "rgba(255,255,255,0.15)";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.restore();
    return levelY;
  }

  // Falling stream + grains
  const particles = [];
  function drawStream(topLevelY, bottomLevelY) {
    if (!topLevelY || !bottomLevelY) return 0;
    if (bottomLevelY <= neckY + 2) return 0;

    ctx.save();
    const startY = neckY + 1.5,
      endY = bottomLevelY - 2;
    const topWidth = 10,
      bottomWidth = 3;

    const streamGrad = ctx.createLinearGradient(W / 2, startY, W / 2, endY);
    streamGrad.addColorStop(0, sandGradA);
    streamGrad.addColorStop(1, sandGradB);

    ctx.beginPath();
    ctx.moveTo(W / 2 - topWidth / 2, startY);
    ctx.lineTo(W / 2 + topWidth / 2, startY);
    ctx.lineTo(W / 2 + bottomWidth / 2, endY);
    ctx.lineTo(W / 2 - bottomWidth / 2, endY);
    ctx.closePath();
    ctx.fillStyle = streamGrad;
    ctx.shadowBlur = 6;
    ctx.shadowColor = "rgba(0,0,0,0.2)";
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.restore();

    // grains
    if (Math.random() < 0.7) {
      particles.push({
        x: W / 2 + (Math.random() - 0.5) * 3,
        y: startY,
        vx: (Math.random() - 0.5) * 0.5,
        vy: 2 + Math.random() * 2,
        r: 1 + Math.random() * 1.5,
        life: 40,
      });
    }
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

    // return normalized stream length for sound intensity
    return clamp((endY - startY) / (rimBottom - rimTop), 0, 1);
  }

  // Sparkles (UI + in-canvas)
  const barSparkles = [];
  let barSparklesActive = false;
  const finalSparkles = [];
  let finalSparklesActive = false;
  function drawBarSparkles(bottomLevelY) {
    if (!meterFill) return;
    const barWidth = meterFill.offsetWidth,
      barHeight = meterFill.offsetHeight;
    if (!barSparklesActive && displayProgress >= 1) barSparklesActive = true;
    if (!barSparklesActive) return;

    if (Math.random() < 0.3) {
      barSparkles.push({
        x: Math.random() * barWidth,
        y: Math.random() * barHeight,
        r: 3 + Math.random() * 3,
        life: 60 + Math.random() * 30,
        vx: (Math.random() - 0.5) * 1,
        vy: -0.5 + Math.random() * 0.5,
      });
      if (bottomLevelY) {
        finalSparkles.push({
          x: W / 2 + (Math.random() - 0.5) * 80,
          y: bottomLevelY - 5 + (Math.random() - 0.5) * 20,
          r: 3 + Math.random() * 5,
          life: 50 + Math.random() * 50,
          vx: (Math.random() - 0.5) * 1,
          vy: -0.2 + Math.random() * 0.5,
        });
      }
    }
    barSparkles.forEach((s, i) => {
      s.life--;
      s.x += s.vx;
      s.y += s.vy;
      const sparkle = document.createElement("div");
      sparkle.style.position = "absolute";
      sparkle.style.width = `${s.r * 2}px`;
      sparkle.style.height = `${s.r * 2}px`;
      sparkle.style.left = `${meterFill.offsetLeft + s.x}px`;
      sparkle.style.top = `${meterFill.offsetTop + s.y}px`;
      sparkle.style.borderRadius = "50%";
      sparkle.style.background = "white";
      sparkle.style.opacity = Math.min(s.life / 50, 1);
      sparkle.style.pointerEvents = "none";
      sparkle.style.zIndex = 1000;
      document.body.appendChild(sparkle);
      if (s.life <= 0) barSparkles.splice(i, 1);
      setTimeout(() => sparkle.remove(), 16);
    });
  }
  function drawFinalSparkles(bottomLevelY) {
    if (!finalSparklesActive && displayProgress >= 1)
      finalSparklesActive = true;
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
      s.life--;
      s.x += s.vx;
      s.y += s.vy;
      ctx.fillStyle = `rgba(255,255,255,${Math.min(s.life / 50, 1)})`;
      ctx.shadowBlur = 8;
      ctx.shadowColor = "white";
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      if (s.life <= 0) finalSparkles.splice(i, 1);
    }
  }

  // ===== Progress & intro =====
  let targetProgress = 0,
    displayProgress = 0;
  let introStart = null;
  const introDuration = 18000;

  function computeProgress() {
    const lifespan = Math.max(1, Number(lifespanInput.value) || 100);
    ageSlider.max = lifespan;
    ageSlider.value = clamp(currentAge, 0, lifespan);
    targetProgress = clamp(currentAge / lifespan, 0, 1);
    yearsLived.textContent = currentAge.toFixed(2) + " years";
    yearsLeft.textContent =
      Math.max(0, lifespan - currentAge).toFixed(2) + " years";
    progressText.textContent =
      (targetProgress * 100).toFixed(2) + `% of ${lifespan} years`;
  }

  // ===== WebAudio sand sound =====
  let audioCtx = null,
    noiseGain = null,
    band = null;
  function initAudio() {
    if (audioCtx) return;
    try {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      // Pink-ish noise buffer
      const bufferSize = 2 * audioCtx.sampleRate;
      const noiseBuffer = audioCtx.createBuffer(
        1,
        bufferSize,
        audioCtx.sampleRate
      );
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0,
        b1 = 0,
        b2 = 0,
        b3 = 0,
        b4 = 0,
        b5 = 0,
        b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.969 * b2 + white * 0.153852;
        b3 = 0.8665 * b3 + white * 0.3104856;
        b4 = 0.55 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.016898;
        output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        output[i] *= 0.11; // normalize
        b6 = white * 0.115926;
      }
      const src = audioCtx.createBufferSource();
      src.buffer = noiseBuffer;
      src.loop = true;

      band = audioCtx.createBiquadFilter();
      band.type = "bandpass";
      band.frequency.value = 1400;
      band.Q.value = 0.8;

      noiseGain = audioCtx.createGain();
      noiseGain.gain.value = 0.0; // start silent

      src.connect(band);
      band.connect(noiseGain);
      noiseGain.connect(audioCtx.destination);
      src.start();
    } catch (e) {
      /* ignore if audio unavailable */
    }
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
      noiseGain.gain.value = isMuted ? 0 : 0; //increase volume
    }
  }



  function updateSandSound(intensity) {
    if (!noiseGain) return;

    // if (isMuted) {
    //   // force silence, don’t let intensity update volume
    //   noiseGain.gain.cancelScheduledValues(audioCtx.currentTime);
    //   noiseGain.gain.setValueAtTime(0, audioCtx.currentTime);
    //   return;
    // }

    // normal operation
    const g = Math.pow(clamp(intensity, 0, 1), 0.7) * 0; //increase volume
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
  function restartIntro() {
    displayProgress = 0;
    introStart = null;
  }

  // ===== Controls / events =====
  if (countrySelect) {
    countrySelect.addEventListener("change", () => {
      if (countrySelect.value) {
        lifespanInput.value = countrySelect.value;
        restartIntro();
      }
    });
  }
  if (livingBeingInput) {
    livingBeingInput.addEventListener("change", () => {
      const chosen = livingBeingInput.value;
      if (livingBeingLifespan[chosen]) {
        localStorage.setItem("livingBeing", chosen);
        if (chosen === "Human") {
          if (countrySelect) countrySelect.disabled = false;
        } else {
          if (countrySelect) {
            countrySelect.disabled = true;
            countrySelect.selectedIndex = 0;
          }
        }
        lifespanInput.value = livingBeingLifespan[chosen];
        localStorage.setItem("lifespan", lifespanInput.value);
        restartIntro();
      }
    });
  }

  // Any user gesture should enable audio (policy-friendly)
  ["click", "touchstart", "keydown", "input", "change"].forEach((evt) => {
    document.addEventListener(evt, maybeStartAudio, {
      once: true,
      passive: true,
    });
  });

  ageSlider.addEventListener("input", () => {
    currentAge = parseFloat(ageSlider.value) || 0;
    if (dobInput) dobInput.value = "";
    restartIntro();
    saveState();
    updateFromSlider();
    
  });
  dobInput.addEventListener("input", () => {
    if (!dobInput.value) return;
    const dob = new Date(dobInput.value + "T00:00:00");
    currentAge = (Date.now() - dob.getTime()) / MS_PER_YEAR;
    restartIntro();
    saveState();
    updateFromDOB();
    
  });
  if (useDOBBtn) {
    useDOBBtn.addEventListener("click", () => {
      if (!dobInput.value) return;
      const dob = new Date(dobInput.value + "T00:00:00");
      currentAge = (Date.now() - dob.getTime()) / MS_PER_YEAR;
      restartIntro();
      canvas.scrollIntoView({ behavior: "smooth", block: "center" });
      saveState();
      updateFromDOB();
    });
  }
  lifespanInput.addEventListener("input", () => {
    restartIntro();
    saveState();
    updateStats();
  });

  function saveState() {
    localStorage.setItem("lifespan", lifespanInput.value);
    localStorage.setItem("age", currentAge);
    localStorage.setItem("dob", dobInput.value);
    if (livingBeingInput)
      localStorage.setItem("livingBeing", livingBeingInput.value);
    if (
      livingBeingInput &&
      livingBeingInput.value === "Human" &&
      countrySelect &&
      countrySelect.value
    ) {
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
    ageSlider.max = lifespan;
    ageSlider.value = clamp(ageYears, 0, lifespan);
    updateStats();
  }

  // Kick off
  computeProgress();
  requestAnimationFrame(draw);

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
        if (countrySelect) {
          countrySelect.disabled = false;
          if (savedCountry) countrySelect.value = savedCountry;
        }
      } else {
        if (countrySelect) countrySelect.disabled = true;
      }
    } else {
      if (livingBeingInput) livingBeingInput.value = "Human";
      lifespanInput.value = livingBeingLifespan["Human"];
      if (countrySelect) {
        countrySelect.disabled = false;
        if (savedCountry) countrySelect.value = savedCountry;
      }
    }

    if (savedDob) {
      dobInput.value = savedDob;
      const dob = new Date(savedDob + "T00:00:00");
      currentAge = (Date.now() - dob.getTime()) / MS_PER_YEAR;
    } else if (savedAge) {
      currentAge = parseFloat(savedAge) || 0;
      ageSlider.value = currentAge;
    }
    ageSlider.max = Math.max(1, Number(lifespanInput.value) || 100);
    ageSlider.value = currentAge;
    updateStats();
    initializeClock();
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
      if (exactAgeEl)
        exactAgeEl.textContent = `${exactYears} years, ${months} months, ${leftoverDays} days`;
    }

    document.getElementById("yearsLived").textContent = Math.floor(ageYears);
    const yearsLeftVal = lifespan - ageYears;
    document.getElementById("yearsLeft").textContent =
      yearsLeftVal > 0 ? yearsLeftVal.toFixed(2) : "0";

    const progress = Math.min((ageYears / lifespan) * 100, 100);
    document.getElementById("progressText").textContent =
      progress.toFixed(2) + "%";
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
    "Your life is ticking away like a clock. The question is, will you make it worthwhile before it stops?",
  ];

  // ====================
  // 🧠 Quotes Logic (Refactored)
  // ====================
  let quoteIndex = parseInt(localStorage.getItem("quoteIndex")) || 0;
  let quoteInterval = null;

  const quoteText = document.getElementById("quoteText");
  const nextQuoteBtn = document.getElementById("nextQuoteBtn");
  const prevQuoteBtn = document.getElementById("prevQuoteBtn");
  const pauseQuoteBtn = document.getElementById("pauseQuoteBtn");
  const quoteCounter = document.getElementById("quoteCounter");
  const quoteBox = document.getElementById("quoteBox");

  function showQuote(index) {
    if (!quoteText) return;

    quoteText.classList.remove("visible");

    setTimeout(() => {
      quoteText.textContent = `"${sadhguruQuotes[index]}" — Sadhguru`;
      quoteText.classList.add("visible");
      if (quoteCounter) {
        quoteCounter.textContent = `Quote ${index + 1} of ${
          sadhguruQuotes.length
        }`;
      }
    }, 600);

    localStorage.setItem("quoteIndex", index);
  }

  function startQuoteAutoCycle() {
    if (quoteInterval) return;
    if (pauseQuoteBtn) pauseQuoteBtn.textContent = "Pause";
    quoteInterval = setInterval(() => {
      quoteIndex = (quoteIndex + 1) % sadhguruQuotes.length;
      showQuote(quoteIndex);
    }, 15000);
  }

  function stopQuoteAutoCycle() {
    clearInterval(quoteInterval);
    quoteInterval = null;
    if (pauseQuoteBtn) pauseQuoteBtn.textContent = "Play";
  }

  // Button click = new quote instantly
  if (nextQuoteBtn) {
    nextQuoteBtn.addEventListener("click", () => {
      stopQuoteAutoCycle();
      quoteIndex = (quoteIndex + 1) % sadhguruQuotes.length;
      showQuote(quoteIndex);
    });
  }

  // Previous button
  if (prevQuoteBtn) {
    prevQuoteBtn.addEventListener("click", () => {
      stopQuoteAutoCycle();
      quoteIndex =
        (quoteIndex - 1 + sadhguruQuotes.length) % sadhguruQuotes.length;
      showQuote(quoteIndex);
    });
  }

  // Pause/Play button
  if (pauseQuoteBtn) {
    pauseQuoteBtn.addEventListener("click", () => {
      if (quoteInterval) {
        stopQuoteAutoCycle();
      } else {
        startQuoteAutoCycle();
      }
    });
  }

  // Initial display on page load
  showQuote(quoteIndex);
  startQuoteAutoCycle();

  // ====================
  // 🧠 Sutras Section
  // ====================
  const sadhguruSutras = [
    "SUTRA #1 Karma is about becoming the source of one’s own creation. In shiﬅing responsibility from heaven to oneself, one becomes the very maker of one’s destiny.",
    "SUTRA #2 Ultimately, life is neither suffering nor bliss. It is what you make it.",
    "SUTRA #3 There is only one crime against life: to make believe that you are something other than life.",
    "SUTRA #4 However profound it is, everything that comes from memory spells karmic bondage.",
    "SUTRA #5 Pure intelligence creates memory out of itself; the rest of creation projects memory as intelligence.",
    "SUTRA #6 In losing awareness of self is the trap of karma. The hunter becomes the hunted, the architect becomes the bonded laborer, the creator becomes creation. A spider trapped in a web of its own making is a tragedy.",
    "SUTRA #7 If you take more karmic load now, when you are well and capable, later you will walk “hands-free”!",
    "SUTRA #8 If you experience this moment just once, you will never be able to fall out of it.",
    "SUTRA #9 It is not about performing miracles. It is about recognizing the miracle of life that you are.",
    "SUTRA #10 As far as the laws of existence are concerned, there is no good and bad, no crime and punishment. It is just that for every action, there is a consequence.",
    "SUTRA #11 When there is no imprint of karma in conscious experience, every action and experience becomes liberating.",
    "SUTRA #12 You cannot own life; you can only live it.",
    "SUTRA #13 Right now, you are like a bubble that says “The air that I hold in my lungs is my air.” You still have to exhale!",
    "SUTRA #14 In maintaining distance from your thought and emotion, you can become available to the grace of the greatest beings of the past.",
    "SUTRA #15 You have the choice and ability to be any way you want in a given moment. That is the freedom and the curse. Most human beings are suffering their freedom.",
    "SUTRA #16 Every human being is in the process of becoming divine. . . . Collaborating with Nature’s plan is all you need to do.",
    "SUTRA #17 Those who long to leave a footprint shall never fly.",
  ];

  let sutraIndex = parseInt(localStorage.getItem("sutraIndex")) || 0;
  let sutraInterval = null;

  const sutrasText = document.getElementById("sutrasText");
  const sutrasBtn = document.getElementById("sutrasBtn");
  const sutrasPrevBtn = document.getElementById("sutrasPrevBtn");
  const sutrasPauseBtn = document.getElementById("sutrasPauseBtn");
  const sutraCounter = document.getElementById("sutraCounter");
  const sutrasSection = document.querySelector(".sutras-section");

  function showSutra(index) {
    if (!sutrasText) return;

    sutrasText.classList.remove("visible");

    setTimeout(() => {
      sutrasText.textContent = sadhguruSutras[index] + " — Sadhguru";
      sutrasText.classList.add("visible");
      if (sutraCounter) {
        sutraCounter.textContent = `Sutra ${index + 1} of ${
          sadhguruSutras.length
        }`;
      }
    }, 600);

    localStorage.setItem("sutraIndex", index);
  }

  function startSutraAutoCycle() {
    if (sutraInterval) return;
    if (sutrasPauseBtn) sutrasPauseBtn.textContent = "Pause";
    sutraInterval = setInterval(() => {
      sutraIndex = (sutraIndex + 1) % sadhguruSutras.length;
      showSutra(sutraIndex);
    }, 15000);
  }

  function stopSutraAutoCycle() {
    clearInterval(sutraInterval);
    sutraInterval = null;
    if (sutrasPauseBtn) sutrasPauseBtn.textContent = "Play";
  }

  if (sutrasBtn) {
    sutrasBtn.addEventListener("click", () => {
      stopSutraAutoCycle();
      sutraIndex = (sutraIndex + 1) % sadhguruSutras.length;
      showSutra(sutraIndex);
    });
  }

  if (sutrasPrevBtn) {
    sutrasPrevBtn.addEventListener("click", () => {
      stopSutraAutoCycle();
      sutraIndex =
        (sutraIndex - 1 + sadhguruSutras.length) % sadhguruSutras.length;
      showSutra(sutraIndex);
    });
  }

  if (sutrasPauseBtn) {
    sutrasPauseBtn.addEventListener("click", () => {
      if (sutraInterval) {
        stopSutraAutoCycle();
      } else {
        startSutraAutoCycle();
      }
    });
  }

  // Handle visibility and initial load
  if (sutrasSection) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            sutrasSection.classList.add("visible");
            showSutra(sutraIndex);
            startSutraAutoCycle();
            observer.unobserve(sutrasSection);
          }
        });
      },
      { threshold: 0 }
    );

    observer.observe(sutrasSection);

    // If already in view on load
    if (sutrasSection.getBoundingClientRect().top < window.innerHeight) {
      sutrasSection.classList.add("visible");
      showSutra(sutraIndex);
      startSutraAutoCycle();
    }
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
    "Life is not about searching for meaning. It is about experiencing it fully.",
  ];
  const pebblesText = document.getElementById("pebblesText");
  const pebblesBtn = document.getElementById("pebblesBtn");
  const pebblesPrevBtn = document.getElementById("pebblesPrevBtn");
  const pebblesPauseBtn = document.getElementById("pebblesPauseBtn");
  const pebbleCounter = document.getElementById("pebbleCounter");
  const pebblesSection = document.querySelector(".pebbles-section");

  let pebbleIndex = parseInt(localStorage.getItem("pebbleIndex")) || 0;
  let pebbleInterval = null;

  function showPebble(index) {
    pebblesText.classList.remove("visible");

    setTimeout(() => {
      pebblesText.textContent = pebblesOfWisdom[index] + " — Sadhguru";
      pebblesText.classList.add("visible");
      if (pebbleCounter) {
        pebbleCounter.textContent = `Pebble ${index + 1} of ${
          pebblesOfWisdom.length
        }`;
      }
    }, 600);

    localStorage.setItem("pebbleIndex", index);
  }

  function startPebbleAutoCycle() {
    if (pebbleInterval) return; // Prevent multiple intervals
    if (pebblesPauseBtn) pebblesPauseBtn.textContent = "Pause";
    pebbleInterval = setInterval(() => {
      pebbleIndex = (pebbleIndex + 1) % pebblesOfWisdom.length;
      showPebble(pebbleIndex);
    }, 30000);
  }

  function stopPebbleAutoCycle() {
    clearInterval(pebbleInterval);
    pebbleInterval = null;
    if (pebblesPauseBtn) pebblesPauseBtn.textContent = "Play";
  }

  // manual next
  if (pebblesBtn) {
    pebblesBtn.addEventListener("click", () => {
      stopPebbleAutoCycle();
      pebbleIndex = (pebbleIndex + 1) % pebblesOfWisdom.length;
      showPebble(pebbleIndex);
    });
  }

  // manual previous
  if (pebblesPrevBtn) {
    pebblesPrevBtn.addEventListener("click", () => {
      stopPebbleAutoCycle();
      pebbleIndex =
        (pebbleIndex - 1 + pebblesOfWisdom.length) % pebblesOfWisdom.length;
      showPebble(pebbleIndex);
    });
  }

  // pause/play button
  if (pebblesPauseBtn) {
    pebblesPauseBtn.addEventListener("click", () => {
      if (pebbleInterval) {
        stopPebbleAutoCycle();
      } else {
        startPebbleAutoCycle();
      }
    });
  }

  // Handle visibility and initial load
  if (pebblesSection) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            pebblesSection.classList.add("visible");
            showPebble(pebbleIndex);
            startPebbleAutoCycle();
            observer.unobserve(pebblesSection);
          }
        });
      },
      { threshold: 0 }
    );

    observer.observe(pebblesSection);

    // If already in view on load
    if (pebblesSection.getBoundingClientRect().top < window.innerHeight) {
      pebblesSection.classList.add("visible");
      showPebble(pebbleIndex);
      startPebbleAutoCycle();
    }
  }

  // ====================
  // 🧠 Book Excerpts Section
  // ====================
  const bookExcerpts = [
    "Death is the most fundamental question. Yet, people can ignore it, avoid it and just live on in their ignorance simply because all kinds of idiotic stories have been spread in the world in the name of religion.",
    "What you are calling as life, right now, is like soap bubbles being blown. The entire Yogic process or the entire spiritual process is to wear this bubble thin, so that one day when it bursts, there is absolutely nothing left and it moves from the bondage of existence to the freedom of non-existence, or Nirvana",
    "No two people in the world live their lives the same way. Similarly, no two people die the same way. People may die in the same situation, of the same cause, but still they don’t die the same way.",
    "When the body is still strong, what is meant to be can always be transcended.",
    "Mahasamadhi is the end of the game. The cycle is over. There is no question of rebirth; it is complete dissolution. You can say this person is truly no more.",
    "Most people in the world believe that if they die in their sleep, it is wonderful. What a horrible way to go!",
    "A bodiless being is a completely defenceless life. That is why that aspect of life must be conducted with utmost responsibility. When someone gives this being a little bit of help at the last moment, it will go a long way. Most of their sadhana for the next time will be taken care of at that moment itself.",
    "As we have responsibilities for the living, we have responsibilities for the dead.",
    "I want you to understand that your grief is not because someone has died. One life going away does not mean anything to you. Thousands of people in the world die in a day. But it does not leave a vacuum in you. You are still partying. The problem is, this particular life going away leaves a hole in your life.",
    "In a way, everyone is a ghost. Whether you are a ghost with the body or without a body is the only question.",
    "Right now, most people are not even able to handle what is happening in this life, so why do they want to dig into their previous lives? They don’t know how to handle the thoughts, emotions and relationships of this life. How will they handle the thoughts, emotions and relationships of many lives?",
    "We can make this life the last one for you but we cannot make this the most wonderful one. That only you have to do. For that, you must do sadhana. You must promise me that.",
    "Emotion is just the juicier part of the thought.",
    "Whatever you do, you want to experience life in a bigger way than you are experiencing it right now.",
    "Anger, resentment, hatred–these are all poisons that you drink, and expect somebody else to die. Life doesn't work like that.",
    "To be peaceful is the fundamental of your life.",
    "You could simply be loving with just about anything, and that is how you should be with the whole existence.",
    "A true friend is someone who has the courage to tell you what shit you are, and still be loving and nice to you.",
    "The very nature of how this biological body gets created is very directly connected to the nature of the earth, the sun, and the moon.",
    "Relationships are an opportunity to achieve some kind of union which will pave the way for a greater possibility.",
    "A satsangh is not a spiritual club… your whole life should become a satsangh.",
    "Sat in Sanskrit means truth and sangh means to be in communion. In other words, it is a way of being in touch with truth.",
    "To be in touch with truth, we do not have to go to the core of the galaxy, because the core of a human being is also the same thing.",
    "This kind of perception is just a reinforcement of bondage, because you experience things only the way your mind is conditioned to experience them all the time. - Don't polish your ignorance... It may shine.",
    "This splitting of the world between you and the other has happened to you out of your identification with the little things which you are not.",
    "The very process of satsangh means that you go into a state where you do not exist. You cease to exist as a person. You stop identifying with yourself so that the subjectivity becomes everything. There is nothing to perceive. You simply sit there. This is the very basis of everything that you can call spiritual.",
    "That is why I say, do not try to become willing. Just stop identifying yourself with what you consider to be yourself. But right now you cannot simply be, because your mind goes on identifying itself with anything and everything. If you have to identify with something, do not identify yourself with that which boosts you, identify yourself with that which breaks you. Don’t Polish Your Ignorance …It May Shine  ",
    "How aware you are is how alive you are. From life to death this is all the difference.",
    "An ashram is not your home. An ashram is only for those people who have chosen to be homeless.",
    "Faith means who you are right now is not important for you. Something else has become far more important than you.",
    "Your survival happens only with receptivity, but in your need to survive you are just destroying the very basis of your survival.",
    "Presence cannot be practiced. It cannot be created. If you allow it, it will happen.",
    "You are only polishing your ignorance. The shinier it becomes, the more dangerous it becomes, because you cannot grasp it anymore.",
    "You just see how to make your seeking the most important thing in your life, even bigger than your life. If you do that, the rest we will take care of.",
    "Love must be an outpouring of who you are. It cannot be practiced.",
    "If you give a conscious expression to this deep longing for expansion within you, then we say it is a spiritual process.",
    "The necessary awareness is absent. That is why the fear of death exists.",
    "Relationships are necessary to exist in the world; whether you keep them beautiful, or ugly, is all the choice that you have.",
    "If you become a source of joy by yourself, and your relationships are about sharing your joy, not squeezing joy out of somebody, then you would have wonderful relationships with everybody.",
    "Surrender is not an act. Surrender is a certain quality.",
    "The attachment is not to somebody. This must be clearly understood. The attachment is to your body.",
    "Not being identified does not mean not being involved. It just means not being entangled.",
    "Stress is a part of life only if you have lost your sanity.",
    "A thinking mind, a questioning mind, or a doubting mind cannot know faith. It is just a waste of time.",
    "If you use your emotions and try to reach your ultimate nature, we call this bhakti yoga. If you use your intelligence and try to reach your ultimate nature, we call this gnana yoga. If you try to use your physical body, or action, and try to reach your ultimate nature, we call this karma yoga. If you use your inner energies to transform them and reach your ultimate nature, we call this kriya yoga. So one is the yoga of devotion, another is the yoga of intelligence, another is the yoga of action, and the fourth is the yoga of transforming energies.",
    "Your mind is like a tape recorder…It is always listening to you and it is very faithfully recording everything… Now the problem is that … at the wrong time it plays the wrong music.",
    "If you are truly intelligent, you should not be doing what people expect; you should be just doing what is best for yourself and everybody around you even if it is at the cost of being unpopular.",
    "There is sufficient unpleasantness in the world. Where is the need for you to make yourself unpleasant?",
    "People think by knowing other people they can become effective… but it is not true. If you know yourself, you can become very effective in the world.",
    "You just have to judge situations. You do not have to judge people.",
    "The mind is physical; it is subtle, very subtle, but still it is physical.",
    "The mind is incapable of being aware. It is only because of the mind that you have become unaware.",
    "The whole existence is just one energy manifesting itself in a million different ways.",
    "Desire is a natural longing. Love is an emotional expression of that desire.",
    "Whenever you are deeply involved, you become aware. When you are being fanatical, there is no possibility of awareness.",
    "Anybody who performs actions without being aware of the consequences will live his life foolishly.",
    "When you know the pain of ignorance; when you really know the pain of ignorance, then a master arises.",
    "All you want to do is be joyful and blissful within you, but you want to go around the world and get there…If it is within you, all you have to do is turn around and face it.",
    "Once you had a glimpse of something, it is foolish to try to jump again and again, to have a glimpse of it. It is time to build a ladder to scale the wall.",
    "Imagination is one freedom you have.",
    "The presence of any guru with the potential to offer something is a blessing…His very presence is a blessing.",
    "Memory creates a hallucination of the past. Desire creates a hallucination of the future.",
    "Life does not need meaning because it is so complete by itself.",
    "You are the way you are only because of yourself, nobody else but yourself.",
    "You can play with creation. You really cannot create anything.",
    "You always love dead people because you …can twist them to your convenience. If you fall in love with the living, this moment there is love; the next moment there is a conflict, the next moment frustration, and the next moment disappointmen.",
    "Only if you are on the path of bhakti or devotion, you walk joyously. The intellectual path is always a painful process.",
    "I am not against pleasure. I am all for pleasure, but I think it is stupid to go for small pleasures. That is all.",
    "Intensity means… existing here as a piece of life and nothing else… If you just remain a piece of life, your reaching your ultimate nature is a very natural process.",
    "Anything in existence, if it travels at the speed of light, it becomes light. Travel at the pace that I move, and you will become me.",
    "When you are in a desert, and people are thirsting for water, and you have an oasis with you, it becomes your responsibility to let people know of it,",
    "A Guru is not here to interpret the scriptures and books. He is here to bring out the possibilities within you that you by yourself may not be able to explore.",
    "A Guru is someone who threatens you and destroys you the way you are, so that you can become the way the Creator intended you to be. If you are very comfortable sitting with your Guru, he is not your Guru, because he is only supporting your limitations, not threatening them. If you feel threatened when you sit with him, if who you are becomes so insufficient in his presence, if who you are trembles in his presence, then he is your Guru. If in his presence you don’t know what to do, but still everything happens, then he is definitely your Guru.",
    "People irritate you because you have fixed notions about what is right and what is wrong.",
    "You will become spiritual only when the realm of your experience transcends the physical reality, and you begin experiencing that which is not physical.",
    "If you ask a tree how he feels to know that he is spreading his fragrance and making people happy, I don’t think a tree looks at it that way. I am just like that, it is just my nature to be like this.",
    "To be in dhyana means to be in that state where you are in touch with the source which is the basis of this body and this mind.",
    "There is too much talk about God, godmen and goddamn men only because most of humanity has not realized the immensity of being human. Spirituality is not about becoming superhuman; it is about realizing that being human is super.",
    "Meditation means you stop your nonsense and listen. It is not the time for you to speak. You speak throughout the day, but at least for some time in a day, allow him to speak. Let us see what God has got to say.",
    "Enlightenment means a heightened level of perception, in an ultimate way. If your perception is fully on, you receive everything that can be received and know life in its totality—we would call that Enlightenment.",
    "The most important thing about playing a game or being in a sport is that you cannot do sport half-hearted. You can go to your work half-hearted, you can even handle your marriage half-hearted, but you cannot play a game half-hearted. Either you throw yourself into it, or there is no game, it is only a torture. The same is true with life.",
    "What you worship is not the point. How you worship is not the point at all. The whole point is just how deeply you relate …",
    "Everyone can love God, as He does not demand anything from you. But to love the one next to you right now costs life. It takes much courage to do this.",
    "If you were not restricted by the limitations of logic, if all of you were simply open, I would not waste your time and my time talking. Everything that needs to happen will happen just by the presence. My work is not about changing your attitude but to touch you at your core. A touch that will leave you not changed, but transformed …",
    "The spiritual process is not about going to the temple, mosque or church. It is about enhancing your perception about this piece of life, about knowing this piece of life from its origin to its ultimate.",
    "If you do not do what you cannot do, there is no problem with it. But if you do not do what you can do, you are a tragedy.",
    "Blessed is the one who has clarity of Vision of the here and hereafter. May you have the Vision of the Beyond. Blessings & Grace —Sadhguru",
    "Spirituality is not about scriptures; nor is it about some God up there; nor is it about looking up or down or around. It is about looking inward.",
    "I’ve always believed doors should open for you not because of your qualifications, but because of who you are.",
    "I never thought about what I wanted to become in life. I only thought about how I wanted to live my life. And I knew that the how could be determined within yourself and by yourself.",
    "Without ignorance, you cannot exist in the body, he was to say later. An enlightened being has to know those tricks, or else he cannot remain in the physical. From this point of view, there are no enlightened beings on this planet. Most people are compulsively ignorant, and a few are consciously ignorant, that’s all.",
    "If you take every step of your life in gratitude, if you see how small you are, you walk on this planet gently, like a pilgrim; this life could be your pilgrimage.",
    "Sadhguru quite genuinely holds that whatever the provocation, joy is always a very real choice.",
    "It helps to remember that nobody likes to be managed. But everybody longs to be included.",
    "If a spiritual practice is part of your life, it doesn’t work. If it has become you, it is still not enough. It has to become more than you, more than your life. That’s what brahmacharya is about.",
    "When you simply look without the dimension of your logical thinking, there is no time and space, he once said. If you simply know how to look, everything is right here all the time. This moment is eternity; here is everywhere.",
    "Our lives become beautiful not because we are perfect. Our lives become beautiful because we put our hearts into what we do. You will never know the beauty of life unless you are deeply involved. At the same time, you cannot enjoy the beauty of involvement if you get attached. If you don’t get this subtle distinction, you will suffer.",
    "The very Creator is within you; what are you thinking about? The very source of creation is throbbing within you. What are you thinking about that is more important than this?",
    "– if you set a goal for your life from where you are, you can only set a goal according to your present level of understanding and knowledge,",
    "We are absolutely devoted to the process. Because if you do not do what you’re doing right now well, your goal is just going to be a fancy desire, isn’t it? - Youth and Truth",
    "Your ability to do things is enhanced only when you’re absolutely devoted to the process you’re involved in.",
    "You’re only working because of “What will I get? What will I get?” What the hell will you get? You’ll die one day, that’s all.",
    "Success does not come because you desire it. It will not happen to those who are just desiring it; it will only happen to those who are doing the right things right now.",
    "Sadhguru: Suppose you’re successful by chance, you’re always insecure and fearful, isn’t it?",
    "You want to run either because a dog is chasing you or because your tail is on fire. No, that’s not a pleasant way to run. One thing is, it is important that you run fast. Another thing is that your experience of running is fantastic. Isn’t that important?",
    "You don’t educate for survival. You educate because you want to expand your horizons. You want to make this life into a worthwhile life. That’s what matters. Will it be in conflict with many people? Of course, it will be. Because they think you won’t make it.",
    "If you have to bring relevance into your life, you must extinguish your confidence and bring clarity.",
    "Youth is a state of tremendous energy. This could be transformed into a beautiful or ugly expression of humanity, a great possibility or a disaster.",
    "If the world was guided by youth, it would be a better place. They are the ones who are most alive, idealistic, and energetic.",
    "Youth are natural seekers of truth. Time to empower them with the needed clarity, commitment, and courage to find their truth.",
    "If the youth of the world stands up for raising inclusive consciousness, we can address every problem on the planet.",
    "Hundreds and thousands of people die every moment, yet the foolish man considers himself immortal and is not prepared for death. This is the greatest wonder of life.",
    "If you are aware of the mortal nature of your life, where will you have the time to be angry at someone, to quarrel with someone, or to do anything foolish in life?",
    "If you want to live a full life, you should not look at your mortal nature at a particular age, but every day.",
    "Elemental memory and atomic memory, both together, constitute the inanimate memory. This memory governs the inanimate (inert) aspects of life.",
    "The air is alive, a rock is alive, a tree is alive, an animal is alive, a bird is alive, and a human being is also alive. The only difference is that the level of their intentions is different, the level of intelligence is different, and, above all, they have different dimensions of memory. That is all there to it.",
    "The essence of the entire yogic process or the entire spiritual process is to make this bubble so thin that on the day it bursts, nothing is left behind. Then it moves from the bondage of existence to the freedom of non-existence, or Nirvana.",
    "It doesn't matter if he becomes a spiritual guru or lives an ordinary life. Wherever he is, people will not be able to ignore that existence because there will be a special level of activity and determination there. - Death book",
    "The physical body, mental body, and energy body—all three of these are physical in nature.",
    "The fourth layer of the 'self' is called the Vijnanamaya Kosha, which is related to knowledge. The word Vijnana means special or extraordinary knowledge, or knowledge that is beyond sensory perception. This is the celestial body. It is an unstable or transient body—in a state between the physical and the non-physical. It is neither physical nor non-physical. It is like a link between the two. This is not at your current level of experience because your experience is limited to the five senses, and these senses cannot experience the non-physical. If you consciously touch this dimension, your ability to know about cosmic phenomena will change drastically.",
    "If you want to be fully conscious at the moment of death, you must live a conscious life. Otherwise, you cannot be conscious in that moment in any way. One who is conscious can leave their life in whatever way they wish. But those who are unconscious have to go through a fixed path—because their life was a bondage, their death is also a bondage. If, at the moment of death, a person can remain one hundred percent aware, they will not have to go through rebirth. They will not take on another body—they will be liberated.",
    "Karma simply means we have created the blueprint for our lives. It means we are the makers of our own fate. When we say “This is my karma,” we are actually saying “I am responsible for my life.”",
    "karma is action on three levels: body, mind, and energy. Whatever you do on these three levels leaves a certain residue or imprint upon you.",
    "karma is like old software that you have written for yourself unconsciously.",
    "The karmic mechanism is ceaseless. Every mental fluctuation in you creates a chemical reaction, which then proceeds to provoke a physical sensation. This sensation, in turn, reinforces the chemical reaction, which then strengthens the mental fluctuation. Over time, your very chemistry is determined by a series of unconscious reactions to sensory and mental stimuli.",
    "Your intention makes all the difference. If you say something prompted by love, and another person gets hurt, that is his karma, not yours. But if you say something out of hatred and another person has no problem with it, it is good karma for them and not for you! You still acquire negative karma. How the recipient of your hatred reacts is not the point. The accumulation of karma is determined by your intention, not merely by its impact on someone else.",
    "When your actions are no longer about you, when they are simply based on the demands of the situation, when narrow self-interest no longer fuels your volition, you have reached the end of karmic production. Your liberation is assured.",
    "If you avoid any experience—whether pain or pleasure, sorrow or joy—it is big karma. But if you go through the experience without resisting it, the karma dissolves. This is why Krishna in the great Indian epic the Mahabharata says that hesitation is the worst of all crimes.",
    "Living totally does not mean just having a good time. It means experiencing anything that comes your way fully and intensely. The very process of life is the dissolution of karma. If you live every moment of your life totally, you dissolve an enormous volume of karma.",
    "Your karma is not in what is happening to you; your karma is in the way you respond to what is happening to you.",
    "When we say something is an illusion, it does not necessarily mean that it does not exist. It simply means you are not seeing it the way it is.",
    "Most human beings, instead of looking beyond the needs of survival, have just raised their standards of survival.",
    "If your heart stops beating, you would call it an emergency. Then why do you want your mind to stop?",
    "The moment you are identified with something that you are not, you are an endless thought, a compulsive thought; you cannot help it.",
    "If you become important in the world, it is good. But within yourself, do not become so important, because that is a sure way to get lost.",
    "it does not matter what the mind is doing once you identify it as a fool. If there is somebody very stupid around you who goes on blabbering, do you not learn to simply ignore him and carry on with your work? That is all you need to do.",
    "If you are willing, it is always there for you. If you are not willing, it is not there for you. So all you need to do is create the right kind of willingness and receptivity. Just to bow down and not have a will of your own is the biggest receptivity. It is the easiest way to receive.",
    "If you want God as a tranquilizer, it is okay as an idea, but if you want the Divine to be an awakening process in your life, an idea is not good enough.",
    "What you call intelligence and what you refer to as the Creator are not different. The Creator is just pure intelligence. Intelligence beyond logic is what you are referring to as God. If you operate just within the limitations of your intellectual logic, within the framework of your intellect, you will never know the Creator. You will just do the circus of life. Life is a circus when your intellect and your body alone are involved. But life is a dance when the intelligence begins to play its role.",
    "Work on yourself. Don’t worry about God.",
    "Whatever is in your hands, you keep that in perfect condition; then what is beyond you will anyway happen.But people are always trying to work at what is beyond them, not taking care of what is in their hands.",
    "If you are fanatical about what you believe in, you cannot be confused. Or if you are realized, you cannot be confused. Between ignorance and enlightenment is a very thin line.",
    "If they are demanding your money or your property, it is not worth it. You must go only to that place where they are demanding your life.",
    "The spiritual process is not about being ethical or moral, good or bad. It is just looking for ways to break the limitations in which we exist.",
    "If one can just sit here, one becomes like the Creator; a piece of creation naturally transforms itself into the Creator.",
    "When you are on the spiritual path you do not think about mastery; you think about freedom.",
    "If you want to be sensitive to life, you must be life yourself.",
    "If you want to become life sensitive, a simple process that you do is this: make whatever you think and whatever you feel less important.",
    "If you just see, whatever your body, mind and emotion are saying is not important, you will suddenly see that you will become extremely sensitive to life.",
    "Make everything yours. Why be stingy with your greediness?",
    "That is the reason why you dig your own well – so that you have water throughout the year.",
    "Yogis are not against pleasure. It is just that they are unwilling to settle for little pleasures. They are greedy.",
    "When you become absent, your presence is tremendous. When you try to be present, you have no presence at all.",
    "…Bhuta Shuddhi is a basic sadhana in yoga to transcend the limitations of the physical and to become available to a dimension beyond the physical.",
    "I am stoned all the time, but fully conscious.",
    "The more you unravel the scientific process, the more mysterious this world becomes.",
    "If you look inward, a different dimension opens up. Now instead of things getting more complex, you get to clarity.",
    "The Indian temple was never created as a place of prayer.",
    "Peace is the last thing I’m seeking. You ‘rest in peace.’ This is the time to live.",
    "Everywhere else people believe God is the Creator and you are a piece of creation. This is the only culture where we know that we can create a god.",
    "…if I have the necessary support, I can pull out a Devi from every tree, every flower, every human being…",
    "There is enough food on the planet, but half the people cannot eat properly. If the feminine was dominant, the population would eat for sure.",
    "That every human being and every creature that walks or crawls should live in a consecrated space is the dream of every enlightened being.",
    "…if you closely observe this human system, everything cosmic is right here in a miniature form.",
    "The most incredible thing is that you can know everything you wish to know with your eyes closed.",
    "I am not here to speak the Truth. I am here just to give you a method to perceive it.",
    "Even if a boon is given to people, they know how to make a curse out of it, simply because they do not know the very nature of who they are.",
    "Music…if you know how to enter it, it can become your route towards the very basis of this existence.",
    "If you are free from memory and imagination, you will always be meditative.",
    "Existing without the necessary awareness to know the nature of your own life is called dreaming.",
    "The less you try to influence your children, the more they get influenced by you.",
    "This idea – that a human being can evolve beyond his present limitations – and the needed technology to fulfill this idea, is the greatest contribution that Adiyogi, Shiva, made to human consciousness.",
    "When someone leaves his body consciously, he is truly no more. That is referred to as mukti or liberation. The game is up.",
    "What we are referring to as a spiritual process is basically a journey from creation to Creator. The greediest people on the planet are the spiritual people. All the others are willing to settle for a piece of creation. These people want the Creator himself.",
    "There are only two or three things in the world which actually overwhelm me – Kedar is one of them.",
    "Kedar IS THE CRAZIEST COCKTAIL OF SPIRITUALITY ANYWHERE IN THE WORLD.",
    "The most auspicious thing that can happen to you in your life is that you reach the peak within yourself.",
    "Knowing means opening up a new vision or insight into life. So true knowing means your third eye has to open up. If this eye of vision is not opened, if we are limited to just the sensory eye, then there is no possibility of Shiva.",
    "Kedar is a place which has housed so many people who just won’t fit into your moral structures.",
    "Yoga has innumerable devices, innumerable methods of working towards a still mind.",
    "No human being is ever capable of creating a perfect external situation because the outside situation will never be a hundred per cent in your control, no matter how powerful a human being you are. So yoga focuses on the inner situation. If you can create a perfect inward situation, no matter what the external situation, you can be in perfect bliss and peace.",
    "Everything that is worth knowing in existence you know the moment you know yourself.",
    "Shiva is constantly waiting for one moment of vulnerability in you when he can crack you.",
    "You can transform this piece of earth into the divine… a deity that’s worthy of worship.",
    "It’s a privilege that, when you want to give, there is somebody to receive.",
    "The giving is about you, not about the other person. Be glad there is somebody to receive.",
    "A yogi can create a whole universe in his cave.",
    "The whole art of being a guru is just this: to constantly puncture people’s egos and still manage to remain their friend.",
    "If you walk through this life thinking too much of yourself, you’re a vandal. If you take every step of your life in gratitude, if you see how small you are, you walk on this planet gently, like a pilgrim. This life could be your pilgrimage.",
    "Pilgrimage is a process which… makes you realize you are so small, and the more a human being willingly becomes small, the larger he becomes.",
    "A pilgrimage is a process of humbling yourself. A pilgrimage is a process of letting something else overwhelm you.",
    "Only within yourself when you live without any limitations, life opens up its bounty for you.",
    "We mystics are not civilized people.",
    "I know the consequence of my teaching perfectly well. I am not teaching something impulsively.",
    "Transmission is much more important than teaching. Teaching is only a way of knocking on the door.",
    "There is a whole technology of transforming a piece of rock into a god.",
    "I am not trying to take away your gods from you. It’s just that you never had them.",
    "Once you have an inkling of the immensity of life, once you see how small and stupid you are, you become receptivity itself.",
    "Compassion is definitely a more liberating emotion than love.",
    "A little insufficiency has brought you here; utter insufficiency will deliver you.",
    "The most sought-after objects have come my way of their own accord.",
    "If the guru is trying to fit into the disciples’ expectations, he is unfit to be a guru.",
    "If you want the real thing, stop the ‘take-away’ business. Simply be.",
    "All this is just wasting time. When you are not trying to be anything, not trying to get anywhere, you are being.",
    "When you sit in a satsangh,…don’t worry about what’s happening to somebody; be absolutely with me.",
    "A little sense of insufficiency; that is why you have come. When you feel absolutely, utterly insufficient, that’s when you will know.",
    "Every moment, whatever you step on, in many ways, you are only stepping on me.",
    "Isha is not an establishment; Isha is not an organization. Isha is… just a tool for one’s growth.",
    "You can truly involve yourself with life only when you are not identified with it.",
    "These are the two ways – either include everything or exclude everything. Either become infinite, or become zero.",
    "If there is any genuine work on this planet, it’s only with human beings. With the rest of life you really have no work to do – everything is fine.",
    "The flower has no use…, but it is the most beautiful dimension of the life-process of a plant. It is the peak of its life.",
    "A blessing is gasoline. It’s a piece of energy. It’s not good wishes.",
    "You can’t teach madness to people. They have to be infected.",
    "Allow the mountains to happen to you.",
    "Above all, there is now sufficient medical and scientific evidence that your body and mind function at their best when you are in a state of joy. It is said that if you can remain in a state of bliss for twenty-four hours, your intellectual capacity can almost double. This can be achieved simply by calming the inner chaos and directing clarity.",
    "There is only one obstacle between you and your well-being. That is, you have allowed your thoughts and emotions to take instructions from the outside, instead of from within.",
    "Just earning a living, having children, raising a family, and one day dying. What a big challenge it is! It's surprising how much humans struggle just to do this, while insects, birds, and animals do it with great ease.",
    "If you go outwards, it is an endless journey. But if you turn inwards, it's just a moment's distance.",
    "Unknowingly, you write your own destiny. If you have mastery over your physical body, then fifteen to twenty percent of your life and destiny will be in your own hands. If you have mastery over your mind, then fifty to sixty percent of your life and destiny will be in your hands. If you have mastery over your life energies, then your life and destiny will be completely in your hands.",
    "When you are in pain, distress, or anger, that is the time to look within, not to look around you.",
    "If you accept that 'I am responsible for who I am right now,' then even the most terrible things can enrich your life. You can turn the biggest calamity into a stepping stone for your growth. If you take 100% responsibility for who you are right now, a better tomorrow can be a possibility for you. But if you don't take responsibility for the present—and blame your parents, friends, husband, lover, or colleagues for your situation—then you have lost your future even before it has arrived.",
    "Resentment, anger, jealousy, pain, suffering, and depression—all these are like poisons that you drink yourself, and expect someone else to die. Life doesn't work that way. Most people waste many lifetimes trying to understand this simple truth.",
    "Next time you eat a meal, for the first fifteen minutes, do not speak to anyone. Just be in a state of actively and consciously responding to the food you are eating, the air you are breathing, and the water you are drinking.",
    "'My responsibility is limitless. If I am willing, I can respond to everything.' Remain aware of this until you fall asleep and let this be the first thing you remember upon waking up.",
    "Only when you get dis-identified, when you are able to be involved but not entangled, only then it can stop.",
    "Your mind need not be controlled; your mind needs to be liberated.",
    "Having an aversion to something and an attraction towards something else is the basis of identification. Whatever you are averse to dominates your mind. The nature of your mind is such that if you say, “I do not want something,” only that thing keeps happening in your mind. There is no subtraction or division in the mind, there is only addition and multiplication.",
    "It is the identification which is causing entanglement, not the involvement. If your involvement is beyond your identifications, you will see that involvement brings absolute joy to life.",
    "Your aliveness is going down because you are committing suicide in installments by becoming selective in your involvement. Whatever you do willingly, that is your heaven. Whatever you do unwillingly, that is your hell.",
    "Whether your mind is a misery or your mind is a miracle simply depends on whether you are allowing life to happen to you absolutely willingly or unwillingly.",
    "if you truly want to unleash the power of the mind, the fundamental thing is, your intellect should not be identified with anything.",
    "Once you liberate your mind from being identified with anything, then mind is a miracle; mind is a spectacular circus, not a mess.",
    "Detachment means you have disentangled yourself from the process that you call “body,” and from the process that you call “mind,” because both these things are accumulations from outside.",
    "Mind is not in any one place. Every cell in this body has its own intelligence. The brain is sitting in your head, but mind is all over the place.",
    "If you try to make the limited unlimited, you will suffer.",
    "If you simply sit here as a piece of life – not as a man or a woman, not as a Hindu or a Christian, not as an Indian or an American, not as anything – simply as a piece of life, you will see, the mind will become still.",
    "The main aspect of meditation is, as you become more meditative, you become the boss, your mind becomes the slave, and that is how it should always be.",
    "If you want to know life in its immensity, you need something more than your thoughts, your logic, or your intellect",
    "One should use information and logic as a drunkard would use a lamp post, only for support, not for illumination.",
    "A devotee has no agenda of his own. His only objective is to dissolve into his object of devotion.",
    "Your mind is not a solid state, your mind is a fluid. You can make it take on any shape.",
    "Most of a human being’s suffering is mental, and mental suffering is self-created. A human being is an expert at creating suffering for himself and for others. This is because he has a discretionary mind – he can choose to be any way he wants right now. He can make himself joyful or make himself miserable. You can make anything out of your mind. This choice is there at every moment.",
    "If you are genuinely hallucinating, it means you are making up things so powerfully in your mind that it seems real. If you create it in your mind and empower it with your consciousness, it can become a live process.",
    "If you transcend the mind, you transcend the karmic bondage also, completely.",
    "A human is not a being; he is a becoming. He is an ongoing process, nothing is fixed.",
    "It is uncanny that today’s neuroscientists are saying there is no way a human being can get any more brainy than the way he is right now.",
    "The very life process is a great miracle. The very way you have become all this, from being two little cells, is it not a miracle?",
    "Certain qualities in nature have been identified as masculine, while other qualities have been identified as feminine.",
    "Very few people are mad enough to live their life with total abandon.",
    "The whole science of yoga is to understand the geometry of your existence, because the whole existence is a certain kind of geometry, and your body is also a certain kind of geometry",
    "By consciously getting your body into a certain posture, you can also elevate your consciousness, you can change the very way you feel, think, understand, and experience life simply by sitting in a particular way.",
    "If you travel through the breath, deep into yourself, it will take you to that point where you are tied to the body.",
    "Where the receptivity is in your hand and where the giving nature of the feet is – if these two things are connected – what you cannot achieve in years of sadhana, you may achieve in a moment.",
    "Disease and ailments happen fundamentally because somewhere your energy body is not functioning properly.",
    "No one who genuinely walks a spiritual path will ever attempt healing because it is a sure way of entangling yourself.",
    "If you want to meditate, your alertness must be not of the mind alone, but of your very energy.",
    "When it comes to food, experiment with different foods and see how your body feels after eating the food.",
    "The five elements of earth, water, fire, air and space, are the basis of this body, the basis of this planet, and the basis of the whole creation.",
    "If you know how to organize these five elements properly within yourself, there is nothing more to life. In terms of health, wellbeing, perception, knowing and enlightenment – everything is handled if only you know how to keep these five elements properly.",
    "You are just a small outcrop of this earth. Right now, you are an outcrop that prances around. As a little blade of grass has shot out of the earth, you are also like that – a little mobile, that is all.",
    "Water is one thing that is freaking the scientific community. They cannot understand what water is because it is one of the few substances which contracts when you heat it and expands when you cool it; it is one of the few things which exists on earth in all the three states of being solid, liquid and gaseous, and it is the very basis of our life.",
    "If you get cooperation from akash, life will happen in magical ways. An intelligence that you have never thought possible will become yours.",
    "There are certain patterns running in your aura. If you run fire along those tracks, suddenly you feel bright and clear.",
    "If one has mastery over the five elements, the body can even be dematerialized.",
    "When my guru touched me on the forehead with his staff, what could not be learnt in lifetimes was transmitted in a moment. Since then, on the existential level, whatever I have needed to know has been available to me when I have needed it. On a daily basis, I do not carry the burden of this knowing. People usually become heavy and serious with knowledge. But when knowing is transmitted as energy, not memory, the burden of knowledge is not on you.",
    "Don’t look up to anything, don’t look down on anything.",
    "Shi-va is the centripetal force that holds existence together; Shakti is the centrifugal force that gives rise to the explosive diversity of existence.",
    "Shiva is only meant for those whose greed is unlimited, for those who are not willing to settle for life in instalments, for those who want to become one with the very source of existence.",
    "The spiritual journey is a journey towards clarity, but never towards certainty. When you draw conclusions about beginnings and endings, you are a believer. When you accept that you really do not know anything, you become a seeker.",
    "The logic is simple: if you do the right things, the right things will happen to you even without your intent.",
    "What unfolds here are the chronicles not of Shi-va, the ultimate emptiness, or Shiva in his innumerable other mythic forms, but of Adiyogi, the first yogi.",
    "Fundamentally, the basis of yoga is just this: to initiate a process of self-creation where the nature of your body, your emotion, your mind, your energy is consciously created by you. This is what Adiyogi did. He crafted his life in its entirety.",
    "Our lives are ruled by eight forms of memory, Adiyogi explained. These are elemental, atomic, evolutionary, genetic, karmic, sensory, inarticulate and articulate.",
    "Life has no use at all, declared Adiyogi. It is simply a phenomenon. Little acts have purpose. But life is not framed within the narrow grid of utility. It is beyond frames. It is beyond grids. It is beyond utility. If you have a taste of this existence beyond purpose, of life beyond sense, you are enlightened.",
    "When a Being beyond Time and Space touches you, you also become beyond Time and Space – the privilege of knowing “The Only Solution Is Dissolution”.",
    "The hen that you are, how will you know what deceptive ways Grace will descend. It is Grace that brought you here and it is Grace that will deliver: I prefer the hen that looks up to the sky than an eagle that flies but always looking down. How high is not the question, but how intense is your longing for the sky. May you always be in Grace.",
    "Only when a person begins to experience himself beyond the limitations of his physical body and mind, then this person can become free from insecurity and fear. Experiencing yourself beyond the physical is what we’re referring to as spiritual.",
    "So when I say “spiritual,” I am talking about you beginning to experience that which is not physical. Once this spiritual dimension is alive, once you start experiencing yourself beyond the limitations of the physical and the mental, only then there’s no such thing as fear. Fear is just the creation of an overactive and out-of-control mind.",
    "You need to understand the limitations and the capabilities of these thousand people and do what you can; only then will you have the power to move the situation the way you want it to go. If you’re waiting for these thousand people to understand you and act, it is only a pipe dream; it’s never going to happen.",
    "Somebody becomes closer and dearer to you only as you understand them better. If they understand you, they enjoy the closeness of the relationship. If you understand them better, then you enjoy the closeness.",
    "If you use your emotions and try to reach the ultimate, we call this bhakti yoga; that means the path of devotion. If you use your intelligence and try to reach the ultimate, we call this gnana yoga; that means the path of intelligence. If you use your body, or physical action to reach the ultimate, we call this karma yoga; that means the path of action. Now if you transform your energies and try to reach the ultimate, we call this kriya yoga; that means internal action.",
    "The only thing you can do is to stop attaching importance to your own ways of thinking and feeling, your thought patterns, your emotions, and your opinions. Don’t attach any importance to them. Then your limitations will become weaker and weaker and one day collapse.",
    "If you create any image without a break in it, if there is a continuous mental focus towards it, it will happen, no matter what.",
    "Right now, medical sciences are limited to just knowing the physical body. If anything happens beyond that, you think it’s a miracle.",
    "Similarly, life happens in many different ways. But you have limited yourself to just the physical, the logical—physical in experience, logical in thinking.",
    "is. If your energy body is in proper balance and full flow, your physical body and mental body will be in perfect health, there is no question about it.",
    "Accepting the other team is most important. When acceptance is total, there is no more opposition.",
    "Acceptance is important to connect to a situation and to respond to the situation intelligently.",
    "whatever action you perform in your life, there is a consequence to it. There is no such thing as you must perform only this type of action and you must not perform another type of action. You can do anything. But you must be in a state to accept the consequences joyously.",
    "You want to race with everybody because you want to be one up on everybody, especially your neighbour. But you do not want to face the difficulties that arise due to this competition.",
    "Just because somebody else is doing something, you don’t have to attempt it or do it. You do not know the kind of energy they have, isn’t it? So, the society has not only become competitive; you are caught in the rat race.",
    "The closer the relationship is, the more effort you should make to understand them.",
    "The way you are right now, the very quality of your life is decided by the type of relationships you hold. You better make the needed effort to understand the people around you.",
    "Your child should do something that you did not even dare to think of in your life.",
    "If you want to bring up your child well, the first thing is that you should be happy. Right now, you, by yourself, do not know how to be happy. Every day in your house, there is a demonstration of tension, anger, fear, anxiety and jealousy. Only these things are being demonstrated to your child. What will happen to him? He will learn only this. If you really have the intention of bringing up your child well, you must first change your way of being. If you are incapable of transforming yourself, where is the question of you bringing up your child?",
    "You have become a disciple of the devil if your whole life is about making deals. The devil is always making a deal with somebody.",
    "Right now, why you think in terms of right and wrong is simply because of the social moral code.",
    "The karma is not made in physical action; it is made only by volition.",
    "Your idea of good and bad has been taught to you. You have imbibed it from the social atmosphere in which you have lived. Karma is in the context of your life, and not in the action itself.",
    "Today, it has become a common phenomenon in society that everybody is in some level of neurosis. This is simply because your energy is not worked out; it’s trapped.",
    "Right now, religion is mostly about belonging to groups; that’s all it is doing to people.",
    "Normally, everybody wants to rule the world.",
    "Unfortunately, for most people, fear, anger, hatred are the most intense situations in their lives. Their love is never so intense, their peace is never so intense, their joy is never so intense, but their negativities are intense.",
    "The most beautiful things will happen when your actions spring from your intelligence and not from your anger.",
    "India is the ultimate spiritual democracy.",
    "Ours is a culture of quest, not commandment. There is no divide between the sacred and the secular.",
    "Learning to live in lively exuberance and collective responsibility, without mistaking the spirit of debate for the spirit of revolt.",
    "As members of the human race, we need to move towards an inclusive universality rather than a reverse biological bigotry.",
    "It takes tremendous maturity to simply sit quietly, only doing things to the extent that it is needed.",
    "The complexities that one encounters on the spiritual path are not because of the path. The complexities are only there because of the mess that is your mind.",
    "The moment you say something is bad, you can’t stop disliking it, can you?",
    "You believe in things that you have not seen and experienced. This has become the basis of all conflict.",
    "What you call a person is just like a bubble. This bubble doesn’t have any substance of its own.",
    "God is not somewhere, he is here and now. It is you who is not.",
    "If every moment, one is like a snake leaving the skin behind, only then there is growth.",
    "Only if you know to what extent your logic should go and where it should not go, your life will be beautiful.",
    "If you are seeking something beyond survival, then the sense perceptions are not enough.",
    "The whole process of yoga is to take you from something that you know and take the next step into the unknown.",
    "If you look at it objectively, stillness and stagnation are about the same. Physically they could be seen as about the same, but qualitatively they are worlds apart.",
    "Generally, mental alertness is mistaken for awareness, but awareness is a far deeper dimension than just mental alertness alone.",
    "If you gain a little bit of mastery over your own energies, you will see, things that you never imagined possible, you will do simply and naturally.",
    "What you don’t know, if you accept that you do not know it, there will be growth.",
    "If you have to do something that you do not like, you can only do it consciously; there is no other way to do it.",
    "In your attempt to understand a flower, maybe you will pull it apart petal by petal. But you will understand nothing.",
    "Unless you do something to the inner, you will not know what it is to be peaceful, to be joyous, you will not know how to go beyond the limitations of being just a physical body and mind.",
    "A prayer is not a means to reach God, but God is only a means so that we can pray.",
    "If you truly become aware of the disease, then you become aware of the cause also.",
    "Without being capable of bringing peace into your own being, there is no way you are going to be capable of bringing peace to the world.",
    "Once you become a true individual, your destiny is yours.",
    "Every breath, every step, every act that you perform in your life becomes a spiritual process.",
    "Let your humanity overflow and the Divine will happen.",
    "When a man has reached a state within himself where his actions are only to the extent required for outer life situations, then he is a complete person.",
    "You deal with life as if you have got nothing to do with anything outside of your limited perception.",
    "Whatever is your highest, you just contemplate upon that. Your inner and outer purity will happen naturally.",
    "A Guru mixes the right cocktail for you, otherwise there is no punch.",
    "To live on this planet, you need trust. Right now, you trust unconsciously.",
    "A spiritual person has earned everything else from within, only for food he begs.",
  ];

  let bookExcerptsIndex =
    parseInt(localStorage.getItem("bookExcerptsIndex")) || 0;
  let bookExcerptsInterval = null;

  const bookExcerptsText = document.getElementById("bookExcerptsText");
  const bookExcerptsBtn = document.getElementById("bookExcerptsBtn");
  const bookExcerptsPrevBtn = document.getElementById("bookExcerptsPrevBtn");
  const bookExcerptsPauseBtn = document.getElementById("bookExcerptsPauseBtn");
  const bookExcerptsCounter = document.getElementById("bookExcerptsCounter");
  const bookExcerptsSection = document.querySelector(".book-excerpts-section");

  function showBookExcerpt(index) {
    if (!bookExcerptsText) return;

    bookExcerptsText.classList.remove("visible");

    setTimeout(() => {
      bookExcerptsText.textContent = bookExcerpts[index] + " — Sadhguru";
      bookExcerptsText.classList.add("visible");
      if (bookExcerptsCounter) {
        bookExcerptsCounter.textContent = `Excerpt ${index + 1} of ${
          bookExcerpts.length
        }`;
      }
    }, 600);

    localStorage.setItem("bookExcerptsIndex", index);
  }

  function startBookExcerptsAutoCycle() {
    if (bookExcerptsInterval) return;
    if (bookExcerptsPauseBtn) bookExcerptsPauseBtn.textContent = "Pause";
    bookExcerptsInterval = setInterval(() => {
      bookExcerptsIndex = (bookExcerptsIndex + 1) % bookExcerpts.length;
      showBookExcerpt(bookExcerptsIndex);
    }, 30000); // 30 seconds to be different from quotes/sutras
  }

  function stopBookExcerptsAutoCycle() {
    clearInterval(bookExcerptsInterval);
    bookExcerptsInterval = null;
    if (bookExcerptsPauseBtn) bookExcerptsPauseBtn.textContent = "Play";
  }

  if (bookExcerptsBtn) {
    bookExcerptsBtn.addEventListener("click", () => {
      stopBookExcerptsAutoCycle();
      bookExcerptsIndex = (bookExcerptsIndex + 1) % bookExcerpts.length;
      showBookExcerpt(bookExcerptsIndex);
    });
  }

  if (bookExcerptsPrevBtn) {
    bookExcerptsPrevBtn.addEventListener("click", () => {
      stopBookExcerptsAutoCycle();
      bookExcerptsIndex =
        (bookExcerptsIndex - 1 + bookExcerpts.length) % bookExcerpts.length;
      showBookExcerpt(bookExcerptsIndex);
    });
  }

  if (bookExcerptsPauseBtn) {
    bookExcerptsPauseBtn.addEventListener("click", () => {
      if (bookExcerptsInterval) {
        stopBookExcerptsAutoCycle();
      } else {
        startBookExcerptsAutoCycle();
      }
    });
  }

  // Handle visibility and initial load
  if (bookExcerptsSection) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            bookExcerptsSection.classList.add("visible");
            showBookExcerpt(bookExcerptsIndex);
            startBookExcerptsAutoCycle();
            observer.unobserve(bookExcerptsSection);
          }
        });
      },
      { threshold: 0 }
    );

    observer.observe(bookExcerptsSection);

    // If already in view on load
    if (bookExcerptsSection.getBoundingClientRect().top < window.innerHeight) {
      bookExcerptsSection.classList.add("visible");
      showBookExcerpt(bookExcerptsIndex);
      startBookExcerptsAutoCycle();
    }
  }

  // ====================
  // 💡 Tips Section
  // ====================
  const tips = [
    "First accept every limitation you have. Physically,mentally we are very limited, if you hate the fact and try to dog train your body or mind for a day, next day they are going to bark at you. You need to address your body and mind like a child. Accept and work with the limitation.",
    "Remember that your intention is your fuel, your intention is your anchor and your intention is the first step. So keep an intention that is way higher than what you want to achieve, your target will be achieved quicker than you thought you could achieve.",
    "Small steps are your way to success in every aspect of your life. You take a guitar, just learn one small and very easy chord from youtube and just spend five minutes twice everyday. Add five more minutes and a new chord every month. In a year you will be an awesome guitar player. I can keep on going about small steps. Its the most important thing that we often underestimate and let go of.",
    "Repetition is crucial, if you are irregular then you are hitting a wall here. Without repetition both intention and small steps are just a joke.",
    "One thing about repetition is that, its always your mind vs repetition. Everytime you repeat a particular activity, that activity wins over your mind, even if you are sick, even if you are angry, sad, bored, dull or in love! Whatever your state is, repetition will win it over. But unfortunately you break a repetition cycle then your mind dominates your activity that you are trying to regularise Suddenly next day you will be less drawn towards doing a particular activity.",
    "Remembering that I’ll be dead soon is the most important tool I’ve ever encountered to help me make the big choices in life. Because almost everything — all external expectations, all pride, all fear of embarrassment or failure — these things just fall away in the face of death, leaving only what is truly important.",
    "If you are serious about success in life then make your body this strong that it can work efficiently with less food and sleep.",
  ];

  let tipIndex = parseInt(localStorage.getItem("tipIndex")) || 0;
  let tipInterval = null;

  const tipsText = document.getElementById("tipsText");
  const tipsBtn = document.getElementById("tipsBtn");
  const tipsPrevBtn = document.getElementById("tipsPrevBtn");
  const tipsPauseBtn = document.getElementById("tipsPauseBtn");
  const tipCounter = document.getElementById("tipCounter");
  const tipsSection = document.querySelector(".tips-section");

  function showTip(index) {
    if (!tipsText) return;
    tipsText.classList.remove("visible");
    setTimeout(() => {
      tipsText.textContent =
        tips[index] +
        " —Putr, Devi. Shambhavi Twice: Ingredients for a Corporate Yogi";
      tipsText.classList.add("visible");
      if (tipCounter) {
        tipCounter.textContent = `Tip ${index + 1} of ${tips.length}`;
      }
    }, 600);
    localStorage.setItem("tipIndex", index);
  }

  function startTipAutoCycle() {
    if (tipInterval) return;
    if (tipsPauseBtn) tipsPauseBtn.textContent = "Pause";
    tipInterval = setInterval(() => {
      tipIndex = (tipIndex + 1) % tips.length;
      showTip(tipIndex);
    }, 20000);
  }

  function stopTipAutoCycle() {
    clearInterval(tipInterval);
    tipInterval = null;
    if (tipsPauseBtn) tipsPauseBtn.textContent = "Play";
  }

  if (tipsBtn) {
    tipsBtn.addEventListener("click", () => {
      stopTipAutoCycle();
      tipIndex = (tipIndex + 1) % tips.length;
      showTip(tipIndex);
    });
  }

  if (tipsPrevBtn) {
    tipsPrevBtn.addEventListener("click", () => {
      stopTipAutoCycle();
      tipIndex = (tipIndex - 1 + tips.length) % tips.length;
      showTip(tipIndex);
    });
  }

  if (tipsPauseBtn) {
    tipsPauseBtn.addEventListener("click", () => {
      if (tipInterval) {
        stopTipAutoCycle();
      } else {
        startTipAutoCycle();
      }
    });
  }

  // Handle visibility and initial load
  if (tipsSection) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            tipsSection.classList.add("visible");
            showTip(tipIndex);
            startTipAutoCycle();
            observer.unobserve(tipsSection);
          }
        });
      },
      { threshold: 0 }
    );

    observer.observe(tipsSection);

    if (tipsSection.getBoundingClientRect().top < window.innerHeight) {
      tipsSection.classList.add("visible");
      showTip(tipIndex);
      startTipAutoCycle();
    }
  }

window.onYouTubeIframeAPIReady = function () {
  let player;
  player = new YT.Player("youtube-player", {
    videoId: "IvjMgVS6kng", // Lofi Girl - Lofi hip hop radio. This is a very popular and stable video.
    playerVars: {
      autoplay: 1,
      controls: 1,
      autoplay: 1,
      loop: 1,
      playlist: "IvjMgVS6kng", // Required for looping
    },
  });
};
})();
