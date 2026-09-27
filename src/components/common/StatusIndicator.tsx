import React from 'react';
import { StatusSeverity } from '../../types';

interface StatusIndicatorProps {
  status: StatusSeverity | 'online' | 'sync' | 'simulation';
  label?: string;
  sublabel?: string;
  pulse?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  label,
  sublabel,
  pulse = true,
  size = 'md',
  className = '',
}) => {
  const getColors = () => {
    switch (status) {
      case 'healthy':
      case 'online':
        return {
          dot: 'bg-[#42DFA0]',
          glow: 'rgba(66, 223, 160, 0.4)',
          text: 'text-[#42DFA0]',
          bg: 'bg-[#42DFA0]/10',
          border: 'border-[#42DFA0]/30',
          defaultLabel: 'HEALTHY',
        };
      case 'warning':
        return {
          dot: 'bg-[#FFC857]',
          glow: 'rgba(255, 200, 87, 0.4)',
          text: 'text-[#FFC857]',
          bg: 'bg-[#FFC857]/10',
          border: 'border-[#FFC857]/30',
          defaultLabel: 'WARNING',
        };
      case 'critical':
        return {
          dot: 'bg-[#FF5368]',
          glow: 'rgba(255, 83, 104, 0.4)',
          text: 'text-[#FF5368]',
          bg: 'bg-[#FF5368]/10',
          border: 'border-[#FF5368]/30',
          defaultLabel: 'CRITICAL',
        };
      case 'sync':
      case 'simulation':
      default:
        return {
          dot: 'bg-[#19C7F1]',
          glow: 'rgba(25, 199, 241, 0.4)',
          text: 'text-[#19C7F1]',
          bg: 'bg-[#19C7F1]/10',
          border: 'border-[#19C7F1]/30',
          defaultLabel: status.toUpperCase(),
        };
    }
  };

  const colors = getColors();

  const sizeClasses = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5',
  }[size];

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <span className="relative flex items-center justify-center">
        {pulse && (
          <span
            className={`absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping`}
            style={{ backgroundColor: colors.glow }}
          />
        )}
        <span className={`relative inline-flex rounded-full ${sizeClasses} ${colors.dot}`} />
      </span>

      {(label || sublabel) && (
        <div className="flex flex-col">
          {label && (
            <span className={`text-xs font-mono-tech tracking-wider uppercase font-semibold ${colors.text}`}>
              {label || colors.defaultLabel}
            </span>
          )}
          {sublabel && (
            <span className="text-[10px] text-[#78919F] font-mono-tech leading-tight">
              {sublabel}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
