import React, { useState, useEffect } from 'react';
import { Cpu, CheckCircle } from 'lucide-react';

interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [stepIndex, setStepIndex] = useState(0);

  const steps = [
    'INITIALIZING DIGITAL TWIN...',
    'SYNCING TELEMETRY STREAM...',
    'LOADING LSTM AI MODEL...',
    'MISSION SYSTEM READY',
  ];

  useEffect(() => {
    // Step progression every ~350ms to stay well under 1.5s
    const timer1 = setTimeout(() => setStepIndex(1), 320);
    const timer2 = setTimeout(() => setStepIndex(2), 640);
    const timer3 = setTimeout(() => setStepIndex(3), 960);
    const timerFinal = setTimeout(() => onComplete(), 1350);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timerFinal);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-[#050B12] flex flex-col items-center justify-center p-6 text-center select-none">
      {/* Background grid */}
      <div className="absolute inset-0 bg-tech-grid opacity-30 pointer-events-none" />

      {/* Central Hologram Ring */}
      <div className="relative mb-8">
        <div className="w-24 h-24 rounded-full border-2 border-[#19C7F1]/30 border-t-[#19C7F1] animate-spin flex items-center justify-center">
          <div className="w-16 h-16 rounded-full border border-[#173342] border-b-[#42DFA0] animate-spin" style={{ animationDirection: 'reverse', animationDuration: '2s' }}>
            <div className="w-full h-full flex items-center justify-center">
              <Cpu className="w-8 h-8 text-[#19C7F1] animate-pulse" />
            </div>
          </div>
        </div>
        <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#19C7F1] animate-ping" />
      </div>

      {/* Hero Title */}
      <h1 className="text-3xl sm:text-4xl font-mono-tech font-bold tracking-[0.25em] text-[#E8F5FF] mb-2">
        AEROTWIN
      </h1>
      <p className="text-xs font-mono-tech text-[#78919F] uppercase tracking-widest mb-8">
        AI-POWERED DIGITAL TWIN FOR UAV ENGINE INTELLIGENCE
      </p>

      {/* Sequence logs */}
      <div className="w-full max-w-sm space-y-2 text-left font-mono-tech text-xs">
        {steps.map((step, idx) => {
          const isDone = idx < stepIndex;
          const isCurrent = idx === stepIndex;

          return (
            <div
              key={step}
              className={`flex items-center justify-between p-2 rounded border transition-all duration-200 ${
                isCurrent
                  ? 'bg-[#19C7F1]/15 border-[#19C7F1] text-[#19C7F1] shadow-[0_0_12px_rgba(25,199,241,0.2)]'
                  : isDone
                  ? 'bg-[#0B1D28]/60 border-[#173342] text-[#42DFA0]'
                  : 'bg-transparent border-transparent text-[#506C79]'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-[#506C79]">0{idx + 1}</span>
                <span>{step}</span>
              </div>
              {isDone ? (
                <CheckCircle className="w-3.5 h-3.5 text-[#42DFA0]" />
              ) : isCurrent ? (
                <span className="w-2 h-2 rounded-full bg-[#19C7F1] animate-ping" />
              ) : null}
            </div>
          );
        })}
      </div>

      {/* Skip button if user wants immediate access */}
      <button
        onClick={onComplete}
        className="mt-8 text-[11px] font-mono-tech text-[#506C79] hover:text-[#19C7F1] underline cursor-pointer"
      >
        Skip sequence &gt;&gt;
      </button>
    </div>
  );
};
