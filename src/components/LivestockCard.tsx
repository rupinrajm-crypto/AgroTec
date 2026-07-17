import type { Livestock } from '../lib/supabase';

const SPECIES_META: Record<string, { icon: string; label: string }> = {
  cow: { icon: '🐄', label: 'Cattle' },
  goat: { icon: '🐐', label: 'Goat' },
  poultry: { icon: '🐔', label: 'Poultry' },
  fish: { icon: '🐟', label: 'Fish' },
};

function healthColor(status: string) {
  if (status === 'healthy') return '#3ddc97';
  if (status === 'attention') return '#ffb547';
  return '#ff5d6c';
}

export default function LivestockCard({ animal }: { animal: Livestock }) {
  const meta = SPECIES_META[animal.species] ?? { icon: '•', label: animal.species };
  const tempHigh = animal.temperature != null && animal.temperature > 39.5 && animal.species !== 'poultry' && animal.species !== 'fish';
  const battLow = animal.battery < 70;

  return (
    <div className="grid-cell p-3 flex items-center gap-3">
      <div className="relative flex-shrink-0">
        <div className="w-10 h-10 rounded-lg bg-agro-bg/60 border border-agro-border flex items-center justify-center text-lg">
          {meta.icon}
        </div>
        <span
          className="absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-agro-panel"
          style={{ background: healthColor(animal.health_status) }}
        />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-xs font-semibold text-agro-text">{animal.tag_id}</span>
          <span className="text-[10px] text-agro-muted">{meta.label}</span>
        </div>
        <div className="flex items-center gap-3 mt-1 text-[10px] text-agro-muted">
          {animal.temperature != null && (
            <span className={tempHigh ? 'text-agro-warn' : ''}>🌡 {animal.temperature}°C</span>
          )}
          {animal.heart_rate != null && animal.heart_rate > 0 && (
            <span>♥ {animal.heart_rate} bpm</span>
          )}
          {animal.production > 0 && (
            <span className="text-agro-primary">{animal.production} {animal.production_unit}</span>
          )}
        </div>
        <div className="flex items-center gap-2 mt-1">
          <div className="flex-1 h-1 rounded-full bg-agro-bg overflow-hidden">
            <div
              className={battLow ? 'h-full bg-agro-warn' : 'h-full bg-agro-accent'}
              style={{ width: `${animal.battery}%` }}
            />
          </div>
          <span className="text-[9px] text-agro-dim font-mono">{Math.round(animal.battery)}%</span>
        </div>
      </div>
    </div>
  );
}
