-- =============================================================================
-- PCR SNOWFLAKE QUERIES
-- Replace {merchant_name}, {start_date}, {end_date} before running
-- Replace {baseline_start}, {baseline_end} with your 6-week baseline window
-- Replace {comp2_start}/{comp2_end} and {comp3_start}/{comp3_end} for historical
-- =============================================================================

-- -----------------------------------------------------------------------------
-- QUERY 1: Core Performance (Campaign + Baseline + 2 Historical Comparisons)
-- -----------------------------------------------------------------------------
WITH
campaign AS (
  SELECT
    'Campaign' AS period,
    SUM(order_amount_aud)                                    AS gpv,
    COUNT(DISTINCT consumer_id)                              AS active_customers,
    AVG(order_amount_aud)                                    AS aov,
    COUNT(*)                                                 AS transactions,
    SUM(CASE WHEN channel = 'Online'  THEN order_amount_aud ELSE 0 END) AS online_gpv,
    SUM(CASE WHEN channel = 'Instore' THEN order_amount_aud ELSE 0 END) AS instore_gpv,
    COUNT(DISTINCT CASE
      WHEN order_number_by_merchant = 1 THEN consumer_id END)           AS new_to_merchant
  FROM AP_CUR_BI_G.CURATED_ANALYTICS_GREEN.CUR_C_M_ORDER_MASTER
  WHERE date_local BETWEEN '{start_date}' AND '{end_date}'
    AND merchant_name ILIKE '%{merchant_name}%'
),
baseline AS (
  -- 6-week weekly average: divide totals by 6
  SELECT
    'Baseline (Weekly Avg)' AS period,
    SUM(order_amount_aud) / 6                                AS gpv,
    COUNT(DISTINCT consumer_id) / 6                          AS active_customers,
    AVG(order_amount_aud)                                    AS aov,
    COUNT(*) / 6                                             AS transactions,
    SUM(CASE WHEN channel = 'Online'  THEN order_amount_aud ELSE 0 END) / 6 AS online_gpv,
    SUM(CASE WHEN channel = 'Instore' THEN order_amount_aud ELSE 0 END) / 6 AS instore_gpv,
    NULL AS new_to_merchant
  FROM AP_CUR_BI_G.CURATED_ANALYTICS_GREEN.CUR_C_M_ORDER_MASTER
  WHERE date_local BETWEEN '{baseline_start}' AND '{baseline_end}'
    AND merchant_name ILIKE '%{merchant_name}%'
),
comp2 AS (
  SELECT
    '{comp2_label}' AS period,
    SUM(order_amount_aud)           AS gpv,
    COUNT(DISTINCT consumer_id)     AS active_customers,
    AVG(order_amount_aud)           AS aov,
    COUNT(*)                        AS transactions,
    SUM(CASE WHEN channel = 'Online'  THEN order_amount_aud ELSE 0 END) AS online_gpv,
    SUM(CASE WHEN channel = 'Instore' THEN order_amount_aud ELSE 0 END) AS instore_gpv,
    NULL AS new_to_merchant
  FROM AP_CUR_BI_G.CURATED_ANALYTICS_GREEN.CUR_C_M_ORDER_MASTER
  WHERE date_local BETWEEN '{comp2_start}' AND '{comp2_end}'
    AND merchant_name ILIKE '%{merchant_name}%'
),
comp3 AS (
  SELECT
    '{comp3_label}' AS period,
    SUM(order_amount_aud)           AS gpv,
    COUNT(DISTINCT consumer_id)     AS active_customers,
    AVG(order_amount_aud)           AS aov,
    COUNT(*)                        AS transactions,
    SUM(CASE WHEN channel = 'Online'  THEN order_amount_aud ELSE 0 END) AS online_gpv,
    SUM(CASE WHEN channel = 'Instore' THEN order_amount_aud ELSE 0 END) AS instore_gpv,
    NULL AS new_to_merchant
  FROM AP_CUR_BI_G.CURATED_ANALYTICS_GREEN.CUR_C_M_ORDER_MASTER
  WHERE date_local BETWEEN '{comp3_start}' AND '{comp3_end}'
    AND merchant_name ILIKE '%{merchant_name}%'
)
SELECT * FROM campaign
UNION ALL SELECT * FROM baseline
UNION ALL SELECT * FROM comp2
UNION ALL SELECT * FROM comp3;


-- -----------------------------------------------------------------------------
-- QUERY 2: Daily Breakdown (Online vs In-store by day)
-- -----------------------------------------------------------------------------
SELECT
  date_local,
  SUM(CASE WHEN channel = 'Online'  THEN order_amount_aud ELSE 0 END) AS online_gpv,
  SUM(CASE WHEN channel = 'Instore' THEN order_amount_aud ELSE 0 END) AS instore_gpv,
  COUNT(DISTINCT consumer_id)                                          AS customers,
  COUNT(*)                                                             AS transactions,
  AVG(order_amount_aud)                                                AS aov
FROM AP_CUR_BI_G.CURATED_ANALYTICS_GREEN.CUR_C_M_ORDER_MASTER
WHERE date_local BETWEEN '{start_date}' AND '{end_date}'
  AND merchant_name ILIKE '%{merchant_name}%'
GROUP BY 1
ORDER BY 1;


-- -----------------------------------------------------------------------------
-- QUERY 3: Top Products by Units & GPV (excludes loyalty membership items)
-- Adjust the ILIKE exclusions to match the merchant's loyalty product names
-- -----------------------------------------------------------------------------
SELECT
  i.item_name,
  SUM(i.quantity)         AS total_units,
  COUNT(DISTINCT o.order_id) AS orders,
  SUM(o.order_amount_aud) AS total_gpv,
  AVG(o.order_amount_aud) AS avg_order_value
FROM AP_CUR_BI_G.CURATED_ANALYTICS_GREEN.CUR_C_M_ORDER_MASTER o
JOIN AP_RAW_GREEN.GREEN.F_ORDER_ITEM i
  ON o.order_id = i.order_id
  AND o.par_region = i.par_region
WHERE o.date_local BETWEEN '{start_date}' AND '{end_date}'
  AND o.merchant_name ILIKE '%{merchant_name}%'
  AND o.channel = 'Online'
  -- Exclude loyalty membership items — update these patterns per merchant:
  AND i.item_name NOT ILIKE '%membership%'
  AND i.item_name NOT ILIKE '%renewal%'
GROUP BY 1
ORDER BY total_units DESC
LIMIT 10;  -- get 10, pick top 5 by units and top 5 by GPV


-- -----------------------------------------------------------------------------
-- QUERY 4: Loyalty / Membership Program Sales (if applicable)
-- Update item_name filters to match the merchant's loyalty product names
-- -----------------------------------------------------------------------------
SELECT
  CASE
    WHEN i.item_name ILIKE '%renewal%' THEN 'Renewal'
    ELSE 'New Membership'
  END AS membership_type,
  SUM(i.quantity)         AS units,
  SUM(o.order_amount_aud) AS gpv
FROM AP_CUR_BI_G.CURATED_ANALYTICS_GREEN.CUR_C_M_ORDER_MASTER o
JOIN AP_RAW_GREEN.GREEN.F_ORDER_ITEM i
  ON o.order_id = i.order_id
  AND o.par_region = i.par_region
WHERE o.date_local BETWEEN '{start_date}' AND '{end_date}'
  AND o.merchant_name ILIKE '%{merchant_name}%'
  AND (i.item_name ILIKE '%membership%' OR i.item_name ILIKE '%renewal%')
GROUP BY 1;


-- -----------------------------------------------------------------------------
-- QUERY 5: Shopping Segments (Top 5 + Baseline)
-- -----------------------------------------------------------------------------
-- Campaign period
SELECT
  habituation_segment,
  COUNT(DISTINCT o.consumer_id) AS customers,
  SUM(o.order_amount_aud)       AS gpv,
  AVG(o.order_amount_aud)       AS aov,
  'Campaign'                    AS period
FROM AP_CUR_BI_G.CURATED_ANALYTICS_GREEN.CUR_C_M_ORDER_MASTER o
WHERE date_local BETWEEN '{start_date}' AND '{end_date}'
  AND merchant_name ILIKE '%{merchant_name}%'
GROUP BY 1, 5
UNION ALL
-- Baseline (6-week weekly avg)
SELECT
  habituation_segment,
  COUNT(DISTINCT o.consumer_id) / 6 AS customers,
  SUM(o.order_amount_aud) / 6       AS gpv,
  AVG(o.order_amount_aud)           AS aov,
  'Baseline'                        AS period
FROM AP_CUR_BI_G.CURATED_ANALYTICS_GREEN.CUR_C_M_ORDER_MASTER o
WHERE date_local BETWEEN '{baseline_start}' AND '{baseline_end}'
  AND merchant_name ILIKE '%{merchant_name}%'
GROUP BY 1, 5
ORDER BY period, gpv DESC;


-- -----------------------------------------------------------------------------
-- QUERY 6: Customer Demographics (Age Group, Generation, Cohort)
-- -----------------------------------------------------------------------------
SELECT
  o.age_group,
  o.generation,
  o.engagement_cohort,
  COUNT(DISTINCT o.consumer_id) AS customers,
  SUM(o.order_amount_aud)       AS gpv
FROM AP_CUR_BI_G.CURATED_ANALYTICS_GREEN.CUR_C_M_ORDER_MASTER o
WHERE date_local BETWEEN '{start_date}' AND '{end_date}'
  AND merchant_name ILIKE '%{merchant_name}%'
GROUP BY 1, 2, 3
ORDER BY customers DESC;


-- -----------------------------------------------------------------------------
-- QUERY 7: New vs Existing Customers
-- -----------------------------------------------------------------------------
SELECT
  CASE
    WHEN order_number_by_merchant = 1 THEN 'New to Merchant'
    ELSE 'Returning'
  END AS customer_type,
  CASE
    WHEN consumer_first_order_date BETWEEN '{start_date}' AND '{end_date}'
    THEN 'New Afterpay Customer (NAC)'
    ELSE 'Existing Afterpay Customer'
  END AS afterpay_status,
  COUNT(DISTINCT consumer_id) AS customers,
  SUM(order_amount_aud)       AS gpv
FROM AP_CUR_BI_G.CURATED_ANALYTICS_GREEN.CUR_C_M_ORDER_MASTER
WHERE date_local BETWEEN '{start_date}' AND '{end_date}'
  AND merchant_name ILIKE '%{merchant_name}%'
GROUP BY 1, 2
ORDER BY customers DESC;
