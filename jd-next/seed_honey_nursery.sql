-- =============================================================
-- Jeevadhara — Honey (7 varieties × 3 farmers) + Nursery (8 plants × 3 dealers)
-- Run as jeevadhara_iam
-- Adds to existing products table
-- is_active = FALSE by default → admin approves before listing
-- (set TRUE here for demo data)
-- =============================================================

INSERT INTO products (id, farmer_id, name, category, price, unit, stock, description, image_url, district, is_organic, is_active, created_at) VALUES

-- ═══════════════════════════════════════════════════
-- HONEY PRODUCTS (category = 'honey')
-- ═══════════════════════════════════════════════════

-- Raw Forest Honey (already have Forest Wild Honey — adding 2 more to ensure 3)
('h1000001-0000-0000-0000-000000000001','f1000001-0000-0000-0000-000000000001','Raw Forest Honey','honey',780,'kg',40,'Single-origin forest honey, collected from Adilabad forests. Dark amber, thick, unheated. Rich minerals and enzymes intact.','/beekeeping/raw-honey.jpg','Ranga Reddy',TRUE,TRUE,'2026-04-10 09:00:00'),
('h1000001-0000-0000-0000-000000000002','f1000002-0000-0000-0000-000000000001','Raw Forest Honey','honey',820,'kg',30,'Wild honey from Khammam forest belt. Collected by tribal bee farmers. No additives, no heating. NMR tested.','/beekeeping/raw-honey.jpg','Nizamabad',TRUE,TRUE,'2026-04-12 10:00:00'),
('h1000001-0000-0000-0000-000000000003','f2000001-0000-0000-0000-000000000003','Raw Forest Honey','honey',695,'kg',60,'Jungle honey from Bhadrachalam tribal belt. Collected twice a year. Crystallizes naturally in winter — sign of purity.','/beekeeping/raw-honey.jpg','Warangal',TRUE,TRUE,'2026-04-15 09:00:00'),

-- Apis Cerana Honey
('h1000002-0000-0000-0000-000000000001','f1000003-0000-0000-0000-000000000001','Apis Cerana Honey','honey',1050,'kg',20,'Desi bee (Apis cerana) honey — smaller colonies, higher medicinal value. Light amber, mild floral taste. Rare variety.','/beekeeping/cerana.jpg','Nalgonda',TRUE,TRUE,'2026-04-10 10:00:00'),
('h1000002-0000-0000-0000-000000000002','f2000001-0000-0000-0000-000000000002','Apis Cerana Honey','honey',980,'kg',15,'Cerana honey from Medak district. Hand-harvested, natural log hives. Highly prized in Ayurveda. Limited seasonal stock.','/beekeeping/cerana.jpg','Medak',TRUE,TRUE,'2026-04-13 09:00:00'),
('h1000002-0000-0000-0000-000000000003','f2000001-0000-0000-0000-000000000004','Apis Cerana Honey','honey',1150,'kg',10,'Premium Cerana honey, certified organic. Rich in amino acids. Used in traditional medicine for cough and wounds.','/beekeeping/cerana.jpg','Karimnagar',TRUE,TRUE,'2026-04-16 10:00:00'),

-- Mellifera (Apis mellifera) Honey
('h1000003-0000-0000-0000-000000000001','f1000001-0000-0000-0000-000000000002','Mellifera Honey','honey',580,'kg',80,'Apis mellifera Italian bee honey — high yield variety, light golden color, mild taste. Good for cooking and health drinks.','/beekeeping/mellifera.jpg','Ranga Reddy',FALSE,TRUE,'2026-04-11 09:00:00'),
('h1000003-0000-0000-0000-000000000002','f1000002-0000-0000-0000-000000000002','Mellifera Honey','honey',620,'kg',60,'Commercial mellifera honey, multi-floral. From controlled box hives in Nizamabad. Export quality, food grade.','/beekeeping/mellifera.jpg','Nizamabad',FALSE,TRUE,'2026-04-14 10:00:00'),
('h1000003-0000-0000-0000-000000000003','f1000003-0000-0000-0000-000000000002','Mellifera Honey','honey',550,'kg',100,'Sunflower season mellifera honey, light and sweet. Crystallizes creamy white. Preferred for bakery and health foods.','/beekeeping/mellifera.jpg','Hyderabad',FALSE,TRUE,'2026-04-17 09:00:00'),

-- Raw Honeycomb
('h1000004-0000-0000-0000-000000000001','f1000001-0000-0000-0000-000000000003','Raw Honeycomb','honey',1200,'kg',15,'Fresh natural honeycomb, straight from hive. Beeswax cells intact. Eat comb and honey together — maximum nutrition.','/beekeeping/honeycomb.jpg','Ranga Reddy',TRUE,TRUE,'2026-04-10 11:00:00'),
('h1000004-0000-0000-0000-000000000002','f2000001-0000-0000-0000-000000000005','Raw Honeycomb','honey',1350,'kg',10,'Wild honeycomb from Medak. Comb intact with propolis lining. Natural preservation. Gift-pack available on request.','/beekeeping/honeycomb.jpg','Medak',TRUE,TRUE,'2026-04-13 10:00:00'),
('h1000004-0000-0000-0000-000000000003','f1000003-0000-0000-0000-000000000003','Raw Honeycomb','honey',1100,'kg',20,'Honeycomb from managed Cerana hives. Uniform cell size, clean harvest. Popular for wedding and festival gifting.','/beekeeping/honeycomb.jpg','Warangal',TRUE,TRUE,'2026-04-16 09:00:00'),

-- Propolis Extract
('h1000005-0000-0000-0000-000000000001','f2000001-0000-0000-0000-000000000001','Propolis Extract','honey',2800,'100ml',8,'30% propolis extract in food-grade alcohol. Antimicrobial, anti-inflammatory. Used for throat spray and wound care.','/beekeeping/propolis.jpg','Khammam',TRUE,TRUE,'2026-04-11 10:00:00'),
('h1000005-0000-0000-0000-000000000002','f2000001-0000-0000-0000-000000000002','Propolis Extract','honey',3100,'100ml',5,'Premium 35% extract. Lab-tested for flavonoid content. Batch tested, certified. Popular with herbalists and pharmacies.','/beekeeping/propolis.jpg','Medak',TRUE,TRUE,'2026-04-14 09:00:00'),
('h1000005-0000-0000-0000-000000000003','f2000001-0000-0000-0000-000000000004','Propolis Extract','honey',2600,'100ml',12,'Water-based propolis extract (alcohol-free). For children and those avoiding alcohol. 25% concentration.','/beekeeping/propolis.jpg','Karimnagar',TRUE,TRUE,'2026-04-17 10:00:00'),

-- Pure Beeswax
('h1000006-0000-0000-0000-000000000001','f1000001-0000-0000-0000-000000000004','Pure Beeswax','honey',1200,'kg',12,'Food-grade beeswax, triple-filtered. Used for wrapping, cosmetics, candle-making and wood polish. Natural golden color.','/beekeeping/beewax.jpg','Ranga Reddy',TRUE,TRUE,'2026-04-10 09:30:00'),
('h1000006-0000-0000-0000-000000000002','f1000002-0000-0000-0000-000000000004','Pure Beeswax','honey',1350,'kg',8,'Cosmetic grade beeswax, bleached white. Used in lip balms, creams, and pharmaceutical bases. Certificate available.','/beekeeping/beewax.jpg','Nizamabad',TRUE,TRUE,'2026-04-13 11:00:00'),
('h1000006-0000-0000-0000-000000000003','f1000003-0000-0000-0000-000000000004','Pure Beeswax','honey',1100,'kg',20,'Raw beeswax blocks direct from hive, unfiltered. For DIY cosmetics and beeswax wraps. Natural yellow, strong honey scent.','/beekeeping/beewax.jpg','Khammam',TRUE,TRUE,'2026-04-16 11:00:00'),

-- Royal Jelly
('h1000007-0000-0000-0000-000000000001','f2000001-0000-0000-0000-000000000005','Royal Jelly','honey',4200,'100g',5,'Fresh royal jelly, frozen immediately after harvest. 10-HDA >2%. Stored at -18C. Anti-aging, energy, immunity.','/beekeeping/royal-jelly.jpg','Medak',TRUE,TRUE,'2026-04-11 11:00:00'),
('h1000007-0000-0000-0000-000000000002','f1000001-0000-0000-0000-000000000005','Royal Jelly','honey',4800,'100g',3,'Premium fresh royal jelly, collected from queen cells. Lab tested for freshness and 10-HDA content. Cold chain delivery.','/beekeeping/royal-jelly.jpg','Ranga Reddy',TRUE,TRUE,'2026-04-14 11:00:00'),
('h1000007-0000-0000-0000-000000000003','f1000002-0000-0000-0000-000000000005','Royal Jelly','honey',3900,'100g',8,'Lyophilized (freeze-dried) royal jelly powder, 1g equivalent per capsule. 6-month shelf life at room temperature.','/beekeeping/royal-jelly.jpg','Nizamabad',TRUE,TRUE,'2026-04-17 11:00:00'),

-- ═══════════════════════════════════════════════════
-- NURSERY PLANTS (category = 'nursery')
-- ═══════════════════════════════════════════════════

-- Alphonso Mango Sapling
('n1000001-0000-0000-0000-000000000001','f1000001-0000-0000-0000-000000000001','Alphonso Mango Sapling','nursery',320,'plant',500,'Grafted 2yr Alphonso mango sapling. GI-certified variety. Fruits in 3–4 years. High export demand. Min 10 plants.',NULL,'Ranga Reddy',TRUE,TRUE,'2026-04-20 09:00:00'),
('n1000001-0000-0000-0000-000000000002','f1000002-0000-0000-0000-000000000001','Alphonso Mango Sapling','nursery',365,'plant',300,'Alphonso sapling, 2.5yr old grafted, earlier fruiting in 2.5yrs. Polybag grown. Root system intact.',NULL,'Nizamabad',TRUE,TRUE,'2026-04-22 09:00:00'),
('n1000001-0000-0000-0000-000000000003','f2000001-0000-0000-0000-000000000003','Alphonso Mango Sapling','nursery',280,'plant',800,'Budget Alphonso saplings. 1.5yr grafted, healthy. Ideal for large plantation setup. Transport arranged for 100+ plants.',NULL,'Warangal',TRUE,TRUE,'2026-04-25 09:00:00'),

-- G9 Banana Tissue Culture
('n1000002-0000-0000-0000-000000000001','f1000003-0000-0000-0000-000000000001','G9 Banana TC Plant','nursery',38,'plant',2000,'Disease-free G9 tissue culture banana. 9–11 month crop cycle. 40–50 kg bunch. High market demand. Min 100 plants.',NULL,'Nalgonda',FALSE,TRUE,'2026-04-20 10:00:00'),
('n1000002-0000-0000-0000-000000000002','f2000001-0000-0000-0000-000000000002','G9 Banana TC Plant','nursery',42,'plant',1500,'Certified TC G9 banana from accredited lab. Hardened nursery plant, 3-week field-ready. Vigor guaranteed.',NULL,'Medak',FALSE,TRUE,'2026-04-23 09:00:00'),
('n1000002-0000-0000-0000-000000000003','f2000001-0000-0000-0000-000000000004','G9 Banana TC Plant','nursery',35,'plant',3000,'Bulk supplier of G9 TC plants. 10,000+ plants available. Delivery across Telangana. Price negotiable for 500+ quantity.',NULL,'Karimnagar',FALSE,TRUE,'2026-04-26 09:00:00'),

-- West Coast Tall Coconut
('n1000003-0000-0000-0000-000000000001','f1000001-0000-0000-0000-000000000002','West Coast Tall Coconut','nursery',120,'plant',800,'8-month pre-germinated West Coast Tall seedling. 80–100 nuts/year. 50yr productive life. ICAR-certified planting material.',NULL,'Ranga Reddy',FALSE,TRUE,'2026-04-21 09:00:00'),
('n1000003-0000-0000-0000-000000000002','f1000002-0000-0000-0000-000000000002','West Coast Tall Coconut','nursery',145,'plant',500,'Mature 10-month coconut seedling, ready to transplant. Disease-resistant. Govt nursery certified. Min 25 plants.',NULL,'Nizamabad',FALSE,TRUE,'2026-04-24 10:00:00'),
('n1000003-0000-0000-0000-000000000003','f1000003-0000-0000-0000-000000000002','West Coast Tall Coconut','nursery',105,'plant',1200,'Bulk coconut seedlings, 6-month stage. Suitable for PMKSY plantation subsidy. Documents available.',NULL,'Hyderabad',FALSE,TRUE,'2026-04-27 09:00:00'),

-- Teak Sapling
('n1000004-0000-0000-0000-000000000001','f1000001-0000-0000-0000-000000000003','Teak Sapling 1yr','nursery',48,'plant',2000,'Forest department certified teak sapling 1yr. High-quality timber investment. ₹2000+/CFT after 15yr. Min 100 plants.',NULL,'Ranga Reddy',FALSE,TRUE,'2026-04-21 10:00:00'),
('n1000004-0000-0000-0000-000000000002','f2000001-0000-0000-0000-000000000005','Teak Sapling 1yr','nursery',55,'plant',1500,'Clone teak saplings, faster growth than seedling teak. 12–15 year harvest cycle. Clonal material from MP research station.',NULL,'Medak',FALSE,TRUE,'2026-04-24 09:00:00'),
('n1000004-0000-0000-0000-000000000003','f1000003-0000-0000-0000-000000000003','Teak Sapling 1yr','nursery',38,'plant',5000,'Large-scale teak seedling supplier. 50,000 plants/batch. Forest dept approved nursery. Transport arranged across TS.',NULL,'Warangal',FALSE,TRUE,'2026-04-27 10:00:00'),

-- Moringa PKM-1
('n1000005-0000-0000-0000-000000000001','f2000001-0000-0000-0000-000000000001','Moringa PKM-1','nursery',28,'plant',3000,'PKM-1 drumstick sapling, grafted variety. Flowers in 6 months. Rich in iron and vitamins. High export demand for leaves.',NULL,'Khammam',TRUE,TRUE,'2026-04-21 11:00:00'),
('n1000005-0000-0000-0000-000000000002','f2000001-0000-0000-0000-000000000002','Moringa PKM-1','nursery',32,'plant',2000,'Moringa PKM-2 dual-purpose (leaves + drumsticks). 5yr life. Low water requirement, suitable for dry zones.',NULL,'Medak',TRUE,TRUE,'2026-04-24 11:00:00'),
('n1000005-0000-0000-0000-000000000003','f2000001-0000-0000-0000-000000000004','Moringa PKM-1','nursery',22,'plant',5000,'Budget PKM-1 seedlings, 2-month-old. Direct from farm nursery. Min 100 plants, delivery included for 500+.',NULL,'Karimnagar',TRUE,TRUE,'2026-04-27 11:00:00'),

-- Custard Apple (Sitaphal) NA-1
('n1000006-0000-0000-0000-000000000001','f1000001-0000-0000-0000-000000000004','Sitaphal NA-1','nursery',185,'plant',400,'Grafted NA-1 custard apple. Fruits in 2–3 years. ₹60–80/kg farm gate price. Minimal spray requirement.',NULL,'Ranga Reddy',FALSE,TRUE,'2026-04-22 09:00:00'),
('n1000006-0000-0000-0000-000000000002','f1000002-0000-0000-0000-000000000004','Sitaphal NA-1','nursery',220,'plant',250,'Premium NA-1 grafts, 2.5yr old, ready to transplant. Fruits in 1st season itself. High success rate.',NULL,'Nizamabad',FALSE,TRUE,'2026-04-25 09:00:00'),
('n1000006-0000-0000-0000-000000000003','f1000003-0000-0000-0000-000000000004','Sitaphal NA-1','nursery',155,'plant',600,'Budget NA-1 saplings 1.5yr. Good for medium plantation 1–3 acres. Village-level nursery, fresh stock.',NULL,'Khammam',FALSE,TRUE,'2026-04-28 09:00:00'),

-- Amla NA-7
('n1000007-0000-0000-0000-000000000001','f2000001-0000-0000-0000-000000000005','Amla NA-7','nursery',85,'plant',600,'NA-7 amla grafted sapling. High Vitamin C (600mg/100g). Strong pharmaceutical demand. Drought tolerant.',NULL,'Medak',FALSE,TRUE,'2026-04-22 10:00:00'),
('n1000007-0000-0000-0000-000000000002','f1000001-0000-0000-0000-000000000005','Amla NA-7','nursery',105,'plant',400,'2yr old NA-7 amla. Fruits in 2nd year. Processed amla (candy, juice, pickle) adds value. Min 20 plants.',NULL,'Ranga Reddy',FALSE,TRUE,'2026-04-25 10:00:00'),
('n1000007-0000-0000-0000-000000000003','f1000002-0000-0000-0000-000000000005','Amla NA-7','nursery',70,'plant',1000,'Budget amla saplings 1yr. Certified clonal material. Ideal for PMKSY horticulture scheme. Subsidy docs arranged.',NULL,'Nizamabad',FALSE,TRUE,'2026-04-28 10:00:00'),

-- L-49 Guava
('n1000008-0000-0000-0000-000000000001','f1000001-0000-0000-0000-000000000005','L-49 Guava','nursery',75,'plant',800,'Lucknow-49 guava grafted. Sweet seedless pulp, 2 crops/year. High market demand in Hyderabad wholesale.',NULL,'Ranga Reddy',FALSE,TRUE,'2026-04-22 11:00:00'),
('n1000008-0000-0000-0000-000000000002','f2000001-0000-0000-0000-000000000001','L-49 Guava','nursery',90,'plant',500,'Premium L-49 grafts 2yr old, ready to bear. Pink-flesh variety also available. Min 25 plants.',NULL,'Khammam',FALSE,TRUE,'2026-04-25 11:00:00'),
('n1000008-0000-0000-0000-000000000003','f2000001-0000-0000-0000-000000000003','L-49 Guava','nursery',62,'plant',1200,'Bulk L-49 seedlings 1yr. Farm nursery direct. Transport to Hyderabad arranged every weekend.',NULL,'Warangal',FALSE,TRUE,'2026-04-28 11:00:00')

ON CONFLICT (id) DO NOTHING;

-- ── VERIFY ────────────────────────────────────────────────────
SELECT category, MIN(name) AS product, COUNT(*)::int AS sellers, MIN(price) AS min_p, MAX(price) AS max_p
FROM products WHERE is_active = TRUE AND category IN ('honey','nursery')
GROUP BY category, LOWER(name)
ORDER BY category, MIN(name);
