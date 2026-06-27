-- =============================================================
-- Jeevadhara — Livestock Table + Seed Data
-- 6 breeds × 3 sellers = 18 listings
-- Run in CloudShell after pushing to GitHub
-- =============================================================

-- ── CREATE TABLE ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS livestock (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id            TEXT NOT NULL,
  breed                TEXT NOT NULL,
  slug                 TEXT NOT NULL,
  category             TEXT NOT NULL CHECK (category IN ('cattle','buffalo','poultry','sheep','fish')),

  -- Animal identity
  age_years            INT DEFAULT 0,
  age_months           INT DEFAULT 0,
  color                TEXT,
  body_weight_kg       NUMERIC,

  -- Production details
  milk_liters_per_day  NUMERIC,
  lactation_number     INT,
  last_calving_date    DATE,
  eggs_per_year        INT,

  -- Health
  health_condition     TEXT DEFAULT 'Good',
  vaccination_status   TEXT DEFAULT 'Vaccinated',
  disease_history      TEXT DEFAULT 'None',

  -- Vet certification (filled by admin after vet inspection)
  is_vet_certified     BOOLEAN DEFAULT FALSE,
  vet_notes            TEXT,
  vet_certified_date   DATE,

  -- Listing
  price                NUMERIC NOT NULL,
  unit                 TEXT DEFAULT 'head',
  quantity_available   INT DEFAULT 1,
  description          TEXT,
  image_url            TEXT,

  -- Location
  district             TEXT,
  village              TEXT,

  -- Status
  is_active            BOOLEAN DEFAULT FALSE,
  created_at           TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_livestock_slug     ON livestock(slug);
CREATE INDEX IF NOT EXISTS idx_livestock_farmer   ON livestock(farmer_id);
CREATE INDEX IF NOT EXISTS idx_livestock_category ON livestock(category);
CREATE INDEX IF NOT EXISTS idx_livestock_active   ON livestock(is_active);

-- ── SEED: 6 BREEDS × 3 SELLERS ───────────────────────────────

INSERT INTO livestock (
  id, farmer_id, breed, slug, category,
  age_years, age_months, color, body_weight_kg,
  milk_liters_per_day, lactation_number, last_calving_date,
  health_condition, vaccination_status, disease_history,
  is_vet_certified, vet_notes, vet_certified_date,
  price, unit, quantity_available, description, image_url,
  district, village, is_active, created_at
) VALUES

-- ======= GIR COW (cattle) — 3 sellers =======
(
  'b1000001-0000-0000-0000-000000000001',
  'f1000001-0000-0000-0000-000000000001',
  'Gir Cow','gir-cow','cattle',
  4, 2, 'Reddish-brown with white patches', 385,
  11.5, 2, '2025-11-10',
  'Excellent','Vaccinated - FMD, BQ, HS','None',
  TRUE,
  'Healthy lactating cow. 11.5L/day average over 3 weeks. Good udder conformation. A2 milk confirmed. Fit for sale.',
  '2026-05-15',
  68000,'head',1,
  'Pure Gir breed from registered bloodline. Calm temperament, easy milking. 2 calvings completed. A2 milk — ideal for small family farms and gaushalas.',
  '/livestock/gir1.png',
  'Nalgonda','Solipeta',TRUE,'2026-04-01 09:00:00'
),
(
  'b1000001-0000-0000-0000-000000000002',
  'f1000001-0000-0000-0000-000000000003',
  'Gir Cow','gir-cow','cattle',
  5, 0, 'Dark red with dappled white', 410,
  13.0, 3, '2025-09-20',
  'Excellent','Vaccinated - FMD, BQ, HS, Brucellosis','None',
  TRUE,
  'Third lactation cow, peak production 13L/day. Brucellosis tested negative. Excellent A2 milk. Highly recommended.',
  '2026-05-18',
  72000,'head',1,
  'Third lactation Gir cow with consistent 13L/day production. Brucellosis-free certification. Known for rich, creamy A2 milk. Ideal for dairy startups.',
  '/livestock/gir1.png',
  'Warangal','Hanamkonda',TRUE,'2026-04-05 09:00:00'
),
(
  'b1000001-0000-0000-0000-000000000003',
  'f1000001-0000-0000-0000-000000000006',
  'Gir Cow','gir-cow','cattle',
  3, 6, 'Golden-red uniform coat', 360,
  9.5, 1, '2025-12-15',
  'Good','Vaccinated - FMD, BQ, HS','Mild tick infestation treated in 2025',
  TRUE,
  'First lactation heifer. 9.5L/day. Treated for ticks in March 2025, fully recovered. Good temperament.',
  '2026-05-20',
  58000,'head',1,
  'Young Gir cow in first lactation. Treated and cleared tick issue in 2025. Gentle, easy to manage. Good long-term investment for A2 dairy.',
  '/livestock/gir1.png',
  'Medak','Siddipet',TRUE,'2026-04-08 09:00:00'
),

-- ======= MURRAH BUFFALO (buffalo) — 3 sellers =======
(
  'b1000001-0000-0000-0000-000000000004',
  'f1000001-0000-0000-0000-000000000002',
  'Murrah Buffalo','murrah-buffalo','buffalo',
  5, 3, 'Jet black, curled horns', 540,
  13.5, 3, '2025-10-05',
  'Excellent','Vaccinated - FMD, HS, BQ','None',
  TRUE,
  'High-producing Murrah, 3rd lactation, 13.5L/day. Fat content 7.2%. Ideal for paneer and ghee production. Brucellosis-free.',
  '2026-05-12',
  95000,'head',1,
  'Top-performing Murrah buffalo, 3rd lactation, 13.5L/day with 7.2% fat. Perfect for dairy processing — paneer, ghee, and curd. Disease-free record.',
  '/livestock/murrah.png',
  'Karimnagar','Peddapalli',TRUE,'2026-04-02 09:00:00'
),
(
  'b1000001-0000-0000-0000-000000000005',
  'f1000001-0000-0000-0000-000000000004',
  'Murrah Buffalo','murrah-buffalo','buffalo',
  6, 0, 'Shiny black, medium horns', 580,
  15.0, 4, '2025-08-12',
  'Excellent','Vaccinated - FMD, HS, BQ, Brucellosis','None',
  TRUE,
  'Elite Murrah. 4th lactation. 15L/day peak. 7.5% fat. Consistently highest producer in the herd. Award-winning lineage.',
  '2026-05-15',
  110000,'head',1,
  'Elite Murrah buffalo, 4th lactation, peak 15L/day. Award-winning herd lineage from Nizamabad. Exceptionally high 7.5% fat milk for premium dairy products.',
  '/livestock/murrah.png',
  'Nizamabad','Bodhan',TRUE,'2026-04-03 09:00:00'
),
(
  'b1000001-0000-0000-0000-000000000006',
  'f2000001-0000-0000-0000-000000000001',
  'Murrah Buffalo','murrah-buffalo','buffalo',
  4, 0, 'Black, compact body', 490,
  11.0, 2, '2025-11-20',
  'Good','Vaccinated - FMD, HS, BQ','Minor respiratory issue treated Jan 2026',
  TRUE,
  '2nd lactation Murrah. 11L/day. Respiratory issue Jan 2026 fully resolved, confirmed healthy. Good for small to medium dairy operation.',
  '2026-05-20',
  80000,'head',1,
  '2nd lactation Murrah buffalo, 11L/day. Fully recovered from minor respiratory issue (Jan 2026). Vet-cleared. Ideal for smaller dairy or family use.',
  '/livestock/murrah.png',
  'Khammam','Bhadrachalam',TRUE,'2026-04-10 09:00:00'
),

-- ======= JERSEY CROSS (cattle) — 3 sellers =======
(
  'b1000001-0000-0000-0000-000000000007',
  'f1000001-0000-0000-0000-000000000007',
  'Jersey Cross','jersey-cross','cattle',
  4, 6, 'Fawn with white face marking', 350,
  18.0, 2, '2025-10-18',
  'Excellent','Vaccinated - FMD, BQ, HS','None',
  TRUE,
  'Jersey × Sahiwal cross. 18L/day, 2nd lactation. High fat content 5.2%. Best for commercial dairy. Excellent feed conversion.',
  '2026-05-10',
  52000,'head',1,
  'Jersey × Sahiwal cross — best of both worlds. 18L/day commercial yield with 5.2% fat. Ideal for small dairy farms in Telangana climate.',
  '/livestock/jerseycross1.png',
  'Khammam','Kothagudem',TRUE,'2026-04-05 09:00:00'
),
(
  'b1000001-0000-0000-0000-000000000008',
  'f1000001-0000-0000-0000-000000000009',
  'Jersey Cross','jersey-cross','cattle',
  3, 8, 'Light brown, white belly', 330,
  16.5, 1, '2025-12-01',
  'Good','Vaccinated - FMD, BQ, HS','None',
  TRUE,
  '1st lactation Jersey cross. 16.5L/day. Excellent heat tolerance. Easy calving. Good for beginners — calm and manageable.',
  '2026-05-14',
  45000,'head',1,
  'First lactation Jersey cross, 16.5L/day. Heat-tolerant, beginner-friendly. Easy milking, good temperament. Thrives on mixed feed without A/C housing.',
  '/livestock/jerseycross1.png',
  'Rangareddy','Shadnagar',TRUE,'2026-04-07 09:00:00'
),
(
  'b1000001-0000-0000-0000-000000000009',
  'f2000001-0000-0000-0000-000000000004',
  'Jersey Cross','jersey-cross','cattle',
  5, 2, 'Fawn-brown, compact frame', 375,
  20.0, 3, '2025-09-10',
  'Excellent','Vaccinated - FMD, BQ, HS, Brucellosis','None',
  TRUE,
  '3rd lactation. Peak 20L/day. Brucellosis-free. High yield with low feed cost. Strong constitution — no major health issues in 5 years.',
  '2026-05-18',
  60000,'head',1,
  '3rd lactation Jersey cross with peak 20L/day yield. 5 years clean health record. Brucellosis-free. Best ROI among crossbreeds in Karimnagar district.',
  '/livestock/jerseycross1.png',
  'Karimnagar','Peddapalli',TRUE,'2026-04-12 09:00:00'
),

-- ======= KADAKNATH (poultry) — 3 sellers =======
(
  'b1000001-0000-0000-0000-000000000010',
  'f1000001-0000-0000-0000-000000000005',
  'Kadaknath','kadaknath','poultry',
  0, 8, 'Jet black plumage and skin', NULL,
  NULL, NULL, NULL,
  'Good','Vaccinated - Newcastle, Marek''s','None',
  TRUE,
  'Batch of 12 hens, 8 months old. Laying 4–5 eggs/week. Eggs rich in protein (13g/egg). Fully vaccinated. Free-range raised.',
  '2026-05-08',
  950,'bird',12,
  'Indigenous Kadaknath breed, 8 months old laying hens. 80–100 eggs/year, protein-rich eggs ideal for medicinal and premium use. Free-range, open-air reared.',
  '/livestock/Kadaknath.webp',
  'Adilabad','Mancherial',TRUE,'2026-04-03 09:00:00'
),
(
  'b1000001-0000-0000-0000-000000000011',
  'f2000001-0000-0000-0000-000000000002',
  'Kadaknath','kadaknath','poultry',
  0, 6, 'Solid black, green sheen feathers', NULL,
  NULL, NULL, NULL,
  'Excellent','Vaccinated - Newcastle, Marek''s, IBD','None',
  TRUE,
  'Breeding-quality Kadaknath. 6-month pullets, 3 weeks from laying start. Excellent lineage, confirmed pure breed. Vaccinated triple dose.',
  '2026-05-10',
  850,'bird',20,
  'Pure Kadaknath pullets, 6 months, just entering lay. Premium bloodline verified. Ideal for breeding programs or organic egg farms. Triple vaccinated.',
  '/livestock/Kadaknath.webp',
  'Nalgonda','Devarkonda',TRUE,'2026-04-06 09:00:00'
),
(
  'b1000001-0000-0000-0000-000000000012',
  'f1000001-0000-0000-0000-000000000008',
  'Kadaknath','kadaknath','poultry',
  1, 0, 'Black body, copper hackles', NULL,
  NULL, NULL, NULL,
  'Excellent','Vaccinated - Newcastle, Marek''s','None',
  TRUE,
  '1-year old laying flock, 30 hens. Peak production, 5–6 eggs/week per bird. Eggs sold at ₹30–40 each. Strong disease resistance.',
  '2026-05-12',
  1100,'bird',30,
  'Peak-laying Kadaknath flock. 1 year old, 90–110 eggs/year. Currently selling eggs at ₹30–40 each. Strong immune system — ideal for organic poultry farms.',
  '/livestock/Kadaknath.webp',
  'Mahabubnagar','Gadwal',TRUE,'2026-04-08 09:00:00'
),

-- ======= DECCANI SHEEP (sheep) — 3 sellers =======
(
  'b1000001-0000-0000-0000-000000000013',
  'f1000001-0000-0000-0000-000000000010',
  'Deccani Sheep','deccani-sheep','sheep',
  2, 0, 'Off-white to grey, coarse wool', 32,
  NULL, NULL, NULL,
  'Good','Vaccinated - PPR, Enterotoxaemia, FMD','None',
  TRUE,
  'Flock of 5 Deccani sheep. Native Telangana breed. Drought-tolerant. Wool 1.5–2kg/shear. Excellent organic manure producer. Healthy flock.',
  '2026-05-10',
  7500,'head',5,
  'Telangana-native Deccani sheep — drought-hardy, low-maintenance. Wool: 1.5–2kg/shear. Excellent bio-fertilizer producer. Ideal for small farms and organic farming.',
  '/livestock/Deccani-Sheep.webp',
  'Nalgonda','Miryalaguda',TRUE,'2026-04-04 09:00:00'
),
(
  'b1000001-0000-0000-0000-000000000014',
  'f2000001-0000-0000-0000-000000000003',
  'Deccani Sheep','deccani-sheep','sheep',
  3, 0, 'Brownish-grey, light wool', 38,
  NULL, NULL, NULL,
  'Excellent','Vaccinated - PPR, Enterotoxaemia, FMD, Bluetongue','None',
  TRUE,
  'Well-grown Deccani ewes, 3 years. 2 pregnancies each. Good constitution. Bluetongue vaccinated. Wool 2kg/shear. Clean farm with organic feed.',
  '2026-05-14',
  9000,'head',8,
  'Mature Deccani ewes, 3 years, 2 lambings each. Wool 2kg/shear. Organic-fed, clean farm. 4-way vaccination. High manure output — great for organic cultivation.',
  '/livestock/Deccani-Sheep.webp',
  'Warangal','Hanamkonda',TRUE,'2026-04-10 09:00:00'
),
(
  'b1000001-0000-0000-0000-000000000015',
  'f1000001-0000-0000-0000-000000000009',
  'Deccani Sheep','deccani-sheep','sheep',
  1, 6, 'Light grey, fine body', 28,
  NULL, NULL, NULL,
  'Good','Vaccinated - PPR, FMD','None',
  TRUE,
  'Young Deccani rams and ewes, 18 months. Breeding-quality stock. Hardy animals raised on natural pasture. No disease history.',
  '2026-05-16',
  6500,'head',10,
  'Young breeding-quality Deccani sheep, 18 months. Raised on natural Deccan pasture. Disease-free. Great for building your own flock — both rams and ewes available.',
  '/livestock/Deccani-Sheep.webp',
  'Rangareddy','Shadnagar',TRUE,'2026-04-12 09:00:00'
),

-- ======= ROHU FISH (fish) — 3 sellers =======
(
  'b1000001-0000-0000-0000-000000000016',
  'f2000001-0000-0000-0000-000000000005',
  'Rohu','rohu','fish',
  0, 10, 'Silver with reddish fins', NULL,
  NULL, NULL, NULL,
  'Good','Treated - Prophylactic lime, salt bath','None',
  TRUE,
  'Rohu fingerlings to 800g grow-outs. Batch of 500. Pond-raised, fed on natural + supplemental pellet feed. Good growth rate. 10-month old stock.',
  '2026-05-05',
  180,'kg (live)',400,
  'Pond-raised Rohu, 800g live weight, ready for market or further grow-out. 500 fish batch. Chemical-free pond management. 10 months growth.',
  '/livestock/Rohu.webp',
  'Medak','Zaheerabad',TRUE,'2026-04-01 09:00:00'
),
(
  'b1000001-0000-0000-0000-000000000017',
  'f1000001-0000-0000-0000-000000000007',
  'Rohu','rohu','fish',
  1, 0, 'Bright silver, healthy scales', NULL,
  NULL, NULL, NULL,
  'Excellent','Treated - Regular lime treatment, aeration','None',
  TRUE,
  '1-year Rohu, 1.2–1.5kg each. Market-ready. 300 fish available. Zero mortality last 3 months. Clean water source from borewell. Premium grade.',
  '2026-05-08',
  200,'kg (live)',350,
  'Market-ready 1-year Rohu, 1.2–1.5kg each. Premium grade. Clean borewell-fed pond, zero mortality last quarter. 300 fish ready for immediate delivery.',
  '/livestock/Rohu.webp',
  'Khammam','Kothagudem',TRUE,'2026-04-05 09:00:00'
),
(
  'b1000001-0000-0000-0000-000000000018',
  'f2000001-0000-0000-0000-000000000001',
  'Rohu','rohu','fish',
  0, 8, 'Golden-silver with red fins', NULL,
  NULL, NULL, NULL,
  'Good','Treated - Monthly disease prevention protocol','None',
  TRUE,
  'Rohu grow-out 600–700g. 200 fish. Organic pond management — no chemicals. Fed on rice bran + mustard cake. Good texture and taste confirmed by buyers.',
  '2026-05-10',
  165,'kg (live)',200,
  'Organically raised Rohu, 600–700g, 200 fish. Rice bran + mustard cake diet. No chemicals used. Premium quality confirmed by regular buyers. Good demand in Khammam market.',
  '/livestock/Rohu.webp',
  'Khammam','Bhadrachalam',TRUE,'2026-04-08 09:00:00'
)

ON CONFLICT (id) DO NOTHING;

-- ── VERIFY ───────────────────────────────────────────────────
SELECT breed, category, COUNT(*)::int AS sellers,
       MIN(price) AS min_price, MAX(price) AS max_price,
       SUM(CASE WHEN is_vet_certified THEN 1 ELSE 0 END)::int AS vet_certified
FROM livestock
WHERE is_active = TRUE
GROUP BY breed, category
ORDER BY category, breed;
