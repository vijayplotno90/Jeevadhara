# H0: Hack the Zero Stack — Master Rules & Compliance Notes

## Hackathon: H0 on Devpost | Sponsor: Amazon Web Services
## Deadline: June 29, 2026 5:00 PM PT = June 30, 2026 5:30 AM IST
## Prize: $80,000 cash + $80,000 AWS credits

---

## ⚠️ HARD REQUIREMENT — CANNOT CHANGE
> "all projects must use one of three designated Amazon Web Services Databases
> (Aurora, Aurora DSQL, or DynamoDB) as the PRIMARY back end"
> "deploy their front end on Vercel or v0.app"

- ✅ MUST use: Amazon Aurora PostgreSQL (already provisioned)
- ✅ MUST deploy on: Vercel (already deployed)
- ❌ CANNOT switch to: Neon, Supabase, PlanetScale, or ANY non-AWS database
- ❌ Switching DB = Stage 1 disqualification (immediate pass/fail check)

---

## Our Track
Track 1: Monetizable B2C App
- Farmer lists produce → Jeevadhara team certifies quality → Consumer buys
- Eliminates middlemen, direct farm-to-table in Telangana
- Real villages (Solipeta, Nalgonda), real problem, real people

---

## Submission Checklist (complete before June 29)
- [ ] Text description: features + which AWS DB used
- [ ] Demo video <3 min on YouTube
      - Shows all 3 role flows working (farmer, admin, consumer)
      - Explains Aurora PostgreSQL usage
      - Problem + audience + why
- [ ] Vercel project public URL
- [ ] Vercel Team ID
- [ ] Architecture diagram
- [ ] AWS Console screenshot showing Aurora cluster
- [ ] Confirm database: Amazon Aurora PostgreSQL

## Bonus Points (0.2 each, max 0.6)
- [ ] Blog/article on LinkedIn / dev.to / medium.com with #H0Hackathon
- [ ] Must state "created for H0 Hackathon"

---

## Judging Criteria (design every feature with these in mind)

### 1. Technical Implementation
- Aurora integrated with deliberate data model and schema design
- Vercel deployment beyond basics (API routes, role-based auth, S3)
- Architecture clean and purposeful

### 2. Design
- UX intuitive, frontend and backend cohesive
- Full-stack thinking visible

### 3. Impact & Real-World Applicability
- Real problem for Telangana farmers
- Potentially shippable product

### 4. Originality
- Quality certification workflow (farm visit → sample → certify) is differentiated
- Transparent marketplace with traceability

---

## Architecture to Showcase
Browser → Next.js on Vercel → API Routes → Aurora PostgreSQL (primary DB)
                                          → AWS S3 (product images)
                                          → AWS IAM (Aurora auth)

---

## Non-Negotiables
1. Aurora PostgreSQL STAYS — fix connection, never replace
2. Every feature must reinforce B2C farmer-to-consumer story
3. App MUST work end-to-end before recording demo video
4. All 3 flows (farmer, admin, consumer) must be demonstrable
5. AWS Console screenshot needed — save one showing the Aurora cluster
