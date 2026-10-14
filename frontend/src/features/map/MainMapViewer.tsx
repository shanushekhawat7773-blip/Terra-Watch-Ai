import React, { useRef, useEffect, useState } from 'react';
import maplibregl from 'maplibre-gl';
import { useAppStore, BasemapMode } from '../../lib/store';
import { MapHUD } from './MapHUD';
import {
  Sliders,
  Map as MapIcon,
  Globe,
  Mountain,
  Plus,
  Minus,
  Layers,
  Waves,
  AlertTriangle,
  ArrowRight,
  Info,
  Building2,
  Car
} from 'lucide-react';

export const MainMapViewer: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<maplibregl.Map | null>(null);

  const {
    activeScenario,
    is3D,
    basemap,
    setBasemap,
    isSwipeEnabled,
    swipePosition,
    setSwipePosition,
    overlayOpacity,
    setCursorCoords,
    setInspectorValues
  } = useAppStore();

  const [isDraggingSwipe, setIsDraggingSwipe] = useState(false);
  const [showFloodFlow, setShowFloodFlow] = useState(true);
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);

  // Initialize MapLibre GL with Real Google Maps Basemaps
  useEffect(() => {
    if (!mapContainer.current || mapInstance.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          // Google Satellite Hybrid (Real satellite + road networks + place names)
          'google-hybrid': {
            type: 'raster',
            tiles: [
              'https://mt0.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
              'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
              'https://mt2.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
              'https://mt3.google.com/vt/lyrs=y&x={x}&y={y}&z={z}'
            ],
            tileSize: 256,
            attribution: '© Google Maps'
          },
          // Google Pure Satellite
          'google-sat': {
            type: 'raster',
            tiles: [
              'https://mt0.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
              'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
              'https://mt2.google.com/vt/lyrs=s&x={x}&y={y}&z={z}'
            ],
            tileSize: 256,
            attribution: '© Google Maps'
          },
          // Google Street Map (Roads, Highways, Settlements)
          'google-street': {
            type: 'raster',
            tiles: [
              'https://mt0.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
              'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
              'https://mt2.google.com/vt/lyrs=m&x={x}&y={y}&z={z}'
            ],
            tileSize: 256,
            attribution: '© Google Maps'
          },
          // Google Terrain with Relief
          'google-terrain': {
            type: 'raster',
            tiles: [
              'https://mt0.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',
              'https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',
              'https://mt2.google.com/vt/lyrs=p&x={x}&y={y}&z={z}'
            ],
            tileSize: 256,
            attribution: '© Google Maps'
          }
        },
        layers: [
          {
            id: 'layer-hybrid',
            type: 'raster',
            source: 'google-hybrid',
            layout: { visibility: 'visible' }
          },
          {
            id: 'layer-satellite',
            type: 'raster',
            source: 'google-sat',
            layout: { visibility: 'none' }
          },
          {
            id: 'layer-street',
            type: 'raster',
            source: 'google-street',
            layout: { visibility: 'none' }
          },
          {
            id: 'layer-terrain',
            type: 'raster',
            source: 'google-terrain',
            layout: { visibility: 'none' }
          }
        ]
      },
      center: [76.9318, 31.7087], // Mandi, Himachal Pradesh
      zoom: 13.5,
      pitch: 0,
      bearing: 0,
      attributionControl: false
    });

    map.on('mousemove', (e) => {
      setCursorCoords({ lat: e.lngLat.lat, lon: e.lngLat.lng });
      const hash = Math.sin(e.lngLat.lat * 100) * Math.cos(e.lngLat.lng * 100);
      const ndvi = Math.max(-0.2, Math.min(0.85, 0.55 + hash * 0.3));
      const ndwi = Math.max(-0.6, Math.min(0.7, -0.2 - hash * 0.4));
      setInspectorValues({
        ndvi: parseFloat(ndvi.toFixed(2)),
        ndwi: parseFloat(ndwi.toFixed(2)),
        confidence: 0.92
      });
    });

    mapInstance.current = map;

    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, []);

  // Update Basemap Layer on switch
  useEffect(() => {
    if (!mapInstance.current) return;
    const map = mapInstance.current;
    if (!map.isStyleLoaded()) return;

    map.setLayoutProperty('layer-hybrid', 'visibility', basemap === 'hybrid' ? 'visible' : 'none');
    map.setLayoutProperty('layer-satellite', 'visibility', basemap === 'satellite' ? 'visible' : 'none');
    map.setLayoutProperty('layer-street', 'visibility', basemap === 'street' ? 'visible' : 'none');
    map.setLayoutProperty('layer-terrain', 'visibility', basemap === 'terrain' ? 'visible' : 'none');
  }, [basemap]);

  // Handle 3D / Flatten
  useEffect(() => {
    if (!mapInstance.current) return;
    mapInstance.current.easeTo({
      pitch: is3D ? 50 : 0,
      duration: 600
    });
  }, [is3D]);

  // Fly to scenario when changed
  useEffect(() => {
    if (!mapInstance.current || !activeScenario) return;
    const { lon, lat, zoom } = activeScenario.coordinates;
    mapInstance.current.flyTo({
      center: [lon, lat],
      zoom: zoom || 13.2,
      pitch: is3D ? 50 : 0,
      duration: 1500,
      essential: true
    });
  }, [activeScenario]);

  // Add Dynamic Vector Flood Flow Vector Line & Inundation Polygon onto MapLibre WebGL
  useEffect(() => {
    if (!mapInstance.current || !activeScenario) return;
    const map = mapInstance.current;

    const setupFloodVectors = () => {
      const fi = activeScenario.flood_impact;
      if (!fi) return;

      // 1. Water Inundation Polygon Source
      if (map.getSource('flood-polygon-source')) {
        (map.getSource('flood-polygon-source') as maplibregl.GeoJSONSource).setData({
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [fi.water_extent_polygon]
          },
          properties: {}
        });
      } else {
        map.addSource('flood-polygon-source', {
          type: 'geojson',
          data: {
            type: 'Feature',
            geometry: {
              type: 'Polygon',
              coordinates: [fi.water_extent_polygon]
            },
            properties: {}
          }
        });

        // Semi-transparent flood water surface
        map.addLayer({
          id: 'flood-polygon-fill',
          type: 'fill',
          source: 'flood-polygon-source',
          paint: {
            'fill-color': '#0284c7', // Sky Blue Water Inundation
            'fill-opacity': 0.45
          }
        });

        // Flood perimeter boundary line
        map.addLayer({
          id: 'flood-polygon-outline',
          type: 'line',
          source: 'flood-polygon-source',
          paint: {
            'line-color': '#0369a1',
            'line-width': 2.5,
            'line-dasharray': [2, 1]
          }
        });
      }

      // 2. Flood Flow Direction Torrent Vector Line (Beas River Vector)
      if (map.getSource('flood-flow-source')) {
        (map.getSource('flood-flow-source') as maplibregl.GeoJSONSource).setData({
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: fi.flow_path
          },
          properties: {}
        });
      } else {
        map.addSource('flood-flow-source', {
          type: 'geojson',
          data: {
            type: 'Feature',
            geometry: {
              type: 'LineString',
              coordinates: fi.flow_path
            },
            properties: {}
          }
        });

        // High visibility animated torrent line
        map.addLayer({
          id: 'flood-flow-line',
          type: 'line',
          source: 'flood-flow-source',
          paint: {
            'line-color': '#38bdf8',
            'line-width': 5,
            'line-opacity': 0.95
          }
        });

        // Pulsing flow vector casing
        map.addLayer({
          id: 'flood-flow-casing',
          type: 'line',
          source: 'flood-flow-source',
          paint: {
            'line-color': '#0c4a6e',
            'line-width': 8,
            'line-opacity': 0.5
          }
        });
      }

      // Toggle visibility based on showFloodFlow state
      const vis = showFloodFlow ? 'visible' : 'none';
      if (map.getLayer('flood-polygon-fill')) map.setLayoutProperty('flood-polygon-fill', 'visibility', vis);
      if (map.getLayer('flood-polygon-outline')) map.setLayoutProperty('flood-polygon-outline', 'visibility', vis);
      if (map.getLayer('flood-flow-line')) map.setLayoutProperty('flood-flow-line', 'visibility', vis);
      if (map.getLayer('flood-flow-casing')) map.setLayoutProperty('flood-flow-casing', 'visibility', vis);
    };

    if (map.isStyleLoaded()) {
      setupFloodVectors();
    } else {
      map.once('load', setupFloodVectors);
    }
  }, [activeScenario, showFloodFlow]);

  // Swipe drag mechanics
  const handleMouseDown = () => setIsDraggingSwipe(true);
  const handleMouseUp = () => setIsDraggingSwipe(false);
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDraggingSwipe || !mapContainer.current) return;
    const rect = mapContainer.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    setSwipePosition((x / rect.width) * 100);
  };

  // Zoom controls
  const handleZoomIn = () => mapInstance.current?.zoomIn();
  const handleZoomOut = () => mapInstance.current?.zoomOut();

  const floodImpact = activeScenario?.flood_impact;

  return (
    <div
      className="relative w-full h-full overflow-hidden select-none bg-[#e5e3df]"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Real Google Maps Tile Canvas */}
      <div ref={mapContainer} className="w-full h-full" />

      {/* Floating Google Maps Style View Switcher (Top Left) */}
      <div className="absolute top-4 left-4 z-20 flex items-center bg-white rounded-md shadow-lg border border-slate-200 p-1 font-sans text-xs select-none">
        <button
          onClick={() => setBasemap('hybrid')}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded transition-all font-medium ${
            basemap === 'hybrid'
              ? 'bg-[#1a73e8] text-white font-bold shadow-sm'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
          title="Google Maps Satellite Imagery with Road Names & Places"
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Satellite + Labels</span>
        </button>

        <button
          onClick={() => setBasemap('street')}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded transition-all font-medium ${
            basemap === 'street'
              ? 'bg-[#1a73e8] text-white font-bold shadow-sm'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
          title="Google Maps Standard Default Road View"
        >
          <MapIcon className="w-3.5 h-3.5" />
          <span>Map (Default)</span>
        </button>

        <button
          onClick={() => setBasemap('terrain')}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded transition-all font-medium ${
            basemap === 'terrain'
              ? 'bg-[#1a73e8] text-white font-bold shadow-sm'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
          title="Google Maps Terrain with Mountain Contours"
        >
          <Mountain className="w-3.5 h-3.5" />
          <span>Terrain</span>
        </button>

        <button
          onClick={() => setBasemap('satellite')}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded transition-all font-medium ${
            basemap === 'satellite'
              ? 'bg-[#1a73e8] text-white font-bold shadow-sm'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
          title="Google Maps Pure Satellite Only"
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Satellite Only</span>
        </button>
      </div>

      {/* Flood Flow Vector & Layer Control Toggle (Top Right) */}
      <div className="absolute top-4 right-4 z-20 flex items-center space-x-2">
        <button
          onClick={() => setShowFloodFlow(!showFloodFlow)}
          className={`px-3 py-1.5 rounded-md text-xs font-sans font-medium flex items-center space-x-1.5 shadow-lg border transition-all ${
            showFloodFlow
              ? 'bg-cyan-500 text-slate-900 border-cyan-600 font-bold'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
          title="Toggle River Flow Direction & Flood Inundation Vectors"
        >
          <Waves className="w-3.5 h-3.5 text-cyan-900" />
          <span>{showFloodFlow ? 'FLOOD FLOW VECTORS: ON' : 'FLOOD FLOW VECTORS: OFF'}</span>
        </button>
      </div>

      {/* Floating Flood Flow & Impact Intelligence Notification Card (Left Center) */}
      {floodImpact && showFloodFlow && (
        <div className="absolute top-16 left-4 z-20 w-80 bg-white/95 backdrop-blur-md rounded-lg shadow-2xl border border-slate-300 p-3.5 font-sans text-xs text-slate-800 space-y-3 select-none">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
              <span className="font-bold text-red-600 uppercase tracking-wide text-[11px]">
                FLASH FLOOD TORRENT INUNDATION
              </span>
            </div>
            <span className="text-[10px] font-mono bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-bold">
              CRITICAL
            </span>
          </div>

          {/* Flow Direction & Origin */}
          <div className="bg-slate-50 border border-slate-200 rounded p-2.5 space-y-1 font-mono text-[11px]">
            <div className="text-slate-500 text-[10px]">WATER SOURCE &amp; FLOW TRAJECTORY</div>
            <div className="font-bold text-slate-900 flex items-center space-x-1">
              <span>{floodImpact.source_river}</span>
            </div>
            <div className="text-blue-600 font-bold flex items-center space-x-1 text-[10px]">
              <ArrowRight className="w-3 h-3 text-blue-600 shrink-0" />
              <span>FLOW: {floodImpact.flow_direction}</span>
            </div>
            <div className="text-slate-600 text-[10px] pt-1 border-t border-slate-200 flex justify-between">
              <span>Peak Discharge: <strong>{floodImpact.peak_discharge_cusecs}</strong></span>
              <span>Surge: <strong>+{floodImpact.surge_height_meters}m</strong></span>
            </div>
          </div>

          {/* Specific Affected Landmark Notifications */}
          <div className="space-y-1.5">
            <div className="text-[10px] font-mono text-slate-500 uppercase font-semibold">
              SPECIFIC LOCATIONS AFFECTED IN THIS AREA
            </div>
            <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
              {floodImpact.affected_zones.map((zone) => {
                const isSelected = selectedZoneId === zone.id;

                return (
                  <div
                    key={zone.id}
                    onClick={() => {
                      setSelectedZoneId(zone.id);
                      mapInstance.current?.flyTo({
                        center: zone.coordinates,
                        zoom: 15,
                        duration: 1200
                      });
                    }}
                    className={`p-2 rounded border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-blue-50 border-blue-500 shadow-sm'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] font-bold">
                      <div className="flex items-center space-x-1.5 text-slate-900">
                        {zone.type === 'SETTLEMENT' ? (
                          <Building2 className="w-3.5 h-3.5 text-red-500" />
                        ) : (
                          <Car className="w-3.5 h-3.5 text-amber-500" />
                        )}
                        <span>{zone.name}</span>
                      </div>
                      <span className={`text-[9px] px-1 py-0.2 rounded font-mono font-bold ${
                        zone.status === 'SUBMERGED'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {zone.status}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-600 mt-1 leading-tight">
                      {zone.impact_description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Google Maps Style Clean Floating Zoom Controls (Bottom Right) */}
      <div className="absolute bottom-6 right-6 z-20 flex flex-col bg-white border border-slate-300 rounded shadow-xl overflow-hidden text-slate-700">
        <button
          onClick={handleZoomIn}
          className="p-2.5 hover:bg-slate-100 transition-colors border-b border-slate-200"
          title="Zoom In"
        >
          <Plus className="w-4 h-4 text-slate-800" />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-2.5 hover:bg-slate-100 transition-colors"
          title="Zoom Out"
        >
          <Minus className="w-4 h-4 text-slate-800" />
        </button>
      </div>

      {/* Draggable Swipe Comparison Divider */}
      {isSwipeEnabled && (
        <div
          className="absolute top-0 bottom-0 z-20 pointer-events-auto cursor-ew-resize"
          style={{ left: `${swipePosition}%` }}
          onMouseDown={handleMouseDown}
        >
          <div className="w-[2px] h-full bg-[#1a73e8] relative shadow-[0_0_8px_rgba(26,115,232,0.8)]">
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white border-2 border-[#1a73e8] flex items-center justify-center shadow-2xl">
              <Sliders className="w-4 h-4 text-[#1a73e8]" />
            </div>
          </div>

          <div className="absolute top-16 -translate-x-[110%] bg-white/95 text-slate-900 border border-slate-300 px-2.5 py-1 rounded shadow-lg font-mono text-[10px] whitespace-nowrap">
            <span className="text-slate-500 font-medium">BEFORE: </span>
            <strong className="text-slate-900 font-bold">{activeScenario?.dates.before || 'T1'}</strong>
          </div>

          <div className="absolute top-16 translate-x-[10%] bg-white/95 text-slate-900 border border-slate-300 px-2.5 py-1 rounded shadow-lg font-mono text-[10px] whitespace-nowrap">
            <span className="text-slate-500 font-medium">AFTER: </span>
            <strong className="text-[#1a73e8] font-bold">{activeScenario?.dates.after || 'T2'}</strong>
          </div>
        </div>
      )}

      {/* Map HUD Controls & Telemetry */}
      <MapHUD />
    </div>
  );
};
