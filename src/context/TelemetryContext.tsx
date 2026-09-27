import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { 
  EngineTelemetry, 
  TelemetryHistoryPoint, 
  SimulationScenario, 
  MissionState, 
  FaultItem,
  MissionPhase 
} from '../types';

interface TelemetryContextType {
  telemetry: EngineTelemetry;
  history: TelemetryHistoryPoint[];
  isPaused: boolean;
  scenario: SimulationScenario;
  mission: MissionState;
  faults: FaultItem[];
  togglePause: () => void;
  resetSimulation: () => void;
  setScenario: (scenario: SimulationScenario) => void;
  updateMissionParams: (params: Partial<Pick<MissionState, 'altitudeFt' | 'engineLoadPct' | 'ambientTempC' | 'phase'>>) => void;
  isSimModalOpen: boolean;
  setIsSimModalOpen: (open: boolean) => void;
}

const BASELINE_TELEMETRY: EngineTelemetry = {
  rpm: 2450,
  map: 1.42,
  cht: 148,
  egt: 712,
  oilPressure: 4.2,
  oilTemp: 92,
  fuelPressure: 3.8,
  boostPressure: 1.42,
  vibration: 2.1,
  health: 95.2,
  anomalyProbability: 12,
  failureProbability: 4,
  rulHours: 426,
  missionReliability: 95.2,
  syncAccuracy: 98.7,
  timestamp: Date.now(),
};

const BASELINE_MISSION: MissionState = {
  uavId: 'UAV-ALPHA-07',
  missionCode: 'RECON-SURVEILLANCE-4B',
  engineId: 'VRDE-180-01',
  altitudeFt: 18000,
  engineLoadPct: 72,
  ambientTempC: 31,
  phase: 'CRUISE',
  elapsedTimeMin: 142,
  targetDurationMin: 360,
  missionReliability: 95.2,
  predictedReliability: 93.7,
  rulHours: 426,
  riskLevel: 'LOW',
};

const INITIAL_FAULTS: FaultItem[] = [
  {
    id: 'FLT-1021',
    title: 'EGT Trend Slight Elevation',
    subsystem: 'Combustion',
    probability: 18,
    severity: 'warning',
    trend: 'rising',
    timestamp: '10:21:14',
    description: 'Combustion cylinder #3 thermocouple indicates a +8°C drift relative to twin nominal baseline.',
    recommendation: 'Monitor combustion efficiency & injector balance during loiter phase.',
    sensorCorrelation: ['EGT', 'CHT', 'RPM'],
  },
  {
    id: 'FLT-0947',
    title: 'Vibration Waveform Transient',
    subsystem: 'Structural / Vibration',
    probability: 8,
    severity: 'healthy',
    trend: 'stable',
    timestamp: '09:47:02',
    description: 'Transient high-frequency harmonic normalized after throttle transition.',
    recommendation: 'Bearing frequency envelope confirmed within permissible limits.',
    sensorCorrelation: ['Vibration', 'RPM'],
  },
  {
    id: 'FLT-0932',
    title: 'Oil Scavenge Pressure Stability',
    subsystem: 'Lubrication',
    probability: 5,
    severity: 'healthy',
    trend: 'stable',
    timestamp: '09:32:45',
    description: 'Oil circuit pressure maintained across thermal gradient (4.2 bar @ 92°C).',
    recommendation: 'Nominal viscosity index verified.',
    sensorCorrelation: ['Oil Pressure', 'Oil Temp'],
  },
  {
    id: 'FLT-0855',
    title: 'Turbocharger Boost Dynamic Check',
    subsystem: 'Induction & Turbo',
    probability: 7,
    severity: 'healthy',
    trend: 'stable',
    timestamp: '08:55:18',
    description: 'Compressor PR (Pressure Ratio) tracks command curve within ±1.2%.',
    recommendation: 'Wastegate actuator telemetry verified responsive.',
    sensorCorrelation: ['MAP', 'Boost Pressure'],
  },
];

const TelemetryContext = createContext<TelemetryContextType | undefined>(undefined);

// Helper to format HH:MM:SS
function formatTime(timestamp: number): string {
  const d = new Date(timestamp);
  return d.toTimeString().split(' ')[0];
}

export const TelemetryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [telemetry, setTelemetry] = useState<EngineTelemetry>(BASELINE_TELEMETRY);
  const [history, setHistory] = useState<TelemetryHistoryPoint[]>(() => {
    // Pre-populate 30 historical points
    const now = Date.now();
    const points: TelemetryHistoryPoint[] = [];
    for (let i = 29; i >= 0; i--) {
      const t = now - i * 2000;
      const noise = (Math.sin(i * 0.4) * 0.6);
      points.push({
        timeStr: formatTime(t),
        timestamp: t,
        rpm: Math.round(2450 + Math.sin(i * 0.3) * 12 + noise * 5),
        egt: Math.round(712 + Math.cos(i * 0.25) * 3 + noise * 2),
        cht: Math.round(148 + Math.sin(i * 0.2) * 1.5),
        oilPressure: Number((4.2 + Math.cos(i * 0.3) * 0.05).toFixed(2)),
        fuelPressure: Number((3.8 + Math.sin(i * 0.3) * 0.04).toFixed(2)),
        boostPressure: Number((1.42 + Math.sin(i * 0.2) * 0.02).toFixed(2)),
        vibration: Number((2.1 + Math.sin(i * 0.4) * 0.08).toFixed(2)),
        health: 95.2,
        anomalyRisk: 12,
      });
    }
    return points;
  });

  const [isPaused, setIsPaused] = useState(false);
  const [scenario, setScenario] = useState<SimulationScenario>('nominal');
  const [mission, setMission] = useState<MissionState>(BASELINE_MISSION);
  const [faults, setFaults] = useState<FaultItem[]>(INITIAL_FAULTS);
  const [isSimModalOpen, setIsSimModalOpen] = useState(false);

  const tickRef = useRef(0);

  const togglePause = useCallback(() => {
    setIsPaused((prev) => !prev);
  }, []);

  const resetSimulation = useCallback(() => {
    setTelemetry({ ...BASELINE_TELEMETRY, timestamp: Date.now() });
    setScenario('nominal');
    setMission(BASELINE_MISSION);
    setFaults(INITIAL_FAULTS);
  }, []);

  const updateMissionParams = useCallback((params: Partial<Pick<MissionState, 'altitudeFt' | 'engineLoadPct' | 'ambientTempC' | 'phase'>>) => {
    setMission((prev) => {
      const updated = { ...prev, ...params };
      // Recalculate mission reliability impact dynamically based on environmental stress factors
      const altStress = Math.max(0, (updated.altitudeFt - 15000) / 10000) * 1.8;
      const loadStress = Math.max(0, (updated.engineLoadPct - 70) / 30) * 2.2;
      const tempStress = Math.max(0, (updated.ambientTempC - 25) / 20) * 1.5;
      const phaseFactor = updated.phase === 'CLIMB' ? 1.4 : updated.phase === 'TAKEOFF' ? 1.2 : 0;

      const totalPen = altStress + loadStress + tempStress + phaseFactor;
      const newReliability = Number(Math.max(82, 96.5 - totalPen).toFixed(1));
      const newPred = Number(Math.max(80, newReliability - 1.5).toFixed(1));
      const risk: 'LOW' | 'MODERATE' | 'HIGH' = newReliability > 92 ? 'LOW' : newReliability > 85 ? 'MODERATE' : 'HIGH';

      return {
        ...updated,
        missionReliability: newReliability,
        predictedReliability: newPred,
        riskLevel: risk,
      };
    });
  }, []);

  // Main simulation tick loop (every 1.2 seconds)
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      tickRef.current += 1;
      const t = tickRef.current;
      const now = Date.now();

      // Micro-fluctuations (smooth organic walk)
      const rpmJitter = Math.round(Math.sin(t * 0.45) * 8 + Math.cos(t * 0.2) * 5 + (Math.random() - 0.5) * 4);
      const egtJitter = Math.round(Math.cos(t * 0.3) * 2.5 + (Math.random() - 0.5) * 1.8);
      const chtJitter = Number((Math.sin(t * 0.15) * 0.6 + (Math.random() - 0.5) * 0.3).toFixed(1));
      const oilJitter = Number(((Math.random() - 0.5) * 0.04).toFixed(2));
      const fuelJitter = Number(((Math.random() - 0.5) * 0.03).toFixed(2));
      const vibJitter = Number((Math.sin(t * 0.6) * 0.06 + (Math.random() - 0.5) * 0.04).toFixed(2));

      setTelemetry((prev) => {
        let baseRpm = 2450;
        let baseEgt = 712;
        let baseCht = 148;
        let baseOil = 4.2;
        let baseFuel = 3.8;
        let baseBoost = 1.42;
        let baseVib = 2.1;
        let baseHealth = 95.2;
        let baseAnomaly = 12;
        let baseFail = 4;
        let baseRul = 426;

        // Scenario offsets
        if (scenario === 'egt_drift') {
          baseEgt += 32; // Rising EGT combustion anomaly
          baseHealth -= 3.4;
          baseAnomaly = 34;
          baseFail = 9;
          baseRul = 388;
        } else if (scenario === 'vib_transient') {
          baseVib += 1.25; // Elevated vibration harmonic
          baseHealth -= 2.1;
          baseAnomaly = 28;
          baseFail = 7;
        } else if (scenario === 'oil_pressure_drop') {
          baseOil -= 0.85; // Low oil pressure
          baseHealth -= 5.5;
          baseAnomaly = 41;
          baseFail = 14;
          baseRul = 354;
        }

        const newRpm = baseRpm + rpmJitter;
        const newEgt = baseEgt + egtJitter;
        const newCht = Number((baseCht + chtJitter).toFixed(1));
        const newOil = Number(Math.max(2.5, baseOil + oilJitter).toFixed(2));
        const newFuel = Number((baseFuel + fuelJitter).toFixed(2));
        const newBoost = Number((baseBoost + (rpmJitter / 2450) * 0.03).toFixed(2));
        const newVib = Number(Math.max(1.5, baseVib + vibJitter).toFixed(2));
        const newHealth = Number((baseHealth + (Math.random() - 0.5) * 0.1).toFixed(1));
        const newSync = Number((98.7 + (Math.sin(t * 0.1) * 0.2)).toFixed(1));

        const nextPoint: TelemetryHistoryPoint = {
          timeStr: formatTime(now),
          timestamp: now,
          rpm: newRpm,
          egt: newEgt,
          cht: newCht,
          oilPressure: newOil,
          fuelPressure: newFuel,
          boostPressure: newBoost,
          vibration: newVib,
          health: newHealth,
          anomalyRisk: baseAnomaly,
        };

        setHistory((h) => [...h.slice(-59), nextPoint]);

        return {
          rpm: newRpm,
          map: newBoost,
          cht: newCht,
          egt: newEgt,
          oilPressure: newOil,
          oilTemp: 92 + Math.round(Math.sin(t * 0.1) * 2),
          fuelPressure: newFuel,
          boostPressure: newBoost,
          vibration: newVib,
          health: newHealth,
          anomalyProbability: baseAnomaly,
          failureProbability: baseFail,
          rulHours: baseRul,
          missionReliability: Number((mission.missionReliability).toFixed(1)),
          syncAccuracy: newSync,
          timestamp: now,
        };
      });
    }, 1200);

    return () => clearInterval(interval);
  }, [isPaused, scenario, mission.missionReliability]);

  return (
    <TelemetryContext.Provider
      value={{
        telemetry,
        history,
        isPaused,
        scenario,
        mission,
        faults,
        togglePause,
        resetSimulation,
        setScenario,
        updateMissionParams,
        isSimModalOpen,
        setIsSimModalOpen,
      }}
    >
      {children}
    </TelemetryContext.Provider>
  );
};

export const useTelemetry = (): TelemetryContextType => {
  const context = useContext(TelemetryContext);
  if (!context) {
    throw new Error('useTelemetry must be used within a TelemetryProvider');
  }
  return context;
};
