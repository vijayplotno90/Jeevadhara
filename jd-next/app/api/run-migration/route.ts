import { query } from "../../../lib/db";
import { NextResponse } from "next/server";

// ONE-TIME migration endpoint — DELETE THIS FILE AFTER RUNNING
// Security: requires secret key in header
const SECRET = process.env.MIGRATION_SECRET || "jeevadhara-migrate-2026";

export async function POST(req: Request) {
  const auth = req.headers.get("x-migration-key");
  if (auth !== SECRET) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const results: string[] = [];
  const errors: string[] = [];

  const steps: { name: string; sql: string }[] = [
    {
      name: "mandi_rates table",
      sql: `CREATE TABLE IF NOT EXISTS mandi_rates (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        crop TEXT NOT NULL, crop_hi TEXT, state TEXT NOT NULL, market TEXT NOT NULL,
        min_price NUMERIC NOT NULL, max_price NUMERIC NOT NULL, modal_price NUMERIC NOT NULL,
        unit TEXT NOT NULL DEFAULT 'quintal', rate_date DATE NOT NULL DEFAULT CURRENT_DATE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )`,
    },
    {
      name: "egg_rates table",
      sql: `CREATE TABLE IF NOT EXISTS egg_rates (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        city TEXT NOT NULL, state TEXT NOT NULL, price_per_100 NUMERIC NOT NULL,
        rate_date DATE NOT NULL DEFAULT CURRENT_DATE, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )`,
    },
    {
      name: "marketplace_listings table",
      sql: `CREATE TABLE IF NOT EXISTS marketplace_listings (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        seller_id UUID, category TEXT NOT NULL, title TEXT NOT NULL, title_hi TEXT,
        description TEXT, price NUMERIC NOT NULL, unit TEXT NOT NULL DEFAULT 'one',
        negotiable BOOLEAN NOT NULL DEFAULT TRUE, quantity NUMERIC, location TEXT NOT NULL,
        state TEXT, image_url TEXT, emoji TEXT, contact_phone TEXT,
        is_active BOOLEAN NOT NULL DEFAULT TRUE, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )`,
    },
    {
      name: "schemes table",
      sql: `CREATE TABLE IF NOT EXISTS schemes (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title TEXT NOT NULL, title_hi TEXT, summary TEXT NOT NULL,
        eligibility TEXT, benefit TEXT, category TEXT NOT NULL DEFAULT 'central',
        link TEXT, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )`,
    },
    {
      name: "web_stories table",
      sql: `CREATE TABLE IF NOT EXISTS web_stories (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        slug TEXT NOT NULL UNIQUE, title TEXT NOT NULL,
        cover_emoji TEXT NOT NULL DEFAULT '🌾', cover_gradient TEXT NOT NULL DEFAULT 'from-emerald-400 to-teal-500',
        slides JSONB NOT NULL DEFAULT '[]'::JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )`,
    },
    {
      name: "workshops table",
      sql: `CREATE TABLE IF NOT EXISTS workshops (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title TEXT NOT NULL, organizer TEXT, topic TEXT NOT NULL DEFAULT 'general',
        description TEXT, start_date DATE, end_date DATE, venue TEXT, city TEXT, state TEXT,
        is_free BOOLEAN NOT NULL DEFAULT TRUE, registration_url TEXT,
        contact_name TEXT, contact_phone TEXT, contact_email TEXT,
        language TEXT DEFAULT 'en', status TEXT NOT NULL DEFAULT 'approved',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )`,
    },
    {
      name: "seed mandi_rates",
      sql: `INSERT INTO mandi_rates (crop,crop_hi,state,market,min_price,max_price,modal_price,unit) VALUES
('Tomato','టమాట','Telangana','Hyderabad',1200,1800,1500,'quintal'),
('Tomato','టమాట','Andhra Pradesh','Vijayawada',1100,1600,1400,'quintal'),
('Onion','ఉల్లిపాయ','Telangana','Warangal',1700,2200,1950,'quintal'),
('Onion','ఉల్లిపాయ','Maharashtra','Lasalgaon',1800,2400,2100,'quintal'),
('Potato','బంగాళాదుంప','Uttar Pradesh','Agra',900,1300,1100,'quintal'),
('Wheat','గోధుమ','Punjab','Ludhiana',2200,2450,2350,'quintal'),
('Rice','బియ్యం','Andhra Pradesh','Vijayawada',2800,3400,3100,'quintal'),
('Rice','బియ్యం','Telangana','Nalgonda',2700,3300,3000,'quintal'),
('Cotton','పత్తి','Telangana','Adilabad',6800,7400,7100,'quintal'),
('Maize','మొక్కజొన్న','Bihar','Gulabbagh',1900,2200,2050,'quintal'),
('Turmeric','పసుపు','Telangana','Nizamabad',12000,14500,13200,'quintal'),
('Chilli','మిర్చి','Andhra Pradesh','Guntur',18000,22000,20000,'quintal'),
('Groundnut','వేరుశనగ','Andhra Pradesh','Kurnool',5200,5800,5500,'quintal'),
('Mango','మామిడి','Andhra Pradesh','Krishnagiri',4500,6500,5500,'quintal'),
('Soybean','సోయాబీన్','Telangana','Karimnagar',4400,4800,4600,'quintal')
ON CONFLICT DO NOTHING`,
    },
    {
      name: "seed egg_rates",
      sql: `INSERT INTO egg_rates (city,state,price_per_100) VALUES
('Namakkal','Tamil Nadu',545),('Hyderabad','Telangana',552),
('Bengaluru','Karnataka',558),('Mumbai','Maharashtra',610),
('Delhi (CC)','Delhi',590),('Kolkata','West Bengal',625),
('Pune','Maharashtra',605),('Ahmedabad','Gujarat',595),
('Lucknow','Uttar Pradesh',578),('Jaipur','Rajasthan',588),
('Chennai','Tamil Nadu',555),('Vijayawada','Andhra Pradesh',548)
ON CONFLICT DO NOTHING`,
    },
    {
      name: "seed schemes",
      sql: `INSERT INTO schemes (title,title_hi,summary,eligibility,benefit,category,link) VALUES
('PM-KISAN Samman Nidhi','పీఎం-కిసాన్','Direct income support to all landholding farmer families.','All small & marginal farmers','₹6,000/year in 3 installments','central','https://pmkisan.gov.in'),
('PM Fasal Bima Yojana','ఫసల్ బీమా','Crop insurance against natural calamities.','All farmers','Up to 100% sum insured payout','central','https://pmfby.gov.in'),
('Kisan Credit Card','కిసాన్ క్రెడిట్ కార్డ్','Short-term credit for cultivation.','Farmers with cultivable land','Loans up to ₹3 lakh at 4%','central','https://www.nabard.org'),
('PM Kusum Solar Pump','కుసుమ్ సోలార్','Solar pumps for agriculture.','Individual farmers','Up to 60% subsidy','central','https://mnre.gov.in'),
('Rytu Bandhu Scheme','రైతు బంధు','Investment support for Telangana farmers.','Telangana farmers with pattadar passbook','₹10,000/acre/season','state','https://rythubandhu.telangana.gov.in'),
('Soil Health Card','మట్టి ఆరోగ్య కార్డ్','Free soil testing every 2 years.','All farmers','Free soil card + advisory','central',NULL)
ON CONFLICT DO NOTHING`,
    },
    {
      name: "seed web_stories",
      sql: `INSERT INTO web_stories (slug,title,cover_emoji,cover_gradient,slides) VALUES
('5-tips-tomato-yield','5 tips to double your tomato yield','🍅','from-red-400 to-orange-500','[{"title":"Choose the right variety","body":"Pick hybrid varieties suited to your climate zone."},{"title":"Soil preparation","body":"pH 6.0-6.8, add 2 tons of FYM per acre."},{"title":"Drip + mulch","body":"Saves 40% water, suppresses weeds."},{"title":"Stake early","body":"Stake within 30 days of transplant."},{"title":"Watch for blight","body":"Spray copper-oxychloride at first sign."}]'::JSONB),
('apply-pm-kisan','Apply for PM-KISAN in 5 easy steps','💸','from-emerald-400 to-teal-500','[{"title":"Open pmkisan.gov.in","body":"Click New Farmer Registration."},{"title":"Enter Aadhaar","body":"Verify with OTP."},{"title":"Fill land details","body":"Add your khasra & state info."},{"title":"Bank account","body":"Link Aadhaar-seeded account."},{"title":"Track status","body":"Check Beneficiary Status anytime."}]'::JSONB),
('monsoon-checklist','Monsoon-ready farm checklist','🌧️','from-blue-400 to-indigo-500','[{"title":"Drain channels","body":"Clear all field bunds and channels."},{"title":"Cover storage","body":"Stack grain on wooden pallets."},{"title":"Pest scouting","body":"Inspect crops weekly for fungal attacks."},{"title":"Insurance","body":"Enroll in PMFBY before cut-off."}]'::JSONB),
('rytu-bandhu-guide','How to claim Rytu Bandhu in Telangana','🌾','from-green-400 to-emerald-500','[{"title":"Check eligibility","body":"You need a pattadar passbook & Aadhaar seeded."},{"title":"Visit MeeSeva","body":"Apply at nearest MeeSeva centre or online."},{"title":"Verify land records","body":"Dharani portal records must be updated."},{"title":"Bank account","body":"DBT-enabled account required."},{"title":"Payment timeline","body":"Released before Kharif & Rabi seasons."}]'::JSONB)
ON CONFLICT (slug) DO NOTHING`,
    },
    {
      name: "seed marketplace_listings",
      sql: `INSERT INTO marketplace_listings (category,title,description,price,unit,negotiable,quantity,location,state,emoji) VALUES
('animal','Holstein Friesian Cow','3rd lactation, 22L/day milk, vaccinated.',75000,'one',TRUE,1,'Karimnagar','Telangana','🐄'),
('animal','Murrah Buffalo','High-yield, 14L/day, 4 years old.',95000,'one',TRUE,1,'Nizamabad','Telangana','🐃'),
('animal','Country Hens (10)','Free-range, brown eggs, vaccinated.',4500,'one',FALSE,10,'Warangal','Telangana','🐔'),
('tractor','Mahindra 575 DI (2021)','47 HP, 1100 hrs, excellent condition.',525000,'one',TRUE,1,'Hyderabad','Telangana','🚜'),
('implement','Rotavator 7ft','Heavy duty, 42 blades.',65000,'one',TRUE,1,'Warangal','Telangana','⚙️'),
('honey','Forest Wild Honey','Pure, unprocessed, tested.',850,'kg',TRUE,25,'Adilabad','Telangana','🍯'),
('plantation','Alphonso Mango Saplings','Grafted, 2-year, fruit-ready.',350,'one',TRUE,200,'Nalgonda','Telangana','🥭')
ON CONFLICT DO NOTHING`,
    },
  ];

  for (const step of steps) {
    try {
      await query(step.sql);
      results.push(`✅ ${step.name}`);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      errors.push(`❌ ${step.name}: ${msg}`);
    }
  }

  return NextResponse.json({ success: errors.length === 0, results, errors });
}
