# Afterpay PCR Template

A config-driven Post Campaign Report website.
All campaign data lives in **campaign_data.js** — the HTML and charts never need editing.

---

## How to create a new PCR

### Step 1 — Run the Snowflake queries
Open `queries.sql` and run each query with your merchant name and campaign dates.
Copy the results into `campaign_data.js`.

### Step 2 — Fill in campaign_data.js
Edit every value in `campaign_data.js`. The sections are:
| Section | What to fill in |
|---|---|
| 1. IDENTITY | Merchant, campaign name, dates, market |
| 2. HEADLINE KPIs | GPV, customers, AOV, transactions, NTM |
| 3. COMPARISONS | Baseline + 2 historical campaigns |
| 4. DAILY | One row per campaign day |
| 5. CHANNEL | Online vs in-store split |
| 6. PRODUCTS | Top 5 by units, top 5 by GPV, loyalty tile |
| 7. SEGMENTS | Top 5 shopping segments + rank shift |
| 8. CUSTOMERS | Age groups, generations, cohorts |
| 9. INSIGHTS | Key learnings (free text) |
| 10. RECOMMENDATIONS | Strategic actions (free text) |

> **Tip:** If the merchant has no loyalty program, set `loyalty_program: null`
> and `products.loyalty_tile: null` — the tile will be hidden automatically.

### Step 3 — Deploy to Blockcell
```bash
# From inside the pcr_template folder (or your copy of it):
# Upload via Goose / Blockcell tool with site name matching your campaign
# e.g. cotton-on-eofy-jun26
```
Or ask Goose: *"Deploy the pcr_template folder to Blockcell as [site-name]"*

---

## File structure
```
pcr_template/
├── campaign_data.js   ← EDIT THIS for every new campaign
├── index.html         ← Shell — do not edit
├── charts.js          ← Reads from campaign_data.js — do not edit
├── styles.css         ← Afterpay brand styles — do not edit
├── queries.sql        ← Snowflake queries to run for each campaign
└── README.md          ← This file
```

---

## Adding/removing campaign days
In `campaign_data.js`, the `daily` array drives all daily charts.
Add or remove objects to match the actual campaign length:
```js
daily: [
  { label:"Mon 1 Jun", label_short:"Mon 1", online:300000, instore:50000,
    customers:1500, transactions:1600, aov:210.00 },
  // ... one per day
]
```

## Changing comparison periods
Update the `comparisons` object and `kpi_badges` text to match your historical campaigns.
The period chart will automatically use whatever labels and values you set.
