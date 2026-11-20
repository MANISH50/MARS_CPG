// Sell-Out: spiky shipments vs real demand + overflowing warehouse → aligned bars + forecast.
import * as THREE from 'three';
import { add, mat, basic, box, Flow, tube, V, lerp } from '../../utils/factory.js';
import { streamBase } from './common.js';
import { STREAMS } from '../../data/content.js';

export function build(ctx, S) {
  const g = streamBase(ctx, S);
  const W = 10, x0 = -7.6, dx = 1.3;
  const demand = (i) => 2.4 + 0.9 * Math.sin(i * 0.7 + 0.5) + i * 0.08;
  const spiky = (i) => demand(i) * (1.35 + 0.6 * Math.sin(i * 2.1)) + (i % 3 === 0 ? 1.4 : 0);

  add(g, box(18, 0.08, 0.08), basic(0xffffff, 0.35), 0.4, 0.05, 0.7);
  const bars = [];
  for (let i = 0; i < W; i++) {
    const x = x0 + i * dx;
    const bi = add(g, box(0.5, 1, 0.8), mat(STREAMS.sellIn.color, { glow: 0.6 }), x - 0.3, 0, 0);
    const bo = add(g, box(0.5, 1, 0.8), mat(S.color, { glow: 0.6 }), x + 0.3, 0, 0);
    bars.push({ bi, bo, d: demand(i), s: spiky(i) });
  }
  ctx.pick(g, { title: 'Sell-In vs Sell-Out', text: 'Orange = what Mars shipped. Yellow = what shoppers bought. The gap piles up as channel stock.' });

  // Forecast: future ghost bars + glowing line
  const fut = [];
  for (let i = W; i < W + 4; i++) {
    const m = add(g, box(0.5, 1, 0.8), mat(S.color, { glow: 0.8, opacity: 0.35 }), x0 + i * dx + 0.3, 0, 0);
    fut.push({ m, d: demand(i) });
  }
  const pts = []; for (let i = W - 1; i < W + 4; i++) pts.push(V(x0 + i * dx + 0.3, demand(i) + 0.35, 0));
  const fc = new THREE.CatmullRomCurve3(pts);
  const fTube = tube(g, fc, S.color, { r: 0.08, opacity: 0.7 });
  const fFlow = new Flow(g, fc, 0xffffff, { count: 10, speed: 0.4, size: 0.5 });
  ctx.label(g, '🔮 Forecast · Azure ML', [x0 + (W + 1.5) * dx, 5.6, 0], { cls: 'good mini', state: 'solved' });
  ctx.label(g, '<span class="dot"></span>Sell-In', [-3.5, -0.9, 2], { cls: 'mini stream', color: STREAMS.sellIn.hex });
  ctx.label(g, '<span class="dot"></span>Sell-Out', [-0.5, -0.9, 2], { cls: 'mini stream', color: S.hex });

  // Channel warehouse
  const wh = new THREE.Group(); wh.position.set(-9.4, 0, -4.2); g.add(wh);
  for (const [x, z, w, d] of [[-1.5, 0, 0.15, 3], [1.5, 0, 0.15, 3], [0, -1.5, 3, 0.15]]) add(wh, box(w, 2.4, d), mat(0x2a2f4a, { glow: 0.1, opacity: 0.8 }), x, 1.2, z);
  const crates = [];
  for (let i = 0; i < 18; i++) {
    const c = i % 9, l = Math.floor(i / 9);
    crates.push(add(wh, box(0.85, 0.85, 0.85), mat(STREAMS.sellIn.color, { glow: 0.35 }), ((c % 3) - 1) * 0.92, 0.45 + l * 0.9 + (l > 1 ? 0.2 : 0), (Math.floor(c / 3) - 1) * 0.92));
  }
  for (let i = 18; i < 24; i++) crates.push(add(wh, box(0.85, 0.85, 0.85), mat(0xff5d5d, { glow: 0.5 }), ((i % 3) - 1) * 0.92, 2.25 + Math.floor((i - 18) / 3) * 0.9, (i % 2) - 0.5));
  ctx.label(wh, '📦 Overstock in the channel', [0, 5.4, 0], { cls: 'pain mini', state: 'problem' });
  ctx.label(wh, '📦 Healthy stock', [0, 3.4, 0], { cls: 'good mini', state: 'solved' });
  ctx.pick(wh, { title: 'Channel stock', text: 'When shipments run ahead of demand, stock piles up and ends in waste or deep discounts.' });

  return {
    group: g,
    update(t, dt, k) {
      bars.forEach((b, i) => {
        const wob = 1 + Math.sin(t * 1.5 + i) * 0.04;
        const hi = lerp(b.s, b.d * 1.04, k) * wob, ho = b.d * wob;
        b.bi.scale.y = hi; b.bi.position.y = hi / 2;
        b.bo.scale.y = ho; b.bo.position.y = ho / 2;
      });
      fut.forEach((f) => { const h = Math.max(0.001, f.d * k); f.m.scale.y = h; f.m.position.y = h / 2; });
      fTube.material.opacity = 0.7 * k; fTube.visible = k > 0.02;
      fFlow.update(t, k);
      const n = Math.round(lerp(24, 6, k));
      crates.forEach((c, i) => { c.visible = i < n; });
    },
  };
}
