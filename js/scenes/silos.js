// Chapter 3: disconnected data silos → connected to one Azure hub.
import * as THREE from 'three';
import { add, mat, basic, platform, Flow, V, rng, lerp } from '../utils/factory.js';

const SRC = [
  ['SAP ERP', 0xff8a3d, 'Orders, shipments, invoices and finance, spread across several SAP instances.'],
  ['Distributors', 0xa970ff, 'Hundreds of partners, each sending its own files.'],
  ['Retailer EPOS', 0x3ddc84, 'Till scans from retailers, each in its own format.'],
  ['E-Commerce', 0x3fa9ff, 'Marketplaces, retailer.com and direct-to-consumer sites.'],
  ['Factory IoT', 0x2ec4b6, 'Sensors on production lines: speed, quality, energy.'],
  ['Pet Health', 0x34d1bf, 'Vet clinic and diagnostics data. Sensitive.'],
  ['Marketing', 0xff6bd6, 'Media spend, campaigns, consumer data.'],
];

export function buildSilos(ctx) {
  const g = new THREE.Group();
  platform(g, 16, 0xff5d73);
  const r = rng(7);

  const silos = SRC.map(([name, color, text], i) => {
    const s = new THREE.Group(); g.add(s);
    const h = 3 + r() * 3;
    add(s, new THREE.CylinderGeometry(1.3, 1.3, h, 24), mat(0x2a3352, { glow: 0.08 }), 0, h / 2, 0);
    const cap = add(s, new THREE.CylinderGeometry(1.36, 1.36, 0.35, 24), mat(color, { glow: 0.5 }), 0, h, 0);
    ctx.pick(s, { title: name, text });
    ctx.label(s, name, [0, h + 1.2, 0], { cls: 'tag', info: { title: name, text } });
    const a = r() * Math.PI * 2, d = 5 + r() * 8;
    const a1 = (i / SRC.length) * Math.PI * 2;
    return { s, cap, color, p0: V(Math.cos(a) * d, 0, Math.sin(a) * d), p1: V(Math.cos(a1) * 10.5, 0, Math.sin(a1) * 10.5), ph: r() * 6 };
  });

  const hub = new THREE.Group(); g.add(hub);
  add(hub, new THREE.CylinderGeometry(2.2, 2.2, 1.2, 6), mat(0x0078d4, { glow: 1.1 }), 0, 1.2, 0);
  const halo = add(hub, new THREE.TorusGeometry(3, 0.08, 8, 64), basic(0x4cc2ff, 0.9), 0, 1.2, 0);
  halo.rotation.x = Math.PI / 2;
  ctx.pick(hub, { title: 'Azure data platform', text: 'Ingest once, store once in a governed lakehouse, reuse everywhere.' });
  ctx.label(g, 'Azure data platform', [0, 4, 0], { cls: 'chip azure big', state: 'solved' });

  const flows = silos.map((o) => new Flow(g, new THREE.LineCurve3(o.p1.clone().setY(0.8), V(0, 1.2, 0)), o.color, { count: 10, speed: 0.4 }));

  const P = [['No single truth', 'One trusted view', [-10, 10, -4]], ['Reports take weeks', 'Refreshed daily', [10, 10, -4]],
    ['Promo ROI = ?', 'Promo ROI measured', [-10, 8, 7]], ['Stock-outs & waste', 'Demand-led supply', [10, 8, 7]]];
  P.forEach(([a, b, p]) => {
    ctx.label(g, '⚠ ' + a, p, { cls: 'pain', state: 'problem' });
    ctx.label(g, '✓ ' + b, p, { cls: 'good', state: 'solved' });
  });
  ctx.label(g, '?', [0, 5, 0], { cls: 'qmark', state: 'problem' });

  return {
    group: g,
    update(t, dt, k) {
      const w = 1 - k;
      silos.forEach((o) => {
        o.s.position.set(
          lerp(o.p0.x + Math.sin(t * 0.5 + o.ph) * 1.5 * w, o.p1.x, k),
          Math.sin(t * 1.3 + o.ph) * 0.3 * w,
          lerp(o.p0.z + Math.cos(t * 0.4 + o.ph) * 1.5 * w, o.p1.z, k));
        o.s.rotation.z = Math.sin(t + o.ph) * 0.1 * w;
        o.cap.material.emissiveIntensity = 0.35 + 0.45 * k;
      });
      hub.scale.setScalar(Math.max(0.001, k));
      hub.rotation.y = t * 0.5;
      flows.forEach((f) => f.update(t, k > 0.6 ? (k - 0.6) / 0.4 : 0));
    },
  };
}
