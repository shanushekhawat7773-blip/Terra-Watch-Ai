import React, { useState, useEffect } from 'react';
import { useAppStore } from '../lib/store';
import { Globe2, ArrowRight, Clock, Satellite } from 'lucide-react';

export const IntroScreen: React.FC = () => {
  const { introDismissed, setIntroDismissed } = useAppStore();
  const [utcTime, setUtcTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setUtcTime(now.toUTCString().slice(17, 25) + ' UTC');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  if (introDismissed) return null;

  return (
    <div className="fixed inset-0 z-50 bg-tw-bg flex flex-col justify-between p-8 select-none overflow-hidden tw-film-grain">
      {/* Background Subtle Drifting Satellite Overlay */}
      <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-900/20 via-black to-black" />

      {/* Top Bar: Mission Clock & Satellite Ephemeris */}
      <div className="relative z-10 flex items-center justify-between text-xs font-mono text-tw-text-tertiary">
        <div className="flex items-center space-x-3">
          <Satellite className="w-4 h-4 text-tw-accent" />
          <span className="text-tw-text-secondary font-semibold">COPERNICUS SENTINEL-2 ORBIT R047</span>
          <span>//</span>
          <span>SUN-SYNCHRONOUS 786 KM</span>
        </div>
        <div className="flex items-center space-x-2">
          <Clock className="w-3.5 h-3.5 text-tw-text-tertiary" />
          <span className="text-tw-text-primary font-bold">{utcTime || '12:00:00 UTC'}</span>
        </div>
      </div>

      {/* Center Cinematic Editorial Masthead */}
      <div className="relative z-10 max-w-2xl space-y-4">
        <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-xs bg-tw-surface-2 border border-tw-border text-[11px] font-mono text-tw-text-secondary">
          <span className="w-1.5 h-1.5 rounded-full bg-tw-accent" />
          <span>IIT MANDI HACKATHON // EARTH OBSERVATION SURVEILLANCE</span>
        </div>

        <h1 className="font-serif text-5xl md:text-6xl text-tw-text-primary leading-[1.08] font-normal tracking-tight">
          Planetary surveillance, <br />
          grounded in climate truth.
        </h1>

        <p className="text-sm md:text-base text-tw-text-secondary leading-relaxed font-sans max-w-xl">
          TerraWatch detects surface change across Earth’s biomes using 10-meter Sentinel-2 
          spectral imagery and automatically correlates events with local meteorological history 
          to distinguish human encroachment from natural disasters.
        </p>

        <div className="pt-4 flex items-center space-x-4">
          <button
            onClick={() => setIntroDismissed(true)}
            className="px-5 py-2.5 rounded-sm bg-tw-accent text-tw-bg font-mono text-xs font-bold tracking-wider uppercase flex items-center space-x-2 hover:bg-amber-400 transition-all shadow-xl"
          >
            <span>ENTER WORKSPACE</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <span className="text-xs font-mono text-tw-text-tertiary">
            Press any key or click to initiate 3D terrain
          </span>
        </div>
      </div>

      {/* Bottom Footer: Sensor Attribution */}
      <div className="relative z-10 flex items-center justify-between text-[11px] font-mono text-tw-text-tertiary border-t border-tw-border pt-4">
        <div>ESRI WORLD IMAGERY // SENTINEL-2 LEVEL-2A MSI // OPEN-METEO CLIMATE REANALYSIS</div>
        <div>CALIBRATED AGAINST AUGUST 2023 HIMACHAL DISASTER</div>
      </div>
    </div>
  );
};
