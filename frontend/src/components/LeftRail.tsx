import React from 'react';
import { useAppStore } from '../lib/store';
import {
  Layers,
  MapPin,
  Calendar,
  Filter,
  Eye,
  Sliders,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export const LeftRail: React.FC = () => {
  const {
    leftRailOpen,
    toggleLeftRail,
    basemap,
    setBasemap,
    overlayMode,
    setOverlayMode,
    overlayOpacity,
    setOverlayOpacity,
    scenarios,
    activeScenarioId,
    setActiveScenarioId,
    activeScenario
  } = useAppStore();

  if (!leftRailOpen) {
    return (
      <button
        onClick={toggleLeftRail}
        className="absolute top-16 left-3 z-30 p-2 rounded-sm bg-tw-surface-1 border border-tw-border text-tw-text-secondary hover:text-tw-text-primary shadow-xl transition-all"
        title="Expand Surveillance Rail"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    );
  }

  return (
    <aside className="w-80 h-full border-r border-tw-border bg-tw-surface-1 flex flex-col z-20 select-none shadow-2xl">
      {/* Rail Header */}
      <div className="h-12 border-b border-tw-border px-3.5 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Layers className="w-3.5 h-3.5 text-tw-accent" />
          <span className="tw-micro-label text-tw-text-primary font-semibold">
            SURVEILLANCE CONFIG
          </span>
        </div>
        <button
          onClick={toggleLeftRail}
          className="p-1 rounded-sm text-tw-text-tertiary hover:text-tw-text-primary transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3.5 space-y-4">
        {/* Section 1: Pre-Loaded Ground Truth Scenarios */}
        <div className="space-y-1.5">
          <label className="tw-micro-label">SCENARIO TARGET</label>
          <div className="space-y-1">
            {scenarios.map((sc) => {
              const isSelected = sc.id === activeScenarioId;
              const isHimachal = sc.id === 'himachal_mandi_floods';

              return (
                <button
                  key={sc.id}
                  onClick={() => setActiveScenarioId(sc.id)}
                  className={`w-full text-left p-2 rounded-sm border transition-all relative ${
                    isSelected
                      ? 'bg-tw-surface-2 border-tw-accent text-tw-text-primary font-medium'
                      : 'bg-tw-surface-1/60 border-tw-border text-tw-text-secondary hover:border-tw-border-subtle'
                  }`}
                >
                  {isHimachal && (
                    <span className="absolute top-2 right-2 text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-xs bg-tw-accent-dim text-tw-accent border border-tw-accent/40">
                      LOCAL MANDI
                    </span>
                  )}
                  <div className="text-xs font-semibold text-tw-text-primary truncate pr-16">
                    {sc.title}
                  </div>
                  <div className="text-[10px] text-tw-text-tertiary font-mono truncate mt-0.5">
                    {sc.location}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 2: Basemap Switcher (Google Maps Views) */}
        <div className="space-y-1.5 pt-2 border-t border-tw-border">
          <label className="tw-micro-label">MAP VIEW / PERSPECTIVE</label>
          <div className="grid grid-cols-2 gap-1.5 font-mono text-[11px]">
            <button
              onClick={() => setBasemap('hybrid')}
              className={`p-1.5 rounded-sm border text-left truncate transition-all ${
                basemap === 'hybrid'
                  ? 'bg-tw-surface-2 border-tw-accent text-tw-accent font-bold'
                  : 'bg-tw-surface-1 border-tw-border text-tw-text-tertiary hover:text-tw-text-secondary'
              }`}
            >
              🛰️ Satellite + Labels
            </button>
            <button
              onClick={() => setBasemap('satellite')}
              className={`p-1.5 rounded-sm border text-left truncate transition-all ${
                basemap === 'satellite'
                  ? 'bg-tw-surface-2 border-tw-accent text-tw-accent font-bold'
                  : 'bg-tw-surface-1 border-tw-border text-tw-text-tertiary hover:text-tw-text-secondary'
              }`}
            >
              🌍 Pure Satellite
            </button>
            <button
              onClick={() => setBasemap('street')}
              className={`p-1.5 rounded-sm border text-left truncate transition-all ${
                basemap === 'street'
                  ? 'bg-tw-surface-2 border-tw-accent text-tw-accent font-bold'
                  : 'bg-tw-surface-1 border-tw-border text-tw-text-tertiary hover:text-tw-text-secondary'
              }`}
            >
              🗺️ Street Map
            </button>
            <button
              onClick={() => setBasemap('terrain')}
              className={`p-1.5 rounded-sm border text-left truncate transition-all ${
                basemap === 'terrain'
                  ? 'bg-tw-surface-2 border-tw-accent text-tw-accent font-bold'
                  : 'bg-tw-surface-1 border-tw-border text-tw-text-tertiary hover:text-tw-text-secondary'
              }`}
            >
              ⛰️ Terrain Map
            </button>
          </div>
        </div>

        {/* Section 3: Change Detection Overlay Mode */}
        <div className="space-y-1.5 pt-2 border-t border-tw-border">
          <label className="tw-micro-label">CHANGE VECTOR RENDERER</label>
          <div className="grid grid-cols-3 gap-1 font-mono text-[10px]">
            {(['vector', 'heatmap', 'pixel'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setOverlayMode(mode)}
                className={`py-1 rounded-sm border capitalize text-center transition-all ${
                  overlayMode === mode
                    ? 'bg-tw-surface-2 border-tw-accent text-tw-accent font-bold'
                    : 'bg-tw-surface-1 border-tw-border text-tw-text-tertiary'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          <div className="pt-2">
            <div className="flex items-center justify-between text-[10px] font-mono text-tw-text-tertiary mb-1">
              <span>OPACITY</span>
              <span className="text-tw-text-secondary">{Math.round(overlayOpacity * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.05"
              value={overlayOpacity}
              onChange={(e) => setOverlayOpacity(parseFloat(e.target.value))}
              className="w-full h-1 bg-tw-surface-3 rounded-lg appearance-none cursor-pointer accent-tw-accent"
            />
          </div>
        </div>

        {/* Section 4: Acquisition Dates */}
        <div className="space-y-1.5 pt-2 border-t border-tw-border font-mono text-[11px]">
          <label className="tw-micro-label">ACQUISITION TIMESTAMPS</label>
          <div className="bg-tw-surface-2 p-2 rounded-sm border border-tw-border space-y-1">
            <div className="flex justify-between">
              <span className="text-tw-text-tertiary">BEFORE (T1):</span>
              <span className="text-tw-text-primary font-bold">{activeScenario?.dates.before || '2023-07-02'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-tw-text-tertiary">AFTER (T2):</span>
              <span className="text-tw-accent font-bold">{activeScenario?.dates.after || '2023-08-18'}</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
