/*
# Smart AgroTech 360 — Core Schema (single-tenant, no auth)

1. New Tables
- `zones` — farm sections (crop field, greenhouse, dairy, goat, poultry, fish, warehouse, cold storage, solar, wind, control hub).
- `sensors` — IoT sensor readings tied to a zone (soil moisture, pH, temp, dissolved oxygen, etc.).
- `livestock` — individual animals with species, health status, smart-collar/GPS data, production metrics.
- `drones` — AI drone fleet with mission type, battery, status, location.
- `robots` — autonomous harvesting/feeding robots.
- `energy_assets` — solar panels and wind turbines with output metrics.
- `alerts` — AI analytics alerts (disease, irrigation, anomaly, weather).
- `production_logs` — daily production reports per zone.
2. Security
- RLS enabled on all tables.
- Single-tenant (no sign-in): policies allow anon + authenticated full CRUD since data is intentionally shared/public demo data.
*/

CREATE TABLE IF NOT EXISTS zones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL,
  area_hectares numeric DEFAULT 0,
  status text NOT NULL DEFAULT 'operational',
  meta jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE zones ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_zones" ON zones;
CREATE POLICY "anon_select_zones" ON zones FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_zones" ON zones;
CREATE POLICY "anon_insert_zones" ON zones FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_zones" ON zones;
CREATE POLICY "anon_update_zones" ON zones FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_zones" ON zones;
CREATE POLICY "anon_delete_zones" ON zones FOR DELETE TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS sensors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  zone_id uuid REFERENCES zones(id) ON DELETE CASCADE,
  name text NOT NULL,
  metric text NOT NULL,
  value numeric NOT NULL,
  unit text NOT NULL,
  status text NOT NULL DEFAULT 'online',
  recorded_at timestamptz DEFAULT now()
);

ALTER TABLE sensors ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_sensors" ON sensors;
CREATE POLICY "anon_select_sensors" ON sensors FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_sensors" ON sensors;
CREATE POLICY "anon_insert_sensors" ON sensors FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_sensors" ON sensors;
CREATE POLICY "anon_update_sensors" ON sensors FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_sensors" ON sensors;
CREATE POLICY "anon_delete_sensors" ON sensors FOR DELETE TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS livestock (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tag_id text NOT NULL,
  species text NOT NULL,
  zone_id uuid REFERENCES zones(id) ON DELETE CASCADE,
  health_status text NOT NULL DEFAULT 'healthy',
  temperature numeric,
  heart_rate numeric,
  location_lat numeric,
  location_lng numeric,
  last_fed timestamptz,
  production numeric DEFAULT 0,
  production_unit text DEFAULT '',
  battery numeric DEFAULT 100,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE livestock ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_livestock" ON livestock;
CREATE POLICY "anon_select_livestock" ON livestock FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_livestock" ON livestock;
CREATE POLICY "anon_insert_livestock" ON livestock FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_livestock" ON livestock;
CREATE POLICY "anon_update_livestock" ON livestock FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_livestock" ON livestock;
CREATE POLICY "anon_delete_livestock" ON livestock FOR DELETE TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS drones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  callsign text NOT NULL,
  mission text NOT NULL,
  status text NOT NULL DEFAULT 'idle',
  battery numeric DEFAULT 100,
  altitude_m numeric DEFAULT 0,
  position_x numeric DEFAULT 0,
  position_y numeric DEFAULT 0,
  payload text DEFAULT '',
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE drones ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_drones" ON drones;
CREATE POLICY "anon_select_drones" ON drones FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_drones" ON drones;
CREATE POLICY "anon_insert_drones" ON drones FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_drones" ON drones;
CREATE POLICY "anon_update_drones" ON drones FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_drones" ON drones;
CREATE POLICY "anon_delete_drones" ON drones FOR DELETE TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS robots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  task text NOT NULL,
  status text NOT NULL DEFAULT 'idle',
  battery numeric DEFAULT 100,
  zone_id uuid REFERENCES zones(id) ON DELETE CASCADE,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE robots ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_robots" ON robots;
CREATE POLICY "anon_select_robots" ON robots FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_robots" ON robots;
CREATE POLICY "anon_insert_robots" ON robots FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_robots" ON robots;
CREATE POLICY "anon_update_robots" ON robots FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_robots" ON robots;
CREATE POLICY "anon_delete_robots" ON robots FOR DELETE TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS energy_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  kind text NOT NULL,
  output_kw numeric DEFAULT 0,
  capacity_kw numeric DEFAULT 0,
  status text NOT NULL DEFAULT 'online',
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE energy_assets ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_energy" ON energy_assets;
CREATE POLICY "anon_select_energy" ON energy_assets FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_energy" ON energy_assets;
CREATE POLICY "anon_insert_energy" ON energy_assets FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_energy" ON energy_assets;
CREATE POLICY "anon_update_energy" ON energy_assets FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_energy" ON energy_assets;
CREATE POLICY "anon_delete_energy" ON energy_assets FOR DELETE TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  severity text NOT NULL DEFAULT 'info',
  category text NOT NULL,
  message text NOT NULL,
  zone_id uuid REFERENCES zones(id) ON DELETE CASCADE,
  acknowledged boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_alerts" ON alerts;
CREATE POLICY "anon_select_alerts" ON alerts FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_alerts" ON alerts;
CREATE POLICY "anon_insert_alerts" ON alerts FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_alerts" ON alerts;
CREATE POLICY "anon_update_alerts" ON alerts FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_alerts" ON alerts;
CREATE POLICY "anon_delete_alerts" ON alerts FOR DELETE TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS production_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  zone_id uuid REFERENCES zones(id) ON DELETE CASCADE,
  date date NOT NULL DEFAULT CURRENT_DATE,
  yield_value numeric NOT NULL DEFAULT 0,
  unit text NOT NULL DEFAULT '',
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE production_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_production" ON production_logs;
CREATE POLICY "anon_select_production" ON production_logs FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_production" ON production_logs;
CREATE POLICY "anon_insert_production" ON production_logs FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_production" ON production_logs;
CREATE POLICY "anon_update_production" ON production_logs FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_production" ON production_logs;
CREATE POLICY "anon_delete_production" ON production_logs FOR DELETE TO anon, authenticated USING (true);
