import React from 'react';
import { AlertItem } from '../types';
import { Radio, AlertOctagon, AlertTriangle, ShieldCheck, ExternalLink } from 'lucide-react';

interface Props {
  alerts: AlertItem[];
  activeScenarioId: string;
  onSelectAlert: (scenarioId: string) => void;
}

export const AlertFeed: React.FC<Props> = ({
  alerts,
  activeScenarioId,
  onSelectAlert
}) => {
  return (
    <div className="bg-space-900 border border-space-700 rounded-lg p-3 space-y-2 select-none">
      <div className="flex items-center justify-between border-b border-space-800 pb-2">
        <div className="flex items-center space-x-1.5 text-xs font-mono font-medium text-slate-300">
          <Radio className="w-3.5 h-3.5 text-red-400 animate-pulse" />
          <span>ACTIVE PLANETARY ANOMALY ALERTS</span>
        </div>
        <span className="text-[10px] text-slate-400 font-mono">LIVE TRIAGE FEED</span>
      </div>

      <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
        {alerts.map((al) => {
          const isSelected = al.scenario_id === activeScenarioId;

          return (
            <div
              key={al.id}
              onClick={() => onSelectAlert(al.scenario_id)}
              className={`p-2 rounded border cursor-pointer transition-all ${
                isSelected
                  ? 'bg-space-800 border-emerald-500/60'
                  : 'bg-space-850/60 border-space-800 hover:border-space-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1 text-[11px] font-mono">
                <div className="flex items-center space-x-1.5">
                  {al.severity === 'Critical' ? (
                    <AlertOctagon className="w-3.5 h-3.5 text-red-400" />
                  ) : (
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  )}
                  <span className="font-bold text-slate-200">{al.id}</span>
                </div>
                <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                  al.severity === 'Critical' ? 'bg-red-950/60 text-red-300' : 'bg-amber-950/60 text-amber-300'
                }`}>
                  {al.severity.toUpperCase()}
                </span>
              </div>

              <div className="text-[11px] text-slate-300 line-clamp-1 font-medium">
                {al.title}
              </div>

              <p className="text-[10px] text-slate-400 line-clamp-2 mt-0.5 leading-tight">
                {al.summary}
              </p>

              <div className="flex items-center justify-between mt-1.5 text-[9px] font-mono text-slate-500 pt-1 border-t border-space-800/80">
                <span>{al.attribution.replace(/_/g, ' ')}</span>
                <span>CONF: {Math.round(al.confidence * 100)}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
