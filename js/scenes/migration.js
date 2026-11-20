// AOH ➜ DNA: a tangled legacy monolith, a 5-gate migration bridge, and domain-based data-product pods.
import * as THREE from 'three';
import { add, mat, basic, box, platform, Flow, tube, V, rng } from '../utils/factory.js';
import { STREAMS } from '../data/content.js';

const GATES = ['1 · Assess', '2 · Inventory', '3 · Dependency map', '4 · Security & PII', '5 · To-be design'];
const PODS = [['Petcare', V(25, 0, -4.5)], ['Snacking', V(35, 0, -4.5)], ['Food & Nutrition', V(30, 0, 5)]];
const PRODUCTS = ['sellIn', 'distributor', 'epos', 'ecom', 'sellOut', 'srm'];
const DEPS = [['sellOut', 'epos'], ['sellOut', 'distributor'], ['sellOut', 'ecom'], ['srm', 'sellOut'], ['srm', 'sellIn']];

export function buildMigration(ctx) {
  const g = new THREE.Group();
  const r = rng(71);

  // ── AOH (legacy)
  const aoh = new THREE.Group(); aoh.position.set(-30, 0, 0); g.add(aoh);
  platform(aoh, 10, 0xff5d73);
  add(aoh, box(5, 7, 5), mat(0x30364d, { glow: 0.12 }), 0, 3.5, 0);
  for (let i = 0; i < 16; i++) {
    const pts = Array.from({ length: 5 }, () => V((r() - 0.5) * 12, 0.5 + r() * 8, (r() - 0.5) * 12));
    tube(aoh, new THREE.CatmullRomCurve3(pts), i % 3 ? 0x8a93b0 : 0xff5d73, { r: 0.09, opacity: 0.45, seg: 40 });
  }
  ctx.label(aoh, '<b>AOH</b> · legacy analytics platform', [0, 10.5, 0], { cls: 'tag big', info: { title: 'AOH (legacy)', text: 'Existing Azure analytics platform: grown over years, tightly coupled pipelines, dependencies not fully documented.' } });
  ctx.label(aoh, '🍝 Tangled pipelines', [-5, 7.5, 4], { cls: 'pain mini', state: 'problem' });
  ctx.label(aoh, 'PII where?', [4.5, 5, 4], { cls: 'pain mini', state: 'problem' });
  ctx.pick(aoh, { title: 'AOH (legacy)', text: 'Existing Azure analytics platform: grown over years, tightly coupled pipelines, dependencies not fully documented.' });

  // ── Bridge + gates
  add(g, box(40, 0.4, 4.2), mat(0x1a2340, { glow: 0.15 }), 0, 0.2, 0);
  const gates = GATES.map((n, i) => {
    const x = -14 + i * 7;
    const m = basic(0x4cc2ff, 0.5);
    const arch = add(g, new THREE.TorusGeometry(2.6, 0.16, 8, 32, Math.PI), m, x, 0.4, 0);
    arch.rotation.y = Math.PI / 2 - 0.55;
    ctx.label(g, n, [x, i % 2 ? 4.9 : 3.7, 0], { cls: 'chip gate', info: { title: n, text: [
      'Review both AOH and DNA environments: what exists, what works, what hurts.',
      'Automated, complete inventory of AOH: pipelines, tables, reports, jobs, owners.',
      'Data-product dependency "mind map": what feeds what, so nothing breaks on move.',
      'Security posture and sensitive data: classify PII, fix access, secrets in Key Vault.',
      'Target DNA architecture that meets segment, market and domain needs.'][i] } });
    return { m, x };
  });

  // Manual migration: developers carrying boxes slowly
  const devs = [];
  for (let i = 0; i < 6; i++) {
    const d = new THREE.Group(); g.add(d);
    add(d, new THREE.CylinderGeometry(0.35, 0.45, 1.3, 10), mat(0xc7cde0, { glow: 0.2 }), 0, 1.05, 0);
    add(d, new THREE.SphereGeometry(0.35, 12, 8), mat(0xffe0bd, { glow: 0.2 }), 0, 2, 0);
    const crate = add(d, box(0.8, 0.6, 0.8), mat(0xff8a3d, { glow: 0.4 }), 0, 2.8, 0);
    devs.push({ d, crate, ph: i / 6, z: (r() - 0.5) * 2.6, drop: 0.35 + r() * 0.5, drops: i % 2 === 0 });
  }
  ctx.label(g, '🐢 Manual · slow · risky', [0, 8, 0], { cls: 'pain big', state: 'problem' });

  // Accelerated: fast multi-colour flow through the gates
  const bridgeCurve = new THREE.LineCurve3(V(-22, 1.4, 0), V(22, 1.4, 0));
  const cols = PRODUCTS.map((k) => new THREE.Color(STREAMS[k].color));
  const fast = new Flow(g, bridgeCurve, 0xffffff, { count: 70, speed: 0.22, size: 0.7, colorFn: (u, c, i) => c.copy(cols[i % cols.length]) });
  ['Purview scan → inventory', 'Unity Catalog lineage', 'Metadata-driven pipelines', 'IaC · Bicep / Terraform', 'CI/CD + parallel-run reconcile']
    .forEach((txt, i) => ctx.label(g, '⚙ ' + txt, [-14 + i * 7, 7.2 + (i % 2) * 1.3, 0], { cls: 'chip azure mini', state: 'solved' }));

  // ── DNA (domain-based data products)
  const dna = new THREE.Group(); g.add(dna);
  const dnaBase = platform(dna, 11, 0x3ddc84); dnaBase.position.set(30, 0, 0);
  ctx.label(dna, '<b>DNA</b> · domain data products', [30, 10.5, 0], { cls: 'tag big', info: { title: 'DNA (target)', text: 'Domain-based data-product platform: each segment / market / domain owns governed, reusable data products.' } });
  const hubP = V(30, 1.6, 0);
  add(dna, new THREE.SphereGeometry(1, 20, 14), mat(0xffffff, { glow: 0.6 }), hubP.x, hubP.y, hubP.z);
  ctx.label(dna, 'Master data · customer · product · calendar', [30, 3.2, 0.5], { cls: 'mini' });
  const cubes = {};
  PODS.forEach(([name, c], pi) => {
    add(dna, new THREE.CylinderGeometry(3.3, 3.3, 0.25, 40), mat(0x163a2c, { glow: 0.2 }), c.x, 0.15, c.z);
    ctx.label(dna, name, [c.x, 3.2, c.z + (pi === 2 ? 2.6 : -2.6)], { cls: 'mini' });
    PRODUCTS.forEach((k, i) => {
      const a = (i / PRODUCTS.length) * Math.PI * 2;
      const p = V(c.x + Math.cos(a) * 2.1, 0.9, c.z + Math.sin(a) * 2.1);
      const S = STREAMS[k];
      const m = add(dna, box(0.9, 0.9, 0.9), mat(S.color, { glow: 0.6 }), p.x, p.y, p.z);
      const deps = DEPS.filter(([a1]) => a1 === k).map(([, b]) => STREAMS[b].name);
      const usedBy = DEPS.filter(([, b]) => b === k).map(([a1]) => STREAMS[a1].name);
      ctx.pick(m, { title: `${S.name} · ${name}`, text: `Data product. Depends on: ${deps.join(', ') || 'source systems + master data'}. Used by: ${usedBy.join(', ') || 'Power BI / Finance'}.`, onPick: () => highlight(k, pi) });
      cubes[`${pi}:${k}`] = p;
    });
    tube(dna, new THREE.LineCurve3(hubP, V(c.x, 0.9, c.z)), 0xffffff, { r: 0.04, opacity: 0.25 });
  });
  const depLines = [];
  PODS.forEach((_, pi) => DEPS.forEach(([a1, b]) => {
    const A = cubes[`${pi}:${a1}`], B = cubes[`${pi}:${b}`];
    const mid = A.clone().add(B).multiplyScalar(0.5); mid.y += 1.2;
    const m = tube(dna, new THREE.QuadraticBezierCurve3(A, mid, B), 0xffffff, { r: 0.06, opacity: 0, seg: 20 });
    depLines.push({ m, pi, a: a1, b });
  }));
  ctx.label(dna, '❓ Unknown dependencies', [30, 6.5, 0], { cls: 'pain mini', state: 'problem' });
  ctx.label(dna, '🧠 Dependency mind map: tap a cube', [30, 6.5, 0], { cls: 'good mini', state: 'solved' });
  const legend = PRODUCTS.map((k) => `<span class="sw" style="background:${STREAMS[k].hex}"></span>${STREAMS[k].name}`).join(' ');
  ctx.label(dna, legend, [30, -1.2, 11], { cls: 'mini legend' });

  let hl = null, kNow = 0;
  function highlight(k, pi) { hl = { k, pi, until: performance.now() + 4000 }; }

  return {
    group: g,
    update(t, dt, k) {
      kNow = k;
      const w = 1 - k;
      devs.forEach((o) => {
        const u = (t * 0.03 + o.ph) % 1;
        o.d.position.set(-20 + u * 40, 0.4, o.z);
        o.d.scale.setScalar(Math.max(0.001, w));
        const dropped = o.drops && u > o.drop;
        o.crate.position.y = dropped ? Math.max(-6, 2.8 - (u - o.drop) * 60) : 2.8;
        o.crate.position.z = dropped ? Math.min(4, (u - o.drop) * 30) : 0;
      });
      fast.update(t, k);
      gates.forEach((gt, i) => {
        const wave = Math.max(0, Math.sin(t * 2.2 - i * 0.9));
        gt.m.opacity = 0.35 + k * 0.65 * (0.4 + 0.6 * wave);
      });
      const now = performance.now();
      if (hl && now > hl.until) hl = null;
      depLines.forEach((d) => {
        let o = 0.55 * kNow * (0.6 + 0.4 * Math.sin(t * 3 + d.pi));
        if (hl) o = d.pi === hl.pi && (d.a === hl.k || d.b === hl.k) ? 1 : o * 0.25;
        d.m.material.opacity = o;
        d.m.visible = o > 0.01;
      });
    },
  };
}
