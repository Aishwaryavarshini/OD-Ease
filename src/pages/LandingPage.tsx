import React from 'react';
import { PageRoute } from '../types';
import { useTelemetry } from '../context/TelemetryContext';
import { DigitalTwinEngine } from '../components/engine/DigitalTwinEngine';
import { MissionFlightPath } from '../components/mission/MissionFlightPath';
import { TelemetryChart } from '../components/charts/TelemetryChart';
import { Button } from '../components/common/Button';
import { GlassPanel } from '../components/common/GlassPanel';
import { HealthGauge } from '../components/common/HealthGauge';
import { 
  Cpu, 
  Activity, 
  BrainCircuit, 
  ShieldCheck, 
  ArrowRight, 
  Radio, 
  Database, 
  AlertTriangle, 
  Clock, 
  TrendingUp, 
  Layers, 
  Plane,
  ChevronRight,
  Zap,
  Gauge
} from 'lucide-react';

interface LandingPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const { telemetry, history } = useTelemetry();

  const processStages = [
    { label: 'PHYSICAL ENGINE', sub: 'DRDO 180 HP UAV Diesel', icon: <Cpu className="w-5 h-5 text-[#19C7F1]" /> },
    { label: 'SENSOR TELEMETRY', sub: 'Multi-channel 50Hz Stream', icon: <Radio className="w-5 h-5 text-[#19C7F1]" /> },
    { label: 'DIGITAL TWIN', sub: 'Thermodynamic Replica', icon: <Layers className="w-5 h-5 text-[#19C7F1]" /> },
    { label: 'LSTM TEMPORAL ANALYSIS', sub: 'Multivariate AI Core', icon: <BrainCircuit className="w-5 h-5 text-[#19C7F1]" /> },
    { label: 'FAULT PREDICTION', sub: 'Pre-threshold Signatures', icon: <AlertTriangle className="w-5 h-5 text-[#FFC857]" /> },
    { label: 'RUL ESTIMATION', sub: 'Weibull / LSTM Degradation', icon: <Clock className="w-5 h-5 text-[#19C7F1]" /> },
    { label: 'MISSION RELIABILITY', sub: 'Dynamic Flight Confidence', icon: <ShieldCheck className="w-5 h-5 text-[#42DFA0]" /> },
  ];

  const aiTimeline = [
    { phase: 'NORMAL BEHAVIOUR', time: 'T - 60h', desc: 'Thermodynamic baseline aligned with digital twin twin-state.', color: 'text-[#42DFA0]', border: 'border-[#42DFA0]' },
    { phase: 'DEVIATION', time: 'T - 35h', desc: 'Subtle EGT cross-cylinder temperature gradient shifts by +7°C.', color: 'text-[#19C7F1]', border: 'border-[#19C7F1]' },
    { phase: 'ANOMALY', time: 'T - 18h', desc: 'LSTM temporal autoencoder flags reconstruction loss anomaly.', color: 'text-[#FFC857]', border: 'border-[#FFC857]' },
    { phase: 'DEGRADATION', time: 'T - 6h', desc: 'Accelerated thermal stress trend detected in combustion chamber.', color: 'text-[#FFC857]', border: 'border-[#FFC857]' },
    { phase: 'PREDICTED FAULT', time: 'T + 0h', desc: 'Injector deposit risk flagged before critical threshold violation.', color: 'text-[#FF5368]', border: 'border-[#FF5368]' },
  ];

  const impactMetrics = [
    { value: '95%', title: 'Accurate Engine Health Monitoring', desc: 'Real-time synchronization with high-fidelity thermodynamic model' },
    { value: '40%', title: 'Prior Engine Failure Prediction', desc: 'Pre-emptive anomaly alerts hours before critical limits are breached' },
    { value: '30%', title: 'Predictive Maintenance Optimization', desc: 'Transition from fixed TBO to condition-based engine overhauls' },
    { value: '20%', title: 'Improved Engine Performance', desc: 'Continuous boost & combustion trimming for altitude extremes' },
    { value: '50%', title: 'Better Fault Diagnosis Speed', desc: 'Automated sensor correlation pinpoints isolated failing subsystems' },
    { value: '50%', title: 'Reduced Unscheduled Grounding', desc: 'Increased mission readiness across MALE UAV operational fleets' },
  ];

  return (
    <div className="relative min-h-screen pt-16 pb-12 overflow-hidden select-none">
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-[#19C7F1]/5 blur-[120px] rounded-full pointer-events-none" />

      {/* ========================================================================= */}
      {/* 1. HERO SECTION                                                           */}
      {/* ========================================================================= */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-10">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B1D28] border border-[#19C7F1]/40 shadow-[0_0_15px_rgba(25,199,241,0.2)]">
            <span className="w-2 h-2 rounded-full bg-[#19C7F1] animate-ping" />
            <span className="text-[11px] font-mono-tech tracking-widest uppercase text-[#19C7F1] font-semibold">
              3D CAD DIGITAL TWIN // DRDO/VRDE 180 HP TARGET
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl font-mono-tech font-bold tracking-tight text-[#E8F5FF] leading-tight uppercase">
            ENGINE INTELLIGENCE,
            <br />
            <span className="text-[#19C7F1]">BUILT FOR THE MISSION.</span>
          </h1>

          {/* Subheading */}
          <p className="text-sm sm:text-base text-[#78919F] font-sans max-w-2xl mx-auto leading-relaxed">
            AI-powered digital twin technology for real-time UAV engine health monitoring, predictive diagnostics, degradation forecasting and mission reliability.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Button
              variant="primary"
              size="lg"
              icon={<ArrowRight className="w-4 h-4" />}
              iconPosition="right"
              onClick={() => onNavigate('/dashboard')}
              glow
            >
              Launch Command Center
            </Button>
            <Button
              variant="secondary"
              size="lg"
              icon={<Cpu className="w-4 h-4 text-[#19C7F1]" />}
              onClick={() => onNavigate('/digital-twin')}
            >
              Explore 3D Digital Twin
            </Button>
          </div>
        </div>

        {/* HERO VISUAL: TECHNICAL ENGINE DIGITAL TWIN */}
        <div className="relative max-w-5xl mx-auto aerospace-panel rounded-xl overflow-hidden shadow-2xl border border-[#173342]">
          <DigitalTwinEngine interactive={true} showLabels={true} />

          {/* HERO STATUS BAR UNDER ENGINE */}
          <div className="grid grid-cols-2 sm:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x divide-[#173342] border-t border-[#173342] bg-[#071019] text-center font-mono-tech py-3 px-2">
            <div className="p-2 flex flex-col items-center">
              <span className="text-[10px] text-[#78919F] uppercase tracking-wider">DIGITAL TWIN SYNC</span>
              <span className="text-lg sm:text-xl font-bold text-[#19C7F1]">{telemetry.syncAccuracy}%</span>
              <span className="text-[9px] text-[#506C79]">DEMO VALUE</span>
            </div>

            <div className="p-2 flex flex-col items-center">
              <span className="text-[10px] text-[#78919F] uppercase tracking-wider">ENGINE HEALTH</span>
              <span className="text-lg sm:text-xl font-bold text-[#42DFA0]">{telemetry.health}%</span>
              <span className="text-[9px] text-[#506C79]">OPTIMAL</span>
            </div>

            <div className="p-2 flex flex-col items-center">
              <span className="text-[10px] text-[#78919F] uppercase tracking-wider">ANOMALY RISK</span>
              <span className="text-lg sm:text-xl font-bold text-[#19C7F1]">{telemetry.anomalyProbability}%</span>
              <span className="text-[9px] text-[#506C79]">LOW</span>
            </div>

            <div className="p-2 flex flex-col items-center">
              <span className="text-[10px] text-[#78919F] uppercase tracking-wider">RUL</span>
              <span className="text-lg sm:text-xl font-bold text-[#E8F5FF]">{telemetry.rulHours} hrs</span>
              <span className="text-[9px] text-[#506C79]">ESTIMATED</span>
            </div>

            <div className="p-2 flex flex-col items-center col-span-2 sm:col-span-1">
              <span className="text-[10px] text-[#78919F] uppercase tracking-wider">MISSION RELIABILITY</span>
              <span className="text-lg sm:text-xl font-bold text-[#42DFA0]">{telemetry.missionReliability}%</span>
              <span className="text-[9px] text-[#506C79]">PREDICTED</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. PROBLEM / SOLUTION SECTION                                             */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-[#173342]/60">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[11px] font-mono-tech tracking-widest text-[#19C7F1] uppercase font-semibold block mb-2">
            INTELLIGENCE PIPELINE
          </span>
          <h2 className="text-2xl sm:text-3xl font-mono-tech font-bold text-[#E8F5FF] uppercase">
            FROM RAW TELEMETRY TO ENGINE INTELLIGENCE
          </h2>
          <p className="text-xs sm:text-sm text-[#78919F] mt-2">
            Multi-stage autonomous pipeline transforming high-frequency sensor streams into actionable aerospace mission confidence.
          </p>
        </div>

        {/* Horizontal Process Stepper */}
        <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
          {processStages.map((stage, idx) => (
            <div
              key={stage.label}
              className="relative bg-[#0B1D28] border border-[#173342] rounded-lg p-3.5 flex flex-col items-center text-center group hover:border-[#19C7F1]/60 transition-all shadow-md"
            >
              <div className="w-10 h-10 rounded-full bg-[#071019] border border-[#173342] flex items-center justify-center mb-2.5 group-hover:border-[#19C7F1] group-hover:shadow-[0_0_10px_rgba(25,199,241,0.3)] transition-all">
                {stage.icon}
              </div>
              <span className="text-[10px] font-mono-tech text-[#506C79] font-bold mb-1">
                STAGE 0{idx + 1}
              </span>
              <h3 className="text-xs font-mono-tech font-bold text-[#E8F5FF] uppercase mb-1">
                {stage.label}
              </h3>
              <p className="text-[10px] text-[#78919F] font-mono-tech">
                {stage.sub}
              </p>

              {/* Connecting chevron on desktop */}
              {idx < processStages.length - 1 && (
                <div className="hidden md:block absolute -right-2 top-1/2 -translate-y-1/2 z-10 text-[#19C7F1]/70">
                  <ChevronRight className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. DIGITAL TWIN SECTION                                                   */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-[#173342]/60">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: Digital Twin Representation */}
          <div className="lg:col-span-6 bg-[#071019] border border-[#173342] rounded-xl p-4 relative shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#173342] text-xs font-mono-tech mb-3">
              <span className="text-[#19C7F1] font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-4 h-4" />
                TWIN SYNCHRONIZATION MATRIX
              </span>
              <span className="text-[#42DFA0] bg-[#42DFA0]/10 px-2 py-0.5 rounded border border-[#42DFA0]/30 font-bold">
                98.7% SYNC
              </span>
            </div>

            {/* Side-by-side comparison table */}
            <div className="space-y-2 text-xs font-mono-tech">
              <div className="grid grid-cols-3 text-[10px] text-[#506C79] uppercase px-2 py-1 border-b border-[#173342]">
                <span>PARAMETER</span>
                <span className="text-center text-[#78919F]">PHYSICAL ENGINE</span>
                <span className="text-right text-[#19C7F1]">DIGITAL TWIN</span>
              </div>

              {[
                { param: 'RPM', phys: `${telemetry.rpm}`, twin: `${telemetry.rpm + 2}`, unit: 'RPM' },
                { param: 'EGT', phys: `${telemetry.egt}°C`, twin: `${telemetry.egt - 1}°C`, unit: '°C' },
                { param: 'CHT', phys: `${telemetry.cht}°C`, twin: `${telemetry.cht}°C`, unit: '°C' },
                { param: 'Oil Pressure', phys: `${telemetry.oilPressure} bar`, twin: `${telemetry.oilPressure} bar`, unit: 'bar' },
                { param: 'Vibration', phys: `${telemetry.vibration}g`, twin: `${(telemetry.vibration * 0.98).toFixed(1)}g`, unit: 'g' },
              ].map((row) => (
                <div key={row.param} className="grid grid-cols-3 items-center bg-[#0B1D28] p-2 rounded border border-[#173342]">
                  <span className="text-[#E8F5FF] font-semibold">{row.param}</span>
                  <span className="text-center font-bold text-[#78919F]">{row.phys}</span>
                  <span className="text-right font-bold text-[#19C7F1]">{row.twin}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 p-2.5 rounded bg-[#0B1D28]/60 border border-[#173342] flex items-center justify-between text-[11px] font-mono-tech text-[#78919F]">
              <span>SAMPLE LATENCY: 24ms</span>
              <span className="text-[#42DFA0]">CONVERGENCE: STABLE</span>
            </div>
          </div>

          {/* Right: Narrative */}
          <div className="lg:col-span-6 space-y-4">
            <span className="text-[11px] font-mono-tech tracking-widest text-[#19C7F1] uppercase font-semibold">
              SYNCHRONIZED CO-SIMULATION
            </span>
            <h2 className="text-3xl sm:text-4xl font-mono-tech font-bold text-[#E8F5FF] leading-tight uppercase">
              ONE ENGINE.
              <br />
              TWO REALITIES.
              <br />
              ONE SOURCE OF TRUTH.
            </h2>
            <p className="text-sm text-[#78919F] font-sans leading-relaxed">
              Continuously synchronize the physical engine with its virtual counterpart. AeroTwin uses non-linear thermodynamic equations coupled with empirical sensor calibration to model in-cylinder combustion, heat dissipation, and mechanical wear in real time.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded bg-[#19C7F1]/15 border border-[#19C7F1]/30 flex items-center justify-center shrink-0 mt-0.5">
                  <Activity className="w-3.5 h-3.5 text-[#19C7F1]" />
                </div>
                <div>
                  <h4 className="text-xs font-mono-tech font-bold text-[#E8F5FF] uppercase">Thermodynamic State Replication</h4>
                  <p className="text-xs text-[#78919F]">Models real-time combustion chamber pressure and exhaust heat dissipation.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded bg-[#19C7F1]/15 border border-[#19C7F1]/30 flex items-center justify-center shrink-0 mt-0.5">
                  <BrainCircuit className="w-3.5 h-3.5 text-[#19C7F1]" />
                </div>
                <div>
                  <h4 className="text-xs font-mono-tech font-bold text-[#E8F5FF] uppercase">Dynamic Residual Generation</h4>
                  <p className="text-xs text-[#78919F]">Discrepancies between twin and engine indicate wear signatures rather than sensor noise.</p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Button
                variant="outline"
                size="md"
                onClick={() => onNavigate('/digital-twin')}
                icon={<ArrowRight className="w-4 h-4" />}
                iconPosition="right"
              >
                Inspect Twin Architecture
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. AI SECTION                                                             */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-[#173342]/60">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[11px] font-mono-tech tracking-widest text-[#19C7F1] uppercase font-semibold block mb-2">
            LSTM TEMPORAL INTELLIGENCE
          </span>
          <h2 className="text-2xl sm:text-3xl font-mono-tech font-bold text-[#E8F5FF] uppercase">
            THE ENGINE LEARNS ITS OWN NORMAL.
          </h2>
          <p className="text-xs sm:text-sm text-[#78919F] mt-2">
            LSTM-based multivariate temporal analysis learns complex interdependencies across RPM, MAP, CHT, EGT, oil pressure, and vibration to isolate anomalies before they manifest as failures.
          </p>
          <div className="mt-2 text-[10px] font-mono-tech text-[#506C79]">
            LSTM-BASED MULTIVARIATE TEMPORAL ANALYSIS // SIMULATED ARCHITECTURE
          </div>
        </div>

        {/* Animated Timeline Graph */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {aiTimeline.map((item, idx) => (
            <div
              key={item.phase}
              className={`bg-[#0B1D28] border ${item.border}/40 rounded-lg p-3.5 flex flex-col justify-between hover:border-[#19C7F1] transition-all relative`}
            >
              <div>
                <div className="flex items-center justify-between text-[10px] font-mono-tech mb-2">
                  <span className="text-[#506C79]">PHASE 0{idx + 1}</span>
                  <span className="px-1.5 py-0.5 rounded bg-[#071019] text-[#78919F] border border-[#173342]">
                    {item.time}
                  </span>
                </div>
                <h3 className={`text-xs font-mono-tech font-bold uppercase mb-2 ${item.color}`}>
                  {item.phase}
                </h3>
                <p className="text-[11px] text-[#78919F] leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-[#173342]/60 flex items-center justify-between text-[9px] font-mono-tech text-[#506C79]">
                <span>CONFIDENCE</span>
                <span className="text-[#E8F5FF]">98.2%</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. PREDICTIVE MAINTENANCE SECTION                                         */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-[#173342]/60">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-[11px] font-mono-tech tracking-widest text-[#19C7F1] uppercase font-semibold block mb-2">
            MISSION ASSURANCE
          </span>
          <h2 className="text-2xl sm:text-3xl font-mono-tech font-bold text-[#E8F5FF] uppercase">
            PREDICTIVE MAINTENANCE & RUL
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <GlassPanel
            title="EARLY FAULT DETECTION"
            badge="LSTM AUTOENCODER"
            badgeColor="cyan"
            glow
            className="flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded bg-[#19C7F1]/10 border border-[#19C7F1]/30 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-[#19C7F1]" />
              </div>
              <p className="text-xs text-[#78919F] leading-relaxed">
                Detect abnormal engine behaviour before critical threshold violations. Multivariate cross-attention isolates thermal runaway and combustion imbalances hours prior to traditional analog cockpit annunciators.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#173342] flex items-center justify-between text-xs font-mono-tech">
              <span className="text-[#506C79]">SENSITIVITY:</span>
              <span className="text-[#42DFA0] font-bold">99.1% RECALL</span>
            </div>
          </GlassPanel>

          {/* Card 2 */}
          <GlassPanel
            title="PREDICTIVE MAINTENANCE"
            badge="CONDITION-BASED"
            badgeColor="cyan"
            glow
            className="flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded bg-[#19C7F1]/10 border border-[#19C7F1]/30 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-[#19C7F1]" />
              </div>
              <p className="text-xs text-[#78919F] leading-relaxed">
                Use engine health trends to determine when maintenance is required rather than relying strictly on fixed flight hours. Mitigates unscheduled groundings and extends propulsion system lifetime.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#173342] flex items-center justify-between text-xs font-mono-tech">
              <span className="text-[#506C79]">TBO EXTENSION:</span>
              <span className="text-[#19C7F1] font-bold">+28% UTILIZATION</span>
            </div>
          </GlassPanel>

          {/* Card 3 */}
          <GlassPanel
            title="REMAINING USEFUL LIFE"
            badge="WEIBULL-LSTM"
            badgeColor="cyan"
            glow
            className="flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded bg-[#19C7F1]/10 border border-[#19C7F1]/30 flex items-center justify-center">
                <Clock className="w-5 h-5 text-[#19C7F1]" />
              </div>
              <p className="text-xs text-[#78919F] leading-relaxed">
                Estimate degradation and remaining engine life with statistical confidence bounds. Operators can commit UAV assets to high-endurance sorties with verified propulsion reliability.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#173342] flex items-center justify-between text-xs font-mono-tech">
              <span className="text-[#506C79]">CURRENT RUL:</span>
              <span className="text-[#42DFA0] font-bold">{telemetry.rulHours} OPERATING HRS</span>
            </div>
          </GlassPanel>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. MISSION-AWARE SECTION                                                  */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-[#173342]/60">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-[11px] font-mono-tech tracking-widest text-[#19C7F1] uppercase font-semibold block mb-2">
            MISSION CONTEXT ENGINE
          </span>
          <h2 className="text-2xl sm:text-3xl font-mono-tech font-bold text-[#E8F5FF] uppercase">
            HEALTH IS ONLY HALF THE STORY.
          </h2>
          <p className="text-xs sm:text-sm text-[#78919F] mt-2">
            Understand engine reliability in the context of the mission. Atmospheric pressure, high-altitude ambient temperatures, and aggressive climb profiles dynamically reshape engine risk envelopes.
          </p>
        </div>

        {/* Flight path visualization with interactive controls */}
        <MissionFlightPath interactiveControls={true} />
      </section>

      {/* ========================================================================= */}
      {/* 7. LIVE COMMAND CENTER PREVIEW                                            */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-[#173342]/60">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-[11px] font-mono-tech tracking-widest text-[#19C7F1] uppercase font-semibold block">
              REAL-TIME AVIONICS DASHBOARD
            </span>
            <h2 className="text-2xl sm:text-3xl font-mono-tech font-bold text-[#E8F5FF] uppercase">
              COMMAND CENTER PREVIEW
            </h2>
          </div>

          <Button
            variant="primary"
            size="md"
            icon={<ArrowRight className="w-4 h-4" />}
            iconPosition="right"
            onClick={() => onNavigate('/dashboard')}
            glow
          >
            ENTER COMMAND CENTER
          </Button>
        </div>

        {/* Preview Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 bg-[#071019] p-6 rounded-xl border border-[#173342] shadow-2xl">
          {/* Gauge & Main stats */}
          <div className="flex flex-col items-center justify-center p-4 bg-[#0B1D28] rounded-lg border border-[#173342]">
            <HealthGauge value={telemetry.health} size={190} />
            <div className="grid grid-cols-2 gap-3 w-full mt-4 pt-3 border-t border-[#173342] text-xs font-mono-tech text-center">
              <div>
                <span className="text-[10px] text-[#78919F] block">ANOMALY RISK</span>
                <span className="text-base font-bold text-[#19C7F1]">{telemetry.anomalyProbability}%</span>
              </div>
              <div>
                <span className="text-[10px] text-[#78919F] block">MISSION RELIABILITY</span>
                <span className="text-base font-bold text-[#42DFA0]">{telemetry.missionReliability}%</span>
              </div>
            </div>
          </div>

          {/* Real-time Telemetry Mini Grid */}
          <div className="space-y-3">
            <TelemetryChart
              data={history}
              metricKey="rpm"
              title="RPM / LOAD DYNAMICS"
              unit="RPM"
              color="#19C7F1"
              height={125}
            />
            <TelemetryChart
              data={history}
              metricKey="egt"
              title="EGT COMBUSTION EXHAUST"
              unit="°C"
              color="#FFC857"
              warningMax={730}
              height={125}
            />
          </div>

          {/* Vibration and Engine Parameters */}
          <div className="space-y-3">
            <TelemetryChart
              data={history}
              metricKey="vibration"
              title="TRI-AXIAL VIBRATION"
              unit="g"
              color="#0EA5E9"
              warningMax={3.0}
              height={125}
            />
            <div className="bg-[#0B1D28] p-3 rounded-lg border border-[#173342] text-xs font-mono-tech space-y-2">
              <div className="flex justify-between text-[#78919F]">
                <span>OIL PRESSURE:</span>
                <span className="text-[#E8F5FF] font-bold">{telemetry.oilPressure} bar</span>
              </div>
              <div className="flex justify-between text-[#78919F]">
                <span>CHT TEMPERATURE:</span>
                <span className="text-[#E8F5FF] font-bold">{telemetry.cht}°C</span>
              </div>
              <div className="flex justify-between text-[#78919F]">
                <span>ESTIMATED RUL:</span>
                <span className="text-[#42DFA0] font-bold">{telemetry.rulHours} hrs</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. IMPACT SECTION                                                         */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-[#173342]/60">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-[11px] font-mono-tech tracking-widest text-[#19C7F1] uppercase font-semibold block mb-2">
            QUANTITATIVE BENCHMARKS
          </span>
          <h2 className="text-2xl sm:text-3xl font-mono-tech font-bold text-[#E8F5FF] uppercase">
            PROJECTED SYSTEM IMPACT
          </h2>
          <div className="mt-2 text-[10px] font-mono-tech text-[#506C79] uppercase">
            PROJECTED / DEMONSTRATION IMPACT (PROTOTYPE EVALUATION)
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {impactMetrics.map((card) => (
            <div
              key={card.title}
              className="bg-[#0B1D28] border border-[#173342] rounded-lg p-5 flex flex-col justify-between hover:border-[#19C7F1]/50 transition-all group"
            >
              <div>
                <span className="text-3xl sm:text-4xl font-mono-tech font-bold text-[#19C7F1] group-hover:text-[#42DFA0] transition-colors block mb-1">
                  {card.value}
                </span>
                <h3 className="text-xs font-mono-tech font-bold text-[#E8F5FF] uppercase mb-2">
                  {card.title}
                </h3>
                <p className="text-xs text-[#78919F] leading-relaxed">
                  {card.desc}
                </p>
              </div>

              <div className="mt-4 pt-2 border-t border-[#173342]/60 text-[9px] font-mono-tech text-[#506C79]">
                DRDO 180 HP ARCHITECTURE
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. FINAL CTA                                                              */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-[#173342]/60 text-center">
        <div className="max-w-3xl mx-auto space-y-5">
          <span className="text-[11px] font-mono-tech tracking-widest text-[#19C7F1] uppercase font-semibold block">
            OPERATIONAL READINESS
          </span>
          <h2 className="text-3xl sm:text-5xl font-mono-tech font-bold text-[#E8F5FF] uppercase leading-tight">
            TURN ENGINE DATA
            <br />
            <span className="text-[#19C7F1]">INTO MISSION CONFIDENCE.</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#78919F] max-w-xl mx-auto leading-relaxed">
            Experience real-time telemetry processing, multivariate LSTM degradation forecasting, and digital twin synchronization designed for next-generation MALE UAV engines.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Button
              variant="primary"
              size="lg"
              icon={<ArrowRight className="w-4 h-4" />}
              iconPosition="right"
              onClick={() => onNavigate('/dashboard')}
              glow
            >
              Launch AeroTwin
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => onNavigate('/digital-twin')}
            >
              View System Architecture
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};
