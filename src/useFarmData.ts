import { useEffect, useState, useCallback } from 'react';
import { supabase } from './lib/supabase';
import type {
  Zone, Sensor, Livestock, Drone, Robot, EnergyAsset, Alert, ProductionLog,
} from './lib/supabase';

export type FarmData = {
  zones: Zone[];
  sensors: Sensor[];
  livestock: Livestock[];
  drones: Drone[];
  robots: Robot[];
  energy: EnergyAsset[];
  alerts: Alert[];
  production: ProductionLog[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
};

export function useFarmData(): FarmData {
  const [zones, setZones] = useState<Zone[]>([]);
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [livestock, setLivestock] = useState<Livestock[]>([]);
  const [drones, setDrones] = useState<Drone[]>([]);
  const [robots, setRobots] = useState<Robot[]>([]);
  const [energy, setEnergy] = useState<EnergyAsset[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [production, setProduction] = useState<ProductionLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const [
        z, s, l, d, r, e, a, p,
      ] = await Promise.all([
        supabase.from('zones').select('*').order('name'),
        supabase.from('sensors').select('*').order('recorded_at', { ascending: false }),
        supabase.from('livestock').select('*').order('tag_id'),
        supabase.from('drones').select('*').order('callsign'),
        supabase.from('robots').select('*').order('name'),
        supabase.from('energy_assets').select('*').order('name'),
        supabase.from('alerts').select('*').order('created_at', { ascending: false }),
        supabase.from('production_logs').select('*').order('date', { ascending: false }),
      ]);

      const err = z.error || s.error || l.error || d.error || r.error || e.error || a.error || p.error;
      if (err) throw err;

      setZones(z.data as Zone[]);
      setSensors(s.data as Sensor[]);
      setLivestock(l.data as Livestock[]);
      setDrones(d.data as Drone[]);
      setRobots(r.data as Robot[]);
      setEnergy(e.data as EnergyAsset[]);
      setAlerts(a.data as Alert[]);
      setProduction(p.data as ProductionLog[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load farm data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const interval = setInterval(load, 15000);
    return () => clearInterval(interval);
  }, [load]);

  return {
    zones, sensors, livestock, drones, robots, energy, alerts, production,
    loading, error, refresh: load,
  };
}
