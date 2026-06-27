-- =============================================================
-- Jeevadhara — Name Normalization + Extra Farmers Seed
-- Step 1: Fix all inconsistent product names
-- Step 2: Add 5 new farmers + 25 products (3+ sellers per product)
-- Run: psql -h <host> -U jeevadhara_iam -d jeevadhara -f seed_more_farmers.sql
-- =============================================================

-- ── STEP 1: NORMALIZE EXISTING PRODUCT NAMES ─────────────────
-- Fix spelling variants, capitalization, regional name conflicts

UPDATE products SET name = 'Oyster Mushrooms'
WHERE LOWER(TRIM(name)) IN ('oyster mushroom','oyester mushroom','oyester mushrooms','oyster mushroom fresh');

UPDATE products SET name = 'Guntur Red Chilli'
WHERE LOWER(TRIM(name)) IN ('guntur mirchi','guntur chilli','guntur red chili','guntur red mirchi','guntur chili','red mirchi','guntur dry red chilli');

UPDATE products SET name = 'Dry Red Chilli'
WHERE LOWER(TRIM(name)) IN ('dry red chili','dry mirchi','sukha lal mirchi','dry red chilli powder','byadagi chilli');

UPDATE products SET name = 'Toor Dal'
WHERE LOWER(TRIM(name)) IN ('tur dal','toor daal','toor dal (pigeon pea)','arhar dal','pigeon pea dal');

UPDATE products SET name = 'Urad Dal'
WHERE LOWER(TRIM(name)) IN ('urad daal','black gram dal','black urad dal','whole urad');

UPDATE products SET name = 'Moong Dal'
WHERE LOWER(TRIM(name)) IN ('moong daal','green moong dal','yellow moong dal','mung dal');

UPDATE products SET name = 'Chana Dal'
WHERE LOWER(TRIM(name)) IN ('chana daal','split chickpea','chane ki dal','bengal gram dal');

UPDATE products SET name = 'Sona Masoori Rice'
WHERE LOWER(TRIM(name)) IN ('sona masuri rice','sonamasoori rice','sona masoori','hmt rice');

UPDATE products SET name = 'BPT Rice'
WHERE LOWER(TRIM(name)) IN ('bpt samba rice','bapatla rice','bpt samba');

UPDATE products SET name = 'Raw Turmeric'
WHERE LOWER(TRIM(name)) IN ('fresh turmeric','haldi fresh','raw haldi','turmeric root','fresh haldi');

UPDATE products SET name = 'Forest Wild Honey'
WHERE LOWER(TRIM(name)) IN ('wild honey','jungle honey','forest honey','adivasi honey','tribal honey');

UPDATE products SET name = 'Country Eggs'
WHERE LOWER(TRIM(name)) IN ('desi eggs','nati eggs','country chicken eggs','nattu koli eggs','free range eggs');

UPDATE products SET name = 'Green Chillies'
WHERE LOWER(TRIM(name)) IN ('green chili','hari mirchi','green mirchi','fresh green chillies');

UPDATE products SET name = 'Red Onions'
WHERE LOWER(TRIM(name)) IN ('red onion','pyaz','onions','lal pyaz','krishnapuram onion');

UPDATE products SET name = 'Organic Tomatoes'
WHERE LOWER(TRIM(name)) IN ('organic tomato','tomatoes organic','desi tomatoes','country tomatoes');

UPDATE products SET name = 'Organic Brinjal'
WHERE LOWER(TRIM(name)) IN ('brinjal','eggplant','baingan','organic baingan','purple brinjal');

UPDATE products SET name = 'Moringa Leaves'
WHERE LOWER(TRIM(name)) IN ('drumstick leaves','moringa','murungai keerai','sahjan leaves');

UPDATE products SET name = 'Bottle Gourd'
WHERE LOWER(TRIM(name)) IN ('lauki','dudhi','sorakaya','ghiya','lau');

UPDATE products SET name = 'Jowar'
WHERE LOWER(TRIM(name)) IN ('sorghum','jonna','jowar grain','jondhal');

UPDATE products SET name = 'Groundnuts'
WHERE LOWER(TRIM(name)) IN ('peanuts','moongfali','pallilu','groundnut');

UPDATE products SET name = 'Black Sesame'
WHERE LOWER(TRIM(name)) IN ('black til','kala til','sesame seeds','nuvvulu');

UPDATE products SET name = 'Sunflower Microgreens'
WHERE LOWER(TRIM(name)) IN ('sunflower micro greens','microgreens sunflower','sunflower sprouts');

-- Fix capitalisation on any remaining lowercase names
UPDATE products SET name = INITCAP(name)
WHERE name != INITCAP(name)
  AND name NOT IN ('BPT Rice');  -- keep BPT uppercase

-- ── STEP 2: NEW FARMERS ──────────────────────────────────────
INSERT INTO users (id, name, phone, role, district, village, created_at) VALUES
  ('f2000001-0000-0000-0000-000000000001','Narasimha Rao',   '9848011121','farmer','Khammam',      'Bhadrachalam', '2026-03-01 09:00:00'),
  ('f2000001-0000-0000-0000-000000000002','Padmavathi Devi', '9848022232','farmer','Nalgonda',     'Devarkonda',   '2026-03-03 10:00:00'),
  ('f2000001-0000-0000-0000-000000000003','Tirupathi Goud',  '9848033343','farmer','Warangal',     'Hanamkonda',   '2026-03-05 08:30:00'),
  ('f2000001-0000-0000-0000-000000000004','Anand Kumar',     '9848044454','farmer','Karimnagar',   'Peddapalli',   '2026-03-08 11:00:00'),
  ('f2000001-0000-0000-0000-000000000005','Saraswati Reddy', '9848055565','farmer','Medak',        'Zaheerabad',   '2026-03-10 09:30:00')
ON CONFLICT (id) DO NOTHING;

-- ── STEP 3: PRODUCTS (3+ sellers per key product) ────────────
-- Each product name matches the normalized names above
-- Prices vary realistically across sellers

INSERT INTO products (id, farmer_id, name, category, price, unit, stock, description, district, is_organic, is_active, created_at) VALUES

-- === SONA MASOORI RICE (currently 1 → adding 2 more = 3 total) ===
('a2000001-0000-0000-0000-000000000001','f2000001-0000-0000-0000-000000000002','Sona Masoori Rice','grains',  55,'kg',600,'Double-boiled Sona Masoori, low GI',                 'Nalgonda',   TRUE, TRUE,'2026-03-05 10:00:00'),
('a2000001-0000-0000-0000-000000000002','f2000001-0000-0000-0000-000000000005','Sona Masoori Rice','grains',  49,'kg',750,'Fresh-milled single polish, pesticide-free',          'Medak',      FALSE,TRUE,'2026-03-10 10:00:00'),

-- === TOOR DAL (currently 1 → adding 2 more = 3 total) ===
('a2000001-0000-0000-0000-000000000003','f2000001-0000-0000-0000-000000000003','Toor Dal',        'pulses', 125,'kg',280,'Bold-grained Warangal toor, minimal splits',          'Warangal',   TRUE, TRUE,'2026-03-06 09:00:00'),
('a2000001-0000-0000-0000-000000000004','f2000001-0000-0000-0000-000000000004','Toor Dal',        'pulses', 118,'kg',320,'Machine-cleaned, free of stones',                    'Karimnagar', FALSE,TRUE,'2026-03-09 09:00:00'),

-- === OYSTER MUSHROOMS (currently 1 seed + 1 typo-fixed = 2 → adding 1 more = 3 total) ===
('a2000001-0000-0000-0000-000000000005','f2000001-0000-0000-0000-000000000001','Oyster Mushrooms','mushrooms',160,'kg',45,'Freshly harvested, grown on wood substrate',          'Khammam',    FALSE,TRUE,'2026-03-02 08:00:00'),

-- === URAD DAL (currently 1 → adding 2 more = 3 total) ===
('a2000001-0000-0000-0000-000000000006','f2000001-0000-0000-0000-000000000003','Urad Dal',        'pulses',  98,'kg',300,'Whole black gram, machine-sorted',                   'Warangal',   FALSE,TRUE,'2026-03-07 09:00:00'),
('a2000001-0000-0000-0000-000000000007','f2000001-0000-0000-0000-000000000004','Urad Dal',        'pulses', 110,'kg',250,'Split urad, idli-grade quality',                     'Karimnagar', TRUE, TRUE,'2026-03-09 10:00:00'),

-- === GUNTUR RED CHILLI (currently 1 → adding 2 more = 3 total) ===
('a2000001-0000-0000-0000-000000000008','f2000001-0000-0000-0000-000000000001','Guntur Red Chilli','spices',185,'kg',130,'S4 grade, bold pods, APMC certified',                'Khammam',    FALSE,TRUE,'2026-03-03 10:00:00'),
('a2000001-0000-0000-0000-000000000009','f2000001-0000-0000-0000-000000000005','Guntur Red Chilli','spices',210,'kg',100,'Extra-hot variety, hand-picked',                     'Medak',      FALSE,TRUE,'2026-03-11 09:00:00'),

-- === RAW TURMERIC (currently 1 → adding 2 more = 3 total) ===
('a2000001-0000-0000-0000-000000000010','f2000001-0000-0000-0000-000000000002','Raw Turmeric',    'spices',  75,'kg',180,'Duggirala variety, 4.5% curcumin',                  'Nalgonda',   TRUE, TRUE,'2026-03-04 09:00:00'),
('a2000001-0000-0000-0000-000000000011','f2000001-0000-0000-0000-000000000003','Raw Turmeric',    'spices',  85,'kg',150,'Organic certified, no chemical spray',               'Warangal',   TRUE, TRUE,'2026-03-06 10:00:00'),

-- === RED ONIONS (currently 1 → adding 2 more = 3 total) ===
('a2000001-0000-0000-0000-000000000012','f2000001-0000-0000-0000-000000000001','Red Onions',      'vegetables',22,'kg',800,'Medium-large bulbs, good shelf life',               'Khammam',    FALSE,TRUE,'2026-03-02 09:00:00'),
('a2000001-0000-0000-0000-000000000013','f2000001-0000-0000-0000-000000000004','Red Onions',      'vegetables',28,'kg',600,'Washed and graded, direct from cold storage',        'Karimnagar', FALSE,TRUE,'2026-03-08 09:00:00'),

-- === ORGANIC TOMATOES (currently 1 → adding 2 more = 3 total) ===
('a2000001-0000-0000-0000-000000000014','f2000001-0000-0000-0000-000000000002','Organic Tomatoes','vegetables',40,'kg',350,'Hybrid desi variety, no pesticide',                'Nalgonda',   TRUE, TRUE,'2026-03-05 08:00:00'),
('a2000001-0000-0000-0000-000000000015','f2000001-0000-0000-0000-000000000005','Organic Tomatoes','vegetables',32,'kg',420,'Round red, harvested every 3 days',                'Medak',      TRUE, TRUE,'2026-03-10 08:00:00'),

-- === FOREST WILD HONEY (currently 1 → adding 2 more = 3 total) ===
('a2000001-0000-0000-0000-000000000016','f2000001-0000-0000-0000-000000000001','Forest Wild Honey','honey',  420,'litre',60,'Tribal collected, raw, unheated, no additives',   'Khammam',    TRUE, TRUE,'2026-03-03 11:00:00'),
('a2000001-0000-0000-0000-000000000017','f2000001-0000-0000-0000-000000000003','Forest Wild Honey','honey',  480,'litre',40,'Multi-floral, tested for purity at NGRI Hyderabad','Warangal',   TRUE, TRUE,'2026-03-07 11:00:00'),

-- === COUNTRY EGGS (currently 1 → adding 2 more = 3 total) ===
('a2000001-0000-0000-0000-000000000018','f2000001-0000-0000-0000-000000000004','Country Eggs',    'eggs',     9,'piece',400,'Kadaknath breed, rich in protein',                 'Karimnagar', FALSE,TRUE,'2026-03-09 08:00:00'),
('a2000001-0000-0000-0000-000000000019','f2000001-0000-0000-0000-000000000002','Country Eggs',    'eggs',     7,'piece',600,'Desi hen, open-range farming',                    'Nalgonda',   FALSE,TRUE,'2026-03-05 08:30:00'),

-- === MOONG DAL (currently 1 → adding 2 more = 3 total) ===
('a2000001-0000-0000-0000-000000000020','f2000001-0000-0000-0000-000000000004','Moong Dal',       'pulses', 115,'kg',200,'Yellow split moong, khichdi grade',                  'Karimnagar', TRUE, TRUE,'2026-03-08 10:00:00'),
('a2000001-0000-0000-0000-000000000021','f2000001-0000-0000-0000-000000000001','Moong Dal',       'pulses', 108,'kg',250,'Whole green moong, sproutable',                      'Khammam',    FALSE,TRUE,'2026-03-02 10:00:00'),

-- === CHANA DAL (currently 1 → adding 2 more = 3 total) ===
('a2000001-0000-0000-0000-000000000022','f2000001-0000-0000-0000-000000000005','Chana Dal',       'pulses',  95,'kg',350,'Bold-grained split chickpea',                        'Medak',      FALSE,TRUE,'2026-03-10 09:00:00'),
('a2000001-0000-0000-0000-000000000023','f2000001-0000-0000-0000-000000000003','Chana Dal',       'pulses', 105,'kg',300,'Desi chana variety, handpicked',                     'Warangal',   TRUE, TRUE,'2026-03-06 09:30:00'),

-- === BPT RICE (currently 1 → adding 2 more = 3 total) ===
('a2000001-0000-0000-0000-000000000024','f2000001-0000-0000-0000-000000000003','BPT Rice',        'grains',  52,'kg',450,'Soft-cooked variety, single polish',                 'Warangal',   FALSE,TRUE,'2026-03-07 10:00:00'),
('a2000001-0000-0000-0000-000000000025','f2000001-0000-0000-0000-000000000004','BPT Rice',        'grains',  45,'kg',500,'Fine-grained, traditional milling',                  'Karimnagar', TRUE, TRUE,'2026-03-09 11:00:00')

ON CONFLICT (id) DO NOTHING;

-- ── VERIFY ───────────────────────────────────────────────────
SELECT
  LOWER(name)      AS product,
  COUNT(*)::int    AS seller_count,
  MIN(price)       AS min_price,
  MAX(price)       AS max_price
FROM products
WHERE is_active = TRUE
GROUP BY LOWER(name)
ORDER BY seller_count DESC, product ASC;
