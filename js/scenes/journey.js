// Chapter 4: follow a candy bar from factory to shopper; each hop emits a data stream.
import * as THREE from 'three';
import { add, mat, basic, box, platform, Flow, tube, arc, V } from '../utils/factory.js';
import { STREAMS } from '../data/content.js';

export function buildJourney(ctx) {
  const g = new THREE.Group();
  platform(g, 33, 0x4cc2ff);

  const road = new THREE.CatmullRomCurve3([V(-27, 0.25, 6), V(-14, 0.25, -1), V(0, 0.25, 5), V(14, 0.25, -1), V(27, 0.25, 5)]);
  const rm = add(g, new THREE.TubeGeometry(road, 160, 0.9, 8, false), mat(0x1a2340, { glow: 0.15 }));
  rm.scale.y = 0.2;
  const traffic = new Flow(g, road, 0xffffff, { count: 46, speed: 0.025, size: 0.35 });

  const P = (u) => road.getPointAt(u).setY(0);

  // Stations
  const fP = P(0.02), dP = P(0.34), sP = P(0.64), cP = P(0.985);
  const oP = sP.clone().add(V(3, 0, -8));
  const factory = new THREE.Group(); factory.position.copy(fP).add(V(0, 0, -3)); g.add(factory);
  add(factory, box(4.5, 3, 3), mat(0x33415f, { glow: 0.1 }), 0, 1.5, 0);
  add(factory, new THREE.CylinderGeometry(0.4, 0.5, 3, 12), mat(0x4a5878, { glow: 0.1 }), 1.4, 4.2, 0);
  add(factory, box(4.6, 0.3, 3.1), mat(STREAMS.sellIn.color, { glow: 0.7 }), 0, 3.1, 0);
  const smoke = [0, 1, 2].map(() => add(factory, new THREE.SphereGeometry(0.45, 10, 8), basic(0xb8c4e0, 0.4, true), 1.4, 6, 0));

  const dist = new THREE.Group(); dist.position.copy(dP).add(V(0, 0, -3.5)); g.add(dist);
  add(dist, box(4.2, 2.6, 3.4), mat(0x2b2350, { glow: 0.1 }), 0, 1.3, 0);
  add(dist, box(4.6, 0.35, 3.8), mat(STREAMS.distributor.color, { glow: 0.6 }), 0, 2.75, 0);
  const truck = new THREE.Group(); g.add(truck);
  add(truck, box(1.8, 1.2, 1.1), mat(0xdedcff, { glow: 0.3 }), 0, 0.85, 0);
  add(truck, box(0.8, 0.9, 1.05), mat(STREAMS.distributor.color, { glow: 0.6 }), 1.3, 0.7, 0);

  const store = new THREE.Group(); store.position.copy(sP).add(V(0, 0, 3.6)); g.add(store);
  add(store, box(3.8, 2.6, 3), mat(0x1d3b33, { glow: 0.1 }), 0, 1.3, 0);
  for (let i = 0; i < 5; i++) add(store, box(0.76, 0.3, 0.8), mat(i % 2 ? 0xffffff : STREAMS.epos.color, { glow: 0.6 }), -1.52 + i * 0.76, 2.4, 1.7);

  const phone = new THREE.Group(); phone.position.copy(oP).add(V(0, 2.2, 0)); g.add(phone);
  add(phone, box(1.8, 3.2, 0.25), mat(0x111827, { glow: 0.05 }));
  add(phone, box(1.55, 2.8, 0.05), basic(STREAMS.ecom.color, 0.95), 0, 0, 0.14);
  tube(g, new THREE.LineCurve3(sP.clone().setY(0.2), oP.clone().setY(0.2)), STREAMS.ecom.color, { r: 0.12, opacity: 0.4 });

  const shopper = new THREE.Group(); shopper.position.copy(cP).add(V(1, 0, -1.5)); g.add(shopper);
  add(shopper, new THREE.CylinderGeometry(0.55, 0.75, 2, 16), mat(STREAMS.sellOut.color, { glow: 0.5 }), 0, 1, 0);
  add(shopper, new THREE.SphereGeometry(0.55, 16, 12), mat(0xffe8c7, { glow: 0.3 }), 0, 2.55, 0);

  ctx.label(factory, '🏭 Mars factory', [0, 7.6, 0], { cls: 'tag' });
  ctx.label(dist, '🚚 Distributor', [0, 4.2, 0], { cls: 'tag' });
  ctx.label(store, '🏪 Store', [0, 4, 0], { cls: 'tag' });
  ctx.label(phone, '📱 Online', [0, 2.5, 0], { cls: 'tag' });
  ctx.label(shopper, '🙂 Shopper', [0, 3.7, 0], { cls: 'tag' });

  // Candy bars riding the road
  const bars = [0, 0.5].map(() => {
    const b = new THREE.Group(); g.add(b);
    add(b, box(1.3, 0.4, 0.6), mat(0x7a4a2a, { glow: 0.35 }));
    add(b, box(1.32, 0.42, 0.25), mat(0xffd23f, { glow: 0.8 }));
    return b;
  });

  // Azure lakehouse in the sky
  const lakeC = V(0, 16, -9);
  const lake = add(g, new THREE.CylinderGeometry(8, 8, 0.5, 64), mat(0x0078d4, { glow: 0.9, opacity: 0.55 }), lakeC.x, lakeC.y, lakeC.z);
  const lakeRing = add(g, new THREE.TorusGeometry(8.6, 0.08, 8, 96), basic(0x4cc2ff, 0.9), lakeC.x, lakeC.y, lakeC.z);
  lakeRing.rotation.x = Math.PI / 2;
  ctx.label(g, '☁️ Azure lakehouse', [lakeC.x, lakeC.y + 2.2, lakeC.z], { cls: 'chip azure big', goto: 'lake' });

  const edge = (p) => { const d = p.clone().sub(lakeC).setY(0).normalize().multiplyScalar(7.5); return lakeC.clone().add(d); };
  const streamFrom = [['sellIn', factory.position.clone().add(V(0, 3.4, 0))], ['distributor', dist.position.clone().add(V(0, 3, 0))],
    ['epos', store.position.clone().add(V(0, 2.8, 0))], ['ecom', phone.position.clone().add(V(0, 1.7, 0))],
    ['sellOut', shopper.position.clone().add(V(0, 3.2, 0))]];
  const flows = streamFrom.map(([key, p]) => {
    const S = STREAMS[key];
    const c = arc(p, edge(p), 5);
    tube(g, c, S.color, { r: 0.07, opacity: 0.35 });
    const mid = c.getPoint(0.55);
    ctx.label(g, `<span class="dot"></span>${S.name}`, [mid.x, mid.y + 0.8, mid.z], { cls: 'chip stream', color: S.hex, goto: key });
    return new Flow(g, c, S.color, { count: 16, speed: 0.3, size: 0.6 });
  });

  // SRM control tower pulling from the lake
  const tower = new THREE.Group(); tower.position.set(24, 0, -14); g.add(tower);
  add(tower, new THREE.CylinderGeometry(0.5, 0.9, 18, 12), mat(0x2a2f4a, { glow: 0.1 }), 0, 9, 0);
  const crown = add(tower, new THREE.TorusGeometry(1.8, 0.18, 10, 40), basic(STREAMS.srm.color), 0, 18.4, 0);
  add(tower, new THREE.SphereGeometry(0.9, 16, 12), mat(STREAMS.srm.color, { glow: 1 }), 0, 18.4, 0);
  ctx.label(tower, `<span class="dot"></span>SRM control tower`, [0, 21, 0], { cls: 'chip stream', color: STREAMS.srm.hex, goto: 'srm' });
  ctx.label(tower, `<span class="dot"></span>Gross-to-Net`, [0, 12.5, 0], { cls: 'chip stream', color: STREAMS.gtn.hex, goto: 'gtn' });
  const srmCurve = arc(lakeC.clone().add(V(7.5, 0, -1)), tower.position.clone().add(V(-1, 18.4, 0)), 3);
  tube(g, srmCurve, STREAMS.srm.color, { r: 0.07, opacity: 0.35 });
  const srmFlow = new Flow(g, srmCurve, STREAMS.srm.color, { count: 14, speed: 0.35, size: 0.6 });

  // Sell-in vs sell-out gap meter
  const gap = new THREE.Group(); gap.position.set(-23, 0, -12); g.add(gap);
  const barIn = add(gap, box(1.4, 1, 1.4), mat(STREAMS.sellIn.color, { glow: 0.7 }), -0.9, 0.5, 0);
  const barOut = add(gap, box(1.4, 1, 1.4), mat(STREAMS.sellOut.color, { glow: 0.7 }), 0.9, 0.5, 0);
  const gapLbl = ctx.label(gap, '📦 Sell-In – Sell-Out = stock in the channel', [0, 9.5, 0], { cls: 'pain' });
  ctx.label(gap, 'In', [-0.9, -0.9, 1], { cls: 'mini' });
  ctx.label(gap, 'Out', [0.9, -0.9, 1], { cls: 'mini' });

  return {
    group: g,
    update(t) {
      traffic.update(t, 0.7);
      flows.forEach((f) => f.update(t));
      srmFlow.update(t);
      bars.forEach((b, i) => {
        const u = (t * 0.045 + i * 0.5) % 1;
        const p = road.getPointAt(u), tan = road.getTangentAt(u);
        b.position.set(p.x, 0.75 + Math.abs(Math.sin(t * 4 + i)) * 0.25, p.z);
        b.rotation.y = Math.atan2(-tan.z, tan.x);
      });
      const tu = (0.18 + Math.sin(t * 0.35) * 0.12);
      const tp = road.getPointAt(tu), tt = road.getTangentAt(tu);
      truck.position.set(tp.x, 0.1, tp.z + 1.6);
      truck.rotation.y = Math.atan2(-tt.z, tt.x) + (Math.cos(t * 0.35) < 0 ? Math.PI : 0);
      smoke.forEach((s, i) => {
        const u = (t * 0.3 + i / 3) % 1;
        s.position.set(1.4 + u * 0.8, 4.8 + u * 3, 0);
        s.scale.setScalar(0.6 + u * 1.4);
        s.material.opacity = 0.45 * (1 - u);
      });
      crown.rotation.x = Math.PI / 2 + Math.sin(t) * 0.2;
      crown.rotation.z = t;
      lakeRing.rotation.z = t * 0.2;
      lake.material.emissiveIntensity = 0.7 + Math.sin(t * 2) * 0.15;
      const hi = 6.5 + Math.sin(t * 0.8) * 1.2, ho = 4 + Math.sin(t * 0.6 + 1) * 0.5;
      barIn.scale.y = hi; barIn.position.y = hi / 2;
      barOut.scale.y = ho; barOut.position.y = ho / 2;
      gapLbl.position.y = hi + 1.6;
    },
  };
}
