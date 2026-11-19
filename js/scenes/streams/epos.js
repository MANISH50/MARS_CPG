// EPOS: a retailer shelf with hidden gaps and unmatched barcodes → codes matched, empty shelves flagged & refilled.
import * as THREE from 'three';
import { add, mat, basic, box, V, rng, lerp } from '../../utils/factory.js';
import { streamBase } from './common.js';

export function build(ctx, S) {
  const g = streamBase(ctx, S);
  const r = rng(31);

  const shelf = new THREE.Group(); shelf.position.set(0, 0, -1.5); g.add(shelf);
  add(shelf, box(11.4, 6.4, 0.3), mat(0x14251f, { glow: 0.05 }), 0, 3.2, -0.9);
  for (const x of [-5.6, 5.6]) add(shelf, box(0.25, 6.4, 1.8), mat(0x2e4a40, { glow: 0.1 }), x, 3.2, 0);
  const SY = [0.3, 2.4, 4.5];
  SY.forEach((y) => add(shelf, box(11.2, 0.18, 1.8), mat(0x2e4a40, { glow: 0.15 }), 0, y, 0));
  ctx.label(shelf, '🏪 Retailer shelf', [-7.4, 5.6, 0], { cls: 'tag' });
  ctx.pick(shelf, { title: 'Retailer EPOS', text: 'Every scan at the till becomes a row of EPOS data, in the retailer\'s own codes and calendar.' });

  const GREENS = [0x3ddc84, 0x7ae582, 0x25a18e, 0x9ef01a, 0x52b788];
  const EMPTY = new Set([1, 7, 8, 13]);
  const slots = [];
  for (let row = 0; row < 3; row++) {
    for (let c = 0; c < 5; c++) {
      const i = row * 5 + c, x = (c - 2) * 2.15, y = SY[row] + 0.75;
      const p = add(shelf, box(1.35, 1.3, 1.1), mat(GREENS[i % GREENS.length], { glow: 0.45 }), x, y, 0.1);
      const empty = EMPTY.has(i);
      const marker = empty ? add(shelf, box(1.4, 0.12, 1.2), basic(0xff3b5c, 1, true), x, SY[row] + 0.16, 0.1) : null;
      slots.push({ p, empty, marker, x, y });
    }
  }
  ctx.label(shelf, 'Out of stock, and nobody sees it', [slots[7].x, slots[7].y + 1.2, 1], { cls: 'pain mini', state: 'problem' });
  ctx.label(shelf, '🔔 OOS alert → refilled', [slots[7].x, slots[7].y + 1.2, 1], { cls: 'good mini', state: 'solved' });

  const tags = [];
  const filled = slots.filter((s) => !s.empty);
  for (let i = 0; i < 9; i++) {
    const tg = new THREE.Group(); g.add(tg);
    add(tg, box(0.75, 0.42, 0.05), basic(0xffffff, 0.95));
    for (let b = 0; b < 5; b++) add(tg, box(0.06, 0.3, 0.06), basic(0x111111), -0.25 + b * 0.12, 0, 0.03);
    const s = filled[i];
    tags.push({ tg, ph: r() * 6, p0: V((r() - 0.5) * 13, 1.5 + r() * 6, 3 + r() * 3), p1: V(s.x, s.y - 0.95, -0.85) });
  }
  ctx.label(tags[0].tg, 'item 0091-X = ?', [0, 0.6, 0], { cls: 'pain mini', state: 'problem' });
  ctx.label(tags[1].tg, 'wk 37 (retail) ≠ P10 (Mars)', [0, 0.6, 0], { cls: 'pain mini', state: 'problem' });
  ctx.label(g, 'Retailer item → GTIN → Mars SKU ✓', [0, 1.2, 3.5], { cls: 'good mini', state: 'solved' });

  return {
    group: g,
    update(t, dt, k) {
      const w = 1 - k;
      slots.forEach((s) => {
        if (!s.empty) return;
        s.p.scale.setScalar(Math.max(0.001, k));
        s.marker.material.opacity = (k > 0.9 ? 0 : 1) * (0.35 + 0.65 * Math.abs(Math.sin(t * 3)));
      });
      tags.forEach((o) => {
        o.tg.position.set(lerp(o.p0.x + Math.sin(t * 0.7 + o.ph) * 0.6, o.p1.x, k), lerp(o.p0.y + Math.sin(t + o.ph) * 0.4, o.p1.y, k), lerp(o.p0.z, o.p1.z, k));
        o.tg.rotation.set(Math.sin(t + o.ph) * 0.6 * w, (t * 0.8 + o.ph) * w, 0);
      });
    },
  };
}
