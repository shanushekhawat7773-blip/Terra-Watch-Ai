import React from 'react';
import { WeatherAttribution, AnalysisDetail } from '../types';
import { CloudRain, Thermometer, ShieldAlert, FileText, CheckCircle2 } from 'lucide-react';

interface Props {
  detail: AnalysisDetail;
}

export const WeatherCorrelation: React.FC<Props> = ({ detail }) => {
  const attr = detail.weather_attribution;
  const wh = detail.weather_history;
  if (!attr) return null;

  const isClimate = attr.attribution_verdict === 'CLIMATE_TRIGGERED_EVENT';
  const isAnthropic = attr.attribution_verdict.includes('ANTHROPOGENIC');

  return (
    <div className="bg-space-900 border border-space-700 rounded-lg p-3.5 space-y-3 select-none">
      <div className="flex items-center justify-between border-b border-space-800 pb-2">
        <div className="flex items-center space-x-1.5 text-xs font-mono font-medium text-slate-200">
          <CloudRain className="w-3.5 h-3.5 text-cyan-400" />
          <span>CLIMATE &amp; WEATHER ATTRIBUTION (DIFFERENTIATOR)</span>
        </div>
        <span className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase font-bold ${
          isClimate
            ? 'bg-cyan-950/60 text-cyan-300 border-cyan-500/50'
            : isAnthropic
            ? 'bg-red-950/60 text-red-300 border-red-500/50'
            : 'bg-amber-950/60 text-amber-300 border-amber-500/50'
        }`}>
          {attr.attribution_verdict.replace(/_/g, ' ')}
        </span>
      </div>

      {/* Meteorological sensor readings */}
      <div className="grid grid-cols-3 gap-2 font-mono text-[11px]">
        <div className="bg-space-850 border border-space-800 p-2 rounded">
          <div className="text-slate-500 text-[10px]">CUMULATIVE RAIN</div>
          <div className="text-slate-100 font-bold text-sm mt-0.5">
            {wh.total_precipitation_mm} <span className="text-[10px] text-slate-400">mm</span>
          </div>
          <div className="text-[9px] text-slate-500">Over {wh.days_analyzed} days</div>
        </div>

        <div className="bg-space-850 border border-space-800 p-2 rounded">
          <div className="text-slate-500 text-[10px]">PEAK 24H DELUGE</div>
          <div className="text-slate-100 font-bold text-sm mt-0.5">
            {wh.max_single_day_rain_mm} <span className="text-[10px] text-slate-400">mm</span>
          </div>
          <div className="text-[9px] text-slate-500">Single-day event</div>
        </div>

        <div className="bg-space-850 border border-space-800 p-2 rounded">
          <div className="text-slate-500 text-[10px]">MEAN TEMPERATURE</div>
          <div className="text-slate-100 font-bold text-sm mt-0.5">
            {wh.mean_temperature_c} <span className="text-[10px] text-slate-400">°C</span>
          </div>
          <div className="text-[9px] text-slate-500">{wh.source.split(' ')[0]}</div>
        </div>
      </div>

      {/* Scientific explanation */}
      <div className="bg-space-850/80 border border-space-800 p-2.5 rounded text-xs text-slate-300 leading-relaxed font-sans">
        <div className="flex items-start space-x-2">
          <FileText className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <p className="text-[12px] text-slate-200">
            {attr.scientific_rationale}
          </p>
        </div>
      </div>
    </div>
  );
};
