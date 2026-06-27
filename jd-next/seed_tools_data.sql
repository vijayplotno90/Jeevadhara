-- =============================================================
-- Jeevadhara — Tools Table + Seed Data
-- Step 1 (dbadmin): CREATE TABLE + GRANT
-- Step 2 (jeevadhara_iam): INSERT 27 tool listings
-- =============================================================

-- ── STEP 1 (run as dbadmin) ──────────────────────────────────
CREATE TABLE IF NOT EXISTS tools (
  id          UUID      PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id   TEXT      NOT NULL,
  name        TEXT      NOT NULL,
  slug        TEXT      NOT NULL,
  category    TEXT      NOT NULL CHECK (category IN ('hand','powered','irrigation')),
  brand       TEXT,
  condition   TEXT      NOT NULL CHECK (condition IN ('new','used')),
  description TEXT,
  image_url   TEXT,
  price       NUMERIC   NOT NULL,
  unit        TEXT      DEFAULT 'piece',
  stock       INT       DEFAULT 10,
  district    TEXT,
  village     TEXT,
  is_active   BOOLEAN   DEFAULT FALSE,
  created_at  TIMESTAMP DEFAULT NOW()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON tools TO jeevadhara_iam;
SELECT 'tools table created' AS status;

-- ── STEP 2 (run as jeevadhara_iam) ───────────────────────────
INSERT INTO tools (id,seller_id,name,slug,category,brand,condition,description,image_url,price,unit,stock,district,village,is_active,created_at) VALUES

-- ── GARDEN FORK ──
('c1000001-0000-0000-0000-000000000001','f1000001-0000-0000-0000-000000000001','Garden Fork','garden-fork','hand','Agro India','new','Heavy duty 4-tine garden fork, forged carbon steel, ideal for soil turning and composting. Hardwood handle.','/tools/garden-fork.jpg',550,'piece',50,'Ranga Reddy','Ibrahimpatnam',TRUE,'2026-05-01 09:00:00'),
('c1000001-0000-0000-0000-000000000002','f1000002-0000-0000-0000-000000000001','Garden Fork','garden-fork','hand','Krishna Tools','new','5-tine fork, 28 inch handle, all-steel construction. Rust-resistant powder coat finish.','/tools/garden-fork.jpg',480,'piece',35,'Warangal','Hanamkonda',TRUE,'2026-05-03 10:00:00'),
('c1000001-0000-0000-0000-000000000003','f2000001-0000-0000-0000-000000000002','Garden Fork','garden-fork','hand','Local Forge','used','4-tine fork, used one season. Handle replaced new. Good condition, priced to sell.','/tools/garden-fork.jpg',320,'piece',5,'Nalgonda','Devarkonda',TRUE,'2026-05-05 09:00:00'),

-- ── HAND TROWEL ──
('c1000002-0000-0000-0000-000000000001','f1000003-0000-0000-0000-000000000001','Hand Trowel','hand-trowel','hand','Agro India','new','Stainless steel blade, ergonomic rubber grip. Depth markings for seed planting accuracy. Lifetime rust warranty.','/tools/hand-trowel.jpg',165,'piece',100,'Nalgonda','Devarkonda',TRUE,'2026-05-01 10:00:00'),
('c1000002-0000-0000-0000-000000000002','f2000001-0000-0000-0000-000000000003','Hand Trowel','hand-trowel','hand','Garden Pro','new','Premium drop-forged trowel, non-slip grip. Set of 3 (trowel + weeder + transplanter).','/tools/hand-trowel.jpg',380,'set',60,'Warangal','Hanamkonda',TRUE,'2026-05-04 09:00:00'),
('c1000002-0000-0000-0000-000000000003','f2000001-0000-0000-0000-000000000004','Hand Trowel','hand-trowel','hand','Hyderabad Tools','new','Lightweight aluminum trowel, serrated edge for root cutting. Nursery grade.','/tools/hand-trowel.jpg',125,'piece',200,'Karimnagar','Peddapalli',TRUE,'2026-05-06 10:00:00'),

-- ── HOE ──
('c1000003-0000-0000-0000-000000000001','f1000001-0000-0000-0000-000000000002','Garden Hoe','hoe','hand','Agro India','new','Draw hoe with 7-inch wide blade. Hardwood handle 150cm. Ideal for weeding row crops — cotton, turmeric, chilli.','/tools/hoe.jpg',420,'piece',45,'Ranga Reddy','Ibrahimpatnam',TRUE,'2026-05-02 09:00:00'),
('c1000003-0000-0000-0000-000000000002','f1000002-0000-0000-0000-000000000002','Garden Hoe','hoe','hand','Krishna Tools','new','Oscillating hoe (push-pull), cuts weeds on both strokes. Adjustable handle, stainless blade.','/tools/hoe.jpg',580,'piece',30,'Nizamabad','Bodhan',TRUE,'2026-05-05 09:00:00'),
('c1000003-0000-0000-0000-000000000003','f2000001-0000-0000-0000-000000000001','Garden Hoe','hoe','hand','Local Forge','used','Traditional khurpi-style hoe, used 2 seasons. Sharp edge, solid handle. Best for small plots.','/tools/hoe.jpg',180,'piece',8,'Khammam','Bhadrachalam',TRUE,'2026-05-07 10:00:00'),

-- ── RAKE ──
('c1000004-0000-0000-0000-000000000001','f1000003-0000-0000-0000-000000000002','Garden Rake','rake','hand','Agro India','new','14-tine steel rake, flat head, ideal for leveling seedbeds and collecting debris. 140cm handle.','/tools/rake.jpg',350,'piece',60,'Hyderabad','Kukatpally',TRUE,'2026-05-01 11:00:00'),
('c1000004-0000-0000-0000-000000000002','f2000001-0000-0000-0000-000000000005','Garden Rake','rake','hand','Garden Pro','new','16-tine bow rake, heavy gauge tines. Adjustable head width. For mulching and compost mixing.','/tools/rake.jpg',420,'piece',40,'Medak','Zaheerabad',TRUE,'2026-05-04 10:00:00'),
('c1000004-0000-0000-0000-000000000003','f1000001-0000-0000-0000-000000000003','Garden Rake','rake','hand','Local Make','used','10-tine leaf rake, lightweight. Used one harvest season. Handle in good shape.','/tools/rake.jpg',180,'piece',3,'Warangal','Hanamkonda',TRUE,'2026-05-06 09:00:00'),

-- ── SHOVEL ──
('c1000005-0000-0000-0000-000000000001','f1000002-0000-0000-0000-000000000003','Shovel','shovel','hand','Agro India','new','Heavy duty round-point shovel, 12-gauge steel blade, fiberglass handle. For soil turning and trenching.','/tools/shovel.jpg',680,'piece',40,'Nalgonda','Devarkonda',TRUE,'2026-05-02 10:00:00'),
('c1000005-0000-0000-0000-000000000002','f1000003-0000-0000-0000-000000000003','Shovel','shovel','hand','Krishna Tools','new','Square-head shovel, wide mouth 10-inch blade. Best for moving compost, sand, loose soil.','/tools/shovel.jpg',595,'piece',35,'Warangal','Hanamkonda',TRUE,'2026-05-05 10:00:00'),
('c1000005-0000-0000-0000-000000000003','f2000001-0000-0000-0000-000000000003','Shovel','shovel','hand','Local Forge','used','Used iron shovel, blade solid, handle slightly worn. Good for general farm use.','/tools/shovel.jpg',350,'piece',4,'Warangal','Hanamkonda',TRUE,'2026-05-07 09:00:00'),

-- ── SICKLE ──
('c1000006-0000-0000-0000-000000000001','f2000001-0000-0000-0000-000000000001','Sickle','sickle','hand','Agro India','new','Serrated sickle, high carbon steel, wooden handle. Traditional harvesting tool for paddy, wheat, grass.','/tools/sickle.jpg',145,'piece',200,'Khammam','Bhadrachalam',TRUE,'2026-05-01 09:30:00'),
('c1000006-0000-0000-0000-000000000002','f1000001-0000-0000-0000-000000000004','Sickle','sickle','hand','Krishna Tools','new','Smooth-blade sickle for grass cutting, inward curve for better grip. Pack of 5 available.','/tools/sickle.jpg',120,'piece',150,'Ranga Reddy','Ibrahimpatnam',TRUE,'2026-05-03 09:00:00'),
('c1000006-0000-0000-0000-000000000003','f2000001-0000-0000-0000-000000000004','Sickle','sickle','hand','Karimnagar Forge','new','Locally forged sickle, strong and sharp. Widely used by paddy farmers in Karimnagar. Long-lasting edge.','/tools/sickle.jpg',95,'piece',300,'Karimnagar','Peddapalli',TRUE,'2026-05-05 10:30:00'),

-- ── SPADE ──
('c1000007-0000-0000-0000-000000000001','f1000002-0000-0000-0000-000000000004','Spade','spade','hand','Agro India','new','D-handle spade, flat blade 28×19cm, ideal for digging, edging, trenching. Steel shaft.','/tools/spade.jpg',750,'piece',30,'Karimnagar','Peddapalli',TRUE,'2026-05-02 11:00:00'),
('c1000007-0000-0000-0000-000000000002','f1000003-0000-0000-0000-000000000004','Spade','spade','hand','Krishna Tools','new','Long-handle flat spade, carbon steel blade. Ideal for irrigation channel maintenance and plot edging.','/tools/spade.jpg',620,'piece',25,'Nalgonda','Devarkonda',TRUE,'2026-05-06 10:00:00'),
('c1000007-0000-0000-0000-000000000003','f2000001-0000-0000-0000-000000000002','Spade','spade','hand','Local Forge','used','Older spade, blade slightly pitted but functional. Handle sturdy. Reduced price for quick sale.','/tools/spade.jpg',380,'piece',2,'Nalgonda','Devarkonda',TRUE,'2026-05-07 11:00:00'),

-- ── KNAPSACK SPRAYER ──
('c1000008-0000-0000-0000-000000000001','f1000001-0000-0000-0000-000000000005','Knapsack Sprayer','knapsack-sprayer','powered','Aspee','new','Aspee 16L battery sprayer. 12V motor, 2L/min output, adjustable nozzle (mist to jet). 6-hr battery life.','/tools/sprayer.jpg',1850,'piece',25,'Ranga Reddy','Ibrahimpatnam',TRUE,'2026-05-01 10:30:00'),
('c1000008-0000-0000-0000-000000000002','f1000002-0000-0000-0000-000000000005','Knapsack Sprayer','knapsack-sprayer','powered','Neptune','new','Neptune 20L sprayer, 15V lithium battery, 4 nozzle types included. 8-hr battery. Ideal for larger farms.','/tools/sprayer.jpg',2200,'piece',20,'Nizamabad','Bodhan',TRUE,'2026-05-04 11:00:00'),
('c1000008-0000-0000-0000-000000000003','f1000003-0000-0000-0000-000000000005','Knapsack Sprayer','knapsack-sprayer','powered','Aspee','used','Aspee 16L used sprayer. 1 year old, works perfectly. Battery holds 5hr charge. Selling as upgrading to 25L.','/tools/sprayer.jpg',1100,'piece',1,'Khammam','Bhadrachalam',TRUE,'2026-05-06 09:30:00'),

-- ── WHEELBARROW ──
('c1000009-0000-0000-0000-000000000001','f2000001-0000-0000-0000-000000000005','Wheelbarrow','wheelbarrow','hand','Agro India','new','Single-wheel steel wheelbarrow, 120L capacity, heavy gauge tray. Pneumatic tyre, solid frame. Best for compost and soil.','/tools/wheelbarrow.jpg',3200,'piece',15,'Medak','Zaheerabad',TRUE,'2026-05-01 11:30:00'),
('c1000009-0000-0000-0000-000000000002','f1000001-0000-0000-0000-000000000005','Wheelbarrow','wheelbarrow','hand','Krishna Tools','new','Poly tray wheelbarrow 100L, rust-proof body. Lightweight (8kg), easy to maneuver on narrow farm paths.','/tools/wheelbarrow.jpg',2800,'piece',10,'Ranga Reddy','Ibrahimpatnam',TRUE,'2026-05-04 10:30:00'),
('c1000009-0000-0000-0000-000000000003','f2000001-0000-0000-0000-000000000001','Wheelbarrow','wheelbarrow','hand','Local Make','used','Steel wheelbarrow, tray has 2 small dents but no holes. Wheel and frame solid. Good for regular farm use.','/tools/wheelbarrow.jpg',1600,'piece',1,'Khammam','Bhadrachalam',TRUE,'2026-05-06 11:00:00')

ON CONFLICT (id) DO NOTHING;

-- ── VERIFY ────────────────────────────────────────────────────
SELECT
  MIN(name)       AS tool,
  condition,
  COUNT(*)::int   AS sellers,
  MIN(price)      AS min_price,
  MAX(price)      AS max_price
FROM tools WHERE is_active = TRUE
GROUP BY slug, condition
ORDER BY MIN(name), condition;
