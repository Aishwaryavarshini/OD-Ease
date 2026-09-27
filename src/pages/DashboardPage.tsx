import React from 'react';
import { PageRoute } from '../types';
import { useTelemetry } from '../context/TelemetryContext';
import { DigitalTwinEngine } from '../components/engine/DigitalTwinEngine';
import { HealthGauge } from '../components/common/HealthGauge';
import { MetricCard } from '../components/common/MetricCard';
import { TelemetryChart } from '../components/charts/TelemetryChart';
import { GlassPanel } from '../components/common/GlassPanel';
import { AIConfidenceBar } from '../components/common/AIConfidenceBar';
import { Button } from '../components/common/Button';
import { 
  Activity, 
  BrainCircuit, 
  Wrench, 
  Navigation, 
  AlertTriangle, 
  ShieldCheck, 
  Plane, 
  ArrowRight,
  Info
} from 'lucide-react';

interface DashboardPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const { telemetry, history, mission, faults, scenario } = useTelemetry();

  return (
    <div className="space-y-4 select-none">
      {/* Top Banner Alert if scenario active */}
      {scenario !== 'nominal' && (
        <div className="bg-[#FFB834]/10 border border-[#FFB834]/50 p-2.5 rounded-lg flex items-center justify-between text-xs font-mono-tech text-[#FFB834]">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span className="font-bold">INJECTED FAULT SCENARIO ACTIVE: {scenario.toUpperCase()}</span>
            <span className="text-[#8BA3B3] hidden sm:inline">— Real-time digital twin and LSTM diagnostics reacting to anomalous telemetry drift.</span>
          </div>
          <button
            onClick={() => onNavigate('/diagnostics')}
            className="underline text-[#1AD1F5] hover:text-[#E6F4FF] text-[11px] font-bold cursor-pointer"
          >
            Diagnostics View &gt;&gt;
          </button>
        </div>
      )}

      {/* Mandatory Simulated Data Banner */}
      <div className="bg-[#050E16] border border-[#142F3F] rounded-lg px-3 py-1.5 flex items-center justify-between text-xs font-mono-tech">
        <div className="flex items-center gap-2 text-[#8BA3B3]">
          <Info className="w-3.5 h-3.5 text-[#1AD1F5]" />
          <span>DATA STREAM STATUS:</span>
          <span className="text-[#1AD1F5] font-semibold">SIMULATED TELEMETRY / DEMO RUNTIME</span>
          <span className="hidden sm:inline text-[#526E7E]">• DRDO/VRDE 180 HP ENGINE TWIN</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-[#526E7E]">CO-SIM ACCURACY:</span>
          <span className="text-[#3CE698] font-bold">{telemetry.syncAccuracy}%</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ROW 1: DIGITAL TWIN (LEFT) & ENGINE HEALTH + KEY METRICS (RIGHT)          */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        {/* Large Left Panel: DIGITAL TWIN */}
        <div className="xl:col-span-7 aerospace-panel flex flex-col">
          <div className="flex items-center justify-between px-3.5 py-2 border-b border-[#142F3F] bg-[#050E16]/80">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-sm bg-[#1AD1F5]" />
              <h2 className="text-xs font-mono-tech font-bold uppercase tracking-wider text-[#E6F4FF]">
                3D CAD DIGITAL TWIN REPLICA
              </h2>
              <span className="text-[9px] font-mono-tech px-1.5 py-0.2 rounded bg-[#08151F] text-[#1AD1F5] border border-[#142F3F]">
                DRDO VRDE-180 HP
              </span>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate('/digital-twin')}
              icon={<ArrowRight className="w-3 h-3" />}
              iconPosition="right"
            >
              Full Twin View
            </Button>
          </div>

          <div className="flex-1 p-2 flex items-center justify-center">
            <DigitalTwinEngine interactive={true} showLabels={true} />
          </div>

          <div className="px-3.5 py-2 bg-[#050E16]/90 border-t border-[#142F3F] flex items-center justify-between text-[10px] font-mono-tech text-[#8BA3B3]">
            <div>TWIN SYNCHRONIZATION: <span className="text-[#1AD1F5] font-bold">{telemetry.syncAccuracy}%</span></div>
            <div>THERMAL RESIDUAL: <span className="text-[#3CE698] font-bold">0.024</span></div>
            <div className="hidden sm:block">ACQUISITION BUS: <span className="text-[#E6F4FF]">ARINC-429 50Hz</span></div>
          </div>
        </div>

        {/* Right Panel: ENGINE HEALTH & METRIC GAUGES */}
        <div className="xl:col-span-5 flex flex-col gap-3">
          {/* Circular Health Gauge Card */}
          <GlassPanel
            title="PROPULSION HEALTH GAUGE"
            badge="AVIONICS HEALTH"
            badgeColor="green"
            className="flex flex-col items-center justify-center py-2"
          >
            <HealthGauge value={telemetry.health} size={210} />

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full mt-3 pt-2.5 border-t border-[#142F3F] text-center font-mono-tech text-xs">
              <div className="p-1.5 bg-[#050E16] rounded border border-[#142F3F]">
                <span className="text-[9px] text-[#526E7E] block uppercase">ANOMALY</span>
                <span className="text-sm font-bold text-[#1AD1F5]">{telemetry.anomalyProbability}%</span>
              </div>
              <div className="p-1.5 bg-[#050E16] rounded border border-[#142F3F]">
                <span className="text-[9px] text-[#526E7E] block uppercase">FAILURE PROB</span>
                <span className="text-sm font-bold text-[#FFB834]">{telemetry.failureProbability}%</span>
              </div>
              <div className="p-1.5 bg-[#050E16] rounded border border-[#142F3F]">
                <span className="text-[9px] text-[#526E7E] block uppercase">RUL</span>
                <span className="text-sm font-bold text-[#E6F4FF]">{telemetry.rulHours}h</span>
              </div>
              <div className="p-1.5 bg-[#050E16] rounded border border-[#142F3F]">
                <span className="text-[9px] text-[#526E7E] block uppercase">MISSION</span>
                <span className="text-sm font-bold text-[#3CE698]">{telemetry.missionReliability}%</span>
              </div>
            </div>
          </GlassPanel>

          {/* Core Telemetry Numerical Parameters */}
          <div className="grid grid-cols-2 gap-2.5">
            <MetricCard
              label="ENGINE SPEED"
              sublabel="CRANKSHAFT"
              value={telemetry.rpm}
              unit="RPM"
              severity="healthy"
              normalRange="2400–2500"
              sparklineData={history.slice(-10).map((h) => h.rpm)}
            />
            <MetricCard
              label="EXHAUST TEMP"
              sublabel="EGT AVERAGE"
              value={telemetry.egt}
              unit="°C"
              severity={telemetry.egt > 730 ? 'warning' : 'healthy'}
              normalRange="690–725"
              sparklineData={history.slice(-10).map((h) => h.egt)}
            />
            <MetricCard
              label="CYLINDER HEAD"
              sublabel="CHT BANK #1-#4"
              value={telemetry.cht}
              unit="°C"
              severity="healthy"
              normalRange="140–160"
              sparklineData={history.slice(-10).map((h) => h.cht)}
            />
            <MetricCard
              label="OIL PRESSURE"
              sublabel="LUBRICATION"
              value={telemetry.oilPressure}
              unit="bar"
              severity={telemetry.oilPressure < 3.8 ? 'warning' : 'healthy'}
              normalRange="4.0–4.5"
              sparklineData={history.slice(-10).map((h) => h.oilPressure)}
            />
            <MetricCard
              label="FUEL PRESSURE"
              sublabel="COMMON RAIL"
              value={telemetry.fuelPressure}
              unit="bar"
              severity="healthy"
              normalRange="3.6–4.0"
              sparklineData={history.slice(-10).map((h) => h.fuelPressure)}
            />
            <MetricCard
              label="BOOST / MAP"
              sublabel="TURBOCHARGER"
              value={telemetry.boostPressure}
              unit="bar"
              severity="healthy"
              normalRange="1.35–1.50"
              sparklineData={history.slice(-10).map((h) => h.boostPressure)}
            />
            <MetricCard
              label="TRI-AXIAL VIBRATION"
              sublabel="STRUCTURAL ACCEL"
              value={telemetry.vibration}
              unit="g"
              severity={telemetry.vibration > 3.0 ? 'warning' : 'healthy'}
              normalRange="1.8–2.4"
              className="col-span-2"
              sparklineData={history.slice(-10).map((h) => h.vibration)}
            />
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ROW 2: TELEMETRY STREAM CHARTS (RPM, EGT, VIBRATION)                      */}
      {/* ========================================================================= */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#1AD1F5]" />
            <h3 className="text-xs font-mono-tech font-bold uppercase tracking-wider text-[#E6F4FF]">
              REAL-TIME HIGH-RATE TELEMETRY BUS
            </h3>
            <span className="text-[10px] font-mono-tech text-[#526E7E]">
              [SIMULATED 50 Hz ARINC BUFFER]
            </span>
          </div>

          <button
            onClick={() => onNavigate('/telemetry')}
            className="text-xs font-mono-tech text-[#1AD1F5] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>All 8 Sensor Matrix</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          <TelemetryChart
            data={history}
            metricKey="rpm"
            title="RPM / ROTATIONAL LOAD"
            unit="RPM"
            color="#1AD1F5"
            normalMin={2400}
            normalMax={2500}
            height={160}
          />

          <TelemetryChart
            data={history}
            metricKey="egt"
            title="EXHAUST GAS TEMP (EGT)"
            unit="°C"
            color="#FFB834"
            warningMax={730}
            height={160}
          />

          <TelemetryChart
            data={history}
            metricKey="vibration"
            title="BLOCK VIBRATION (RMS)"
            unit="g"
            color="#1AD1F5"
            warningMax={3.0}
            height={160}
          />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ROW 3: AI PREDICTION, FAULT DIAGNOSTICS & MISSION PROFILE                 */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: AI PREDICTION ENGINE */}
        <GlassPanel
          title="AI PROGNOSTICS CORE"
          badge="LSTM CORE"
          badgeColor="cyan"
          className="space-y-3"
        >
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs font-mono-tech">
              <span className="text-[#8BA3B3]">MODEL ARCHITECTURE:</span>
              <span className="text-[#1AD1F5] font-bold">MULTIVARIATE LSTM</span>
            </div>

            <AIConfidenceBar
              label="Anomaly Probability"
              value={telemetry.anomalyProbability}
              thresholdWarning={30}
              thresholdCritical={50}
            />

            <div className="flex items-center justify-between text-xs font-mono-tech py-1 border-y border-[#142F3F]">
              <span className="text-[#8BA3B3]">Degradation Hazard:</span>
              <span className={`font-bold ${telemetry.anomalyProbability > 25 ? 'text-[#FFB834]' : 'text-[#3CE698]'}`}>
                {telemetry.anomalyProbability > 35 ? 'HIGH' : telemetry.anomalyProbability > 25 ? 'ELEVATED' : 'NOMINAL'}
              </span>
            </div>

            <AIConfidenceBar
              label="Failure Probability"
              value={telemetry.failureProbability}
              thresholdWarning={15}
              thresholdCritical={25}
            />

            <div className="flex items-center justify-between text-xs font-mono-tech pt-0.5">
              <span className="text-[#8BA3B3]">REMAINING USEFUL LIFE:</span>
              <span className="text-[#3CE698] font-bold text-sm">{telemetry.rulHours} hrs</span>
            </div>
          </div>

          <div className="pt-2 border-t border-[#142F3F]">
            <button
              onClick={() => onNavigate('/diagnostics')}
              className="w-full text-center py-1.5 rounded bg-[#050E16] hover:bg-[#142F3F] text-[11px] font-mono-tech text-[#1AD1F5] transition-colors cursor-pointer"
            >
              Examine Diagnostic Isolation &gt;&gt;
            </button>
          </div>
        </GlassPanel>

        {/* Card 2: FAULT DIAGNOSTICS */}
        <GlassPanel
          title="FAULT ANNUNCIATION"
          badge="STATUS AUDIT"
          badgeColor={faults.some(f => f.severity !== 'healthy') ? 'amber' : 'green'}
          className="space-y-2.5"
        >
          <div className="space-y-1.5 text-xs font-mono-tech">
            {/* Status Item 1 */}
            <div className="p-2 rounded bg-[#050E16] border border-[#142F3F] flex items-center justify-between">
              <div>
                <span className="text-[#3CE698] font-bold block text-[11px]">SYSTEM NOMINAL</span>
                <span className="text-[9px] text-[#526E7E]">No critical fault detected</span>
              </div>
              <span className="w-1.5 h-1.5 rounded-sm bg-[#3CE698]" />
            </div>

            {/* Status Item 2 */}
            <div className={`p-2 rounded border transition-colors flex items-center justify-between ${
              telemetry.egt > 725
                ? 'bg-[#FFB834]/10 border-[#FFB834]/50'
                : 'bg-[#050E16] border-[#142F3F]'
            }`}>
              <div>
                <span className={`font-bold block text-[11px] ${telemetry.egt > 725 ? 'text-[#FFB834]' : 'text-[#E6F4FF]'}`}>
                  {telemetry.egt > 725 ? 'EGT TREND ELEVATED' : 'COMBUSTION BALANCED'}
                </span>
                <span className="text-[9px] text-[#526E7E]">
                  {telemetry.egt > 725 ? 'Monitor combustion pattern' : 'Exhaust delta within ±5°C'}
                </span>
              </div>
              <span className={`w-1.5 h-1.5 rounded-sm ${telemetry.egt > 725 ? 'bg-[#FFB834]' : 'bg-[#3CE698]'}`} />
            </div>

            {/* Status Item 3 */}
            <div className="p-2 rounded bg-[#050E16] border border-[#142F3F] flex items-center justify-between">
              <div>
                <span className="text-[#3CE698] font-bold block text-[11px]">OIL LUBRICATION OK</span>
                <span className="text-[9px] text-[#526E7E]">4.2 bar gallery @ 92°C</span>
              </div>
              <span className="w-1.5 h-1.5 rounded-sm bg-[#3CE698]" />
            </div>

            {/* Status Item 4 */}
            <div className="p-2 rounded bg-[#050E16] border border-[#142F3F] flex items-center justify-between">
              <div>
                <span className="text-[#3CE698] font-bold block text-[11px]">VIBRATION HARMONIC OK</span>
                <span className="text-[9px] text-[#526E7E]">Peak 2.1g within tolerance</span>
              </div>
              <span className="w-1.5 h-1.5 rounded-sm bg-[#3CE698]" />
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => onNavigate('/diagnostics')}
              className="w-full text-center py-1.5 rounded bg-[#050E16] hover:bg-[#142F3F] text-[11px] font-mono-tech text-[#1AD1F5] transition-colors cursor-pointer"
            >
              Open Diagnostics Matrix &gt;&gt;
            </button>
          </div>
        </GlassPanel>

        {/* Card 3: MISSION PROFILE */}
        <GlassPanel
          title="SORTIE PROFILE"
          badge="ACTIVE"
          badgeColor="cyan"
          className="space-y-2.5"
        >
          <div className="space-y-1.5 text-xs font-mono-tech">
            <div className="flex items-center justify-between p-1.5 bg-[#050E16] rounded border border-[#142F3F]">
              <span className="text-[#526E7E]">UAV CALLSIGN:</span>
              <span className="text-[#1AD1F5] font-bold">{mission.uavId}</span>
            </div>

            <div className="flex items-center justify-between p-1.5 bg-[#050E16] rounded border border-[#142F3F]">
              <span className="text-[#526E7E]">ALTITUDE:</span>
              <span className="text-[#E6F4FF] font-bold">{mission.altitudeFt.toLocaleString()} ft</span>
            </div>

            <div className="flex items-center justify-between p-1.5 bg-[#050E16] rounded border border-[#142F3F]">
              <span className="text-[#526E7E]">ENGINE LOAD:</span>
              <span className="text-[#E6F4FF] font-bold">{mission.engineLoadPct}%</span>
            </div>

            <div className="flex items-center justify-between p-1.5 bg-[#050E16] rounded border border-[#142F3F]">
              <span className="text-[#526E7E]">AMBIENT OAT:</span>
              <span className="text-[#E6F4FF] font-bold">{mission.ambientTempC}°C</span>
            </div>

            <div className="flex items-center justify-between p-1.5 bg-[#050E16] rounded border border-[#142F3F]">
              <span className="text-[#526E7E]">MISSION PHASE:</span>
              <span className="text-[#1AD1F5] font-bold px-1.5 py-0.2 rounded bg-[#1AD1F5]/15">
                {mission.phase}
              </span>
            </div>

            <div className="flex items-center justify-between p-1.5 bg-[#050E16] rounded border border-[#142F3F]">
              <span className="text-[#526E7E]">RELIABILITY:</span>
              <span className="text-[#3CE698] font-bold">{mission.missionReliability}%</span>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => onNavigate('/mission')}
              className="w-full text-center py-1.5 rounded bg-[#050E16] hover:bg-[#142F3F] text-[11px] font-mono-tech text-[#1AD1F5] transition-colors cursor-pointer"
            >
              Adjust Mission Scenarios &gt;&gt;
            </button>
          </div>
        </GlassPanel>
      </div>
    </div>
  );
};
