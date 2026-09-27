import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus, AlertTriangle } from 'lucide-react';
import { StatusSeverity } from '../../types';

interface MetricCardProps {
  label: string;
  sublabel?: string;
  value: number | string;
  unit: string;
  trend?: 'up' | 'down' | 'stable';
  severity?: StatusSeverity;
  normalRange?: string;
  sparklineData?: number[];
  onClick?: () => void;
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  sublabel,
  value,
  unit,
  trend = 'stable',
  severity = 'healthy',
  normalRange,
  sparklineData = [],
  onClick,
  className = '',
}) => {
  const getSeverityStyles = () => {
    switch (severity) {
      case 'critical':
        return {
          border: 'border-[#FF4D61]/60 hover:border-[#FF4D61]',
          badgeBg: 'bg-[#FF4D61]/15 text-[#FF4D61] border-[#FF4D61]/40',
          textColor: 'text-[#FF4D61]',
          statusLabel: 'EXCEEDED',
        };
      case 'warning':
        return {
          border: 'border-[#FFB834]/60 hover:border-[#FFB834]',
          badgeBg: 'bg-[#FFB834]/15 text-[#FFB834] border-[#FFB834]/40',
          textColor: 'text-[#FFB834]',
          statusLabel: 'ELEVATED',
        };
      case 'healthy':
      default:
        return {
          border: 'border-[#142F3F] hover:border-[#1AD1F5]/50',
          badgeBg: 'bg-[#3CE698]/10 text-[#3CE698] border-[#3CE698]/30',
          textColor: 'text-[#E6F4FF]',
          statusLabel: 'NOMINAL',
        };
    }
  };

  const styles = getSeverityStyles();

  // Mini sparkline vector
  const renderSparkline = () => {
    if (!sparklineData || sparklineData.length < 2) return null;
    const min = Math.min(...sparklineData);
    const max = Math.max(...sparklineData);
    const range = max - min || 1;
    const width = 64;
    const height = 20;

    const points = sparklineData
      .map((val, idx) => {
        const x = (idx / (sparklineData.length - 1)) * width;
        const y = height - ((val - min) / range) * (height - 4) - 2;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');

    const strokeColor =
      severity === 'critical' ? '#FF4D61' : severity === 'warning' ? '#FFB834' : '#1AD1F5';

    return (
      <svg width={width} height={height} className="overflow-visible shrink-0 opacity-80">
        <polyline
          fill="none"
          stroke={strokeColor}
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
      </svg>
    );
  };

  return (
    <div
      onClick={onClick}
      className={`relative bg-[#08151F] border ${styles.border} rounded-lg p-3 transition-all duration-150 ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      {/* Precision CAD Corner Ticks */}
      <span className="absolute -top-[1px] -left-[1px] w-1.5 h-1.5 border-t border-l border-[#1AD1F5]/40 pointer-events-none" />
      <span className="absolute -bottom-[1px] -right-[1px] w-1.5 h-1.5 border-b border-r border-[#1AD1F5]/40 pointer-events-none" />

      {/* Top row: Label & Status Indicator */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="text-[11px] font-mono-tech uppercase tracking-wider text-[#8BA3B3] truncate">
            {label}
          </div>
          {sublabel && (
            <div className="text-[9px] text-[#526E7E] font-mono-tech truncate">
              {sublabel}
            </div>
          )}
        </div>

        {/* Status indicator */}
        <div className="flex items-center gap-1 shrink-0">
          {severity !== 'healthy' && (
            <AlertTriangle
              className={`w-3 h-3 ${
                severity === 'critical' ? 'text-[#FF4D61]' : 'text-[#FFB834]'
              }`}
            />
          )}
          <span className={`text-[8px] font-mono-tech font-bold px-1.5 py-0.5 rounded border uppercase ${styles.badgeBg}`}>
            {styles.statusLabel}
          </span>
        </div>
      </div>

      {/* Middle row: Large numerical value, unit, and mini sparkline */}
      <div className="mt-2 flex items-baseline justify-between gap-2">
        <div className="flex items-baseline gap-1.5">
          <span className={`text-2xl font-mono-tech font-bold tracking-tight ${styles.textColor}`}>
            {typeof value === 'number' ? (Number.isInteger(value) ? value : value.toFixed(1)) : value}
          </span>
          <span className="text-xs font-mono-tech text-[#8BA3B3] font-semibold">{unit}</span>
        </div>

        {/* Sparkline & Trend Vector */}
        <div className="flex items-center gap-1.5">
          {renderSparkline()}
          <div className="flex items-center text-[#8BA3B3]">
            {trend === 'up' && <ArrowUpRight className="w-3.5 h-3.5 text-[#1AD1F5]" />}
            {trend === 'down' && <ArrowDownRight className="w-3.5 h-3.5 text-[#8BA3B3]" />}
            {trend === 'stable' && <Minus className="w-3 h-3 text-[#526E7E]" />}
          </div>
        </div>
      </div>

      {/* Bottom row: Operational limits */}
      {normalRange && (
        <div className="mt-2 pt-1.5 border-t border-[#142F3F] flex items-center justify-between text-[9px] font-mono-tech text-[#526E7E]">
          <span className="uppercase">NOMINAL SPEC:</span>
          <span className="text-[#8BA3B3] font-semibold">{normalRange}</span>
        </div>
      )}
    </div>
  );
};
