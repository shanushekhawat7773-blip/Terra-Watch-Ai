import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, ReferenceLine } from 'recharts';
import { TrendingDown, Calendar } from 'lucide-react';

interface Props {
  data: {
    month: string;
    ndvi: number;
    is_event_period: boolean;
  }[];
}

export const TimeSeriesChart: React.FC<Props> = ({ data }) => {
  if (!data || data.length === 0) return null;

  return (
    <div className="bg-space-900 border border-space-700 rounded-lg p-3.5 space-y-2 select-none">
      <div className="flex items-center justify-between border-b border-space-800 pb-2">
        <div className="flex items-center space-x-1.5 text-xs font-mono font-medium text-slate-300">
          <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />
          <span>12-MONTH MULTI-TEMPORAL NDVI PROFILE</span>
        </div>
        <div className="flex items-center space-x-2 text-[10px] font-mono">
          <span className="flex items-center space-x-1 text-slate-400">
            <span className="w-2 h-0.5 bg-emerald-400 inline-block" />
            <span>CANOPY VIGOR</span>
          </span>
          <span className="flex items-center space-x-1 text-red-400">
            <span className="w-2 h-0.5 bg-red-400 inline-block" />
            <span>ANOMALY EVENT</span>
          </span>
        </div>
      </div>

      <div className="h-28 w-full pt-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
            <defs>
              <linearGradient id="ndviGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="month"
              stroke="#64748b"
              fontSize={10}
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
            />
            <YAxis
              domain={[0, 1]}
              stroke="#64748b"
              fontSize={10}
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const val = payload[0].value;
                  return (
                    <div className="bg-space-950 border border-space-700 p-1.5 rounded font-mono text-[10px] shadow-lg">
                      <div className="text-slate-400">{payload[0].payload.month}</div>
                      <div className="text-emerald-400 font-bold">NDVI: {val}</div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="ndvi"
              stroke="#10b981"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#ndviGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
