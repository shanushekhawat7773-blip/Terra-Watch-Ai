import React from 'react';
import { useAppStore } from '../lib/store';
import { X, Keyboard } from 'lucide-react';

export const ShortcutsModal: React.FC = () => {
  const { shortcutsOpen, setShortcutsOpen } = useAppStore();

  if (!shortcutsOpen) return null;

  const shortcuts = [
    { key: '/', description: 'Focus location & BBox search' },
    { key: 'B', description: 'Toggle Before / After swipe divider' },
    { key: '3', description: 'Toggle 3D Himalayan Terrain (AWS Terrarium DEM)' },
    { key: 'L', description: 'Cycle through Spectral Basemap layers' },
    { key: '[', description: 'Collapse / Expand Left Rail' },
    { key: ']', description: 'Collapse / Expand Right Intelligence Panel' },
    { key: 'P', description: 'Open Dossier Print Preview' },
    { key: '?', description: 'Open Keyboard Shortcuts HUD' }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 select-none">
      <div className="bg-tw-surface-1 border border-tw-border w-full max-w-sm rounded-sm p-4 shadow-2xl space-y-3 font-mono">
        <div className="flex items-center justify-between border-b border-tw-border pb-2.5">
          <div className="flex items-center space-x-2 text-xs font-bold text-tw-text-primary">
            <Keyboard className="w-3.5 h-3.5 text-tw-accent" />
            <span>KEYBOARD SHORTCUTS</span>
          </div>
          <button
            onClick={() => setShortcutsOpen(false)}
            className="text-tw-text-tertiary hover:text-tw-text-primary"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2 text-xs">
          {shortcuts.map((s) => (
            <div key={s.key} className="flex items-center justify-between">
              <span className="text-tw-text-secondary">{s.description}</span>
              <kbd className="px-2 py-0.5 rounded-xs bg-tw-surface-2 border border-tw-border text-tw-accent font-bold">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
