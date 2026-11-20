// Reusable 3D building blocks: materials, primitives, particle flows, labels.
import * as THREE from 'three';
import { CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

export const lerp = (a, b, k) => a + (b - a) * k;
export const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const smooth = (k) => k * k * (3 - 2 * k);
export const easeInOut = (k) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2);
export const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
export const box = (w, h, d) => new THREE.BoxGeometry(w, h, d);

// Deterministic random so layouts look the same on every visit.
export function rng(seed = 1) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function mat(color, { glow = 0.35, opacity = 1, rough = 0.55, metal = 0.15 } = {}) {
  const m = new THREE.MeshStandardMaterial({
    color, emissive: color, emissiveIntensity: glow, roughness: rough, metalness: metal,
  });
  if (opacity < 1) { m.transparent = true; m.opacity = opacity; m.depthWrite = false; }
  return m;
}

export function basic(color, opacity = 1, additive = false) {
  const m = new THREE.MeshBasicMaterial({ color });
  if (opacity < 1 || additive) { m.transparent = true; m.opacity = opacity; m.depthWrite = false; }
  if (additive) m.blending = THREE.AdditiveBlending;
  return m;
}

export function add(parent, geo, material, x = 0, y = 0, z = 0) {
  const m = new THREE.Mesh(geo, material);
  m.position.set(x, y, z);
  parent.add(m);
  return m;
}

export function platform(parent, r, color) {
  const g = new THREE.Group();
  add(g, new THREE.CylinderGeometry(r, r * 1.03, 0.6, 72), mat(0x0c1326, { glow: 0, rough: 0.95 }), 0, -0.3, 0);
  const ring = add(g, new THREE.TorusGeometry(r, 0.07, 8, 120), basic(new THREE.Color(color).multiplyScalar(0.7), 0.95));
  ring.rotation.x = Math.PI / 2;
  ring.position.y = 0.02;
  const inner = add(g, new THREE.RingGeometry(r * 0.6, r * 0.605, 96), basic(color, 0.25, true));
  inner.rotation.x = -Math.PI / 2;
  inner.position.y = 0.03;
  parent.add(g);
  return g;
}

export function arc(a, b, h = 4) {
  const mid = a.clone().add(b).multiplyScalar(0.5);
  mid.y += h;
  return new THREE.QuadraticBezierCurve3(a.clone(), mid, b.clone());
}

export function tube(parent, curve, color, { r = 0.06, opacity = 0.3, seg = 48 } = {}) {
  const m = new THREE.Mesh(new THREE.TubeGeometry(curve, seg, r, 6, false), basic(color, opacity, true));
  parent.add(m);
  return m;
}

let dotTex;
function dotTexture() {
  if (dotTex) return dotTex;
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d');
  const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  gr.addColorStop(0, 'rgba(255,255,255,1)');
  gr.addColorStop(0.35, 'rgba(255,255,255,0.85)');
  gr.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = gr;
  g.fillRect(0, 0, 64, 64);
  dotTex = new THREE.CanvasTexture(c);
  return dotTex;
}

// Glowing particles travelling along a curve: "data in motion".
export class Flow {
  constructor(parent, curve, color, { count = 20, speed = 0.25, size = 0.5, colorFn = null } = {}) {
    this.curve = curve; this.count = count; this.speed = speed; this.colorFn = colorFn;
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(count * 3), 3));
    if (colorFn) geo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(count * 3), 3));
    this.mat = new THREE.PointsMaterial({
      color: colorFn ? 0xffffff : color, size, map: dotTexture(), transparent: true, depthWrite: false,
      blending: THREE.AdditiveBlending, vertexColors: !!colorFn, sizeAttenuation: true,
    });
    this.points = new THREE.Points(geo, this.mat);
    this.points.frustumCulled = false;
    parent.add(this.points);
    this.tmp = new THREE.Vector3();
    this.col = new THREE.Color();
    this.factor = 1;
  }
  update(t, opacity = 1) {
    const o = opacity * this.factor;
    this.mat.opacity = o;
    this.points.visible = o > 0.01;
    if (!this.points.visible) return;
    const p = this.points.geometry.attributes.position;
    const c = this.points.geometry.attributes.color;
    for (let i = 0; i < this.count; i++) {
      const u = (i / this.count + t * this.speed) % 1;
      this.curve.getPointAt(u, this.tmp);
      p.setXYZ(i, this.tmp.x, this.tmp.y, this.tmp.z);
      if (c) { this.colorFn(u, this.col, i); c.setXYZ(i, this.col.r, this.col.g, this.col.b); }
    }
    p.needsUpdate = true;
    if (c) c.needsUpdate = true;
  }
}

// Central registry of labels + clickable meshes, so main.js can show/hide per chapter.
export class Registry {
  constructor() { this.labels = []; this.pickables = []; this.onLabel = null; }
  ctx(zone) {
    const reg = this;
    return {
      zone,
      /**
       * opts: cls, state ('both'|'problem'|'solved'), tier ('detail'|'title'),
       * focus (only show for chapters with that focus), info {title,text}, goto (chapter id)
       */
      label(parent, html, pos = [0, 0, 0], o = {}) {
        const el = document.createElement('div');
        el.className = 'lbl ' + (o.cls || '');
        el.innerHTML = html;
        if (o.color) el.style.setProperty('--c', o.color);
        const obj = new CSS2DObject(el);
        obj.position.set(pos[0], pos[1], pos[2]);
        parent.add(obj);
        if (o.info || o.goto || o.gotoZone) {
          el.classList.add('clickable');
          el.addEventListener('pointerdown', (e) => e.stopPropagation());
          el.addEventListener('click', (e) => { e.stopPropagation(); reg.onLabel && reg.onLabel(o, zone); });
        }
        reg.labels.push({ obj, el, zone, state: o.state || 'both', tier: o.tier || 'detail', focus: o.focus || null });
        return obj;
      },
      pick(obj, info) {
        obj.traverse((m) => {
          if (m.isMesh) { m.userData.info = info; m.userData.zone = zone; reg.pickables.push(m); }
        });
      },
    };
  }
}
