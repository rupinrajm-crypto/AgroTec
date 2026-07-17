import type { Sensor } from '../lib/supabase';

const METRIC_META: Record<string, { label: string; icon: string; min: number; max: number; unit: string }> = {
  soil_moisture: { label: 'Soil Moisture', icon: '💧', min: 0, max: 100, unit: '%' },
  soil_pH: { label: 'Soil pH', icon: '⚗', min: 4, max: 9, unit: 'pH' },
  air_temp: { label: 'Air Temp', icon: '🌡', min: -10, max: 50, unit: '°C' },
  humidity: { label: 'Humidity', icon: '☁', min: 0, max: 100, unit: '%' },
  wind_speed: { label: 'Wind Speed', icon: '🌬', min: 0, max: 30, unit: 'm/s' },
  co2: { label: 'CO₂', icon: '🫧', min: 300, max: 1500, unit: 'ppm' },
  light_lux: { label: 'Light', icon: '☀', min: 0, max: 30000, unit: 'lux' },
  water_pH: { label: 'Water pH', icon: '⚗', min: 5, max: 9, unit: 'pH' },
  dissolved_oxygen: { label: 'Dissolved O₂', icon: '🫧', min: 0, max: 12, unit: 'mg/L' },
  water_temp: { label: 'Water Temp', icon: '🌡', min: 10, max: 35, unit: '°C' },
  ammonia: { label: 'Ammonia', icon: '⚠', min: 0, max: 50, unit: 'ppm' },
};

function gaugeColor(pct: number): string {
  if (pct < 0.25 || pct > 0.85) return '#ff5d6c';
  if (pct < 0.4 || pct > 0.75) return '#ffb547';
  return '#3ddc97';
}

export default function SensorCard({ sensor }: { sensor: Sensor }) {
  const meta = METRIC_META[sensor.metric] ?? { label: sensor.metric, icon: '•', min: 0, max: 100, unit: sensor.unit };
  const pct = Math.max(0, Math.min(1, (sensor.value - meta.min) / (meta.max - meta.min)));
  const color = gaugeColor(pct);
  const r = 26;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - pct);
  const isWarning = sensor.status === 'warning';

  return (
    <div className={`grid-cell p-3 flex items-center gap-3 ${isWarning ? 'border-agro-warn/50' : ''}`}>
      <div className="relative w-16 h-16 flex-shrink-0">
        <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
          <circle cx="32" cy="32" r={r} fill="none" stroke="#1c3a30" strokeWidth="4" />
          <circle
            cx="32" cy="32" r={r} fill="none" stroke={color} strokeWidth="4"
            strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.8s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[10px]">{meta.icon}</span>
        </div>
      </div>
      <div className="min-w-0 flex-1">
        <div className="label truncate">{meta.label}</div>
        <div className="font-display text-lg font-semibold" style={{ color }}>
          {sensor.value}<span className="text-xs text-agro-muted ml-1">{meta.unit}</span>
        </div>
        <div className="text-[10px] text-agro-dim truncate">{sensor.name}</div>
        {isWarning && (
          <div className="text-[10px] text-agro-warn mt-0.5 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-agro-warn animate-pulse" />
            attention required
          </div>
        )}
      </div>
    </div>
  );
}
