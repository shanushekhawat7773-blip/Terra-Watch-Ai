import React from 'react';
import { ScenarioSummary } from '../types';
import { MapPin, AlertCircle, Compass } from 'lucide-react';

interface Props {
  scenarios: ScenarioSummary[];
  activeScenarioId: string;
  onSelectScenario: (id: string) => void;
}

export const ScenarioPresets: React.FC<Props> = ({
  scenarios,
  activeScenarioId,
  onSelectScenario
}) => {
  return (
    <div className="bg-space-900 border border-space-700 rounded-lg p-3 space-y-2 select-none">
      <div className="flex items-center justify-between border-b border-space-800 pb-2">
        <div className="flex items-center space-x-1.5 text-xs font-mono font-medium text-slate-300">
          <Compass className="w-3.5 h-3.5 text-emerald-400" />
          <span>GROUND-TRUTH SCENARIOS (IIT-MANDI + GLOBAL)</span>
        </div>
        <span className="text-[10px] text-slate-400 font-mono">OFFLINE CACHED</span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {scenarios.map((sc) => {
          const isActive = sc.id === activeScenarioId;
          const isHimachal = sc.id === 'himachal_mandi_floods';

          return (
            <button
              key={sc.id}
              onClick={() => onSelectScenario(sc.id)}
              className={`text-left p-2.5 rounded border transition-all relative ${
                isActive
                  ? 'bg-space-800 border-emerald-500/70 shadow-[0_0_12px_rgba(16,185,129,0.2)]'
                  : 'bg-space-850/80 border-space-700 hover:border-space-600'
              }`}
            >
              {isHimachal && (
                <div className="absolute top-2 right-2 px-1.5 py-0.2 rounded bg-amber-950/70 text-amber-300 border border-amber-500/50 text-[9px] font-mono font-bold tracking-tight">
                  LOCAL MANDI
                </div>
              )}

              <div className="flex items-center space-x-1 text-slate-100 font-semibold text-[11px] mb-0.5">
                <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                <span className="truncate pr-12">{sc.title}</span>
              </div>

              <div className="text-[10px] text-slate-400 font-mono truncate">
                {sc.location}
              </div>

              <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-space-800 text-[10px] font-mono">
                <span className="text-slate-500">
                  {sc.dates.before.substring(5)} → {sc.dates.after.substring(5)}
                </span>
                <span className={`font-semibold ${
                  sc.severity === 'Critical' ? 'text-red-400' : 'text-amber-400'
                }`}>
                  {sc.severity}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
