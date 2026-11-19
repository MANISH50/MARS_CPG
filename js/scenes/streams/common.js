import * as THREE from 'three';
import { platform } from '../../utils/factory.js';

// Shared frame for every stream mini-scene: platform, headline (problem/solved) and Azure tool chips.
export function streamBase(ctx, S, { r = 12, top = 8 } = {}) {
  const g = new THREE.Group();
  platform(g, r, S.color);
  ctx.label(g, `😣 ${S.problemTag}`, [0, top, 0], { cls: 'pain big', state: 'problem' });
  ctx.label(g, `✅ ${S.solvedTag}`, [0, top, 0], { cls: 'good big', state: 'solved' });
  const n = S.tools.length;
  S.tools.forEach((tl, i) => ctx.label(g, tl, [(i - (n - 1) / 2) * 5.6, top - 1.5, 0], { cls: 'chip azure', state: 'solved' }));
  return g;
}
