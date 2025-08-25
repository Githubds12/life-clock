(() => {
 const livingBeingLifespan = {
  // Humans
  "Human": 73,

  // Mammals
  "Dog": 13,
  "Cat": 15,
  "Elephant": 70,
  "Horse": 30,
  "Cow": 20,
  "Rabbit": 9,
  "Mouse": 2,
  "Rat": 3,
  "Pig": 15,
  "Sheep": 12,
  "Goat": 15,
  "Kangaroo": 20,
  "Giraffe": 25,
  "Lion": 14,
  "Tiger": 16,
  "Leopard": 15,
  "Cheetah": 12,
  "Bear": 25,
  "Wolf": 13,
  "Deer": 20,
  "Camel": 40,
  "Dolphin": 40,
  "Blue Whale": 80,
  "Orca (Killer Whale)": 50,
  "Bat": 20,

  // Birds
  "Parrot": 50,
  "Macaw": 60,
  "Cockatoo": 70,
  "Pigeon": 6,
  "Crow": 14,
  "Sparrow": 3,
  "Eagle": 20,
  "Owl": 15,
  "Swan": 20,
  "Penguin": 20,
  "Chicken": 8,
  "Duck": 10,
  "Goose": 15,
  "Falcon": 13,
  "Peacock": 20,

  // Reptiles (Snakes Expanded 🐍)
  "Crocodile": 70,
  "Alligator": 50,
  "Common Snake": 9,
  "Python": 25,
  "Boa Constrictor": 30,
  "Cobra": 20,
  "Rattlesnake": 20,
  "Anaconda": 30,
  "Garter Snake": 6,
  "Corn Snake": 10,
  "King Snake": 15,
  "Ball Python": 20,
  "Viper": 15,
  "Lizard": 5,
  "Gecko": 10,
  "Chameleon": 7,
  "Frog": 10,
  "Toad": 12,
  "Tortoise": 100,
  "Sea Turtle": 80,
  "Komodo Dragon": 30,
  
  // Marine Life
  "Goldfish": 10,
  "Koi Fish": 40,
  "Shark": 30,
  "Great White Shark": 70,
  "Salmon": 4,
  "Tuna": 15,
  "Clownfish": 10,
  "Octopus": 3,
  "Squid": 2,
  "Lobster": 50,
  "Crab": 8,
  "Starfish": 10,
  "Jellyfish": 1, // some immortal species excluded

  // Insects & Arthropods
  "Ant": 0.2,      // ~2 months
  "Bee": 0.3,      // ~4 months
  "Butterfly": 0.1, // weeks
  "Dragonfly": 0.5,
  "Mosquito": 0.05,
  "Cockroach": 1,
  "Spider": 2,
  "Tarantula": 20,
  "Scorpion": 5,
  "Grasshopper": 0.5,
  "Ladybug": 1,

  // Trees & Plants (long-living 🌳)
  "Oak Tree": 300,
  "Pine Tree": 250,
  "Baobab Tree": 2000,
  "Bamboo": 120,
  "Banana Plant": 25,
  "Sequoia Tree": 3000,
  "Cactus": 150,
  "Mango Tree": 100,
  "Palm Tree": 80
};


// Populate datalist options
const livingBeingList = document.getElementById("livingBeingList");
Object.keys(livingBeingLifespan).forEach(animal => {
  const option = document.createElement("option");
  option.value = animal;
  livingBeingList.appendChild(option);
});

// Auto-fill lifespan when a living being is chosen
const livingBeingInput = document.getElementById("livingBeing");
const lifespanInput1 = document.getElementById("lifespan"); // assuming you already have lifespan input

livingBeingInput.addEventListener("change", () => {
  const chosen = livingBeingInput.value;
  if (livingBeingLifespan[chosen]) {
    lifespanInput1.value = livingBeingLifespan[chosen];
  }
});
  const countryLifeExpectancy = {
  "Afghanistan": 66.54,
  "Albania": 79.95,
  "Algeria": 76.38,
  "Angola": 61.64,
  "Argentina": 77.69,
  "Armenia": 76.01,
  "Australia": 84.21,
  "Austria": 82.29,
  "Azerbaijan": 74.43,
  "Bahamas": 74.55,
  "Bahrain": 81.58,
  "Bangladesh": 74.67,
  "Barbados": 76.18,
  "Belarus": 74.18,
  "Belgium": 82.4,
  "Belize": 73.57,
  "Benin": 60.77,
  "Bhutan": 72.97,
  "Bolivia": 68.58,
  "Bosnia and Herzegovina": 77.85,
  "Botswana": 69.16,
  "Brazil": 75.85,
  "Brunei": 75.33,
  "Bulgaria": 75.71,
  "Burundi": 63.65,
  "Cambodia": 70.67,
  "Cameroon": 63.7,
  "Canada": 81.65,
  "Central African Republic": 57.41,
  "Chad": 55.07,
  "Chile": 81.17,
  "China": 77.95,
  "Colombia": 77.72,
  "Comoros": 66.78,
  "Costa Rica": 80.8,
  "Croatia": 78.47,
  "Cuba": 78.08,
  "Cyprus": 81.65,
  "Czech Republic": 79.88,
  "Denmark": 81.85,
  "Dominican Republic": 73.72,
  "Ecuador": 77.39,
  "Egypt": 71.63,
  "El Salvador": 72.1,
  "Estonia": 78.49,
  "Eswatini": 64.12,
  "Ethiopia": 67.32,
  "Finland": 81.69,
  "France": 82.93,
  "Gabon": 68.34,
  "Gambia": 65.86,
  "Georgia": 74.5,
  "Germany": 80.54,
  "Ghana": 65.5,
  "Greece": 81.54,
  "Guatemala": 72.6,
  "Guinea": 60.74,
  "Guinea-Bissau": 64.08,
  "Haiti": 64.94,
  "Honduras": 72.88,
  "Hungary": 76.77,
  "Iceland": 82.61,
  "India": 72.00,
  "Indonesia": 71.15,
  "Iran": 77.65,
  "Iraq": 72.32,
  "Ireland": 82.86,
  "Israel": 83.20,
  "Italy": 83.70,
  "Jamaica": 71.48,
  "Japan": 84.04,
  "Jordan": 77.81,
  "Kazakhstan": 74.40,
  "Kenya": 63.65,
  "Kosovo": 78.03,
  "Kuwait": 83.19,
  "Kyrgyzstan": 72.25,
  "Laos": 68.96,
  "Latvia": 75.68,
  "Lebanon": 77.82,
  "Lesotho": 57.38,
  "Liberia": 62.16,
  "Libya": 69.34,
  "Lithuania": 76.99,
  "Luxembourg": 83.36,
  "Macedonia": 75.32,
  "Madagascar": 63.63,
  "Malawi": 67.35,
  "Malaysia": 76.66,
  "Maldives": 81.04,
  "Mali": 60.44,
  "Malta": 83.51,
  "Mauritania": 68.48,
  "Mauritius": 73.41,
  "Mexico": 75.07,
  "Moldova": 71.20,
  "Mongolia": 72.12,
  "Montenegro": 77.59,
  "Morocco": 75.31,
  "Mozambique": 63.61,
  "Myanmar": 66.89,
  "Namibia": 67.39,
  "Nepal": 70.35,
  "Netherlands": 81.91,
  "New Zealand": 83.00,
  "Nicaragua": 74.95,
  "Niger": 61.18,
  "Nigeria": 54.46,
  "North Korea": 73.64,
  "Norway": 83.11,
  "Oman": 80.03,
  "Pakistan": 67.65,
  "Panama": 79.59,
  "Papua New Guinea": 66.13,
  "Paraguay": 73.84,
  "Peru": 77.74,
  "Philippines": 69.83,
  "Poland": 78.51,
  "Portugal": 82.28,
  "Qatar": 82.37,
  "Romania": 76.61,
  "Russia": 73.25,
  "Rwanda": 67.78,
  "Saudi Arabia": 78.73,
  "Senegal": 68.68,
  "Serbia": 76.22,
  "Seychelles": 74.96,
  "Sierra Leone": 61.79,
  "Singapore": 82.90,
  "Slovakia": 78.02,
  "Slovenia": 81.98,
  "Somalia": 58.82,
  "South Africa": 66.14,
  "South Korea": 83.43,
  "South Sudan": 57.62,
  "Spain": 83.88,
  "Sri Lanka": 77.48,
  "Sudan": 66.33,
  "Sweden": 83.31,
  "Switzerland": 84.06,
  "Syria": 72.12,
  "Taiwan": 80.94,
  "Tajikistan": 71.79,
  "Tanzania": 67.00,
  "Thailand": 76.41,
  "Togo": 62.74,
  "Tunisia": 76.51,
  "Turkey": 77.16,
  "Turkmenistan": 70.07,
  "Uganda": 68.25,
  "Ukraine": 73.42,
  "United Arab Emirates": 82.91,
  "United Kingdom": 81.24,
  "United States": 78.39,
  "Uruguay": 78.14,
  "Uzbekistan": 72.39,
  "Venezuela": 72.51,
  "Vietnam": 74.59,
  "Yemen": 69.30,
  "Zambia": 66.35,
  "Zimbabwe": 62.78
};

  const countrySelect = document.getElementById("country");

  // Fill dropdown with countries
  for (const country in countryLifeExpectancy) {
    const opt = document.createElement("option");
    opt.value = countryLifeExpectancy[country];
    opt.textContent = country;
    countrySelect.appendChild(opt);
  }

  // When country changes → update lifespan input automatically
  countrySelect.addEventListener("change", () => {
    if (countrySelect.value) {
      lifespanInput.value = countrySelect.value;
      restartIntro();
    }
  });

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
  const lerp = (a, b, t) => a + (b - a) * t;

  const W = canvas.width, H = canvas.height;
  const rimTop = 160, neckY = H * 0.5, rimBottom = H - 160;
  const rimLeft = W * 0.25, rimRight = W * 0.75;
  const neckHalf = 10;
  const ctrlTopY = H * 0.28, ctrlBottomY = H * 0.72;

  // --- Curves helpers ---
  function quadAt(p0, p1, p2, t) {
    return (1 - t) * (1 - t) * p0 + 2 * (1 - t) * t * p1 + t * t * p2;
  }
  function solveTForY(y, y0, y1, y2) {
    const A = y0 - 2 * y1 + y2, B = 2 * (y1 - y0), C = y0 - y;
    if (Math.abs(A) < 1e-6) return clamp(-C / B, 0, 1);
    const disc = B * B - 4 * A * C;
    const t1 = (-B + Math.sqrt(Math.max(0, disc))) / (2 * A);
    const t2 = (-B - Math.sqrt(Math.max(0, disc))) / (2 * A);
    const c = [t1, t2].filter(t => t >= 0 && t <= 1);
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

  // --- Frame ---
  function drawFrame() {
    ctx.save();
    ctx.lineWidth = 4;
    ctx.lineCap = "round";

    const glassGrad = ctx.createLinearGradient(0, rimTop, W, rimBottom);
    glassGrad.addColorStop(0, "rgba(255,255,255,0.2)");
    glassGrad.addColorStop(0.5, "rgba(255,255,255,0.05)");
    glassGrad.addColorStop(1, "rgba(255,255,255,0.2)");

    // Left
    ctx.beginPath();
    ctx.moveTo(rimLeft, rimTop);
    ctx.quadraticCurveTo(W * 0.35, ctrlTopY, W / 2 - neckHalf, neckY);
    ctx.quadraticCurveTo(W * 0.35, ctrlBottomY, rimLeft, rimBottom);
    ctx.strokeStyle = glassGrad;
    ctx.stroke();

    // Right
    ctx.beginPath();
    ctx.moveTo(rimRight, rimTop);
    ctx.quadraticCurveTo(W * 0.65, ctrlTopY, W / 2 + neckHalf, neckY);
    ctx.quadraticCurveTo(W * 0.65, ctrlBottomY, rimRight, rimBottom);
    ctx.strokeStyle = glassGrad;
    ctx.stroke();

    // Shadow
    const shadowGrad = ctx.createRadialGradient(W/2, rimBottom+40, 10, W/2, rimBottom+40, 180);
    shadowGrad.addColorStop(0, "rgba(0,0,0,0.4)");
    shadowGrad.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = shadowGrad;
    ctx.beginPath();
    ctx.ellipse(W/2, rimBottom+40, 120, 25, 0, 0, Math.PI*2);
    ctx.fill();
    ctx.restore();
  }

  // --- Clip paths ---
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

 // --- Top sand (area-correct with sqrt) ---
function drawTopSand(progress) {
  const remaining = 1 - progress;
  if (remaining <= 0) return;

  // Area ∝ height² → use sqrt for correct mapping
  const adjusted = Math.sqrt(remaining);

  const levelY = lerp(neckY, rimTop, adjusted);

  ctx.save();
  clipTopBulb();

  const left = leftWallX(levelY);
  const right = rightWallX(levelY);
  const midX = (left + right) / 2;
  const dip = lerp(5, 40, 1 - adjusted); // small dip as sand drains
  const surfaceDipY = levelY + dip;

  const sandShade = ctx.createLinearGradient(0, rimTop, 0, levelY);
  sandShade.addColorStop(0, sandGradA);
  sandShade.addColorStop(1, sandGradB);
  ctx.fillStyle = sandShade;

  ctx.beginPath();
  ctx.moveTo(left, levelY);
  ctx.quadraticCurveTo(midX, surfaceDipY, right, levelY);
  ctx.lineTo(rightWallX(neckY), neckY);
  ctx.lineTo(leftWallX(neckY), neckY);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
  return levelY;
}

// --- Bottom sand (area-correct with sqrt) ---
function drawBottomSand(progress) {
  if (progress <= 0) return neckY;

  const adjusted = Math.sqrt(progress);

  const levelY = lerp(neckY, rimBottom, adjusted);

  ctx.save();
  clipBottomBulb();

  const left = leftWallX(levelY);
  const right = rightWallX(levelY);
  const midX = (left + right) / 2;

  const sandShade = ctx.createLinearGradient(0, levelY, 0, rimBottom);
  sandShade.addColorStop(0, sandGradA);
  sandShade.addColorStop(1, sandGradB);
  ctx.fillStyle = sandShade;

  ctx.beginPath();
  ctx.moveTo(left, levelY);
  ctx.quadraticCurveTo(midX, levelY - 20, right, levelY);
  ctx.lineTo(rightWallX(rimBottom), rimBottom);
  ctx.lineTo(leftWallX(rimBottom), rimBottom);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
  return levelY;
}



  // --- Falling stream + tiny grains ---
  const particles = [];
  function drawStream(topLevelY, bottomLevelY) {
    // If bottom pile hasn't formed yet, skip drawing a negative-height line
    if (bottomLevelY <= neckY + 2) return;

    ctx.save();
    ctx.strokeStyle = sandGradA;
    ctx.lineWidth = 2;
    const startY = neckY + 2;
    const endY = bottomLevelY - 2;
    ctx.beginPath();
    ctx.moveTo(W / 2, startY);
    ctx.lineTo(W / 2, endY);
    ctx.stroke();
    ctx.restore();

    // particles
    if (Math.random() < 0.7) {
      particles.push({
        x: W / 2 + (Math.random() - 0.5) * 3,
        y: startY,
        vx: (Math.random() - 0.5) * 0.5,
        vy: 2 + Math.random() * 2,
        r: 1 + Math.random() * 1.5,
        life: 40
      });
    }
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx; p.y += p.vy; p.life--;
      ctx.fillStyle = sandGradA;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
      if (p.life <= 0 || p.y > endY) particles.splice(i, 1);
    }
  }

  // --- Progress & intro animation state ---
  let targetProgress = 0;      // real % lived (0..1)
  let displayProgress = 0;     // drawn % at bottom (0..1), starts 0 so top looks 100%
  let introStart = null;
  const introDuration = 4500;  // ~4.5s from 100% top to target

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
    targetProgress = clamp(ageYears / lifespan, 0, 1);

    // Stats UI
    yearsLived.textContent = ageYears.toFixed(2) + " years";
    yearsLeft.textContent = Math.max(0, lifespan - ageYears).toFixed(2) + " years";
    progressText.textContent = (targetProgress * 100).toFixed(2) + `% of ${lifespan} years`;
    meterFill.style.width = (targetProgress * 100).toFixed(2) + "%";
  }
  // --- Main loop (always called via RAF, so timestamp is defined) ---
  function draw(timestamp) {
    if (introStart === null) introStart = timestamp;

    // Keep target fresh (lets the sand drip after intro)
    computeProgress();

    const elapsed = timestamp - introStart;
    if (elapsed < introDuration) {
      const t = elapsed / introDuration;          // 0..1
      displayProgress = t * targetProgress;       // fall from 0 -> target
    } else {
      displayProgress += (targetProgress - displayProgress) * 0.05;
    }

    ctx.clearRect(0, 0, W, H);
    const bottomLevelY = drawBottomSand(displayProgress);
    const topLevelY = drawTopSand(displayProgress);
    drawStream(topLevelY, bottomLevelY);
    drawFrame();

    requestAnimationFrame(draw);
  }

  function restartIntro() {
    displayProgress = 0;
    introStart = null;
  }
  // Events
  dobInput.addEventListener("change", restartIntro);
  lifespanInput.addEventListener("input", restartIntro);
  ageSlider.addEventListener("input", () => { if (!dobInput.value) restartIntro(); });
  useDOBBtn.addEventListener("click", () => {
  restartIntro();
  canvas.scrollIntoView({ behavior: "smooth", block: "center" });
});


  // Kick off
  computeProgress();
  requestAnimationFrame(draw); // IMPORTANT: start via RAF so timestamp is valid

document.addEventListener("DOMContentLoaded", () => {
  const inputs = document.querySelectorAll("input, select");

  // Restore saved values
  inputs.forEach(el => {
    const saved = localStorage.getItem(el.id);
    if (saved !== null) {
      el.value = saved;
      // Trigger change/input so dependent logic updates
      el.dispatchEvent(new Event("change"));
      el.dispatchEvent(new Event("input"));
    }

    // Save new values on change
    el.addEventListener("change", () => {
      localStorage.setItem(el.id, el.value);
    });
    el.addEventListener("input", () => {
      localStorage.setItem(el.id, el.value);
    });
  });
});
  
function updateStats() {
  const dobInput = document.getElementById("dob").value;
  const lifespan = parseFloat(document.getElementById("lifespan").value);
  const ageSlider = document.getElementById("age");

  let ageYears = parseFloat(ageSlider.value);

  if (dobInput) {
    const dob = new Date(dobInput);
    const now = new Date();
    const diffMs = now - dob;

    // Calculate exact age
    const diffSeconds = diffMs / 1000;
    const years = diffSeconds / (365.25 * 24 * 60 * 60);
    ageYears = years;

    // Show exact age (years, months, days)
    const days = Math.floor(diffSeconds / (24 * 60 * 60));
    const exactYears = Math.floor(days / 365.25);
    const remainingDays = Math.floor(days % 365.25);
    const months = Math.floor(remainingDays / 30.44);
    const leftoverDays = Math.floor(remainingDays % 30.44);

    document.getElementById("exactAge").textContent =
      `${exactYears} years, ${months} months, ${leftoverDays} days`;
  }

  // Years lived (integer)
  document.getElementById("yearsLived").textContent = Math.floor(ageYears);

  // Years left
  const yearsLeft = lifespan - ageYears;
  document.getElementById("yearsLeft").textContent =
    yearsLeft > 0 ? yearsLeft.toFixed(2) : "0";

  // Progress
  const progress = Math.min((ageYears / lifespan) * 100, 100);
  document.getElementById("progressText").textContent =
    progress.toFixed(2) + "%";
  document.getElementById("meterFill").style.width = progress + "%";
}

// Hook updates
document.getElementById("dob").addEventListener("input", updateStats);
document.getElementById("lifespan").addEventListener("input", updateStats);
document.getElementById("age").addEventListener("input", updateStats);

// Initial run
updateStats();


})();
