// SRM: trade-spend coins fall through bottomless promo boxes → only profitable promos get the money.
import * as THREE from 'three';
import { add, mat, box, rng } from '../../utils/factory.js';
import { streamBase } from './common.js';

export function build(ctx, S) {
  const g = streamBase(ctx, S);
  const r = rng(51);
  const BX = [-6.6, -2.2, 2.2, 6.6], GOOD = [0, 2];
  const neutral = new THREE.Color(0x56607a), green = new THREE.Color(0x3ddc84), dim = new THREE.Color(0x3a2230);

  const boxes = BX.map((x, i) => {
    const b = new THREE.Group(); b.position.set(x, 0, 0); g.add(b);
    const m = mat(0x56607a, { glow: 0.3 });
    for (const [px, pz, w, d] of [[-1.5, 0, 0.15, 3], [1.5, 0, 0.15, 3], [0, -1.5, 3, 0.15], [0, 1.5, 3, 0.15]]) add(b, box(w, 2, d), m, px, 1, pz);
    const bottom = add(b, box(2.9, 0.12, 2.9), m, 0, 0.1, 0);
    const good = GOOD.includes(i);
    ctx.label(b, `Promo ${'ABCD'[i]}`, [0, 2.8, 1.6], { cls: 'mini' });
    ctx.label(b, good ? '✓ pays back' : '✗ stop', [0, 3.7, 1.6], { cls: (good ? 'good' : 'pain') + ' mini', state: 'solved' });
    ctx.pick(b, { title: `Promo ${'ABCD'[i]}`, text: good ? 'Uplift beats cost: keep and scale.' : 'Uplift does not cover the discount: stop or redesign.' });
    return { b, m, bottom, good, x };
  });
  ['Price', 'Promo', 'Terms', 'Mix'].forEach((p, i) => ctx.label(g, p, [-6.6 + i * 4.4, 4.9, 1.6], { cls: 'chip pill', state: 'solved' }));
  ctx.label(g, '💸 Where did the money go?', [0, -1.2, 5], { cls: 'pain', state: 'problem' });

  const gold = mat(0xffc93c, { glow: 0.7, metal: 0.6, rough: 0.3 }), lost = mat(0xff3b5c, { glow: 0.6 });
  const coinGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.09, 18);
  let solved = false;
  const spawn = (c) => {
    c.target = solved ? GOOD[Math.floor(r() * GOOD.length)] : Math.floor(r() * 4);
    c.m.position.set(BX[c.target] + (r() - 0.5) * 1.6, 9 + r() * 7, (r() - 0.5) * 1.6);
    c.speed = 4 + r() * 2; c.floor = 0.25 + r() * 0.6; c.wait = 0;
  };
  const coins = [];
  for (let i = 0; i < 36; i++) { const c = { m: add(g, coinGeo, gold) }; spawn(c); c.m.position.y = -8 + r() * 24; coins.push(c); }

  return {
    group: g,
    update(t, dt, k) {
      solved = k > 0.5;
      boxes.forEach((o) => {
        o.m.color.copy(neutral).lerp(o.good ? green : dim, k);
        o.m.emissive.copy(o.m.color);
        o.bottom.visible = o.good && k > 0.5;
      });
      coins.forEach((c, i) => {
        c.m.rotation.set(t * 3 + i, 0, t * 2);
        if (c.wait > 0) { c.wait -= dt; if (c.wait <= 0) spawn(c); return; }
        c.m.position.y -= c.speed * dt;
        const hasFloor = solved && boxes[c.target].good;
        if (hasFloor && c.m.position.y <= c.floor) { c.m.position.y = c.floor; c.wait = 1.2; }
        else if (c.m.position.y < -7) spawn(c);
        c.m.material = c.m.position.y < 0 ? lost : gold;
      });
    },
  };
}
