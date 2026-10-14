import React from 'react';
import { Satellite, Radio, ShieldAlert, Cpu } from 'lucide-react';

interface Props {
  activeModule: string;
  onOpenExport: () => void;
  systemStatus: string;
}

export const MissionControlHeader: React.FC<Props> = ({
  activeModule,
  onOpenExport,
  systemStatus
}) => {
  return (
    <header className="h-14 border-b border-space-700 bg-space-900/90 backdrop-blur-md px-4 flex items-center justify-between z-30 select-none">
      {/* Brand & Mission Identifier */}
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 rounded border border-emerald-500/40 bg-emerald-950/30 flex items-center justify-center">
          <Satellite className="w-4 h-4 text-emerald-400 animate-pulse" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-sm font-semibold tracking-wider text-slate-100 uppercase">
              TERRAWATCH<span className="text-emerald-400">.AI</span>
            </h1>
            <span className="text-[10px] bg-space-800 text-slate-400 px-1.5 py-0.5 rounded border border-space-700 font-mono">
              IIT-MANDI EO-CORE
            </span>
          </div>
          <p className="text-[10px] text-slate-400 font-mono tracking-tight">
            MULTISPECTRAL PLANETARY SURVEILLANCE &amp; CLIMATE CORRELATION
          </p>
        </div>
      </div>

      {/* Sensor Pipeline Status */}
      <div className="hidden md:flex items-center space-x-6 text-xs font-mono">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-slate-400">SENTINEL-2 L2A:</span>
          <span className="text-emerald-400 font-medium">10m GSD ACTIVE</span>
        </div>
        <div className="flex items-center space-x-2 border-l border-space-700 pl-6">
          <Radio className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-slate-400">METEO:</span>
          <span className="text-cyan-400 font-medium">OPEN-METEO SYNCED</span>
        </div>
        <div className="flex items-center space-x-2 border-l border-space-700 pl-6">
          <Cpu className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-slate-400">ENGINE:</span>
          <span className="text-amber-400 font-medium">CVA &amp; SCL MASK</span>
        </div>
      </div>

      {/* Action CTA */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onOpenExport}
          className="px-3 py-1.5 rounded text-xs font-mono font-medium tracking-wide border border-emerald-500/50 bg-emerald-950/40 text-emerald-300 hover:bg-emerald-900/40 transition-all flex items-center space-x-1.5 shadow-sm"
        >
          <span>EXPORT DOSSIER (PDF / GEOJSON)</span>
        </button>
      </div>
    </header>
  );
};
