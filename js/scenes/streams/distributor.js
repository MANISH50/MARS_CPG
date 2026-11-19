// Distributor: trucks dump mismatched files → conveyor through a data-quality gate; late files flagged.
import * as THREE from 'three';
import { add, mat, basic, box, V, rng, lerp } from '../../utils/factory.js';
import { streamBase } from './common.js';

export function build(ctx, S) {
  const g = streamBase(ctx, S);
  const r = rng(21);
  const purple = new THREE.Color(S.color);

  const wh = new THREE.Group(); wh.position.set(8.5, 0, 0); g.add(wh);
  add(wh, box(3.6, 3, 4.4), mat(0x2b2350, { glow: 0.1 }), 0, 1.5, 0);
  add(wh, box(4, 0.35, 4.8), mat(S.color, { glow: 0.5 }), 0, 3.15, 0);
  ctx.label(wh, 'Mars landing zone', [0, 4.4, 0], { cls: 'tag' });
  ctx.pick(wh, { title: 'Landing zone', text: 'Raw distributor files land here first (ADLS Bronze), untouched.' });

  add(g, box(17, 0.15, 1.6), mat(0x1b1f38, { glow: 0.1 }), -0.5, 0.08, 0);
  const gate = new THREE.Group(); gate.position.set(2, 0, 0); g.add(gate);
  const ring = add(gate, new THREE.TorusGeometry(1.6, 0.14, 10, 40), basic(0x4cc2ff), 0, 1.5, 0);
  ring.rotation.y = Math.PI / 2 - 0.75;
  ctx.label(gate, 'Data-quality gate', [0, 3.6, 0], { cls: 'chip azure', state: 'solved' });
  ctx.pick(gate, { title: 'Data-quality gate', text: 'Schema mapping + DLT expectations: wrong formats are fixed or quarantined.' });

  const trucks = [];
  for (let i = 0; i < 6; i++) {
    const tr = new THREE.Group(); tr.position.set(-9 + i * 3, 0, -6); g.add(tr);
    const missing = i === 2 || i === 4;
    const m = mat(missing ? 0xff3b5c : S.color, { glow: 0.5, opacity: missing ? 0.25 : 1 });
    add(tr, box(1.8, 1.3, 1.1), m, 0, 0.9, 0);
    add(tr, box(0.8, 0.9, 1.05), m, 1.3, 0.7, 0);
    if (missing) ctx.label(tr, '⏰ late → alert sent', [0, 2.4, 0], { cls: 'pain mini', state: 'solved' });
    trucks.push({ tr, m, missing });
  }
  ctx.label(g, 'Distributors (100s)', [-3, 3.3, -6], { cls: 'tag' });
  ctx.label(g, '2 files missing… nobody knows', [3, 2.6, -6], { cls: 'pain mini', state: 'problem' });

  const PAL = [0xff5d5d, 0x8fd3ff, 0x9be564, 0xffd166, 0xff8a3d, 0xffffff];
  const N = 12, crates = [];
  for (let i = 0; i < N; i++) {
    const orig = new THREE.Color(PAL[i % PAL.length]);
    const m = mat(orig.getHex(), { glow: 0.35 });
    const c = add(g, box(0.8, 0.8, 0.8), m);
    crates.push({ c, m, orig, p0: V(-4 + (r() - 0.5) * 5, 0.4 + r() * 1.2, 4 + (r() - 0.5) * 3), r0: [r() * 3, r() * 3, r() * 3] });
  }
  ['CSV', 'XLSX', 'PDF', 'e-mail'].forEach((f, i) => ctx.label(crates[i].c, f, [0, 0.9, 0], { cls: 'mini', state: 'problem' }));
  const tmp = new THREE.Color();

  return {
    group: g,
    update(t, dt, k) {
      const w = 1 - k;
      crates.forEach((o, i) => {
        const x = -9 + (((i / N) + t * 0.06) % 1) * 17;
        o.c.position.set(lerp(o.p0.x, x, k), lerp(o.p0.y, 0.56, k), lerp(o.p0.z, 0, k));
        o.c.rotation.set(o.r0[0] * w, o.r0[1] * w + Math.sin(t + i) * 0.2 * w, o.r0[2] * w);
        const passed = x > 2 ? k : 0;
        tmp.copy(o.orig).lerp(purple, passed);
        o.m.color.copy(tmp); o.m.emissive.copy(tmp);
        o.c.scale.setScalar(x > 8 ? Math.max(0.001, 1 - (x - 8) * k) : 1);
      });
      trucks.forEach((o, i) => {
        if (o.missing) o.m.emissiveIntensity = 0.3 + (k > 0.5 ? 0.6 * (0.5 + 0.5 * Math.sin(t * 6)) : 0);
        else o.tr.position.x = -9 + i * 3 + Math.sin(t * 0.8 + i) * 0.3;
      });
      gate.scale.setScalar(Math.max(0.001, k));
      ring.material.color.setHSL(0.55, 1, 0.45 + 0.08 * Math.sin(t * 4));
    },
  };
}
