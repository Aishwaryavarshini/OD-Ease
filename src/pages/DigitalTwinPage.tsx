import React, { useState } from 'react';
import { useTelemetry } from '../context/TelemetryContext';
import { DigitalTwinEngine } from '../components/engine/DigitalTwinEngine';
import { GlassPanel } from '../components/common/GlassPanel';
import { SectionHeader } from '../components/common/SectionHeader';
import { 
  Layers, 
  Cpu, 
  ArrowLeftRight, 
  Info
} from 'lucide-react';

export const DigitalTwinPage: React.FC = () => {
  const { telemetry } = useTelemetry();
  const [activeTab, setActiveTab] = useState<'all' | 'thermodynamic' | 'performance' | 'health'>('all');

  const comparisonRows = [
    {
      param: 'Crankshaft Speed (RPM)',
      sensor: 'Hall Effect Pickup (CH-01)',
      physical: `${telemetry.rpm} RPM`,
      virtual: `${telemetry.rpm + 2} RPM`,
      residual: '+2 RPM (0.08%)',
      state: 'performance',
      status: 'nominal',
    },
    {
      param: 'Exhaust Gas Temp (EGT)',
      sensor: 'Inconel Thermocouple (CH-02)',
      physical: `${telemetry.egt}°C`,
      virtual: `${telemetry.egt - 1}°C`,
      residual: '-1°C (0.14%)',
      state: 'thermodynamic',
      status: telemetry.egt > 730 ? 'warning' : 'nominal',
    },
    {
      param: 'Cylinder Head Temp (CHT)',
      sensor: 'Submerged K-Type Probe (CH-03)',
      physical: `${telemetry.cht}°C`,
      virtual: `${telemetry.cht}°C`,
      residual: '0.0°C (0.00%)',
      state: 'thermodynamic',
      status: 'nominal',
    },
    {
      param: 'Main Gallery Oil Pressure',
      sensor: 'Piezoresistive Transducer (CH-04)',
      physical: `${telemetry.oilPressure} bar`,
      virtual: `${telemetry.oilPressure} bar`,
      residual: '0.00 bar (0.0%)',
      state: 'performance',
      status: telemetry.oilPressure < 3.8 ? 'warning' : 'nominal',
    },
    {
      param: 'Structural Vibration (g)',
      sensor: 'Tri-Axial Accelerometer (CH-08)',
      physical: `${telemetry.vibration}g`,
      virtual: `${(telemetry.vibration * 0.98).toFixed(1)}g`,
      residual: '-0.04g (1.9%)',
      state: 'health',
      status: telemetry.vibration > 3.0 ? 'warning' : 'nominal',
    },
    {
      param: 'Intake Manifold Boost (MAP)',
      sensor: 'Absolute Pressure Sensor (CH-06)',
      physical: `${telemetry.boostPressure} bar`,
      virtual: `${telemetry.boostPressure} bar`,
      residual: '0.00 bar (0.0%)',
      state: 'thermodynamic',
      status: 'nominal',
    },
    {
      param: 'Common Rail Pressure',
      sensor: 'High-Pressure Fuel Sender (CH-05)',
      physical: `${telemetry.fuelPressure} bar`,
      virtual: `${(telemetry.fuelPressure + 0.02).toFixed(2)} bar`,
      residual: '+0.02 bar (0.5%)',
      state: 'performance',
      status: 'nominal',
    },
  ];

  const filteredRows =
    activeTab === 'all'
      ? comparisonRows
      : comparisonRows.filter((r) => r.state === activeTab);

  return (
    <div className="space-y-4 select-none">
      <SectionHeader
        badge="NUMERICAL ENGINE REPLICA // DRDO/VRDE 180 HP"
        title="DIGITAL TWIN CO-SIMULATION MATRIX"
        subtitle="Continuous bi-directional telemetry synchronization comparing the physical aero diesel engine with the calibrated thermodynamic and dynamic twin model."
      />

      {/* Mandatory Simulated Data Banner */}
      <div className="bg-[#050E16] border border-[#142F3F] rounded-lg px-3 py-1.5 flex items-center justify-between text-xs font-mono-tech">
        <div className="flex items-center gap-2 text-[#8BA3B3]">
          <Info className="w-3.5 h-3.5 text-[#1AD1F5]" />
          <span>CO-SIMULATION BENCH:</span>
          <span className="text-[#1AD1F5] font-semibold">SIMULATED / DEMO VIRTUAL ENGINE MODEL</span>
          <span className="hidden sm:inline text-[#526E7E]">• REAL-TIME RUNGE-KUTTA 4TH ORDER THERMODYNAMICS</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-[#526E7E]">SYNC ACCURACY:</span>
          <span className="text-[#3CE698] font-bold">{telemetry.syncAccuracy}%</span>
        </div>
      </div>

      {/* Center Synchronization Highlight Bar */}
      <div className="aerospace-panel p-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded bg-[#08151F] border border-[#142F3F] flex items-center justify-center">
            <ArrowLeftRight className="w-4 h-4 text-[#1AD1F5]" />
          </div>
          <div>
            <div className="text-[10px] font-mono-tech uppercase text-[#526E7E]">
              CO-SIMULATION SYNCHRONIZATION ACCURACY
            </div>
            <div className="text-xl font-mono-tech font-bold text-[#1AD1F5] flex items-baseline gap-2">
              <span>{telemetry.syncAccuracy}%</span>
              <span className="text-[10px] text-[#3CE698] font-normal">NOMINAL KALMAN RESIDUAL</span>
            </div>
          </div>
        </div>

        {/* State filter buttons */}
        <div className="flex items-center gap-0.5 bg-[#050E16] p-0.5 rounded border border-[#142F3F] text-xs font-mono-tech">
          {(['all', 'thermodynamic', 'performance', 'health'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-2.5 py-1 text-[10px] font-mono-tech uppercase rounded transition-colors cursor-pointer ${
                activeTab === tab
                  ? 'bg-[#1AD1F5] text-[#04090F] font-bold'
                  : 'text-[#8BA3B3] hover:text-[#E6F4FF]'
              }`}
            >
              {tab === 'all' ? 'ALL CHANNELS' : tab}
            </button>
          ))}
        </div>
      </div>

      {/* Main Large Engine Twin Visualizer */}
      <div className="aerospace-panel p-2">
        <DigitalTwinEngine interactive={true} showLabels={true} />
      </div>

      {/* Side-by-Side Comparison: Physical vs Virtual */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        {/* Left Column: Physical Engine Stream */}
        <div className="lg:col-span-5 aerospace-panel p-3 space-y-2">
          <div className="flex items-center justify-between pb-2 border-b border-[#142F3F] text-xs font-mono-tech">
            <span className="text-[#E6F4FF] font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-[#8BA3B3]" />
              PHYSICAL ENGINE (DRDO-VRDE)
            </span>
            <span className="text-[9px] text-[#3CE698] bg-[#3CE698]/10 px-1.5 py-0.2 rounded border border-[#3CE698]/30 font-bold">
              ARINC STREAM
            </span>
          </div>

          <div className="space-y-1.5 text-xs font-mono-tech">
            {filteredRows.map((r) => (
              <div key={r.param} className="p-2 rounded bg-[#050E16] border border-[#142F3F] flex justify-between items-center">
                <div>
                  <span className="text-[#E6F4FF] text-[11px] font-semibold block">{r.param}</span>
                  <span className="text-[9px] text-[#526E7E]">{r.sensor}</span>
                </div>
                <span className="text-xs font-bold text-[#E6F4FF]">{r.physical}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Center Comparison Residual Block */}
        <div className="lg:col-span-2 flex lg:flex-col items-center justify-center p-3 text-center text-xs font-mono-tech gap-2 aerospace-panel">
          <div className="text-[9px] text-[#526E7E] uppercase font-bold tracking-wider">
            STATE RESIDUAL
          </div>
          <div className="w-10 h-10 rounded border border-[#1AD1F5] flex items-center justify-center bg-[#050E16] text-[#1AD1F5] font-bold text-xs">
            Δ 0.2%
          </div>
          <div className="text-[9px] text-[#8BA3B3] max-w-[130px]">
            Kalman residual within 3σ threshold
          </div>
        </div>

        {/* Right Column: Virtual Engine Model */}
        <div className="lg:col-span-5 aerospace-panel p-3 space-y-2">
          <div className="flex items-center justify-between pb-2 border-b border-[#142F3F] text-xs font-mono-tech">
            <span className="text-[#1AD1F5] font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4" />
              VIRTUAL TWIN MODEL
            </span>
            <span className="text-[9px] text-[#1AD1F5] bg-[#1AD1F5]/10 px-1.5 py-0.2 rounded border border-[#1AD1F5]/30 font-bold">
              NON-LINEAR PDE
            </span>
          </div>

          <div className="space-y-1.5 text-xs font-mono-tech">
            {filteredRows.map((r) => (
              <div key={r.param} className="p-2 rounded bg-[#050E16] border border-[#142F3F] flex justify-between items-center">
                <div>
                  <span className="text-[#1AD1F5] text-[11px] font-semibold block">{r.param}</span>
                  <span className="text-[9px] text-[#526E7E]">Residual: {r.residual}</span>
                </div>
                <span className="text-xs font-bold text-[#1AD1F5]">{r.virtual}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Subsystems State Triad: Thermodynamic, Performance, Health */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <GlassPanel title="THERMODYNAMIC STATE" badge="T-STATE" badgeColor="cyan">
          <div className="space-y-1.5 text-xs font-mono-tech text-[#8BA3B3]">
            <div className="flex justify-between">
              <span>Indicated Mean Effective Pressure:</span>
              <span className="text-[#E6F4FF] font-bold">16.4 bar</span>
            </div>
            <div className="flex justify-between">
              <span>Combustion Heat Release Rate:</span>
              <span className="text-[#E6F4FF] font-bold">142 J/deg</span>
            </div>
            <div className="flex justify-between">
              <span>Turbo Pressure Ratio (PR):</span>
              <span className="text-[#E6F4FF] font-bold">2.45</span>
            </div>
            <div className="flex justify-between">
              <span>Intercooler Efficiency:</span>
              <span className="text-[#3CE698] font-bold">89.4%</span>
            </div>
          </div>
        </GlassPanel>

        <GlassPanel title="PERFORMANCE STATE" badge="P-STATE" badgeColor="cyan">
          <div className="space-y-1.5 text-xs font-mono-tech text-[#8BA3B3]">
            <div className="flex justify-between">
              <span>Brake Power (Rating):</span>
              <span className="text-[#E6F4FF] font-bold">178.4 HP</span>
            </div>
            <div className="flex justify-between">
              <span>Brake Specific Fuel Consumption:</span>
              <span className="text-[#E6F4FF] font-bold">212 g/kWh</span>
            </div>
            <div className="flex justify-between">
              <span>Volumetric Efficiency:</span>
              <span className="text-[#E6F4FF] font-bold">93.1%</span>
            </div>
            <div className="flex justify-between">
              <span>ECU Throttle Latency:</span>
              <span className="text-[#3CE698] font-bold">18 ms</span>
            </div>
          </div>
        </GlassPanel>

        <GlassPanel title="HEALTH & WEAR STATE" badge="H-STATE" badgeColor="green">
          <div className="space-y-1.5 text-xs font-mono-tech text-[#8BA3B3]">
            <div className="flex justify-between">
              <span>Compression Ring Seal Index:</span>
              <span className="text-[#3CE698] font-bold">96.8%</span>
            </div>
            <div className="flex justify-between">
              <span>Bearing Hydrodynamic Film:</span>
              <span className="text-[#3CE698] font-bold">Optimal</span>
            </div>
            <div className="flex justify-between">
              <span>Injector Nozzle Orifice Wear:</span>
              <span className="text-[#FFB834] font-bold">3.2% (Nominal)</span>
            </div>
            <div className="flex justify-between">
              <span>RUL Operating Reserve:</span>
              <span className="text-[#E6F4FF] font-bold">{telemetry.rulHours} Hours</span>
            </div>
          </div>
        </GlassPanel>
      </div>
    </div>
  );
};
