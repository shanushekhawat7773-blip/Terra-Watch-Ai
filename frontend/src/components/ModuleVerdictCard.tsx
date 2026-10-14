import React from 'react';
import { AnalysisDetail } from '../types';
import { Trees, Sprout, Waves, Mountain, CheckCircle2, AlertTriangle, AlertOctagon } from 'lucide-react';

interface Props {
  detail: AnalysisDetail;
}

export const ModuleVerdictCard: React.FC<Props> = ({ detail }) => {
  const m = detail.modules;
  if (!m) return null;

  const deforest = m.deforestation;
  const crop = m.crop_stress;
  const flood = m.flood_detection;
  const land = m.general_land_change;

  return (
    <div className="bg-space-900 border border-space-700 rounded-lg p-3.5 space-y-3 select-none">
      <div className="flex items-center justify-between border-b border-space-800 pb-2">
        <span className="text-xs font-mono font-medium text-slate-300">
          DOMAIN IMPACT VERDICTS
        </span>
        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
          CONFIDENCE: {Math.round(detail.confidence_score * 100)}%
        </span>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-2 gap-2 text-xs font-mono">
        {/* 1. Deforestation */}
        <div className={`p-2.5 rounded border transition-all ${
          deforest.verdict === 'CRITICAL_LOSS'
            ? 'bg-red-950/20 border-red-500/40'
            : 'bg-space-850 border-space-700'
        }`}>
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center space-x-1.5 text-slate-300">
              <Trees className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-semibold text-[11px]">FOREST CANOPY</span>
            </div>
            {deforest.verdict === 'CRITICAL_LOSS' ? (
              <AlertOctagon className="w-3.5 h-3.5 text-red-400" />
            ) : (
              <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" />
            )}
          </div>
          <div className="text-[13px] font-bold text-slate-100">
            {deforest.lost_forest_hectares} <span className="text-[10px] text-slate-400">ha lost</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            Canopy clearing: {deforest.loss_percentage}%
          </div>
        </div>

        {/* 2. Crop Stress */}
        <div className={`p-2.5 rounded border transition-all ${
          crop.verdict === 'ACUTE_STRESS'
            ? 'bg-amber-950/20 border-amber-500/40'
            : 'bg-space-850 border-space-700'
        }`}>
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center space-x-1.5 text-slate-300">
              <Sprout className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-semibold text-[11px]">CROP VIGOR</span>
            </div>
            {crop.verdict === 'ACUTE_STRESS' ? (
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" />
            )}
          </div>
          <div className="text-[13px] font-bold text-slate-100">
            {crop.stressed_hectares} <span className="text-[10px] text-slate-400">ha stressed</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            Yield deficit: {crop.stress_percentage}%
          </div>
        </div>

        {/* 3. Flood Extent */}
        <div className={`p-2.5 rounded border transition-all ${
          flood.verdict === 'MASSIVE_INUNDATION'
            ? 'bg-cyan-950/25 border-cyan-500/50'
            : 'bg-space-850 border-space-700'
        }`}>
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center space-x-1.5 text-slate-300">
              <Waves className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-semibold text-[11px]">WATER EXTENT</span>
            </div>
            {flood.verdict === 'MASSIVE_INUNDATION' ? (
              <AlertOctagon className="w-3.5 h-3.5 text-cyan-400" />
            ) : (
              <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" />
            )}
          </div>
          <div className="text-[13px] font-bold text-slate-100">
            +{flood.inundated_hectares} <span className="text-[10px] text-slate-400">ha flooded</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            Current basin: {flood.current_water_hectares} ha
          </div>
        </div>

        {/* 4. General Land Change */}
        <div className="p-2.5 rounded border bg-space-850 border-space-700">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center space-x-1.5 text-slate-300">
              <Mountain className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-semibold text-[11px]">SURFACE TYPE</span>
            </div>
          </div>
          <div className="text-[12px] font-semibold text-slate-200 truncate">
            {land.dominant_transition}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            Built/Soil: {land.breakdown_hectares?.bare_soil_builtup || 0} ha
          </div>
        </div>
      </div>
    </div>
  );
};
