-- =============================================================
-- Jeevadhara — Vehicles Seed Data
-- Run as jeevadhara_iam (IAM token): psql -U jeevadhara_iam -d jeevadhara -f seed_vehicles_data.sql
-- 9 vehicles × 3 sellers = 27 listings
-- =============================================================

INSERT INTO vehicles (id, seller_id, name, slug, vehicle_type, condition, brand, model, year,
  engine_hp, hours_used, km_driven, fuel_type, color, description, image_url, price,
  is_negotiable, district, village, is_active, created_at) VALUES

-- ════════════════════════════════════════════════════
-- TRACTORS
-- ════════════════════════════════════════════════════

-- Mahindra 575 DI (Used, 2021)
('b1000001-0000-0000-0000-000000000001','f1000001-0000-0000-0000-000000000001',
 'Mahindra 575 DI','mahindra-575-di','tractor','used','Mahindra','575 DI',2021,
 47,1450,NULL,'Diesel','Red',
 'Well-maintained Mahindra 575 DI, all services done at authorized center. New battery and tyres fitted in 2025. RC and insurance valid. Ready to work.',
 '/vehicles/Mahindra_575_DI_2021.jpg',525000,TRUE,'Ranga Reddy','Ibrahimpatnam','2026-04-01 09:00:00'),

('b1000001-0000-0000-0000-000000000002','f1000002-0000-0000-0000-000000000001',
 'Mahindra 575 DI','mahindra-575-di','tractor','used','Mahindra','575 DI',2021,
 47,1820,NULL,'Diesel','Red',
 'Single owner, purchased from Mahindra dealer Warangal. Used for paddy and turmeric cultivation. 2WD, power steering. All documents clear.',
 '/vehicles/Mahindra_575_DI_2021.jpg',498000,TRUE,'Warangal','Hanamkonda','2026-04-05 10:00:00'),

('b1000001-0000-0000-0000-000000000003','f2000001-0000-0000-0000-000000000003',
 'Mahindra 575 DI','mahindra-575-di','tractor','used','Mahindra','575 DI',2020,
 47,2200,NULL,'Diesel','Red',
 '2020 model with 2200 hours. Minor body scratches, engine in perfect condition. Priced to sell fast. Includes implement hydraulic system.',
 '/vehicles/Mahindra_575_DI_2021.jpg',455000,TRUE,'Warangal','Hanamkonda','2026-04-08 09:30:00'),

-- Sonalika 745 DI (Used, 2019)
('b1000002-0000-0000-0000-000000000001','f1000003-0000-0000-0000-000000000001',
 'Sonalika 745 DI','sonalika-745-di','tractor','used','Sonalika','745 DI',2019,
 50,3100,NULL,'Diesel','Yellow',
 'Sonalika 745 DI in excellent condition. Used for cotton and chilli cultivation in Nalgonda. 50HP, 2WD. Service records available. Tyres 70% life remaining.',
 '/vehicles/Sonalika_745_DI_2019.jpg',415000,TRUE,'Nalgonda','Devarkonda','2026-04-03 09:00:00'),

('b1000002-0000-0000-0000-000000000002','f2000001-0000-0000-0000-000000000002',
 'Sonalika 745 DI','sonalika-745-di','tractor','used','Sonalika','745 DI',2019,
 50,2850,NULL,'Diesel','Yellow',
 'Genuine seller. Sonalika 745 used for rice transplanting. Hydraulic lift perfect. Minor engine overhaul done 500 hours back. All papers in order.',
 '/vehicles/Sonalika_745_DI_2019.jpg',430000,TRUE,'Medak','Zaheerabad','2026-04-06 11:00:00'),

('b1000002-0000-0000-0000-000000000003','f2000001-0000-0000-0000-000000000004',
 'Sonalika 745 DI','sonalika-745-di','tractor','used','Sonalika','745 DI',2020,
 50,1900,NULL,'Diesel','Yellow',
 '2020 Sonalika 745 with only 1900 hours. Rarely used — owner shifted to contract farming. All documents updated. AC cabin optional add-on available.',
 '/vehicles/Sonalika_745_DI_2019.jpg',475000,TRUE,'Karimnagar','Peddapalli','2026-04-10 09:00:00'),

-- New Holland 3630 (New, 2022)
('b1000003-0000-0000-0000-000000000001','f1000001-0000-0000-0000-000000000002',
 'New Holland 3630','new-holland-3630','tractor','new','New Holland','3630 TX Special',2022,
 55,0,NULL,'Diesel','Blue',
 'Brand new New Holland 3630 TX Special. 55HP, 4WD, power steering, dual clutch. Dealer warranty 2 years. Zero hours. Ideal for paddy, sugarcane, and horticultural crops.',
 '/vehicles/New_Holland_3630_2022.jpg',820000,FALSE,'Hyderabad','Kukatpally','2026-04-02 10:00:00'),

('b1000003-0000-0000-0000-000000000002','f1000002-0000-0000-0000-000000000002',
 'New Holland 3630','new-holland-3630','tractor','new','New Holland','3630 Special Edition',2022,
 55,45,NULL,'Diesel','Blue',
 'New Holland 3630 Special Edition. 45 demonstration hours only. Full dealer warranty intact. Comes with front loader attachment. CNH finance available at 9.5% p.a.',
 '/vehicles/New_Holland_3630_2022.jpg',795000,TRUE,'Nizamabad','Bodhan','2026-04-07 09:00:00'),

('b1000003-0000-0000-0000-000000000003','f2000001-0000-0000-0000-000000000005',
 'New Holland 3630','new-holland-3630','tractor','new','New Holland','3630 TX',2023,
 55,0,NULL,'Diesel','Blue',
 '2023 New Holland 3630 TX. Zero hours, direct from dealer stock. 55HP, PTO, hydraulic trailer. Government subsidy eligible (PM Kisan Samman). Bank loan arranged.',
 '/vehicles/New_Holland_3630_2022.jpg',855000,FALSE,'Medak','Zaheerabad','2026-04-12 10:00:00'),

-- ════════════════════════════════════════════════════
-- COMMERCIAL VEHICLES
-- ════════════════════════════════════════════════════

-- Ashok Leyland Dost (Used)
('b1000004-0000-0000-0000-000000000001','f1000003-0000-0000-0000-000000000002',
 'Ashok Leyland Dost','ashok-leyland-dost','commercial','used','Ashok Leyland','Dost+',2020,
 70,NULL,78000,'Diesel','White',
 'Ashok Leyland Dost+ 2020. 1.25 ton payload. Used for vegetable transport Hyderabad to wholesale markets. FC valid up to 2027. All tyres new. Engine in top condition.',
 '/vehicles/Ashok_Leyland_Dost.jpg',420000,TRUE,'Hyderabad','Kukatpally','2026-04-04 09:00:00'),

('b1000004-0000-0000-0000-000000000002','f2000001-0000-0000-0000-000000000001',
 'Ashok Leyland Dost','ashok-leyland-dost','commercial','used','Ashok Leyland','Dost',2019,
 70,NULL,95000,'Diesel','White',
 '2019 Dost with 95,000 km. Used for farm input transport. Good body condition, AC works. Slight rust near wheel arches. Price negotiable for quick sale.',
 '/vehicles/Ashok_Leyland_Dost.jpg',365000,TRUE,'Khammam','Bhadrachalam','2026-04-09 10:00:00'),

('b1000004-0000-0000-0000-000000000003','f2000001-0000-0000-0000-000000000003',
 'Ashok Leyland Dost','ashok-leyland-dost','commercial','used','Ashok Leyland','Dost Strong',2021,
 70,NULL,62000,'Diesel','Silver',
 '2021 Dost Strong variant. 62,000 km only. Tata finance cleared. Single owner, used for poultry feed transport. Clean vehicle, no accidents.',
 '/vehicles/Ashok_Leyland_Dost.jpg',455000,TRUE,'Warangal','Hanamkonda','2026-04-11 09:30:00'),

-- Ashok Leyland Bada Dost (Used)
('b1000005-0000-0000-0000-000000000001','f1000001-0000-0000-0000-000000000003',
 'Ashok Leyland Bada Dost','ashok-leyland-bada-dost','commercial','used','Ashok Leyland','Bada Dost i3',2021,
 85,NULL,55000,'Diesel','White',
 'Bada Dost i3 2021. 1.5 ton payload. Used for grain transport to APMC Warangal. GPS tracker fitted. 55,000 km with full service history. RC transfer ready.',
 '/vehicles/Ashok_Leyland_Bada_Dost.jpg',545000,TRUE,'Warangal','Hanamkonda','2026-04-03 10:00:00'),

('b1000005-0000-0000-0000-000000000002','f1000002-0000-0000-0000-000000000003',
 'Ashok Leyland Bada Dost','ashok-leyland-bada-dost','commercial','used','Ashok Leyland','Bada Dost',2020,
 85,NULL,82000,'Diesel','White',
 'Bada Dost 2020, 82,000 km. Used for fertilizer and pesticide distribution. Slight dent on left side. Engine overhauled at 70,000 km. Very powerful for last-mile delivery.',
 '/vehicles/Ashok_Leyland_Bada_Dost.jpg',480000,TRUE,'Nalgonda','Devarkonda','2026-04-06 09:00:00'),

('b1000005-0000-0000-0000-000000000003','f2000001-0000-0000-0000-000000000002',
 'Ashok Leyland Bada Dost','ashok-leyland-bada-dost','commercial','used','Ashok Leyland','Bada Dost i4',2022,
 85,NULL,38000,'Diesel','Blue',
 '2022 Bada Dost i4 with only 38,000 km. Like new condition. Loan clearance certificate available. Used for cold chain vegetable transport with canopy.',
 '/vehicles/Ashok_Leyland_Bada_Dost.jpg',595000,TRUE,'Nalgonda','Devarkonda','2026-04-13 10:00:00'),

-- Ashok Leyland Boss Series (New)
('b1000006-0000-0000-0000-000000000001','f1000003-0000-0000-0000-000000000003',
 'Ashok Leyland Boss','ashok-leyland-boss','commercial','new','Ashok Leyland','Boss 1615 HB',2024,
 160,NULL,0,'Diesel','White',
 'Brand new Ashok Leyland Boss 1615 HB. 16-ton GVW, 160HP. Ideal for bulk grain, fertilizer, and mandi transport. 5-year warranty. Finance at 10.2% p.a. from Union Bank.',
 '/vehicles/Ashok_Leyland_Boss_Series.jpg',1850000,FALSE,'Hyderabad','Kukatpally','2026-04-05 10:00:00'),

('b1000006-0000-0000-0000-000000000002','f1000001-0000-0000-0000-000000000004',
 'Ashok Leyland Boss','ashok-leyland-boss','commercial','new','Ashok Leyland','Boss 1615 IL',2024,
 160,NULL,800,'Diesel','White',
 'Boss 1615 IL 2024 with 800 km (demo unit). Dealer discount ₹75,000 on ex-showroom. GPS, BS6 compliant. 4-year extended warranty available.',
 '/vehicles/Ashok_Leyland_Boss_Series.jpg',1775000,TRUE,'Hyderabad','Kukatpally','2026-04-08 10:00:00'),

('b1000006-0000-0000-0000-000000000003','f2000001-0000-0000-0000-000000000005',
 'Ashok Leyland Boss','ashok-leyland-boss','commercial','new','Ashok Leyland','Boss 2523',2025,
 230,NULL,0,'Diesel','White',
 '2025 Boss 2523 — 25-ton GVW, 230HP. Heavy-duty fleet vehicle. Ideal for FCI rice transport and inter-state commodity movement. Bulk discount for 2+ vehicles.',
 '/vehicles/Ashok_Leyland_Boss_Series.jpg',2250000,FALSE,'Medak','Zaheerabad','2026-04-14 09:00:00'),

-- Ashok Leyland Partner 4 Tyre (Used)
('b1000007-0000-0000-0000-000000000001','f1000002-0000-0000-0000-000000000004',
 'Ashok Leyland Partner','ashok-leyland-partner','commercial','used','Ashok Leyland','Partner 4 Tyre',2020,
 90,NULL,72000,'Diesel','White',
 'Partner 4 Tyre 2020. 1.5 ton mini truck. Ideal for village-to-mandi produce transport. 72,000 km, all tyres 60% remaining. FC valid 2026. Body in good condition.',
 '/vehicles/Ashok_Leyland_Partner_4_Tyre.jpg',395000,TRUE,'Karimnagar','Peddapalli','2026-04-04 10:00:00'),

('b1000007-0000-0000-0000-000000000002','f2000001-0000-0000-0000-000000000001',
 'Ashok Leyland Partner','ashok-leyland-partner','commercial','used','Ashok Leyland','Partner 4 Tyre HE',2021,
 90,NULL,48000,'Diesel','Silver',
 'Partner 4 Tyre HE 2021. 48,000 km. High Edition with music system and power windows. Perfect for FPO transport needs. Loan clearance done. Immediate delivery.',
 '/vehicles/Ashok_Leyland_Partner_4_Tyre.jpg',435000,TRUE,'Khammam','Bhadrachalam','2026-04-07 09:00:00'),

('b1000007-0000-0000-0000-000000000003','f2000001-0000-0000-0000-000000000004',
 'Ashok Leyland Partner','ashok-leyland-partner','commercial','used','Ashok Leyland','Partner 4 Tyre',2019,
 90,NULL,101000,'Diesel','White',
 '2019 Partner 4 Tyre with 1,01,000 km. Just completed major service — new clutch, tyres, brakes. Honest pricing. Ideal for milk and perishable transport.',
 '/vehicles/Ashok_Leyland_Partner_4_Tyre.jpg',335000,TRUE,'Karimnagar','Peddapalli','2026-04-10 11:00:00'),

-- ════════════════════════════════════════════════════
-- CONSTRUCTION / EARTH-MOVING
-- ════════════════════════════════════════════════════

-- JCB 3DX (Used)
('b1000008-0000-0000-0000-000000000001','f1000003-0000-0000-0000-000000000004',
 'JCB 3DX','jcb-3dx','construction','used','JCB','3DX Xtra',2019,
 74,5800,NULL,'Diesel','Yellow',
 'JCB 3DX Xtra 2019. 5,800 machine hours. Used for farm pond construction, land leveling, and road work in Khammam dist. Bucket and backhoe fully functional. Major service done.',
 '/vehicles/JCB_3DX.jpg',1850000,TRUE,'Khammam','Bhadrachalam','2026-04-02 09:00:00'),

('b1000008-0000-0000-0000-000000000002','f1000001-0000-0000-0000-000000000005',
 'JCB 3DX','jcb-3dx','construction','used','JCB','3DX Super',2020,
 74,4200,NULL,'Diesel','Yellow',
 'JCB 3DX Super 2020. 4,200 hours. Excellent hydraulics. Ideal for PMKSY water body construction and farm bunding. All attachments included. Second owner.',
 '/vehicles/JCB_3DX.jpg',2100000,TRUE,'Nalgonda','Devarkonda','2026-04-05 10:00:00'),

('b1000008-0000-0000-0000-000000000003','f2000001-0000-0000-0000-000000000002',
 'JCB 3DX','jcb-3dx','construction','used','JCB','3DX Eco',2021,
 74,2950,NULL,'Diesel','Yellow',
 '2021 JCB 3DX Eco — only 2,950 hours. Low usage, very good condition. Engine just overhauled at JCB authorized service center. Hydraulic seals all replaced.',
 '/vehicles/JCB_3DX.jpg',2350000,TRUE,'Nalgonda','Devarkonda','2026-04-09 10:00:00'),

-- JCB 4DX (New)
('b1000009-0000-0000-0000-000000000001','f1000002-0000-0000-0000-000000000005',
 'JCB 4DX','jcb-4dx','construction','new','JCB','4DX',2024,
 92,0,NULL,'Diesel','Yellow',
 'Brand new JCB 4DX 2024. 92HP, 4-wheel drive, 4-wheel steering. Superior reach and digging depth vs 3DX. Ideal for large farm pond, canal, and earthwork projects. JCB warranty 2 years.',
 '/vehicles/JCB_4DX.jpg',3450000,FALSE,'Hyderabad','Kukatpally','2026-04-06 10:00:00'),

('b1000009-0000-0000-0000-000000000002','f1000003-0000-0000-0000-000000000005',
 'JCB 4DX','jcb-4dx','construction','new','JCB','4DX Xtra',2024,
 92,250,NULL,'Diesel','Yellow',
 'JCB 4DX Xtra 2024. 250 demo hours. Rs 1.5L discount on list price. Dealer finance up to 85% LTV. GPS telematics fitted. Suitable for PMKSY, MGNREGS, and private earthwork.',
 '/vehicles/JCB_4DX.jpg',3295000,TRUE,'Nalgonda','Devarkonda','2026-04-09 10:30:00'),

('b1000009-0000-0000-0000-000000000003','f2000001-0000-0000-0000-000000000001',
 'JCB 4DX','jcb-4dx','construction','new','JCB','4DX Smart',2025,
 92,0,NULL,'Diesel','Yellow',
 '2025 JCB 4DX Smart. Zero hours. Latest Tier IV Final engine, fuel-efficient. SmartPlus hydraulics. 3-year warranty. Khammam stock, fast delivery. Govt subsidy eligible.',
 '/vehicles/JCB_4DX.jpg',3650000,FALSE,'Khammam','Bhadrachalam','2026-04-13 09:00:00')

ON CONFLICT (id) DO NOTHING;

-- ── VERIFY ───────────────────────────────────────────────────
SELECT
  MIN(name)         AS vehicle,
  condition,
  vehicle_type,
  COUNT(*)::int     AS sellers,
  MIN(price)        AS min_price,
  MAX(price)        AS max_price
FROM vehicles
WHERE is_active = TRUE
GROUP BY slug, condition, vehicle_type
ORDER BY vehicle_type, MIN(name);
