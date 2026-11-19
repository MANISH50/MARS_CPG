// Sell-In: several SAP systems emit mismatched blocks → one conformed stack of shipments.
import * as THREE from 'three';
import { add, mat, box, Flow, arc, V, rng, lerp } from '../../utils/factory.js';
import { streamBase } from './common.js';

export function build(ctx, S) {
  const g = streamBase(ctx, S);
  const towers = ['SAP · EU', 'SAP · NA', 'SAP · APAC'].map((n, i) => {
    const tw = new THREE.Group(); tw.position.set(-8, 0, (i - 1) * 4.2); g.add(tw);
    add(tw, box(1.8, 5, 1.8), mat(0x22304f, { glow: 0.1 }), 0, 2.5, 0);
    add(tw, box(1.9, 0.3, 1.9), mat(S.color, { glow: 0.9 }), 0, 4.3, 0);
    add(tw, box(1.9, 0.3, 1.9), mat(S.color, { glow: 0.5 }), 0, 3.4, 0);
    ctx.label(tw, n, [0, 5.9, 0], { cls: 'tag' });
    ctx.pick(tw, { title: n, text: 'One of several SAP ERP instances: orders, deliveries, invoices.' });
    return tw;
  });

  const r = rng(3);
  const GEOS = [box(1, 0.5, 1.3), new THREE.CylinderGeometry(0.45, 0.45, 0.9, 12), new THREE.ConeGeometry(0.55, 1, 8),
    new THREE.OctahedronGeometry(0.6), new THREE.TorusGeometry(0.4, 0.15, 8, 16)];
  const PAL = [0xff5d5d, 0x8fd3ff, 0xc77dff, 0x9be564, 0xffd166, 0xff8a3d];
  const cube = box(0.92, 0.92, 0.92), cubeMat = mat(S.color, { glow: 0.55 });
  const blocks = [];
  for (let i = 0; i < 27; i++) {
    const b = new THREE.Group(); g.add(b);
    const messy = add(b, GEOS[i % GEOS.length], mat(PAL[Math.floor(r() * PAL.length)], { glow: 0.3 }));
    const clean = add(b, cube, cubeMat);
    const col = i % 3, row = Math.floor(i / 3) % 3, lay = Math.floor(i / 9);
    blocks.push({ b, messy, clean, ph: r() * 6,
      p0: V(1 + (r() - 0.5) * 7, 0.5 + r() * 2.2, (r() - 0.5) * 7), r0: [r() * 6, r() * 6, r() * 6],
      p1: V(4 + (col - 1), 0.46 + lay, row - 1) });
  }

  const pileC = V(1, 1, 0), target = V(4, 2.6, 0);
  const bad = towers.map((tw) => new Flow(g, arc(tw.position.clone().setY(4.3), pileC, 3), 0xff5d5d, { count: 10, speed: 0.3 }));
  const good = towers.map((tw) => new Flow(g, arc(tw.position.clone().setY(4.3), target, 4), S.color, { count: 14, speed: 0.35 }));

  ctx.label(g, 'Different units · codes · currencies', [1, 4.6, 4], { cls: 'pain', state: 'problem' });
  ctx.label(g, '✓ conformed & reconciled', [4, 4.4, 0], { cls: 'good mini', state: 'solved' });

  return {
    group: g,
    update(t, dt, k) {
      const w = 1 - k;
      blocks.forEach((o) => {
        o.b.position.set(lerp(o.p0.x, o.p1.x, k), lerp(o.p0.y + Math.sin(t * 1.5 + o.ph) * 0.25, o.p1.y, k), lerp(o.p0.z, o.p1.z, k));
        o.b.rotation.set((o.r0[0] + Math.sin(t + o.ph) * 0.3) * w, o.r0[1] * w, o.r0[2] * w);
        o.messy.scale.setScalar(Math.max(0.001, 1 - k));
        o.clean.scale.setScalar(Math.max(0.001, k));
      });
      bad.forEach((f) => f.update(t, w));
      good.forEach((f) => f.update(t, k));
    },
  };
}
