import React from 'react';

interface AIConfidenceBarProps {
  label: string;
  value: number; // 0 to 100
  thresholdWarning?: number;
  thresholdCritical?: number;
  format?: (v: number) => string;
  subtext?: string;
  colorScheme?: 'cyan' | 'traffic' | 'invertTraffic';
}

export const AIConfidenceBar: React.FC<AIConfidenceBarProps> = ({
  label,
  value,
  thresholdWarning = 60,
  thresholdCritical = 80,
  format,
  subtext,
  colorScheme = 'traffic',
}) => {
  let barColor = '#19C7F1';

  if (colorScheme === 'traffic') {
    // higher is worse (e.g. Anomaly %, Failure %)
    if (value >= thresholdCritical) {
      barColor = '#FF5368';
    } else if (value >= thresholdWarning) {
      barColor = '#FFC857';
    } else {
      barColor = '#42DFA0';
    }
  } else if (colorScheme === 'invertTraffic') {
    // higher is better (e.g. Health %, Reliability %)
    if (value >= thresholdWarning) {
      barColor = '#42DFA0';
    } else if (value >= thresholdCritical) {
      barColor = '#FFC857';
    } else {
      barColor = '#FF5368';
    }
  }

  const displayValue = format ? format(value) : `${value.toFixed(1)}%`;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between text-xs font-mono-tech">
        <span className="text-[#78919F] uppercase tracking-wider text-[11px]">{label}</span>
        <span className="font-bold text-[#E8F5FF]">{displayValue}</span>
      </div>

      <div className="relative h-2 w-full bg-[#071019] rounded overflow-hidden border border-[#173342]">
        {/* Progress track */}
        <div
          className="h-full transition-all duration-500 ease-out rounded-sm"
          style={{
            width: `${Math.min(100, Math.max(0, value))}%`,
            backgroundColor: barColor,
            boxShadow: `0 0 8px ${barColor}60`,
          }}
        />

        {/* Threshold indicator lines */}
        {thresholdWarning && (
          <div
            className="absolute top-0 bottom-0 w-[1px] bg-[#FFC857]/60"
            style={{ left: `${thresholdWarning}%` }}
          />
        )}
        {thresholdCritical && (
          <div
            className="absolute top-0 bottom-0 w-[1px] bg-[#FF5368]/80"
            style={{ left: `${thresholdCritical}%` }}
          />
        )}
      </div>

      {subtext && (
        <div className="flex items-center justify-between text-[10px] font-mono-tech text-[#506C79]">
          <span>{subtext}</span>
          <span>MAX 100%</span>
        </div>
      )}
    </div>
  );
};
