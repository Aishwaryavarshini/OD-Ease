import React from 'react';

interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
  cornerMarks?: boolean;
  highlightTop?: boolean;
  title?: string;
  badge?: string;
  badgeColor?: 'cyan' | 'green' | 'amber' | 'red';
  headerRight?: React.ReactNode;
  id?: string;
}

export const GlassPanel: React.FC<GlassPanelProps> = ({
  children,
  className = '',
  glow = false,
  cornerMarks = true,
  highlightTop = false,
  title,
  badge,
  badgeColor = 'cyan',
  headerRight,
  id,
}) => {
  const badgeColorClass = {
    cyan: 'bg-[#1AD1F5]/10 text-[#1AD1F5] border-[#1AD1F5]/30',
    green: 'bg-[#3CE698]/10 text-[#3CE698] border-[#3CE698]/30',
    amber: 'bg-[#FFB834]/10 text-[#FFB834] border-[#FFB834]/30',
    red: 'bg-[#FF4D61]/10 text-[#FF4D61] border-[#FF4D61]/30',
  }[badgeColor];

  return (
    <div
      id={id}
      className={`relative bg-[#08151F] border border-[#142F3F] rounded-lg transition-colors ${
        glow ? 'border-[#1AD1F5]/50' : ''
      } ${className}`}
    >
      {/* Top subtle highlight */}
      {highlightTop && (
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#1AD1F5]/40 to-transparent" />
      )}

      {/* Engineering Corner brackets */}
      {cornerMarks && (
        <>
          <span className="absolute -top-[1px] -left-[1px] w-1.5 h-1.5 border-t border-l border-[#1AD1F5]/50 pointer-events-none" />
          <span className="absolute -top-[1px] -right-[1px] w-1.5 h-1.5 border-t border-r border-[#1AD1F5]/50 pointer-events-none" />
          <span className="absolute -bottom-[1px] -left-[1px] w-1.5 h-1.5 border-b border-l border-[#1AD1F5]/50 pointer-events-none" />
          <span className="absolute -bottom-[1px] -right-[1px] w-1.5 h-1.5 border-b border-r border-[#1AD1F5]/50 pointer-events-none" />
        </>
      )}

      {/* Panel Header */}
      {(title || badge || headerRight) && (
        <div className="flex items-center justify-between px-3.5 py-2 border-b border-[#142F3F] bg-[#050E16]/80">
          <div className="flex items-center gap-2">
            {title && (
              <h3 className="text-xs font-mono-tech font-bold uppercase tracking-wider text-[#E6F4FF] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-sm bg-[#1AD1F5]" />
                {title}
              </h3>
            )}
            {badge && (
              <span className={`text-[9px] font-mono-tech px-1.5 py-0.5 rounded border uppercase font-semibold ${badgeColorClass}`}>
                {badge}
              </span>
            )}
          </div>
          {headerRight && <div className="text-xs">{headerRight}</div>}
        </div>
      )}

      <div className="p-3.5">{children}</div>
    </div>
  );
};
