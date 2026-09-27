import React, { useState } from 'react';
import { TelemetryHistoryPoint, TimeWindow } from '../../types';
import { useTheme } from '../../context/ThemeContext';

interface TelemetryChartProps {
  data: TelemetryHistoryPoint[];
  metricKey: keyof Pick<
    TelemetryHistoryPoint,
    'rpm' | 'egt' | 'cht' | 'oilPressure' | 'fuelPressure' | 'boostPressure' | 'vibration' | 'health'
  >;
  title: string;
  unit: string;
  color?: string;
  normalMin?: number;
  normalMax?: number;
  warningMax?: number;
  criticalMax?: number;
  height?: number;
  showTimeFilter?: boolean;
  timeWindow?: TimeWindow;
  onTimeWindowChange?: (w: TimeWindow) => void;
  className?: string;
}

export const TelemetryChart: React.FC<TelemetryChartProps> = ({
  data,
  metricKey,
  title,
  unit,
  color = '#1AD1F5',
  normalMin,
  normalMax,
  warningMax,
  criticalMax,
  height = 180,
  showTimeFilter = false,
  timeWindow = '1m',
  onTimeWindowChange,
  className = '',
}) => {
  const { isLight } = useTheme();
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return (
      <div
        className={`flex items-center justify-center bg-[#050E16] border border-[#142F3F] rounded text-xs font-mono-tech text-[#526E7E] ${className}`}
        style={{ height }}
      >
        SYNCING ARINC-429 TELEMETRY STREAM...
      </div>
    );
  }

  // Filter data points based on time window
  const sliceCount = timeWindow === '1m' ? 30 : timeWindow === '5m' ? 45 : 60;
  const filteredData = data.slice(-sliceCount);

  const values = filteredData.map((d) => d[metricKey] as number);
  const rawMin = Math.min(...values);
  const rawMax = Math.max(...values);
  const padding = (rawMax - rawMin) * 0.15 || 1;
  const minVal = Number((rawMin - padding).toFixed(1));
  const maxVal = Number((rawMax + padding).toFixed(1));
  const range = maxVal - minVal || 1;

  const currentVal = values[values.length - 1];
  const prevVal = values[values.length - 2] ?? currentVal;
  const deltaVal = (currentVal - prevVal).toFixed(2);
  const avgVal = (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1);

  // SVG coordinate system: 1000 x height
  const svgWidth = 1000;
  const svgHeight = height;
  const topPad = 16;
  const botPad = 26;
  const usableHeight = svgHeight - topPad - botPad;

  const points = filteredData.map((d, i) => {
    const x = (i / (filteredData.length - 1 || 1)) * svgWidth;
    const val = d[metricKey] as number;
    const y = topPad + usableHeight - ((val - minVal) / range) * usableHeight;
    return { x, y, val, time: d.timeStr };
  });

  const polylinePoints = points.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const areaPoints = `0,${svgHeight - botPad} ${polylinePoints} ${svgWidth},${svgHeight - botPad}`;

  const hoveredPoint = hoverIndex !== null && points[hoverIndex] ? points[hoverIndex] : null;

  return (
    <div className={`relative bg-[#050E16] border border-[#142F3F] rounded-lg p-3 ${className}`}>
      {/* Chart Header with Calibration Metadata */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2 pb-2 border-b border-[#142F3F] text-xs font-mono-tech">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-sm shrink-0" style={{ backgroundColor: color }} />
          <span className="font-semibold text-[#E6F4FF] uppercase tracking-wider">{title}</span>
          <span className="text-[#526E7E] text-[10px]">[{unit}]</span>
          <span className="hidden md:inline-block text-[9px] px-1 py-0.2 rounded bg-[#0A1924] text-[#8BA3B3] border border-[#142F3F]">
            CH-0{metricKey.length % 8 + 1}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-baseline gap-1">
            <span className="text-[10px] text-[#8BA3B3]">VAL:</span>
            <span className="text-sm font-bold text-[#E6F4FF]">
              {hoveredPoint ? hoveredPoint.val : currentVal}
            </span>
            <span className="text-[10px] text-[#8BA3B3]">{unit}</span>
          </div>

          <div className="flex items-baseline gap-1 text-[10px]">
            <span className="text-[#526E7E]">Δ:</span>
            <span
              className={`font-semibold ${
                Number(deltaVal) > 0
                  ? 'text-[#1AD1F5]'
                  : Number(deltaVal) < 0
                  ? 'text-[#FFB834]'
                  : 'text-[#8BA3B3]'
              }`}
            >
              {Number(deltaVal) > 0 ? `+${deltaVal}` : deltaVal}
            </span>
          </div>

          <div className="hidden sm:flex items-baseline gap-1 text-[10px] text-[#526E7E]">
            <span>μ:</span>
            <span className="text-[#8BA3B3]">{avgVal}</span>
          </div>

          {showTimeFilter && onTimeWindowChange && (
            <div className="flex items-center gap-0.5 bg-[#08151F] p-0.5 rounded border border-[#142F3F]">
              {(['1m', '5m', '15m', '1h'] as TimeWindow[]).map((tw) => (
                <button
                  key={tw}
                  onClick={() => onTimeWindowChange(tw)}
                  className={`px-1.5 py-0.5 text-[9px] font-mono-tech rounded ${
                    timeWindow === tw
                      ? 'bg-[#1AD1F5] text-[#04090F] font-bold'
                      : 'text-[#8BA3B3] hover:text-[#E6F4FF]'
                  }`}
                >
                  {tw}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* SVG Canvas Area with Technical Reticle Grid */}
      <div className="relative w-full overflow-hidden" style={{ height: svgHeight }}>
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          preserveAspectRatio="none"
          className="w-full h-full overflow-visible"
          onMouseLeave={() => setHoverIndex(null)}
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const ratio = mouseX / rect.width;
            const idx = Math.min(
              filteredData.length - 1,
              Math.max(0, Math.round(ratio * (filteredData.length - 1)))
            );
            setHoverIndex(idx);
          }}
        >
          <defs>
            <linearGradient id={`chartGrad-${metricKey}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={color} stopOpacity="0.22" />
              <stop offset="100%" stopColor={color} stopOpacity="0.0" />
            </linearGradient>

            {/* Precision crosshair marker */}
            <pattern id={`gridPattern-${metricKey}`} width="40" height="20" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 20" fill="none" stroke={isLight ? '#E2E8F0' : '#102534'} strokeWidth="0.5" strokeDasharray="1 3" />
            </pattern>
          </defs>

          {/* Coordinate Reticle Background */}
          <rect x="0" y={topPad} width={svgWidth} height={usableHeight} fill={`url(#gridPattern-${metricKey})`} />

          {/* Horizontal Level Graduation Lines */}
          {[0.2, 0.4, 0.6, 0.8].map((factor, i) => {
            const y = topPad + usableHeight * factor;
            const refVal = (maxVal - factor * range).toFixed(1);
            return (
              <g key={`hgrid-${i}`}>
                <line
                  x1="0"
                  y1={y}
                  x2={svgWidth}
                  y2={y}
                  stroke={isLight ? '#CBD5E1' : '#142F3F'}
                  strokeWidth="0.75"
                  strokeDasharray="4 4"
                  opacity={isLight ? '0.8' : '0.6'}
                />
                <text x="8" y={y - 3} fill={isLight ? '#64748B' : '#526E7E'} fontSize="9" fontFamily="monospace">
                  {refVal}
                </text>
              </g>
            );
          })}

          {/* Warning Threshold Line */}
          {warningMax && warningMax <= maxVal && warningMax >= minVal && (
            <g>
              {(() => {
                const warnY = topPad + usableHeight - ((warningMax - minVal) / range) * usableHeight;
                return (
                  <>
                    <line
                      x1="0"
                      y1={warnY}
                      x2={svgWidth}
                      y2={warnY}
                      stroke="#FFB834"
                      strokeWidth="1.2"
                      strokeDasharray="6 3"
                      opacity="0.8"
                    />
                    <text x={svgWidth - 95} y={warnY - 3} fill="#FFB834" fontSize="9" fontFamily="monospace" fontWeight="bold">
                      CAUTION: {warningMax}
                    </text>
                  </>
                );
              })()}
            </g>
          )}

          {/* Critical Threshold Line */}
          {criticalMax && criticalMax <= maxVal && criticalMax >= minVal && (
            <g>
              {(() => {
                const critY = topPad + usableHeight - ((criticalMax - minVal) / range) * usableHeight;
                return (
                  <>
                    <line
                      x1="0"
                      y1={critY}
                      x2={svgWidth}
                      y2={critY}
                      stroke="#FF4D61"
                      strokeWidth="1.5"
                      strokeDasharray="4 2"
                      opacity="0.9"
                    />
                    <text x={svgWidth - 95} y={critY - 3} fill="#FF4D61" fontSize="9" fontFamily="monospace" fontWeight="bold">
                      LIMIT: {criticalMax}
                    </text>
                  </>
                );
              })()}
            </g>
          )}

          {/* Underlay Area Fill */}
          <polygon points={areaPoints} fill={`url(#chartGrad-${metricKey})`} />

          {/* Main Clean Telemetry Signal Trace */}
          <polyline
            points={polylinePoints}
            fill="none"
            stroke={color}
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Real-time leading edge cursor */}
          {points.length > 0 && (
            <g>
              <circle
                cx={points[points.length - 1].x}
                cy={points[points.length - 1].y}
                r="3.5"
                fill={color}
                stroke="#050E16"
                strokeWidth="1.5"
              />
            </g>
          )}

          {/* Hover Crosshair Cursor */}
          {hoveredPoint && (
            <g>
              <line
                x1={hoveredPoint.x}
                y1="0"
                x2={hoveredPoint.x}
                y2={svgHeight}
                stroke="#E6F4FF"
                strokeWidth="1"
                strokeDasharray="2 2"
                opacity="0.7"
              />
              <circle
                cx={hoveredPoint.x}
                cy={hoveredPoint.y}
                r="4"
                fill="#E6F4FF"
                stroke={color}
                strokeWidth="1.5"
              />
            </g>
          )}
        </svg>

        {/* Floating Tooltip Callout */}
        {hoveredPoint && (
          <div
            className="absolute top-1 pointer-events-none transform -translate-x-1/2 bg-[#08151F] border border-[#1AD1F5] px-2 py-1 rounded text-[10px] font-mono-tech shadow-md z-20 whitespace-nowrap"
            style={{ left: `${(hoveredPoint.x / svgWidth) * 100}%` }}
          >
            <div className="text-[#1AD1F5] font-bold">
              {hoveredPoint.val} {unit}
            </div>
            <div className="text-[#8BA3B3] text-[9px]">{hoveredPoint.time} UTC</div>
          </div>
        )}
      </div>

      {/* Axis Bounds & Calibration Footer */}
      <div className="flex justify-between items-center text-[10px] font-mono-tech text-[#526E7E] mt-1 pt-1.5 border-t border-[#142F3F]">
        <span>SPAN MIN: {rawMin} {unit}</span>
        <span className="text-[9px] uppercase tracking-wider text-[#1AD1F5]/70">
          SIMULATED TELEMETRY // 50 Hz ARINC BUS
        </span>
        <span>SPAN MAX: {rawMax} {unit}</span>
      </div>
    </div>
  );
};
