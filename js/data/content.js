// All story text lives here so it can be edited without touching 3D code.

export const STREAMS = {
  sellIn: {
    name: 'Sell-In', color: 0xff8a3d, hex: '#ff8a3d',
    short: 'What Mars ships & bills to customers',
    problem: "Several SAP systems report different shipment numbers, so they don't tie up.",
    fix: 'ADF SAP CDC → Bronze → conformed customer & product masters (Silver) → one Gold shipments fact.',
    kpi: 'One shipment truth · faster month-end close',
    problemTag: "Numbers don't tie up", solvedTag: 'One shipment truth',
    tools: ['ADF · SAP CDC', 'Databricks · Silver', 'Gold · Shipments'],
  },
  distributor: {
    name: 'Distributor', color: 0xa970ff, hex: '#a970ff',
    short: 'Secondary sales & stock held by distributors',
    problem: "Hundreds of distributors send files in different formats, late or not at all, so Mars can't see channel stock.",
    fix: 'Landing zone + Auto Loader, metadata-driven mapping, a data-quality gate and late-file alerts.',
    kpi: 'Channel stock visible · % files on time',
    problemTag: 'Messy, late, missing files', solvedTag: 'Clean · on time · alerted',
    tools: ['Auto Loader', 'DQ rules · Delta', 'Logic Apps alerts'],
  },
  epos: {
    name: 'EPOS', color: 0x3ddc84, hex: '#3ddc84',
    short: 'Till scans from retailer stores',
    problem: 'Every retailer has its own item codes and calendar, so stock-outs stay hidden.',
    fix: 'Map retailer item → GTIN → Mars SKU, align calendars, build store-week Gold tables.',
    kpi: 'On-shelf availability · out-of-stock alerts',
    problemTag: "Codes don't match · empty shelves unseen", solvedTag: 'Matched · empty shelves flagged',
    tools: ['GTIN mapping', 'Calendar alignment', 'Store-week Gold'],
  },
  ecom: {
    name: 'E-Com', color: 0x3fa9ff, hex: '#3fa9ff',
    short: 'Online orders & the digital shelf',
    problem: "Online sales are spread across marketplaces and retailer sites, with no single digital-shelf view.",
    fix: 'API ingestion (ADF / Functions) → raw JSON → flattened Silver → one e-com Gold model.',
    kpi: 'Share of search · online sales growth',
    problemTag: 'Every channel, its own number', solvedTag: 'One digital shelf',
    tools: ['ADF / Functions · APIs', 'JSON → Delta', 'E-com Gold'],
  },
  sellOut: {
    name: 'Sell-Out', color: 0xffe14d, hex: '#ffe14d',
    short: 'What shoppers actually buy (true demand)',
    problem: 'Shipments ≠ shopper demand, which leads to overstock, waste or stock-outs.',
    fix: 'Combine EPOS + Distributor + E-Com into one Sell-Out Gold table, then forecast with Azure ML.',
    kpi: 'Forecast accuracy · weeks of stock',
    problemTag: 'Shipping more than shoppers buy', solvedTag: 'Plan on real demand',
    tools: ['Sell-Out Gold', 'Azure ML forecast', 'Power BI'],
  },
  srm: {
    name: 'SRM', color: 0xff4f81, hex: '#ff4f81',
    short: 'Strategic Revenue Management: price, promo, terms, mix',
    problem: "Trade spend is huge, but nobody knows which promotions pay back.",
    fix: 'Join TPM spend + sell-out uplift + net price + cost into an SRM data product, then add ROI & elasticity models.',
    kpi: 'Promo ROI · net revenue · margin',
    problemTag: 'Money falls through the cracks', solvedTag: 'Spend only where it pays back',
    tools: ['TPM + Sell-Out', 'Databricks ML', 'Power BI'],
  },
  gtn: {
    name: 'Gross-to-Net', color: 0xf59e0b, hex: '#f59e0b',
    short: 'From list price to real revenue',
    problem: 'Discounts, promos, rebates and deductions sit in different systems, so net revenue arrives late and leaks.',
    fix: 'SAP pricing + TPM + claims + contracts → a GTN data product (customer × SKU × month), accrual vs actual.',
    kpi: 'GTN % · accrual accuracy · open deductions',
    problemTag: 'Foggy · late · leaking', solvedTag: 'Every step visible, early',
    tools: ['ADF', 'GTN data product', 'Purview lineage', 'Power BI waterfall'],
  },
};

export const SECTIONS = {
  business: 'The business',
  streams: 'Data streams',
  platform: 'Azure platform',
  migration: 'Migration',
  explore: 'Explore',
};

// cam / target are relative to the zone origin (absolute for overview).
export const CHAPTERS = [
  { id: 'mars', section: 'business', zone: 'world', focus: 'mars', cam: [0, 11, 31], target: [0, 8, 0],
    title: 'Meet Mars', caption: 'Family-owned since 1911. Pet care, snacks and food, sold around the world.' },
  { id: 'segments', section: 'business', zone: 'world', focus: 'segments', cam: [0, 30, 46], target: [0, 6, 0],
    title: 'Three businesses', caption: 'Petcare · Snacking · Food & Nutrition. Tap an island to see its brands.' },
  { id: 'silos', section: 'business', zone: 'silos', fix: true, fixLabel: 'Connect with Azure', cam: [0, 18, 34], target: [0, 3, 0],
    title: 'The data problem', caption: 'Every system speaks its own language, so nobody sees the whole picture.' },
  { id: 'journey', section: 'business', zone: 'journey', cam: [0, 27, 47], target: [0, 5, -2],
    title: 'Follow the candy bar', caption: 'Every hop from factory to shopper creates a data stream. Tap a stream to dive in.' },

  { id: 'sellIn', section: 'streams', zone: 'sellIn', stream: 'sellIn', fix: true, cam: [0, 12.5, 24], target: [0, 2.8, 0] },
  { id: 'distributor', section: 'streams', zone: 'distributor', stream: 'distributor', fix: true, cam: [0, 12.5, 24], target: [0, 2.8, 0] },
  { id: 'epos', section: 'streams', zone: 'epos', stream: 'epos', fix: true, cam: [0, 12, 23], target: [0, 2.8, 0] },
  { id: 'ecom', section: 'streams', zone: 'ecom', stream: 'ecom', fix: true, cam: [0, 12, 23], target: [0, 3.4, 0] },
  { id: 'sellOut', section: 'streams', zone: 'sellOut', stream: 'sellOut', fix: true, cam: [0, 12.5, 24], target: [0, 2.8, 0] },
  { id: 'srm', section: 'streams', zone: 'srm', stream: 'srm', fix: true, cam: [0, 13, 25], target: [0, 3, 0] },
  { id: 'gtn', section: 'streams', zone: 'gtn', stream: 'gtn', fix: true, cam: [0, 15, 34], target: [0, 4, 2],
    note: 'Illustrative numbers. Industry sources put total GTN deductions at roughly 30–40% of gross.' },

  { id: 'ingest', section: 'platform', zone: 'azure', focus: 'ingest', cam: [-31, 14, 27], target: [-30, 2, 0],
    title: 'Azure · Ingest', caption: 'Batch with Data Factory, real-time with Event Hubs. Land everything once.' },
  { id: 'lake', section: 'platform', zone: 'azure', focus: 'lake', cam: [8, 22, 36], target: [0, 5, 0],
    title: 'Azure · Lakehouse', caption: 'Bronze (raw) → Silver (clean) → Gold (business-ready) on ADLS + Databricks.' },
  { id: 'govern', section: 'platform', zone: 'azure', focus: 'govern', cam: [0, 44, 60], target: [0, 4, 0],
    title: 'Azure · Govern', caption: 'Purview, Unity Catalog, Key Vault and Entra ID wrap the data in trust.' },
  { id: 'insights', section: 'platform', zone: 'azure', focus: 'insights', cam: [33, 14, 27], target: [27, 3, 0],
    title: 'Azure · Insights', caption: 'Gold data products feed Power BI, forecasts and SRM decisions.' },

  { id: 'migration', section: 'migration', zone: 'migration', fix: true, fixLabel: 'Accelerate with Azure', cam: [-8, 36, 64], target: [3, 1, 0], camM: [-62, 58, 14],
    title: 'AOH ➜ DNA migration', caption: 'From a legacy platform to domain-based data products, without breaking anything.',
    note: 'Based on limited public information. Check the details with your team.' },

  { id: 'explore', section: 'explore', overview: true, cam: [175, 330, 215], target: [175, 0, -100],
    title: 'Explore freely', caption: 'The whole Mars data story in one view. Tap any area to fly there.' },
];

// Fill stream chapters' title/caption from STREAMS.
for (const ch of CHAPTERS) {
  if (ch.stream) {
    const s = STREAMS[ch.stream];
    ch.title ??= s.name;
    ch.caption ??= s.short + '.';
  }
}

export const INTERVIEW = {
  mars: {
    say: ['Mars is family-owned (since 1911), a $65B+ business with 170k+ Associates.',
      'Three segments: Petcare, Snacking (now including Kellanova) and Food & Nutrition.',
      'Microsoft Azure has been the primary cloud since the 2021 Mars–Microsoft partnership.'],
    q: 'Why does data matter so much to a CPG company like Mars?',
    a: 'Margins are tight, and the retailer, not Mars, owns the till. Shipment, distributor, EPOS and e-com data are how Mars sees real demand, sets prices and spends trade money well.',
  },
  segments: {
    say: ['Each segment has different data: clinics & diagnostics (Petcare) vs retail sell-out (Snacking, Food).',
      'One platform, many domains, which points to data-product thinking.'],
    q: 'How do Petcare data needs differ from Snacking?',
    a: 'Petcare adds clinical, diagnostics and pet-owner data, which is sensitive and full of PII. Snacking is retail-heavy: EPOS, distributors, promotions and impulse channels. Both run on one platform, with each domain owning its data products.',
  },
  silos: {
    say: ['Problem: siloed SAP, distributor files, retailer EPOS, e-com and IoT data.',
      'Symptoms: no single truth, late reports, unknown promo ROI, stock-outs.',
      'Fix: land once in a governed lakehouse, model once, reuse everywhere.'],
    q: "What's the first thing you do when you inherit 30 siloed sources?",
    a: 'Inventory them and rank by business value. Catalogue the sources in Purview, land raw data unchanged in Bronze, agree conformed keys (product, customer, calendar) in Silver, then build Gold tables per use case.',
  },
  journey: {
    say: ['Sell-in = what Mars ships. Sell-out = what shoppers buy.',
      'The gap between them = stock sitting in the channel.',
      'Each hop is a data stream with its own owner, format and latency.'],
    q: 'Sell-in vs sell-out: why does the gap matter?',
    a: 'If you plan on shipments alone you can\'t see channel stock. Sell-in can "grow" while shoppers buy less, and you pay for it later in returns and deep promotions. Sell-out shows true demand.',
  },
  sellIn: {
    say: ['Sell-in = primary sales out of SAP: orders, deliveries, invoices.',
      'Pain: several SAP instances with different units, codes and currencies.',
      'Fix: CDC extract, conformed masters, one reconciled Gold fact.'],
    q: 'Several SAP instances report different numbers. How do you fix it?',
    a: 'Extract with the ADF SAP CDC connector into Bronze. In Silver, conform customer and material masters, units of measure and currency. Then build one Gold shipments fact with automated reconciliation against SAP totals.',
  },
  distributor: {
    say: ['Distributors hold Mars stock and sell on to retailers (secondary sales).',
      'Pain: hundreds of file formats, late or missing files.',
      'Fix: metadata-driven ingestion + a data-quality gate + alerts.'],
    q: 'How do you harmonise 50+ distributor file formats?',
    a: 'Give each distributor a landing zone and use Auto Loader with schema hints. A metadata mapping table converts source columns to the canonical model, Delta/DLT expectations check quality, and Logic Apps sends late-file alerts. Adding a distributor means adding a config row, not new code.',
  },
  epos: {
    say: ['EPOS = retailer till scans: the closest signal to the shopper.',
      'Pain: retailer codes and calendars differ, so stock-outs hide.',
      'Fix: governed item & calendar mapping, store-week Gold, OOS alerts.'],
    q: 'Retailers use their own product codes and calendars. How do you join EPOS to Mars data?',
    a: 'Build a mapping layer: retailer item → GTIN → Mars SKU, and retailer week → Mars calendar. Keep the mapping as a governed reference table and send unmatched items to a data-stewardship queue.',
  },
  ecom: {
    say: ['E-com = marketplaces, retailer.com, quick-commerce, DTC.',
      'Pain: many APIs and schemas, with no single digital-shelf view.',
      'Fix: API ingestion → raw JSON → one e-com Gold model.'],
    q: "What's different about e-commerce data?",
    a: 'There are many APIs, the schemas change fast, and refreshes are daily or intra-day. It mixes sales with digital-shelf data (price, rank, ratings, content). Use API ingestion with retries, keep raw JSON in Bronze and flatten it in Silver.',
  },
  sellOut: {
    say: ['Sell-out = true consumer demand, built from EPOS + distributor + e-com.',
      'Pain: planning on shipments leads to overstock or stock-outs.',
      'Fix: a harmonised Sell-Out Gold table feeding an Azure ML forecast.'],
    q: 'How would you feed a demand forecast?',
    a: 'Build a harmonised sell-out Gold table at SKU × customer/store × week. Add calendar, price and promo features, train in Azure ML or Databricks, and publish the forecast back as its own data product.',
  },
  srm: {
    say: ['SRM = Strategic Revenue Management: Pricing, Trade Promotion, Trade Terms, Mix.',
      'Pain: big trade spend, unclear payback.',
      'Fix: an SRM data product joining spend, uplift, net price and cost.'],
    q: 'What data does SRM need to measure promo ROI?',
    a: 'The promo calendar and spend (TPM), a sell-out baseline vs uplift, GTN net price and cost (COGS), joined at SKU × customer × week. On top of that: post-event evaluation and price-elasticity models.',
  },
  gtn: {
    say: ['GTN = the bridge from gross sales (list price) to net sales.',
      'Leaks: off-invoice, promotions, rebates, trade terms, deductions, returns.',
      'Fix: one governed GTN data product, so Finance and SRM see the same net number early.'],
    q: 'Explain Gross-to-Net to a non-finance person.',
    a: 'List price × volume is gross. Discounts, promotions, rebates, trade terms, retailer deductions and returns come off, and what is left is net. GTN data shows each leak by customer and SKU, and shows accruals vs actuals before month-end surprises.',
  },
  ingest: {
    say: ['Batch (ADF) for ERP, files and most retailer feeds.',
      'Streaming (Event Hubs) only where latency changes a decision.',
      'Land raw once and never transform on the way in.'],
    q: 'Batch or streaming?',
    a: "Batch for anything the business reads daily or weekly. Stream only where speed changes a decision, such as factory IoT or e-com events. Don't stream what people read once a week.",
  },
  lake: {
    say: ['Bronze = raw history, Silver = cleaned & conformed, Gold = business-ready.',
      'Delta Lake gives ACID transactions, schema enforcement and time travel.',
      'Databricks does the heavy transformation.'],
    q: 'Why medallion architecture?',
    a: 'Bronze keeps raw history for replay and audit. Silver is cleaned and conformed once. Gold is shaped for each use case. Clear contracts between the layers make debugging, reuse and ownership easy.',
  },
  govern: {
    say: ['Purview: catalogue, lineage and classification.',
      'Unity Catalog: fine-grained access, masking and lineage in Databricks.',
      'Key Vault for secrets, Entra ID groups for access, IaC + CI/CD for change.'],
    q: 'How do you handle PII and sensitive data?',
    a: 'Classify it with Purview scans and keep PII in restricted schemas. Apply masking and row-level security in Unity Catalog, store secrets in Key Vault, and grant access through Entra ID groups, never to individuals.',
  },
  insights: {
    say: ['Every Gold product has a business owner and a KPI.',
      'Power BI for people, Azure ML for predictions.',
      'Each earlier pain now has a green light.'],
    q: 'How do you prove the platform delivers value?',
    a: 'Tie each Gold product to a KPI owner: forecast accuracy, OSA, promo ROI, GTN %. Track adoption (Power BI usage) and data SLAs (freshness and quality).',
  },
  migration: {
    say: ['AOH = the legacy Azure analytics platform. DNA = the target domain-based data-product platform.',
      'Today: manual, developer-heavy migration with unclear dependencies.',
      'Plan: assess → inventory → dependency map → security & PII → to-be design.'],
    q: 'How would you migrate hundreds of pipelines from AOH to DNA?',
    a: 'Automate the inventory (Purview scans + Unity Catalog lineage) and build the dependency map. Migrate in waves by data product, leaf nodes first, using metadata-driven templates and IaC. Run old and new in parallel and reconcile before cut-over.',
    star: 'S: legacy AOH, manual migration, many developers. T: move to domain-based DNA safely. A: automated inventory + dependency map, waves by data product, IaC + CI/CD, parallel-run reconciliation. R: faster delivery, fewer defects, clear ownership.',
  },
  explore: {
    say: ['Recap: business → data streams → Azure platform → AOH ➜ DNA.',
      'Invite questions on any node.'],
    q: 'What would you do in your first 90 days?',
    a: 'Learn the domains and their data owners, map the AOH inventory and dependencies, then pick one high-value data product (for example Sell-Out) and migrate it end-to-end as the template.',
  },
};
