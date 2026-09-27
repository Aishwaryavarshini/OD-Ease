import React from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import { useTheme } from '../../context/ThemeContext';

interface DegradationForecastChartProps {
  currentHealth?: number;
  rulHours?: number;
  className?: string;
}

export const DegradationForecastChart: React.FC<DegradationForecastChartProps> = ({
  currentHealth = 95.2,
  rulHours = 426,
  className = '',
}) => {
  const { telemetry } = useTelemetry();
  const { isLight } = useTheme();
  const effectiveHealth = telemetry.health || currentHealth;
  const effectiveRul = telemetry.rulHours || rulHours;

  // Chart coordinates
  const width = 840;
  const height = 280;
  const padL = 55;
  const padR = 45;
  const padT = 32;
  const padB = 42;

  const chartW = width - padL - padR;
  const chartH = height - padT - padB;

  // X axis: 0 hrs (now) to 600 hrs
  const maxHours = 600;

  // Generate degradation curve points
  const numSteps = 30;
  const forecastPoints: { hrs: number; mean: number; upper: number; lower: number; x: number; yMean: number; yUpper: number; yLower: number }[] = [];

  for (let i = 0; i <= numSteps; i++) {
    const hrs = (i / numSteps) * maxHours;
    // Weibull non-linear degradation model: β = 1.45
    const degradation = Math.pow(hrs / 510, 1.45) * 36;
    const mean = Math.max(54, effectiveHealth - degradation);
    // Confidence envelope expands with time horizon
    const spread = (hrs / maxHours) * 7.5;
    const upper = Math.min(100, mean + spread);
    const lower = Math.max(45, mean - spread);

    const x = padL + (hrs / maxHours) * chartW;
    const yMean = padT + ((100 - mean) / 50) * chartH;
    const yUpper = padT + ((100 - upper) / 50) * chartH;
    const yLower = padT + ((100 - lower) / 50) * chartH;

    forecastPoints.push({ hrs, mean, upper, lower, x, yMean, yUpper, yLower });
  }

  // Path strings
  const meanPath = forecastPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.yMean.toFixed(1)}`).join(' ');

  // Confidence envelope polygon
  const upperPath = forecastPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.yUpper.toFixed(1)}`).join(' ');
  const lowerPathReversed = [...forecastPoints].reverse().map((p) => `L ${p.x.toFixed(1)} ${p.yLower.toFixed(1)}`).join(' ');
  const bandPolygon = `${upperPath} ${lowerPathReversed} Z`;

  // Warning & Critical Y levels (Health = 85% and 70%)
  const yWarn = padT + ((100 - 85) / 50) * chartH;
  const yCrit = padT + ((100 - 70) / 50) * chartH;

  // RUL intersection point
  const rulX = padL + (effectiveRul / maxHours) * chartW;

  return (
    <div className={`relative bg-[#050E16] border border-[#142F3F] rounded-lg p-4 ${className}`}>
      {/* Precision Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 mb-2 border-b border-[#142F3F] text-xs font-mono-tech">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-sm bg-[#1AD1F5]" />
          <span className="font-bold text-[#E6F4FF] uppercase tracking-wider">
            DEGRADATION TRAJECTORY & RUL PROJECTION
          </span>
          <span className="px-1.5 py-0.5 rounded bg-[#1AD1F5]/10 text-[#1AD1F5] border border-[#1AD1F5]/30 text-[9px]">
            WEIBULL-LSTM HYBRID
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[9px] text-[#526E7E] bg-[#08151F] px-2 py-0.5 rounded border border-[#142F3F]">
            SIMULATED PROGNOSTIC MODEL
          </span>
          <div className="flex items-baseline gap-1 text-[#3CE698]">
            <span className="text-[10px] text-[#8BA3B3]">NOMINAL RUL:</span>
            <span className="text-base font-bold font-mono-tech">{effectiveRul}</span>
            <span className="text-[10px] text-[#8BA3B3]">HOURS</span>
          </div>
        </div>
      </div>

      {/* Main SVG Vector Canvas */}
      <div className="relative w-full aspect-[840/280] overflow-hidden">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible select-none">
          <defs>
            <linearGradient id="bandGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1AD1F5" stopOpacity="0.16" />
              <stop offset="100%" stopColor="#1AD1F5" stopOpacity="0.02" />
            </linearGradient>

            <pattern id="forecastGrid" width="40" height="20" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 20" fill="none" stroke={isLight ? '#E2E8F0' : '#102534'} strokeWidth="0.5" strokeDasharray="1 3" />
            </pattern>
          </defs>

          {/* Coordinate Reticle Background */}
          <rect x={padL} y={padT} width={chartW} height={chartH} fill="url(#forecastGrid)" />

          {/* Health Index Axis Graduation Lines */}
          {[100, 90, 80, 70, 60, 50].map((hVal) => {
            const y = padT + ((100 - hVal) / 50) * chartH;
            return (
              <g key={hVal}>
                <line x1={padL} y1={y} x2={width - padR} y2={y} stroke={isLight ? '#CBD5E1' : '#142F3F'} strokeWidth="0.75" strokeDasharray="4 4" opacity={isLight ? '0.8' : '0.6'} />
                <text x={padL - 8} y={y + 3} fill={isLight ? '#64748B' : '#526E7E'} fontSize="9" textAnchor="end" fontFamily="monospace">
                  {hVal}%
                </text>
              </g>
            );
          })}

          {/* Time Marks in Operating Flight Hours */}
          {[0, 100, 200, 300, 400, 500, 600].map((hr) => {
            const x = padL + (hr / maxHours) * chartW;
            return (
              <g key={hr}>
                <line x1={x} y1={padT} x2={x} y2={height - padB} stroke={isLight ? '#CBD5E1' : '#142F3F'} strokeWidth="0.75" strokeDasharray="2 4" opacity={isLight ? '0.6' : '0.4'} />
                <text x={x} y={height - padB + 16} fill={isLight ? '#64748B' : '#8BA3B3'} fontSize="9" textAnchor="middle" fontFamily="monospace">
                  +{hr}h
                </text>
              </g>
            );
          })}

          {/* Warning Limit Line (85% Health) */}
          <line x1={padL} y1={yWarn} x2={width - padR} y2={yWarn} stroke="#FFB834" strokeWidth="1" strokeDasharray="6 3" strokeOpacity="0.8" />
          <text x={width - padR + 6} y={yWarn + 3} fill="#FFB834" fontSize="9" fontFamily="monospace" fontWeight="bold">
            CAUTION (85%)
          </text>

          {/* Critical TBO Replacement Threshold (70% Health) */}
          <line x1={padL} y1={yCrit} x2={width - padR} y2={yCrit} stroke="#FF4D61" strokeWidth="1" strokeDasharray="6 3" strokeOpacity="0.8" />
          <text x={width - padR + 6} y={yCrit + 3} fill="#FF4D61" fontSize="9" fontFamily="monospace" fontWeight="bold">
            TBO (70%)
          </text>

          {/* 95% Confidence Band Polygon */}
          <path d={bandPolygon} fill="url(#bandGrad)" />

          {/* Upper and Lower Confidence Envelope Strokes */}
          <path
            d={forecastPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.yUpper.toFixed(1)}`).join(' ')}
            fill="none"
            stroke="#1AD1F5"
            strokeWidth="0.75"
            strokeDasharray="3 3"
            strokeOpacity="0.5"
          />
          <path
            d={forecastPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.yLower.toFixed(1)}`).join(' ')}
            fill="none"
            stroke="#1AD1F5"
            strokeWidth="0.75"
            strokeDasharray="3 3"
            strokeOpacity="0.5"
          />

          {/* Nominal Predicted Mean Degradation Trajectory */}
          <path d={meanPath} fill="none" stroke="#1AD1F5" strokeWidth="2" strokeLinecap="round" />

          {/* Current Operating Point Node */}
          <circle cx={padL} cy={padT + ((100 - effectiveHealth) / 50) * chartH} r="5" fill="#3CE698" stroke="#050E16" strokeWidth="1.5" />
          <text x={padL + 10} y={padT + ((100 - effectiveHealth) / 50) * chartH - 6} fill="#3CE698" fontSize="9" fontFamily="monospace" fontWeight="bold">
            T-0 ({effectiveHealth.toFixed(1)}%)
          </text>

          {/* RUL Intersection Marker Line */}
          <line x1={rulX} y1={padT} x2={rulX} y2={yCrit} stroke="#1AD1F5" strokeWidth="1.2" strokeDasharray="3 3" />
          <rect x={rulX - 42} y={padT - 18} width="84" height="18" rx="2" fill="#08151F" stroke="#1AD1F5" strokeWidth="1" />
          <text x={rulX} y={padT - 6} fill="#1AD1F5" fontSize="9" textAnchor="middle" fontFamily="monospace" fontWeight="bold">
            RUL: {effectiveRul}h
          </text>
        </svg>
      </div>

      {/* Legend & Calibration Footnote */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2.5 mt-1 border-t border-[#142F3F] text-[10px] font-mono-tech text-[#8BA3B3]">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-[#1AD1F5]" />
            <span>Mean Forecast</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-2 bg-[#1AD1F5]/20 border border-[#1AD1F5]/40" />
            <span>95% Bayesian Confidence Envelope</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#FFB834]">
            <span className="w-3 h-0.5 bg-[#FFB834]" />
            <span>Caution Wear Limit</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#FF4D61]">
            <span className="w-3 h-0.5 bg-[#FF4D61]" />
            <span>TBO Limit (Mandatory Overhaul)</span>
          </div>
        </div>
        <div className="text-[#526E7E]">
          HORIZON: +600 OPERATING HOURS // WEIBULL β=1.45
        </div>
      </div>
    </div>
  );
};
