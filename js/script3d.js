/**
 * script3d.js — Three.js 3D Life Sand Clock
 * Personalized for Deepanshu Singh (DOB: 01 Feb 1998)
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const DOB_DEFAULT  = '1998-02-01';
const LIFESPAN_DEF = 72;
const INTRO_MS     = 14000;
const N_SAND       = 22000;
const N_STREAM     = 100;
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

// ── Datasets ────────────────────────────────────────────────
const livingBeingLifespan = {
  Human: 73, Dog: 13, Cat: 15, Elephant: 70, Horse: 30, Cow: 20, Rabbit: 9,
  Mouse: 2, Rat: 3, Pig: 15, Sheep: 12, Goat: 15, Kangaroo: 20, Giraffe: 25,
  Lion: 14, Tiger: 16, Leopard: 15, Cheetah: 12, Bear: 25, Wolf: 13, Deer: 20,
  Camel: 40, Dolphin: 40, 'Blue Whale': 80, 'Orca (Killer Whale)': 50, Bat: 20,
  Parrot: 50, Macaw: 60, Cockatoo: 70, Pigeon: 6, Crow: 14, Sparrow: 3,
  Eagle: 20, Owl: 15, Swan: 20, Penguin: 20, Chicken: 8, Duck: 10, Goose: 15,
  Falcon: 13, Peacock: 20,
  Crocodile: 70, Alligator: 50, Lizard: 5, Gecko: 10, Chameleon: 7, Frog: 10,
  Toad: 12, Tortoise: 100, 'Sea Turtle': 80, 'Komodo Dragon': 30,
  Goldfish: 10, 'Koi Fish': 40, Shark: 30, 'Great White Shark': 70, Salmon: 4,
  Tuna: 15, Clownfish: 10, Octopus: 3, Squid: 2, Lobster: 50, Crab: 8,
  Starfish: 10, Jellyfish: 1,
  Ant: 0.2, Bee: 0.3, Butterfly: 0.1, Dragonfly: 0.5, Mosquito: 0.05,
  Cockroach: 1, Spider: 2, Tarantula: 20, Scorpion: 5, Grasshopper: 0.5, Ladybug: 1,
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

// ── DOM ─────────────────────────────────────────────────────
const threeCanvas    = document.getElementById('three-canvas');
const hero           = document.getElementById('hero');
const dobInput       = document.getElementById('dob');
const lifespanInput  = document.getElementById('lifespan');
const userNameInput  = document.getElementById('userName');
const heroNameDisplay= document.getElementById('heroNameDisplay');
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

Object.keys(livingBeingLifespan).forEach(name => {
  const opt = document.createElement('option'); opt.value = name; livingBeingList.appendChild(opt);
});
Object.entries(countryLifeExpectancy).forEach(([country, exp]) => {
  const opt = document.createElement('option'); opt.value = exp; opt.textContent = country; countrySelect.appendChild(opt);
});

// ── Renderer ────────────────────────────────────────────────
const renderer = new THREE.WebGLRenderer({
  canvas: threeCanvas, antialias: true, alpha: false, powerPreference: 'high-performance', preserveDrawingBuffer: true,
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(hero.clientWidth, hero.clientHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
renderer.localClippingEnabled = true;

const scene = new THREE.Scene();
// Procedural Universe Background (shifts between nebula and starry lake sky styles)
const bgGeo = new THREE.SphereGeometry(100, 32, 32);
const bgMat = new THREE.ShaderMaterial({
  side: THREE.BackSide,
  depthWrite: false,
  uniforms: { 
    time: { value: 0.0 },
    palette2: { value: new THREE.Color(0x1a6699) },
    palette3: { value: new THREE.Color(0x804c26) }
  },
  vertexShader: `
    varying vec3 vPos;
    void main() {
      vPos = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float time;
    uniform vec3 palette2;
    uniform vec3 palette3;
    varying vec3 vPos;
    float hash(float n) { return fract(sin(n)*43758.5453); }
    float noise(vec3 x) {
      vec3 p = floor(x); vec3 f = fract(x); f = f*f*(3.0-2.0*f);
      float n = p.x + p.y*57.0 + 113.0*p.z;
      return mix(mix(mix(hash(n+0.0),hash(n+1.0),f.x), mix(hash(n+57.0),hash(n+58.0),f.x),f.y),
                 mix(mix(hash(n+113.0),hash(n+114.0),f.x), mix(hash(n+170.0),hash(n+171.0),f.x),f.y),f.z);
    }
    float fbm(vec3 p) {
      float f=0.0; float w=0.5;
      for (int i=0; i<5; i++) { f+=w*noise(p); p*=2.0; w*=0.5; }
      return f;
    }
    void main() {
      vec3 dir = normalize(vPos);
      float n1 = fbm(dir * 2.0 + time * 0.02);
      float n2 = fbm(dir * 4.0 - time * 0.015);
      float n = fbm(dir * 1.5 + vec3(n1, n2, n1) * 2.0);
      vec3 color1 = vec3(0.01, 0.03, 0.08);   
      float cycle = sin(time * 0.05) * 0.5 + 0.5;
      vec3 nebulaColor = mix(palette2, palette3, n1 * cycle);
      vec3 finalCol = mix(color1, nebulaColor, smoothstep(0.3, 0.8, n));
      float band = smoothstep(0.5, 1.0, fbm(dir * 3.0));
      band *= smoothstep(0.4, 0.0, abs(dir.y)); 
      finalCol += vec3(0.05, 0.1, 0.15) * band * (1.0 - cycle);
      gl_FragColor = vec4(finalCol, 1.0);
    }
  `
});
const bgMesh = new THREE.Mesh(bgGeo, bgMat);
scene.add(bgMesh);

const camera = new THREE.PerspectiveCamera(44, hero.clientWidth / hero.clientHeight, 0.1, 120);
camera.position.set(0, 0, 10);

const controls = new OrbitControls(camera, threeCanvas);
controls.enableDamping = true; controls.dampingFactor = 0.06;
controls.minDistance = 5;  controls.maxDistance = 16;
controls.maxPolarAngle = Math.PI * 0.78; controls.minPolarAngle = Math.PI * 0.18;
controls.autoRotate = true; controls.autoRotateSpeed = 0.25;
controls.enablePan = false; controls.target.set(0, 0, 0);

const pmrem = new THREE.PMREMGenerator(renderer);
pmrem.compileEquirectangularShader();
scene.environment = pmrem.fromScene(new RoomEnvironment()).texture;

// ── Lights ──────────────────────────────────────────────────
scene.add(new THREE.AmbientLight(0x0d1a38, 4));
scene.add(new THREE.HemisphereLight(0x1a2a50, 0x080808, 1.5));
const warmLight = new THREE.PointLight(0xffd166, 12, 6, 1.5);
warmLight.position.set(0, -0.9, 0.3);
scene.add(warmLight);
const coolLight = new THREE.PointLight(0x22d3ee, 6, 8, 1.5);
coolLight.position.set(1.5, 2.0, 2);
scene.add(coolLight);
const dirLight1 = new THREE.DirectionalLight(0x6688cc, 0.8);
dirLight1.position.set(-2, 1, -3);
scene.add(dirLight1);
const dirLight2 = new THREE.DirectionalLight(0xffffff, 0.4);
dirLight2.position.set(0, 2, 4);
scene.add(dirLight2);

// Stars removed to prevent flashing and redundancy with background shader

// ── Hourglass ───────────────────────────────────────────────
function glassRadius(y) {
  const absY = Math.abs(y);
  if (absY <= 1.5) {
    const u = absY / 1.5;
    const s = Math.pow((1 - Math.cos(u * Math.PI)) / 2, 1.2);
    return 0.04 + 1.15 * s;
  } else {
    const t = clamp((absY - 1.5) / 0.9, 0.0, 1.0);
    return 0.04 + 1.15 * Math.sqrt(1.0 - t * t);
  }
}
function buildGlassProfile(segs=72) {
  const pts=[];
  for(let i=0;i<=segs;i++){const t=i/segs,y=(t-0.5)*4.6;pts.push(new THREE.Vector2(glassRadius(y)*1.02,y));}
  return pts;
}

const hourglassGroup = new THREE.Group();
hourglassGroup.scale.setScalar(0.60);
scene.add(hourglassGroup);

const hourglassMesh = new THREE.Mesh(
  new THREE.LatheGeometry(buildGlassProfile(), 96),
  new THREE.MeshPhysicalMaterial({
    color: 0xe0e8f0, metalness: 0.1, roughness: 0.05, transmission: 1.0, thickness: 0.2,
    transparent: true, opacity: 1.0, side: THREE.FrontSide, ior: 1.52,
    envMapIntensity: 1.5, iridescence: 0.1, iridescenceIOR: 1.3, depthWrite: false,
  })
);
hourglassMesh.renderOrder = 3;
hourglassGroup.add(hourglassMesh);

// Wood discs removed to match image reference

const glowBase = new THREE.MeshBasicMaterial({color:0xffd166,transparent:true,opacity:0.05,side:THREE.BackSide,depthWrite:false});
const topGlow    = new THREE.Mesh(new THREE.SphereGeometry(0.75,16,16), glowBase.clone());
topGlow.position.y = 1.0; hourglassGroup.add(topGlow);
const bottomGlow = new THREE.Mesh(new THREE.SphereGeometry(0.75,16,16), glowBase.clone());
bottomGlow.position.y = -1.0; hourglassGroup.add(bottomGlow);

// ── Sand shaders: object-space Y (position.y), no scale confusion ──
const SAND_VERT = /* glsl */`
  varying float vY;
  varying vec2 vXZ;
  void main() {
    vY = position.y;
    vXZ = position.xz;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position  = projectionMatrix * mvPosition;
    // Smaller point size for spaces in between sand
    gl_PointSize = 3.5;
  }
`;
const SAND_FRAG = /* glsl */`
  uniform float sandLevel;
  uniform float isTop;
  uniform vec3  colorTop;
  uniform vec3  colorBot;
  uniform float yMin;
  uniform float yRange;
  uniform vec3  localUp;
  varying float vY;
  varying vec2 vXZ;
  void main() {
    float r = length(vXZ);
    float localLevel = sandLevel;
    float shade = 1.0;
    
    if (isTop < 0.5) {
      // Bottom bulb: distinct cone shape pointing UP
      localLevel = sandLevel - r * 0.5 + 0.15;
      shade = mix(0.6, 1.2, 1.0 - clamp(r / 1.0, 0.0, 1.0));
    } else {
      // Top bulb: inverted cone pointing DOWN towards the drain
      localLevel = sandLevel + r * 0.45;
      shade = mix(0.8, 1.1, clamp(r / 1.0, 0.0, 1.0));
    }

    float h = dot(vec3(vXZ.x, vY, vXZ.y), localUp);
    if (h > localLevel) discard;
    
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float t = clamp((vY - yMin) / yRange, 0.0, 1.0);
    vec3  col = mix(colorBot, colorTop, t * t);
    
    col *= shade; // Apply depth shading
    
    float alpha = 1.0 - smoothstep(0.2, 0.5, d);
    gl_FragColor = vec4(col, alpha);
  }
`;

function generateBulbPoints(yMin, yMax, count) {
  const pos = new Float32Array(count*3);
  for(let i=0;i<count;i++) {
    const y=yMin+Math.random()*(yMax-yMin), maxR=glassRadius(y)*0.90, r=Math.sqrt(Math.random())*maxR, theta=Math.random()*Math.PI*2;
    pos[i*3]=r*Math.cos(theta); pos[i*3+1]=y; pos[i*3+2]=r*Math.sin(theta);
  }
  return pos;
}

// Top bulb: object Y 0 → 2, starts FULL (sandLevel=2.0), empties toward 0
const topSandGeo = new THREE.BufferGeometry();
topSandGeo.setAttribute('position', new THREE.BufferAttribute(generateBulbPoints(0,2,N_SAND),3));
const topSandMat = new THREE.ShaderMaterial({
  uniforms: {
    sandLevel: {value:  2.0},
    isTop:     {value:  1.0},
    colorTop:  {value: new THREE.Color(0xc9d4de)},  // Silver sand
    colorBot:  {value: new THREE.Color(0xc9d4de)},  // Silver sand
    yMin:      {value: 0.0},
    yRange:    {value: 2.0},
    localUp:   {value: new THREE.Vector3(0, 1, 0)}
  },
  vertexShader: SAND_VERT, fragmentShader: SAND_FRAG,
  transparent: true, depthWrite: false,
});
const topSandMesh = new THREE.Points(topSandGeo, topSandMat);
topSandMesh.renderOrder = 2;
hourglassGroup.add(topSandMesh);

// Bottom bulb: object Y -2 → 0, starts EMPTY (sandLevel=-2.0), fills toward 0
const bottomSandGeo = new THREE.BufferGeometry();
bottomSandGeo.setAttribute('position', new THREE.BufferAttribute(generateBulbPoints(-2,0,N_SAND),3));
const bottomSandMat = new THREE.ShaderMaterial({
  uniforms: {
    sandLevel: {value: -2.0},
    isTop:     {value:  0.0},
    colorTop:  {value: new THREE.Color(0xc9d4de)},
    colorBot:  {value: new THREE.Color(0xc9d4de)},
    yMin:      {value: -2.0},
    yRange:    {value: 2.0},
    localUp:   {value: new THREE.Vector3(0, 1, 0)}
  },
  vertexShader: SAND_VERT, fragmentShader: SAND_FRAG,
  transparent: true, depthWrite: false,
});
const bottomSandMesh = new THREE.Points(bottomSandGeo, bottomSandMat);
bottomSandMesh.renderOrder = 1;
hourglassGroup.add(bottomSandMesh);

// ── Falling stream ──────────────────────────────────────────
const streamPos = new Float32Array(N_STREAM*3), streamVel = new Float32Array(N_STREAM);
for(let i=0;i<N_STREAM;i++) {
  const t=i/N_STREAM, theta=Math.random()*Math.PI*2, r=Math.random()*0.015;
  streamPos[i*3]=r*Math.cos(theta); streamPos[i*3+1]=-t*0.6; streamPos[i*3+2]=r*Math.sin(theta);
  streamVel[i] = 0.012 + Math.random()*0.018;
}
const streamGeo = new THREE.BufferGeometry();
streamGeo.setAttribute('position', new THREE.BufferAttribute(streamPos,3));
const streamPoints = new THREE.Points(streamGeo, new THREE.PointsMaterial({
  color:0xc9d4de, size:0.04, sizeAttenuation:true, transparent:true, opacity:0.95, depthWrite:false,
}));
streamPoints.renderOrder = 3;
hourglassGroup.add(streamPoints);

// ── State ────────────────────────────────────────────────────
let currentAge=0, lifeProgress=0, displayProgress=0, introStart=null;

function getLifeProgress() {
  return clamp(currentAge / Math.max(1, parseFloat(lifespanInput.value)||LIFESPAN_DEF), 0, 1);
}
function updateStats() {
  const dobStr=dobInput.value, lifespan=Math.max(1,parseFloat(lifespanInput.value)||LIFESPAN_DEF);
  if(dobStr) {
    const ds=(new Date()-new Date(dobStr+'T00:00:00'))/1000;
    currentAge=ds/(365.25*24*3600);
    const td=Math.floor(ds/86400),yrs=Math.floor(td/365.25),rem=Math.floor(td%365.25);
    if(exactAgeEl) exactAgeEl.textContent=`${yrs}y ${Math.floor(rem/30.44)}m ${Math.floor(rem%30.44)}d`;
  }
  lifeProgress=getLifeProgress();
  const left=Math.max(0,(parseFloat(lifespanInput.value)||LIFESPAN_DEF)-currentAge);
  if(yearsLivedEl)   yearsLivedEl.textContent  =currentAge.toFixed(1);
  if(yearsLeftEl)    yearsLeftEl.textContent    =left.toFixed(1);
  if(progressTextEl) progressTextEl.textContent =(lifeProgress*100).toFixed(1)+'%';
  if(meterFill)      meterFill.style.width      =(lifeProgress*100).toFixed(2)+'%';
  ageSlider.max=parseFloat(lifespanInput.value)||LIFESPAN_DEF;
  ageSlider.value=clamp(currentAge,0,ageSlider.max);
}
function restartIntro(){displayProgress=0;introStart=null;}

function updateLiveCounter(){
  const dm=new Date()-new Date((dobInput.value||DOB_DEFAULT)+'T00:00:00');
  if(dm<0)return;
  const ts=Math.floor(dm/1000),secs=ts%60,tm=Math.floor(ts/60),mins=tm%60,th=Math.floor(tm/60),
        hours=th%24,td=Math.floor(th/24),days=td%30,tmo=Math.floor(td/30.44),months=tmo%12,years=Math.floor(tmo/12);
  const pad=n=>String(n).padStart(2,'0'),set=(id,v)=>{const e=document.getElementById(id);if(e)e.textContent=v;};
  set('c-years',years);set('c-months',pad(months));set('c-days',pad(days));
  set('c-hours',pad(hours));set('c-mins',pad(mins));set('c-secs',pad(secs));
}
setInterval(()=>{updateLiveCounter();updateStats();},1000);
updateLiveCounter();

// ── Sand update — object-space Y, no HSCALE needed ──────────────────
function updateSand(p){
  topSandMat.uniforms.sandLevel.value    =  1.7*(1.0-p);   // 1.7 → 0.0 (drains, starts a bit empty)
  bottomSandMat.uniforms.sandLevel.value = -2.0+1.7*p;     // -2.0 → -0.3 (fills, stops a bit empty)
  streamPoints.visible = p>0.005 && p<0.995;
  bottomGlow.material.opacity = 0.04+p*0.12;
  warmLight.intensity = 4+p*12;
}

// ── Animation loop ───────────────────────────────────────────
let clockT=0;
let isPaused = false;
window.pauseAnimation = () => { isPaused = true; };
window.resumeAnimation = () => { isPaused = false; requestAnimationFrame(animate); };

let targetTiltX = 0;
let targetTiltZ = 0;
let currentTiltX = 0;
let currentTiltZ = 0;
const MAX_TILT = 0.25;
let sandInertiaUp = new THREE.Vector3(0, 1, 0);

window.addEventListener('mousemove', (e) => {
  const mx = (e.clientX / window.innerWidth) * 2 - 1;
  const my = -(e.clientY / window.innerHeight) * 2 + 1;
  targetTiltZ = mx * MAX_TILT;
  targetTiltX = -my * MAX_TILT;
});

window.addEventListener('deviceorientation', (e) => {
  if (e.beta !== null && e.gamma !== null) {
    let g = clamp(e.gamma, -45, 45) / 45; 
    let b = clamp(e.beta - 45, -45, 45) / 45; 
    targetTiltZ = g * MAX_TILT;
    targetTiltX = b * MAX_TILT;
  }
});

function animate(ts){
  if (isPaused) return;
  requestAnimationFrame(animate);
  clockT=ts*0.001;
  
  if(typeof bgMat !== 'undefined') {
    bgMat.uniforms.time.value = clockT;
    
    // Cycle through 8 universe color palettes over time (e.g., 20 seconds per theme)
    const cycleTime = 20.0;
    const themeIdx = Math.floor(clockT / cycleTime) % 8;
    const nextThemeIdx = (themeIdx + 1) % 8;
    const mixFactor = (clockT % cycleTime) / cycleTime;
    
    // 8 procedural universe palettes mimicking the requested images
    const palettes = [
      [new THREE.Color(0x1a6699), new THREE.Color(0x804c26)], // Universe 1: Blue/Brown (Standard)
      [new THREE.Color(0x991a1a), new THREE.Color(0xcc6600)], // Universe 2: Red/Orange (Fiery)
      [new THREE.Color(0x4c1a99), new THREE.Color(0x1a9980)], // Universe 3: Purple/Teal
      [new THREE.Color(0x1a991a), new THREE.Color(0x99991a)], // Universe 4: Green/Yellow
      [new THREE.Color(0x991a99), new THREE.Color(0x1a1a99)], // Universe 5: Magenta/Deep Blue
      [new THREE.Color(0x1a9999), new THREE.Color(0x991a4c)], // Universe 6: Cyan/Pink
      [new THREE.Color(0x99661a), new THREE.Color(0x4c991a)], // Universe 7: Gold/Forest
      [new THREE.Color(0x333333), new THREE.Color(0x999999)]  // Universe 8: Monochromatic Silver
    ];
    
    const currP2 = palettes[themeIdx][0];
    const currP3 = palettes[themeIdx][1];
    const nextP2 = palettes[nextThemeIdx][0];
    const nextP3 = palettes[nextThemeIdx][1];
    
    bgMat.uniforms.palette2.value.lerpColors(currP2, nextP2, mixFactor);
    bgMat.uniforms.palette3.value.lerpColors(currP3, nextP3, mixFactor);
  }
  if(introStart===null)introStart=ts;
  const elapsed=ts-introStart;
  if(elapsed<INTRO_MS){
    const t=elapsed/INTRO_MS;
    displayProgress=(t<0.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2)*lifeProgress;
  } else { displayProgress=lifeProgress; }

  updateSand(displayProgress);

  // Physics Parallax and Sloshing
  currentTiltX += (targetTiltX - currentTiltX) * 0.08;
  currentTiltZ += (targetTiltZ - currentTiltZ) * 0.08;
  
  // Calculate tilt relative to the rotating camera so the glass always tilts matching the screen!
  const camRight = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion);
  const camUp = new THREE.Vector3(0, 1, 0).applyQuaternion(camera.quaternion);
  camRight.y = 0; camRight.normalize();
  const camForward = new THREE.Vector3().crossVectors(camRight, new THREE.Vector3(0, 1, 0)).normalize();
  
  const rotRight = new THREE.Quaternion().setFromAxisAngle(camRight, currentTiltX);
  const rotForward = new THREE.Quaternion().setFromAxisAngle(camForward, currentTiltZ);
  hourglassGroup.quaternion.copy(new THREE.Quaternion().multiplyQuaternions(rotRight, rotForward));

  const invRot = hourglassGroup.quaternion.clone().invert();
  const targetUp = new THREE.Vector3(0, 1, 0).applyQuaternion(invRot);
  
  sandInertiaUp.lerp(targetUp, 0.06);
  sandInertiaUp.normalize();
  
  topSandMat.uniforms.localUp.value.copy(sandInertiaUp);
  bottomSandMat.uniforms.localUp.value.copy(sandInertiaUp);

  if(streamPoints.visible){
    const attr=streamGeo.attributes.position;
    const bottomLevel=-2.0+1.7*displayProgress;  // object-space bottom fill Y
    for(let i=0;i<N_STREAM;i++){
      attr.array[i*3+1]-=streamVel[i];
      if(attr.array[i*3+1]<bottomLevel+0.05){
        const theta=Math.random()*Math.PI*2,r=Math.random()*0.015;
        attr.array[i*3]=r*Math.cos(theta); attr.array[i*3+1]=0.05; attr.array[i*3+2]=r*Math.sin(theta);
      }
    }
    attr.needsUpdate=true;
  }



  const pulse=0.04+Math.sin(clockT*0.8)*0.02;
  topGlow.material.opacity    = pulse*(1-displayProgress*0.7);
  bottomGlow.material.opacity = 0.04+displayProgress*0.14+Math.sin(clockT*0.9)*0.01;
  warmLight.intensity=(4+displayProgress*12)+Math.sin(clockT*0.7)*0.8;

  controls.update();
  renderer.render(scene,camera);
}

// ── Init ─────────────────────────────────────────────────────
dobInput.value=DOB_DEFAULT; lifespanInput.value=LIFESPAN_DEF; livingBeingEl.value='Human';
const saved={
  dob:localStorage.getItem('lc_dob'),
  ls:localStorage.getItem('lc_lifespan'),
  animal:localStorage.getItem('lc_animal'),
  name:localStorage.getItem('lc_name')
};

if(saved.name) {
  userNameInput.value = saved.name;
  heroNameDisplay.innerHTML = saved.name.replace(' ', '<br>');
}

if(saved.dob) dobInput.value=saved.dob;
if(saved.ls) {
  lifespanInput.value=saved.ls;
} else if (countryLifeExpectancy['India']) {
  // First time visitor: Default to India
  lifespanInput.value = countryLifeExpectancy['India'];
  countrySelect.value = countryLifeExpectancy['India'];
}

if(saved.animal){livingBeingEl.value=saved.animal;if(saved.animal!=='Human')countrySelect.disabled=true;}

updateStats(); restartIntro(); animate(0);

window.activateWallpaperMode = () => {
  const style = document.createElement('style');
  style.innerHTML = `
    nav, #scroll-indicator, .content-section, footer, #auth-modal, .hero-greeting, .hero-name, .hero-dob, .hero-hint, .sidebar-toggle-btn, .sidebar-close-btn, #stats-card, .card-title { display: none !important; }
    #hero { min-height: 100vh !important; }
    body { overflow: hidden !important; background: transparent !important; }
    #profile-card { background: transparent !important; border: none !important; margin: 0 auto !important; box-shadow: none !important; }
    .hero-right {
      position: absolute !important; right: 0 !important; left: 0 !important; bottom: 50px !important; top: auto !important;
      width: 100vw !important; height: auto !important; background: transparent !important; backdrop-filter: none !important;
      -webkit-backdrop-filter: none !important; border: none !important; padding: 0 !important; overflow: hidden !important;
    }
  `;
  document.head.appendChild(style);
};
// Still keep the URL param check as a fallback
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('wallpaper') === 'true') {
  window.activateWallpaperMode();
}

// ── Events ───────────────────────────────────────────────────
function saveState(){
  // Render current frame to ensure we capture the latest state
  renderer.render(scene, camera);
  const imageBase64 = threeCanvas.toDataURL('image/jpeg', 0.90);

  const data = {
    dob: dobInput.value,
    lifespan: lifespanInput.value,
    animal: livingBeingEl.value,
    name: userNameInput.value,
    imageBase64: imageBase64
  };
  localStorage.setItem('lc_dob', data.dob);
  localStorage.setItem('lc_lifespan', data.lifespan);
  localStorage.setItem('lc_animal', data.animal);
  localStorage.setItem('lc_name', data.name);
  
  if (window.saveToCloud) {
    window.saveToCloud(data);
  }
  if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.WidgetSync) {
    window.Capacitor.Plugins.WidgetSync.syncData(data).catch(console.error);
  }
}

function loadState(data) {
  if (data.name) {
    userNameInput.value = data.name;
    heroNameDisplay.innerHTML = data.name.replace(' ', '<br>');
  } else {
    userNameInput.value = '';
    heroNameDisplay.innerHTML = 'Life<br>Clock';
  }
  
  if (data.dob) dobInput.value = data.dob;
  
  if (data.lifespan) {
    lifespanInput.value = data.lifespan;
    countrySelect.value = data.lifespan;
  }
  
  if (data.animal) {
    livingBeingEl.value = data.animal;
    if (data.animal !== 'Human') countrySelect.disabled = true;
  }
  
  updateStats();
  restartIntro();
}

window.addEventListener('lifeclock-cloud-load', (e) => {
  console.log('Loaded from cloud:', e.detail);
  loadState(e.detail);
});

window.addEventListener('lifeclock-cloud-logout', () => {
  console.log('Logged out, reverting to local state');
  loadState({
    dob: localStorage.getItem('lc_dob') || DOB_DEFAULT,
    lifespan: localStorage.getItem('lc_lifespan') || LIFESPAN_DEF,
    animal: localStorage.getItem('lc_animal') || 'Human',
    name: localStorage.getItem('lc_name') || ''
  });
});

userNameInput.addEventListener('input', () => {
  const nm = userNameInput.value || 'Life Clock';
  heroNameDisplay.innerHTML = nm.replace(' ', '<br>');
  saveState();
});
dobInput.addEventListener('input',()=>{updateStats();restartIntro();updateLiveCounter();saveState();});
useDOBBtn.addEventListener('click',()=>{updateStats();restartIntro();saveState();});
lifespanInput.addEventListener('input',()=>{updateStats();restartIntro();saveState();});
ageSlider.addEventListener('input',()=>{
  currentAge=parseFloat(ageSlider.value)||0;
  dobInput.value=new Date(Date.now()-currentAge*365.25*24*3600*1000).toISOString().slice(0,10);
  lifeProgress=getLifeProgress();restartIntro();saveState();updateStats();
});
countrySelect.addEventListener('change',()=>{
  if(countrySelect.value){lifespanInput.value=countrySelect.value;updateStats();restartIntro();saveState();}
});
livingBeingEl.addEventListener('change',()=>{
  const val=livingBeingEl.value;
  if(livingBeingLifespan[val]){
    lifespanInput.value=livingBeingLifespan[val];
    countrySelect.disabled=val!=='Human';
    if(val!=='Human')countrySelect.selectedIndex=0;
    updateStats();restartIntro();saveState();
  }
});
function updateLayoutForMobile() {
  const isMobile = window.innerWidth <= 640;
  if (isMobile) {
    hourglassGroup.position.y = 0;
    hourglassGroup.scale.setScalar(0.48);
    controls.target.set(0, 0, 0);
  } else {
    hourglassGroup.position.y = 0;
    hourglassGroup.scale.setScalar(0.60);
    controls.target.set(0, 0, 0);
  }
}

window.addEventListener('resize', () => {
  const w = hero.clientWidth, h = hero.clientHeight;
  camera.aspect = w / h; camera.updateProjectionMatrix(); renderer.setSize(w, h);
  updateLayoutForMobile();
});

// Call once on init
updateLayoutForMobile();

// ── Nav & Sidebar ──────────────────────────────────────────────────────
const navEl=document.getElementById('nav'),menuBtn=document.getElementById('nav-menu-btn'),mobileNav=document.getElementById('mobile-nav');
window.addEventListener('scroll',()=>navEl.classList.toggle('scrolled',window.scrollY>80));
menuBtn?.addEventListener('click',()=>mobileNav.classList.toggle('open'));
document.querySelectorAll('.mobile-nav-link').forEach(l=>l.addEventListener('click',()=>mobileNav.classList.remove('open')));
document.getElementById('scroll-indicator')?.addEventListener('click',()=>document.getElementById('intro-section')?.scrollIntoView({behavior:'smooth'}));
const obsv=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible');}),{threshold:0.12});
document.querySelectorAll('.fade-in-section').forEach(el=>obsv.observe(el));

const sidebarToggle = document.getElementById('sidebar-toggle');
const sidebarClose = document.getElementById('sidebar-close');
const heroRight = document.querySelector('.hero-right');
if (sidebarToggle && heroRight) {
  sidebarToggle.addEventListener('click', () => heroRight.classList.add('open'));
}
if (sidebarClose && heroRight) {
  sidebarClose.addEventListener('click', () => heroRight.classList.remove('open'));
}

// ── Wisdom carousel ──────────────────────────────────────────
fetch('wisdom-data.json').then(r=>r.ok?r.json():Promise.reject()).then(data=>{
  const quotes=data.quotes;if(!quotes?.length)return;
  let idx=parseInt(localStorage.getItem('lc_quoteIdx'))||0,timer=null;
  const qText=document.getElementById('quoteText'),qCounter=document.getElementById('quoteCounter'),
        qBox=document.getElementById('quoteBox'),nextBtn=document.getElementById('nextQuoteBtn'),
        prevBtn=document.getElementById('prevQuoteBtn'),pauseBtn=document.getElementById('pauseQuoteBtn');
  function showQuote(i){if(!qText)return;qText.classList.remove('visible');setTimeout(()=>{qText.innerHTML=`"${quotes[i]}"`;qText.classList.add('visible');if(qCounter)qCounter.textContent=`${i+1} of ${quotes.length}`;},500);localStorage.setItem('lc_quoteIdx',i);}
  function startCycle(){if(timer)return;if(pauseBtn)pauseBtn.textContent='Pause';timer=setInterval(()=>{idx=(idx+1)%quotes.length;showQuote(idx);},20000);}
  function stopCycle(){clearInterval(timer);timer=null;if(pauseBtn)pauseBtn.textContent='Play';}
  nextBtn?.addEventListener('click',()=>{stopCycle();idx=(idx+1)%quotes.length;showQuote(idx);});
  prevBtn?.addEventListener('click',()=>{stopCycle();idx=(idx-1+quotes.length)%quotes.length;showQuote(idx);});
  pauseBtn?.addEventListener('click',()=>timer?stopCycle():startCycle());
  if(qBox)qBox.classList.add('visible');showQuote(idx);startCycle();
}).catch(()=>{const el=document.getElementById('quoteText');if(el){el.textContent='Could not load wisdom.';el.classList.add('visible');}});

// ── YouTube ───────────────────────────────────────────────────
window.onYouTubeIframeAPIReady=function(){new YT.Player('youtube-player',{videoId:'vxQKqtlPvks',playerVars:{controls:1,autoplay:0,loop:1,playlist:'vxQKqtlPvks',modestbranding:1}});};