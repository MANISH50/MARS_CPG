# Mars × Azure: 3D data walkthrough

An interactive 3D story that explains, in minutes:

1. **Who Mars is.** Family-owned since 1911, a $65B+ business with 170k+ Associates, three segments (Petcare · Snacking · Food & Nutrition).
2. **What data problems a CPG faces.** Silos and the six business data streams: **Sell-In, Distributor, EPOS, E-Com, Sell-Out, SRM**, plus **Gross-to-Net (GTN)**.
3. **How Azure data engineering solves them.** Ingest (ADF / Event Hubs) → Medallion lakehouse (ADLS + Databricks) → Governance (Purview, Unity Catalog, Key Vault, Entra ID) → Insights (Fabric / Power BI / Azure ML).
4. **The AOH ➜ DNA migration.** From a legacy analytics platform to domain-based data products.

Every problem chapter has a **⚡ Fix with Azure** button: the 3D scene first shows the problem, then rebuilds itself into the solution.

## Use it

| Action | How |
|---|---|
| Next / previous chapter | `→` / `←`, or the buttons |
| Problem ↔ solution | `Space`, or **⚡ Fix with Azure** |
| Interview presenter notes | `P`, or **🎤 Interview** ("say it in 30s", likely question, model answer, STAR story) |
| Chapter menu | `M`, or **☰** |
| Auto-play | `A` |
| Fullscreen | `F` |
| Jump to chapter | `1`–`9`, `0` = explore |
| Deep link | `index.html#gtn`, `#migration`, `#sellOut` … |

Drag to orbit, scroll or pinch to zoom, and tap anything glowing for a one-line explanation.

## Run locally

It is a static site with no build step: plain HTML + ES modules, with Three.js 0.160 loaded from jsDelivr.

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

## Host on GitHub Pages

Repo **Settings → Pages → Build and deployment → Deploy from a branch** → choose the branch and `/ (root)` → Save.
The site will be served at `https://<owner>.github.io/<repo>/`.

## Project layout

```
index.html              UI shell + import map
css/style.css           theme, labels, responsive layout
js/main.js              renderer, chapter controller, camera flights, picking, interview mode
js/data/content.js      ALL text: chapters, stream problems/fixes/KPIs, interview notes  ← edit here
js/utils/factory.js     3D building blocks (materials, platforms, particle flows, labels)
js/scenes/              one module per 3D zone
  world.js              Mars globe + segment islands
  silos.js              disconnected silos → Azure hub
  journey.js            "follow the candy bar" value chain + data streams
  streams/*.js          Sell-In, Distributor, EPOS, E-Com, Sell-Out, SRM mini-scenes
  gtn.js                Gross-to-Net revenue staircase
  azure.js              reference Azure platform
  migration.js          AOH ➜ DNA bridge
```

To add a chapter, add an entry to `CHAPTERS` in `js/data/content.js`, pointing at an existing zone with a camera position, or add a new zone module and register it in `ZONES` in `js/main.js`.

## Roadmap (next iterations)

- Deep-dive scenes per layer: ADF pipeline anatomy, Databricks medallion + Delta / Unity Catalog, streaming IoT path, Purview lineage, Power BI semantic model.
- MLOps for demand forecasting, CI/CD and cost view.
- A quiz mode per chapter.

## Sources and caveats

- Mars & Microsoft partnership (2021): <https://www.mars.com/news-and-stories/press-releases/mars-and-microsoft-work-together-to-accelerate-digital-transformation>
- Mars completes acquisition of Kellanova (Dec 2025): <https://www.streetinsider.com/Business+Wire/Mars+Completes+Acquisition+of+Kellanova/25727089.html>
- Mars Petcare on Azure Databricks: <https://www.databricks.com/customers/mars-petcare>
- Mars SRM (Strategic Revenue Management) roles: <https://fairygodboss.com/jobs/mars-incorporated/srm-pricing-and-ppa-data-analytics-lead-9baa8c57d6f37ede0f0bcc834f4d9600>
- Sell-in vs sell-through definitions: <https://blog.massistcrm.com/sell-in-vs-sell-through-data>
- Gross-to-Net / trade spend background: <https://niblin.com/blog/trade-spend-gross-to-net>, <https://www.spscommerce.com/community/articles/understanding-net-sales-leakage>
- AOH ➜ DNA: the only public trace found is a Q&A page restating an engagement brief: <https://www.classace.io/answers/improve-this-writing-mars-is-on-a-mission-to-migrate-from-the-aoh-platform-to-dna-the-current-approach-mars-following-is-very-labor-intensive-and-engage-a-number-of-developers-to-migrate-things-around>. No public source spells out either acronym, so check the details with your team.

The Azure architecture shown is a **reference pattern** for a Mars-style CPG, built from public information. It is not Mars' confidential design, and GTN numbers are illustrative.
This is an independent learning aid, not affiliated with or endorsed by Mars, Incorporated.
