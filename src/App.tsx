import { useState, useMemo } from 'react';
import {
  Activity, Cloud, Cpu, Radio, Leaf, Droplets, Wind, Sun, Fish,
  Bird, Tractor, Truck, Warehouse, Snowflake, Gauge, Zap, Satellite,
  RefreshCw, AlertTriangle, TrendingUp, Boxes, Bot, Plane, ShieldCheck,
} from 'lucide-react';
import { useFarmData } from './useFarmData';
import IsometricMap from './components/IsometricMap';
import SensorCard from './components/SensorCard';
import LivestockCard from './components/LivestockCard';
import DroneCard from './components/DroneCard';
import EnergyCard from './components/EnergyCard';
import AlertRow from './components/AlertRow';

const ZONE_ICON: Record<string, typeof Leaf> = {
  crop: Leaf, greenhouse: Sprout, dairy: Tractor, goat: Tractor,
  poultry: Bird, fish: Fish, solar: Sun, wind: Wind,
  warehouse: Warehouse, coldstorage: Snowflake, hub: Satellite,
};

function Sprout(props: Parameters<typeof Leaf>[0]) {
  return <Leaf {...props} />;
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function App() {
  const data = useFarmData();
  const [selectedZone, setSelectedZone] = useState<string | null>(null);

  const selected = useMemo(
    () => data.zones.find((z) => z.id === selectedZone) ?? null,
    [data.zones, selectedZone]
  );

  const selectedSensors = useMemo(
    () => selected ? data.sensors.filter((s) => s.zone_id === selected.id) : [],
    [data.sensors, selected]
  );

  const selectedLivestock = useMemo(
    () => selected ? data.livestock.filter((l) => l.zone_id === selected.id) : [],
    [data.livestock, selected]
  );

  const totalEnergyOut = data.energy.reduce((sum, e) => sum + e.output_kw, 0);
  const totalEnergyCap = data.energy.reduce((sum, e) => sum + e.capacity_kw, 0);
  const activeDrones = data.drones.filter((d) => d.status === 'flying').length;
  const activeRobots = data.robots.filter((r) => r.status === 'active').length;
  const unackAlerts = data.alerts.filter((a) => !a.acknowledged);
  const healthyLivestock = data.livestock.filter((l) => l.health_status === 'healthy').length;
  const attentionLivestock = data.livestock.filter((l) => l.health_status === 'attention').length;

  const zoneById = useMemo(
    () => Object.fromEntries(data.zones.map((z) => [z.id, z])),
    [data.zones]
  );

  if (data.loading && data.zones.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-agro-bg">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full border-2 border-agro-primary border-t-transparent animate-spin" />
          <div className="font-mono text-sm text-agro-muted">Initializing AgroTech 360…</div>
        </div>
      </div>
    );
  }

  if (data.error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-agro-bg">
        <div className="panel p-6 max-w-md text-center">
          <AlertTriangle className="mx-auto text-agro-danger mb-3" />
          <div className="font-mono text-sm text-agro-danger mb-2">Connection Error</div>
          <div className="text-xs text-agro-muted">{data.error}</div>
          <button onClick={data.refresh} className="mt-4 chip border-agro-primary text-agro-primary hover:bg-agro-primary/10">
            <RefreshCw size={12} /> Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-agro-bg text-agro-text relative">
      {/* animated grid bg */}
      <div className="fixed inset-0 agro-grid-bg opacity-40 pointer-events-none" />
      {/* sunrise glow */}
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, rgba(61,220,151,0.12), transparent 70%)' }}
      />

      {/* Header */}
      <header className="relative z-10 border-b border-agro-border bg-agro-panel/70 backdrop-blur-xl">
        <div className="max-w-[1600px] mx-auto px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-agro-primary to-agro-accent2 flex items-center justify-center shadow-glow">
              <Leaf size={20} className="text-agro-bg" />
              <span className="absolute inset-0 rounded-xl border border-agro-primary/50 animate-pulse" />
            </div>
            <div>
              <h1 className="font-display text-lg font-bold tracking-tight holo-text">Smart AgroTech 360</h1>
              <p className="text-[10px] text-agro-muted uppercase tracking-[0.2em]">Ecosystem Control Hub · 5G · Cloud · AI</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <StatusPill icon={Satellite} label="5G Mesh" status="online" color="#3ddc97" />
            <StatusPill icon={Cloud} label="Cloud Sync" status="online" color="#5fd9ff" />
            <StatusPill icon={Cpu} label="AI Core" status="online" color="#3ddc97" />
            <StatusPill icon={Radio} label="IoT Net" status={`${data.sensors.length} sensors`} color="#5fd9ff" />
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="font-mono text-xs text-agro-text">{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</div>
              <div className="text-[10px] text-agro-muted">Sunrise 06:12 · 24°C · 61% RH</div>
            </div>
            <button
              onClick={data.refresh}
              className="w-9 h-9 rounded-lg border border-agro-border bg-agro-panel2 hover:bg-agro-edge text-agro-muted hover:text-agro-primary transition-colors flex items-center justify-center"
              title="Refresh telemetry"
            >
              <RefreshCw size={15} className={data.loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>
      </header>

      {/* KPI strip */}
      <section className="relative z-10 max-w-[1600px] mx-auto px-6 pt-5">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <Kpi icon={Zap} label="Power Output" value={`${totalEnergyOut.toFixed(0)} kW`} sub={`of ${totalEnergyCap} kW`} color="#3ddc97" />
          <Kpi icon={Plane} label="Active Drones" value={`${activeDrones}`} sub={`${data.drones.length} fleet`} color="#5fd9ff" />
          <Kpi icon={Bot} label="Robots Deployed" value={`${activeRobots}`} sub={`${data.robots.length} units`} color="#3ddc97" />
          <Kpi icon={Activity} label="Livestock Health" value={`${healthyLivestock}`} sub={`${attentionLivestock} need attention`} color={attentionLivestock > 0 ? '#ffb547' : '#3ddc97'} />
          <Kpi icon={AlertTriangle} label="Active Alerts" value={`${unackAlerts.length}`} sub={`${data.alerts.length} total`} color={unackAlerts.length > 0 ? '#ff5d6c' : '#3ddc97'} />
          <Kpi icon={Gauge} label="Zones Online" value={`${data.zones.filter((z) => z.status === 'operational').length}`} sub={`${data.zones.length} total`} color="#3ddc97" />
        </div>
      </section>

      {/* Main grid */}
      <main className="relative z-10 max-w-[1600px] mx-auto px-6 py-5 grid grid-cols-12 gap-4">
        {/* Left column — alerts + production */}
        <div className="col-span-12 lg:col-span-3 space-y-4">
          <Panel title="AI Analytics & Alerts" icon={AlertTriangle} accent="#ff5d6c" badge={`${unackAlerts.length}`}>
            <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
              {data.alerts.length === 0 && <Empty label="No alerts" />}
              {data.alerts.slice(0, 12).map((a) => (
                <AlertRow key={a.id} alert={a} />
              ))}
            </div>
          </Panel>

          <Panel title="Production Reports" icon={TrendingUp} accent="#3ddc97">
            <div className="space-y-2">
              {data.production.map((p) => {
                const z = zoneById[p.zone_id];
                if (!z) return null;
                const Icon = ZONE_ICON[z.type] ?? Boxes;
                return (
                  <div key={p.id} className="grid-cell p-2.5 flex items-center gap-2.5">
                    <Icon size={16} className="text-agro-primary flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-semibold truncate">{z.name}</div>
                      <div className="text-[10px] text-agro-muted truncate">{p.notes}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-display text-sm font-semibold text-agro-primary">{p.yield_value}</div>
                      <div className="text-[9px] text-agro-dim">{p.unit}</div>
                    </div>
                  </div>
                );
              })}
              {data.production.length === 0 && <Empty label="No production data" />}
            </div>
          </Panel>
        </div>

        {/* Center — isometric map */}
        <div className="col-span-12 lg:col-span-6 space-y-4">
          <Panel
            title="Isometric Farm Overview"
            icon={Satellite}
            accent="#5fd9ff"
            badge={selected ? selected.name : 'All Zones'}
            action={
              selected ? (
                <button
                  onClick={() => setSelectedZone(null)}
                  className="text-[10px] text-agro-muted hover:text-agro-primary font-mono"
                >
                  clear selection ✕
                </button>
              ) : null
            }
          >
            <div className="relative h-[420px] scanlines rounded-xl overflow-hidden bg-gradient-to-b from-agro-bg via-agro-panel/40 to-agro-bg">
              {/* mountains backdrop */}
              <svg className="absolute inset-0 w-full h-full opacity-30" preserveAspectRatio="xMidYMax slice" viewBox="0 0 800 300">
                <polygon points="0,300 120,120 220,200 340,80 480,180 620,100 800,220 800,300" fill="#1c3a30" opacity="0.5" />
                <polygon points="0,300 80,180 200,240 320,160 460,220 580,150 720,210 800,180 800,300" fill="#244a3d" opacity="0.4" />
              </svg>
              <IsometricMap
                zones={data.zones}
                drones={data.drones}
                selectedZone={selectedZone}
                onSelectZone={setSelectedZone}
              />
            </div>
            <div className="mt-3 flex items-center justify-between text-[10px] text-agro-muted">
              <span className="flex items-center gap-1.5"><ShieldCheck size={12} className="text-agro-primary" /> Autonomous systems nominal</span>
              <span className="font-mono">Refresh 15s · Live telemetry</span>
            </div>
          </Panel>

          {/* Energy + weather */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Panel title="Renewable Energy" icon={Zap} accent="#3ddc97">
              <div className="grid grid-cols-2 gap-2">
                {data.energy.map((e) => <EnergyCard key={e.id} asset={e} />)}
              </div>
              <div className="mt-3 grid-cell p-3 flex items-center justify-between">
                <div>
                  <div className="label">Total Output</div>
                  <div className="font-display text-xl font-semibold text-agro-primary">
                    {totalEnergyOut.toFixed(1)} <span className="text-xs text-agro-muted">kW</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="label">Self-Sufficient</div>
                  <div className="font-display text-xl font-semibold text-agro-accent">
                    {totalEnergyCap > 0 ? Math.round((totalEnergyOut / totalEnergyCap) * 100) : 0}%
                  </div>
                </div>
              </div>
            </Panel>

            <Panel title="Weather Forecast" icon={Cloud} accent="#5fd9ff">
              <div className="grid-cell p-3 mb-2 flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-agro-accent/10 border border-agro-accent/30 flex items-center justify-center">
                  <Sun size={24} className="text-agro-warn" />
                </div>
                <div>
                  <div className="font-display text-2xl font-semibold">24°C</div>
                  <div className="text-[10px] text-agro-muted">Sunny · Light breeze 3.4 m/s</div>
                </div>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {[
                  { d: 'Mon', t: 25, i: Sun, c: '#ffb547' },
                  { d: 'Tue', t: 26, i: Sun, c: '#ffb547' },
                  { d: 'Wed', t: 23, i: Cloud, c: '#7fa89a' },
                  { d: 'Thu', t: 22, i: Droplets, c: '#5fd9ff' },
                  { d: 'Fri', t: 25, i: Sun, c: '#ffb547' },
                ].map((f) => {
                  const I = f.i;
                  return (
                    <div key={f.d} className="grid-cell p-2 text-center">
                      <div className="text-[10px] text-agro-muted mb-1">{f.d}</div>
                      <I size={16} style={{ color: f.c }} className="mx-auto mb-1" />
                      <div className="text-xs font-semibold">{f.t}°</div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-2 grid-cell p-2.5 text-[10px] text-agro-muted flex items-center gap-2">
                <Wind size={12} className="text-agro-accent" />
                AI irrigation advisory: skip Zone A-3 today (adequate soil moisture)
              </div>
            </Panel>
          </div>
        </div>

        {/* Right column — drones + robots + livestock */}
        <div className="col-span-12 lg:col-span-3 space-y-4">
          <Panel title="AI Drone Fleet" icon={Plane} accent="#5fd9ff" badge={`${activeDrones}/${data.drones.length}`}>
            <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
              {data.drones.map((d) => <DroneCard key={d.id} drone={d} />)}
            </div>
          </Panel>

          <Panel title="Autonomous Robots" icon={Bot} accent="#3ddc97" badge={`${activeRobots}`}>
            <div className="space-y-2">
              {data.robots.map((r) => {
                const z = r.zone_id ? zoneById[r.zone_id] : null;
                return (
                  <div key={r.id} className="grid-cell p-2.5 flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-lg border flex items-center justify-center ${r.status === 'active' ? 'border-agro-primary bg-agro-primary/10' : 'border-agro-border bg-agro-bg/40'}`}>
                      <Bot size={14} className={r.status === 'active' ? 'text-agro-primary' : 'text-agro-muted'} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-semibold">{r.name}</div>
                      <div className="text-[10px] text-agro-muted capitalize">{r.task.replace(/_/g, ' ')}{z ? ` · ${z.name}` : ''}</div>
                    </div>
                    <span className={`text-[10px] uppercase tracking-wider ${r.status === 'active' ? 'text-agro-primary' : 'text-agro-muted'}`}>
                      {r.status}
                    </span>
                  </div>
                );
              })}
            </div>
          </Panel>

          <Panel title="Logistics & Storage" icon={Truck} accent="#7fa89a">
            <div className="grid grid-cols-2 gap-2">
              {[
                { icon: Warehouse, label: 'Smart Warehouse', val: '120 t', c: '#7fa89a' },
                { icon: Snowflake, label: 'Cold Storage', val: '2°C', c: '#5fd9ff' },
                { icon: Truck, label: 'EV Delivery', val: '4 active', c: '#3ddc97' },
                { icon: Boxes, label: 'Inventory', val: '87% full', c: '#ffb547' },
              ].map((x) => {
                const I = x.icon;
                return (
                  <div key={x.label} className="grid-cell p-2.5">
                    <I size={16} style={{ color: x.c }} />
                    <div className="text-[10px] text-agro-muted mt-1.5">{x.label}</div>
                    <div className="text-sm font-semibold">{x.val}</div>
                  </div>
                );
              })}
            </div>
          </Panel>
        </div>

        {/* Bottom — selected zone detail or all sensors + livestock */}
        <div className="col-span-12 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Panel
            title={selected ? `${selected.name} — Live Sensors` : 'All Live Sensors'}
            icon={Gauge}
            accent="#3ddc97"
            badge={selected ? `${selectedSensors.length}` : `${data.sensors.length}`}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2 max-h-[360px] overflow-y-auto pr-1">
              {(selected ? selectedSensors : data.sensors).map((s) => (
                <SensorCard key={s.id} sensor={s} />
              ))}
              {(selected ? selectedSensors : data.sensors).length === 0 && <Empty label="No sensor readings" />}
            </div>
          </Panel>

          <Panel
            title={selected ? `${selected.name} — Livestock` : 'Livestock Monitoring'}
            icon={Activity}
            accent="#ffb547"
            badge={selected ? `${selectedLivestock.length}` : `${data.livestock.length}`}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[360px] overflow-y-auto pr-1">
              {(selected ? selectedLivestock : data.livestock).map((l) => (
                <LivestockCard key={l.id} animal={l} />
              ))}
              {(selected ? selectedLivestock : data.livestock).length === 0 && <Empty label="No livestock tracked" />}
            </div>
          </Panel>
        </div>

        {/* Mobile app interface mock */}
        <div className="col-span-12">
          <Panel title="Mobile App Interface · Cloud + 5G" icon={Radio} accent="#3ddc97">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {[
                { icon: Droplets, label: 'Irrigation', val: 'Auto · 1,240 L', c: '#5fd9ff' },
                { icon: Leaf, label: 'Crop Health', val: '98% healthy', c: '#3ddc97' },
                { icon: Fish, label: 'Pond Status', val: '1 warning', c: '#ffb547' },
                { icon: Bird, label: 'Egg Collection', val: '3,850 today', c: '#3ddc97' },
                { icon: Tractor, label: 'Harvest Queue', val: '2 zones', c: '#5fd9ff' },
                { icon: Truck, label: 'Deliveries', val: '4 routes', c: '#3ddc97' },
              ].map((x) => {
                const I = x.icon;
                return (
                  <div key={x.label} className="grid-cell p-3 flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${x.c}15`, border: `1px solid ${x.c}40` }}>
                      <I size={16} style={{ color: x.c }} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[10px] text-agro-muted uppercase tracking-wider">{x.label}</div>
                      <div className="text-xs font-semibold truncate">{x.val}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Panel>
        </div>
      </main>

      <footer className="relative z-10 border-t border-agro-border bg-agro-panel/50 backdrop-blur-md mt-4">
        <div className="max-w-[1600px] mx-auto px-6 py-3 flex flex-wrap items-center justify-between gap-2 text-[10px] text-agro-muted">
          <span className="font-mono">Smart AgroTech 360 · IoT · AI · Drones · Renewable</span>
          <span className="flex items-center gap-3">
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-agro-primary animate-pulse" /> Live</span>
            <span>·</span>
            <span>Powered by Solar + Wind · Carbon Neutral</span>
          </span>
        </div>
      </footer>
    </div>
  );
}

function StatusPill({ icon: Icon, label, status, color }: { icon: typeof Cloud; label: string; status: string; color: string }) {
  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-agro-border bg-agro-panel2/60">
      <Icon size={12} style={{ color }} />
      <span className="text-[10px] text-agro-muted">{label}</span>
      <span className="text-[10px] font-mono" style={{ color }}>{status}</span>
    </div>
  );
}

function Kpi({ icon: Icon, label, value, sub, color }: { icon: typeof Zap; label: string; value: string; sub: string; color: string }) {
  return (
    <div className="panel p-3.5 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-10 blur-2xl" style={{ background: color }} />
      <div className="flex items-center justify-between mb-2">
        <span className="label">{label}</span>
        <Icon size={16} style={{ color }} />
      </div>
      <div className="font-display text-2xl font-bold tracking-tight" style={{ color }}>{value}</div>
      <div className="text-[10px] text-agro-muted mt-0.5">{sub}</div>
    </div>
  );
}

function Panel({
  title, icon: Icon, accent, badge, action, children,
}: {
  title: string;
  icon: typeof Leaf;
  accent: string;
  badge?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="panel p-4 animate-fadeIn">
      <header className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${accent}15`, border: `1px solid ${accent}40` }}>
            <Icon size={14} style={{ color: accent }} />
          </div>
          <h2 className="font-display text-sm font-semibold tracking-tight">{title}</h2>
          {badge && (
            <span className="chip border-agro-border text-agro-muted font-mono">{badge}</span>
          )}
        </div>
        {action}
      </header>
      {children}
    </section>
  );
}

function Empty({ label }: { label: string }) {
  return <div className="text-center text-xs text-agro-dim py-6">{label}</div>;
}
