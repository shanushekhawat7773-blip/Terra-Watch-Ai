import React, { useRef, useEffect, useState } from 'react';
import maplibregl from 'maplibre-gl';
import { AnalysisDetail } from '../types';
import { LayerMode } from './LayerControl';
import { Sliders, Maximize2, Sparkles } from 'lucide-react';

interface Props {
  detail: AnalysisDetail | null;
  activeLayer: LayerMode;
  overlayOpacity: number;
}

export const EarthMapViewer: React.FC<Props> = ({
  detail,
  activeLayer,
  overlayOpacity
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<maplibregl.Map | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Swipe slider state (0 to 100 percentage)
  const [sliderPos, setSliderPos] = useState<number>(50);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Initialize MapLibre GL
  useEffect(() => {
    if (!mapContainer.current || mapInstance.current) return;

    // High performance dark Carto style
    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
      center: [76.9318, 31.7087], // Default Mandi
      zoom: 13.5,
      pitch: 25,
      bearing: 0,
      attributionControl: false
    });

    map.addControl(new maplibregl.NavigationControl({ showCompass: true }), 'bottom-right');
    mapInstance.current = map;

    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, []);

  // Fly to scenario coordinates when detail changes
  useEffect(() => {
    if (!mapInstance.current || !detail) return;
    const { lon, lat, zoom } = detail.coordinates;
    mapInstance.current.flyTo({
      center: [lon, lat],
      zoom: zoom || 13,
      duration: 1800,
      essential: true
    });
  }, [detail]);

  // Render High-Resolution Procedural Heatmap / Spectral Mask onto Overlay Canvas
  useEffect(() => {
    if (!canvasRef.current || !detail) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const hm = detail.heatmap;
    if (!hm || !hm.grid) return;

    const grid = activeLayer === 'cva_heat'
      ? hm.grid
      : activeLayer === 'ndvi'
      ? hm.after_grid
      : hm.grid;

    const rows = grid.length;
    const cols = grid[0].length;
    const cellW = w / cols;
    const cellH = h / rows;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const val = grid[r][c];
        if (activeLayer === 'cva_heat') {
          // Heatmap: Green (0) -> Amber (0.4) -> Deep Red (0.8+)
          if (val > 0.15) {
            const alpha = Math.min((val - 0.15) * 1.5, 0.95);
            if (val > 0.5) {
              ctx.fillStyle = `rgba(239, 68, 68, ${alpha})`; // Signal Rose
            } else if (val > 0.3) {
              ctx.fillStyle = `rgba(245, 158, 11, ${alpha})`; // Amber
            } else {
              ctx.fillStyle = `rgba(234, 179, 8, ${alpha * 0.7})`;
            }
            ctx.fillRect(c * cellW, r * cellH, cellW + 1, cellH + 1);
          }
        } else if (activeLayer === 'ndvi') {
          // Canopy coloring
          const norm = Math.max(0, Math.min(1, (val + 0.2) / 1.0));
          ctx.fillStyle = `rgba(16, 185, 129, ${norm * 0.75})`;
          ctx.fillRect(c * cellW, r * cellH, cellW + 1, cellH + 1);
        } else if (activeLayer === 'ndwi') {
          // Water inundation coloring
          if (val > 0) {
            ctx.fillStyle = `rgba(6, 182, 212, 0.85)`;
            ctx.fillRect(c * cellW, r * cellH, cellW + 1, cellH + 1);
          }
        }
      }
    }
  }, [detail, activeLayer, overlayOpacity]);

  // Swipe handle drag mechanics
  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !mapContainer.current) return;
    const rect = mapContainer.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    setSliderPos((x / rect.width) * 100);
  };

  return (
    <div
      className="relative w-full h-full overflow-hidden select-none bg-space-950"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* MapLibre WebGL Canvas Container */}
      <div ref={mapContainer} className="w-full h-full" />

      {/* Heatmap & Analytical Overlay Canvas */}
      <canvas
        ref={canvasRef}
        width={600}
        height={600}
        style={{ opacity: overlayOpacity }}
        className="absolute inset-0 w-full h-full pointer-events-none mix-blend-screen"
      />

      {/* Bounding Box Coordinate HUD Reticle */}
      <div className="absolute top-4 left-4 z-10 bg-space-900/85 backdrop-blur-md border border-space-700 px-3 py-2 rounded font-mono text-[11px] text-slate-300 pointer-events-none shadow-lg">
        <div className="flex items-center space-x-2 text-emerald-400 font-bold mb-0.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>TARGET LOCK // {detail ? detail.id.toUpperCase() : 'SEARCHING'}</span>
        </div>
        <div className="text-slate-400 text-[10px]">
          LAT: {detail?.coordinates.lat.toFixed(4)}°N | LON: {detail?.coordinates.lon.toFixed(4)}°E
        </div>
        <div className="text-slate-500 text-[9px] mt-0.5">
          GSD: 10 METERS / PX | PROJECTION: EPSG:4326 (WGS84)
        </div>
      </div>

      {/* Swipe Slider Comparison Divider */}
      <div
        className="absolute top-0 bottom-0 z-20 pointer-events-auto cursor-ew-resize"
        style={{ left: `${sliderPos}%` }}
        onMouseDown={handleMouseDown}
      >
        <div className="w-0.5 h-full bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.8)] relative">
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-space-900 border-2 border-emerald-400 flex items-center justify-center shadow-xl">
            <Sliders className="w-4 h-4 text-emerald-400" />
          </div>
        </div>
      </div>

      {/* Before / After Swipe Labels */}
      <div className="absolute bottom-6 left-6 z-10 bg-space-900/80 backdrop-blur-md border border-space-700 px-2.5 py-1 rounded font-mono text-[10px] text-slate-300">
        <span className="text-slate-400">BEFORE: </span>
        <span className="text-slate-100 font-semibold">{detail?.dates.before || 'T1'}</span>
      </div>

      <div className="absolute bottom-6 right-16 z-10 bg-space-900/80 backdrop-blur-md border border-space-700 px-2.5 py-1 rounded font-mono text-[10px] text-slate-300">
        <span className="text-slate-400">AFTER: </span>
        <span className="text-emerald-400 font-semibold">{detail?.dates.after || 'T2'}</span>
      </div>
    </div>
  );
};
