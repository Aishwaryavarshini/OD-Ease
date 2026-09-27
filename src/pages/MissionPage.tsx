import React from 'react';
import { useTelemetry } from '../context/TelemetryContext';
import { MissionFlightPath } from '../components/mission/MissionFlightPath';
import { SectionHeader } from '../components/common/SectionHeader';
import { 
  Plane, 
  Clock, 
  Fuel, 
  ShieldCheck, 
  Wind, 
  CheckCircle2,
  Info,
  Compass
} from 'lucide-react';

export const MissionPage: React.FC = () => {
  const { mission, telemetry } = useTelemetry();

  // Environmental derating factors
  const altitudeFactor = Math.max(0, (mission.altitudeFt - 10000) / 18000) * 8;
  const tempFactor = Math.max(0, (mission.ambientTempC - 20) / 30) * 6;
  const loadFactor = ((mission.engineLoadPct - 50) / 50) * 10;
  const netDerate = (altitudeFactor + tempFactor + loadFactor).toFixed(1);

  return (
    <div className="space-y-4 select-none">
      <SectionHeader
        badge="SORTIE RELIABILITY & MISSION ASSURANCE // MALE UAV"
        title="MISSION RELIABILITY & OPERATIONAL ENVELOPE"
        subtitle="Propulsion health evaluated continuously against active sortie flight profiles, ambient atmospheric derating, and high-altitude thermal load envelopes."
      />

      {/* Mandatory Simulated Data Banner */}
      <div className="bg-[#050E16] border border-[#142F3F] rounded-lg px-3 py-2 flex items-center justify-between text-xs font-mono-tech">
        <div className="flex items-center gap-2 text-[#8BA3B3]">
          <Info className="w-3.5 h-3.5 text-[#1AD1F5]" />
          <span>SORTIE TELEMETRY:</span>
          <span className="text-[#1AD1F5] font-semibold">SIMULATED / DEMO SORTIE PROFILE</span>
          <span className="hidden sm:inline text-[#526E7E]">• DRDO 180 HP SURVEILLANCE PATROL CONTEXT</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-[#526E7E]">CALLSIGN:</span>
          <span className="text-[#3CE698] font-bold">{mission.uavId}</span>
        </div>
      </div>

      {/* Primary Mission Flight Path Component with Interactive Controls */}
      <MissionFlightPath interactiveControls={true} />

      {/* Sortie Summary & Operational Envelope Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {/* Card 1: Mission Callsign */}
        <div className="aerospace-panel p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-mono-tech text-[#526E7E] uppercase">UAV PLATFORM</span>
            <Plane className="w-4 h-4 text-[#1AD1F5]" />
          </div>
          <div>
            <div className="text-xl font-mono-tech font-bold text-[#E6F4FF]">{mission.uavId}</div>
            <div className="text-[10px] font-mono-tech text-[#1AD1F5]">{mission.missionCode}</div>
          </div>
          <div className="mt-2 pt-1.5 border-t border-[#142F3F] text-[9px] font-mono-tech text-[#526E7E]">
            ENGINE: DRDO/VRDE 180 HP
          </div>
        </div>

        {/* Card 2: Mission Reliability */}
        <div className="aerospace-panel p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-mono-tech text-[#526E7E] uppercase">SORTIE CONFIDENCE</span>
            <ShieldCheck className="w-4 h-4 text-[#3CE698]" />
          </div>
          <div>
            <div className="text-xl font-mono-tech font-bold text-[#3CE698]">
              {mission.missionReliability}%
            </div>
            <div className="text-[10px] font-mono-tech text-[#8BA3B3]">
              MISSION RELIABILITY
            </div>
          </div>
          <div className="mt-2 pt-1.5 border-t border-[#142F3F] text-[9px] font-mono-tech text-[#3CE698] font-semibold">
            STATUS: CLEARED FOR ON-STATION
          </div>
        </div>

        {/* Card 3: Sortie Duration */}
        <div className="aerospace-panel p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-mono-tech text-[#526E7E] uppercase">REMAINING ON STATION</span>
            <Clock className="w-4 h-4 text-[#FFB834]" />
          </div>
          <div>
            <div className="text-xl font-mono-tech font-bold text-[#E6F4FF]">08h 15m</div>
            <div className="text-[10px] font-mono-tech text-[#8BA3B3]">PLANNED: 14h 30m TOTAL</div>
          </div>
          <div className="mt-2 pt-1.5 border-t border-[#142F3F] text-[9px] font-mono-tech text-[#526E7E]">
            FUEL BURN RATE: 11.2 KG/H
          </div>
        </div>

        {/* Card 4: Fuel & RUL Margin */}
        <div className="aerospace-panel p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-mono-tech text-[#526E7E] uppercase">RUL OVERHAUL MARGIN</span>
            <Fuel className="w-4 h-4 text-[#1AD1F5]" />
          </div>
          <div>
            <div className="text-xl font-mono-tech font-bold text-[#1AD1F5]">
              +{telemetry.rulHours}h
            </div>
            <div className="text-[10px] font-mono-tech text-[#8BA3B3]">
              REMAINING USEFUL LIFE
            </div>
          </div>
          <div className="mt-2 pt-1.5 border-t border-[#142F3F] text-[9px] font-mono-tech text-[#3CE698] font-semibold">
            SAFETY RATIO: 29.4x WINDOW
          </div>
        </div>
      </div>

      {/* Environmental Stress & Atmospheric Derating Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Atmospheric Derate Modeling */}
        <div className="lg:col-span-7 aerospace-panel p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#142F3F] text-xs font-mono-tech">
            <div className="flex items-center gap-2">
              <Wind className="w-4 h-4 text-[#1AD1F5]" />
              <span className="font-bold text-[#E6F4FF] uppercase">
                ATMOSPHERIC & THERMAL DERATING MODEL (ISA+16)
              </span>
            </div>
            <span className="text-[9px] text-[#FFB834] bg-[#FFB834]/10 px-2 py-0.5 rounded border border-[#FFB834]/30">
              NET THERMAL DERATE: +{netDerate}%
            </span>
          </div>

          <p className="text-[11px] text-[#8BA3B3] leading-relaxed">
            At altitude, reduced air density reduces turbocharger compressor choke margin while higher ambient temperatures limit intercooler heat dissipation. AeroTwin computes thermodynamic derate penalties dynamically.
          </p>

          <div className="space-y-2 pt-1 text-xs font-mono-tech">
            <div className="p-2.5 rounded bg-[#050E16] border border-[#142F3F] flex justify-between items-center">
              <div>
                <span className="text-[#E6F4FF] text-[11px] font-semibold block">Pressure Altitude Derate</span>
                <span className="text-[9px] text-[#526E7E]">MSL to {mission.altitudeFt.toLocaleString()} ft density shift</span>
              </div>
              <span className="text-xs font-bold text-[#1AD1F5]">+{altitudeFactor.toFixed(1)}% Stress</span>
            </div>

            <div className="p-2.5 rounded bg-[#050E16] border border-[#142F3F] flex justify-between items-center">
              <div>
                <span className="text-[#E6F4FF] text-[11px] font-semibold block">Ambient Temperature Penalty (OAT)</span>
                <span className="text-[9px] text-[#526E7E]">{mission.ambientTempC}°C (ISA+16 standard atmosphere delta)</span>
              </div>
              <span className="text-xs font-bold text-[#FFB834]">+{tempFactor.toFixed(1)}% Thermal</span>
            </div>

            <div className="p-2.5 rounded bg-[#050E16] border border-[#142F3F] flex justify-between items-center">
              <div>
                <span className="text-[#E6F4FF] text-[11px] font-semibold block">Continuous Propulsion Load Index</span>
                <span className="text-[9px] text-[#526E7E]">{mission.engineLoadPct}% Rated Continuous Output</span>
              </div>
              <span className="text-xs font-bold text-[#3CE698]">+{loadFactor.toFixed(1)}% Load</span>
            </div>
          </div>
        </div>

        {/* Right: Mission Decision Advisory */}
        <div className="lg:col-span-5 aerospace-panel p-4 space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-[#142F3F] text-xs font-mono-tech">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#3CE698]" />
                <span className="font-bold text-[#E6F4FF] uppercase">
                  SORTIE GO / NO-GO ADVISORY
                </span>
              </div>
              <span className="text-[9px] text-[#3CE698] font-bold px-1.5 py-0.2 rounded bg-[#3CE698]/10 border border-[#3CE698]/30">
                GO STATUS
              </span>
            </div>

            <div className="my-3 p-3 rounded-lg bg-[#3CE698]/10 border border-[#3CE698]/30 text-xs font-mono-tech space-y-1.5">
              <div className="flex items-center gap-2 text-[#3CE698] font-bold text-xs">
                <CheckCircle2 className="w-4 h-4" />
                <span>CLEARED FOR FULL SORTIE OBJECTIVE</span>
              </div>
              <p className="text-[10px] text-[#8BA3B3] leading-normal">
                Propulsion health index ({telemetry.health.toFixed(1)}%) and remaining useful life ({telemetry.rulHours}h) provide 29.4× the operational endurance required for the 8.25h mission window.
              </p>
            </div>

            <div className="space-y-1.5 text-xs font-mono-tech text-[#8BA3B3]">
              <div className="flex justify-between p-2 bg-[#050E16] rounded border border-[#142F3F] text-[11px]">
                <span className="text-[#526E7E]">CRITICAL ABORT THRESHOLD:</span>
                <span className="text-[#FF4D61] font-bold">&lt; 70% HEALTH</span>
              </div>
              <div className="flex justify-between p-2 bg-[#050E16] rounded border border-[#142F3F] text-[11px]">
                <span className="text-[#526E7E]">LOITER SERVICE CEILING:</span>
                <span className="text-[#E6F4FF] font-bold">28,000 FT</span>
              </div>
              <div className="flex justify-between p-2 bg-[#050E16] rounded border border-[#142F3F] text-[11px]">
                <span className="text-[#526E7E]">CONTINGENCY RECOVERY AIRFIELD:</span>
                <span className="text-[#1AD1F5] font-bold">BASE DELTA-4 (140 NM)</span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-[#142F3F] text-[9px] font-mono-tech text-[#526E7E] text-center">
            AUTONOMOUS PROGNOSTICS VERIFIED // ARINC-429 LINK SECURED
          </div>
        </div>
      </div>
    </div>
  );
};
