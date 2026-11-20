// Gross-to-Net: a foggy, leaking revenue staircase → every step visible, fed by one GTN data product.
import * as THREE from 'three';
import { add, mat, basic, box, Flow, arc, tube, V, rng, lerp } from '../utils/factory.js';
import { streamBase } from './streams/common.js';

const STEPS = [['Gross sales', 100, 0xf59e0b], ['Off-invoice', -8, 0xff9b54], ['Promotions', -12, 0xff7849], ['Rebates', -5, 0xff6363],
  ['Trade terms', -6, 0xff4f81], ['Deductions', -4, 0xe63973], ['Returns', -2, 0xc23b80], ['Net sales', 63, 0x3ddc84]];
const SCALE = 0.09;

export function buildGtn(ctx, S) {
  const g = streamBase(ctx, S, { r: 14, top: 13.4 });
  const r = rng(61);
  const grey = new THREE.Color(0x56607a);

  let run = 0;
  const steps = STEPS.map(([name, v, color], i) => {
    const total = i === 0 || i === STEPS.length - 1;
    const top = total ? v * SCALE : run * SCALE, bottom = total ? 0 : (run + v) * SCALE;
    if (i === 0) run = v; else if (!total) run += v;
    const h = top - bottom, x = -10.5 + i * 3;
    const m = new THREE.MeshStandardMaterial({ color: grey.clone(), emissive: grey.clone(), emissiveIntensity: 0.3, transparent: true, opacity: 0.45, roughness: 0.5 });
    const mesh = add(g, box(2, h, 2), m, x, (top + bottom) / 2, 0);
    const col = new THREE.Color(color);
    const pct = total ? `${v}` : `${v}%`;
    if (total) {
      ctx.label(g, `${name}<br><b>${i === 0 ? '100' : '?'}</b>`, [x, top + 1, 0], { cls: 'mini', state: 'problem' });
      ctx.label(g, `${name}<br><b>${pct}</b>`, [x, top + 1, 0], { cls: (i === 0 ? '' : 'good ') + 'mini', state: 'solved' });
    } else {
      ctx.label(g, '?', [x, top + 0.9, 0], { cls: 'mini qsmall', state: 'problem' });
      ctx.label(g, `${name}<br><b>${pct}</b>`, [x, top + 1, 0], { cls: 'mini', state: 'solved', color: '#' + col.getHexString() });
    }
    ctx.pick(mesh, { title: name, text: total ? (i === 0 ? 'List price × volume: what we invoice before anything comes off.' : 'What Mars really earns after every deduction.') : `${name} reduce gross revenue. Illustrative ${pct} of gross.` });
    return { mesh, m, col, x, top, bottom, total, i };
  });

  // Leak drips under the staircase
  const drips = [];
  for (let i = 0; i < 14; i++) {
    const s = steps[1 + (i % 6)];
    drips.push({ m: add(g, new THREE.SphereGeometry(0.14, 8, 6), basic(0xff3b5c, 1, true), s.x + (r() - 0.5), s.bottom, 0), s, ph: r() });
  }
  ctx.label(g, '💧 Revenue leakage', [0, 0.8, 3.2], { cls: 'pain mini', state: 'problem' });
  ctx.label(g, '⏰ Late accruals', [steps[5].x, steps[5].top + 3.2, 0], { cls: 'pain mini', state: 'problem' });

  // Sources → GTN data product → staircase
  const SRC = [['SAP pricing & billing', 0xff8a3d, 'Excel'], ['TPM promotions', 0xff4f81, 'E-mail'], ['Claims & deductions', 0xa970ff, 'PDF claims'], ['Contracts & rebates', 0x3fa9ff, 'Shared drive']];
  const cubePos = V(0, 1.6, 10.5);
  const cube = add(g, box(2.4, 2.4, 2.4), mat(S.color, { glow: 0.9 }), cubePos.x, cubePos.y, cubePos.z);
  ctx.label(g, 'GTN data product', [cubePos.x + 3.6, 1.6, cubePos.z], { cls: 'chip azure', state: 'solved' });
  ctx.pick(cube, { title: 'GTN data product', text: 'Customer × SKU × month, accruals vs actuals, lineage in Purview: one net number for Finance and SRM.' });
  const srcMeshes = [];
  const flows = SRC.map(([name, color, mess], i) => {
    const p = V(-9 + i * 6, 0.7, 6);
    srcMeshes.push(add(g, box(1.4, 1.4, 1.4), mat(color, { glow: 0.2 }), p.x, p.y, p.z));
    ctx.label(g, name, [p.x, -0.9, p.z + 1], { cls: 'mini' });
    ctx.label(g, `📄 ${mess}`, [p.x, 2.3, p.z], { cls: 'pain mini', state: 'problem' });
    return new Flow(g, arc(p.clone().setY(1.4), cubePos, 1.5), color, { count: 10, speed: 0.35 });
  });
  const outC = arc(cubePos.clone().setY(2.8), V(0, 9.4, 0.8), 5);
  const outTube = tube(g, outC, S.color, { r: 0.08, opacity: 0.4 });
  const outFlow = new Flow(g, outC, S.color, { count: 16, speed: 0.3, size: 0.6 });

  return {
    group: g,
    update(t, dt, k) {
      const w = 1 - k;
      steps.forEach((s) => {
        s.m.color.copy(grey).lerp(s.col, k);
        s.m.emissive.copy(s.m.color);
        s.m.opacity = lerp(0.45, 1, k);
        s.m.depthWrite = k > 0.9;
        s.m.emissiveIntensity = s.i === 7 ? 0.3 + 0.9 * k : 0.3 + 0.3 * k;
        let off = Math.sin(t * 2 + s.i) * 0.12 * w;
        if (s.i === 5) { const p = (t % 4) / 4; off += (p < 0.35 ? (1 - p / 0.35) * 7 : 0) * w; }
        s.mesh.position.y = (s.top + s.bottom) / 2 + off;
      });
      drips.forEach((d) => {
        const u = (t * 0.5 + d.ph) % 1;
        d.m.position.y = d.s.bottom - u * (d.s.bottom + 3);
        d.m.material.opacity = w * (1 - u);
        d.m.visible = w > 0.02;
      });
      cube.scale.setScalar(Math.max(0.001, k));
      cube.rotation.y = t * 0.6;
      srcMeshes.forEach((m) => { m.material.emissiveIntensity = 0.2 + 0.6 * k; });
      flows.forEach((f) => f.update(t, k));
      outTube.visible = k > 0.05; outTube.material.opacity = 0.4 * k;
      outFlow.update(t, k);
    },
  };
}
