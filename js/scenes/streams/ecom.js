// E-Com: scattered phone screens (one per channel) → lined up into one digital-shelf wall.
import * as THREE from 'three';
import { add, mat, basic, box, V, rng, lerp } from '../../utils/factory.js';
import { streamBase } from './common.js';

const CHANNELS = [['Amazon', 0xff9f1c], ['Retailer.com', 0x3fa9ff], ['Quick-commerce', 0x9b5de5], ['Mars DTC', 0x3ddc84], ['Marketplace', 0xff4f81]];

export function build(ctx, S) {
  const g = streamBase(ctx, S);
  const r = rng(41);

  const wall = add(g, box(12.6, 4.6, 0.3), mat(0x0b3a66, { glow: 0.6, opacity: 0.85 }), 0, 4.2, -0.5);
  ctx.label(g, 'Price · Rank · Rating · Content · Sales', [0, 1.2, 1.5], { cls: 'chip azure', state: 'solved' });

  const phones = CHANNELS.map(([name, color], i) => {
    const ph = new THREE.Group(); g.add(ph);
    add(ph, box(1.9, 3.3, 0.22), mat(0x0f1626, { glow: 0.05 }));
    add(ph, box(1.65, 2.95, 0.05), basic(color, 0.95), 0, 0, 0.13);
    const bars = [0, 1, 2].map((b) => add(ph, box(0.35, 1, 0.08), basic(0xffffff, 0.9), -0.45 + b * 0.45, -1.1, 0.2));
    ctx.label(ph, name, [0, -2.2, 0], { cls: 'mini' });
    ctx.pick(ph, { title: name, text: 'Its own API, schema, refresh time and definition of a "sale".' });
    const a = (i / CHANNELS.length) * Math.PI * 2;
    return { ph, bars, h: [0.6 + r(), 0.6 + r(), 0.6 + r()], ph0: r() * 6,
      p0: V(Math.cos(a) * 7, 3.5 + r() * 3, Math.sin(a) * 4 + 1), p1: V((i - 2) * 2.35, 4.2, -0.2) };
  });

  return {
    group: g,
    update(t, dt, k) {
      const w = 1 - k;
      wall.scale.set(Math.max(0.001, k), Math.max(0.001, k), 1);
      phones.forEach((o, i) => {
        o.ph.position.set(lerp(o.p0.x, o.p1.x, k), lerp(o.p0.y + Math.sin(t + o.ph0) * 0.5, o.p1.y, k), lerp(o.p0.z, o.p1.z, k));
        o.ph.rotation.set(Math.sin(t * 0.6 + o.ph0) * 0.5 * w, (t * 0.5 + o.ph0) * w, Math.sin(t * 0.4 + i) * 0.3 * w);
        o.bars.forEach((b, j) => {
          const h = k > 0.5 ? o.h[j] * (0.9 + 0.1 * Math.sin(t * 2 + j + i)) : 0.2 + Math.abs(Math.sin(t * 3 + j * 2 + i)) * 1.2;
          b.scale.y = h; b.position.y = -1.4 + h / 2;
        });
      });
    },
  };
}
