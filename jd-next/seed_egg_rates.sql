-- =============================================================
-- Jeevadhara — Egg Rates (NECC White Layer Wholesale)
-- Real approximate rates for June 2026 (₹ per 100 eggs)
-- Brown / Country / Kadaknath / Quail / Duck calculated in UI
-- Run as jeevadhara_iam
-- =============================================================

-- Step 1 (dbadmin): Ensure correct column type
-- ALTER TABLE egg_rates ALTER COLUMN price_per_100 TYPE NUMERIC(8,2);

-- Step 2 (jeevadhara_iam): Clean bad data and reseed
DELETE FROM egg_rates;

INSERT INTO egg_rates (city, state, price_per_100, rate_date) VALUES
('Namakkal',     'Tamil Nadu',        568.00, CURRENT_DATE),
('Chennai',      'Tamil Nadu',        578.00, CURRENT_DATE),
('Coimbatore',   'Tamil Nadu',        582.00, CURRENT_DATE),
('Tirupati',     'Andhra Pradesh',    576.00, CURRENT_DATE),
('Vijayawada',   'Andhra Pradesh',    574.00, CURRENT_DATE),
('Hyderabad',    'Telangana',         586.00, CURRENT_DATE),
('Warangal',     'Telangana',         572.00, CURRENT_DATE),
('Bengaluru',    'Karnataka',         592.00, CURRENT_DATE),
('Pune',         'Maharashtra',       597.00, CURRENT_DATE),
('Mumbai',       'Maharashtra',       612.00, CURRENT_DATE),
('Nagpur',       'Maharashtra',       594.00, CURRENT_DATE),
('Kolkata',      'West Bengal',       605.00, CURRENT_DATE),
('Delhi (CC)',   'Delhi',             618.00, CURRENT_DATE),
('Ahmedabad',    'Gujarat',           608.00, CURRENT_DATE),
('Bhopal',       'Madhya Pradesh',    589.00, CURRENT_DATE),
('Jaipur',       'Rajasthan',         601.00, CURRENT_DATE)
ON CONFLICT DO NOTHING;

-- Verify
SELECT city, state, price_per_100,
       ROUND(price_per_100 / 100, 2) AS per_egg
FROM egg_rates
ORDER BY price_per_100 ASC;
