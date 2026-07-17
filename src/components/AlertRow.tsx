import type { Alert } from '../lib/supabase';
import { AlertTriangle, AlertCircle, Info, Bell } from 'lucide-react';

const SEV_META: Record<string, { color: string; icon: typeof Info }> = {
  critical: { color: '#ff5d6c', icon: AlertCircle },
  warning: { color: '#ffb547', icon: AlertTriangle },
  info: { color: '#5fd9ff', icon: Info },
};

export default function AlertRow({ alert }: { alert: Alert }) {
  const meta = SEV_META[alert.severity] ?? SEV_META.info;
  const Icon = meta.icon;

  return (
    <div className={`flex items-start gap-2.5 p-2.5 rounded-lg border ${alert.acknowledged ? 'border-agro-border/40 opacity-50' : 'border-agro-border bg-agro-panel2/40'}`}>
      <Icon size={16} style={{ color: meta.color }} className="flex-shrink-0 mt-0.5" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: meta.color }}>
            {alert.category.replace(/_/g, ' ')}
          </span>
          {!alert.acknowledged && (
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: meta.color }} />
          )}
        </div>
        <p className="text-xs text-agro-text mt-0.5 leading-snug">{alert.message}</p>
      </div>
      {!alert.acknowledged && <Bell size={12} className="text-agro-muted flex-shrink-0 mt-1" />}
    </div>
  );
}
