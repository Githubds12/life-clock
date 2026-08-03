/**
 * script3d.js — Three.js 3D Life Sand Clock
 * Personalized for Deepanshu Singh (DOB: 01 Feb 1998)
 *
 * Features:
 *  • 3D glass hourglass with LatheGeometry + MeshPhysicalMaterial
 *  • Amber sand particle system (shader-based level control)
 *  • Falling sand stream through the neck
 *  • Cosmic starfield
 *  • OrbitControls (drag to rotate, scroll to zoom)
 *  • Live age counter ticking every second
 *  • Wisdom carousel + YouTube player
 *  • All original dataset logic preserved (countries, living beings)
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

// ============================================================
// CONSTANTS
// ============================================================
const DOB_DEFAULT   = '1998-02-01';   // 1 February 1998
const LIFESPAN_DEF  = 72;             // India avg life expectancy
const INTRO_MS      = 14000;          // sand fill animation duration (ms)
const N_SAND        = 22000;          // particles per bulb
const N_STREAM      = 100;            // stream particles
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

// ============================================================
// DATASETS (same as original project)
// ============================================================
const livingBeingLifespan = {
  // Mammals
  Human: 73, Dog: 13, Cat: 15, Elephant: 70, Horse: 30, Cow: 20, Rabbit: 9,
  Mouse: 2, Rat: 3, Pig: 15, Sheep: 12, Goat: 15, Kangaroo: 20, Giraffe: 25,
  Lion: 14, Tiger: 16, Leopard: 15, Cheetah: 12, Bear: 25, Wolf: 13, Deer: 20,
  Camel: 40, Dolphin: 40, 'Blue Whale': 80, 'Orca (Killer Whale)': 50, Bat: 20,
  // Birds
  Parrot: 50, Macaw: 60, Cockatoo: 70, Pigeon: 6, Crow: 14, Sparrow: 3,
  Eagle: 20, Owl: 15, Swan: 20, Penguin: 20, Chicken: 8, Duck: 10, Goose: 15,
  Falcon: 13, Peacock: 20,
  // Reptiles
  Crocodile: 70, Alligator: 50, Lizard: 5, Gecko: 10, Chameleon: 7, Frog: 10,
  Toad: 12, Tortoise: 100, 'Sea Turtle': 80, 'Komodo Dragon': 30,
  // Marine
  Goldfish: 10, 'Koi Fish': 40, Shark: 30, 'Great White Shark': 70, Salmon: 4,
  Tuna: 15, Clownfish: 10, Octopus: 3, Squid: 2, Lobster: 50, Crab: 8,
  Starfish: 10, Jellyfish: 1,
  // Insects
  Ant: 0.2, Bee: 0.3, Butterfly: 0.1, Dragonfly: 0.5, Mosquito: 0.05,
  Cockroach: 1, Spider: 2, Tarantula: 20, Scorpion: 5, Grasshopper: 0.5, Ladybug: 1,
  // Trees & Plants
  'Oak Tree': 300, 'Pine Tree': 250, 'Baobab Tree': 2000, Bamboo: 120,
  'Banana Plant': 25, 'Sequoia Tree': 3000, Cactus: 150, 'Mango Tree': 100, 'Palm Tree': 80,
};

const countryLifeExpectancy = {
  Afghanistan: 66.54, Albania: 79.95, Algeria: 76.38, Angola: 61.64, Argentina: 77.69,
  Armenia: 76.01, Australia: 84.21, Austria: 82.29, Azerbaijan: 74.43, Bahamas: 74.55,
  Bahrain: 81.58, Bangladesh: 74.67, Barbados: 76.18, Belarus: 74.18, Belgium: 82.4,
  Belize: 73.57, Benin: 60.77, Bhutan: 72.97, Bolivia: 68.58,
  'Bosnia and Herzegovina': 77.85, Botswana: 69.16, Brazil: 75.85, Brunei: 75.33,
  Bulgaria: 75.71, Burundi: 63.65, Cambodia: 70.67, Cameroon: 63.7, Canada: 81.65,
  'Central African Republic': 57.41, Chad: 55.07, Chile: 81.17, China: 77.95,
  Colombia: 77.72, Comoros: 66.78, 'Costa Rica': 80.8, Croatia: 78.47, Cuba: 78.08,
  Cyprus: 81.65, 'Czech Republic': 79.88, Denmark: 81.85, 'Dominican Republic': 73.72,
  Ecuador: 77.39, Egypt: 71.63, 'El Salvador': 72.1, Estonia: 78.49, Eswatini: 64.12,
  Ethiopia: 67.32, Finland: 81.69, France: 82.93, Gabon: 68.34, Gambia: 65.86,
  Georgia: 74.5, Germany: 80.54, Ghana: 65.5, Greece: 81.54, Guatemala: 72.6,
  Guinea: 60.74, 'Guinea-Bissau': 64.08, Haiti: 64.94, Honduras: 72.88, Hungary: 76.77,
  Iceland: 82.61, India: 72.0, Indonesia: 71.15, Iran: 77.65, Iraq: 72.32,
  Ireland: 82.86, Israel: 83.2, Italy: 83.7, Jamaica: 71.48, Japan: 84.04,
  Jordan: 77.81, Kazakhstan: 74.4, Kenya: 63.65, Kosovo: 78.03, Kuwait: 83.19,
  Kyrgyzstan: 72.25, Laos: 68.96, Latvia: 75.68, Lebanon: 77.82, Lesotho: 57.38,
  Liberia: 62.16, Libya: 69.34, Lithuania: 76.99, Luxembourg: 83.36, Macedonia: 75.32,
  Madagascar: 63.63, Malawi: 67.35, Malaysia: 76.66, Maldives: 81.04, Mali: 60.44,
  Malta: 83.51, Mauritania: 68.48, Mauritius: 73.41, Mexico: 75.07, Moldova: 71.2,
  Mongolia: 72.12, Montenegro: 77.59, Morocco: 75.31, Mozambique: 63.61, Myanmar: 66.89,
  Namibia: 67.39, Nepal: 70.35, Netherlands: 81.91, 'New Zealand': 83.0,
  Nicaragua: 74.95, Niger: 61.18, Nigeria: 54.46, 'North Korea': 73.64, Norway: 83.11,
  Oman: 80.03, Pakistan: 67.65, Panama: 79.59, 'Papua New Guinea': 66.13,
  Paraguay: 73.84, Peru: 77.74, Philippines: 69.83, Poland: 78.51, Portugal: 82.28,
  Qatar: 82.37, Romania: 76.61, Russia: 73.25, Rwanda: 67.78, 'Saudi Arabia': 78.73,
  Senegal: 68.68, Serbia: 76.22, Seychelles: 74.96, 'Sierra Leone': 61.79,
  Singapore: 82.9, Slovakia: 78.02, Slovenia: 81.98, Somalia: 58.82,
  'South Africa': 66.14, 'South Korea': 83.43, 'South Sudan': 57.62, Spain: 83.88,
  'Sri Lanka': 77.48, Sudan: 66.33, Sweden: 83.31, Switzerland: 84.06, Syria: 72.12,
  Taiwan: 80.94, Tajikistan: 71.79, Tanzania: 67.0, Thailand: 76.41, Togo: 62.74,
  Tunisia: 76.51, Turkey: 77.16, Turkmenistan: 70.07, Uganda: 68.25, Ukraine: 73.42,
  'United Arab Emirates': 82.91, 'United Kingdom': 81.24, 'United States': 78.39,
  Uruguay: 78.14, Uzbekistan: 72.39, Venezuela: 72.51, Vietnam: 74.59, Yemen: 69.3,
  Zambia: 66.35, Zimbabwe: 62.78,
};

// ============================================================
// DOM ELEMENTS
// ============================================================
const canvas         = document.getElementById('three-canvas');
const hero           = document.getElementById('hero');
const dobInput       = document.getElementById('dob');
const lifespanInput  = document.getElementById('lifespan');
const ageSlider      = document.getElementById('age');
const useDOBBtn      = document.getElementById('useDOB');
const countrySelect  = document.getElementById('country');
const livingBeingEl  = document.getElementById('livingBeing');
const livingBeingList= document.getElementById('livingBeingList');
const exactAgeEl     = document.getElementById('exactAge');
const yearsLivedEl   = document.getElementById('yearsLived');
const yearsLeftEl    = document.getElementById('yearsLeft');
const progressTextEl = document.getElementById('progressText');
const meterFill      = document.getElementById('meterFill');

// Populate living beings datalist
Object.keys(livingBeingLifespan).forEach(name => {
  const opt = document.createElement('option');
  opt.value = name;
  livingBeingList.appendChild(opt);
});

// Populate country select
Object.entries(countryLifeExpectancy).forEach(([country, exp]) => {
  const opt = document.createElement('option');
  opt.value = exp;
  opt.textContent = country;
  countrySelect.appendChild(opt);
});

// ============================================================
// THREE.JS — RENDERER SETUP
// ============================================================
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: false,
  powerPreference: 'high-performance',
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(hero.clientWidth, hero.clientHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
renderer.localClippingEnabled = true;
renderer.shadowMap.enabled = false;

const scene  = new THREE.Scene();
scene.background = new THREE.Color(0x020817);
scene.fog = new THREE.FogExp2(0x020817, 0.04);

const camera = new THREE.PerspectiveCamera(44, hero.clientWidth / hero.clientHeight, 0.1, 120);
camera.position.set(0, 0.4, 6.2);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping    = true;
controls.dampingFactor    = 0.06;
controls.minDistance      = 3;
controls.maxDistance      = 10;
controls.maxPolarAngle    = Math.PI * 0.78;
controls.minPolarAngle    = Math.PI * 0.18;
controls.autoRotate       = true;
controls.autoRotateSpeed  = 0.25;
controls.enablePan        = false;
controls.target.set(0, 0, 0);

// ============================================================
// ENVIRONMENT MAP (for glass reflections)
// ============================================================
const pmrem = new THREE.PMREMGenerator(renderer);
pmrem.compileEquirectangularShader();
const envTexture = pmrem.fromScene(new RoomEnvironment()).texture;
scene.environment = envTexture;

// ============================================================
// LIGHTING
// ============================================================
scene.add(new THREE.AmbientLight(0x0d1a38, 4));

const hemi = new THREE.HemisphereLight(0x1a2a50, 0x080808, 1.5);
scene.add(hemi);

const warmLight = new THREE.PointLight(0xf59e0b, 12, 5, 1.5);
warmLight.position.set(0, -1.6, 0.3);
scene.add(warmLight);

const coolLight = new THREE.PointLight(0x22d3ee, 6, 8, 1.5);
coolLight.position.set(1.5, 3.5, 2);
scene.add(coolLight);

const rimLight = new THREE.DirectionalLight(0x6688cc, 0.8);
rimLight.position.set(-2, 1, -3);
scene.add(rimLight);

const fillLight = new THREE.DirectionalLight(0xffffff, 0.4);
fillLight.position.set(0, 2, 4);
scene.add(fillLight);

// ============================================================
// STARFIELD
// ============================================================
const STAR_COUNT = 7000;
const starPos    = new Float32Array(STAR_COUNT * 3);
const starColors = new Float32Array(STAR_COUNT * 3);

for (let i = 0; i < STAR_COUNT; i++) {
  const theta = Math.random() * Math.PI * 2;
  const phi   = Math.acos(2 * Math.random() - 1);
  const r     = 30 + Math.random() * 50;
  starPos[i*3]   = r * Math.sin(phi) * Math.cos(theta);
  starPos[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
  starPos[i*3+2] = r * Math.cos(phi);
  const t = Math.random();
  if (t < 0.33)      { starColors[i*3]=1;    starColors[i*3+1]=0.95; starColors[i*3+2]=0.85; }
  else if (t < 0.66) { starColors[i*3]=0.85; starColors[i*3+1]=0.90; starColors[i*3+2]=1;    }
  else               { starColors[i*3]=1;    starColors[i*3+1]=1;    starColors[i*3+2]=1;    }
}

const starGeo = new THREE.BufferGeometry();
starGeo.setAttribute('position', new THREE.BufferAttribute(starPos,    3));
starGeo.setAttribute('color',    new THREE.BufferAttribute(starColors, 3));
const starMat = new THREE.PointsMaterial({
  size: 0.12, sizeAttenuation: true, vertexColors: true,
  transparent: true, opacity: 0.85, depthWrite: false,
});
const stars = new THREE.Points(starGeo, starMat);
scene.add(stars);

// ============================================================
// HOURGLASS GEOMETRY
// ============================================================
function glassRadius(y) {
  const n = Math.abs(clamp(y, -2, 2)) / 2;
  return 0.09 + 0.91 * Math.pow(n, 0.50);
}

function buildGlassProfile(segs = 52) {
  const pts = [];
  for (let i = 0; i <= segs; i++) {
    const t = i / segs;
    const y = (t - 0.5) * 4.6;
    const r = glassRadius(y) * 1.02;
    pts.push(new THREE.Vector2(r, y));
  }
  return pts;
}

const hourglassGroup = new THREE.Group();
scene.add(hourglassGroup);

// Glass shell
const glassMesh = new THREE.Mesh(
  new THREE.LatheGeometry(buildGlassProfile(), 96),
  new THREE.MeshPhysicalMaterial({
    color:           0x99ccee,
    metalness:       0.0,
    roughness:       0.02,
    transmission:    0.90,
    thickness:       0.2,
    transparent:     true,
    opacity:         0.75,
    side:            THREE.DoubleSide,
    ior:             1.48,
    envMapIntensity: 1.2,
    iridescence:     0.06,
    iridescenceIOR:  1.3,
    depthWrite:      false,
  })
);
hourglassGroup.add(glassMesh);

// Gold decorative rings
const goldMat = new THREE.MeshStandardMaterial({
  color: 0xd4a44c, metalness: 0.95, roughness: 0.1, envMapIntensity: 1.5,
});

function addRing(y, outerR, tubeR, segments = 64) {
  const ring = new THREE.Mesh(new THREE.TorusGeometry(outerR, tubeR, 8, segments), goldMat);
  ring.position.y = y;
  hourglassGroup.add(ring);
}
addRing(2.0,   1.02, 0.045);
addRing(-2.0,  1.02, 0.045);
addRing(0.0,  0.095, 0.030);

// Wooden stands
const woodMat = new THREE.MeshStandardMaterial({ color: 0x4a2007, metalness: 0.05, roughness: 0.85 });

function addDisc(y) {
  const disc = new THREE.Mesh(new THREE.CylinderGeometry(1.22, 1.32, 0.14, 48, 1), woodMat);
  disc.position.y = y;
  hourglassGroup.add(disc);
  const edgeRing = new THREE.Mesh(new THREE.TorusGeometry(1.27, 0.025, 6, 48), goldMat);
  edgeRing.position.y = y + (y > 0 ? -0.07 : 0.07);
  hourglassGroup.add(edgeRing);
}
addDisc( 2.22);
addDisc(-2.22);

// Inner glow orbs
const glowMat = new THREE.MeshBasicMaterial({
  color: 0xf59e0b, transparent: true, opacity: 0.04,
  side: THREE.BackSide, depthWrite: false,
});
const topGlow    = new THREE.Mesh(new THREE.SphereGeometry(0.7, 16, 16), glowMat.clone());
topGlow.position.y = 1.0;
hourglassGroup.add(topGlow);
const bottomGlow = new THREE.Mesh(new THREE.SphereGeometry(0.7, 16, 16), glowMat.clone());
bottomGlow.position.y = -1.0;
hourglassGroup.add(bottomGlow);

// ============================================================
// SAND PARTICLE SYSTEM
// ============================================================
function generateBulbPoints(yMin, yMax, count) {
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const y     = yMin + Math.random() * (yMax - yMin);
    const maxR  = glassRadius(y) * 0.92;
    const r     = Math.sqrt(Math.random()) * maxR;
    const theta = Math.random() * Math.PI * 2;
    pos[i*3]   = r * Math.cos(theta);
    pos[i*3+1] = y;
    pos[i*3+2] = r * Math.sin(theta);
  }
  return pos;
}

const SAND_VERT = /* glsl */`
  varying float vWorldY;
  varying float vDistFromAxis;
  void main() {
    vec4 worldPos  = modelMatrix * vec4(position, 1.0);
    vWorldY        = worldPos.y;
    vDistFromAxis  = length(worldPos.xz);
    gl_PointSize   = 3.5;
    gl_Position    = projectionMatrix * viewMatrix * worldPos;
  }
`;

const SAND_FRAG = /* glsl */`
  uniform float sandLevel;
  uniform vec3  colorA;
  uniform vec3  colorB;
  uniform float yMin;
  uniform float yRange;
  varying float vWorldY;
  varying float vDistFromAxis;
  void main() {
    if (vWorldY > sandLevel) discard;
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float t     = clamp((vWorldY - yMin) / yRange, 0.0, 1.0);
    vec3  color = mix(colorB, colorA, t * t);
    float alpha = 1.0 - smoothstep(0.35, 0.5, d);
    gl_FragColor = vec4(color, alpha);
  }
`;

// Top bulb sand
const topSandGeo = new THREE.BufferGeometry();
topSandGeo.setAttribute('position', new THREE.BufferAttribute(generateBulbPoints(0, 2, N_SAND), 3));
const topSandMat = new THREE.ShaderMaterial({
  uniforms: {
    sandLevel: { value:  2.0 },
    colorA:    { value: new THREE.Color(0xd4a030) },
    colorB:    { value: new THREE.Color(0x9a6010) },
    yMin:      { value:  0.0 },
    yRange:    { value:  2.0 },
  },
  vertexShader: SAND_VERT, fragmentShader: SAND_FRAG,
  transparent: true, depthWrite: false,
});
const topSandPoints = new THREE.Points(topSandGeo, topSandMat);
hourglassGroup.add(topSandPoints);

// Bottom bulb sand
const bottomSandGeo = new THREE.BufferGeometry();
bottomSandGeo.setAttribute('position', new THREE.BufferAttribute(generateBulbPoints(-2, 0, N_SAND), 3));
const bottomSandMat = new THREE.ShaderMaterial({
  uniforms: {
    sandLevel: { value: -2.0 },
    colorA:    { value: new THREE.Color(0xc89428) },
    colorB:    { value: new THREE.Color(0x7a4a08) },
    yMin:      { value: -2.0 },
    yRange:    { value:  2.0 },
  },
  vertexShader: SAND_VERT, fragmentShader: SAND_FRAG,
  transparent: true, depthWrite: false,
});
const bottomSandPoints = new THREE.Points(bottomSandGeo, bottomSandMat);
hourglassGroup.add(bottomSandPoints);

// ============================================================
// FALLING SAND STREAM
// ============================================================
const streamPos = new Float32Array(N_STREAM * 3);
const streamVel = new Float32Array(N_STREAM);
for (let i = 0; i < N_STREAM; i++) {
  const t     = i / N_STREAM;
  const theta = Math.random() * Math.PI * 2;
  const r     = Math.random() * 0.04;
  streamPos[i*3]   = r * Math.cos(theta);
  streamPos[i*3+1] = -t * 0.55;
  streamPos[i*3+2] = r * Math.sin(theta);
  streamVel[i] = 0.012 + Math.random() * 0.018;
}
const streamGeo = new THREE.BufferGeometry();
streamGeo.setAttribute('position', new THREE.BufferAttribute(streamPos, 3));
const streamPoints = new THREE.Points(streamGeo, new THREE.PointsMaterial({
  color: 0xf0a020, size: 0.035, sizeAttenuation: true,
  transparent: true, opacity: 0.92, depthWrite: false,
}));
hourglassGroup.add(streamPoints);

// ============================================================
// NEBULA WISPS
// ============================================================
function makeNebula(count, spread, colorHex, y_offset) {
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2;
    const r     = 3 + Math.random() * spread;
    pos[i*3]   = r * Math.cos(theta);
    pos[i*3+1] = y_offset + (Math.random() - 0.5) * 4;
    pos[i*3+2] = r * Math.sin(theta);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  return new THREE.Points(geo, new THREE.PointsMaterial({
    color: colorHex, size: 0.08, sizeAttenuation: true,
    transparent: true, opacity: 0.15, depthWrite: false,
  }));
}
scene.add(makeNebula(800, 5, 0xf59e0b, 0));
scene.add(makeNebula(600, 7, 0x22d3ee, 2));
scene.add(makeNebula(400, 6, 0x6644bb, -2));

// ============================================================
// STATE
// ============================================================
let currentAge      = 0;
let lifeProgress    = 0;
let displayProgress = 0;
let introStart      = null;

function getLifeProgress() {
  const lifespan = Math.max(1, parseFloat(lifespanInput.value) || LIFESPAN_DEF);
  return clamp(currentAge / lifespan, 0, 1);
}

function updateStats() {
  const dobStr   = dobInput.value;
  const lifespan = Math.max(1, parseFloat(lifespanInput.value) || LIFESPAN_DEF);

  if (dobStr) {
    const dob      = new Date(dobStr + 'T00:00:00');
    const now      = new Date();
    const diffMs   = now - dob;
    const diffSecs = diffMs / 1000;
    currentAge     = diffSecs / (365.25 * 24 * 3600);
    const totalDays = Math.floor(diffSecs / 86400);
    const yrs  = Math.floor(totalDays / 365.25);
    const rem  = Math.floor(totalDays % 365.25);
    const mos  = Math.floor(rem / 30.44);
    const dys  = Math.floor(rem % 30.44);
    if (exactAgeEl) exactAgeEl.textContent = `${yrs}y ${mos}m ${dys}d`;
  }

  lifeProgress = getLifeProgress();
  const yearsLeft = Math.max(0, lifespan - currentAge);
  if (yearsLivedEl)   yearsLivedEl.textContent   = currentAge.toFixed(1);
  if (yearsLeftEl)    yearsLeftEl.textContent     = yearsLeft.toFixed(1);
  if (progressTextEl) progressTextEl.textContent  = (lifeProgress * 100).toFixed(1) + '%';
  if (meterFill)      meterFill.style.width       = (lifeProgress * 100).toFixed(2) + '%';
  ageSlider.max   = lifespan;
  ageSlider.value = clamp(currentAge, 0, lifespan);
}

function restartIntro() { displayProgress = 0; introStart = null; }

// ============================================================
// LIVE COUNTER
// ============================================================
function updateLiveCounter() {
  const dob    = new Date((dobInput.value || DOB_DEFAULT) + 'T00:00:00');
  const now    = new Date();
  const diffMs = now - dob;
  if (diffMs < 0) return;
  const totalSec = Math.floor(diffMs / 1000);
  const secs     = totalSec % 60;
  const totalMin = Math.floor(totalSec / 60);
  const mins     = totalMin % 60;
  const totalHr  = Math.floor(totalMin / 60);
  const hours    = totalHr % 24;
  const totalDay = Math.floor(totalHr / 24);
  const days     = totalDay % 30;
  const totalMo  = Math.floor(totalDay / 30.44);
  const months   = totalMo % 12;
  const years    = Math.floor(totalMo / 12);
  const pad = n => String(n).padStart(2, '0');
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  set('c-years', years); set('c-months', pad(months)); set('c-days', pad(days));
  set('c-hours', pad(hours)); set('c-mins', pad(mins)); set('c-secs', pad(secs));
}
setInterval(() => { updateLiveCounter(); updateStats(); }, 1000);
updateLiveCounter();

// ============================================================
// SAND VISUAL UPDATE
// ============================================================
function updateSand(progress) {
  topSandMat.uniforms.sandLevel.value    =  2.0 * (1.0 - progress);
  bottomSandMat.uniforms.sandLevel.value = -2.0 + 2.0 * progress;
  streamPoints.visible = progress > 0.005 && progress < 0.995;
  bottomGlow.material.opacity = 0.03 + progress * 0.1;
  warmLight.intensity = 4 + progress * 14;
}

// ============================================================
// ANIMATION LOOP
// ============================================================
let clock = 0;

function animate(timestamp) {
  requestAnimationFrame(animate);
  clock = timestamp * 0.001;

  if (introStart === null) introStart = timestamp;
  const elapsed = timestamp - introStart;
  if (elapsed < INTRO_MS) {
    const t = elapsed / INTRO_MS;
    const eased = t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3) / 2;
    displayProgress = eased * lifeProgress;
  } else {
    displayProgress = lifeProgress;
  }

  updateSand(displayProgress);

  if (streamPoints.visible) {
    const attr = streamGeo.attributes.position;
    const bottomLevel = -2.0 + 2.0 * displayProgress;
    for (let i = 0; i < N_STREAM; i++) {
      attr.array[i*3+1] -= streamVel[i];
      if (attr.array[i*3+1] < bottomLevel + 0.05) {
        const theta = Math.random() * Math.PI * 2;
        const r     = Math.random() * 0.045;
        attr.array[i*3]   = r * Math.cos(theta);
        attr.array[i*3+1] = 0.05;
        attr.array[i*3+2] = r * Math.sin(theta);
      }
    }
    attr.needsUpdate = true;
  }

  stars.rotation.y = clock * 0.00006;
  stars.rotation.x = Math.sin(clock * 0.00004) * 0.02;

  const pulse = 0.03 + Math.sin(clock * 0.8) * 0.015;
  topGlow.material.opacity    = pulse * (1 - displayProgress * 0.6);
  bottomGlow.material.opacity = pulse * displayProgress;
  warmLight.intensity = (4 + displayProgress * 14) + Math.sin(clock * 0.7) * 0.8;

  controls.update();
  renderer.render(scene, camera);
}

// ============================================================
// INITIAL STATE
// ============================================================
dobInput.value      = DOB_DEFAULT;
lifespanInput.value = LIFESPAN_DEF;
livingBeingEl.value = 'Human';

const saved = {
  dob:    localStorage.getItem('lc_dob'),
  ls:     localStorage.getItem('lc_lifespan'),
  animal: localStorage.getItem('lc_animal'),
};
if (saved.dob)    dobInput.value      = saved.dob;
if (saved.ls)     lifespanInput.value = saved.ls;
if (saved.animal) {
  livingBeingEl.value = saved.animal;
  if (saved.animal !== 'Human') countrySelect.disabled = true;
}

updateStats();
restartIntro();
animate(0);

// ============================================================
// EVENT LISTENERS
// ============================================================
function saveState() {
  localStorage.setItem('lc_dob',      dobInput.value);
  localStorage.setItem('lc_lifespan', lifespanInput.value);
  localStorage.setItem('lc_animal',   livingBeingEl.value);
}

dobInput.addEventListener('input',      () => { updateStats(); restartIntro(); updateLiveCounter(); saveState(); });
useDOBBtn.addEventListener('click',     () => { updateStats(); restartIntro(); saveState(); });
lifespanInput.addEventListener('input', () => { updateStats(); restartIntro(); saveState(); });

ageSlider.addEventListener('input', () => {
  currentAge = parseFloat(ageSlider.value) || 0;
  const synced = new Date(Date.now() - currentAge * 365.25 * 24 * 3600 * 1000);
  dobInput.value = synced.toISOString().slice(0, 10);
  lifeProgress = getLifeProgress();
  restartIntro(); saveState(); updateStats();
});

countrySelect.addEventListener('change', () => {
  if (countrySelect.value) { lifespanInput.value = countrySelect.value; updateStats(); restartIntro(); saveState(); }
});

livingBeingEl.addEventListener('change', () => {
  const val = livingBeingEl.value;
  if (livingBeingLifespan[val]) {
    lifespanInput.value    = livingBeingLifespan[val];
    countrySelect.disabled = val !== 'Human';
    if (val !== 'Human') countrySelect.selectedIndex = 0;
    updateStats(); restartIntro(); saveState();
  }
});

// ============================================================
// RESIZE
// ============================================================
window.addEventListener('resize', () => {
  const w = hero.clientWidth, h = hero.clientHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
});

// ============================================================
// NAV
// ============================================================
const nav      = document.getElementById('nav');
const menuBtn  = document.getElementById('nav-menu-btn');
const mobileNav= document.getElementById('mobile-nav');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 80);
});
menuBtn?.addEventListener('click', () => mobileNav.classList.toggle('open'));
document.querySelectorAll('.mobile-nav-link').forEach(link => {
  link.addEventListener('click', () => mobileNav.classList.remove('open'));
});
document.getElementById('scroll-indicator')?.addEventListener('click', () => {
  document.getElementById('intro-section')?.scrollIntoView({ behavior: 'smooth' });
});

// ============================================================
// SCROLL FADE-IN
// ============================================================
const observer = new IntersectionObserver(
  (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
  { threshold: 0.12 }
);
document.querySelectorAll('.fade-in-section').forEach(el => observer.observe(el));

// ============================================================
// WISDOM CAROUSEL
// ============================================================
fetch('wisdom-data.json')
  .then(r => r.ok ? r.json() : Promise.reject(r.statusText))
  .then(data => {
    const quotes = data.quotes;
    if (!quotes?.length) return;
    let idx   = parseInt(localStorage.getItem('lc_quoteIdx')) || 0;
    let timer = null;
    const qText    = document.getElementById('quoteText');
    const qCounter = document.getElementById('quoteCounter');
    const qBox     = document.getElementById('quoteBox');
    const nextBtn  = document.getElementById('nextQuoteBtn');
    const prevBtn  = document.getElementById('prevQuoteBtn');
    const pauseBtn = document.getElementById('pauseQuoteBtn');
    function showQuote(i) {
      if (!qText) return;
      qText.classList.remove('visible');
      setTimeout(() => {
        qText.innerHTML = `"${quotes[i]}"`;
        qText.classList.add('visible');
        if (qCounter) qCounter.textContent = `${i+1} of ${quotes.length}`;
      }, 500);
      localStorage.setItem('lc_quoteIdx', i);
    }
    function startCycle() {
      if (timer) return;
      if (pauseBtn) pauseBtn.textContent = 'Pause';
      timer = setInterval(() => { idx = (idx+1) % quotes.length; showQuote(idx); }, 20000);
    }
    function stopCycle() {
      clearInterval(timer); timer = null;
      if (pauseBtn) pauseBtn.textContent = 'Play';
    }
    nextBtn?.addEventListener('click',  () => { stopCycle(); idx=(idx+1)%quotes.length; showQuote(idx); });
    prevBtn?.addEventListener('click',  () => { stopCycle(); idx=(idx-1+quotes.length)%quotes.length; showQuote(idx); });
    pauseBtn?.addEventListener('click', () => timer ? stopCycle() : startCycle());
    if (qBox) qBox.classList.add('visible');
    showQuote(idx);
    startCycle();
  })
  .catch(() => {
    const el = document.getElementById('quoteText');
    if (el) { el.textContent = 'Could not load wisdom.'; el.classList.add('visible'); }
  });

// ============================================================
// YOUTUBE PLAYER
// ============================================================
window.onYouTubeIframeAPIReady = function () {
  new YT.Player('youtube-player', {
    videoId: 'vxQKqtlPvks',
    playerVars: { controls: 1, autoplay: 0, loop: 1, playlist: 'vxQKqtlPvks', modestbranding: 1 },
  });
};
