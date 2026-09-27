import React from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import { useTheme } from '../../context/ThemeContext';
import { MissionPhase } from '../../types';
import { Plane, Compass, ArrowUp, Flame, Wind, CheckCircle2 } from 'lucide-react';

interface MissionFlightPathProps {
  interactiveControls?: boolean;
  className?: string;
}

export const MissionFlightPath: React.FC<MissionFlightPathProps> = ({
  interactiveControls = true,
  className = '',
}) => {
  const { mission, updateMissionParams } = useTelemetry();
  const { isLight } = useTheme();

  const phases: {
    phase: MissionPhase;
    label: string;
    wpCode: string;
    altFt: number;
    loadPct: number;
    tasKt: number;
    desc: string;
  }[] = [
    { phase: 'TAKEOFF', label: 'Takeoff / Egress', wpCode: 'WP-01 EGRESS', altFt: 2500, loadPct: 95, tasKt: 85, desc: 'Maximum boost & thermal loading' },
    { phase: 'CLIMB', label: 'Climb Corridor', wpCode: 'WP-02 CLIMB (FL120)', altFt: 12000, loadPct: 88, tasKt: 110, desc: 'Continuous climb power setting' },
    { phase: 'CRUISE', label: 'Transit En-Route', wpCode: 'WP-03 CRUISE (FL180)', altFt: 18000, loadPct: 72, tasKt: 135, desc: 'Steady-state high-altitude cruise' },
    { phase: 'LOITER', label: 'Target Surveillance', wpCode: 'WP-04 ORBIT (FL220)', altFt: 22000, loadPct: 65, tasKt: 95, desc: 'Fuel economy endurance orbit' },
    { phase: 'RETURN', label: 'Descent / Ingress', wpCode: 'WP-05 INGRESS', altFt: 4500, loadPct: 55, tasKt: 120, desc: 'Controlled deceleration approach' },
  ];

  const currentPhaseIndex = phases.findIndex((p) => p.phase === mission.phase);

  return (
    <div className={`relative bg-[#050E16] border border-[#142F3F] rounded-lg p-4 ${className}`}>
      {/* Precision Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2.5 border-b border-[#142F3F] text-xs font-mono-tech">
        <div className="flex items-center gap-2">
          <Plane className="w-4 h-4 text-[#1AD1F5]" />
          <span className="font-bold text-[#E6F4FF] uppercase tracking-wider">
            SORTIE FLIGHT PROFILE: {mission.uavId}
          </span>
          <span className="text-[#526E7E]">[{mission.missionCode}]</span>
          <span className="hidden md:inline-block text-[9px] px-1.5 py-0.5 rounded bg-[#08151F] text-[#8BA3B3] border border-[#142F3F]">
            MALE UAV AVIONICS
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-baseline gap-1.5">
            <span className="text-[10px] text-[#8BA3B3]">SORTIE RELIABILITY:</span>
            <span className="text-base font-bold text-[#3CE698]">{mission.missionReliability}%</span>
          </div>
          <span className="text-[9px] px-2 py-0.5 rounded border border-[#1AD1F5]/40 text-[#1AD1F5] bg-[#1AD1F5]/10 font-bold">
            ACTIVE: {mission.phase}
          </span>
        </div>
      </div>

      {/* Flight Path SVG Canvas */}
      <div className="relative w-full aspect-[800/220] my-3 overflow-hidden select-none">
        <svg viewBox="0 0 800 220" className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="flightGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1AD1F5" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#1AD1F5" stopOpacity="0.0" />
            </linearGradient>

            <pattern id="flightGrid" width="40" height="20" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 20" fill="none" stroke={isLight ? '#E2E8F0' : '#102534'} strokeWidth="0.5" strokeDasharray="1 3" />
            </pattern>
          </defs>

          {/* Coordinate Reticle Background */}
          <rect x="60" y="15" width="700" height="165" fill="url(#flightGrid)" />

          {/* Altitude Reference Gridlines */}
          {[25000, 20000, 15000, 10000, 5000, 0].map((alt, idx) => {
            const y = 20 + idx * 32;
            return (
              <g key={alt}>
                <line x1="60" y1={y} x2="760" y2={y} stroke={isLight ? '#CBD5E1' : '#142F3F'} strokeWidth="0.75" strokeDasharray="4 4" opacity={isLight ? '0.8' : '0.6'} />
                <text x="52" y={y + 3} fill={isLight ? '#64748B' : '#526E7E'} fontSize="9" textAnchor="end" fontFamily="monospace">
                  {(alt / 1000).toFixed(0)}k ft
                </text>
              </g>
            );
          })}

          {/* Flight Trajectory Underlay Gradient Polygon */}
          <path
            d="M 80 180 L 80 170 C 140 160 170 120 220 110 C 280 100 340 70 400 70 C 470 70 520 50 580 50 C 640 50 690 120 740 160 L 740 180 Z"
            fill="url(#flightGrad)"
          />

          {/* Primary Trajectory Flight Corridor Vector */}
          <path
            d="M 80 170 C 140 160 170 120 220 110 C 280 100 340 70 400 70 C 470 70 520 50 580 50 C 640 50 690 120 740 160"
            fill="none"
            stroke="#1AD1F5"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Waypoints for each sortie leg */}
          {[
            { x: 80, y: 170, phase: 'TAKEOFF', label: 'WP-01 EGRESS' },
            { x: 220, y: 110, phase: 'CLIMB', label: 'WP-02 CLIMB' },
            { x: 400, y: 70, phase: 'CRUISE', label: 'WP-03 CRUISE' },
            { x: 580, y: 50, phase: 'LOITER', label: 'WP-04 ORBIT' },
            { x: 740, y: 160, phase: 'RETURN', label: 'WP-05 INGRESS' },
          ].map((wp, idx) => {
            const isCurrent = wp.phase === mission.phase;
            const isPast = idx <= currentPhaseIndex;

            return (
              <g
                key={wp.phase}
                className="cursor-pointer"
                onClick={() => {
                  const target = phases.find((p) => p.phase === wp.phase);
                  if (target) {
                    updateMissionParams({
                      phase: target.phase,
                      altitudeFt: target.altFt,
                      engineLoadPct: target.loadPct,
                    });
                  }
                }}
              >
                {/* Vertical Altitude Drop Line */}
                <line x1={wp.x} y1={wp.y} x2={wp.x} y2="180" stroke="#142F3F" strokeWidth="1" strokeDasharray="3 3" />

                {/* Waypoint CAD Reticle */}
                <circle
                  cx={wp.x}
                  cy={wp.y}
                  r={isCurrent ? '6' : '3.5'}
                  fill={isCurrent ? '#3CE698' : isPast ? '#1AD1F5' : '#0B1D28'}
                  stroke={isCurrent ? '#050E16' : '#142F3F'}
                  strokeWidth="1.5"
                />

                {isCurrent && (
                  <circle
                    cx={wp.x}
                    cy={wp.y}
                    r="10"
                    fill="none"
                    stroke="#3CE698"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                  />
                )}

                {/* Waypoint Callout Label */}
                <text
                  x={wp.x}
                  y={wp.y - 10}
                  fill={isCurrent ? '#3CE698' : '#8BA3B3'}
                  fontSize="9"
                  fontWeight={isCurrent ? 'bold' : 'normal'}
                  textAnchor="middle"
                  fontFamily="monospace"
                >
                  {wp.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Environmental & Flight Variables Slider Console */}
      {interactiveControls ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-[#142F3F] text-xs font-mono-tech">
          {/* Altitude Slider */}
          <div className="bg-[#08151F] p-2.5 rounded border border-[#142F3F] flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-[#8BA3B3]">
              <span className="flex items-center gap-1">
                <ArrowUp className="w-3.5 h-3.5 text-[#1AD1F5]" />
                PRESSURE ALTITUDE
              </span>
              <span className="text-[#E6F4FF] font-bold font-mono-tech">{mission.altitudeFt.toLocaleString()} FT</span>
            </div>
            <input
              type="range"
              min="1000"
              max="28000"
              step="500"
              value={mission.altitudeFt}
              onChange={(e) => updateMissionParams({ altitudeFt: Number(e.target.value) })}
              className="w-full accent-[#1AD1F5] cursor-pointer h-1 bg-[#142F3F] rounded"
            />
            <div className="flex justify-between text-[9px] text-[#526E7E]">
              <span>MSL: 1,000 FT</span>
              <span>CEILING: 28,000 FT</span>
            </div>
          </div>

          {/* Engine Load Slider */}
          <div className="bg-[#08151F] p-2.5 rounded border border-[#142F3F] flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-[#8BA3B3]">
              <span className="flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-[#FFB834]" />
                PROPULSION LOAD
              </span>
              <span className="text-[#E6F4FF] font-bold font-mono-tech">{mission.engineLoadPct}%</span>
            </div>
            <input
              type="range"
              min="40"
              max="100"
              step="1"
              value={mission.engineLoadPct}
              onChange={(e) => updateMissionParams({ engineLoadPct: Number(e.target.value) })}
              className="w-full accent-[#FFB834] cursor-pointer h-1 bg-[#142F3F] rounded"
            />
            <div className="flex justify-between text-[9px] text-[#526E7E]">
              <span>LOITER: 40%</span>
              <span>MAX POWER: 100%</span>
            </div>
          </div>

          {/* Ambient Temperature Slider */}
          <div className="bg-[#08151F] p-2.5 rounded border border-[#142F3F] flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-[#8BA3B3]">
              <span className="flex items-center gap-1">
                <Wind className="w-3.5 h-3.5 text-[#1AD1F5]" />
                OUTSIDE AIR TEMP (OAT)
              </span>
              <span className="text-[#E6F4FF] font-bold font-mono-tech">{mission.ambientTempC}°C (ISA+16)</span>
            </div>
            <input
              type="range"
              min="-20"
              max="50"
              step="1"
              value={mission.ambientTempC}
              onChange={(e) => updateMissionParams({ ambientTempC: Number(e.target.value) })}
              className="w-full accent-[#1AD1F5] cursor-pointer h-1 bg-[#142F3F] rounded"
            />
            <div className="flex justify-between text-[9px] text-[#526E7E]">
              <span>ARCTIC: -20°C</span>
              <span>TROPICAL HOT-DAY: +50°C</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 text-xs font-mono-tech text-[#8BA3B3]">
          <div>ALTITUDE: <span className="text-[#E6F4FF] font-bold">{mission.altitudeFt.toLocaleString()} ft</span></div>
          <div>ENGINE LOAD: <span className="text-[#E6F4FF] font-bold">{mission.engineLoadPct}%</span></div>
          <div>OAT: <span className="text-[#E6F4FF] font-bold">{mission.ambientTempC}°C</span></div>
          <div>MISSION CONFIDENCE: <span className="text-[#3CE698] font-bold">{mission.predictedReliability}%</span></div>
        </div>
      )}
    </div>
  );
};
