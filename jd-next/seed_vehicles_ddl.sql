-- =============================================================
-- Jeevadhara — Vehicles Table DDL
-- Run as dbadmin (IAM token): psql -U dbadmin -d jeevadhara
-- =============================================================

CREATE TABLE IF NOT EXISTS vehicles (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id       TEXT        NOT NULL,
  name            TEXT        NOT NULL,
  slug            TEXT        NOT NULL,
  vehicle_type    TEXT        NOT NULL CHECK (vehicle_type IN ('tractor','commercial','construction')),
  condition       TEXT        NOT NULL CHECK (condition IN ('new','used')),
  brand           TEXT,
  model           TEXT,
  year            INT,
  engine_hp       INT,
  hours_used      INT,
  km_driven       INT,
  fuel_type       TEXT        DEFAULT 'Diesel',
  color           TEXT,
  description     TEXT,
  image_url       TEXT,
  price           NUMERIC     NOT NULL,
  is_negotiable   BOOLEAN     DEFAULT TRUE,
  district        TEXT,
  village         TEXT,
  is_active       BOOLEAN     DEFAULT TRUE,
  created_at      TIMESTAMP   DEFAULT NOW()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON vehicles TO jeevadhara_iam;

SELECT 'vehicles table created and granted' AS status;
