import React, { useState } from 'react';
import { useTelemetry } from '../context/TelemetryContext';
import { TelemetryChart } from '../components/charts/TelemetryChart';
import { SectionHeader } from '../components/common/SectionHeader';
import { StatusIndicator } from '../components/common/StatusIndicator';
import { 
  Activity, 
  Wifi, 
  Radio, 
  ShieldCheck, 
  RefreshCw,
  Gauge,
  Thermometer,
  Flame,
  Droplets,
  Zap,
  Info
} from 'lucide-react';

export const TelemetryPage: React.FC = () => {
  const { telemetry, history, isPaused, togglePause } = useTelemetry();
  const [selectedSensor, setSelectedSensor] = useState<string>('rpm');

  const sensors = [
    {
      id: 'rpm',
      name: 'Engine Crankshaft Speed',
      short: 'RPM',
      channel: 'CH-01',
      unit: 'RPM',
      val: telemetry.rpm,
      normal: '2400 – 2500',
      warning: '> 2650',
      critical: '> 2800',
      status: telemetry.rpm > 2650 ? 'warning' : 'healthy',
      color: '#1AD1F5',
      icon: <Gauge className="w-4 h-4 text-[#1AD1F5]" />,
    },
    {
      id: 'egt',
      name: 'Exhaust Gas Temperature',
      short: 'EGT',
      channel: 'CH-02',
      unit: '°C',
      val: telemetry.egt,
      normal: '690 – 725',
      warning: '> 730',
      critical: '> 760',
      status: telemetry.egt > 730 ? 'warning' : 'healthy',
      color: '#FFB834',
      icon: <Flame className="w-4 h-4 text-[#FFB834]" />,
    },
    {
      id: 'cht',
      name: 'Cylinder Head Temperature',
      short: 'CHT',
      channel: 'CH-03',
      unit: '°C',
      val: telemetry.cht,
      normal: '140 – 160',
      warning: '> 175',
      critical: '> 190',
      status: telemetry.cht > 175 ? 'warning' : 'healthy',
      color: '#1AD1F5',
      icon: <Thermometer className="w-4 h-4 text-[#1AD1F5]" />,
    },
    {
      id: 'oilPressure',
      name: 'Engine Lubrication Pressure',
      short: 'OIL PRESS',
      channel: 'CH-04',
      unit: 'bar',
      val: telemetry.oilPressure,
      normal: '4.0 – 4.5',
      warning: '< 3.8',
      critical: '< 3.2',
      status: telemetry.oilPressure < 3.8 ? 'warning' : 'healthy',
      color: '#3CE698',
      icon: <Droplets className="w-4 h-4 text-[#3CE698]" />,
    },
    {
      id: 'fuelPressure',
      name: 'Common Rail Injection Pressure',
      short: 'FUEL PRESS',
      channel: 'CH-05',
      unit: 'bar',
      val: telemetry.fuelPressure,
      normal: '3.6 – 4.0',
      warning: '< 3.4',
      critical: '< 3.0',
      status: 'healthy',
      color: '#1AD1F5',
      icon: <Zap className="w-4 h-4 text-[#1AD1F5]" />,
    },
    {
      id: 'boostPressure',
      name: 'Manifold Absolute Pressure (MAP)',
      short: 'MAP / BOOST',
      channel: 'CH-06',
      unit: 'bar',
      val: telemetry.boostPressure,
      normal: '1.35 – 1.50',
      warning: '> 1.60',
      critical: '> 1.75',
      status: 'healthy',
      color: '#1AD1F5',
      icon: <Activity className="w-4 h-4 text-[#1AD1F5]" />,
    },
    {
      id: 'oilTemp',
      name: 'Sump Oil Temperature',
      short: 'OIL TEMP',
      channel: 'CH-07',
      unit: '°C',
      val: telemetry.oilTemp,
      normal: '85 – 98',
      warning: '> 105',
      critical: '> 115',
      status: 'healthy',
      color: '#3CE698',
      icon: <Thermometer className="w-4 h-4 text-[#3CE698]" />,
    },
    {
      id: 'vibration',
      name: 'Tri-Axial Block Vibration',
      short: 'VIBRATION',
      channel: 'CH-08',
      unit: 'g',
      val: telemetry.vibration,
      normal: '1.8 – 2.4',
      warning: '> 3.0',
      critical: '> 4.0',
      status: telemetry.vibration > 3.0 ? 'warning' : 'healthy',
      color: '#1AD1F5',
      icon: <Radio className="w-4 h-4 text-[#1AD1F5]" />,
    },
  ];

  const activeSensor = sensors.find((s) => s.id === selectedSensor) || sensors[0];

  return (
    <div className="space-y-4 select-none">
      {/* Flight Deck Header */}
      <SectionHeader
        badge="AVIONICS BUS INTERFACE // ARINC-429 & CAN-AERO"
        title="MULTIVARIATE ENGINE TELEMETRY MATRIX"
        subtitle="High-rate synchronous 50Hz acquisition tracking 8 primary thermodynamic, aerodynamic, and structural vibration parameters on the DRDO/VRDE 180 HP aero diesel engine."
      />

      {/* Mandatory Simulated Data Banner */}
      <div className="bg-[#050E16] border border-[#142F3F] rounded-lg px-3 py-2 flex items-center justify-between text-xs font-mono-tech">
        <div className="flex items-center gap-2 text-[#8BA3B3]">
          <Info className="w-3.5 h-3.5 text-[#1AD1F5]" />
          <span>DATA INTEGRITY:</span>
          <span className="text-[#1AD1F5] font-semibold">SIMULATED / DEMO TELEMETRY STREAM</span>
          <span className="hidden sm:inline text-[#526E7E]">• VRDE-180 HIL BENCH CO-SIMULATOR</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-[#526E7E]">SAMPLING:</span>
          <span className="text-[#3CE698] font-bold">50 Hz / 20ms</span>
        </div>
      </div>

      {/* Bus Link Status Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono-tech">
        <div className="aerospace-panel p-2.5 flex items-center gap-2.5">
          <RefreshCw className="w-4 h-4 text-[#1AD1F5] shrink-0" />
          <div>
            <span className="text-[9px] text-[#526E7E] block uppercase">ACQUISITION RATE</span>
            <span className="text-xs font-bold text-[#1AD1F5]">50 Hz (20ms)</span>
          </div>
        </div>

        <div className="aerospace-panel p-2.5 flex items-center gap-2.5">
          <Wifi className="w-4 h-4 text-[#3CE698] shrink-0" />
          <div>
            <span className="text-[9px] text-[#526E7E] block uppercase">BUS ERROR RATE</span>
            <span className="text-xs font-bold text-[#3CE698]">0.00% (CRC OK)</span>
          </div>
        </div>

        <div className="aerospace-panel p-2.5 flex items-center gap-2.5">
          <ShieldCheck className="w-4 h-4 text-[#1AD1F5] shrink-0" />
          <div>
            <span className="text-[9px] text-[#526E7E] block uppercase">CO-SIM PROTOCOL</span>
            <span className="text-xs font-bold text-[#E6F4FF]">ARINC-429 D429</span>
          </div>
        </div>

        <div className="aerospace-panel p-2.5 flex items-center justify-between">
          <div>
            <span className="text-[9px] text-[#526E7E] block uppercase">STREAM BUFFER</span>
            <span className="text-xs font-bold text-[#3CE698]">60 SEC ROLLING</span>
          </div>
          <button
            onClick={togglePause}
            className="px-2 py-0.5 rounded bg-[#050E16] text-[10px] font-bold text-[#1AD1F5] border border-[#142F3F] hover:border-[#1AD1F5] cursor-pointer"
          >
            {isPaused ? 'RESUME' : 'FREEZE'}
          </button>
        </div>
      </div>

      {/* Primary 8-Sensor Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {sensors.map((s) => {
          const isSelected = selectedSensor === s.id;
          return (
            <div
              key={s.id}
              onClick={() => setSelectedSensor(s.id)}
              className={`relative bg-[#08151F] rounded-lg p-3 border transition-colors cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'border-[#1AD1F5] bg-[#0A1D2B]'
                  : 'border-[#142F3F] hover:border-[#1AD1F5]/50'
              }`}
            >
              {/* Corner reticle for selected */}
              {isSelected && (
                <>
                  <span className="absolute -top-[1px] -left-[1px] w-2 h-2 border-t-2 border-l-2 border-[#1AD1F5]" />
                  <span className="absolute -top-[1px] -right-[1px] w-2 h-2 border-t-2 border-r-2 border-[#1AD1F5]" />
                  <span className="absolute -bottom-[1px] -left-[1px] w-2 h-2 border-b-2 border-l-2 border-[#1AD1F5]" />
                  <span className="absolute -bottom-[1px] -right-[1px] w-2 h-2 border-b-2 border-r-2 border-[#1AD1F5]" />
                </>
              )}

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    {s.icon}
                    <span className="text-xs font-mono-tech font-bold uppercase text-[#E6F4FF]">
                      {s.short}
                    </span>
                    <span className="text-[9px] font-mono-tech text-[#526E7E] px-1 py-0.2 rounded bg-[#050E16] border border-[#142F3F]">
                      {s.channel}
                    </span>
                  </div>
                  <StatusIndicator
                    status={s.status as any}
                    label={s.status === 'healthy' ? 'OK' : 'ELEVATED'}
                    size="sm"
                  />
                </div>

                <div className="text-[10px] text-[#8BA3B3] font-mono-tech truncate mb-1">
                  {s.name}
                </div>

                <div className="flex items-baseline gap-1.5 my-1">
                  <span className="text-2xl font-mono-tech font-bold tracking-tight text-[#E6F4FF]">
                    {typeof s.val === 'number' ? (Number.isInteger(s.val) ? s.val : s.val.toFixed(1)) : s.val}
                  </span>
                  <span className="text-xs font-mono-tech text-[#8BA3B3]">{s.unit}</span>
                </div>
              </div>

              <div className="mt-2 pt-1.5 border-t border-[#142F3F] text-[9px] font-mono-tech space-y-0.5 text-[#526E7E]">
                <div className="flex justify-between">
                  <span>NOMINAL:</span>
                  <span className="text-[#8BA3B3] font-semibold">{s.normal}</span>
                </div>
                <div className="flex justify-between text-[#FFB834]">
                  <span>CAUTION:</span>
                  <span className="font-semibold">{s.warning}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* High-Resolution Expanded Chart for Selected Sensor */}
      <div className="aerospace-panel p-3.5 space-y-2.5">
        <div className="flex items-center justify-between pb-2 border-b border-[#142F3F] text-xs font-mono-tech">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-sm bg-[#1AD1F5]" />
            <span className="font-bold text-[#E6F4FF] uppercase">
              HIGH-FIDELITY FLIGHT RECORDER TRACE: {activeSensor.name} ({activeSensor.short})
            </span>
          </div>
          <span className="text-[10px] text-[#526E7E]">
            CHANNEL {activeSensor.channel} // SYNCHRONOUS BUS CAPTURE
          </span>
        </div>

        <TelemetryChart
          data={history}
          metricKey={selectedSensor as any}
          title={`${activeSensor.short} CHRONOLOGICAL TIMELINE`}
          unit={activeSensor.unit}
          color={activeSensor.color}
          height={220}
        />
      </div>
    </div>
  );
};
