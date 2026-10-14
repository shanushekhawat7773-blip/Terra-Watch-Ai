import React, { useEffect } from 'react';
import { useAppStore } from './lib/store';
import { TopBar } from './components/TopBar';
import { LeftRail } from './components/LeftRail';
import { RightPanel } from './components/RightPanel';
import { MainMapViewer } from './features/map/MainMapViewer';
import { IntroScreen } from './components/IntroScreen';
import { ReportView } from './components/ReportView';
import { ShortcutsModal } from './components/ShortcutsModal';
import { JudgePitchModal } from './components/JudgePitchModal';

export function App() {
  const {
    activeScenarioId,
    setActiveScenario,
    setScenarios,
    setAlerts,
    toggleSwipe,
    toggle3D,
    toggleLeftRail,
    toggleRightPanel,
    setReportOpen,
    setShortcutsOpen,
    isLoading,
    loadingStep,
    setLoadingState,
    fontSizeScale
  } = useAppStore();

  // Load scenarios catalog on mount
  useEffect(() => {
    async function initCatalog() {
      try {
        const scRes = await fetch('/api/scenarios');
        const scData = await scRes.json();
        setScenarios(scData);

        const alRes = await fetch('/api/alerts');
        const alData = await alRes.json();
        setAlerts(alData);

        loadScenarioData(activeScenarioId);
      } catch (err) {
        console.error('Failed to init catalog', err);
      }
    }
    initCatalog();
  }, []);

  // Watch activeScenarioId and fetch details with step progress
  useEffect(() => {
    if (activeScenarioId) {
      loadScenarioData(activeScenarioId);
    }
  }, [activeScenarioId]);

  const loadScenarioData = async (id: string) => {
    setLoadingState(true, 'Querying Microsoft Planetary Computer STAC catalog...', 45);
    try {
      await new Promise((r) => setTimeout(r, 120));
      setLoadingState(true, 'Applying SCL Scene Classification & Cirrus Masking...', 180);
      await new Promise((r) => setTimeout(r, 120));
      setLoadingState(true, 'Executing Sub-Pixel OpenCV ECC Co-Registration...', 320);
      await new Promise((r) => setTimeout(r, 120));
      setLoadingState(true, 'Computing Change Vector Analysis (CVA) & Spectral Differences...', 490);
      await new Promise((r) => setTimeout(r, 120));
      setLoadingState(true, 'Correlating with Open-Meteo & NASA POWER Weather Records...', 680);

      const res = await fetch(`/api/scenarios/${id}`);
      const data = await res.json();
      setActiveScenario(data);
    } catch (e) {
      console.error('Failed to load scenario', e);
    } finally {
      setLoadingState(false, '', 0);
    }
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key === 'b' || e.key === 'B') toggleSwipe();
      if (e.key === '3') toggle3D();
      if (e.key === '[') toggleLeftRail();
      if (e.key === ']') toggleRightPanel();
      if (e.key === 'p' || e.key === 'P') setReportOpen(true);
      if (e.key === '?') setShortcutsOpen(true);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const fontScaleClass = fontSizeScale === 'sm' ? 'text-xs' : fontSizeScale === 'lg' ? 'text-base' : 'text-sm';

  return (
    <div className={`flex flex-col h-screen w-screen bg-tw-bg text-tw-text-primary overflow-hidden font-sans select-none ${fontScaleClass}`}>
      {/* Intro Editorial Screen (Cinematic, Dismissible) */}
      <IntroScreen />

      {/* Mission Control Top Bar */}
      <TopBar />

      {/* Main Command Workspace */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Surveillance Rail */}
        <LeftRail />

        {/* Center WebGL 3D Satellite Map (The Hero) */}
        <main className="flex-1 relative h-full">
          <MainMapViewer />
        </main>

        {/* Right Intelligence Panel */}
        <RightPanel />
      </div>

      {/* Monospace Step-by-Step Pipeline Loading Modal */}
      {isLoading && (
        <div className="fixed inset-0 z-50 bg-tw-bg/85 backdrop-blur-md flex flex-col items-center justify-center space-y-3 font-mono text-xs select-none">
          <div className="w-10 h-10 rounded-sm border border-tw-accent/40 border-t-tw-accent animate-spin" />
          <div className="text-tw-text-primary font-bold tracking-wider">
            TERRAWATCH ANALYTICAL PIPELINE IN PROGRESS
          </div>
          <div className="text-tw-accent text-[11px] animate-pulse">
            {loadingStep}
          </div>
        </div>
      )}

      {/* Print-Grade Editorial Report Modal */}
      <ReportView />

      {/* Keyboard Shortcuts Overlay */}
      <ShortcutsModal />

      {/* IIT Mandi Hackathon Winning Deck & Judge Defense Guide */}
      <JudgePitchModal />
    </div>
  );
}

export default App;
