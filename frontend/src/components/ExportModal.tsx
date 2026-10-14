import React from 'react';
import { AnalysisDetail } from '../types';
import { Download, FileText, Code2, X, Check } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  detail: AnalysisDetail | null;
}

export const ExportModal: React.FC<Props> = ({ isOpen, onClose, detail }) => {
  if (!isOpen || !detail) return null;

  const downloadPdf = () => {
    window.open(`/api/export/pdf/${detail.id}`, '_blank');
  };

  const downloadGeoJson = () => {
    window.open(`/api/export/geojson/${detail.id}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm select-none">
      <div className="bg-space-900 border border-space-700 w-full max-w-md rounded-xl p-5 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-space-700 pb-3">
          <div className="flex items-center space-x-2">
            <Download className="w-4 h-4 text-emerald-400" />
            <h3 className="font-mono text-sm font-bold text-slate-100 uppercase tracking-wide">
              EXPORT ANALYTICAL DOSSIER
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="bg-space-850 p-3 rounded border border-space-800 text-xs font-mono space-y-1.5 text-slate-300">
          <div><span className="text-slate-500">EVENT ID:</span> {detail.id}</div>
          <div><span className="text-slate-500">TARGET:</span> {detail.title}</div>
          <div><span className="text-slate-500">BOUNDING BOX:</span> [{detail.bbox.join(', ')}]</div>
          <div><span className="text-slate-500">TIMESTAMP:</span> {detail.dates.before} to {detail.dates.after}</div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            onClick={downloadPdf}
            className="p-3 rounded-lg border border-emerald-500/50 bg-emerald-950/30 hover:bg-emerald-900/40 text-emerald-300 flex flex-col items-center justify-center space-y-2 transition-all font-mono"
          >
            <FileText className="w-6 h-6 text-emerald-400" />
            <span className="text-xs font-bold">EXECUTIVE PDF</span>
            <span className="text-[10px] text-emerald-400/70">Audit ReportLab Dossier</span>
          </button>

          <button
            onClick={downloadGeoJson}
            className="p-3 rounded-lg border border-cyan-500/50 bg-cyan-950/30 hover:bg-cyan-900/40 text-cyan-300 flex flex-col items-center justify-center space-y-2 transition-all font-mono"
          >
            <Code2 className="w-6 h-6 text-cyan-400" />
            <span className="text-xs font-bold">GIS GEOJSON</span>
            <span className="text-[10px] text-cyan-400/70">QGIS / ArcGIS Vector Polygon</span>
          </button>
        </div>

        <div className="pt-2 text-center text-[10px] text-slate-500 font-mono">
          Complies with OGC GIS Standards &amp; Copernicus Sentinel-2 Open Data Policy.
        </div>
      </div>
    </div>
  );
};
