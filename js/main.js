import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CSS2DRenderer } from 'three/addons/renderers/CSS2DRenderer.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

import { CHAPTERS, STREAMS, INTERVIEW, SECTIONS } from './data/content.js';
import { Registry, V, easeInOut, smooth, clamp } from './utils/factory.js';
import { buildWorld } from './scenes/world.js';
import { buildSilos } from './scenes/silos.js';
import { buildJourney } from './scenes/journey.js';
import { buildGtn } from './scenes/gtn.js';
import { buildAzure } from './scenes/azure.js';
import { buildMigration } from './scenes/migration.js';
import * as sellIn from './scenes/streams/sellIn.js';
import * as distributor from './scenes/streams/distributor.js';
import * as epos from './scenes/streams/epos.js';
import * as ecom from './scenes/streams/ecom.js';
import * as sellOut from './scenes/streams/sellOut.js';
import * as srm from './scenes/streams/srm.js';

const $ = (id) => document.getElementById(id);
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

// ───────────── Renderer, scene, camera
const app = $('app');
const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
renderer.setSize(innerWidth, innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
app.appendChild(renderer.domElement);

const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(innerWidth, innerHeight);
labelRenderer.domElement.className = 'labels';
app.appendChild(labelRenderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x050812);
scene.fog = new THREE.FogExp2(0x050812, 0.0021);
const camera = new THREE.PerspectiveCamera(50, innerWidth / innerHeight, 0.1, 3000);
camera.position.set(170, 260, 200);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.minDistance = 4;
controls.maxDistance = 650;
controls.maxPolarAngle = Math.PI * 0.495;
controls.target.set(170, 0, -100);
controls.autoRotateSpeed = 0.35;

scene.add(new THREE.HemisphereLight(0x9fb8ff, 0x1a1020, 0.9));
const sun = new THREE.DirectionalLight(0xffffff, 1.4); sun.position.set(80, 140, 90); scene.add(sun);

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const bloom = new UnrealBloomPass(new THREE.Vector2(innerWidth / 2, innerHeight / 2), 0.75, 0.5, 0.6);
composer.addPass(bloom);
composer.addPass(new OutputPass());

// Ground grid + stars
const grid = new THREE.GridHelper(900, 90, 0x1d2a4d, 0x111a33);
grid.position.set(170, -0.6, -100);
scene.add(grid);
{
  const n = 1800, pos = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const u = Math.random() * Math.PI * 2, v = Math.acos(2 * Math.random() - 1), r = 700 + Math.random() * 300;
    pos.set([170 + r * Math.sin(v) * Math.cos(u), Math.abs(r * Math.cos(v)) * 0.8 + 40, -100 + r * Math.sin(v) * Math.sin(u)], i * 3);
  }
  const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  scene.add(new THREE.Points(geo, new THREE.PointsMaterial({ color: 0xaecbff, size: 1.6, sizeAttenuation: false, transparent: true, opacity: 0.7, fog: false })));
}

// ───────────── Zones
const registry = new Registry();
const ZONES = {
  world: { pos: [0, 0, 0], title: '🌍 Mars', th: 22, build: buildWorld },
  silos: { pos: [75, 0, 0], title: '🧩 Data silos', th: 15, build: buildSilos },
  journey: { pos: [160, 0, 0], title: '🍫 Candy-bar journey', th: 24, build: buildJourney },
  sellIn: { pos: [0, 0, -95], build: sellIn.build },
  distributor: { pos: [55, 0, -95], build: distributor.build },
  epos: { pos: [110, 0, -95], build: epos.build },
  ecom: { pos: [165, 0, -95], build: ecom.build },
  sellOut: { pos: [220, 0, -95], build: sellOut.build },
  srm: { pos: [275, 0, -95], build: srm.build },
  gtn: { pos: [340, 0, -95], build: buildGtn },
  azure: { pos: [60, 0, -200], title: '☁️ Azure platform', th: 32, build: buildAzure },
  migration: { pos: [235, 0, -200], title: '🔁 AOH ➜ DNA', th: 14, build: buildMigration },
};
const zones = {};
for (const [id, def] of Object.entries(ZONES)) {
  const ctx = registry.ctx(id);
  const z = def.build(ctx, STREAMS[id]);
  z.group.position.set(...def.pos);
  scene.add(z.group);
  z.k = 0; z.kTarget = 0;
  const title = def.title || `<span class="dot"></span>${STREAMS[id].name}`;
  ctx.label(z.group, title, [0, def.th || 13.5, 0], { cls: 'ztitle' + (STREAMS[id] ? ' stream' : ''), tier: 'title', gotoZone: id, color: STREAMS[id]?.hex });
  zones[id] = z;
}

// ───────────── Chapter state
let cur = -1;
let fly = null;
let auto = false, autoT = 0, autoFixed = false;
const N = CHAPTERS.length;
const chIndex = (id) => CHAPTERS.findIndex((c) => c.id === id);

function camFor(ch) {
  if (ch.overview) return { pos: V(...ch.cam), target: V(...ch.target) };
  const o = V(...ZONES[ch.zone].pos);
  const target = V(...ch.target).add(o);
  const a = innerWidth / innerHeight;
  const off = V(...(a < 1 && ch.camM ? ch.camM : ch.cam)).sub(V(...ch.target));
  if (a < 1 && !ch.camM) off.multiplyScalar(Math.min(2.6, 1.2 / a));
  else if (innerWidth > 900 && !$('interview').hidden) off.multiplyScalar(1.3);
  return { pos: target.clone().add(off), target };
}

function flyTo({ pos, target }, dur) {
  fly = { p0: camera.position.clone(), t0: controls.target.clone(), p1: pos, t1: target, t: 0,
    dur: reduceMotion ? 0.5 : dur ?? clamp(camera.position.distanceTo(pos) / 90, 1.3, 2.6) };
  fly.lift = Math.min(60, fly.p0.distanceTo(pos) * 0.18);
}
controls.addEventListener('start', () => { fly = null; });

function go(i) {
  i = clamp(i, 0, N - 1);
  const ch = CHAPTERS[i];
  cur = i;
  if (ch.zone) {
    const z = zones[ch.zone];
    z.kTarget = 0; z.k = 0;
    z.setFocus && z.setFocus(ch.focus);
  } else {
    zones.azure.setFocus(null);
  }
  flyTo(camFor(ch));
  autoT = 0; autoFixed = false;
  hideInfo();
  renderUI();
  refreshLabels();
  try { history.replaceState(null, '', '#' + ch.id); } catch { /* ignore */ }
}

function refreshLabels() {
  const ch = CHAPTERS[cur];
  for (const L of registry.labels) {
    let vis;
    if (!ch || ch.overview) vis = L.tier === 'title';
    else if (L.tier === 'title') vis = false;
    else {
      const z = zones[L.zone];
      const solved = z.kTarget > 0.5;
      vis = L.zone === ch.zone
        && (L.state === 'both' || (L.state === 'solved') === solved)
        && (!L.focus || L.focus === ch.focus);
    }
    L.obj.visible = vis;
    if (!vis) L.el.style.display = 'none';
  }
}

function toggleFix(force) {
  const ch = CHAPTERS[cur];
  if (!ch.fix) return;
  const z = zones[ch.zone];
  z.kTarget = force !== undefined ? (force ? 1 : 0) : (z.kTarget > 0.5 ? 0 : 1);
  renderFix();
  refreshLabels();
}

// ───────────── UI
const dots = $('dots');
CHAPTERS.forEach((ch, i) => {
  const b = document.createElement('button');
  b.className = 'dot-btn';
  b.title = ch.title;
  b.setAttribute('aria-label', `Chapter ${i + 1}: ${ch.title}`);
  b.addEventListener('click', () => go(i));
  dots.appendChild(b);
});

function buildMenu() {
  const m = $('menuList');
  let html = '';
  for (const [key, name] of Object.entries(SECTIONS)) {
    html += `<li class="sec">${name}</li>`;
    CHAPTERS.forEach((c, i) => { if (c.section === key) html += `<li><button data-i="${i}"><span>${String(i + 1).padStart(2, '0')}</span>${c.title}</button></li>`; });
  }
  m.innerHTML = html;
  m.querySelectorAll('button').forEach((b) => b.addEventListener('click', () => { go(+b.dataset.i); toggleMenu(false); }));
}
buildMenu();

function renderUI() {
  const ch = CHAPTERS[cur];
  $('chNum').textContent = `${String(cur + 1).padStart(2, '0')} / ${N}`;
  $('chSection').textContent = SECTIONS[ch.section];
  $('chTitle').textContent = ch.title;
  $('chCaption').textContent = ch.caption;
  $('chNote').textContent = ch.note || '';
  $('chNote').hidden = !ch.note;
  const card = $('card');
  const S = ch.stream ? STREAMS[ch.stream] : null;
  card.style.setProperty('--accent', S ? S.hex : '#4cc2ff');
  $('prevBtn').disabled = cur === 0;
  $('nextBtn').textContent = cur === N - 1 ? 'Restart ↺' : 'Next →';
  [...dots.children].forEach((d, i) => d.classList.toggle('on', i === cur));
  document.querySelectorAll('#menuList button').forEach((b) => b.classList.toggle('on', +b.dataset.i === cur));
  renderFix();
  renderInterview();
}

function renderFix() {
  const ch = CHAPTERS[cur];
  const fb = $('fixBtn');
  fb.hidden = !ch.fix;
  const sc = $('streamCard');
  if (!ch.fix) { sc.hidden = true; return; }
  const solved = zones[ch.zone].kTarget > 0.5;
  fb.textContent = solved ? '↺ Show the problem' : `⚡ ${ch.fixLabel || 'Fix with Azure'}`;
  fb.classList.toggle('solved', solved);
  const S = ch.stream ? STREAMS[ch.stream] : null;
  sc.hidden = !S;
  if (S) {
    $('scProblem').textContent = S.problem;
    $('scFix').textContent = S.fix;
    $('scKpi').textContent = S.kpi;
    sc.classList.toggle('solved', solved);
  }
}

function renderInterview() {
  const ch = CHAPTERS[cur];
  const iv = INTERVIEW[ch.id];
  const body = $('ivBody');
  if (!iv) { body.innerHTML = '<p class="muted">No notes for this chapter.</p>'; return; }
  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  body.innerHTML = `
    <h4>Say it in 30 seconds</h4>
    <ul>${iv.say.map((s) => `<li>${esc(s)}</li>`).join('')}</ul>
    <h4>Likely question</h4>
    <p class="q">“${esc(iv.q)}”</p>
    <details open><summary>Model answer</summary><p>${esc(iv.a)}</p></details>
    ${iv.star ? `<details><summary>STAR story</summary><p>${esc(iv.star)}</p></details>` : ''}`;
}

function updateViewOffset() {
  // Keep the 3D focus centred in the space not covered by the story card / interview panel.
  const wide = innerWidth > 900;
  const left = wide ? 220 : 0;
  const right = wide && !$('interview').hidden ? 190 : 0;
  const shift = left - right;
  // On narrow screens the story card sits at the bottom: lift the scene above it.
  const lift = wide ? 0 : Math.round(Math.min(160, innerHeight * 0.17));
  if (shift || lift) camera.setViewOffset(innerWidth, innerHeight, -shift, lift, innerWidth, innerHeight);
  else camera.clearViewOffset();
  camera.updateProjectionMatrix();
}

function setInterview(on) {
  document.body.classList.toggle('iv-on', on);
  $('interview').hidden = !on;
  $('ivBtn').classList.toggle('on', on);
  $('ivBtn').setAttribute('aria-pressed', on);
  updateViewOffset();
  if (cur >= 0 && innerWidth > 900) flyTo(camFor(CHAPTERS[cur]), 0.9);
}
function toggleMenu(on) {
  const m = $('menu');
  on = on ?? m.hidden;
  m.hidden = !on;
  $('menuBtn').setAttribute('aria-expanded', on);
}
function setAuto(on) {
  auto = on; autoT = 0; autoFixed = false;
  $('autoBtn').classList.toggle('on', on);
  $('autoBtn').innerHTML = on ? '⏸ <span class="hide-sm">Pause</span>' : '▶ <span class="hide-sm">Auto</span>';
}

function showInfo(title, text) {
  $('infoTitle').textContent = title;
  $('infoText').textContent = text;
  $('info').hidden = false;
}
function hideInfo() { $('info').hidden = true; }

function handleInfo(o, zone) {
  if (o.goto) { go(chIndex(o.goto)); return; }
  if (o.gotoZone || (CHAPTERS[cur].overview && zone)) {
    const z = o.gotoZone || zone;
    const i = CHAPTERS.findIndex((c) => c.zone === z);
    if (i >= 0) go(i);
    return;
  }
  const info = o.info || o;
  if (info.title) showInfo(info.title, info.text);
  info.onPick && info.onPick();
}
registry.onLabel = (o, zone) => handleInfo(o, zone);

$('prevBtn').addEventListener('click', () => go(cur - 1));
$('nextBtn').addEventListener('click', () => go(cur === N - 1 ? 0 : cur + 1));
$('fixBtn').addEventListener('click', () => toggleFix());
$('ivBtn').addEventListener('click', () => setInterview($('interview').hidden));
$('ivClose').addEventListener('click', () => setInterview(false));
$('menuBtn').addEventListener('click', () => toggleMenu());
$('menuClose').addEventListener('click', () => toggleMenu(false));
$('autoBtn').addEventListener('click', () => setAuto(!auto));
$('fsBtn').addEventListener('click', toggleFullscreen);
$('infoClose').addEventListener('click', hideInfo);

function toggleFullscreen() {
  if (!document.fullscreenElement) document.documentElement.requestFullscreen?.().catch(() => {});
  else document.exitFullscreen?.();
}

function startTour(withInterview) {
  $('intro').classList.add('gone');
  setTimeout(() => { $('intro').hidden = true; }, 600);
  if (withInterview) setInterview(true);
  const hash = location.hash.slice(1);
  const i = chIndex(hash);
  go(i >= 0 ? i : 0);
}
$('startBtn').addEventListener('click', () => startTour(false));
$('startIvBtn').addEventListener('click', () => startTour(true));

addEventListener('keydown', (e) => {
  if (e.target.closest && e.target.closest('input,textarea')) return;
  if (!$('intro').hidden && !$('intro').classList.contains('gone')) {
    if (e.key === 'Enter' || e.key === 'ArrowRight') startTour(false);
    return;
  }
  const k = e.key.toLowerCase();
  if (k === 'arrowright' || k === 'pagedown') go(cur + 1);
  else if (k === 'arrowleft' || k === 'pageup') go(cur - 1);
  else if (k === ' ') { e.preventDefault(); toggleFix(); }
  else if (k === 'p') setInterview($('interview').hidden);
  else if (k === 'f') toggleFullscreen();
  else if (k === 'm') toggleMenu();
  else if (k === 'a') setAuto(!auto);
  else if (k === 'escape') { hideInfo(); toggleMenu(false); }
  else if (k === '0') go(N - 1);
  else if (/^[1-9]$/.test(k)) go(+k - 1);
});

// ───────────── Picking
const ray = new THREE.Raycaster();
const ndc = new THREE.Vector2();
let down = null;
function visibleChain(o) { while (o) { if (!o.visible) return false; o = o.parent; } return true; }
function hit(e) {
  ndc.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1);
  ray.setFromCamera(ndc, camera);
  return ray.intersectObjects(registry.pickables, false).find((h) => visibleChain(h.object) && h.object.scale.x > 0.05);
}
renderer.domElement.addEventListener('pointerdown', (e) => { down = [e.clientX, e.clientY]; });
renderer.domElement.addEventListener('pointerup', (e) => {
  if (!down) return;
  const moved = Math.hypot(e.clientX - down[0], e.clientY - down[1]);
  down = null;
  if (moved > 6) return;
  const h = hit(e);
  if (h) handleInfo(h.object.userData.info, h.object.userData.zone); else hideInfo();
});
let hoverT = 0;
renderer.domElement.addEventListener('pointermove', (e) => {
  if (e.pointerType !== 'mouse' || performance.now() - hoverT < 60) return;
  hoverT = performance.now();
  renderer.domElement.style.cursor = hit(e) ? 'pointer' : '';
});

addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  updateViewOffset();
  renderer.setSize(innerWidth, innerHeight);
  composer.setSize(innerWidth, innerHeight);
  bloom.resolution.set(innerWidth / 2, innerHeight / 2);
  labelRenderer.setSize(innerWidth, innerHeight);
});

// ───────────── Loop
const clock = new THREE.Clock();
let t = 0;
function loop() {
  const dt = Math.min(clock.getDelta(), 0.05);
  t += dt;
  for (const z of Object.values(zones)) {
    const step = dt / 1.4;
    z.k = z.k < z.kTarget ? Math.min(z.kTarget, z.k + step) : Math.max(z.kTarget, z.k - step);
    z.update(t, dt, smooth(z.k));
  }
  if (fly) {
    fly.t += dt;
    const k = easeInOut(Math.min(1, fly.t / fly.dur));
    camera.position.lerpVectors(fly.p0, fly.p1, k);
    camera.position.y += Math.sin(Math.PI * k) * fly.lift;
    controls.target.lerpVectors(fly.t0, fly.t1, k);
    if (fly.t >= fly.dur) fly = null;
  }
  controls.autoRotate = !fly && cur >= 0 && !!CHAPTERS[cur].overview && !reduceMotion;
  if (auto && cur >= 0) {
    autoT += dt;
    const ch = CHAPTERS[cur];
    if (ch.fix && !autoFixed && autoT > 4.5) { toggleFix(true); autoFixed = true; }
    if (autoT > (ch.fix ? 11 : 8)) { if (cur < N - 1) go(cur + 1); else setAuto(false); }
  }
  scene.fog.density = 0.85 / (camera.position.distanceTo(controls.target) + 35);
  controls.update();
  composer.render();
  labelRenderer.render(scene, camera);
  requestAnimationFrame(loop);
}
refreshLabels();
updateViewOffset();
loop();
window.__chapters = CHAPTERS.map((c) => c.id);
window.__marsReady = true;
document.body.classList.add('ready');
