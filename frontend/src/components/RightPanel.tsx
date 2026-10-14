import React from 'react';
import { useAppStore } from '../lib/store';
import {
  ShieldAlert,
  CloudRain,
  TrendingDown,
  Info,
  ChevronRight,
  ChevronLeft,
  ExternalLink,
  Trees,
  Waves,
  Sprout
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

export const RightPanel: React.FC = () => {
  const { rightPanelOpen, toggleRightPanel, activeScenario } = useAppStore();

  if (!rightPanelOpen) {
    return (
      <button
        onClick={toggleRightPanel}
        className="absolute top-16 right-3 z-30 p-2 rounded-sm bg-tw-surface-1 border border-tw-border text-tw-text-secondary hover:text-tw-text-primary shadow-xl transition-all"
        title="Open Intelligence Panel"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
    );
  }

  if (!activeScenario) return null;

  const sev = activeScenario.severity;
  const attr = activeScenario.weather_attribution;
  const wh = activeScenario.weather_history;
  const mod = activeScenario.modules;

  return (
    <aside className="w-96 h-full border-l border-tw-border bg-tw-surface-1 flex flex-col z-20 select-none shadow-2xl">
      {/* Panel Header */}
      <div className="h-12 border-b border-tw-border px-3.5 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <ShieldAlert className="w-3.5 h-3.5 text-tw-accent" />
          <span className="tw-micro-label text-tw-text-primary font-semibold">
            ANALYTICAL DOSSIER
          </span>
        </div>
        <button
          onClick={toggleRightPanel}
          className="p-1 rounded-sm text-tw-text-tertiary hover:text-tw-text-primary transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3.5 space-y-4">
        {/* Verdict Banner */}
        <div className="p-3 rounded-sm border bg-tw-surface-2 border-tw-border space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="tw-micro-label">CLASSIFIED VERDICT</span>
            <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-xs uppercase border ${
              sev.overall_severity === 'Critical'
                ? 'bg-tw-severity-critical/15 text-tw-severity-critical border-tw-severity-critical/40'
                : 'bg-tw-severity-high/15 text-tw-severity-high border-tw-severity-high/40'
            }`}>
              {sev.overall_severity} ({sev.score}/100)
            </span>
          </div>

          <h2 className="font-serif text-lg text-tw-text-primary leading-tight font-medium">
            {activeScenario.title}
          </h2>

          <p className="text-xs text-tw-text-secondary leading-relaxed font-sans">
            {attr.scientific_rationale}
          </p>
        </div>

        {/* Quantified Metrics Grid */}
        <div className="space-y-1.5">
          <label className="tw-micro-label">QUANTIFIED SURFACE IMPACT</label>
          <div className="grid grid-cols-2 gap-2 font-mono text-xs">
            <div className="p-2.5 rounded-sm bg-tw-surface-2 border border-tw-border">
              <div className="text-[10px] text-tw-text-tertiary">IMPACT AREA</div>
              <div className="text-base font-bold text-tw-text-primary mt-0.5">
                {mod.flood_detection.inundated_hectares > 0
                  ? `+${mod.flood_detection.inundated_hectares}`
                  : mod.deforestation.lost_forest_hectares > 0
                  ? `-${mod.deforestation.lost_forest_hectares}`
                  : mod.crop_stress.stressed_hectares}{' '}
                <span className="text-[10px] text-tw-text-tertiary font-normal">ha</span>
              </div>
              <div className="text-[9px] text-tw-text-tertiary">10m GSD Calibrated</div>
            </div>

            <div className="p-2.5 rounded-sm bg-tw-surface-2 border border-tw-border">
              <div className="text-[10px] text-tw-text-tertiary">CONFIDENCE</div>
              <div className="text-base font-bold text-tw-accent mt-0.5">
                {Math.round(activeScenario.confidence_score * 100)}%
              </div>
              <div className="text-[9px] text-tw-text-tertiary">SCL Cloud Masked</div>
            </div>
          </div>
        </div>

        {/* Weather Correlation Block (The Differentiator) */}
        <div className="space-y-1.5 pt-2 border-t border-tw-border">
          <div className="flex items-center justify-between">
            <label className="tw-micro-label">METEOROLOGICAL GROUND TRUTH</label>
            <span className="text-[10px] font-mono font-bold text-tw-accent">
              {attr.attribution_verdict.replace(/_/g, ' ')}
            </span>
          </div>

          <div className="bg-tw-surface-2 p-2.5 rounded-sm border border-tw-border space-y-2 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-tw-text-tertiary">Cumulative Rain:</span>
              <span className="text-tw-text-primary font-bold">{wh.total_precipitation_mm} mm</span>
            </div>
            <div className="flex justify-between">
              <span className="text-tw-text-tertiary">Peak 24h Downpour:</span>
              <span className="text-tw-text-primary font-bold">{wh.max_single_day_rain_mm} mm</span>
            </div>
            <div className="flex justify-between">
              <span className="text-tw-text-tertiary">Mean Temperature:</span>
              <span className="text-tw-text-primary font-bold">{wh.mean_temperature_c} °C</span>
            </div>
            <div className="pt-1 border-t border-tw-border text-[9px] text-tw-text-tertiary">
              Source: {wh.source}
            </div>
          </div>
        </div>

        {/* 12-Month Multi-Temporal Trajectory */}
        <div className="space-y-1.5 pt-2 border-t border-tw-border">
          <label className="tw-micro-label">12-MONTH TRAJECTORY CURVE</label>
          <div className="h-28 w-full bg-tw-surface-2 p-2 rounded-sm border border-tw-border">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activeScenario.time_series_12m} margin={{ top: 5, right: 5, left: -30, bottom: 0 }}>
                <defs>
                  <linearGradient id="twNdviGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E8A33D" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#E8A33D" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#5E655F" fontSize={9} tickLine={false} />
                <YAxis domain={[0, 1]} stroke="#5E655F" fontSize={9} tickLine={false} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-tw-surface-3 border border-tw-border px-2 py-1 rounded-xs font-mono text-[10px]">
                          <div>{payload[0].payload.month}</div>
                          <div className="text-tw-accent font-bold">NDVI: {payload[0].value}</div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area type="monotone" dataKey="ndvi" stroke="#E8A33D" strokeWidth={1.5} fill="url(#twNdviGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sensor & Data Quality Disclosure */}
        <div className="p-2.5 rounded-sm bg-tw-surface-2/60 border border-tw-border text-[10px] font-mono text-tw-text-tertiary space-y-1">
          <div className="flex items-center space-x-1 text-tw-text-secondary font-semibold">
            <Info className="w-3 h-3 text-tw-accent" />
            <span>DISCLOSURE &amp; SENSOR LIMITATIONS</span>
          </div>
          <div>ESA Sentinel-2 MSI MultiSpectral Instrument | 10m GSD.</div>
          <div>Cloud mask applied: Scene Classification Layer (SCL 3, 8, 9, 10).</div>
        </div>
      </div>
    </aside>
  );
};
