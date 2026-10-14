import React, { useState } from 'react';
import { useAppStore } from '../lib/store';
import {
  Satellite,
  Search,
  Download,
  FileText,
  ChevronDown,
  HelpCircle,
  Type
} from 'lucide-react';

export const TopBar: React.FC = () => {
  const {
    activeScenario,
    scenarios,
    setActiveScenarioId,
    setReportOpen,
    setShortcutsOpen,
    fontSizeScale,
    setFontSizeScale
  } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="h-12 border-b border-tw-border bg-tw-surface-1 px-4 flex items-center justify-between z-30 select-none shadow-sm">
      {/* Brand & Wordmark */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          <Satellite className="w-4 h-4 text-tw-accent" />
          <span className="font-serif text-xl text-tw-text-primary tracking-wide italic font-medium">
            TerraWatch
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-xs bg-tw-surface-2 text-tw-text-tertiary border border-tw-border">
            IIT-MANDI
          </span>
        </div>
      </div>

      {/* Global Scenario Quick Selector & Search */}
      <div className="flex items-center space-x-3 font-mono text-xs">
        <div className="relative flex items-center">
          <select
            value={activeScenario?.id || ''}
            onChange={(e) => setActiveScenarioId(e.target.value)}
            className="appearance-none bg-tw-surface-2 border border-tw-border px-3 py-1.5 pr-8 rounded-sm text-xs font-mono text-tw-text-primary focus:outline-none focus:border-tw-accent cursor-pointer"
          >
            {scenarios.map((sc) => (
              <option key={sc.id} value={sc.id}>
                {sc.id === 'himachal_mandi_floods' ? '[LOCAL] ' : ''}{sc.title}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-tw-text-tertiary absolute right-2.5 pointer-events-none" />
        </div>

        <div className="hidden lg:flex items-center space-x-2 px-2.5 py-1 rounded-sm bg-tw-surface-2 border border-tw-border text-[11px] text-tw-text-tertiary">
          <Search className="w-3 h-3" />
          <input
            type="text"
            placeholder="Search coordinates or bbox..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent focus:outline-none text-tw-text-primary w-44 placeholder-tw-text-tertiary"
          />
          <kbd className="px-1 rounded-xs bg-tw-surface-3 text-[9px] border border-tw-border">/</kbd>
        </div>
      </div>

      {/* Font Size Adjuster & Actions */}
      <div className="flex items-center space-x-2">
        {/* Dynamic Font Size Control */}
        <div className="flex items-center bg-tw-surface-2 border border-tw-border rounded-sm p-0.5 text-[10px] font-mono">
          <button
            onClick={() => setFontSizeScale('sm')}
            className={`px-1.5 py-0.5 rounded-xs transition-colors ${
              fontSizeScale === 'sm' ? 'bg-tw-accent text-tw-bg font-bold' : 'text-tw-text-tertiary hover:text-tw-text-primary'
            }`}
            title="Compact Text"
          >
            A-
          </button>
          <button
            onClick={() => setFontSizeScale('md')}
            className={`px-1.5 py-0.5 rounded-xs transition-colors ${
              fontSizeScale === 'md' ? 'bg-tw-accent text-tw-bg font-bold' : 'text-tw-text-tertiary hover:text-tw-text-primary'
            }`}
            title="Standard Text"
          >
            A
          </button>
          <button
            onClick={() => setFontSizeScale('lg')}
            className={`px-1.5 py-0.5 rounded-xs transition-colors ${
              fontSizeScale === 'lg' ? 'bg-tw-accent text-tw-bg font-bold' : 'text-tw-text-tertiary hover:text-tw-text-primary'
            }`}
            title="Large / Accessible Text"
          >
            A+
          </button>
        </div>

        <button
          onClick={() => setShortcutsOpen(true)}
          className="p-1.5 rounded-sm border border-tw-border bg-tw-surface-2 text-tw-text-tertiary hover:text-tw-text-primary transition-colors"
          title="Keyboard Shortcuts (?)"
        >
          <HelpCircle className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => useAppStore.getState().setPitchDeckOpen(true)}
          className="px-2.5 py-1.5 rounded-sm border border-amber-500/50 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 transition-all text-xs font-mono font-bold flex items-center space-x-1.5 shadow-sm"
          title="Open IIT Mandi Judge Presentation Deck & Defense Guide"
        >
          <span className="text-amber-300">🏆</span>
          <span>WINNING DECK</span>
        </button>

        <button
          onClick={() => setReportOpen(true)}
          className="px-3 py-1.5 rounded-sm border border-tw-accent/40 bg-tw-accent-dim text-tw-accent hover:bg-tw-accent/25 transition-all text-xs font-mono font-semibold flex items-center space-x-1.5 shadow-sm"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>DOSSIER PREVIEW</span>
        </button>
      </div>
    </header>
  );
};
