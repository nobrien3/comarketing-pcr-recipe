// =============================================================================
// CAMPAIGN DATA — Edit this file for each new campaign
// =============================================================================
// HOW TO USE:
//   1. Run the Snowflake queries in queries.sql with your merchant name & dates
//   2. Fill in every value below with the results
//   3. Deploy the folder to Blockcell:
//      blockcell upload --site <merchant>-<campaign>-<month><year> .
// =============================================================================

var CAMPAIGN = {

  // ---------------------------------------------------------------------------
  // 1. IDENTITY
  // ---------------------------------------------------------------------------
  merchant:       "Adairs",
  partner:        "Afterpay",
  campaign_name:  "Love Your Linen Event",
  campaign_short: "LLE March 2026",
  site_name:      "adairs-lle-mar26",

  period_label:   "11 – 15 March 2026",
  period_days:    "5 Days",
  market:         "Australia",
  report_date:    "18 March 2026",

  // Optional: name of a loyalty/membership program
  // Set to null if the merchant has no loyalty program
  loyalty_program: "Linen Lovers Program",

  // ---------------------------------------------------------------------------
  // 2. HEADLINE KPIs
  // ---------------------------------------------------------------------------
  kpis: {
    gpv:               "$2.21M",
    active_customers:  "9,548",
    aov:               "$191.52",
    transactions:      "11,563",
    new_to_merchant:   "1,721",
    ntm_pct:           "18%",
    ntm_vs_baseline:   "+229%",
    ntm_baseline_val:  "523",
    nac:               "20",
    nac_pct:           "0.2%",
    existing:          "9,714",
    existing_pct:      "99.8%",
    top_age_group:     "35+",
    top_age_pct:       "64%",
    top_cohort:        "Power User",
    top_cohort_pct:    "66%"
  },

  // ---------------------------------------------------------------------------
  // 3. COMPARISON PERIODS
  // Labels and values for the 3 comparison bars shown in KPI cards + charts
  // comp1 = baseline (always weekly avg), comp2 & comp3 = historical campaigns
  // ---------------------------------------------------------------------------
  comparisons: {
    baseline: {
      label:        "Weekly Baseline",
      gpv:          417268,
      gpv_label:    "$417K",
      customers:    2117,
      aov:          "$162",
      transactions: 2576
    },
    comp2: {
      label:        "LLE Mar 25",
      gpv:          2108705,
      gpv_label:    "$2.11M",
      customers:    9368,
      aov:          "$196",
      transactions: 10772
    },
    comp3: {
      label:        "LLE Oct 25",
      gpv:          2465219,
      gpv_label:    "$2.47M",
      customers:    11934,
      aov:          "$175",
      transactions: 14126
    }
  },

  // KPI badge text — generated from comparisons above
  // Format: { up/down/neutral, label }
  kpi_badges: {
    gpv: [
      { dir:"up",   text:"▲ 429%", label:"vs Weekly Baseline" },
      { dir:"up",   text:"▲ 5%",   label:"vs LLE Mar 25 ($2.11M)" },
      { dir:"down", text:"▼ 10%",  label:"vs LLE Oct 25 ($2.47M)" }
    ],
    customers: [
      { dir:"up",   text:"▲ 351%", label:"vs Weekly Baseline" },
      { dir:"up",   text:"▲ 2%",   label:"vs LLE Mar 25 (9,368)" },
      { dir:"down", text:"▼ 20%",  label:"vs LLE Oct 25 (11,934)" }
    ],
    aov: [
      { dir:"up",   text:"▲ 18%", label:"vs Weekly Baseline ($162)" },
      { dir:"down", text:"▼ 2%",  label:"vs LLE Mar 25 ($196)" },
      { dir:"up",   text:"▲ 10%", label:"vs LLE Oct 25 ($175)" }
    ],
    transactions: [
      { dir:"up",   text:"▲ 349%", label:"vs Weekly Baseline" },
      { dir:"up",   text:"▲ 7%",   label:"vs LLE Mar 25 (10,772)" },
      { dir:"down", text:"▼ 18%",  label:"vs LLE Oct 25 (14,126)" }
    ]
  },

  // ---------------------------------------------------------------------------
  // 4. DAILY PERFORMANCE
  // One entry per campaign day — add/remove days as needed
  // ---------------------------------------------------------------------------
  daily: [
    { label:"Tue 11 Mar", label_short:"Tue 11", online:411744, instore:31317,  customers:1983, transactions:2164, aov:204.74 },
    { label:"Wed 12 Mar", label_short:"Wed 12", online:297045, instore:172946, customers:2213, transactions:2397, aov:196.07 },
    { label:"Thu 13 Mar", label_short:"Thu 13", online:193668, instore:125281, customers:1620, transactions:1740, aov:183.30 },
    { label:"Fri 14 Mar", label_short:"Fri 14", online:195841, instore:144928, customers:1753, transactions:1892, aov:180.11 },
    { label:"Sat 15 Mar", label_short:"Sat 15", online:474364, instore:158671, customers:3067, transactions:3370, aov:187.84 }
  ],

  // ---------------------------------------------------------------------------
  // 5. CHANNEL SPLIT
  // ---------------------------------------------------------------------------
  channel: {
    online: {
      gpv:          "$1.57M",
      share_pct:    71.3,
      transactions: "8,358",
      customers:    "7,274",
      aov:          "$188.16"
    },
    instore: {
      gpv:          "$633.1K",
      share_pct:    28.7,
      transactions: "3,205",
      customers:    "2,812",
      aov:          "$197.55"
    }
  },

  // ---------------------------------------------------------------------------
  // 6. PRODUCTS
  // top_by_units and top_by_gpv: max 5 items each
  // loyalty_tile: set to null if no loyalty program
  // ---------------------------------------------------------------------------
  products: {
    loyalty_tile: {
      new_members:      739,
      renewals:         410,
      total:            1149,
      total_gpv:        "$244.1K",
      new_gpv:          "$153.8K",
      renewal_gpv:      "$90.3K"
    },
    top_by_units: [
      { name:"Stonewashed Cotton Chocolate Pillowcases", variant:"Standard Pair",       units:406, orders:383 },
      { name:"Dream Catcher Sleep Spray",                variant:"125ml",               units:165, orders:148 },
      { name:"Cotton Pillow Protectors Twin Pack",       variant:"Standard",            units:143, orders:101 },
      { name:"For Kids Pure Laundry Liquid Detergent",   variant:"1L",                  units:135, orders:64  },
      { name:"Flinders Chocolate Towel Range",           variant:"Bath Towel",          units:120, orders:47  }
    ],
    top_by_gpv: [
      { name:"Stonewashed Cotton Chocolate Pillowcases",                    variant:"Standard Pair",    gpv:"$113.8K", aov:"$297" },
      { name:"Stonewashed Cotton Chocolate Quilt Cover",                    variant:"King",             gpv:"$31.3K",  aov:"$292" },
      { name:"Dream Catcher Sleep Spray",                                   variant:"125ml",            gpv:"$30.8K",  aov:"$208" },
      { name:"Stonewashed Cotton Chocolate Sheet",                          variant:"Queen Fitted",     gpv:"$29.1K",  aov:"$267" },
      { name:"Stonewashed Cotton Coconut & Chocolate Stripe Pillowcases",   variant:"Standard Pair",    gpv:"$28.5K",  aov:"$275" }
    ]
  },

  // ---------------------------------------------------------------------------
  // 7. SHOPPING SEGMENTS (top 5)
  // rank_shift: baseline_rank, campaign_rank, change label, change_dir
  // ---------------------------------------------------------------------------
  segments: {
    baseline_label: "28 Jan – 10 Mar 2026",
    top5: [
      {
        rank_label: "🥇 #1 Segment", name: "Stylish Homemakers",
        customers: 2527, gpv: "$607.7K", aov_campaign: 199, aov_baseline: 170,
        baseline_customers: 583,   baseline_gpv: 125986,
        campaign_customers: 2527,  campaign_gpv:  607716,
        baseline_aov: 169.5,       campaign_aov:  199.1,
        baseline_rank: "🥇 #1", campaign_rank: "🥇 #1",
        rank_change: "→ Held", rank_dir: "neutral"
      },
      {
        rank_label: "🥈 #2 Segment", name: "Sophisticated Style",
        customers: 2036, gpv: "$506.8K", aov_campaign: 208, aov_baseline: 176,
        baseline_customers: 322,   baseline_gpv: 68837,
        campaign_customers: 2036,  campaign_gpv:  506810,
        baseline_aov: 176.4,       campaign_aov:  208.1,
        baseline_rank: "#3", campaign_rank: "🥈 #2",
        rank_change: "▲ +1", rank_dir: "up"
      },
      {
        rank_label: "🥉 #3 Segment", name: "Value Seekers",
        customers: 1952, gpv: "$399.0K", aov_campaign: 171, aov_baseline: 148,
        baseline_customers: 477,   baseline_gpv: 85182,
        campaign_customers: 1952,  campaign_gpv:  398965,
        baseline_aov: 147.7,       campaign_aov:  171.4,
        baseline_rank: "🥈 #2", campaign_rank: "#3",
        rank_change: "▼ -1", rank_dir: "down"
      },
      {
        rank_label: "#4 Segment", name: "Family Explorers",
        customers: 909, gpv: "$176.9K", aov_campaign: 163, aov_baseline: 139,
        baseline_customers: 211,   baseline_gpv: 34728,
        campaign_customers: 909,   campaign_gpv:  176864,
        baseline_aov: 139.2,       campaign_aov:  163.3,
        baseline_rank: "#4", campaign_rank: "#4",
        rank_change: "→ Held", rank_dir: "neutral"
      },
      {
        rank_label: "#5 Segment", name: "Sporty & Stylish",
        customers: 548, gpv: "$129.3K", aov_campaign: 213, aov_baseline: 186,
        baseline_customers: 96,    baseline_gpv: 19847,
        campaign_customers: 548,   campaign_gpv:  129262,
        baseline_aov: 186.4,       campaign_aov:  213.3,
        baseline_rank: "#6", campaign_rank: "#5",
        rank_change: "▲ +1", rank_dir: "up"
      }
    ],
    // Extra rows for rank shift table only (beyond top 5)
    rank_shift_extras: [
      {
        name: "Luxe Lovers",
        baseline_rank: "#5", campaign_rank: "#6",
        rank_change: "▼ -1", rank_dir: "down",
        campaign_customers: 504, campaign_aov: 186,
        aov_vs_baseline_text: "▲ 16%", aov_vs_baseline_dir: "up"
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // 8. CUSTOMER DEMOGRAPHICS
  // ---------------------------------------------------------------------------
  customers: {
    age_groups: [
      { label:"18-21", count:69   },
      { label:"22-24", count:256  },
      { label:"25-29", count:1066 },
      { label:"30-35", count:2108 },
      { label:"35+",   count:6235 }
    ],
    generations: [
      { label:"Gen Y Millennial", gpv:1065863 },
      { label:"Gen X",            gpv:550739  },
      { label:"Gen Z",            gpv:447356  },
      { label:"Baby Boomer",      gpv:141606  },
      { label:"Other",            gpv:2240    }
    ],
    cohorts: [
      { label:"Power User",    count:6564 },
      { label:"Habituated",    count:1841 },
      { label:"Occasional",    count:1284 },
      { label:"New Onboarder", count:34   }
    ]
  },

  // ---------------------------------------------------------------------------
  // 9. INSIGHTS (Key Learnings section)
  // icon: any emoji
  // ---------------------------------------------------------------------------
  insights: [
    {
      icon: "🚀",
      title: "Exceptional Sales Uplift",
      text: "The LLE drove a <strong>429% GPV uplift</strong> vs weekly baseline — generating $2.21M in 5 days compared to a typical weekly average of $417K."
    },
    {
      icon: "📱",
      title: "Strong Omnichannel Mix",
      text: "Online led with <strong>71.3% of GPV</strong> ($1.57M), while In-store delivered a significant <strong>28.7% share</strong> ($633K) — a healthy omnichannel split reflecting Adairs' strong physical retail presence."
    },
    {
      icon: "👥",
      title: "Loyal Customer Base",
      text: "99.8% of campaign shoppers were <strong>existing Afterpay customers</strong>, with 66% classified as Power Users — confirming the LLE drives retention."
    },
    {
      icon: "📈",
      title: "Strong YoY Growth",
      text: "GPV grew <strong>40% year-on-year</strong> ($1.58M → $2.21M), with transactions up 45% and active customers up 40%."
    },
    {
      icon: "💰",
      title: "AOV Dynamics",
      text: "Campaign AOV of $191.52 was <strong>18% above baseline</strong> ($162). The slight 2% dip vs LLE Mar 25 ($196) may reflect broader basket size trends."
    },
    {
      icon: "🎯",
      title: "Peak Day: 15 March",
      text: "Saturday 15 March was the <strong>biggest day</strong> with $633K GPV and 3,370 transactions — 2× the next best day."
    }
  ],

  // ---------------------------------------------------------------------------
  // 10. RECOMMENDATIONS
  // ---------------------------------------------------------------------------
  recommendations: [
    {
      number: 1,
      title: "Extend Campaign to 7 Days",
      text: "The strong Saturday peak suggests extending the next LLE to a Wed–Sun format could unlock an additional 30–40% GPV."
    },
    {
      number: 2,
      title: "New Customer Acquisition",
      text: "With only 20 NACs (0.2%), pair the next event with a targeted prospecting campaign via Afterpay's Shop Directory."
    },
    {
      number: 3,
      title: "In-store Activation",
      text: "Explore in-store POS signage, staff training on Afterpay, and exclusive in-store LLE offers to drive physical foot traffic."
    },
    {
      number: 4,
      title: "Protect & Grow AOV",
      text: "Consider a minimum spend threshold (e.g. $200+) to unlock an exclusive offer and protect basket size."
    },
    {
      number: 5,
      title: "Leverage Gen Y & Gen X",
      text: "Tailor creative and CRM messaging to Millennials and Gen X with home décor content, and explore Gen Z growth via social."
    },
    {
      number: 6,
      title: "Spring LLE — September 2026",
      text: "Plan a Spring LLE in September 2026 with extended duration, in-store activation, and a NAC acquisition overlay."
    }
  ]

};
// =============================================================================
// END OF CAMPAIGN DATA
// =============================================================================
