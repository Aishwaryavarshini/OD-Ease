import React from 'react';
import { useTheme } from '../../context/ThemeContext';

interface HealthGaugeProps {
  value: number; // 0 - 100%
  size?: number;
  label?: string;
  sublabel?: string;
  showTicks?: boolean;
}

export const HealthGauge: React.FC<HealthGaugeProps> = ({
  value,
  size = 220,
  label = 'ENGINE HEALTH INDEX',
  sublabel = 'NOMINAL PROPULSION STATE',
  showTicks = true,
}) => {
  const { isLight } = useTheme();
  const strokeWidth = 8;
  const radius = (size - strokeWidth * 3) / 2;
  const center = size / 2;

  // Arc calculation: 240 degrees arc (from 150deg to 390deg)
  const totalAngle = 240;
  const startAngle = 150;
  const circumference = 2 * Math.PI * radius;
  const arcLength = (totalAngle / 360) * circumference;
  const progressLength = (Math.min(100, Math.max(0, value)) / 100) * arcLength;

  // Current indicator angle in degrees
  const needleAngle = startAngle + (Math.min(100, Math.max(0, value)) / 100) * totalAngle;
  const needleRad = (needleAngle * Math.PI) / 180;

  // Aerospace avionics color coding (MIL-STD compliant)
  let statusColor = '#3CE698'; // Emerald nominal
  let statusLabel = 'SYS NOMINAL';
  let bannerText = sublabel;

  if (value < 85) {
    statusColor = '#FF4D61'; // Coral warning
    statusLabel = 'CRITICAL DEG';
    bannerText = 'CRITICAL DEGRADATION EXCEEDED';
  } else if (value < 93) {
    statusColor = '#FFB834'; // Amber caution
    statusLabel = 'CAUTION WEAR';
    bannerText = 'ELEVATED THERMAL / WEAR SIG';
  }

  // Ticks generation with precision scale numbers
  const ticks = [];
  const labels = [
    { pct: 0, text: '0' },
    { pct: 20, text: '20' },
    { pct: 40, text: '40' },
    { pct: 60, text: '60' },
    { pct: 80, text: '80' },
    { pct: 100, text: '100' },
  ];

  if (showTicks) {
    const totalTicks = 50; // 2% per tick step
    for (let i = 0; i <= totalTicks; i++) {
      const pct = (i / totalTicks) * 100;
      const angle = startAngle + (i / totalTicks) * totalAngle;
      const rad = (angle * Math.PI) / 180;
      const isMajor = i % 10 === 0;
      const isMedium = i % 5 === 0 && !isMajor;

      const tickLen = isMajor ? 10 : isMedium ? 6 : 3;
      const innerR = radius - tickLen;
      const outerR = radius;

      const x1 = center + innerR * Math.cos(rad);
      const y1 = center + innerR * Math.sin(rad);
      const x2 = center + outerR * Math.cos(rad);
      const y2 = center + outerR * Math.sin(rad);

      // Sector colored ticks
      let tickStroke = isLight ? '#CBD5E1' : '#142F3F';
      if (pct <= value) {
        if (pct >= 90) tickStroke = '#3CE698';
        else if (pct >= 80) tickStroke = '#FFB834';
        else tickStroke = '#FF4D61';
      }

      ticks.push(
        <line
          key={`tick-${i}`}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={tickStroke}
          strokeWidth={isMajor ? 1.5 : 1}
          strokeOpacity={pct <= value ? 1 : 0.4}
        />
      );
    }
  }

  return (
    <div className="flex flex-col items-center justify-center relative select-none">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="overflow-visible">
          <defs>
            {/* Dark/Light Bezel Inset */}
            <radialGradient id="dialBacking" cx="50%" cy="50%" r="50%">
              <stop offset="60%" stopColor={isLight ? '#FFFFFF' : '#050E16'} />
              <stop offset="95%" stopColor={isLight ? '#F1F5F9' : '#08151F'} />
              <stop offset="100%" stopColor={isLight ? '#E2E8F0' : '#142F3F'} />
            </radialGradient>
          </defs>

          {/* Precision Aerospace MFD Dial Dial Plate */}
          <circle
            cx={center}
            cy={center}
            r={radius + strokeWidth}
            fill="url(#dialBacking)"
            stroke={isLight ? '#CBD5E1' : '#142F3F'}
            strokeWidth="1.5"
          />

          {/* Reference Colored Flight Sectors (Underlay Arc) */}
          {/* Green Safe Arc (90-100%): 24 degrees */}
          <circle
            cx={center}
            cy={center}
            r={radius + 4}
            fill="none"
            stroke="#3CE698"
            strokeWidth="2"
            strokeDasharray={`${(24 / 360) * (2 * Math.PI * (radius + 4))} ${2 * Math.PI * (radius + 4)}`}
            strokeDashoffset={-((216 / 360) * (2 * Math.PI * (radius + 4)))}
            strokeOpacity="0.4"
            transform={`rotate(${startAngle} ${center} ${center})`}
          />
          {/* Amber Caution Arc (80-90%): 24 degrees */}
          <circle
            cx={center}
            cy={center}
            r={radius + 4}
            fill="none"
            stroke="#FFB834"
            strokeWidth="2"
            strokeDasharray={`${(24 / 360) * (2 * Math.PI * (radius + 4))} ${2 * Math.PI * (radius + 4)}`}
            strokeDashoffset={-((192 / 360) * (2 * Math.PI * (radius + 4)))}
            strokeOpacity="0.4"
            transform={`rotate(${startAngle} ${center} ${center})`}
          />
          {/* Red Warning Arc (0-80%): 192 degrees */}
          <circle
            cx={center}
            cy={center}
            r={radius + 4}
            fill="none"
            stroke="#FF4D61"
            strokeWidth="2"
            strokeDasharray={`${(192 / 360) * (2 * Math.PI * (radius + 4))} ${2 * Math.PI * (radius + 4)}`}
            strokeDashoffset={0}
            strokeOpacity="0.25"
            transform={`rotate(${startAngle} ${center} ${center})`}
          />

          {/* Background Outer Arc Track */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={isLight ? '#E2E8F0' : '#0C202C'}
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeDashoffset={0}
            strokeLinecap="butt"
            transform={`rotate(${startAngle} ${center} ${center})`}
          />

          {/* Active Value Arc Track */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={statusColor}
            strokeWidth={strokeWidth}
            strokeDasharray={`${progressLength} ${circumference}`}
            strokeDashoffset={0}
            strokeLinecap="butt"
            className="transition-all duration-300 ease-out"
            transform={`rotate(${startAngle} ${center} ${center})`}
          />

          {/* Graduated Scale Ticks */}
          {ticks}

          {/* Numeric Scale Callouts */}
          {labels.map((lbl) => {
            const angle = startAngle + (lbl.pct / 100) * totalAngle;
            const rad = (angle * Math.PI) / 180;
            const textR = radius - 18;
            const tx = center + textR * Math.cos(rad);
            const ty = center + textR * Math.sin(rad) + 3;
            return (
              <text
                key={`lbl-${lbl.pct}`}
                x={tx}
                y={ty}
                textAnchor="middle"
                fill={isLight ? '#64748B' : '#526E7E'}
                fontSize="8"
                fontFamily="monospace"
              >
                {lbl.text}
              </text>
            );
          })}

          {/* Precision Needle / Index Bug Line */}
          <line
            x1={center + (radius - 24) * Math.cos(needleRad)}
            y1={center + (radius - 24) * Math.sin(needleRad)}
            x2={center + (radius + 3) * Math.cos(needleRad)}
            y2={center + (radius + 3) * Math.sin(needleRad)}
            stroke={isLight ? '#0F172A' : '#E6F4FF'}
            strokeWidth="2"
            strokeLinecap="square"
          />

          {/* Central Recessed Housing */}
          <circle
            cx={center}
            cy={center}
            r={radius - 32}
            fill={isLight ? '#FFFFFF' : '#050B12'}
            stroke={isLight ? '#CBD5E1' : '#142F3F'}
            strokeWidth="1"
          />
        </svg>

        {/* Center High-Contrast Readout Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
          <span className="text-[9px] uppercase font-mono-tech tracking-wider text-[#8BA3B3] font-semibold">
            {label}
          </span>
          <div className="flex items-baseline gap-0.5 my-0.5">
            <span className="text-3xl font-mono-tech font-bold tracking-tight text-[#E6F4FF]">
              {value.toFixed(1)}
            </span>
            <span className="text-xs font-mono-tech font-semibold text-[#1AD1F5]">%</span>
          </div>

          <div className="flex items-center gap-1.5 mt-0.5">
            <span
              className="text-[9px] font-mono-tech font-bold px-1.5 py-0.5 rounded uppercase"
              style={{
                color: statusColor,
                backgroundColor: `${statusColor}18`,
                border: `1px solid ${statusColor}40`,
              }}
            >
              {statusLabel}
            </span>
          </div>

          <span className="text-[8px] font-mono-tech text-[#526E7E] mt-1">
            SIMULATED // 50Hz
          </span>
        </div>
      </div>

      {/* Operating Condition Status Banner */}
      <div className="mt-1 text-center">
        <div
          className="text-[11px] font-mono-tech font-medium tracking-wide uppercase px-2.5 py-0.5 rounded border inline-block"
          style={{
            color: statusColor,
            borderColor: `${statusColor}30`,
            backgroundColor: `${statusColor}10`,
          }}
        >
          {bannerText}
        </div>
      </div>
    </div>
  );
};
