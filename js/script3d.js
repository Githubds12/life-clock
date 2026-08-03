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
  canvas: threeCanvas, antialias: true, alpha: false, powerPreference: 'high-performance',
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(hero.clientWidth, hero.clientHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
renderer.localClippingEnabled = true;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x020817);
scene.fog = new THREE.FogExp2(0x020817, 0.018);

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
const warmLight = new THREE.PointLight(0xf59e0b, 12, 6, 1.5);
warmLight.position.set(0, -0.9, 0.3);
scene.add(warmLight);
const coolLight = new THREE.PointLight(0x22d3ee, 6, 8, 1.5);
coolLight.position.set(1.5, 2.0, 2);
scene.add(coolLight);
scene.add(Object.assign(new THREE.DirectionalLight(0x6688cc, 0.8), { position: new THREE.Vector3(-2, 1, -3) }));
scene.add(Object.assign(new THREE.DirectionalLight(0xffffff, 0.4), { position: new THREE.Vector3(0, 2, 4) }));

// ── Stars — ShaderMaterial with circle discard (guaranteed round dots) ──
const STAR_VERT = /* glsl */`
  attribute vec3 aColor;
  varying vec3 vCol;
  void main() {
    vCol = aColor;
    gl_PointSize = 2.5 + fract(position.x * 13.7) * 2.0;  // vary size 2.5–4.5px
    gl_Position  = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const STAR_FRAG = /* glsl */`
  varying vec3 vCol;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float alpha = 1.0 - smoothstep(0.25, 0.5, d);
    gl_FragColor = vec4(vCol, alpha * 0.9);
  }
`;

const STAR_COUNT = 6000;
const starPos    = new Float32Array(STAR_COUNT * 3);
const starCol    = new Float32Array(STAR_COUNT * 3);
for (let i = 0; i < STAR_COUNT; i++) {
  const theta = Math.random() * Math.PI * 2, phi = Math.acos(2 * Math.random() - 1), r = 28 + Math.random() * 40;
  starPos[i*3] = r*Math.sin(phi)*Math.cos(theta); starPos[i*3+1] = r*Math.sin(phi)*Math.sin(theta); starPos[i*3+2] = r*Math.cos(phi);
  const t = Math.random();
  if (t < 0.33)      { starCol[i*3]=1;    starCol[i*3+1]=0.95; starCol[i*3+2]=0.85; }
  else if (t < 0.66) { starCol[i*3]=0.85; starCol[i*3+1]=0.90; starCol[i*3+2]=1;    }
  else               { starCol[i*3]=1;    starCol[i*3+1]=1;    starCol[i*3+2]=1;    }
}
const starGeo = new THREE.BufferGeometry();
starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
starGeo.setAttribute('aColor',   new THREE.BufferAttribute(starCol, 3));
const stars = new THREE.Points(starGeo, new THREE.ShaderMaterial({
  vertexShader: STAR_VERT, fragmentShader: STAR_FRAG,
  transparent: true, depthWrite: false,
}));
scene.add(stars);

// ── Hourglass ───────────────────────────────────────────────
function glassRadius(y) { const n = Math.abs(clamp(y,-2,2))/2; return 0.09+0.91*Math.pow(n,0.5); }
function buildGlassProfile(segs=52) {
  const pts=[];
  for(let i=0;i<=segs;i++){const t=i/segs,y=(t-0.5)*4.6;pts.push(new THREE.Vector2(glassRadius(y)*1.02,y));}
  return pts;
}

const hourglassGroup = new THREE.Group();
hourglassGroup.scale.setScalar(0.60);
scene.add(hourglassGroup);

hourglassGroup.add(new THREE.Mesh(
  new THREE.LatheGeometry(buildGlassProfile(), 96),
  new THREE.MeshPhysicalMaterial({
    color:0x99ccee,metalness:0.0,roughness:0.02,transmission:0.90,thickness:0.2,
    transparent:true,opacity:0.72,side:THREE.DoubleSide,ior:1.48,
    envMapIntensity:1.2,iridescence:0.06,iridescenceIOR:1.3,depthWrite:false,
  })
));

const woodMat = new THREE.MeshStandardMaterial({ color:0x4a2007, metalness:0.05, roughness:0.85 });
function addDisc(y) {
  const d = new THREE.Mesh(new THREE.CylinderGeometry(1.22,1.32,0.14,48,1), woodMat);
  d.position.y = y; hourglassGroup.add(d);
}
addDisc( 2.22); addDisc(-2.22);

const glowBase = new THREE.MeshBasicMaterial({color:0xf59e0b,transparent:true,opacity:0.05,side:THREE.BackSide,depthWrite:false});
const topGlow    = new THREE.Mesh(new THREE.SphereGeometry(0.75,16,16), glowBase.clone());
topGlow.position.y = 1.0; hourglassGroup.add(topGlow);
const bottomGlow = new THREE.Mesh(new THREE.SphereGeometry(0.75,16,16), glowBase.clone());
bottomGlow.position.y = -1.0; hourglassGroup.add(bottomGlow);

// ── Sand shaders (use OBJECT-SPACE Y — no world matrix scale confusion) ──
//
// KEY FIX: use `position.y` directly (object-space of the Points child).
// Since Points is a child of hourglassGroup, its local space = group local space.
// sandLevel is therefore in the same space: top bulb 0→2, bottom -2→0.
// No HSCALE multiplication needed anywhere.
const SAND_VERT = /* glsl */`
  varying float vY;     // object-space Y — same space as sandLevel uniform
  varying float vDist;  // radial distance from axis (for edge fade)
  void main() {
    vY    = position.y;
    vDist = length(position.xz);
    gl_PointSize = 3.5;
    gl_Position  = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const SAND_FRAG = /* glsl */`
  uniform float sandLevel;  // object-space Y cutoff
  uniform vec3  colorTop;   // colour at the sand surface
  uniform vec3  colorBot;   // colour at the deepest sand
  uniform float yMin;       // bottom of this bulb (object space)
  uniform float yRange;     // height of this bulb
  varying float vY;
  void main() {
    if (vY > sandLevel) discard;
    // circular particle
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    // gradient: bright at surface, slightly darker at depth
    float t = clamp((vY - yMin) / yRange, 0.0, 1.0);
    vec3  col = mix(colorBot, colorTop, t * t);
    float alpha = 1.0 - smoothstep(0.35, 0.5, d);
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
    colorTop:  {value: new THREE.Color(0xf0b040)},  // bright amber at surface
    colorBot:  {value: new THREE.Color(0xb07020)},  // mid-gold at depth
    yMin:      {value:  0.0},
    yRange:    {value:  2.0},
  },
  vertexShader: SAND_VERT, fragmentShader: SAND_FRAG,
  transparent: true, depthWrite: false,
});
hourglassGroup.add(new THREE.Points(topSandGeo, topSandMat));

// Bottom bulb: object Y -2 → 0, starts EMPTY (sandLevel=-2.0), fills toward 0
const bottomSandGeo = new THREE.BufferGeometry();
bottomSandGeo.setAttribute('position', new THREE.BufferAttribute(generateBulbPoints(-2,0,N_SAND),3));
const bottomSandMat = new THREE.ShaderMaterial({
  uniforms: {
    sandLevel: {value: -2.0},
    colorTop:  {value: new THREE.Color(0xf0b040)},  // bright amber at surface (fill level)
    colorBot:  {value: new THREE.Color(0xc08030)},  // warm orange-gold at depth (not dark!)
    yMin:      {value: -2.0},
    yRange:    {value:  2.0},
  },
  vertexShader: SAND_VERT, fragmentShader: SAND_FRAG,
  transparent: true, depthWrite: false,
});
hourglassGroup.add(new THREE.Points(bottomSandGeo, bottomSandMat));

// ── Falling stream ──────────────────────────────────────────
const streamPos = new Float32Array(N_STREAM*3), streamVel = new Float32Array(N_STREAM);
for(let i=0;i<N_STREAM;i++) {
  const t=i/N_STREAM, theta=Math.random()*Math.PI*2, r=Math.random()*0.04;
  streamPos[i*3]=r*Math.cos(theta); streamPos[i*3+1]=-t*0.6; streamPos[i*3+2]=r*Math.sin(theta);
  streamVel[i] = 0.012 + Math.random()*0.018;
}
const streamGeo = new THREE.BufferGeometry();
streamGeo.setAttribute('position', new THREE.BufferAttribute(streamPos,3));
const streamPoints = new THREE.Points(streamGeo, new THREE.PointsMaterial({
  color:0xffc040, size:0.04, sizeAttenuation:true, transparent:true, opacity:0.95, depthWrite:false,
}));
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
  topSandMat.uniforms.sandLevel.value    =  2.0*(1.0-p);   // 2.0 → 0.0 (drains)
  bottomSandMat.uniforms.sandLevel.value = -2.0+2.0*p;     // -2.0 → 0.0 (fills)
  streamPoints.visible = p>0.005 && p<0.995;
  bottomGlow.material.opacity = 0.04+p*0.12;
  warmLight.intensity = 4+p*12;
}

// ── Animation loop ───────────────────────────────────────────
let clockT=0;
function animate(ts){
  requestAnimationFrame(animate);
  clockT=ts*0.001;
  if(introStart===null)introStart=ts;
  const elapsed=ts-introStart;
  if(elapsed<INTRO_MS){
    const t=elapsed/INTRO_MS;
    displayProgress=(t<0.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2)*lifeProgress;
  } else { displayProgress=lifeProgress; }

  updateSand(displayProgress);

  if(streamPoints.visible){
    const attr=streamGeo.attributes.position;
    const bottomLevel=-2.0+2.0*displayProgress;  // object-space bottom fill Y
    for(let i=0;i<N_STREAM;i++){
      attr.array[i*3+1]-=streamVel[i];
      if(attr.array[i*3+1]<bottomLevel+0.05){
        const theta=Math.random()*Math.PI*2,r=Math.random()*0.045;
        attr.array[i*3]=r*Math.cos(theta); attr.array[i*3+1]=0.05; attr.array[i*3+2]=r*Math.sin(theta);
      }
    }
    attr.needsUpdate=true;
  }

  stars.rotation.y=clockT*0.00006;
  stars.rotation.x=Math.sin(clockT*0.00004)*0.02;

  const pulse=0.04+Math.sin(clockT*0.8)*0.02;
  topGlow.material.opacity    = pulse*(1-displayProgress*0.7);
  bottomGlow.material.opacity = 0.04+displayProgress*0.14+Math.sin(clockT*0.9)*0.01;
  warmLight.intensity=(4+displayProgress*12)+Math.sin(clockT*0.7)*0.8;

  controls.update();
  renderer.render(scene,camera);
}

// ── Init ─────────────────────────────────────────────────────
dobInput.value=DOB_DEFAULT; lifespanInput.value=LIFESPAN_DEF; livingBeingEl.value='Human';
const saved={dob:localStorage.getItem('lc_dob'),ls:localStorage.getItem('lc_lifespan'),animal:localStorage.getItem('lc_animal')};
if(saved.dob)dobInput.value=saved.dob;
if(saved.ls)lifespanInput.value=saved.ls;
if(saved.animal){livingBeingEl.value=saved.animal;if(saved.animal!=='Human')countrySelect.disabled=true;}
updateStats(); restartIntro(); animate(0);

// ── Events ───────────────────────────────────────────────────
function saveState(){localStorage.setItem('lc_dob',dobInput.value);localStorage.setItem('lc_lifespan',lifespanInput.value);localStorage.setItem('lc_animal',livingBeingEl.value);}
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
window.addEventListener('resize',()=>{
  const w=hero.clientWidth,h=hero.clientHeight;
  camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h);
});

// ── Nav ──────────────────────────────────────────────────────
const navEl=document.getElementById('nav'),menuBtn=document.getElementById('nav-menu-btn'),mobileNav=document.getElementById('mobile-nav');
window.addEventListener('scroll',()=>navEl.classList.toggle('scrolled',window.scrollY>80));
menuBtn?.addEventListener('click',()=>mobileNav.classList.toggle('open'));
document.querySelectorAll('.mobile-nav-link').forEach(l=>l.addEventListener('click',()=>mobileNav.classList.remove('open')));
document.getElementById('scroll-indicator')?.addEventListener('click',()=>document.getElementById('intro-section')?.scrollIntoView({behavior:'smooth'}));
const obsv=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible');}),{threshold:0.12});
document.querySelectorAll('.fade-in-section').forEach(el=>obsv.observe(el));

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