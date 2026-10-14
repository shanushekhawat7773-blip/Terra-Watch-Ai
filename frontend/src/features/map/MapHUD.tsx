import React from 'react';
import { useAppStore } from '../../lib/store';
import { Compass, Maximize2, Layers, Sliders, Box, Map as MapIcon } from 'lucide-react';

export const MapHUD: React.FC = () => {
  const {
    cursorCoords,
    inspectorValues,
    is3D,
    toggle3D,
    isSwipeEnabled,
    toggleSwipe,
    activeScenario
  } = useAppStore();

  return (
    <>
      {/* Top Left: Scene Footprint & Sentinel Metadata */}
      <div className="absolute top-4 left-4 z-10 flex flex-col space-y-1.5 pointer-events-none select-none">
        <div className="flex items-center space-x-2 bg-tw-surface-1/90 backdrop-blur-md border border-tw-border px-3 py-1.5 rounded-sm shadow-xl font-mono text-[11px]">
          <span className="w-1.5 h-1.5 rounded-full bg-tw-accent animate-pulse" />
          <span className="text-tw-text-primary font-semibold tracking-wider">
            {activeScenario ? activeScenario.id.toUpperCase() : 'SENTINEL-2 L2A'}
          </span>
          <span className="text-tw-text-tertiary">|</span>
          <span className="text-tw-text-secondary">ORBIT R047</span>
          <span className="text-tw-text-tertiary">|</span>
          <span className="text-tw-text-secondary">TILE 43SBR</span>
        </div>

        <div className="bg-tw-surface-1/80 backdrop-blur-md border border-tw-border px-2.5 py-1 rounded-sm text-[10px] font-mono text-tw-text-tertiary flex items-center space-x-3">
          <span>CRS: <strong className="text-tw-text-secondary">EPSG:4326</strong></span>
          <span>GSD: <strong className="text-tw-text-secondary">10 METERS / PX</strong></span>
          <span>CLOUD: <strong className="text-tw-text-secondary">{activeScenario?.cloud_cover_percent || 3.4}%</strong></span>
        </div>
      </div>

      {/* Top Right: 3D Terrain & Basemap Controls */}
      <div className="absolute top-4 right-4 z-10 flex items-center space-x-2 select-none">
        <button
          onClick={toggle3D}
          className={`px-2.5 py-1.5 rounded-sm border font-mono text-xs flex items-center space-x-1.5 transition-all shadow-lg ${
            is3D
              ? 'bg-tw-accent/15 border-tw-accent text-tw-accent font-semibold'
              : 'bg-tw-surface-1/90 border-tw-border text-tw-text-secondary hover:text-tw-text-primary'
          }`}
          title="Toggle 3D Himalayan Terrain (AWS Terrarium DEM)"
        >
          <Box className="w-3.5 h-3.5" />
          <span>{is3D ? '3D TERRAIN ON' : 'FLATTEN 2D'}</span>
        </button>

        <button
          onClick={toggleSwipe}
          className={`px-2.5 py-1.5 rounded-sm border font-mono text-xs flex items-center space-x-1.5 transition-all shadow-lg ${
            isSwipeEnabled
              ? 'bg-tw-accent/15 border-tw-accent text-tw-accent font-semibold'
              : 'bg-tw-surface-1/90 border-tw-border text-tw-text-secondary hover:text-tw-text-primary'
          }`}
          title="Toggle Draggable Dual-Date Swipe Comparison"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>{isSwipeEnabled ? 'SWIPE ACTIVE' : 'SWIPE OFF'}</span>
        </button>
      </div>

      {/* Bottom Center: Pixel-Level Micro-Inspector HUD */}
      {inspectorValues && (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 bg-tw-surface-1/90 backdrop-blur-md border border-tw-border px-4 py-1.5 rounded-sm shadow-2xl flex items-center space-x-5 font-mono text-[11px] text-tw-text-secondary pointer-events-none select-none">
          <div className="flex items-center space-x-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-tw-data-veg" />
            <span>NDVI:</span>
            <span className="text-tw-text-primary font-bold">{inspectorValues.ndvi.toFixed(2)}</span>
          </div>

          <div className="flex items-center space-x-1.5 border-l border-tw-border pl-4">
            <span className="w-1.5 h-1.5 rounded-full bg-tw-data-water" />
            <span>MNDWI:</span>
            <span className="text-tw-text-primary font-bold">{inspectorValues.ndwi.toFixed(2)}</span>
          </div>

          <div className="flex items-center space-x-1.5 border-l border-tw-border pl-4">
            <span>CONFIDENCE:</span>
            <span className="text-tw-accent font-bold">{Math.round(inspectorValues.confidence * 100)}%</span>
          </div>

          <div className="flex items-center space-x-1.5 border-l border-tw-border pl-4 text-tw-text-tertiary text-[10px]">
            <span>LAT: {cursorCoords?.lat.toFixed(4)}°</span>
            <span>LON: {cursorCoords?.lon.toFixed(4)}°</span>
          </div>
        </div>
      )}

      {/* Bottom Left: Live Scale Bar & Legal Attribution */}
      <div className="absolute bottom-4 left-4 z-10 flex items-center space-x-3 pointer-events-none select-none text-[10px] font-mono text-tw-text-tertiary">
        <div className="flex items-center space-x-1 bg-tw-surface-1/80 px-2 py-0.5 rounded-sm border border-tw-border">
          <span className="inline-block w-8 border-b-2 border-tw-text-secondary" />
          <span>500 m</span>
        </div>
        <span>ESRI WORLD IMAGERY // COPERNICUS SENTINEL-2 L2A</span>
      </div>
    </>
  );
};
