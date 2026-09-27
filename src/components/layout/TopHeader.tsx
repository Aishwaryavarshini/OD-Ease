import React, { useState, useEffect } from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import { Clock, Sliders, AlertTriangle } from 'lucide-react';
import { ThemeToggle } from '../common/ThemeToggle';

export const TopHeader: React.FC = () => {
  const { telemetry, isPaused, setIsSimModalOpen, scenario } = useTelemetry();
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTimeStr(now.toTimeString().split(' ')[0] + ' UTC');
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-14 bg-[#050E16] border-b border-[#142F3F] px-4 flex items-center justify-between shrink-0 select-none z-10">
      {/* Left: System Title & Engine Platform Callout */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-sm bg-[#1AD1F5]" />
          <h1 className="text-xs sm:text-sm font-mono-tech font-bold uppercase tracking-wider text-[#E6F4FF]">
            AEROTWIN ENGINE MISSION CONTROL
          </h1>
        </div>

        <span className="hidden md:inline-block text-[#142F3F]">|</span>

        {/* Engine Sub-descriptor */}
        <div className="hidden md:flex items-center gap-2 text-xs font-mono-tech text-[#8BA3B3]">
          <span>TARGET:</span>
          <span className="text-[#1AD1F5] font-semibold">DRDO/VRDE 180 HP</span>
          <span className="text-[10px] text-[#526E7E]">(4-CYL TURBO DIESEL)</span>
        </div>
      </div>

      {/* Right: Simulation Pill, Sync status & Mission Clock */}
      <div className="flex items-center gap-3">
        {/* Scenario Alert if active */}
        {scenario !== 'nominal' && (
          <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-mono-tech text-[#FFB834] bg-[#FFB834]/15 px-2 py-1 rounded border border-[#FFB834]/40">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>FAULT INJECTION: {scenario.toUpperCase()}</span>
          </div>
        )}

        {/* Sync status */}
        <div className="hidden lg:flex items-center gap-1.5 text-xs font-mono-tech">
          <span className="text-[#526E7E]">CO-SIM SYNC:</span>
          <span className="text-[#3CE698] font-bold">{telemetry.syncAccuracy}%</span>
        </div>

        {/* SIMULATION MODE INDICATOR BUTTON */}
        <button
          onClick={() => setIsSimModalOpen(true)}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#08151F] border border-[#142F3F] hover:border-[#1AD1F5] text-[11px] font-mono-tech text-[#1AD1F5] transition-colors cursor-pointer"
          title="Click to configure simulation parameters"
        >
          <span className={`w-2 h-2 rounded-sm ${isPaused ? 'bg-[#FFB834]' : 'bg-[#3CE698]'}`} />
          <span className="font-semibold uppercase tracking-wider">
            {isPaused ? 'SIMULATION PAUSED' : 'SIMULATED DATA'}
          </span>
          <span className="text-[9px] text-[#8BA3B3] hidden sm:inline">• DEMO</span>
          <Sliders className="w-3 h-3 ml-0.5 opacity-80" />
        </button>

        {/* Live Mission Clock */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#04090F] border border-[#142F3F] text-xs font-mono-tech text-[#E6F4FF]">
          <Clock className="w-3.5 h-3.5 text-[#1AD1F5]" />
          <span>{timeStr || '12:00:00 UTC'}</span>
        </div>

        {/* Coordinated Light/Dark Theme Switcher */}
        <ThemeToggle showLabel={true} />
      </div>
    </header>
  );
};
