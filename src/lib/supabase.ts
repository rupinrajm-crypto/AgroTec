import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Zone = {
  id: string;
  name: string;
  type: string;
  area_hectares: number;
  status: string;
  meta: Record<string, unknown>;
  created_at: string;
};

export type Sensor = {
  id: string;
  zone_id: string;
  name: string;
  metric: string;
  value: number;
  unit: string;
  status: string;
  recorded_at: string;
};

export type Livestock = {
  id: string;
  tag_id: string;
  species: string;
  zone_id: string;
  health_status: string;
  temperature: number | null;
  heart_rate: number | null;
  location_lat: number | null;
  location_lng: number | null;
  last_fed: string | null;
  production: number;
  production_unit: string;
  battery: number;
  updated_at: string;
};

export type Drone = {
  id: string;
  callsign: string;
  mission: string;
  status: string;
  battery: number;
  altitude_m: number;
  position_x: number;
  position_y: number;
  payload: string;
  updated_at: string;
};

export type Robot = {
  id: string;
  name: string;
  task: string;
  status: string;
  battery: number;
  zone_id: string | null;
  updated_at: string;
};

export type EnergyAsset = {
  id: string;
  name: string;
  kind: string;
  output_kw: number;
  capacity_kw: number;
  status: string;
  updated_at: string;
};

export type Alert = {
  id: string;
  severity: string;
  category: string;
  message: string;
  zone_id: string | null;
  acknowledged: boolean;
  created_at: string;
};

export type ProductionLog = {
  id: string;
  zone_id: string;
  date: string;
  yield_value: number;
  unit: string;
  notes: string;
  created_at: string;
};
