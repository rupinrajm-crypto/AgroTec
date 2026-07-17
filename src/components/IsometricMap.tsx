import { useMemo } from 'react';
import type { Zone, Drone } from '../lib/supabase';

const TILE_W = 96;
const TILE_H = 48;

function iso(col: number, row: number) {
  return {
    x: (col - row) * (TILE_W / 2),
    y: (col + row) * (TILE_H / 2),
  };
}

function tilePath(col: number, row: number) {
  const c = iso(col, row);
  const hw = TILE_W / 2;
  const hh = TILE_H / 2;
  return [
    [c.x, c.y - hh],
    [c.x + hw, c.y],
    [c.x, c.y + hh],
    [c.x - hw, c.y],
  ].map((p) => p.join(',')).join(' ');
}

const ZONE_LAYOUT: Record<string, { col: number; row: number; color: string; icon: string }> = {
  crop: { col: 1, row: 0, color: '#3a7d44', icon: '🌾' },
  greenhouse: { col: 2, row: 0, color: '#2a9d8f', icon: '🌱' },
  dairy: { col: 3, row: 0, color: '#4a7c59', icon: '🐄' },
  goat: { col: 0, row: 2, color: '#5b8c5a', icon: '🐐' },
  poultry: { col: 2, row: 1, color: '#6a9c5a', icon: '🐔' },
  fish: { col: 3, row: 1, color: '#3aa9c9', icon: '🐟' },
  solar: { col: 0, row: 3, color: '#3ddc97', icon: '☀' },
  wind: { col: 4, row: 0, color: '#5fd9ff', icon: '🌀' },
  warehouse: { col: 1, row: 3, color: '#7fa89a', icon: '📦' },
  coldstorage: { col: 2, row: 3, color: '#5fd9ff', icon: '❄' },
  hub: { col: 2, row: 2, color: '#3ddc97', icon: '◉' },
};

const TYPE_LABEL: Record<string, string> = {
  crop: 'Crop Field',
  greenhouse: 'Greenhouse',
  dairy: 'Dairy',
  goat: 'Goat Pasture',
  poultry: 'Poultry',
  fish: 'Fish Pond',
  solar: 'Solar Array',
  wind: 'Wind Turbine',
  warehouse: 'Warehouse',
  coldstorage: 'Cold Storage',
  hub: 'Control Hub',
};

type Props = {
  zones: Zone[];
  drones: Drone[];
  selectedZone: string | null;
  onSelectZone: (id: string | null) => void;
};

export default function IsometricMap({ zones, drones, selectedZone, onSelectZone }: Props) {
  const bounds = useMemo(() => {
    let maxX = 0, maxY = 0, minX = 0, minY = 0;
    Object.values(ZONE_LAYOUT).forEach((p) => {
      const c = iso(p.col, p.row);
      maxX = Math.max(maxX, c.x + TILE_W / 2);
      minX = Math.min(minX, c.x - TILE_W / 2);
      maxY = Math.max(maxY, c.y + TILE_H / 2);
      minY = Math.min(minY, c.y - TILE_H / 2);
    });
    return { maxX, maxY, minX, minY };
  }, []);

  const w = bounds.maxX - bounds.minX + 120;
  const h = bounds.maxY - bounds.minY + 160;
  const offX = -bounds.minX + 60;
  const offY = -bounds.minY + 80;

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="w-full h-full max-h-[560px]"
        style={{ filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.5))' }}
      >
        <defs>
          <radialGradient id="hubGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#3ddc97" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#3ddc97" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="solarGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#1a3a2a" />
            <stop offset="100%" stopColor="#0a1f16" />
          </linearGradient>
          <filter id="soft" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" />
          </filter>
        </defs>

        {/* ground glow under hub */}
        {(() => {
          const p = ZONE_LAYOUT.hub;
          const c = iso(p.col, p.row);
          return (
            <circle
              cx={c.x + offX} cy={c.y + offY} r={120}
              fill="url(#hubGlow)" className="animate-pulse"
            />
          );
        })()}

        {/* tiles */}
        {zones.map((z) => {
          const layout = ZONE_LAYOUT[z.type];
          if (!layout) return null;
          const c = iso(layout.col, layout.row);
          const selected = selectedZone === z.id;
          return (
            <g
              key={z.id}
              transform={`translate(${offX}, ${offY})`}
              className="cursor-pointer"
              onClick={() => onSelectZone(selected ? null : z.id)}
            >
              {/* tile shadow */}
              <polygon
                points={tilePath(layout.col, layout.row)}
                fill="#000" opacity="0.25"
                transform="translate(4,6)"
              />
              {/* tile top */}
              <polygon
                points={tilePath(layout.col, layout.row)}
                fill={layout.color}
                opacity={selected ? 1 : 0.82}
                stroke={selected ? '#3ddc97' : '#0a1410'}
                strokeWidth={selected ? 2.5 : 1.5}
                className="transition-all"
              />
              {/* tile inner pattern */}
              <polygon
                points={tilePath(layout.col, layout.row)}
                fill="none"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth={1}
                transform="scale(0.85)"
                style={{ transformOrigin: `${c.x}px ${c.y}px` }}
              />
              {/* icon */}
              <text
                x={c.x} y={c.y - 2}
                textAnchor="middle" dominantBaseline="middle"
                fontSize="20"
                opacity={0.9}
              >
                {layout.icon}
              </text>
              {/* label */}
              <text
                x={c.x} y={c.y + TILE_H / 2 + 12}
                textAnchor="middle"
                fontSize="9"
                fill="#e6f4ee"
                opacity={0.85}
                className="font-mono"
              >
                {z.name.length > 16 ? z.name.slice(0, 14) + '…' : z.name}
              </text>
              {selected && (
                <circle
                  cx={c.x} cy={c.y} r={6}
                  fill="#3ddc97"
                  className="animate-pulseRing"
                  style={{ transformOrigin: `${c.x}px ${c.y}px` }}
                />
              )}
            </g>
          );
        })}

        {/* wind turbines spinning */}
        {zones.filter((z) => z.type === 'wind').map((z) => {
          const p = ZONE_LAYOUT.wind;
          const c = iso(p.col, p.row);
          return (
            <g key={z.id} transform={`translate(${offX + c.x}, ${offY + c.y - 30})`}>
              <rect x="-1" y="-2" width="2" height="26" fill="#cfe9e0" />
              <g className="origin-center animate-spinSlow" style={{ transformOrigin: '0px 0px' }}>
                <line x1="0" y1="0" x2="0" y2="-14" stroke="#e6f4ee" strokeWidth="1.5" />
                <line x1="0" y1="0" x2="12" y2="7" stroke="#e6f4ee" strokeWidth="1.5" />
                <line x1="0" y1="0" x2="-12" y2="7" stroke="#e6f4ee" strokeWidth="1.5" />
                <circle r="2" fill="#5fd9ff" />
              </g>
            </g>
          );
        })}

        {/* drones flying overhead */}
        {drones.map((d, i) => {
          const col = (d.position_x / 100) * 4;
          const row = (d.position_y / 100) * 3;
          const c = iso(col, row);
          const flying = d.status === 'flying';
          return (
            <g
              key={d.id}
              transform={`translate(${offX + c.x}, ${offY + c.y - 50 - (flying ? 14 : 0)})`}
              className={flying ? 'animate-floaty' : ''}
              style={{ animationDelay: `${i * 0.4}s` }}
            >
              {/* sensor cone */}
              {flying && (
                <polygon
                  points={`0,4 -10,24 10,24`}
                  fill="#5fd9ff" opacity="0.12"
                />
              )}
              {/* drone body */}
              <g>
                <line x1="-8" y1="0" x2="8" y2="0" stroke="#3ddc97" strokeWidth="1.5" />
                <line x1="0" y1="-8" x2="0" y2="8" stroke="#3ddc97" strokeWidth="1.5" />
                <circle r="3" fill={d.status === 'charging' ? '#ffb547' : '#3ddc97'} />
                <circle r="6" fill="none" stroke="#3ddc97" strokeWidth="0.5" opacity="0.5" />
              </g>
              <text x="0" y="-12" textAnchor="middle" fontSize="7" fill="#7fa89a" className="font-mono">
                {d.callsign}
              </text>
            </g>
          );
        })}

        {/* compass / scale */}
        <g transform={`translate(${w - 70}, ${h - 40})`} opacity="0.6">
          <circle r="18" fill="none" stroke="#3ddc97" strokeWidth="1" />
          <text x="0" y="-22" textAnchor="middle" fontSize="8" fill="#3ddc97" className="font-mono">N</text>
          <line x1="0" y1="-14" x2="0" y2="14" stroke="#3ddc97" strokeWidth="1" />
          <line x1="-14" y1="0" x2="14" y2="0" stroke="#3ddc97" strokeWidth="0.5" />
        </g>
      </svg>

      {/* legend */}
      <div className="absolute bottom-3 left-3 flex flex-wrap gap-2 max-w-[60%]">
        {Object.entries(ZONE_LAYOUT).slice(0, 8).map(([type, p]) => (
          <div key={type} className="flex items-center gap-1.5 text-[10px] text-agro-muted">
            <span className="w-2.5 h-2.5 rounded-sm" style={{ background: p.color }} />
            {TYPE_LABEL[type]}
          </div>
        ))}
      </div>
    </div>
  );
}
