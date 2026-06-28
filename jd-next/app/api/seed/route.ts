import { NextRequest, NextResponse } from "next/server";
import { query } from "../../../lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const secret = new URL(req.url).searchParams.get("secret");
  if (secret !== "jdadmin2026") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  return run();
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  if (body.secret !== "jdadmin2026") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  return run();
}

async function upsertUser(name: string, phone: string, role: string, district: string, village: string): Promise<string> {
  const ex = await query<{ id: string }>("SELECT id FROM users WHERE phone = $1", [phone]);
  if (ex.length > 0) return ex[0].id;
  const r = await query<{ id: string }>(
    `INSERT INTO users (name, phone, role, district, village, created_at)
     VALUES ($1,$2,$3,$4,$5,NOW()) RETURNING id`,
    [name, phone, role, district, village]
  );
  return r[0].id;
}

async function ensureTables() {
  await query(`
    CREATE TABLE IF NOT EXISTS farms (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      farmer_id TEXT NOT NULL,
      farm_name TEXT,
      district TEXT,
      village TEXT,
      total_area_acres NUMERIC,
      crops_grown TEXT,
      jeevadhara_certified BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
  await query(`
    CREATE TABLE IF NOT EXISTS enquiries (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      farmer_id TEXT,
      farmer_name TEXT,
      farmer_phone TEXT,
      service_category TEXT NOT NULL,
      provider_name TEXT,
      provider_phone TEXT,
      enquiry_type TEXT DEFAULT 'enquire',
      notes TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
}

async function upsertFarm(farmerId: string, farmName: string, district: string, village: string, acres: number, crops: string) {
  const ex = await query<{ id: string }>("SELECT id FROM farms WHERE farmer_id = $1", [farmerId]);
  if (ex.length > 0) return;
  await query(
    `INSERT INTO farms (farmer_id, farm_name, district, village, total_area_acres, crops_grown, jeevadhara_certified, created_at)
     VALUES ($1,$2,$3,$4,$5,$6,TRUE,NOW())`,
    [farmerId, farmName, district, village, acres, crops]
  );
}

async function count(table: string, col: string, val: string): Promise<number> {
  const r = await query<{ c: string }>(`SELECT COUNT(*)::text AS c FROM ${table} WHERE ${col} = $1`, [val]);
  return parseInt(r[0].c);
}

async function run() {
  try {
    const log: string[] = [];

    // ENSURE TABLES EXIST
    await ensureTables();
    log.push("Tables: farms + enquiries created if missing");

    // USERS
    const ramuId    = await upsertUser("Ramu Reddy",     "9876543210", "farmer",   "Nalgonda",  "Solipeta");
    const venkatId  = await upsertUser("Venkat Rao",     "9876543213", "farmer",   "Warangal",  "Hasanparthy");
    const lakshmiId = await upsertUser("Lakshmi Devi",   "9876543214", "farmer",   "Nizamabad", "Armoor");
    const priyaId   = await upsertUser("Priya Sharma",   "9876543211", "consumer", "Hyderabad", "");
    await upsertUser("Suresh Services", "9876543212", "provider", "Warangal", "");
    log.push("Users: 5 demo accounts ready");

    // FARMS
    await upsertFarm(ramuId,    "Ramu Farms",          "Nalgonda",  "Solipeta",   8.5, "Tomatoes, Rice, Red Chilli, Turmeric");
    await upsertFarm(venkatId,  "Venkat Organic Farm", "Warangal",  "Hasanparthy",12.0,"Sona Masoori Rice, Groundnuts, Cotton");
    await upsertFarm(lakshmiId, "Green Valley Farm",   "Nizamabad", "Armoor",      5.0,"Honey, Turmeric, Green Chilli");
    log.push("Farms: 3 farm profiles created");

    // PRODUCTS — Ramu
    if ((await count("products", "farmer_id", ramuId)) === 0) {
      await query(
        `INSERT INTO products (farmer_id,name,category,price,unit,stock,description,district,is_organic,is_active,created_at) VALUES
         ($1,'Organic Tomatoes','vegetables',28,'kg',150,'Sun-ripened organic tomatoes from Nalgonda. No pesticides used.','Nalgonda',TRUE,TRUE,NOW()-INTERVAL'2 days'),
         ($1,'Sona Masoori Rice','grains',52,'kg',500,'Premium Grade A Sona Masoori. Freshly harvested this season.','Nalgonda',FALSE,TRUE,NOW()-INTERVAL'3 days'),
         ($1,'Guntur Red Chilli','spices',180,'kg',80,'Fiery Guntur S4 variety. Dried naturally. High Scoville rating.','Nalgonda',FALSE,TRUE,NOW()-INTERVAL'1 day'),
         ($1,'Raw Forest Honey','honey',320,'kg',30,'Pure wild honey from Nagarjunasagar forest hives.','Nalgonda',TRUE,TRUE,NOW()-INTERVAL'5 days'),
         ($1,'Organic Turmeric Powder','spices',120,'kg',60,'Erode variety. 4.5 percent curcumin content. Certified organic.','Nalgonda',TRUE,TRUE,NOW()-INTERVAL'4 days')`,
        [ramuId]
      );
      log.push("Products: 5 from Ramu");
    }

    // PRODUCTS — Venkat
    if ((await count("products", "farmer_id", venkatId)) === 0) {
      await query(
        `INSERT INTO products (farmer_id,name,category,price,unit,stock,description,district,is_organic,is_active,created_at) VALUES
         ($1,'Sona Masoori Rice','grains',48,'kg',300,'Direct from Warangal paddy. Compare our price with others!','Warangal',FALSE,TRUE,NOW()-INTERVAL'2 days'),
         ($1,'Bold Groundnuts','grains',95,'kg',120,'High oil content. Freshly harvested this kharif season.','Warangal',FALSE,TRUE,NOW()-INTERVAL'3 days'),
         ($1,'Organic Tomatoes','vegetables',26,'kg',200,'Hybrid cherry variety. Crisp and sweet. Chemical-free.','Warangal',TRUE,TRUE,NOW()-INTERVAL'1 day'),
         ($1,'Fresh Curry Leaves','nursery',15,'bunch',200,'Pesticide-free curry leaf bunches. Daily harvest.','Warangal',TRUE,TRUE,NOW()-INTERVAL'6 days')`,
        [venkatId]
      );
      log.push("Products: 4 from Venkat");
    }

    // PRODUCTS — Lakshmi
    if ((await count("products", "farmer_id", lakshmiId)) === 0) {
      await query(
        `INSERT INTO products (farmer_id,name,category,price,unit,stock,description,district,is_organic,is_active,created_at) VALUES
         ($1,'Multiflora Wild Honey','honey',280,'kg',25,'Light golden honey from Nizamabad flower fields.','Nizamabad',TRUE,TRUE,NOW()-INTERVAL'3 days'),
         ($1,'Fresh Green Chilli','vegetables',45,'kg',60,'Hot green chilli used by local restaurants.','Nizamabad',FALSE,TRUE,NOW()-INTERVAL'2 days'),
         ($1,'Moringa Saplings','nursery',25,'plant',150,'Drumstick tree. 60 days old. Ready to transplant.','Nizamabad',TRUE,TRUE,NOW()-INTERVAL'4 days')`,
        [lakshmiId]
      );
      log.push("Products: 3 from Lakshmi");
    }

    // LIVESTOCK — Ramu
    if ((await count("livestock", "farmer_id", ramuId)) === 0) {
      await query(
        `INSERT INTO livestock (farmer_id,breed,slug,category,age_years,age_months,color,body_weight_kg,milk_liters_per_day,lactation_number,health_condition,vaccination_status,disease_history,price,quantity_available,district,village,description,is_active,created_at) VALUES
         ($1,'Gir Cow','gir-cow-ramu','cattle',4,2,'Golden Brown',420,12,2,'Excellent','Fully Vaccinated','None',85000,1,'Nalgonda','Solipeta','Purebred Gir. 12L/day. FMD and BQ vaccinated. Calm temperament.',TRUE,NOW()-INTERVAL'3 days'),
         ($1,'Murrah Buffalo','murrah-buffalo-ramu','buffalo',5,0,'Black',550,15,3,'Excellent','Fully Vaccinated','None',95000,1,'Nalgonda','Solipeta','High-yield Murrah. 15L/day. Recently calved.',TRUE,NOW()-INTERVAL'5 days')`,
        [ramuId]
      );
      log.push("Livestock: 2 from Ramu");
    }

    // LIVESTOCK — Venkat
    if ((await count("livestock", "farmer_id", venkatId)) === 0) {
      await query(
        `INSERT INTO livestock (farmer_id,breed,slug,category,age_years,age_months,color,body_weight_kg,eggs_per_year,health_condition,vaccination_status,disease_history,price,quantity_available,district,village,description,is_active,created_at) VALUES
         ($1,'Boer Goat','boer-goat-venkat','goat',1,6,'White-Brown',35,NULL,'Good','Vaccinated','None',12000,4,'Warangal','Hasanparthy','Quality Boer meat goats. Ready for sale.',TRUE,NOW()-INTERVAL'2 days'),
         ($1,'Kadaknath Chicken','kadaknath-venkat','poultry',0,8,'Black',2,180,'Good','Vaccinated','None',850,20,'Warangal','Hasanparthy','Premium Kadaknath. High protein black meat. Restaurant demand.',TRUE,NOW()-INTERVAL'4 days')`,
        [venkatId]
      );
      log.push("Livestock: 2 from Venkat");
    }

    // VEHICLES
    if ((await count("vehicles", "seller_id", ramuId)) === 0) {
      await query(
        `INSERT INTO vehicles (seller_id,name,slug,vehicle_type,condition,brand,model,year,engine_hp,fuel_type,hours_used,color,is_negotiable,description,price,district,village,is_active,created_at) VALUES
         ($1,'Mahindra 575 DI Tractor','mahindra-575-di-ramu','tractor','used','Mahindra','575 DI',2019,45,'Diesel',2800,'Red',TRUE,'45HP. Hydraulic working. Full service done. All papers clear.',380000,'Nalgonda','Solipeta',TRUE,NOW()-INTERVAL'7 days')`,
        [ramuId]
      );
      log.push("Vehicles: 1 tractor from Ramu");
    }

    if ((await count("vehicles", "seller_id", venkatId)) === 0) {
      await query(
        `INSERT INTO vehicles (seller_id,name,slug,vehicle_type,condition,brand,model,year,engine_hp,fuel_type,hours_used,color,is_negotiable,description,price,district,village,is_active,created_at) VALUES
         ($1,'Sonalika 750 DI Tractor','sonalika-750-di-venkat','tractor','used','Sonalika','750 DI',2021,75,'Diesel',1200,'Yellow',FALSE,'75HP. Low hours. PTO drive working. Insurance valid.',620000,'Warangal','Hasanparthy',TRUE,NOW()-INTERVAL'6 days')`,
        [venkatId]
      );
      log.push("Vehicles: 1 tractor from Venkat");
    }

    // TOOLS
    if ((await count("tools", "seller_id", ramuId)) === 0) {
      await query(
        `INSERT INTO tools (seller_id,name,slug,category,brand,description,price,unit,stock,district,village,is_active,created_at) VALUES
         ($1,'Honda Power Sprayer 16L','honda-sprayer-ramu','sprayer','Honda','16L knapsack power sprayer. 2-stroke engine. 1 season used. Works perfectly.',3500,'piece',3,'Nalgonda','Solipeta',TRUE,NOW()-INTERVAL'4 days'),
         ($1,'Drip Irrigation Kit 1 Acre','drip-kit-ramu','irrigation',NULL,'Complete drip set for 1 acre. Mainline, laterals, drippers, filters included.',8500,'set',5,'Nalgonda','Solipeta',TRUE,NOW()-INTERVAL'5 days')`,
        [ramuId]
      );
      log.push("Tools: 2 from Ramu");
    }

    if ((await count("tools", "seller_id", venkatId)) === 0) {
      await query(
        `INSERT INTO tools (seller_id,name,slug,category,brand,description,price,unit,stock,district,village,is_active,created_at) VALUES
         ($1,'Rotavator 7 Feet','rotavator-venkat','tillage',NULL,'7ft rotavator for 50HP+ tractors. Used 2 seasons. Blades sharp.',45000,'piece',1,'Warangal','Hasanparthy',TRUE,NOW()-INTERVAL'3 days')`,
        [venkatId]
      );
      log.push("Tools: 1 from Venkat");
    }

    // ORDERS — Priya from Ramu
    if ((await count("orders", "customer_id", priyaId)) === 0) {
      const tomato = await query<{ id: string }>("SELECT id FROM products WHERE farmer_id=$1 AND name='Organic Tomatoes' LIMIT 1", [ramuId]);
      const rice   = await query<{ id: string }>("SELECT id FROM products WHERE farmer_id=$1 AND name='Sona Masoori Rice' LIMIT 1", [ramuId]);
      const chilli = await query<{ id: string }>("SELECT id FROM products WHERE farmer_id=$1 AND name='Guntur Red Chilli' LIMIT 1", [ramuId]);
      const honey  = await query<{ id: string }>("SELECT id FROM products WHERE farmer_id=$1 AND name='Raw Forest Honey' LIMIT 1", [ramuId]);

      if (tomato[0] && rice[0] && chilli[0] && honey[0]) {
        await query(
          `INSERT INTO orders (customer_id,customer_name,customer_phone,product_id,farmer_id,product_name,quantity,unit,unit_price,total_price,payment_method,payment_status,order_status,delivery_address,created_at) VALUES
           ($1,'Priya Sharma','9876543211',$2,$3,'Organic Tomatoes',5,'kg',28,140,'upi','paid','delivered','Flat 402, Green Valley Apts, Kondapur, Hyderabad - 500084',NOW()-INTERVAL'12 days'),
           ($1,'Priya Sharma','9876543211',$4,$3,'Sona Masoori Rice',10,'kg',52,520,'upi','paid','delivered','Flat 402, Green Valley Apts, Kondapur, Hyderabad - 500084',NOW()-INTERVAL'8 days'),
           ($1,'Priya Sharma','9876543211',$5,$3,'Guntur Red Chilli',2,'kg',180,360,'cod','paid','confirmed','Flat 402, Green Valley Apts, Kondapur, Hyderabad - 500084',NOW()-INTERVAL'3 days'),
           ($1,'Priya Sharma','9876543211',$6,$3,'Raw Forest Honey',1,'kg',320,320,'upi','paid','confirmed','Flat 402, Green Valley Apts, Kondapur, Hyderabad - 500084',NOW()-INTERVAL'1 day')`,
          [priyaId, tomato[0].id, ramuId, rice[0].id, chilli[0].id, honey[0].id]
        );
        log.push("Orders: 4 orders from Priya -> Ramu");
      }
    }

    // ENQUIRIES
    if ((await count("enquiries", "farmer_id", ramuId)) === 0) {
      await query(
        `INSERT INTO enquiries (farmer_id,farmer_name,farmer_phone,service_category,provider_name,provider_phone,enquiry_type,notes,created_at) VALUES
         ($1,'Ramu Reddy','9876543210','borewell','Suresh Drilling Co','9000011111','call','Need 200ft borewell for rabi crop irrigation on north side of farm.',NOW()-INTERVAL'10 days'),
         ($1,'Ramu Reddy','9876543210','solar_irrigation','SunFarm Solar','9000022222','website','Interested in 3HP solar pump for drip system.',NOW()-INTERVAL'7 days'),
         ($1,'Ramu Reddy','9876543210','drone_spraying','AgroAir Drones','9000033333','enquire','Drone spraying for 8 acres. Lambda Cyhalothrin pesticide.',NOW()-INTERVAL'5 days'),
         ($1,'Ramu Reddy','9876543210','soil_testing','Telangana Soil Lab','9000044444','call','Annual soil health card before turmeric sowing.',NOW()-INTERVAL'3 days'),
         ($1,'Ramu Reddy','9876543210','kcc_loan','SBI Agri Branch','9000055555','enquire','KCC renewal for Rs 3 lakhs. Current limit Rs 1.5L.',NOW()-INTERVAL'2 days')`,
        [ramuId]
      );
      log.push("Enquiries: 5 from Ramu");
    }

    if ((await count("enquiries", "farmer_id", venkatId)) === 0) {
      await query(
        `INSERT INTO enquiries (farmer_id,farmer_name,farmer_phone,service_category,provider_name,provider_phone,enquiry_type,notes,created_at) VALUES
         ($1,'Venkat Rao','9876543213','crop_insurance','LIC Agri','9000066666','enquire','PMFBY coverage for 12 acres rice and cotton.',NOW()-INTERVAL'8 days'),
         ($1,'Venkat Rao','9876543213','cold_storage','FreshCool Warehousing','9000077777','call','Cold storage for 5 tonnes rice post-harvest.',NOW()-INTERVAL'4 days')`,
        [venkatId]
      );
      log.push("Enquiries: 2 from Venkat");
    }

    return NextResponse.json({
      success: true,
      log,
      summary: {
        farmers: 3,
        customers: 1,
        providers: 1,
        products: 12,
        livestock: 4,
        vehicles: 2,
        tools: 3,
        orders: 4,
        enquiries: 7,
      }
    });

  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Seed failed";
    console.error("Seed error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
