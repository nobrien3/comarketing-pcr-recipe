# Afterpay Co-Marketing PCR Recipe

Generates a fully populated, interactive Post Campaign Report (PCR) website
for any Afterpay co-marketing campaign — end to end. Runs all Snowflake queries,
builds the site, and deploys to Blockcell automatically.

**Repo:** `nobrien3/comarketing-pcr-recipe`

---

## Quickstart for colleagues

### 1. Point Goose at this repo (one-time setup)
```sh
goose configure
# → goose settings
# → goose recipe github repo
# → nobrien3/comarketing-pcr-recipe
```

> You'll also need the `gh` CLI installed and authenticated:
> ```sh
> brew install gh
> gh auth login
> ```

### 2. Run the recipe
```sh
goose run --recipe pcr-generator
```

Goose will prompt you for the campaign details, run all Snowflake queries,
build the site, and deploy it to Blockcell. Done.

---

## What you'll be asked for

| Parameter | Example |
|---|---|
| `merchant_name` | `Cotton On` |
| `campaign_name` | `End of Financial Year Sale` |
| `campaign_short` | `EOFY June 2026` |
| `start_date` | `2026-06-01` |
| `end_date` | `2026-06-07` |
| `baseline_start` | 6 weeks before start: `2026-04-20` |
| `baseline_end` | Day before campaign: `2026-05-31` |
| `comp2_label` | Previous equivalent campaign: `EOFY Jun 25` |
| `comp2_start` / `comp2_end` | Dates of that campaign |
| `comp3_label` | Another historical campaign |
| `comp3_start` / `comp3_end` | Dates of that campaign |
| `site_name` | Blockcell slug: `cotton-on-eofy-jun26` |
| `market` | `Australia` (default) |
| `loyalty_program` | e.g. `Linen Lovers Program` — leave blank if none |

---

## What the recipe does

```
You provide campaign details
        ↓
Goose runs 6 Snowflake queries
        ↓
Goose computes % changes, formats all numbers
        ↓
Goose writes a populated campaign_data.js
        ↓
Goose deploys to Blockcell
        ↓
Live PCR site at https://blockcell.sqprod.co/sites/{site_name}/
```

Total time: ~5 minutes.

---

## File structure

```
comarketing-pcr-recipe/
├── README.md                          ← This file
└── pcr-generator/
    ├── recipe.yaml                    ← Goose recipe (entry point)
    ├── campaign_data.js               ← Template data file (populated by recipe)
    ├── index.html                     ← Site shell — do not edit
    ├── charts.js                      ← Chart rendering — do not edit
    ├── styles.css                     ← Afterpay brand styles — do not edit
    └── queries.sql                    ← Reference SQL queries
```

---

## Manual mode (Option 1 — config-driven)

If you'd rather fill in the data yourself instead of running the full recipe:

1. Copy the `pcr-generator/` folder locally
2. Edit `campaign_data.js` with your campaign values (all sections documented inline)
3. Ask Goose: *"Deploy this folder to Blockcell as [site-name]"*

---

## Making changes

Any updates pushed to `main` are immediately available to all colleagues —
no redistribution needed. To update:

```sh
git add .
git commit -m "describe your change"
git push
```
