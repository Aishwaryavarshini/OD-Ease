import React from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import { SimulationScenario } from '../../types';
import { X, Play, Pause, RotateCcw, AlertTriangle, ShieldCheck, Flame, Radio, Droplets } from 'lucide-react';
import { Button } from '../common/Button';

export const SimulationModal: React.FC = () => {
  const { 
    isSimModalOpen, 
    setIsSimModalOpen, 
    isPaused, 
    togglePause, 
    resetSimulation, 
    scenario, 
    setScenario 
  } = useTelemetry();

  if (!isSimModalOpen) return null;

  const scenarios: { id: SimulationScenario; name: string; desc: string; icon: React.ReactNode; severity: string }[] = [
    {
      id: 'nominal',
      name: 'Nominal Baseline Cruise',
      desc: 'All parameters normal. 2450 RPM, 712°C EGT, 148°C CHT, 4.2 bar oil pressure.',
      icon: <ShieldCheck className="w-4 h-4 text-[#42DFA0]" />,
      severity: 'Normal (Health 95.2%)',
    },
    {
      id: 'egt_drift',
      name: 'Combustion Chamber Drift (EGT Elevated)',
      desc: 'Simulates cylinder #3 injector fouling causing EGT to rise toward 745°C. AI anomaly detection triggers warning.',
      icon: <Flame className="w-4 h-4 text-[#FFC857]" />,
      severity: 'Warning (Anomaly 34%)',
    },
    {
      id: 'vib_transient',
      name: 'Vibration Harmonic Spike',
      desc: 'Injects high-frequency mechanical vibration transient (3.4g) on the forward engine mounting bracket.',
      icon: <Radio className="w-4 h-4 text-[#FFC857]" />,
      severity: 'Warning (Anomaly 28%)',
    },
    {
      id: 'oil_pressure_drop',
      name: 'Lubrication Scavenge Restriction',
      desc: 'Oil pressure drops from 4.2 bar to 3.2 bar with elevated oil temperature. Severe degradation flag.',
      icon: <Droplets className="w-4 h-4 text-[#FF5368]" />,
      severity: 'Critical (Anomaly 41%)',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#050B12]/80 backdrop-blur-md animate-fadeIn select-none">
      <div className="relative w-full max-w-lg bg-[#071019] border border-[#19C7F1]/50 rounded-lg shadow-[0_0_30px_rgba(25,199,241,0.2)] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#173342] bg-[#0B1D28]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#19C7F1] animate-ping" />
            <h3 className="text-sm font-mono-tech font-bold uppercase tracking-wider text-[#E8F5FF]">
              SIMULATION CONTROLS & DEMO NOTICE
            </h3>
          </div>
          <button
            onClick={() => setIsSimModalOpen(false)}
            className="text-[#78919F] hover:text-[#E8F5FF] p-1 rounded hover:bg-[#173342] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 text-xs font-mono-tech">
          {/* Engineering Disclaimer Notice */}
          <div className="p-3 bg-[#0B1D28] border border-[#173342] rounded-md text-[#78919F] leading-relaxed">
            <span className="font-bold text-[#19C7F1] block mb-1">
              DEMONSTRATION & PROTOTYPE NOTICE:
            </span>
            Telemetry shown in this prototype is simulated for demonstration purposes. It demonstrates the real-time architectural capabilities of an AI-driven digital twin for the DRDO/VRDE 180 HP aero diesel engine without requiring live test cell physical telemetry feeds.
          </div>

          {/* Primary Controls */}
          <div className="flex items-center gap-3">
            <Button
              variant={isPaused ? 'primary' : 'secondary'}
              size="sm"
              icon={isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
              onClick={togglePause}
              className="flex-1"
            >
              {isPaused ? 'RESUME SIMULATION' : 'PAUSE SIMULATION'}
            </Button>

            <Button
              variant="outline"
              size="sm"
              icon={<RotateCcw className="w-3.5 h-3.5" />}
              onClick={resetSimulation}
            >
              RESET SIMULATION
            </Button>
          </div>

          {/* Test Scenario Injection */}
          <div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-[#78919F] mb-2">
              FAULT & ANOMALY SCENARIO INJECTION:
            </div>
            <div className="space-y-2">
              {scenarios.map((sc) => {
                const isSelected = scenario === sc.id;
                return (
                  <div
                    key={sc.id}
                    onClick={() => setScenario(sc.id)}
                    className={`p-2.5 rounded border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#19C7F1]/10 border-[#19C7F1] shadow-[0_0_12px_rgba(25,199,241,0.15)]'
                        : 'bg-[#0B1D28]/60 border-[#173342] hover:border-[#19C7F1]/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2 font-bold text-[#E8F5FF]">
                        {sc.icon}
                        <span>{sc.name}</span>
                      </div>
                      <span className="text-[10px] text-[#78919F] font-mono-tech">{sc.severity}</span>
                    </div>
                    <p className="text-[10px] text-[#78919F] leading-normal">{sc.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-[#173342] bg-[#0B1D28] flex justify-end">
          <Button variant="secondary" size="sm" onClick={() => setIsSimModalOpen(false)}>
            Close Controls
          </Button>
        </div>
      </div>
    </div>
  );
};
