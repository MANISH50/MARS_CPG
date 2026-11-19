// Chapter 1–2: the Mars "planet" with its three business islands.
import * as THREE from 'three';
import { add, mat, basic, box, V, rng } from '../utils/factory.js';

const SITES = [[38.9, -77.2], [41.9, -87.6], [51.5, -0.6], [51.6, 5.5], [39.9, 116.4], [-37.6, 143.9],
  [-23.5, -46.6], [19.1, 72.9], [1.35, 103.8], [19.4, -99.1], [48.1, 11.6], [-33.9, 18.4]];

function ll(lat, lon, r) {
  const phi = (90 - lat) * Math.PI / 180, th = (lon + 180) * Math.PI / 180;
  return V(-r * Math.sin(phi) * Math.cos(th), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(th));
}

const SEGMENTS = [
  { name: 'Petcare', color: 0x34d1bf, size: 3.6,
    brands: 'Royal Canin · Pedigree · Whiskas · Sheba · Banfield · VCA · AniCura · Antech',
    text: 'Pet nutrition, vet hospitals and pet-health science (diagnostics, DNA tests).' },
  { name: 'Snacking', color: 0xff6b6b, size: 3.6,
    brands: "M&M's · Snickers · Twix · Extra · KIND · Pringles · Cheez-It · Pop-Tarts",
    text: 'Chocolate, gum, mints, and since Kellanova (Dec 2025) salty snacks and more.' },
  { name: 'Food & Nutrition', color: 0xffb347, size: 2.9,
    brands: "Ben's Original · Dolmio · Tasty Bite · Seeds of Change",
    text: 'Rice, sauces and meal brands.' },
];

function props(isl, i, r) {
  if (i === 0) { // Petcare: bowl + kibble + bone + vet cross
    add(isl, new THREE.CylinderGeometry(1.1, 0.75, 0.6, 24), mat(0x34d1bf, { glow: 0.5 }), -1, 0.7, 0.6);
    for (let k = 0; k < 7; k++) add(isl, new THREE.SphereGeometry(0.2, 8, 6), mat(0x8a5a3c, { glow: 0.1 }), -1 + (r() - 0.5) * 1.2, 1.05, 0.6 + (r() - 0.5) * 1.2);
    const bone = new THREE.Group(); bone.position.set(1.2, 0.65, 1); bone.rotation.y = 0.6; isl.add(bone);
    add(bone, new THREE.CylinderGeometry(0.18, 0.18, 1.6, 10), mat(0xffffff, { glow: 0.3 })).rotation.z = Math.PI / 2;
    for (const [x, z] of [[-0.8, -0.2], [-0.8, 0.2], [0.8, -0.2], [0.8, 0.2]]) add(bone, new THREE.SphereGeometry(0.27, 10, 8), mat(0xffffff, { glow: 0.3 }), x, 0, z);
    add(isl, box(0.45, 1.5, 0.45), mat(0xff5d73, { glow: 0.8 }), 0.9, 1.3, -1.4);
    add(isl, box(1.5, 0.45, 0.45), mat(0xff5d73, { glow: 0.8 }), 0.9, 1.3, -1.4);
  } else if (i === 1) { // Snacking: candy lentils, chocolate bar, snack can
    const C = [0xff3b3b, 0xffd23f, 0x3ddc84, 0x3fa9ff, 0xff8a3d, 0x8b5a2b];
    for (let k = 0; k < 14; k++) {
      const s = add(isl, new THREE.SphereGeometry(0.32, 14, 10), mat(C[k % C.length], { glow: 0.45 }), 0.9 + (r() - 0.5) * 1.6, 0.6 + r() * 0.7, -0.4 + (r() - 0.5) * 1.6);
      s.scale.y = 0.5; s.rotation.set(r(), r(), r());
    }
    add(isl, box(2.2, 0.4, 1), mat(0x6b3e26, { glow: 0.25 }), -1, 0.65, 0.9).rotation.y = 0.4;
    add(isl, new THREE.CylinderGeometry(0.45, 0.45, 1.8, 18), mat(0xe63946, { glow: 0.5 }), -1.3, 1.3, -1.2);
  } else { // Food: bowl of rice + sauce jar
    add(isl, new THREE.SphereGeometry(1, 24, 12, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), mat(0xf1f1f1, { glow: 0.3 }), -0.4, 1.4, 0.2);
    add(isl, new THREE.SphereGeometry(0.9, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), mat(0xfff6dd, { glow: 0.5 }), -0.4, 1.25, 0.2).scale.y = 0.35;
    add(isl, new THREE.CylinderGeometry(0.5, 0.5, 1.3, 18), mat(0xd62828, { glow: 0.5 }), 1.2, 1.05, -0.6);
    add(isl, new THREE.CylinderGeometry(0.52, 0.52, 0.25, 18), mat(0xffd166, { glow: 0.6 }), 1.2, 1.8, -0.6);
  }
}

export function buildWorld(ctx) {
  const g = new THREE.Group();
  const r = rng(5);

  const globe = new THREE.Group(); globe.position.y = 8; g.add(globe);
  add(globe, new THREE.SphereGeometry(7, 64, 48), new THREE.MeshStandardMaterial({ color: 0x0d2f63, emissive: 0x0a1d40, emissiveIntensity: 0.8, roughness: 0.85 }));
  add(globe, new THREE.IcosahedronGeometry(7.06, 5), new THREE.MeshBasicMaterial({ color: 0x3d9bff, wireframe: true, transparent: true, opacity: 0.12 }));
  for (let lat = -60; lat <= 60; lat += 30) {
    const rr = 7.08 * Math.cos(lat * Math.PI / 180);
    const ring = add(globe, new THREE.TorusGeometry(rr, 0.015, 4, 96), basic(0x5fb3ff, 0.35), 0, 7.08 * Math.sin(lat * Math.PI / 180), 0);
    ring.rotation.x = Math.PI / 2;
  }
  add(g, new THREE.SphereGeometry(8.2, 48, 32), new THREE.MeshBasicMaterial({ color: 0x2a8cff, transparent: true, opacity: 0.08, side: THREE.BackSide, blending: THREE.AdditiveBlending, depthWrite: false }), 0, 8, 0);

  const pins = SITES.map(([la, lo]) => {
    const p = ll(la, lo, 7.05);
    add(globe, new THREE.SphereGeometry(0.17, 12, 8), basic(0xffd166), p.x, p.y, p.z);
    const ring = add(globe, new THREE.RingGeometry(0.22, 0.3, 24), basic(0xffd166, 0.8, true));
    ring.position.copy(p);
    ring.quaternion.setFromUnitVectors(V(0, 0, 1), p.clone().normalize());
    return ring;
  });
  ctx.pick(globe, { title: 'Mars, Incorporated', text: 'Family-owned since 1911 · $65B+ · 170,000+ Associates · Kellanova joined in Dec 2025.' });

  const B = [['📅', 'Since 1911', 'family-owned', [-13, 13, 0]], ['💰', '$65B+', 'global business', [13, 13, 0]],
    ['👥', '170k+', 'Associates', [-13, 4, 0]], ['🥨', 'Kellanova', 'joined Dec 2025', [13, 4, 0]]];
  B.forEach(([i, a, b, p]) => ctx.label(g, `<i>${i}</i><b>${a}</b><span>${b}</span>`, p, { cls: 'badge', focus: 'mars' }));
  ctx.label(g, '☁️ Microsoft Azure = primary cloud (since 2021)', [0, -0.2, 6], { cls: 'chip azure', focus: 'mars' });

  const orbit = new THREE.Group(); orbit.position.y = 6; g.add(orbit);
  const islands = SEGMENTS.map((seg, i) => {
    const holder = new THREE.Group();
    const a = (i / 3) * Math.PI * 2 + 0.5;
    holder.position.set(Math.cos(a) * 19, 0, Math.sin(a) * 19);
    orbit.add(holder);
    const isl = new THREE.Group(); holder.add(isl);
    add(isl, new THREE.CylinderGeometry(seg.size, seg.size * 0.93, 0.8, 40), mat(seg.color, { glow: 0.3 }));
    const rock = add(isl, new THREE.ConeGeometry(seg.size * 0.92, seg.size * 1.4, 7), mat(0x3a2a22, { glow: 0.05, rough: 1 }), 0, -seg.size * 0.7 - 0.4, 0);
    rock.rotation.x = Math.PI;
    props(isl, i, r);
    const info = { title: seg.name, text: `${seg.text} Brands: ${seg.brands}.` };
    ctx.pick(isl, info);
    ctx.label(holder, `<b>${seg.name}</b><small>${seg.brands}</small>`, [0, 4.4, 0], { cls: 'seg', focus: 'segments', info, color: '#' + seg.color.toString(16).padStart(6, '0') });
    return { holder, isl, i };
  });

  return {
    group: g,
    update(t) {
      globe.rotation.y = t * 0.12;
      orbit.rotation.y = t * 0.06;
      islands.forEach((o) => { o.isl.position.y = Math.sin(t * 0.9 + o.i * 2) * 0.4; o.isl.rotation.y = t * 0.2; });
      pins.forEach((p, i) => {
        const u = (t * 0.6 + i * 0.13) % 1;
        p.scale.setScalar(1 + u * 2.2);
        p.material.opacity = 0.9 * (1 - u);
      });
    },
  };
}
