import React from 'react';
import { useAppStore } from '../lib/store';
import { X, Printer, Download, CheckCircle2, Shield } from 'lucide-react';

export const ReportView: React.FC = () => {
  const { reportOpen, setReportOpen, activeScenario } = useAppStore();

  if (!reportOpen || !activeScenario) return null;

  const sev = activeScenario.severity;
  const attr = activeScenario.weather_attribution;
  const wh = activeScenario.weather_history;
  const mod = activeScenario.modules;

  const handleDownloadPdf = () => {
    window.open(`/api/export/pdf/${activeScenario.id}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 select-none overflow-y-auto">
      <div className="bg-tw-surface-1 border border-tw-border w-full max-w-3xl rounded-sm shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Top Actions */}
        <div className="h-12 border-b border-tw-border px-4 flex items-center justify-between">
          <div className="flex items-center space-x-2 font-mono text-xs text-tw-text-primary">
            <Shield className="w-4 h-4 text-tw-accent" />
            <span className="font-bold">EDITORIAL DOSSIER PREVIEW // PRINT GRADE A4</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleDownloadPdf}
              className="px-3 py-1 rounded-sm bg-tw-accent text-tw-bg font-mono text-xs font-bold flex items-center space-x-1.5 hover:bg-amber-400 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>DOWNLOAD PDF</span>
            </button>
            <button
              onClick={() => setReportOpen(false)}
              className="p-1 rounded-sm text-tw-text-tertiary hover:text-tw-text-primary"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* A4 Editorial Report Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6 text-tw-text-primary font-sans bg-tw-surface-1">
          {/* Header */}
          <div className="border-b border-tw-border pb-4 space-y-1">
            <div className="tw-micro-label text-tw-accent">OFFICIAL SURVEILLANCE RECORD</div>
            <h1 className="font-serif text-3xl font-normal leading-tight">
              {activeScenario.title}
            </h1>
            <div className="font-mono text-xs text-tw-text-tertiary">
              LOCATION: {activeScenario.location} | DATES: {activeScenario.dates.before} to {activeScenario.dates.after}
            </div>
          </div>

          {/* Executive Narrative */}
          <div className="p-4 rounded-sm bg-tw-surface-2 border border-tw-border space-y-2">
            <div className="tw-micro-label text-tw-text-secondary">SCIENTIFIC RATIONALE &amp; ATTRIBUTION</div>
            <p className="text-sm text-tw-text-primary leading-relaxed font-sans">
              {attr.scientific_rationale}
            </p>
          </div>

          {/* Key Metrics Table */}
          <div className="space-y-2">
            <div className="tw-micro-label">TELEMETRY SUMMARY</div>
            <table className="w-full text-xs font-mono border border-tw-border">
              <thead>
                <tr className="bg-tw-surface-2 text-tw-text-secondary border-b border-tw-border text-left">
                  <th className="p-2.5">INDICATOR</th>
                  <th className="p-2.5">MEASUREMENT</th>
                  <th className="p-2.5">CRITERIA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-tw-border text-tw-text-primary">
                <tr>
                  <td className="p-2.5 text-tw-text-secondary">Severity Rating</td>
                  <td className="p-2.5 font-bold text-tw-accent">{sev.overall_severity} ({sev.score}/100)</td>
                  <td className="p-2.5 text-tw-text-tertiary">Change Vector Analysis</td>
                </tr>
                <tr>
                  <td className="p-2.5 text-tw-text-secondary">Surface Transformation</td>
                  <td className="p-2.5 font-bold">
                    {mod.flood_detection.inundated_hectares > 0
                      ? `${mod.flood_detection.inundated_hectares} ha inundated`
                      : mod.deforestation.lost_forest_hectares > 0
                      ? `${mod.deforestation.lost_forest_hectares} ha canopy lost`
                      : `${mod.crop_stress.stressed_hectares} ha stressed`}
                  </td>
                  <td className="p-2.5 text-tw-text-tertiary">Sentinel-2 10m GSD</td>
                </tr>
                <tr>
                  <td className="p-2.5 text-tw-text-secondary">Precipitation Correlation</td>
                  <td className="p-2.5 font-bold">{wh.total_precipitation_mm} mm total ({wh.max_single_day_rain_mm} mm peak)</td>
                  <td className="p-2.5 text-tw-text-tertiary">{wh.source}</td>
                </tr>
                <tr>
                  <td className="p-2.5 text-tw-text-secondary">Algorithmic Confidence</td>
                  <td className="p-2.5 font-bold">{Math.round(activeScenario.confidence_score * 100)}% Confidence</td>
                  <td className="p-2.5 text-tw-text-tertiary">SCL Cloud Mask Validated</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Legal / Scientific Limitation Disclosure */}
          <div className="pt-4 border-t border-tw-border text-[11px] font-mono text-tw-text-tertiary space-y-1">
            <div className="text-tw-text-secondary font-bold">METHODOLOGY DISCLOSURE</div>
            <p>
              Imagery collected via Copernicus Sentinel-2 MSI Level-2A. Co-registration enforced 
              using OpenCV ECC affine estimation. Spectral indices computed in 32-bit floating point. 
              Figures represent calibrated screening indicators and require field ground-truthing 
              prior to statutory enforcement.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
