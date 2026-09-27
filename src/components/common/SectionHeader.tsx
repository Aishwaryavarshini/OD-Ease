import React from 'react';

interface SectionHeaderProps {
  badge?: string;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  align?: 'left' | 'center';
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  badge,
  title,
  subtitle,
  action,
  align = 'left',
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-end justify-between gap-3 ${
        align === 'center' ? 'text-center items-center sm:items-center' : ''
      } ${className}`}
    >
      <div className={`space-y-1 ${align === 'center' ? 'max-w-2xl mx-auto' : ''}`}>
        {badge && (
          <div className="flex items-center gap-2 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#19C7F1] animate-pulse" />
            <span className="text-[11px] font-mono-tech tracking-widest uppercase text-[#19C7F1] font-semibold">
              {badge}
            </span>
          </div>
        )}
        <h2 className="text-xl sm:text-2xl font-mono-tech font-bold tracking-tight text-[#E8F5FF] uppercase">
          {title}
        </h2>
        {subtitle && (
          <p className="text-xs sm:text-sm text-[#78919F] max-w-2xl font-normal leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
};
