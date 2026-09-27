import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '', showLabel = false }) => {
  const { theme, isLight, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      aria-label={`Switch to ${isLight ? 'dark' : 'light'} mode`}
      title={`Switch to ${isLight ? 'dark' : 'light'} aerospace theme`}
      className={`relative inline-flex items-center gap-1.5 px-2.5 py-1 rounded border text-xs font-mono-tech transition-all cursor-pointer select-none ${
        isLight
          ? 'bg-white border-slate-300 text-sky-700 hover:bg-slate-100 hover:border-sky-500 shadow-sm'
          : 'bg-[#08151F] border-[#142F3F] text-[#1AD1F5] hover:border-[#1AD1F5] hover:bg-[#0A1D2B]'
      } ${className}`}
    >
      {isLight ? (
        <>
          <Sun className="w-3.5 h-3.5 text-amber-500 animate-in fade-in zoom-in duration-200" />
          {showLabel && <span className="font-semibold text-slate-700">LIGHT</span>}
        </>
      ) : (
        <>
          <Moon className="w-3.5 h-3.5 text-[#1AD1F5] animate-in fade-in zoom-in duration-200" />
          {showLabel && <span className="font-semibold text-[#8BA3B3]">DARK</span>}
        </>
      )}
    </button>
  );
};
