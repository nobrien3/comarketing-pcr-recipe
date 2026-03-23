// =============================================================================
// CHARTS.JS — reads all data from campaign_data.js (CAMPAIGN object)
// Part 1: DOM population (identity, KPIs, channel cards, products, segments)
// =============================================================================

var MINT      = '#00c07f';
var MINT_LIGHT= '#B2FCE4';
var GOLD      = '#c9a96e';
var NAVY      = '#00193A';
var GRAY      = '#DBDBDB';
var GRAY2     = '#646A6F';

Chart.defaults.font = {family:'DM Sans, Helvetica Neue, Arial, sans-serif', size:12};
Chart.defaults.color = '#646A6F';

function mkChart(id, config) {
  var el = document.getElementById(id);
  if (el) { new Chart(el, config); }
}

// --- helpers -----------------------------------------------------------------
function badge(dir, text) {
  return '<span class="kpi-badge ' + dir + '">' + text + '</span>';
}
function badgeLabel(text) {
  return '<span class="kpi-badge-label">' + text + '</span>';
}
function fmtK(v) { return '$' + (v/1000).toFixed(0) + 'K'; }
function fmtCount(v) { return v.toLocaleString(); }

function barOpts(stacked) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position:'top' } },
    scales: {
      x: { stacked: !!stacked, grid: { display:false } },
      y: { stacked: !!stacked,
           ticks: { callback: function(v){ return '$'+(v/1000).toFixed(0)+'K'; } },
           grid: { color:'#f0f0f0' } }
    }
  };
}

function countOpts() {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position:'top' } },
    scales: {
      x: { grid: { display:false } },
      y: { ticks: { callback: function(v){ return v.toLocaleString(); } },
           grid: { color:'#f0f0f0' } }
    }
  };
}

// --- 1. Identity -------------------------------------------------------------
document.getElementById('page-title').textContent =
  CAMPAIGN.merchant + ' x ' + CAMPAIGN.partner + ' | ' + CAMPAIGN.campaign_short + ' PCR';
document.getElementById('nav-partner').textContent  = CAMPAIGN.partner;
document.getElementById('nav-merchant').textContent = CAMPAIGN.merchant;

var heroTitle = document.getElementById('hero-title');
heroTitle.innerHTML = CAMPAIGN.merchant + ' \u00d7 <span>' + CAMPAIGN.partner + '</span><br>' + CAMPAIGN.campaign_short;

document.getElementById('hero-sub').textContent =
  CAMPAIGN.campaign_name + ' \u2014 Campaign Performance Analysis';
document.getElementById('meta-period').textContent    = CAMPAIGN.period_label;
document.getElementById('meta-days').textContent      = CAMPAIGN.period_days;
document.getElementById('meta-market').textContent    = CAMPAIGN.market;
document.getElementById('meta-report-date').textContent = CAMPAIGN.report_date;

document.getElementById('summary-desc').textContent =
  'Key performance metrics for the ' + CAMPAIGN.merchant + ' ' + CAMPAIGN.campaign_name +
  ' vs. 6-week weekly average baseline and prior campaigns.';
document.getElementById('perf-desc').textContent =
  'Day-by-day breakdown across the ' + CAMPAIGN.period_days.toLowerCase() +
  ' campaign window (' + CAMPAIGN.period_label + ').';

var hasComp3 = CAMPAIGN.comparisons.comp3 != null;
var compLabels = [
  CAMPAIGN.comparisons.baseline.label,
  CAMPAIGN.comparisons.comp2.label
];
if (hasComp3) { compLabels.push(CAMPAIGN.comparisons.comp3.label); }
var periodSubtitle = 'Weekly Baseline avg vs ' + compLabels[1] + (hasComp3 ? ' vs ' + compLabels[2] : '') + ' vs ' + CAMPAIGN.campaign_short;
document.getElementById('gpv-period-subtitle').textContent  = periodSubtitle;
document.getElementById('cust-period-subtitle').textContent = periodSubtitle;

// --- 2. KPI Grid -------------------------------------------------------------
var kpiDefs = [
  { label:'Total GPV (AUD)',    value: CAMPAIGN.kpis.gpv,              badges: CAMPAIGN.kpi_badges.gpv,          highlight: true  },
  { label:'Active Customers',   value: CAMPAIGN.kpis.active_customers, badges: CAMPAIGN.kpi_badges.customers,    highlight: false },
  { label:'Avg. Order Value',   value: CAMPAIGN.kpis.aov,              badges: CAMPAIGN.kpi_badges.aov,          highlight: false },
  { label:'Total Transactions', value: CAMPAIGN.kpis.transactions,     badges: CAMPAIGN.kpi_badges.transactions, highlight: false }
];
var kpiGrid = document.getElementById('kpi-grid');
kpiDefs.forEach(function(k) {
  var badgesHtml = k.badges.map(function(b) {
    return '<div>' + badge(b.dir, b.text) + ' ' + badgeLabel(b.label) + '</div>';
  }).join('');
  var cls = 'kpi-card' + (k.highlight ? ' highlight' : '');
  kpiGrid.innerHTML +=
    '<div class="' + cls + '">' +
    '<div class="kpi-label">' + k.label + '</div>' +
    '<div class="kpi-value">' + k.value + '</div>' +
    '<div class="kpi-compare">' + badgesHtml + '</div>' +
    '</div>';
});

// --- 3. Channel Cards --------------------------------------------------------
var ch = CAMPAIGN.channel;
var channelCards = document.getElementById('channel-cards');
[
  { icon:'🌐', name:'Online',   tag:'Digital Channel',   data: ch.online  },
  { icon:'🏪', name:'In-store', tag:'Physical Channel',  data: ch.instore }
].forEach(function(c) {
  channelCards.innerHTML +=
    '<div class="channel-card">' +
    '<div class="channel-header">' +
    '<div class="channel-icon">' + c.icon + '</div>' +
    '<div><div class="channel-name">' + c.name + '</div>' +
    '<div class="channel-tag">' + c.tag + '</div></div></div>' +
    '<div class="channel-metrics">' +
    '<div class="channel-metric"><div class="label">GPV</div><div class="value">' + c.data.gpv + '</div></div>' +
    '<div class="channel-metric"><div class="label">Share</div><div class="value">' + c.data.share_pct + '%</div></div>' +
    '<div class="channel-metric"><div class="label">Transactions</div><div class="value">' + c.data.transactions + '</div></div>' +
    '<div class="channel-metric"><div class="label">Customers</div><div class="value">' + c.data.customers + '</div></div>' +
    '<div class="channel-metric"><div class="label">AOV</div><div class="value">' + c.data.aov + '</div></div>' +
    '</div>' +
    '<div><div style="font-size:11px;color:var(--ap-text-light);margin-bottom:4px">GPV Share</div>' +
    '<div class="channel-bar"><div class="channel-bar-fill" style="width:' + c.data.share_pct + '%"></div></div>' +
    '</div></div>';
});
// Part 2: Products, Segments, Customers, Learnings DOM population

// --- 4. Products Section -----------------------------------------------------
document.getElementById('products-desc').textContent =
  'Online item-level performance during the campaign (' + CAMPAIGN.period_label +
  '), sourced from Afterpay order item data.';

var loyaltyTile = document.getElementById('loyalty-tile');
if (CAMPAIGN.products.loyalty_tile && CAMPAIGN.loyalty_program) {
  var lt = CAMPAIGN.products.loyalty_tile;
  loyaltyTile.innerHTML =
    '<div class="chart-card full" style="margin-bottom:24px;background:var(--midnight);border-color:var(--midnight)">' +
    '<div style="display:flex;align-items:center;gap:12px;margin-bottom:20px">' +
    '<div style="background:var(--mint);border-radius:10px;padding:6px 14px;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--black)">' +
    CAMPAIGN.loyalty_program + '</div></div>' +
    '<div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:1px;background:rgba(255,255,255,0.1);border-radius:12px;overflow:hidden">' +
    loyaltyCell('New Memberships', lt.new_members, 'units sold') +
    loyaltyCell('Renewals', lt.renewals, 'units sold') +
    loyaltyCell('Total Members', lt.total, 'new + renewals') +
    loyaltyCell('Total GPV', lt.total_gpv, lt.new_gpv + ' new \u00b7 ' + lt.renewal_gpv + ' renewals') +
    '</div></div>';
}

function loyaltyCell(label, value, sub) {
  return '<div style="background:var(--midnight);padding:24px 20px">' +
    '<div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#556677;margin-bottom:8px">' + label + '</div>' +
    '<div style="font-size:32px;font-weight:800;color:var(--mint);letter-spacing:-1px;margin-bottom:4px">' + value + '</div>' +
    '<div style="font-size:12px;color:#556677">' + sub + '</div>' +
    '</div>';
}

function rankBadge(n) {
  return '<span style="display:inline-flex;align-items:center;justify-content:center;width:22px;height:22px;border-radius:50%;background:var(--mint);color:var(--black);font-size:11px;font-weight:700">' + n + '</span>';
}

var productTables = document.getElementById('product-tables');

// Top by units
var unitRows = CAMPAIGN.products.top_by_units.map(function(p, i) {
  return '<tr><td>' + rankBadge(i+1) + '</td>' +
    '<td><strong>' + p.name + '</strong> \u2014 ' + p.variant + '</td>' +
    '<td><strong>' + p.units + '</strong></td>' +
    '<td>' + p.orders + '</td></tr>';
}).join('');

// Top by GPV
var gpvRows = CAMPAIGN.products.top_by_gpv.map(function(p, i) {
  return '<tr><td>' + rankBadge(i+1) + '</td>' +
    '<td><strong>' + p.name + '</strong> \u2014 ' + p.variant + '</td>' +
    '<td><strong>' + p.gpv + '</strong></td>' +
    '<td>' + p.aov + '</td></tr>';
}).join('');

productTables.innerHTML =
  '<div class="chart-card">' +
  '<div class="chart-title">Top 5 Items by Units Ordered</div>' +
  '<div class="chart-subtitle">Total quantity sold online, ' + CAMPAIGN.period_label + '</div>' +
  '<table class="data-table" style="margin-top:4px"><thead><tr>' +
  '<th style="width:8%">#</th><th style="width:52%">Item</th>' +
  '<th style="width:20%">Units</th><th style="width:20%">Orders</th>' +
  '</tr></thead><tbody>' + unitRows + '</tbody></table></div>' +
  '<div class="chart-card">' +
  '<div class="chart-title">Top 5 Items by GPV</div>' +
  '<div class="chart-subtitle">Total revenue generated online, ' + CAMPAIGN.period_label + '</div>' +
  '<table class="data-table" style="margin-top:4px"><thead><tr>' +
  '<th style="width:8%">#</th><th style="width:46%">Item</th>' +
  '<th style="width:23%">GPV</th><th style="width:23%">Avg OV</th>' +
  '</tr></thead><tbody>' + gpvRows + '</tbody></table></div>';

// --- 5. Segments -------------------------------------------------------------
document.getElementById('segments-title').textContent =
  'Who Are ' + CAMPAIGN.merchant + "'s Afterpay Shoppers?";
document.getElementById('segments-desc').textContent =
  'Top 5 customer shopping segments during the campaign vs. weekly baseline average (' +
  CAMPAIGN.segments.baseline_label + '). Baseline normalised to a weekly average for like-for-like comparison.';
document.getElementById('seg-chart-subtitle').textContent =
  'Weekly avg baseline (' + CAMPAIGN.segments.baseline_label + ') vs campaign. Top 5 segments.';
document.getElementById('seg-gpv-subtitle').textContent =
  'Weekly avg baseline vs campaign GPV (AUD). Top 5 segments.';

var segStrip = document.getElementById('seg-strip');
CAMPAIGN.segments.top5.forEach(function(s) {
  segStrip.innerHTML +=
    '<div class="seg-card">' +
    '<div class="seg-rank">' + s.rank_label + '</div>' +
    '<div class="seg-name">' + s.name + '</div>' +
    '<div class="seg-metrics">' +
    '<div>' + badge('neutral', s.customers.toLocaleString() + ' customers') + '</div>' +
    '<div>' + badge('neutral', s.gpv + ' GPV') + '</div>' +
    '<div>' + badge('up', '\u25b2 AOV $' + s.aov_campaign + ' vs $' + s.aov_baseline) + '</div>' +
    '</div></div>';
});

// Rank shift table
var rsTable = document.getElementById('rank-shift-table');
var rsHead =
  '<thead><tr>' +
  '<th>Segment</th><th>Baseline<br>Rank</th><th>Campaign<br>Rank</th>' +
  '<th>Change</th><th>Campaign<br>Customers</th>' +
  '<th>Campaign<br>AOV</th><th>AOV vs<br>Baseline</th>' +
  '</tr></thead>';

var rsRows = CAMPAIGN.segments.top5.map(function(s) {
  var pct = Math.round((s.campaign_aov / s.baseline_aov - 1) * 100);
  var dir = pct >= 0 ? 'up' : 'down';
  var sign = pct >= 0 ? '\u25b2' : '\u25bc';
  return '<tr><td><strong>' + s.name + '</strong></td>' +
    '<td>' + s.baseline_rank + '</td>' +
    '<td>' + s.campaign_rank + '</td>' +
    '<td>' + badge(s.rank_dir, s.rank_change) + '</td>' +
    '<td>' + s.campaign_customers.toLocaleString() + '</td>' +
    '<td>$' + s.campaign_aov + '</td>' +
    '<td>' + badge(dir, sign + ' ' + Math.abs(pct) + '%') + '</td></tr>';
}).join('');

var rsExtras = (CAMPAIGN.segments.rank_shift_extras || []).map(function(s) {
  return '<tr><td><strong>' + s.name + '</strong></td>' +
    '<td>' + s.baseline_rank + '</td>' +
    '<td>' + s.campaign_rank + '</td>' +
    '<td>' + badge(s.rank_dir, s.rank_change) + '</td>' +
    '<td>' + s.campaign_customers.toLocaleString() + '</td>' +
    '<td>$' + s.campaign_aov + '</td>' +
    '<td>' + badge(s.aov_vs_baseline_dir, s.aov_vs_baseline_text) + '</td></tr>';
}).join('');

rsTable.innerHTML = rsHead + '<tbody>' + rsRows + rsExtras + '</tbody>';

// --- 6. Customer KPIs --------------------------------------------------------
document.getElementById('customers-title').textContent =
  'Who Shopped with ' + CAMPAIGN.merchant;

var ck = CAMPAIGN.kpis;
var custKpis = [
  { label:'Existing Customers', value: ck.existing,
    badges:[{ dir:'neutral', text: ck.existing_pct, label:'of total shoppers' }] },
  { label:'New Customers (NAC)', value: ck.nac,
    badges:[{ dir:'neutral', text: ck.nac_pct, label:'of total shoppers' }] },
  { label:'New to Merchant', value: ck.new_to_merchant, highlight: true,
    badges:[
      { dir:'up', text: ck.ntm_vs_baseline, label:'vs weekly baseline (' + ck.ntm_baseline_val + ')' },
      { dir:'neutral', text: ck.ntm_pct, label:'of total actives' }
    ]},
  { label:'Top Location (SA4)', value: ck.top_location,
    badges:[{ dir:'neutral', text: ck.top_location_pct, label:'of customers' }] },
  { label:'Top Generation', value: ck.top_generation,
    badges:[{ dir:'neutral', text: ck.top_generation_pct, label:'of customers' }] }
];
var custGrid = document.getElementById('customer-kpi-grid');
custKpis.forEach(function(k) {
  var badgesHtml = k.badges.map(function(b) {
    return '<div>' + badge(b.dir, b.text) + ' ' + badgeLabel(b.label) + '</div>';
  }).join('');
  var cls = 'kpi-card' + (k.highlight ? ' highlight' : '');
  custGrid.innerHTML +=
    '<div class="' + cls + '">' +
    '<div class="kpi-label">' + k.label + '</div>' +
    '<div class="kpi-value">' + k.value + '</div>' +
    '<div class="kpi-compare">' + badgesHtml + '</div>' +
    '</div>';
});

// --- 7. Insights & Recommendations -------------------------------------------
var insightGrid = document.getElementById('insight-grid');
CAMPAIGN.insights.forEach(function(ins) {
  insightGrid.innerHTML +=
    '<div class="insight-card">' +
    '<div class="insight-icon">' + ins.icon + '</div>' +
    '<div class="insight-title">' + ins.title + '</div>' +
    '<div class="insight-text">' + ins.text + '</div>' +
    '</div>';
});

document.getElementById('rec-desc').textContent =
  'Strategic actions for the next ' + CAMPAIGN.merchant + ' \u00d7 ' + CAMPAIGN.partner + ' campaign.';

var recGrid = document.getElementById('rec-grid');
CAMPAIGN.recommendations.forEach(function(r) {
  recGrid.innerHTML +=
    '<div class="rec-card">' +
    '<div class="rec-number">' + r.number + '</div>' +
    '<div class="rec-content">' +
    '<div class="rec-title">' + r.title + '</div>' +
    '<div class="rec-text">' + r.text + '</div>' +
    '</div></div>';
});

// --- 8. Footer ---------------------------------------------------------------
document.getElementById('footer').innerHTML =
  '<p>' + CAMPAIGN.merchant + ' \u00d7 <span>' + CAMPAIGN.partner + '</span> | ' +
  CAMPAIGN.campaign_name + ' \u2014 Post Campaign Report | ' + CAMPAIGN.report_date + '</p>' +
  '<p style="margin-top:8px">Data sourced from Afterpay Snowflake. All figures in AUD. Generated ' +
  CAMPAIGN.report_date + '.</p>' +
  '<p style="margin-top:8px;font-size:11px">Note: If sharing these results, please call out that Goose was used as the data source and ensure the query has been saved for validation.</p>';

// --- 9. SA4 subtitle ---------------------------------------------------------
var sa4Sub = document.getElementById('sa4-subtitle');
if (sa4Sub) {
  sa4Sub.textContent = 'Unique customers by Statistical Area Level 4, ' + CAMPAIGN.period_label;
}

// Part 3: All Chart.js charts + nav/scroll spy

// --- helpers -----------------------------------------------------------------
var daily       = CAMPAIGN.daily;
var dLabels     = daily.map(function(d){ return d.label; });
var dLabelsShort= daily.map(function(d){ return d.label_short; });
var comp        = CAMPAIGN.comparisons;
var periodLabels= [comp.baseline.label, comp.comp2.label];
var periodGpv   = [comp.baseline.gpv, comp.comp2.gpv];
var periodCust  = [comp.baseline.customers, comp.comp2.customers];
var periodColors= [GRAY, MINT_LIGHT];
if (hasComp3) {
  periodLabels.push(comp.comp3.label);
  periodGpv.push(comp.comp3.gpv);
  periodCust.push(comp.comp3.customers);
  periodColors.push('#6ddbb8');
}
periodLabels.push(CAMPAIGN.campaign_short);
periodGpv.push(daily.reduce(function(s,d){ return s+d.online+d.instore; }, 0));
periodCust.push(parseInt(CAMPAIGN.kpis.active_customers.replace(/,/g,'')));
periodColors.push(MINT);

// --- 1. GPV Period Chart -----------------------------------------------------
mkChart('gpvPeriodChart', {
  type: 'bar',
  data: {
    labels: periodLabels,
    datasets: [{
      data: periodGpv,
      backgroundColor: periodColors,
      borderRadius: 8
    }]
  },
  options: {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display:false } },
    scales: {
      y: { ticks:{ callback:function(v){ return fmtK(v); } }, grid:{color:'#f0f0f0'} },
      x: { grid:{ display:false } }
    }
  }
});

// --- 2. Customer Period Chart ------------------------------------------------
mkChart('customerPeriodChart', {
  type: 'bar',
  data: {
    labels: periodLabels,
    datasets: [{
      data: periodCust,
      backgroundColor: periodColors,
      borderRadius: 8
    }]
  },
  options: {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display:false } },
    scales: {
      y: { ticks:{ callback:function(v){ return fmtCount(v); } }, grid:{color:'#f0f0f0'} },
      x: { grid:{ display:false } }
    }
  }
});

// --- 3. Daily GPV Stacked ----------------------------------------------------
mkChart('dailyGpvChart', {
  type: 'bar',
  data: {
    labels: dLabels,
    datasets: [
      { label:'Online',   data: daily.map(function(d){ return d.online; }),
        backgroundColor: MINT, borderRadius: 4 },
      { label:'In-store', data: daily.map(function(d){ return d.instore; }),
        backgroundColor: GOLD, borderRadius: 4 }
    ]
  },
  options: {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend:{ position:'top' } },
    scales: {
      x: { stacked:true, grid:{display:false} },
      y: { stacked:true, ticks:{ callback:function(v){ return fmtK(v); } }, grid:{color:'#f0f0f0'} }
    }
  }
});

// --- 4. Daily Customers & Transactions ---------------------------------------
mkChart('dailyCustomersChart', {
  type: 'line',
  data: {
    labels: dLabelsShort,
    datasets: [
      { label:'Customers',    data: daily.map(function(d){ return d.customers; }),
        borderColor:MINT, backgroundColor:MINT+'20', fill:true, tension:0.4, pointRadius:5 },
      { label:'Transactions', data: daily.map(function(d){ return d.transactions; }),
        borderColor:NAVY, backgroundColor:NAVY+'10', fill:false, tension:0.4,
        pointRadius:5, borderDash:[5,3] }
    ]
  },
  options: {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend:{ position:'top' } },
    scales: {
      y: { ticks:{ callback:function(v){ return fmtCount(v); } }, grid:{color:'#f0f0f0'} },
      x: { grid:{display:false} }
    }
  }
});

// --- 5. Daily AOV ------------------------------------------------------------
mkChart('dailyAovChart', {
  type: 'line',
  data: {
    labels: dLabelsShort,
    datasets: [{
      label: 'AOV (AUD)',
      data: daily.map(function(d){ return d.aov; }),
      borderColor: GOLD, backgroundColor: GOLD+'20',
      fill:true, tension:0.4, pointRadius:6
    }]
  },
  options: {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend:{ display:false } },
    scales: {
      y: { ticks:{ callback:function(v){ return '$'+v; } }, grid:{color:'#f0f0f0'} },
      x: { grid:{display:false} }
    }
  }
});

// --- 6. Channel Donut --------------------------------------------------------
mkChart('channelDonut', {
  type: 'doughnut',
  data: {
    labels: ['Online','In-store'],
    datasets: [{
      data: [CAMPAIGN.channel.online.share_pct, CAMPAIGN.channel.instore.share_pct],
      backgroundColor: [MINT, GOLD], borderWidth:0, hoverOffset:8
    }]
  },
  options: {
    responsive: true, maintainAspectRatio: false, cutout:'65%',
    plugins: { legend:{ position:'bottom' } }
  }
});

// --- 7. Channel Daily --------------------------------------------------------
mkChart('channelDailyChart', {
  type: 'bar',
  data: {
    labels: dLabelsShort,
    datasets: [
      { label:'Online',   data: daily.map(function(d){ return d.online; }),
        backgroundColor: MINT, borderRadius:4 },
      { label:'In-store', data: daily.map(function(d){ return d.instore; }),
        backgroundColor: GOLD, borderRadius:4 }
    ]
  },
  options: {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend:{ position:'top' } },
    scales: {
      x: { grid:{display:false} },
      y: { ticks:{ callback:function(v){ return fmtK(v); } }, grid:{color:'#f0f0f0'} }
    }
  }
});

// --- 8. Gender Split Doughnut ------------------------------------------------
var genderData = CAMPAIGN.demographics.gender;
mkChart('genderChart', {
  type: 'doughnut',
  data: {
    labels: genderData.map(function(g){ return g.label; }),
    datasets: [{
      data: genderData.map(function(g){ return g.value; }),
      backgroundColor: [MINT, NAVY, GRAY],
      borderWidth: 2,
      borderColor: '#fff'
    }]
  },
  options: {
    responsive: true, maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { padding: 16, font: { size: 13 } } },
      tooltip: {
        callbacks: {
          label: function(ctx) {
            var total = ctx.dataset.data.reduce(function(a,b){ return a+b; }, 0);
            var pct = ((ctx.parsed / total) * 100).toFixed(1);
            return ' ' + ctx.label + ': ' + ctx.parsed.toLocaleString() + ' (' + pct + '%)';
          }
        }
      }
    }
  }
});

// --- 9. Generation GPV -------------------------------------------------------
var genData = CAMPAIGN.demographics.generations;
mkChart('generationChart', {
  type: 'doughnut',
  data: {
    labels: genData.map(function(g){ return g.label; }),
    datasets: [{
      data: genData.map(function(g){ return g.value; }),
      backgroundColor: [MINT, NAVY, GOLD, '#888', GRAY],
      borderWidth:0, hoverOffset:8
    }]
  },
  options: {
    responsive: true, maintainAspectRatio: false, cutout:'55%',
    plugins: {
      legend:{ position:'bottom', labels:{ boxWidth:12, font:{ size:11 } } }
    }
  }
});

// --- 10. Cohort Pie ----------------------------------------------------------
var cohortData = CAMPAIGN.demographics.cohorts;
var cohortTotal = cohortData.reduce(function(s,c){ return s+c.value; }, 0);
mkChart('cohortChart', {
  type: 'pie',
  data: {
    labels: cohortData.map(function(c){ return c.label; }),
    datasets: [{
      data: cohortData.map(function(c){ return c.value; }),
      backgroundColor: [MINT, NAVY, GOLD, GRAY],
      borderWidth:2, borderColor:'#fff', hoverOffset:10
    }]
  },
  options: {
    responsive: true, maintainAspectRatio: false,
    plugins: {
      legend:{ position:'right', labels:{ boxWidth:14, padding:16, font:{size:13} } },
      tooltip:{
        callbacks:{
          label: function(ctx) {
            var pct = (ctx.raw / cohortTotal * 100).toFixed(1);
            return ' ' + ctx.label + ': ' + ctx.raw.toLocaleString() + ' (' + pct + '%)';
          }
        }
      }
    }
  }
});

// --- 11. Top 10 SA4 Regions --------------------------------------------------
var sa4Data = CAMPAIGN.demographics.sa4_regions;
mkChart('sa4Chart', {
  type: 'bar',
  data: {
    labels: sa4Data.map(function(r){ return r.label; }),
    datasets: [{
      label: 'Customers',
      data: sa4Data.map(function(r){ return r.value; }),
      backgroundColor: sa4Data.map(function(r, i){ return i === 0 ? MINT : '#a8ecd4'; }),
      borderRadius: 6
    }]
  },
  options: {
    responsive: true, maintainAspectRatio: false, indexAxis: 'y',
    plugins: { legend: { display: false } },
    scales: {
      x: { ticks: { callback: function(v){ return v.toLocaleString(); } }, grid: { color: '#f0f0f0' } },
      y: { grid: { display: false }, ticks: { font: { size: 11 } } }
    }
  }
});

// --- 12. Segment Charts ------------------------------------------------------
var seg5 = CAMPAIGN.segments.top5;
var segLabels = seg5.map(function(s){ return s.name; });

mkChart('segmentCustomersChart', {
  type: 'bar',
  data: {
    labels: segLabels,
    datasets: [
      { label:'Weekly Baseline Avg',
        data: seg5.map(function(s){ return s.baseline_customers; }),
        backgroundColor: GRAY2, borderRadius:4 },
      { label:'Campaign',
        data: seg5.map(function(s){ return s.campaign_customers; }),
        backgroundColor: MINT, borderRadius:4 }
    ]
  },
  options: {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend:{ position:'top' } },
    scales: {
      x: { grid:{display:false} },
      y: { ticks:{ callback:function(v){ return fmtCount(v); } }, grid:{color:'#f0f0f0'} }
    }
  }
});

mkChart('segmentGpvChart', {
  type: 'bar',
  data: {
    labels: segLabels,
    datasets: [
      { label:'Weekly Baseline Avg',
        data: seg5.map(function(s){ return s.baseline_gpv; }),
        backgroundColor: GRAY2, borderRadius:4 },
      { label:'Campaign',
        data: seg5.map(function(s){ return s.campaign_gpv; }),
        backgroundColor: MINT, borderRadius:4 }
    ]
  },
  options: {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend:{ position:'top' } },
    scales: {
      x: { grid:{display:false} },
      y: { ticks:{ callback:function(v){ return fmtK(v); } }, grid:{color:'#f0f0f0'} }
    }
  }
});

mkChart('segmentAovChart', {
  type: 'bar',
  data: {
    labels: segLabels,
    datasets: [
      { label:'Weekly Baseline AOV',
        data: seg5.map(function(s){ return s.baseline_aov; }),
        backgroundColor: GRAY2, borderRadius:4 },
      { label:'Campaign AOV',
        data: seg5.map(function(s){ return s.campaign_aov; }),
        backgroundColor: GOLD, borderRadius:4 }
    ]
  },
  options: {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend:{ position:'top' } },
    scales: {
      x: { grid:{display:false} },
      y: { min:100, ticks:{ callback:function(v){ return '$'+v; } }, grid:{color:'#f0f0f0'} }
    }
  }
});

// --- Nav smooth scroll -------------------------------------------------------
document.querySelectorAll('a[href^="#"]').forEach(function(a) {
  a.addEventListener('click', function(e) {
    e.preventDefault();
    document.querySelector(a.getAttribute('href'))
      .scrollIntoView({ behavior:'smooth', block:'start' });
    document.querySelectorAll('.nav-links a')
      .forEach(function(l){ l.classList.remove('active'); });
    a.classList.add('active');
  });
});

// --- Scroll spy --------------------------------------------------------------
var sections = ['summary','performance','channel','products','segments','customers','learnings'];
window.addEventListener('scroll', function() {
  var current = '';
  sections.forEach(function(id) {
    var el = document.getElementById(id);
    if (el && window.scrollY >= el.offsetTop - 100) { current = id; }
  });
  document.querySelectorAll('.nav-links a').forEach(function(a) {
    a.classList.toggle('active', a.getAttribute('href') === '#'+current);
  });
});
