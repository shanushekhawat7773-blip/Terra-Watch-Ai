import React from 'react';
import { Layers, Flame, Eye, Droplet, Trees, Crosshair } from 'lucide-react';

export type LayerMode = 'rgb' | 'ndvi' | 'ndwi' | 'cva_heat';

interface Props {
  activeLayer: LayerMode;
  onSelectLayer: (layer: LayerMode) => void;
  showOverlay: boolean;
  onToggleOverlay: () => void;
  opacity: number;
  onChangeOpacity: (val: number) => void;
}

export const LayerControl: React.FC<Props> = ({
  activeLayer,
  onSelectLayer,
  showOverlay,
  onToggleOverlay,
  opacity,
  onChangeOpacity
}) => {
  return (
    <div className="absolute top-4 right-4 z-20 bg-space-900/90 backdrop-blur-md border border-space-700 p-3 rounded-lg shadow-xl w-64 select-none">
      <div className="flex items-center justify-between border-b border-space-700 pb-2 mb-2.5">
        <div className="flex items-center space-x-1.5 text-xs font-mono font-medium text-slate-300">
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          <span>SPECTRAL BAND SELECTOR</span>
        </div>
        <span className="text-[10px] text-slate-400 font-mono">10m GSD</span>
      </div>

      {/* Layer selector tabs */}
      <div className="grid grid-cols-2 gap-1.5 mb-3 font-mono text-[11px]">
        <button
          onClick={() => onSelectLayer('rgb')}
          className={`px-2 py-1.5 rounded flex items-center space-x-1.5 border transition-all ${
            activeLayer === 'rgb'
              ? 'bg-space-700 text-slate-100 border-cyan-500/60 font-semibold'
              : 'bg-space-850 text-slate-400 border-space-700 hover:text-slate-200'
          }`}
        >
          <Eye className="w-3 h-3 text-cyan-400" />
          <span>True Color (RGB)</span>
        </button>

        <button
          onClick={() => onSelectLayer('ndvi')}
          className={`px-2 py-1.5 rounded flex items-center space-x-1.5 border transition-all ${
            activeLayer === 'ndvi'
              ? 'bg-space-700 text-slate-100 border-emerald-500/60 font-semibold'
              : 'bg-space-850 text-slate-400 border-space-700 hover:text-slate-200'
          }`}
        >
          <Trees className="w-3 h-3 text-emerald-400" />
          <span>NDVI Canopy</span>
        </button>

        <button
          onClick={() => onSelectLayer('ndwi')}
          className={`px-2 py-1.5 rounded flex items-center space-x-1.5 border transition-all ${
            activeLayer === 'ndwi'
              ? 'bg-space-700 text-slate-100 border-blue-500/60 font-semibold'
              : 'bg-space-850 text-slate-400 border-space-700 hover:text-slate-200'
          }`}
        >
          <Droplet className="w-3 h-3 text-blue-400" />
          <span>MNDWI Water</span>
        </button>

        <button
          onClick={() => onSelectLayer('cva_heat')}
          className={`px-2 py-1.5 rounded flex items-center space-x-1.5 border transition-all ${
            activeLayer === 'cva_heat'
              ? 'bg-space-700 text-slate-100 border-amber-500/60 font-semibold'
              : 'bg-space-850 text-slate-400 border-space-700 hover:text-slate-200'
          }`}
        >
          <Flame className="w-3 h-3 text-amber-400" />
          <span>CVA Heatmap</span>
        </button>
      </div>

      {/* Heatmap intensity slider */}
      <div className="pt-2 border-t border-space-800">
        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
          <span>CHANGE OVERLAY OPACITY</span>
          <span className="text-slate-200">{Math.round(opacity * 100)}%</span>
        </div>
        <input
          type="range"
          min="0.1"
          max="1"
          step="0.05"
          value={opacity}
          onChange={(e) => onChangeOpacity(parseFloat(e.target.value))}
          className="w-full h-1 bg-space-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
        />
      </div>
    </div>
  );
};
