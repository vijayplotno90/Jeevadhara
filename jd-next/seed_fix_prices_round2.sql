-- =============================================================
-- Jeevadhara — Fix Bad Price + Add 3 sellers for remaining 9 products
-- =============================================================

-- ── FIX: Bad price entry (₹90,000 is clearly wrong — deactivate it) ──
UPDATE products
SET is_active = FALSE
WHERE LOWER(name) = 'guntur red chilli'
  AND price > 10000;

-- ── ADD MORE SELLERS FOR REMAINING 9 SINGLE-SELLER PRODUCTS ──
-- Reusing existing farmers (f1000001-... f2000001-...) for variety
-- New product IDs: a3000001-...

INSERT INTO products (id, farmer_id, name, category, price, unit, stock, description, district, is_organic, is_active, created_at) VALUES

-- === BLACK SESAME (add 2 more → 3 total) ===
('a3000001-0000-0000-0000-000000000001','f2000001-0000-0000-0000-000000000002','Black Sesame','grains',  88,'kg',180,'White-hulled black sesame, high oil content',         'Nalgonda',   FALSE,TRUE,'2026-03-05 10:30:00'),
('a3000001-0000-0000-0000-000000000002','f2000001-0000-0000-0000-000000000004','Black Sesame','grains',  95,'kg',150,'Organic black til, hand-threshed',                    'Karimnagar', TRUE, TRUE,'2026-03-08 10:30:00'),

-- === BOTTLE GOURD (add 2 more → 3 total) ===
('a3000001-0000-0000-0000-000000000003','f2000001-0000-0000-0000-000000000003','Bottle Gourd','vegetables',18,'kg',400,'Tender long variety, no wax coating',               'Warangal',   FALSE,TRUE,'2026-03-06 08:30:00'),
('a3000001-0000-0000-0000-000000000004','f2000001-0000-0000-0000-000000000005','Bottle Gourd','vegetables',22,'kg',350,'Round sorakaya, freshly harvested morning',          'Medak',      FALSE,TRUE,'2026-03-10 08:30:00'),

-- === DRY RED CHILLI (add 2 more → 3 total) ===
('a3000001-0000-0000-0000-000000000005','f2000001-0000-0000-0000-000000000001','Dry Red Chilli','spices',175,'kg',180,'Byadagi variety, mild heat, rich red colour',        'Khammam',    FALSE,TRUE,'2026-03-02 10:30:00'),
('a3000001-0000-0000-0000-000000000006','f2000001-0000-0000-0000-000000000003','Dry Red Chilli','spices',190,'kg',160,'Teja variety, high heat, dry and wrinkle-free',       'Warangal',   FALSE,TRUE,'2026-03-07 10:00:00'),

-- === GREEN CHILLIES (add 2 more → 3 total) ===
('a3000001-0000-0000-0000-000000000007','f2000001-0000-0000-0000-000000000002','Green Chillies','vegetables',35,'kg',200,'Jwala variety, thin and very hot',                'Nalgonda',   FALSE,TRUE,'2026-03-04 09:00:00'),
('a3000001-0000-0000-0000-000000000008','f2000001-0000-0000-0000-000000000004','Green Chillies','vegetables',45,'kg',150,'Bullet chilli, medium heat, thick flesh',          'Karimnagar', FALSE,TRUE,'2026-03-09 09:00:00'),

-- === GROUNDNUTS (add 2 more → 3 total) ===
('a3000001-0000-0000-0000-000000000009','f2000001-0000-0000-0000-000000000001','Groundnuts','grains',   75,'kg',350,'Red-skin variety, roasting grade',                     'Khammam',    FALSE,TRUE,'2026-03-03 09:30:00'),
('a3000001-0000-0000-0000-000000000010','f2000001-0000-0000-0000-000000000005','Groundnuts','grains',   85,'kg',300,'Bold-kernelled, oil-extraction grade',                 'Medak',      FALSE,TRUE,'2026-03-11 09:30:00'),

-- === JOWAR (add 2 more → 3 total) ===
('a3000001-0000-0000-0000-000000000011','f2000001-0000-0000-0000-000000000002','Jowar','grains',        32,'kg',700,'White jowar, roti and bhakri grade',                   'Nalgonda',   TRUE, TRUE,'2026-03-05 09:00:00'),
('a3000001-0000-0000-0000-000000000012','f2000001-0000-0000-0000-000000000003','Jowar','grains',        38,'kg',550,'Maldandi variety, sweet and soft',                     'Warangal',   TRUE, TRUE,'2026-03-06 09:30:00'),

-- === MORINGA LEAVES (add 2 more → 3 total) ===
('a3000001-0000-0000-0000-000000000013','f2000001-0000-0000-0000-000000000004','Moringa Leaves','vegetables',55,'kg',120,'Young tender leaves, plucked weekly',            'Karimnagar', TRUE, TRUE,'2026-03-08 08:00:00'),
('a3000001-0000-0000-0000-000000000014','f2000001-0000-0000-0000-000000000001','Moringa Leaves','vegetables',65,'kg', 80,'Fully grown drumstick tree, no pesticide',        'Khammam',    TRUE, TRUE,'2026-03-02 08:00:00'),

-- === ORGANIC BRINJAL (add 2 more → 3 total) ===
('a3000001-0000-0000-0000-000000000015','f2000001-0000-0000-0000-000000000005','Organic Brinjal','vegetables',28,'kg',280,'Long green variety, no chemical spray',           'Medak',      TRUE, TRUE,'2026-03-10 08:30:00'),
('a3000001-0000-0000-0000-000000000016','f2000001-0000-0000-0000-000000000002','Organic Brinjal','vegetables',32,'kg',220,'Round purple, picked at peak freshness',          'Nalgonda',   TRUE, TRUE,'2026-03-04 08:30:00'),

-- === SUNFLOWER MICROGREENS (add 2 more → 3 total) ===
('a3000001-0000-0000-0000-000000000017','f2000001-0000-0000-0000-000000000003','Sunflower Microgreens','vegetables',200,'kg',25,'8-day harvested, soil-grown, nutrient dense','Warangal', TRUE, TRUE,'2026-03-07 09:00:00'),
('a3000001-0000-0000-0000-000000000018','f2000001-0000-0000-0000-000000000004','Sunflower Microgreens','vegetables',240,'kg',20,'Hydroponic tray grown, pesticide-free',     'Karimnagar', TRUE, TRUE,'2026-03-09 09:30:00')

ON CONFLICT (id) DO NOTHING;

-- ── FINAL VERIFY ─────────────────────────────────────────────
SELECT
  MIN(name)        AS product_name,
  COUNT(*)::int    AS seller_count,
  MIN(price)       AS min_price,
  MAX(price)       AS max_price
FROM products
WHERE is_active = TRUE
GROUP BY LOWER(name)
ORDER BY seller_count DESC, MIN(name) ASC;
