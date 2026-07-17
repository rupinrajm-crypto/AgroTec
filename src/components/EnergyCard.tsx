import type { EnergyAsset } from '../lib/supabase';
import { Sun, Wind } from 'lucide-react';

export default function EnergyCard({ asset }: { asset: EnergyAsset }) {
  const isSolar = asset.kind === 'solar';
  const Icon = isSolar ? Sun : Wind;
  const pct = asset.capacity_kw > 0 ? (asset.output_kw / asset.capacity_kw) * 100 : 0;
  const online = asset.status === 'online';

  return (
    <div className={`grid-cell p-3 ${!online ? 'opacity-50' : ''}`}>
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-agro-bg/60 border border-agro-border flex items-center justify-center">
          <Icon size={16} className={isSolar ? 'text-agro-primary' : 'text-agro-accent'} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-xs font-semibold truncate">{asset.name}</div>
          <div className="text-[10px] text-agro-muted uppercase tracking-wider">
            {online ? 'online' : asset.status}
          </div>
        </div>
      </div>
      <div className="mt-2 flex items-end justify-between">
        <div>
          <span className="font-display text-xl font-semibold text-agro-text">
            {asset.output_kw.toFixed(1)}
          </span>
          <span className="text-xs text-agro-muted ml-1">kW</span>
        </div>
        <span className="text-[10px] text-agro-dim font-mono">/ {asset.capacity_kw} kW</span>
      </div>
      <div className="mt-1.5 h-1.5 rounded-full bg-agro-bg overflow-hidden">
        <div
          className={isSolar ? 'h-full bg-agro-primary' : 'h-full bg-agro-accent'}
          style={{ width: `${pct}%`, transition: 'width 0.8s ease' }}
        />
      </div>
    </div>
  );
}
