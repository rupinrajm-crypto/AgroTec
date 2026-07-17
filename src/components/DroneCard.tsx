import type { Drone } from '../lib/supabase';
import { Plane, Battery, Radar, Sprout, ScanLine, Zap } from 'lucide-react';

const MISSION_ICON: Record<string, typeof Plane> = {
  crop_monitoring: Sprout,
  spraying: Zap,
  livestock_surveillance: Radar,
  mapping: ScanLine,
};

const STATUS_COLOR: Record<string, string> = {
  flying: '#3ddc97',
  idle: '#7fa89a',
  charging: '#ffb547',
};

export default function DroneCard({ drone }: { drone: Drone }) {
  const Icon = MISSION_ICON[drone.mission] ?? Plane;
  const color = STATUS_COLOR[drone.status] ?? '#7fa89a';
  const battLow = drone.battery < 30;

  return (
    <div className="grid-cell p-3 flex items-center gap-3">
      <div
        className="relative w-10 h-10 rounded-lg border flex items-center justify-center flex-shrink-0"
        style={{ borderColor: color, background: `${color}15` }}
      >
        <Icon size={18} style={{ color }} />
        {drone.status === 'flying' && (
          <span className="absolute inset-0 rounded-lg border animate-pulseRing" style={{ borderColor: color }} />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-xs font-semibold">{drone.callsign}</span>
          <span className="text-[10px] uppercase tracking-wider" style={{ color }}>
            {drone.status}
          </span>
        </div>
        <div className="text-[10px] text-agro-muted mt-0.5 capitalize">
          {drone.mission.replace(/_/g, ' ')} · {drone.payload.replace(/_/g, ' ')}
        </div>
        <div className="flex items-center gap-2 mt-1.5">
          <Battery size={12} className={battLow ? 'text-agro-warn' : 'text-agro-accent'} />
          <div className="flex-1 h-1 rounded-full bg-agro-bg overflow-hidden">
            <div
              className={battLow ? 'h-full bg-agro-warn' : 'h-full bg-agro-accent'}
              style={{ width: `${drone.battery}%` }}
            />
          </div>
          <span className="text-[9px] text-agro-dim font-mono">{Math.round(drone.battery)}%</span>
        </div>
      </div>
    </div>
  );
}
