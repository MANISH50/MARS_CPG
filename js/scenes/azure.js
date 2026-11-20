// Azure reference platform: Sources → Ingest → Medallion lakehouse → Serve/Insights, under a governance dome.
import * as THREE from 'three';
import { add, mat, basic, box, platform, Flow, arc, tube, V } from '../utils/factory.js';

const SOURCES = [['SAP ERP', 0xff8a3d, 'batch'], ['Distributor files', 0xa970ff, 'batch'], ['Retailer EPOS', 0x3ddc84, 'batch'],
  ['TPM & Finance', 0xf59e0b, 'batch'], ['E-com APIs', 0x3fa9ff, 'stream'], ['Factory IoT', 0x2ec4b6, 'stream']];

export function buildAzure(ctx) {
  const g = new THREE.Group();
  platform(g, 44, 0x0078d4);
  const groups = { ingest: [], lake: [], govern: [], insights: [] };
  const flowsBy = { ingest: [], lake: [], govern: [], insights: [] };
  const tag = (key, obj) => { groups[key].push(obj); return obj; };

  // ── Sources + Ingest
  const ingest = tag('ingest', new THREE.Group()); g.add(ingest);
  const adf = V(-24, 2.2, -3.5), eh = V(-24, 2.2, 6);
  const adfM = add(ingest, new THREE.CylinderGeometry(1.8, 1.8, 1.6, 6), mat(0x0078d4, { glow: 0.9 }), adf.x, adf.y, adf.z);
  const ehM = new THREE.Group(); ehM.position.copy(eh); ingest.add(ehM);
  add(ehM, new THREE.SphereGeometry(0.9, 20, 14), mat(0x50e6ff, { glow: 1 }));
  const ehRing = add(ehM, new THREE.TorusGeometry(1.6, 0.12, 8, 40), basic(0x50e6ff, 0.9));
  ctx.label(ingest, 'Data Factory', [adf.x, 4.1, adf.z], { cls: 'chip azure', info: { title: 'Azure Data Factory', text: 'Batch pipelines and connectors (SAP CDC, SFTP, APIs). Orchestrates the daily loads.' } });
  ctx.label(ingest, 'Event Hubs', [eh.x, 4.1, eh.z], { cls: 'chip azure', info: { title: 'Azure Event Hubs', text: 'Real-time streaming for IoT and e-com events.' } });
  ctx.label(ingest, 'Batch · ERP & files, daily', [adf.x, 5.6, adf.z], { cls: 'mini', focus: 'ingest' });
  ctx.label(ingest, 'Real-time · IoT & events', [eh.x, 5.6, eh.z], { cls: 'mini', focus: 'ingest' });
  ctx.pick(adfM, { title: 'Azure Data Factory', text: 'Batch pipelines and connectors (SAP CDC, SFTP, APIs). Orchestrates the daily loads.' });
  ctx.pick(ehM, { title: 'Azure Event Hubs', text: 'Real-time streaming for IoT and e-com events.' });

  SOURCES.forEach(([name, color, mode], i) => {
    const p = V(-38, 1, -11 + i * 4.4);
    const m = add(ingest, box(2, 2, 2), mat(color, { glow: 0.5 }), p.x, p.y, p.z);
    ctx.label(ingest, name, [p.x - 0.5, 2.6, p.z], { cls: 'mini' });
    ctx.pick(m, { title: name, text: mode === 'batch' ? 'Loaded in batch by Data Factory.' : 'Streamed through Event Hubs.' });
    const to = mode === 'batch' ? adf : eh;
    const c = arc(p.clone().setY(1.5), to, 2);
    tube(ingest, c, color, { r: 0.05, opacity: 0.25 });
    flowsBy.ingest.push(new Flow(g, c, color, { count: 10, speed: mode === 'stream' ? 0.6 : 0.3 }));
  });
  ctx.label(ingest, 'Land raw, once', [-31, 8, 1], { cls: 'good', focus: 'ingest' });

  // ── Lakehouse
  const lake = tag('lake', new THREE.Group()); g.add(lake);
  add(lake, new THREE.CylinderGeometry(9.5, 9.8, 0.6, 64), mat(0x0a4a8f, { glow: 0.6 }), 0, 0.3, 0);
  const TIERS = [['Bronze · raw', 0xcd7f32, 2.6, 8], ['Silver · clean', 0xc9d1e0, 5.2, 7], ['Gold · business-ready', 0xf5c542, 7.8, 6]];
  const tierM = TIERS.map(([n, c, y, rr]) => {
    const m = add(lake, new THREE.CylinderGeometry(rr, rr, 0.6, 64), mat(c, { glow: 0.55, metal: 0.5, rough: 0.35 }), 0, y, 0);
    ctx.label(lake, n, [rr + 1.5, y, 2], { cls: 'tag' });
    return m;
  });
  ctx.label(lake, 'ADLS Gen2', [0, -0.6, 10], { cls: 'chip azure', info: { title: 'ADLS Gen2', text: 'Cheap, scalable lake storage. Holds every layer as Delta tables.' } });
  const dbx = add(lake, new THREE.OctahedronGeometry(1.6), mat(0xff3621, { glow: 1 }), 0, 11.2, 0);
  ctx.label(lake, 'Databricks', [0, 13.4, 0], { cls: 'chip azure', info: { title: 'Azure Databricks', text: 'Spark + Delta Lake: cleans, conforms and models data, Bronze → Silver → Gold.' } });
  ctx.label(lake, 'Unity Catalog', [-8, 9.6, 0], { cls: 'chip azure', info: { title: 'Unity Catalog', text: 'Databricks governance: permissions, masking, lineage across all tables.' } });
  ctx.label(lake, 'Delta Lake · ACID · time travel', [0, 15, 0], { cls: 'mini', focus: 'lake' });
  ctx.label(lake, 'Clean once → reuse everywhere', [-12, 4, 6], { cls: 'good', focus: 'lake' });
  ctx.pick(lake, { title: 'Medallion lakehouse', text: 'Bronze = raw history · Silver = cleaned & conformed · Gold = business-ready data products.' });
  const helix = new THREE.CatmullRomCurve3(Array.from({ length: 40 }, (_, i) => {
    const u = i / 39, a = u * Math.PI * 6, rr = 8.6 - u * 2.4;
    return V(Math.cos(a) * rr, 0.8 + u * 7.4, Math.sin(a) * rr);
  }));
  const tierCol = [new THREE.Color(0xcd7f32), new THREE.Color(0xe4e9f2), new THREE.Color(0xffd23f)];
  flowsBy.lake.push(new Flow(g, helix, 0xffffff, { count: 60, speed: 0.08, size: 0.6,
    colorFn: (u, c) => c.copy(u < 0.36 ? tierCol[0] : u < 0.7 ? tierCol[1] : tierCol[2]) }));
  [adf, eh].forEach((p) => flowsBy.ingest.push(new Flow(g, arc(p, V(-8.5, 1, p.z * 0.3), 3), 0x50e6ff, { count: 14, speed: 0.35 })));

  // ── Serve + Insights
  const ins = tag('insights', new THREE.Group()); g.add(ins);
  const fab = add(ins, box(3.2, 5, 3.2), mat(0x117865, { glow: 0.7 }), 17, 2.5, 0);
  ctx.label(ins, 'Fabric / Synapse SQL', [17, 6.2, 0], { cls: 'chip azure', info: { title: 'Serving layer', text: 'Fabric / Synapse SQL endpoints serve Gold data to BI tools and apps.' } });
  ctx.pick(fab, { title: 'Serving layer', text: 'Fabric / Synapse SQL endpoints serve Gold data to BI tools and apps.' });
  const pbi = new THREE.Group(); pbi.position.set(29, 0, -6); ins.add(pbi);
  const pbiBars = [2.2, 3.6, 5].map((h, i) => add(pbi, box(1, h, 1), mat(0xf2c811, { glow: 0.8 }), (i - 1) * 1.3, h / 2, 0));
  ctx.label(pbi, 'Power BI', [0, 6.6, 0], { cls: 'chip azure', info: { title: 'Power BI', text: 'Dashboards for Sales, SRM, Finance (GTN) and Supply.' } });
  const ml = add(ins, new THREE.IcosahedronGeometry(1.6, 1), mat(0x8661c5, { glow: 0.9 }), 31, 3, 3);
  ctx.label(ins, 'Azure ML', [31, 5.4, 3], { cls: 'chip azure', info: { title: 'Azure Machine Learning', text: 'Demand forecasting, promo-uplift and price-elasticity models.' } });
  ctx.pick(ml, { title: 'Azure Machine Learning', text: 'Demand forecasting, promo-uplift and price-elasticity models.' });
  const dp = new THREE.Group(); dp.position.set(29, 0, 10); ins.add(dp);
  [0xff8a3d, 0xa970ff, 0x3ddc84, 0x3fa9ff, 0xffe14d, 0xff4f81].forEach((c, i) => add(dp, box(0.9, 0.9, 0.9), mat(c, { glow: 0.7 }), (i % 3 - 1) * 1.1, 0.5 + Math.floor(i / 3) * 1.1, 0));
  ctx.label(dp, 'Data products → DNA', [0, 3.2, 0], { cls: 'chip azure', goto: 'migration' });
  const gold = V(5, 7.8, 0);
  [[gold, V(17, 4, 0)], [V(17, 4, 0), V(29, 5, -6)], [V(17, 4, 0), V(31, 3, 3)], [V(17, 4, 0), V(29, 1.5, 10)]].forEach(([a, b]) => {
    const c = arc(a, b, 2.5);
    tube(ins, c, 0xf5c542, { r: 0.05, opacity: 0.25 });
    flowsBy.insights.push(new Flow(g, c, 0xffd23f, { count: 12, speed: 0.35 }));
  });
  [['📈 Demand forecast', [23, 9.5, -2]], ['💰 Promo ROI', [33, 9.5, -8]], ['🛒 OSA alerts', [37, 7.5, 2]], ['🧾 GTN waterfall', [24, 7.5, 9]], ['🚚 Supply control tower', [36, 4, 12]]]
    .forEach(([txt, p]) => ctx.label(ins, '✓ ' + txt, p, { cls: 'good', focus: 'insights' }));

  // ── Governance dome
  const gov = tag('govern', new THREE.Group()); g.add(gov);
  const domeM = new THREE.MeshBasicMaterial({ color: 0x9b5de5, transparent: true, opacity: 0.03, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending });
  const wireM = new THREE.MeshBasicMaterial({ color: 0xb388ff, wireframe: true, transparent: true, opacity: 0.06 });
  const domeGeo = new THREE.SphereGeometry(27, 48, 20, 0, Math.PI * 2, 0, Math.PI / 2);
  add(gov, domeGeo, domeM, -4, 0, 0);
  add(gov, new THREE.SphereGeometry(27.1, 24, 10, 0, Math.PI * 2, 0, Math.PI / 2), wireM, -4, 0, 0);
  ctx.label(gov, '🛡 Microsoft Purview', [-4, 28.5, 0], { cls: 'chip azure big', focus: 'govern', info: { title: 'Microsoft Purview', text: 'Catalogue, lineage and classification across the estate. It finds PII before it leaks.' } });
  const kv = new THREE.Group(); kv.position.set(-14, 0, -13); gov.add(kv);
  add(kv, box(1.6, 1.2, 0.8), mat(0xffd166, { glow: 0.8 }), 0, 1, 0);
  add(kv, new THREE.TorusGeometry(0.5, 0.15, 8, 20), mat(0xffd166, { glow: 0.8 }), 0, 2.1, 0);
  ctx.label(kv, 'Key Vault', [0, 3.3, 0], { cls: 'chip azure', focus: 'govern', info: { title: 'Azure Key Vault', text: 'Secrets, keys and connection strings. Never in code.' } });
  const en = new THREE.Group(); en.position.set(8, 0, -14); gov.add(en);
  add(en, new THREE.ConeGeometry(1, 2.2, 5), mat(0x4cc2ff, { glow: 0.8 }), 0, 1.3, 0).rotation.x = Math.PI;
  ctx.label(en, 'Entra ID', [0, 3.3, 0], { cls: 'chip azure', focus: 'govern', info: { title: 'Microsoft Entra ID', text: 'Identity: access granted to groups, not individuals.' } });
  [['Catalog & lineage', [-24, 15, 6]], ['PII classified & masked', [12, 20, 8]], ['Secrets never in code', [-14, 5.5, -13]], ['Access by groups', [8, 5.5, -14]], ['IaC + CI/CD (DevOps)', [-4, 24, 10]]]
    .forEach(([txt, p]) => ctx.label(gov, txt, p, { cls: 'mini', focus: 'govern' }));

  // Base emissive intensities for focus dimming
  const base = new Map();
  g.traverse((o) => { if (o.isMesh && o.material.emissiveIntensity !== undefined && !base.has(o.material)) base.set(o.material, o.material.emissiveIntensity); });
  let focus = null;

  return {
    group: g,
    setFocus(f) {
      focus = f;
      for (const key of Object.keys(groups)) {
        const on = !f || f === key || f === 'all';
        groups[key].forEach((grp) => grp.traverse((o) => {
          if (o.isMesh && base.has(o.material)) o.material.emissiveIntensity = base.get(o.material) * (on ? 1.25 : 0.3);
        }));
        flowsBy[key].forEach((fl) => { fl.factor = on ? 1 : 0.25; });
      }
      domeM.opacity = f === 'govern' ? 0.1 : f ? 0.012 : 0.03;
      wireM.opacity = f === 'govern' ? 0.28 : f ? 0.02 : 0.08;
    },
    update(t) {
      Object.values(flowsBy).forEach((arr) => arr.forEach((fl) => fl.update(t)));
      adfM.rotation.y = t * 0.6;
      ehRing.rotation.x = t * 1.2; ehRing.rotation.y = t * 0.7;
      dbx.rotation.y = t * 1.2; dbx.position.y = 11.2 + Math.sin(t * 1.5) * 0.3;
      tierM.forEach((m, i) => { m.rotation.y = t * (0.1 + i * 0.05); });
      pbiBars.forEach((b, i) => { const h = [2.2, 3.6, 5][i] * (0.85 + 0.15 * Math.sin(t * 1.4 + i)); b.scale.y = h / [2.2, 3.6, 5][i]; b.position.y = h / 2; });
      ml.rotation.set(t * 0.4, t * 0.6, 0);
      if (focus === 'govern') wireM.opacity = 0.22 + Math.sin(t * 2) * 0.06;
    },
  };
}
