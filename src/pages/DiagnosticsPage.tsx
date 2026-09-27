import React, { useState } from 'react';
import { useTelemetry } from '../context/TelemetryContext';
import { SectionHeader } from '../components/common/SectionHeader';
import { StatusIndicator } from '../components/common/StatusIndicator';
import { 
  AlertTriangle, 
  Flame, 
  Droplets, 
  Wind, 
  Zap, 
  Radio, 
  FileText,
  Info,
  CheckCircle2,
  Wrench
} from 'lucide-react';

export const DiagnosticsPage: React.FC = () => {
  const { telemetry, faults } = useTelemetry();

  const subsystems = [
    {
      id: 'combustion',
      name: 'Combustion Chamber',
      code: 'SUB-01',
      status: telemetry.egt > 730 ? 'warning' : 'healthy',
      icon: <Flame className="w-4 h-4 text-[#FFB834]" />,
      detail: `EGT ${telemetry.egt}°C (Nominal 690-725°C). In-cylinder pressure balance nominal.`,
      action: telemetry.egt > 730 ? 'Inspect Cylinder #3 injector spray pattern and nozzle orifice.' : 'No maintenance intervention required.',
    },
    {
      id: 'turbo',
      name: 'Turbocharger Assembly',
      code: 'SUB-02',
      status: 'healthy',
      icon: <Wind className="w-4 h-4 text-[#1AD1F5]" />,
      detail: `Boost pressure ${telemetry.boostPressure} bar. Compressor wheel dynamic balance within spec.`,
      action: 'Nominal operation. Scheduled bore inspection at +150h.',
    },
    {
      id: 'lubrication',
      name: 'Lubrication System',
      code: 'SUB-03',
      status: telemetry.oilPressure < 3.8 ? 'warning' : 'healthy',
      icon: <Droplets className="w-4 h-4 text-[#3CE698]" />,
      detail: `Main gallery oil pressure ${telemetry.oilPressure} bar @ ${telemetry.oilTemp}°C sump temp.`,
      action: telemetry.oilPressure < 3.8 ? 'Verify scavenge line filter and check bypass valve seating.' : 'Lubrication film intact. Wear particulate below threshold.',
    },
    {
      id: 'cooling',
      name: 'Cooling Jacket System',
      code: 'SUB-04',
      status: 'healthy',
      icon: <Droplets className="w-4 h-4 text-[#1AD1F5]" />,
      detail: `CHT ${telemetry.cht}°C. Heat dissipation rate: 42 kW thermal nominal.`,
      action: 'Coolant flow circulation verified. Heat exchanger clear.',
    },
    {
      id: 'fuel',
      name: 'Common Rail Fuel Injection',
      code: 'SUB-05',
      status: 'healthy',
      icon: <Zap className="w-4 h-4 text-[#1AD1F5]" />,
      detail: `Fuel rail pressure ${telemetry.fuelPressure} bar. High-pressure pump volumetric efficiency: 97.4%.`,
      action: 'Piezo injection timing synchronized within ±0.2 crank degrees.',
    },
    {
      id: 'mechanical',
      name: 'Mechanical & Structural Assembly',
      code: 'SUB-06',
      status: telemetry.vibration > 3.0 ? 'warning' : 'healthy',
      icon: <Radio className="w-4 h-4 text-[#FF4D61]" />,
      detail: `Tri-axial vibration ${telemetry.vibration}g. Harmonic peaks monitored at 1X and 2X shaft frequency.`,
      action: telemetry.vibration > 3.0 ? 'Perform dynamic propeller re-balancing and inspect rubber mount isolators.' : 'Vibration envelope within safe operational limits.',
    },
  ];

  const diagnosticLogs = [
    { time: '14:22:18 UTC', code: 'ANN-0419', msg: 'Multivariate temporal correlation check complete. ARINC-429 parity nominal.', type: 'info' },
    { time: '14:21:45 UTC', code: 'ANN-0418', msg: 'Kalman residual convergence stable across all 8 telemetry channels.', type: 'info' },
    { time: '14:20:12 UTC', code: 'ANN-0104', msg: 'Subtle EGT cross-bank thermal gradient +6°C observed during climb transition.', type: 'warn' },
    { time: '14:18:05 UTC', code: 'ANN-0417', msg: 'In-flight oil scavenge pressure baseline calibrated against altitude.', type: 'info' },
    { time: '14:15:30 UTC', code: 'ANN-0416', msg: 'Weibull degradation estimator updated RUL lookahead: 426 operating hours.', type: 'info' },
  ];

  return (
    <div className="space-y-4 select-none">
      <SectionHeader
        badge="FAULTRONIC ISOLATION & ROOT CAUSE MATRIX"
        title="SUBSYSTEM HEALTH & DIAGNOSTIC REASONING"
        subtitle="Automated cross-sensor correlation and root-cause analysis isolating incipient anomalies across the DRDO/VRDE 180 HP aero diesel engine."
      />

      {/* Mandatory Simulated Data Banner */}
      <div className="bg-[#050E16] border border-[#142F3F] rounded-lg px-3 py-2 flex items-center justify-between text-xs font-mono-tech">
        <div className="flex items-center gap-2 text-[#8BA3B3]">
          <Info className="w-3.5 h-3.5 text-[#1AD1F5]" />
          <span>DIAGNOSTIC SUBSYSTEM:</span>
          <span className="text-[#1AD1F5] font-semibold">SIMULATED / DEMO FAULT INJECTION ENGINE</span>
          <span className="hidden sm:inline text-[#526E7E]">• LINE REPLACEABLE UNIT (LRU) ISOLATION</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-[#526E7E]">ACTIVE ADVISORIES:</span>
          <span className="text-[#FFB834] font-bold">{faults.length}</span>
        </div>
      </div>

      {/* Subsystem Health Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {subsystems.map((sub) => (
          <div
            key={sub.id}
            className={`aerospace-panel p-3.5 flex flex-col justify-between transition-colors ${
              sub.status === 'warning'
                ? 'border-[#FFB834]/80'
                : 'border-[#142F3F]'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded bg-[#050E16] border border-[#142F3F]">
                    {sub.icon}
                  </div>
                  <div>
                    <h3 className="text-xs font-mono-tech font-bold uppercase text-[#E6F4FF]">
                      {sub.name}
                    </h3>
                    <span className="text-[9px] font-mono-tech text-[#526E7E]">{sub.code}</span>
                  </div>
                </div>
                <StatusIndicator
                  status={sub.status as any}
                  label={sub.status === 'healthy' ? 'OPTIMAL' : 'CAUTION'}
                  size="sm"
                />
              </div>

              <p className="text-[11px] text-[#8BA3B3] font-mono-tech mb-3 leading-relaxed">
                {sub.detail}
              </p>
            </div>

            <div className="pt-2 border-t border-[#142F3F] text-[9px] font-mono-tech">
              <span className="text-[#526E7E] block uppercase">RECOMMENDED MITIGATION:</span>
              <span className={sub.status === 'warning' ? 'text-[#FFB834] font-semibold' : 'text-[#3CE698]'}>
                {sub.action}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Active Faults & Root-Cause Tree */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Active Alerts Table */}
        <div className="lg:col-span-7 aerospace-panel p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#142F3F] text-xs font-mono-tech">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#FFB834]" />
              <span className="font-bold text-[#E6F4FF] uppercase">
                ACTIVE FAULT SIGNATURES & ADVISORIES (MIL-STD-1472)
              </span>
            </div>
            <span className="text-[9px] text-[#526E7E] bg-[#050E16] px-2 py-0.5 rounded border border-[#142F3F]">
              TOTAL: {faults.length}
            </span>
          </div>

          <div className="space-y-2 text-xs font-mono-tech">
            {faults.map((f) => (
              <div
                key={f.id}
                className={`p-2.5 rounded border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 ${
                  f.severity === 'critical'
                    ? 'bg-[#FF4D61]/10 border-[#FF4D61]/60'
                    : f.severity === 'warning'
                    ? 'bg-[#FFB834]/10 border-[#FFB834]/50'
                    : 'bg-[#050E16] border-[#142F3F]'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-bold text-[#E6F4FF] text-[11px]">{f.title}</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#08151F] text-[#8BA3B3] border border-[#142F3F]">
                      {f.subsystem}
                    </span>
                  </div>
                  <p className="text-[10px] text-[#8BA3B3]">{f.description}</p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <span className="text-[9px] text-[#526E7E] block uppercase">CONFIDENCE</span>
                    <span className="font-bold text-[#1AD1F5]">{f.probability}%</span>
                  </div>
                  <StatusIndicator status={f.severity} size="sm" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Engine Diagnostic Log Buffer */}
        <div className="lg:col-span-5 aerospace-panel p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#142F3F] text-xs font-mono-tech">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#1AD1F5]" />
              <span className="font-bold text-[#E6F4FF] uppercase">
                ENGINE HEALTH LOG RECORDER
              </span>
            </div>
            <span className="text-[9px] text-[#3CE698]">BUFFER SYNCHRONIZED</span>
          </div>

          <div className="space-y-1.5 text-xs font-mono-tech">
            {diagnosticLogs.map((log, idx) => (
              <div
                key={idx}
                className="p-2 rounded bg-[#050E16] border border-[#142F3F] flex items-start gap-2"
              >
                <span className="text-[10px] text-[#526E7E] shrink-0">{log.time}</span>
                <span className={`text-[10px] font-bold shrink-0 ${log.type === 'warn' ? 'text-[#FFB834]' : 'text-[#1AD1F5]'}`}>
                  [{log.code}]
                </span>
                <p className="text-[10px] text-[#8BA3B3] leading-normal">{log.msg}</p>
              </div>
            ))}
          </div>

          <div className="p-2.5 rounded bg-[#050E16] border border-[#142F3F] text-xs font-mono-tech">
            <span className="text-[9px] text-[#526E7E] uppercase block mb-1 font-bold">
              GROUND CREW TURNAROUND CHECKLIST:
            </span>
            <ul className="space-y-1 text-[10px] text-[#8BA3B3] list-disc list-inside">
              <li>Inspect oil scavenge filter mesh for metallic debris</li>
              <li>Verify common rail injector high-pressure connection torque</li>
              <li>Perform propeller flange dynamic balance verification</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
