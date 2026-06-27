-- =============================================================
-- Jeevadhara — Vehicles: Add Dealer Columns + Update New Vehicles
-- Step 1 (dbadmin): ALTER TABLE
-- Step 2 (jeevadhara_iam): UPDATE new vehicle records
-- =============================================================

-- ── STEP 1: Run as dbadmin ────────────────────────────────────
ALTER TABLE vehicles
  ADD COLUMN IF NOT EXISTS dealer_name      TEXT,
  ADD COLUMN IF NOT EXISTS dealer_city      TEXT,
  ADD COLUMN IF NOT EXISTS dealer_showroom  TEXT,
  ADD COLUMN IF NOT EXISTS dealer_phone     TEXT,
  ADD COLUMN IF NOT EXISTS on_road_price    NUMERIC,
  ADD COLUMN IF NOT EXISTS colors_available TEXT,
  ADD COLUMN IF NOT EXISTS warranty_years   INT;

SELECT 'ALTER done' AS status;

-- ── STEP 2: Run as jeevadhara_iam ────────────────────────────
-- Update New Holland 3630 → 3 dealer showrooms, 2025/2026 year
UPDATE vehicles SET
  year = 2025, dealer_name = 'Sai Krishna NH Agro',
  dealer_city = 'Hyderabad',
  dealer_showroom = 'Plot 45, Mehdipatnam, Hyderabad - 500028',
  dealer_phone = '9040012345',
  on_road_price = 925000,
  colors_available = 'Blue, White-Blue',
  warranty_years = 2
WHERE id = 'b1000003-0000-0000-0000-000000000001';

UPDATE vehicles SET
  year = 2025, dealer_name = 'Deccan Farm Equipments',
  dealer_city = 'Nizamabad',
  dealer_showroom = 'NH Authorized Dealer, Bodhan Road, Nizamabad - 503001',
  dealer_phone = '9040023456',
  on_road_price = 895000,
  colors_available = 'Blue, White-Blue',
  warranty_years = 2
WHERE id = 'b1000003-0000-0000-0000-000000000002';

UPDATE vehicles SET
  year = 2026, dealer_name = 'Telangana NH Dealers',
  dealer_city = 'Medak',
  dealer_showroom = 'New Holland Showroom, Zaheerabad, Medak - 502220',
  dealer_phone = '9040034567',
  on_road_price = 955000,
  colors_available = 'Blue, White-Blue, Graphite Black',
  warranty_years = 2
WHERE id = 'b1000003-0000-0000-0000-000000000003';

-- Update Ashok Leyland Boss → 3 dealer showrooms, 2025 year
UPDATE vehicles SET
  year = 2025, dealer_name = 'TruckLine Ashok Leyland',
  dealer_city = 'Hyderabad',
  dealer_showroom = 'AL Commercial Hub, Uppal Main Road, Hyderabad - 500039',
  dealer_phone = '9050012345',
  on_road_price = 2050000,
  colors_available = 'White, Pearl White',
  warranty_years = 5
WHERE id = 'b1000006-0000-0000-0000-000000000001';

UPDATE vehicles SET
  year = 2025, dealer_name = 'Deccan Transport Solutions',
  dealer_city = 'Hyderabad',
  dealer_showroom = 'AL Trucks & Buses, Medchal Road, Hyderabad - 500055',
  dealer_phone = '9050023456',
  on_road_price = 1955000,
  colors_available = 'White, Pearl White',
  warranty_years = 4
WHERE id = 'b1000006-0000-0000-0000-000000000002';

UPDATE vehicles SET
  year = 2025, dealer_name = 'Pioneer AL Dealers',
  dealer_city = 'Medak',
  dealer_showroom = 'AL Showroom, NH-65, Zaheerabad, Medak - 502220',
  dealer_phone = '9050034567',
  on_road_price = 2480000,
  colors_available = 'White, White+Cabin Blue',
  warranty_years = 5
WHERE id = 'b1000006-0000-0000-0000-000000000003';

-- Update JCB 4DX → 3 dealer showrooms, 2025/2026 year
UPDATE vehicles SET
  year = 2025, dealer_name = 'Telangana JCB Ltd',
  dealer_city = 'Hyderabad',
  dealer_showroom = 'JCB Equipment Zone, Patancheru Industrial Area, Hyderabad - 502319',
  dealer_phone = '9060012345',
  on_road_price = 3785000,
  colors_available = 'Yellow, Yellow+Black',
  warranty_years = 2
WHERE id = 'b1000009-0000-0000-0000-000000000001';

UPDATE vehicles SET
  year = 2025, dealer_name = 'Deccan JCB Dealers',
  dealer_city = 'Nalgonda',
  dealer_showroom = 'JCB Service Point, Miryalaguda Road, Nalgonda - 508001',
  dealer_phone = '9060023456',
  on_road_price = 3615000,
  colors_available = 'Yellow, Yellow+Black',
  warranty_years = 2
WHERE id = 'b1000009-0000-0000-0000-000000000002';

UPDATE vehicles SET
  year = 2026, dealer_name = 'South JCB Equipment',
  dealer_city = 'Khammam',
  dealer_showroom = 'JCB Authorized Dealer, Bhadrachalam Road, Khammam - 507001',
  dealer_phone = '9060034567',
  on_road_price = 3995000,
  colors_available = 'Yellow, Yellow+Black, Graphite Black',
  warranty_years = 3
WHERE id = 'b1000009-0000-0000-0000-000000000003';

-- ── VERIFY ──────────────────────────────────────────────────
SELECT
  name, condition, year,
  dealer_name, dealer_city, dealer_phone,
  price AS ex_showroom, on_road_price, warranty_years,
  colors_available
FROM vehicles
WHERE condition = 'new'
ORDER BY vehicle_type, name;
